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
            searchNo="物料编码"
            searchName="物料名称"
            @getList="getList"
            @resetEvent="resetTable"
          />
          <ExTable
            :columns="matColumns"
            :buttons="buttons"
            :gridOptions="GridOptions"
            ref="tableRef"
            @addEvent="addTableEvent"
            @editEvent="editTableEvent"
            @deleteRowEvent="deleteRowTableEvent"
            @delBatchEvent="deleteMatBatchEvent"
            @auditRowEvent="auditRowEvent"
            @auditBatchEvent="auditBatchEvent"
            @unAuditRowEvent="unAuditRowEvent"
            @unAuditBatchEvent="unAuditBatchEvent"
            @exportTable="exportTable"
            @importModelEvent="importModelEvent"
            @refreshTable="refreshTable"
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
      </pane>
    </a-splitpanes>
  </div>
</template>

<script setup lang="ts" name="basic-material-index">
  import { ExTree } from '/@/components/ExTree';
  import { ExTable } from '/@/components/ExTable';
  import { Search } from '/@/components/Search';
  import { onActivated, onMounted, reactive, ref } from 'vue';
  import { Pager, VxePagerEvents } from 'vxe-table';
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
    importModel,
    getMatOption,
  } from '/@/api/matTable';
  import { Pane, Splitpanes } from 'splitpanes';
  import 'splitpanes/dist/splitpanes.css';
  import { TreeItem } from '/@/components/Tree';
  import { cloneDeep } from 'lodash-es';
  import { gridOptions, matColumns } from '/@/components/ExTable/data';
  import { SearchParams } from '/@/api/apiLink';
  import { OptGroupHook, OptTableHook } from '/@/api/utilHook';
  import { PageEnum } from '/@/enums/pageEnum';
  import { useGo } from '/@/hooks/web/usePage';

  const go = useGo();
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
  //空参数
  const paramsNull = { params: '' };
  //分组数据
  let treeData = ref<TreeItem[]>([]);
  // const groupId = ref(['']);
  // const groupName = ref('');
  //加载分组
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
  let getParams: SearchParams[] = [];
  const tablePagerChange: VxePagerEvents.PageChange = async ({ currentPage, pageSize }) => {
    pages.currentPage = currentPage;
    pages.pageSize = pageSize;
    await getList(currentPage);
  };
  //获取高级查询字段数据
  const getOptions = async () => {
    const moreSearchData = await getMatOption(paramsNull);
    searchRef.value.getOptions(moreSearchData);
  };
  getOptions();
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

  //重置
  const resetTable = () => {
    treeRef.value.setSelectedKeys([]);
    searchRef.value.formState.wlNo = null;
    searchRef.value.formState.wlName = null;
    getList(1);
  };

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

  //添加
  const addTableEvent = () => {
    let groupId = treeRef.value.getSelectedKeys();
    go({
      path: PageEnum.MATERIAL_ADD_AND_EDIT,
      query: {
        groupId: groupId == '' ? '' : groupId,
      },
    });
    console.log('添加:', groupId);
  };
  //编辑
  const editTableEvent = (row) => {
    go({
      path: PageEnum.MATERIAL_ADD_AND_EDIT,
      query: {
        row: row.id,
      },
    });
    console.log('编辑:', row.id);
  };
  //删除表格单条数据
  const deleteRowTableEvent = async (row) => {
    await delMatTableById({ params: row.id });
    await getList();
  };
  //批量删除表格
  const delTableEvent = (row) => {
    tableRef.value.delTable(row);
  };
  const deleteMatBatchEvent = async (row) => {
    await delMatTableBatch({ params: row });
    await getList();
  };
  //审核单条
  const auditRowEvent = async (row) => {
    await auditMatTable({
      params: {
        id: row.id,
      },
    });
    await getList();
  };

  //审核事件
  const auditEvent = (row) => {
    tableRef.value.auditTable(row);
  };
  let res: any = '';
  const auditBatchEvent = async (row) => {
    res = await auditMatTableBatch({
      params: row,
    });
    await tableRef.value.computeData(res);
    await getList();
  };
  //单条反审核
  const unAuditRowEvent = async (row: any) => {
    await unAuditMatTable({
      params: {
        id: row?.id,
      },
    });
    await getList();
  };
  //批量反审核
  const unAuditEvent = (row) => {
    tableRef.value.unAuditTable(row);
  };
  const unAuditBatchEvent = async (row) => {
    res = await unAuditMatTableBatch({
      params: row,
    });
    await tableRef.value.computeData(res);
    await getList();
  };
  //下载模板
  const importModelEvent = async () => {
    OptTableHook.importModel = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        importModel({
          params: '导入模板',
        })
          .then((res) => {
            const data = { title: '物料信息导入模板.xls', data: res };
            resolve(data);
          })
          .catch((e) => {
            reject(e);
          });
      });
    };
  };
  //导出
  const exportTable = async () => {
    OptTableHook.exportExcel = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        exportTableList({
          params: {
            list: getParams,
            fileName: '物料列表',
          },
          pageIndex: 1,
          pageRows: pages.pageSize,
        })
          .then((res) => {
            const data = { title: '物料列表信息.xls', data: res };
            resolve(data);
          })
          .catch((e) => {
            reject(e);
          });
      });
    };
  };
  //导入文件刷新
  const refreshTable = () => {
    getList();
  };

  onMounted(() => {
    paneSize.value = cloneDeep(installPaneSize.value);
    refreshTree();
    getList();
  });
  //被keep-alive 缓存的组件激活时调用
  onActivated(() => {
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
