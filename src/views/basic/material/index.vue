<template>
  <div style="height: 100%">
    <a-modal
      :visible="visibleGroupModal"
      title="物料分组"
      :maskClosable="false"
      :cancelText="false"
      :closable="false"
    >
      <div style="width: 100%">
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
    </a-modal>
    <a-modal
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
    </a-modal>
    <a-splitpanes class="default-theme" style="padding: 15px; height: 100%">
      <pane :size="paneSize">
        <ex-tree
          :toolbar="true"
          :search="true"
          :tree-data="treeData"
          title="物料分组"
          @editEvent="editGroupEvent"
          @addEvent="addGroupEvent"
          @addSubEvent="addGroupSubEvent"
          @deleteEvent="deleteEvent"
          @treeList="treeList"
        />
      </pane>
      <pane :size="100 - paneSize">
        <Search @searchList="searchList" @getList="getList" @moreList="moreList" ref="searchRef" />
        <ExTable
          :columns="matColumns"
          :data="tableData"
          :buttons="buttons"
          :gridOptions="AgridOptions"
          ref="tableEvent"
          @getList="getList"
          @delMatOneEvent="delMatOneEvent"
          @delMatBatchEvent="delMatBatchEvent"
        />
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
          @page-change="handlePageChange"
        />
      </pane>
    </a-splitpanes>
  </div>
</template>

<script setup lang="ts">
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { ExTree } from '/@/components/ExTree';
  import { ExTable } from '/@/components/ExTable';
  import { Search } from '/@/components/Search';
  import { onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Pager } from 'vxe-table';
  import {
    addMatGroup,
    editMatGroup,
    deleteMatGroup,
    queryOneMatGroup,
    treeMatGroup,
    MatGroupEntity,
  } from '/@/api/matgroup';
  import { getMatTable, delMatTableById, delMatTableBatch, getMatTableUnit } from '/@/api/mattable';
  import { Button, Modal, Form, FormItem, Input } from 'ant-design-vue';
  import { Splitpanes, Pane } from 'splitpanes';
  import 'splitpanes/dist/splitpanes.css';
  import { TreeItem } from '/@/components/Tree';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { gridOptions, matColumns } from '/@/components/ExTable/data';
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
  //初始化表格参数
  const init = [
    {
      table: 'BdMaterial',
      name: 'name',
      column: 'name',
      link: 'AND',
      rule: 'LIKE',
      type: 'string',
      val: '',
      startWith: '',
      endWith: '',
    },
  ];
  //分页信息
  const pages = reactive({
    currentPage: 0,
    pageSize: 0,
    total: 0,
  });
  //分页处理
  const handlePageChange = async ({ currentPage, pageSize }) => {
    pages.currentPage = currentPage;
    pages.pageSize = pageSize;
    console.log('hand', currentPage, pageSize);
    const res: any = await getMatTable({
      params: init,
      pageIndex: currentPage,
      pageRows: pageSize,
    });
    let data = res.records;
    tableEvent.value.init(data);
  };
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
    console.log(tree);
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
      refreshTree();
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

  //获取表格数据
  const getList = async () => {
    const res: any = await getMatTable({
      params: init,
    });
    pages.currentPage = res.current;
    pages.total = res.total;
    pages.pageSize = res.size;
    let data = res.records;
    tableEvent.value.init(data);
  };
  //搜索功能
  const searchList = async (keywords) => {
    const res: any = await getMatTable({
      params: [
        {
          table: 'BdMaterial',
          name: 'number',
          column: 'number',
          link: 'AND',
          rule: 'EQ',
          type: 'string',
          val: keywords[0],
          startWith: '',
          endWith: '',
        },
        {
          table: 'BdMaterial',
          name: 'name',
          column: 'name',
          link: 'OR',
          rule: 'EQ',
          type: 'string',
          val: keywords[1],
          startWith: '',
          endWith: '',
        },
      ],
    });
    let data = res.records;
    console.log('111', data);
    tableEvent.value.init(data);
  };
  //高级查询
  const moreList = async (keywords) => {
    let moreParams: any[] = [];
    for (let i = 0; i < keywords.length; i++) {
      moreParams.push({
        table: 'BdMaterial',
        name: JSON.parse(keywords[i].fieldName).propName,
        column: JSON.parse(keywords[i].fieldName).fieldName,
        link: keywords[i].link,
        rule: keywords[i].rule,
        type: keywords[i].type,
        val: keywords[i].val,
        startWith: keywords[i].startWith,
        endWith: keywords[i].endWith,
      });
    }
    console.log('get', moreParams);
    try {
      const res: any = await getMatTable({
        params: moreParams,
      });
      let data = res.records;
      console.log('222', data);
      tableEvent.value.init(data);
      searchRef.value.moreSearchClose();
    } catch (e) {
      console.log('查询失败', e);
    }
  };
  //获取基本单位字段
  const getTableUnit = async () => {
    try {
      const res = await getMatTableUnit('');
      let data = res;
      searchRef.value.init(data);
      console.log('高级查询基本单位字段', data);
    } catch (e) {
      console.log('高级查询获取基本单位字段失败', e);
    }
  };
  //基本单位搜索功能
  // const searchUnitList = async (keywords) => {
  //   const res = await getMatTableUnitList({
  //     // params: JSON.parse(keywords),
  //     params: [keywords],
  //   });
  //   let data = res;
  //   console.log('高级查询-基本单位', res);
  //   console.log('qqqqqq', keywords);
  //   searchRef.value.searchUnit(data);
  // };
  getTableUnit();
  // searchUnitList();
  //树查询
  const treeList = async (node) => {
    try {
      const res: any = await getMatTable({
        params: [
          {
            table: 'BdMaterial',
            name: 'groupId',
            column: 'group_id',
            link: 'AND',
            rule: 'EQ',
            type: 'string',
            val: node[0],
            startWith: '',
            endWith: '',
          },
        ],
      });
      if (node[0]) {
        let data = res.records;
        tableEvent.value.init(data);
      } else {
        await getList();
      }
    } catch (e) {
      console.log('树失败', e);
    }
  };
  //按钮
  const buttons = [
    {
      status: 'warning',
      label: '添加',
      onClick: () => {
        addTableEvent();
      },
    },
    {
      status: 'danger',
      label: '批量删除',
      onClick: () => {
        delTableEvent();
      },
    },
    {
      status: 'success',
      label: '导出',
      onClick: () => {
        expTableEvent();
      },
    },
    // { status: 'primary', label: '审核' },
    // { status: 'primary', label: '下推' },
    // { status: 'primary', label: '业务查询' },
  ];
  //新增表格数据
  const addTableEvent = () => {
    tableEvent.value.addTable();
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
  //导出表格数据
  const expTableEvent = () => {
    tableEvent.value.expTable();
  };
  //编辑表格数据
  // const editTableEvent = () => {};
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
