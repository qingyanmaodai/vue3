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
          @deleteEvent="deleteEvent"
          @getTreeKey="getTreeKey"
          @getList="getList"
          @refreshTable="refreshTable"
          @selectTree="selectTree"
          @resetTable="resetTable"
        />
      </pane>
      <pane :size="100 - paneSize">
        <div style="background-color: #fff; height: 100%">
          <Search
            @getList="getList"
            @getTreeKey="getTreeKey"
            @getMoreKey="getMoreKey"
            @refreshTable="refreshTable"
            @getKeyword="getKeyword"
            @resetTable="resetTable"
            ref="searchRef"
          />
          <ExTable
            :columns="matColumns"
            :buttons="buttons"
            :gridOptions="AgridOptions"
            :treeSelectData="treeSelectData"
            ref="tableEvent"
            @getList="getList"
            @refreshTable="refreshTable"
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
              @page-change="getList"
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
  import { Pager, VxeTablePropTypes } from 'vxe-table';
  import {
    addMatGroup,
    deleteMatGroup,
    editMatGroup,
    MatGroupEntity,
    queryOneMatGroup,
    treeMatGroup,
  } from '/@/api/matgroup';
  import {
    auditMatTableBatch,
    unAuditMatTableBatch,
    delMatTableBatch,
    delMatTableById,
    getMatTable,
    getMatTableUnit,
    auditMatTable,
    unAuditMatTable,
  } from '/@/api/mattable';
  import { Button, Form, FormItem, Input, Modal } from 'ant-design-vue';
  import { Pane, Splitpanes } from 'splitpanes';
  import 'splitpanes/dist/splitpanes.css';
  import { TreeItem } from '/@/components/Tree';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { gridOptions, matColumns } from '/@/components/ExTable/data';
  import dayjs from 'dayjs';

  const { createMessage } = useMessage();
  const AModal = Modal;
  const AButton = Button;
  const ASplitpanes = Splitpanes;
  const AgridOptions = gridOptions;
  const visibleGroupModal = ref<boolean>(false);
  const visibleDeleteGroupModal = ref<boolean>(false);
  const paneSize = ref<number>(18);
  const installPaneSize = ref<number>(18);
  const formRef = ref();
  //表格事件
  const tableEvent: any = ref<String | null>(null);
  //查询条件
  const searchRef: any = ref<String | null>(null);
  //物料分组事件
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
  const deleteEvent = (node: TreeItem) => {
    visibleDeleteGroupModal.value = true;
    optGroupCallBack = async () => {
      await deleteMatGroup({ params: node.key ? node.key.toString() : '' });
      visibleDeleteGroupModal.value = false;
      await refreshTree();
    };
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
  //初始化表格参数
  const init = {
    table: 'BdMaterial',
    name: 'name',
    column: 'name',
    link: 'AND',
    rule: 'LIKE',
    type: 'string',
    val: '',
    startWith: '',
    endWith: '',
  };
  const refreshTable = async () => {
    console.log('重新加载');
    const res: any = await getMatTable({
      params: [init],
      orderByBean: {
        descList: ['BdMaterial.create_time'],
      },
      pageIndex: 1,
      pageRows: 10,
    });
    pages.currentPage = res.current;
    pages.total = res.total;
    pages.pageSize = res.size;
    console.log('getting', pages.currentPage, pages.total, pages.pageSize);
    let data = res.records;
    tableEvent.value.init(data);
  };
  //分页信息
  const pages = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
  });
  let wlNo = undefined;
  let wlName = undefined;
  let moreKeys: any = undefined;
  let selectedKeys = undefined;
  //从组件获取搜素关键字
  const getTreeKey = (selected) => {
    selectedKeys = selected;
  };
  const getKeyword = (num, name) => {
    wlNo = num;
    wlName = name;
  };
  const getMoreKey = (keys) => {
    moreKeys = keys;
    console.log(moreKeys, 'sasas');
  };
  //表格查询
  const getList = async () => {
    let getParams: any[] = [];
    if ('') {
      resetTable();
    }
    if (wlNo) {
      getParams.push({
        table: 'BdMaterial',
        name: 'number',
        column: 'number',
        link: 'AND',
        rule: 'EQ',
        type: 'string',
        val: wlNo,
        startWith: '',
        endWith: '',
      });
    }
    if (wlName) {
      getParams.push({
        table: 'BdMaterial',
        name: 'name',
        column: 'name',
        link: 'AND',
        rule: 'EQ',
        type: 'string',
        val: wlName,
        startWith: '',
        endWith: '',
      });
    }
    if (selectedKeys) {
      getParams.push({
        table: 'BdMaterial',
        name: 'groupId',
        column: 'group_id',
        link: 'AND',
        rule: 'EQ',
        type: 'string',
        val: selectedKeys[0],
        startWith: '',
        endWith: '',
      });
    }
    if (moreKeys && moreKeys.length > 0) {
      for (let i = 0; i < moreKeys.length; i++) {
        getParams.push({
          table: 'BdMaterial',
          name: JSON.parse(moreKeys[i].fieldName).propName,
          column: JSON.parse(moreKeys[i].fieldName).fieldName,
          link: moreKeys[i].link,
          rule: moreKeys[i].rule,
          type: moreKeys[i].type,
          date: dayjs(dayjs(moreKeys[i].date).valueOf()).format('YYYY-MM-DD HH:mm:ss'),
          val: moreKeys[i].val,
          startWith: moreKeys[i].startWith,
          endWith: moreKeys[i].endWith,
        });
      }
      console.log(getParams[0], 'sasas');
    }
    const res: any = await getMatTable({
      params: getParams,
      orderByBean: {
        descList: ['BdMaterial.update_time'],
      },
      pageIndex: pages.currentPage,
      pageRows: pages.pageSize,
    });
    pages.total = res.total;
    let data = res.records;
    tableEvent.value.init(data);
    searchRef.value.moreSearchClose();
  };
  //空参数
  const np = { params: '' };
  //重置
  const resetTable = () => {
    treeRef.value.resetSelect();
    selectedKeys = undefined;
    moreKeys = undefined;
    wlNo = undefined;
    wlName = undefined;
    refreshTable();
  };
  //获取基本单位字段
  const getTableUnit = async () => {
    try {
      let data = await getMatTableUnit(np);
      searchRef.value.init(data);
      console.log('高级查询基本单位字段', data);
    } catch (e) {
      console.log('高级查询获取基本单位字段失败', e);
    }
  };
  getTableUnit();
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
      onClick: () => {
        auditEvent();
      },
    },
    {
      type: 'default',
      label: '反审核',
      onClick: () => {
        unAuditEvent();
      },
    },
    {
      type: 'danger',
      label: '批量删除',
      onClick: () => {
        delTableEvent();
      },
    },
  ];
  let treeSelectData = null;
  const selectTree = (selected, selectedKeys) => {
    treeSelectData = selected;
    tableEvent.value.setGroupId(selected[0], selectedKeys);
  };
  //新增表格数据
  const addTableEvent = () => {
    tableEvent.value.addTable();
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
  const delTableEvent = () => {
    tableEvent.value.delTable();
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
  const auditEvent = () => {
    tableEvent.value.auditTable();
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
  const unAuditEvent = () => {
    tableEvent.value.unAuditTable();
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
  const closeRes = () => {
    unAudit.value = false;
    isAudit.value = false;
    resY.value = 0;
    resF.value = 0;
  };
  const rowStyle: VxeTablePropTypes.RowStyle = ({ row }) => {
    if (row.info.status == 'F') {
      return {
        backgroundColor: '#f5f7fa',
        color: 'red',
      };
    }
  };
  onMounted(() => {
    paneSize.value = cloneDeep(installPaneSize.value);
    refreshTree();
    getList();
  });
  onActivated(() => {
    // refreshTable();
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
