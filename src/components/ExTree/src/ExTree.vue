<template>
  <div style="height: 100%">
    <card style="width: 100%; border-bottom: 1px solid #d9d9d9; border-top: 1px solid #d9d9d9">
      <a-row
        style="
          width: 100%;
          padding: 5px;
          margin: auto;
          justify-content: center;
          align-items: center;
        "
      >
        <a-col :span="8">
          <a-button type="primary" class="tree-button" @click="addEvent">新增分组</a-button>
        </a-col>
        <a-col :span="8">
          <a-button type="primary" ghost class="tree-button" @click="addSubEvent">新增下级</a-button>
        </a-col>
        <a-col :span="8">
          <a-button danger class="tree-button" @click="deleteEvent">删除分组</a-button>
        </a-col>
      </a-row>
    </card>
    <basic-tree
      ref="tree"
      :search="prop.search"
      :toolbar="prop.toolbar"
      :tree-data="prop.treeData"
      :title="prop.title"
      :beforeRightClick="beforeRightClick"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicTree, ContextMenuItem, TreeItem } from '/@/components/Tree/index';
  import { Button, Card, Col, Row } from 'ant-design-vue';
  import { basicProps } from '/@/components/Tree/src/props';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();
  const AButton = Button;
  const ARow = Row;
  const ACol = Col;
  const tree = ref<any>(null);
  let rightClickNode: TreeItem = {};
  const prop = defineProps(basicProps);
  const emits = defineEmits<{
    (e: 'editEvent', node: TreeItem): void;
    (e: 'addEvent'): void;
    (e: 'addSubEvent', node: TreeItem): void;
    (e: 'deleteEvent', node: TreeItem): void;
  }>();
  const rightMenuList: ContextMenuItem[] = [
    {
      label: '编辑分组',
      handler: () => {
        emits('editEvent', rightClickNode);
      },
    },
  ];
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
  const getOneSelectedKey = (): string | number => {
    const keys = tree.value.getSelectedKeys();
    if (keys.length !== 1) {
      return 0;
    }
    return keys[0];
  };
  const addEvent = () => {
    emits('addEvent');
  };
  const addSubEvent = () => {
    const key = getOneSelectedKey();
    if (key === 0) {
      createMessage.error('请选择一个分组节点');
      return;
    }
    const node = findNode(key);
    emits('addSubEvent', node);
  };
  const deleteEvent = () => {
    const key = getOneSelectedKey();
    if (key === 0) {
      createMessage.error('请选择一个分组节点');
      return;
    }
    const node = findNode(key);
    emits('deleteEvent', node);
  };
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
