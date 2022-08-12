<template>
  <div style="height: 100%">
    <a-splitpanes class="default-theme" style="padding: 15px; height: 100%">
      <pane :size="paneSize">
        <ex-tree
          :toolbar="true"
          :search="true"
          :tree-data="treeData"
          ref="treeRef"
          title="物料分组"
          @editEvent="editGroupEvent"
          @addEvent="addGroupEvent"
          @addSubEvent="addGroupSubEvent"
          @deleteEvent="deleteGroupEvent"
          @selectEvent="selectGroupEvent"
        />
      </pane>
      <pane :size="100 - paneSize">
        <div style="background-color: #fff; height: 100%">
          <Search
            ref="searchRef"
            tableName="BdMaterial"
            @getList="getList"
            @resetEvent="resetTable"
          />
          <ExTable
            :columns="matColumns"
            :buttons="buttons"
            :gridOptions="GridOptions"
            :treeSelectData="treeSelectData"
            ref="tableRef"
            @expTable="expTable"
            @getList="getList"
            @delMatOneEvent="delMatOneEvent"
            @delMatBatchEvent="delMatBatchEvent"
            @auditRowEvent="auditRowEvent"
            @auditBatchEvent="auditBatchEvent"
            @unAuditRowEvent="unAuditRowEvent"
            @unAuditBatchEvent="unAuditBatchEvent"
          />
          <div>
            <Pager
              background
              v-model:current-page="pages.currentPage"
              v-model:page-size="pages.pageSize"
              :total="pages.total"
              :layouts="[
                'PrevJump',
                'PrevPage',
                'JumpNumber',
                'NextPage',
                'NextJump',
                'Sizes',
                'FullJump',
                'Total',
              ]"
              @page-change="tablePagerChange"
              style="width: calc(100% - 5px); height: 42px; margin: 4px"
            />
          </div>
        </div>
        <AModal
          v-model:visible="auditModal"
          title="操作结果"
          :footer="null"
          width="800px"
          @cancel="closeRes"
        >
          <div v-if="isAudit"
            >审核完成，共{{ adResult.data.length }}条数据，成功{{ resY }}条，失败{{ resF }}条。</div
          >
          <div v-if="unAudit"
            >反审核完成，共{{ adResult.data.length }}条数据，成功{{ resY }}条，失败{{
              resF
            }}条。</div
          >
          <vxe-table
            border
            show-overflow
            :row-style="rowStyle"
            :row-config="{ isHover: true }"
            :data="adResult.data"
          >
            <vxe-column type="seq" title="序号" width="60" />
            <vxe-column field="info.title" title="关键字" width="180" />
            <vxe-column field="info.status" title="状态" width="80">
              <template #default="{ row }">
                <Tag
                  :color="row.info.status === 'Y' ? 'success' : 'error'"
                  v-if="row.info.status"
                  >{{ row.info.status === 'Y' ? '成功' : '失败' }}</Tag
                >
              </template>
            </vxe-column>
            <vxe-column field="info.msg" title="信息" />
            <vxe-column field="info.type" title="信息类型" width="80" />
          </vxe-table>
          <vxe-pager
            background
            :total="adResult.data.length"
            :layouts="[
              'PrevJump',
              'PrevPage',
              'JumpNumber',
              'NextPage',
              'NextJump',
              'Sizes',
              'FullJump',
              'Total',
            ]"
          />
        </AModal>
      </pane>
    </a-splitpanes>
  </div>
</template>

<script setup lang="ts" name="basic-material-index">
  import { Tag } from 'ant-design-vue';
  import { ExTree } from '/@/components/ExTree';
  import { ExTable } from '/@/components/ExTable';
  import { Search } from '/@/components/Search';
  import { onMounted, reactive, ref } from 'vue';
  import { Pager, VxePagerEvents, VxeTablePropTypes } from 'vxe-table';
  import {
    addMatGroup,
    deleteMatGroup,
    editMatGroup,
    MatGroupEntity,
    queryOneMatGroup,
    treeMatGroup,
  } from '/@/api/matGroup';
  import {
    auditMatTableBatch,
    unAuditMatTableBatch,
    delMatTableBatch,
    delMatTableById,
    getMatTable,
    auditMatTable,
    unAuditMatTable,
    exportTableList,
  } from '/@/api/matTable';
  import { Modal } from 'ant-design-vue';
  import { Pane, Splitpanes } from 'splitpanes';
  import 'splitpanes/dist/splitpanes.css';
  import { TreeItem } from '/@/components/Tree';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { gridOptions, matColumns } from '/@/components/ExTable/data';
  import { SearchParams } from '/@/api/apiLink';
  import { OptGroupHook } from '/@/api/utilHook';

  const { createMessage } = useMessage();
  const AModal = Modal;
  const ASplitpanes = Splitpanes;
  const GridOptions = gridOptions;
  const paneSize = ref<number>(16);
  const installPaneSize = ref<number>(16);
  //表格事件
  const tableRef: any = ref<String | null>(null);
  //查询组件
  const searchRef: any = ref<String | null>(null);
  //物料分组组件
  const treeRef: any = ref<String | null>(null);

  let treeData = ref<TreeItem[]>([]);
  const refreshTree = async () => {
    const tree = await treeMatGroup({ params: '0' });
    runTree(tree);
    treeData.value = tree;
  };
  const runTree = (tree: MatGroupEntity[]) => {
    tree.forEach((item) => {
      item.title = item.name;
      item.key = item.id;
      runTree(item.children || []);
    });
  };
  //新增分组
  const addGroupEvent = () => {
    treeRef.value.resetGroupFormData();
    OptGroupHook.submitGroup = async () => {
      await addMatGroup({
        params: {
          number: treeRef.value.groupFormData.number,
          name: treeRef.value.groupFormData.name,
        },
      });
      await refreshTree();
    };
  };
  //编辑分组
  const editGroupEvent = async (node: TreeItem) => {
    const result = await queryOneMatGroup({ params: node.key?.toString() || '0' });
    if (result) {
      treeRef.value.groupFormData.number = result.number;
      treeRef.value.groupFormData.name = result.name;
      treeRef.value.groupFormData.id = result.id;
      treeRef.value.groupFormData.parent = { id: result.id, name: result.name };
    }
    OptGroupHook.submitGroup = async () => {
      await editMatGroup({
        params: {
          id: node.key?.toString() || '0',
          number: treeRef.value.groupFormData.number,
          name: treeRef.value.groupFormData.name,
        },
      });
      await refreshTree();
    };
  };
  //新增下级分组
  const addGroupSubEvent = (node: TreeItem) => {
    treeRef.value.resetGroupFormData();
    treeRef.value.groupFormData.parent = { id: node.key, name: node.title };
    OptGroupHook.submitGroup = async () => {
      await addMatGroup({
        params: {
          parentId: node.key?.toString() || '0',
          number: treeRef.value.groupFormData.number,
          name: treeRef.value.groupFormData.name,
        },
      });
      await refreshTree();
    };
  };
  //删除分组
  const deleteGroupEvent = (node: TreeItem) => {
    OptGroupHook.submitGroup = async () => {
      await deleteMatGroup({ params: node.key ? node.key.toString() : '' });
      await refreshTree();
    };
  };

  //选择分组
  const selectGroupEvent = (selectedKeys: string[], data: any) => {
    getList();
  };

  //分页信息
  const pages = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
  });
  // let wlNo = null;
  // let wlName = null;
  let getParams: SearchParams[] = [];
  const tablePagerChange: VxePagerEvents.PageChange = async ({ currentPage, pageSize }) => {
    pages.currentPage = currentPage;
    pages.pageSize = pageSize;
    await getList(currentPage);
  };
  //表格查询
  const getList = async (currPage = 1, pageSize = pages.pageSize) => {
    getParams = [];
    if (treeRef.value.getSearchParams() && treeRef.value.getSearchParams().length > 0) {
      getParams = getParams.concat(treeRef.value.getSearchParams());
    }
    if (searchRef.value.getSearchParams() && searchRef.value.getSearchParams().length > 0) {
      getParams = getParams.concat(searchRef.value.getSearchParams());
    }
    //表格查询
    const res: any = await getMatTable({
      params: getParams,
      orderByBean: {
        descList: ['BdMaterial.update_time'],
      },
      pageIndex: currPage,
      pageRows: pageSize,
    });
    pages.total = res.total;
    pages.currentPage = currPage;
    let data = res.records;
    tableRef.value.init(data);
    searchRef.value.moreSearchClose();
  };
  //空参数
  // const np = { params: '' };
  //重置
  const resetTable = () => {
    // console.log(treeRef.value.basicTree);
    treeRef.value.setSelectedKeys([]);
    searchRef.value.formState.wlNo = null;
    searchRef.value.formState.wlName = null;
    getList(1);
  };
  // //获取基本单位字段
  // const getTableUnit = async () => {
  //   try {
  //     let data = await getMatTableUnit(np);
  //     let arr = [] as any;
  //     arr = cloneDeep(data);
  //     arr = arr.filter((e) => e.fieldName != 'bs_status');
  //     searchRef.value.init(arr);
  //     console.log('高级查询基本单位字段', arr);
  //   } catch (e) {
  //     console.log('高级查询获取基本单位字段失败', e);
  //   }
  // };
  // getTableUnit();
  //按钮
  const buttons = [
    {
      type: 'primary',
      label: '添加',
      onClick: () => {
        addTableEvent();
      },
    },
    {
      type: 'primary',
      label: '审核',
      onClick: (row) => {
        auditEvent(row);
      },
    },
    {
      type: 'default',
      label: '反审核',
      onClick: (row) => {
        unAuditEvent(row);
      },
    },
    {
      type: 'danger',
      label: '批量删除',
      onClick: (row) => {
        delTableEvent(row);
      },
    },
  ];
  let treeSelectData = null;
  //新增表格数据
  const addTableEvent = () => {
    tableRef.value.addTable();
    console.log('treeSelectData:', treeSelectData);
  };
  //删除表格单条数据
  const delMatOneEvent = async (row) => {
    try {
      await delMatTableById({
        params: row.id,
      });
    } catch (e) {
      console.log('删除1失败', e);
    }
  };
  //批量删除表格
  const delTableEvent = (row) => {
    tableRef.value.delTable(row);
  };
  const delMatBatchEvent = async (row) => {
    console.log('nnn', row);
    try {
      await delMatTableBatch({
        params: row,
      });
    } catch (e) {
      console.log('删除n失败', e);
    }
  };
  //审核单条
  const auditRowEvent = async (row) => {
    try {
      await auditMatTable({
        params: {
          id: row.id,
        },
      });
    } catch (e) {
      console.log('审核1失败');
    }
  };
  //批量审核表格
  const isAudit = ref(false);
  const unAudit = ref(false);
  let adResult = reactive({ data: {} });
  const auditModal = ref(false);
  const auditEvent = (row) => {
    tableRef.value.auditTable(row);
  };
  let resY = ref(0);
  let resF = ref(0);
  const auditBatchEvent = async (row) => {
    try {
      const res = await auditMatTableBatch({
        params: row,
      });
      if (res) {
        adResult.data = res;
        let arr = res;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].info.status == 'Y') {
            resY.value += 1;
          } else {
            resF.value += 1;
          }
        }
        auditModal.value = true;
        isAudit.value = true;
      }
    } catch (e) {
      console.log('审核n失败', e);
    }
  };
  //单条反审核
  const unAuditRowEvent = async (row) => {
    try {
      await unAuditMatTable({
        params: {
          id: row.id,
        },
      });
    } catch (e) {
      console.log('反审核1失败');
    }
  };
  //批量反审核
  const unAuditEvent = (row) => {
    tableRef.value.unAuditTable(row);
  };
  const unAuditBatchEvent = async (row) => {
    try {
      const res = await unAuditMatTableBatch({
        params: row,
      });
      if (res) {
        adResult.data = res;
        let arr = res;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].info.status == 'Y') {
            resY.value += 1;
          } else {
            resF.value += 1;
          }
        }
        auditModal.value = true;
        isAudit.value = true;
      }
    } catch (e) {
      console.log('审核n失败', e);
    }
  };
  //关闭审核/反审核结果的窗口
  const closeRes = () => {
    unAudit.value = false;
    isAudit.value = false;
    resY.value = 0;
    resF.value = 0;
  };
  //结果表格颜色
  const rowStyle: VxeTablePropTypes.RowStyle = ({ row }) => {
    if (row.info.status == 'F') {
      return {
        backgroundColor: '#f5f7fa',
        color: 'red',
      };
    }
  };

  //导出
  const expTable = async () => {
    const data = await exportTableList({
      params: {
        list: getParams,
        fileName: '物料列表',
      },
      pageIndex: 1,
      pageRows: pages.total,
    });
    if (!data) {
      createMessage.error('文件下载失败');
      return;
    }
    //“URL.createObjectURL()方法会根据传入的参数创建一个指向该参数对象的URL. 这个URL的生命仅存在于它被创建的这个文档里.
    let url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }));
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', '物料列表信息.xls');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); //下载完成移除元素
    window.URL.revokeObjectURL(url); //释放掉blob对象
  };

  onMounted(() => {
    paneSize.value = cloneDeep(installPaneSize.value);
    refreshTree();
    getList();
  });
</script>

<style scoped lang="less">
  :deep(.ant-card-body) {
    padding: inherit !important;
  }
  .tree-button {
    margin: auto;
    display: block;
  }
</style>
