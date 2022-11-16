<template>
  <AModal
    :visible="visibleGroupModal"
    :title="prop.title"
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
    :title="'删除' + prop.title"
    :maskClosable="false"
    :cancelText="false"
    :closable="false"
  >
    <div style="width: 100%">
      <div style="width: 20%; margin: auto">是否删除？</div>
    </div>
    <template #footer>
      <a-button key="submit" type="primary" :loading="false" @click="okDeleteGroup">提交</a-button>
      <a-button :loading="false" @click="cancelDeleteGroup">取消</a-button>
    </template>
  </AModal>
  <div style="height: 100%">
    <card style="width: 100%; border-bottom: 1px solid #d9d9d9; border-top: 1px solid #d9d9d9">
      <a-row
        style="
          width: 100%;
          padding: 2% 1%;
          margin: auto;
          justify-content: center;
          align-items: center;
        "
      >
        <a-col :span="8">
          <a-button type="primary" class="tree-button" @click="addEvent" size="small"
            >新增分组</a-button
          >
        </a-col>
        <a-col :span="8">
          <a-button type="primary" ghost class="tree-button" @click="addSubEvent" size="small"
            >新增下级</a-button
          >
        </a-col>
        <a-col :span="8">
          <a-button danger class="tree-button" @click="deleteEvent" size="small">删除分组</a-button>
        </a-col>
      </a-row>
    </card>
    <basic-tree
      ref="tree"
      @select="selectTree"
      :search="prop.search"
      :toolbar="prop.toolbar"
      :tree-data="prop.treeData"
      :title="prop.title"
      :beforeRightClick="beforeRightClick"
    />
  </div>
</template>
<script lang="ts">
  //如果是多个prop要组合在一起，那么就不能在setup里面？——找不到文章怎么说明的了
  import { basicProps } from '/@/components/Tree/src/props';
  const prop1 = basicProps;
  const prop2 = {
    tableName: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  };
  const prop3 = Object.assign({}, prop1, prop2);
</script>
<script setup lang="ts">
  import { reactive, ref, UnwrapRef } from 'vue';
  import { BasicTree, ContextMenuItem, TreeItem } from '/@/components/Tree/index';
  import { Modal, Button, Card, Col, Row, Form, FormItem, Input } from 'ant-design-vue';
  import { basicProps } from '/@/components/Tree/src/props';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    SearchDataType,
    SearchLink,
    SearchMatchType,
    SearchParams,
    GroupFormData,
  } from '/@/api/apiLink';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { OptGroupHook } from '/@/api/utilHook';

  const { createMessage } = useMessage();
  const AModal = Modal;
  const AButton = Button;
  const ARow = Row;
  const ACol = Col;
  const tree = ref<any>(null);
  let rightClickNode: TreeItem = {};
  const visibleGroupModal = ref<boolean>(false);
  const visibleDeleteGroupModal = ref<boolean>(false);
  const formRef = ref();
  const groupRules = reactive({
    name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
    number: [{ required: true, message: '请输入编码', trigger: 'blur' }],
  });
  const prop = defineProps(prop3);
  interface FormState {
    tableName: string;
  }
  const formState: UnwrapRef<FormState> = reactive({
    tableName: prop.tableName,
  });
  //树信息
  let groupFormData: UnwrapRef<GroupFormData> = reactive({
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
  const getSelectedKeys = () => {
    return tree.value.getSelectedKeys();
  };
  const setSelectedKeys = (keys: string[]) => {
    tree.value.setSelectedKeys(keys);
  };
  const getSearchParams = (name = 'groupId', column = 'group_id'): SearchParams[] => {
    const searchParams: SearchParams[] = [];
    if (tree.value.getSelectedKeys() && tree.value.getSelectedKeys().length > 0) {
      searchParams.push({
        table: formState.tableName,
        name: name,
        column: column,
        link: SearchLink.AND,
        rule: SearchMatchType.EQ,
        type: SearchDataType.string,
        val: tree.value.getSelectedKeys()[0],
      });
    }
    return searchParams;
  };
  const emits = defineEmits<{
    (e: 'editEvent', node: TreeItem): void;
    (e: 'addEvent'): void;
    (e: 'addSubEvent', node: TreeItem): void;
    (e: 'deleteEvent', node: TreeItem): void;
    (e: 'selectEvent', selectedKeys: string[], data: any);
  }>();
  const rightMenuList: ContextMenuItem[] = [
    {
      label: '编辑分组',
      handler: () => {
        visibleGroupModal.value = true;
        emits('editEvent', rightClickNode);
      },
    },
  ];
  //单选树事件
  const selectTree = (selectedKeys, data) => {
    emits('selectEvent', selectedKeys, data);
  };
  //整理树数据
  const runNode = (key: string | number, list: TreeItem[], res: TreeItem): TreeItem => {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.key === key) {
        return item;
      }
      if (item.children && item.children.length > 0) {
        res = runNode(key, item.children, res);
        if (res.key) {
          return res;
        }
      }
    }
    return res;
  };
  const findNode = (key: string | number): TreeItem => {
    return runNode(key, prop.treeData || [], {});
  };
  const beforeRightClick = (node): ContextMenuItem[] => {
    rightClickNode = { key: node.eventKey };
    return rightMenuList;
  };
  //获取分组
  const getOneSelectedKey = (): string | number => {
    const keys = tree.value.getSelectedKeys();
    if (keys.length !== 1) {
      return 0;
    }
    return keys[0];
  };
  //添加分组
  const addEvent = () => {
    visibleGroupModal.value = true;
    emits('addEvent');
  };
  //添加下级
  const addSubEvent = () => {
    const key = getOneSelectedKey();
    if (key === 0) {
      createMessage.error('请选择一个分组节点');
      return;
    }
    const node = findNode(key);
    visibleGroupModal.value = true;
    emits('addSubEvent', node);
  };
  //删除分组
  const deleteEvent = () => {
    const key = getOneSelectedKey();
    if (key === 0) {
      createMessage.error('请选择一个分组节点');
      return;
    }
    const node = findNode(key);
    visibleDeleteGroupModal.value = true;
    emits('deleteEvent', node);
  };
  //添加分组的提交
  const submitGroup = () => {
    formRef.value
      .validate()
      .then(() => {
        OptGroupHook.submitGroup().then(() => {
          visibleGroupModal.value = false;
        });
      })
      .catch((error: ValidateErrorEntity<FormData>) => {
        console.log(error);
        if (error.errorFields) {
          createMessage.error('数据校检不通过，请检查!');
        }
      });
  };
  //删除分组的提交
  const okDeleteGroup = async () => {
    OptGroupHook.submitGroup().then(() => {
      visibleDeleteGroupModal.value = false;
    });
  };
  //添加分组的取消
  const cancelGroup = () => {
    visibleGroupModal.value = false;
  };
  //删除分组的取消
  const cancelDeleteGroup = () => {
    visibleDeleteGroupModal.value = false;
  };
  //获取分组
  const getFormData = () => {
    return groupFormData;
  };
  //设置分组
  const setFormData = (data: GroupFormData) => {
    groupFormData.id = data.id;
    groupFormData.number = data.number;
    groupFormData.name = data.name ? data.name : '';
    const node = findNode(groupFormData.name);
    groupFormData.parent = data.parent;
  };
  defineExpose({
    getSearchParams,
    setSelectedKeys,
    getSelectedKeys,
    resetGroupFormData,
    getFormData,
    setFormData,
    findNode,
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
