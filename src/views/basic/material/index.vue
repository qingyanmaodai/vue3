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
        <a-button key="submit" type="primary" :loading="false" @click="okDeleteGroup">提交</a-button>
        <a-button :loading="false" @click="cancelDeleteGroup">取消</a-button>
      </template>
    </a-modal>
    <splitpanes class="default-theme" style="padding: 15px; height: 100%">
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
        />
      </pane>
      <pane :size="100 - paneSize">
        <div>哈哈哈</div>
        <div>哈哈哈</div>
      </pane>
    </splitpanes>
  </div>
</template>

<script setup lang="ts">
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { ExTree } from '/@/components/ExTree';
  import { onMounted, reactive, ref, UnwrapRef } from 'vue';
  import {
    addMatGroup,
    editMatGroup,
    deleteMatGroup,
    queryOneMatGroup,
    treeMatGroup,
    MatGroupEntity,
  } from '/@/api/matgroup';
  import { Layout, Button, Row, Col, Modal, Form, FormItem, Input } from 'ant-design-vue';
  import { Splitpanes, Pane } from 'splitpanes';
  import 'splitpanes/dist/splitpanes.css';
  import { TreeItem } from '/@/components/Tree';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  const AModal = Modal;
  const AButton = Button;
  const visibleGroupModal = ref<boolean>(false);
  const visibleDeleteGroupModal = ref<boolean>(false);
  const paneSize = ref<number>(18);
  const installPaneSize = ref<number>(18);
  const formRef = ref();
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
  onMounted(() => {
    paneSize.value = cloneDeep(installPaneSize.value);
    refreshTree();
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
