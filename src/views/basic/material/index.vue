<template>
  <div style="height: 100%">
    <AModal
      :visible="visibleGroupModal"
      title="物料分组"
      :maskClosable="false"
      :cancelText="false"
      :closable="false"
    >
      <div>
        <Form
          ref="formRef"
          :model="groupFormData"
          :rules="groupRules"
          :labelCol="{ span: 6 }"
          :wrapper-col="{ span: 14 }"
        >
          <FormItem label="上级分组:">
            <Input disabled :value="groupFormData.parent.name" autocomplete="off" required />
          </FormItem>
          <FormItem label="编码:" name="number" ref="number">
            <Input v-model:value="groupFormData.number" autocomplete="off" required />
          </FormItem>
          <FormItem label="名称:" name="name" ref="name">
            <Input v-model:value="groupFormData.name" autocomplete="off" />
          </FormItem>
        </Form>
      </div>
      <template #footer>
        <a-button key="submit" type="primary" :loading="false" @click="submitGroup">提交</a-button>
        <a-button :loading="false" @click="cancelGroup">取消</a-button>
      </template>
    </AModal>
    <AModal
      :visible="visibleDeleteGroupModal"
      title="删除物料分组"
      :maskClosable="false"
      :cancelText="false"
      :closable="false"
    >
      <div style="width: 100%">
        <div style="width: 20%; margin: auto">是否删除？</div>
      </div>
      <template #footer>
        <a-button key="submit" type="primary" :loading="false" @click="okDeleteGroup"
          >提交</a-button
        >
        <a-button :loading="false" @click="cancelDeleteGroup">取消</a-button>
      </template>
    </AModal>
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
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { Tag } from 'ant-design-vue';
  import { ExTree } from '/@/components/ExTree';
  import { ExTable } from '/@/components/ExTable';
  import { Search } from '/@/components/Search';
  import { onActivated, onMounted, reactive, ref, UnwrapRef } from 'vue';
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
  import { Button, Form, FormItem, Input, Modal } from 'ant-design-vue';
  import { Pane, Splitpanes } from 'splitpanes';
  import 'splitpanes/dist/splitpanes.css';
  import { TreeItem } from '/@/components/Tree';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { gridOptions, matColumns } from '/@/components/ExTable/data';
  import { SearchParams } from '/@/api/apiLink';

  const { createMessage } = useMessage();
  const AModal = Modal;
  const AButton = Button;
  const ASplitpanes = Splitpanes;
  const GridOptions = gridOptions;
  const visibleGroupModal = ref<boolean>(false);
  const visibleDeleteGroupModal = ref<boolean>(false);
  const paneSize = ref<number>(18);
  const installPaneSize = ref<number>(18);
  const formRef = ref();
  //表格事件
  const tableRef: any = ref<String | null>(null);
  //查询组件
  const searchRef: any = ref<String | null>(null);
  //物料分组组件
  const treeRef: any = ref<String | null>(null);
  //树信息
  interface GroupFormData {
    id?: string;
    name?: string;
    number?: string;
    parent?: any;
  }
  const groupFormData: UnwrapRef<GroupFormData> = reactive({
    id: '0',
    name: '',
    number: '',
    parent: () => {
      return {
        id: '0',
        name: '',
        number: '',
      };
    },
  });
  const resetGroupFormData = () => {
    groupFormData.id = '0';
    groupFormData.number = '';
    groupFormData.name = '';
    groupFormData.parent = {
      id: '0',
      name: '',
      number: '',
    };
  };
  const groupRules = reactive({
    name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
    number: [{ required: true, message: '请输入编码', trigger: 'blur' }],
  });
  let treeData = ref<TreeItem[]>([]);
  const enum GroupEvent {
    ADD = 1,
    EDIT = 2,
    DELETE = 3,
    ADD_SUB = 4,
  }
  const refreshTree = async () => {
    const tree = await treeMatGroup({ params: '0' });
    runTree(tree);
    console.log('tree', tree);
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
    showGroupModal(GroupEvent.ADD, {});
  };
  //编辑分组
  const editGroupEvent = (node: TreeItem) => {
    showGroupModal(GroupEvent.EDIT, node);
  };
  //新增下级分组
  const addGroupSubEvent = (node: TreeItem) => {
    showGroupModal(GroupEvent.ADD_SUB, node);
  };
  //删除分组
  const deleteGroupEvent = (node: TreeItem) => {
    visibleDeleteGroupModal.value = true;
    optGroupCallBack = async () => {
      await deleteMatGroup({ params: node.key ? node.key.toString() : '' });
      visibleDeleteGroupModal.value = false;
      await refreshTree();
    };
  };

  //选择分组
  const selectGroupEvent = (selectedKeys: string[], data: any) => {
    getList();
  };
  //分组提交回调
  let optGroupCallBack = () => {};
  const showGroupModal = async (event: GroupEvent, node: TreeItem) => {
    switch (event) {
      case GroupEvent.ADD:
        visibleGroupModal.value = true;
        resetGroupFormData();
        optGroupCallBack = async () => {
          await addMatGroup({ params: { number: groupFormData.number, name: groupFormData.name } });
          await refreshTree();
          visibleGroupModal.value = false;
        };
        break;
      case GroupEvent.EDIT:
        visibleGroupModal.value = true;
        const result = await queryOneMatGroup({ params: node.key?.toString() || '0' });
        if (result) {
          groupFormData.number = result.number;
          groupFormData.name = result.name;
          groupFormData.id = result.id;
          groupFormData.parent = { id: result.id, name: result.name };
        }
        optGroupCallBack = async () => {
          await editMatGroup({
            params: {
              id: node.key?.toString() || '0',
              number: groupFormData.number,
              name: groupFormData.name,
            },
          });
          await refreshTree();
          visibleGroupModal.value = false;
        };
        break;
      case GroupEvent.ADD_SUB:
        visibleGroupModal.value = true;
        resetGroupFormData();
        groupFormData.parent = { id: node.key, name: node.title };
        optGroupCallBack = async () => {
          await addMatGroup({
            params: {
              parentId: node.key?.toString() || '0',
              number: groupFormData.number,
              name: groupFormData.name,
            },
          });
          await refreshTree();
          visibleGroupModal.value = false;
        };
        break;
      case GroupEvent.DELETE:
        break;
    }
  };
  const submitGroup = () => {
    formRef.value
      .validate()
      .then(() => {
        console.log('通过');
        optGroupCallBack();
      })
      .catch((error: ValidateErrorEntity<FormData>) => {
        createMessage.error('数据校检不通过，请检查!');
        console.log(error);
      });
  };
  const okDeleteGroup = async () => {
    optGroupCallBack();
  };
  const cancelGroup = () => {
    visibleGroupModal.value = false;
  };
  const cancelDeleteGroup = () => {
    visibleDeleteGroupModal.value = false;
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

  onActivated(() => {
    //页面缓存
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
