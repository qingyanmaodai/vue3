<template>
  <vxe-modal v-model="isShow" height="82%" width="80%" show-zoom resize :position="{ top: 40 }">
    <template #title>
      <span>{{ props.modalTitle }}</span>
    </template>
    <a-splitPanes class="default-theme" style="padding: 5px; height: 100%">
      <pane :size="paneSize">
        <div style="background-color: #fff; height: 100%; padding: 0 6px">
          <a-menu>
            <template v-for="(item, index) in props.linkQueryMenuData" :key="index">
              <a-menu-item @click="onSelectItem(item)">
                {{ item.name }} ({{ item.tarBillIds.length }})</a-menu-item
              >
            </template>
          </a-menu>
        </div>
      </pane>
      <pane :size="100 - paneSize">
        <ExTable
          :isShowImport="false"
          :isShowExport="false"
          tableName="BsInventoryCountGainModel"
          :columns="tableCols"
          :gridOptions="props.gridOptions"
          :totalData="linkQueryTableData.length"
          :tableData="linkQueryTableData"
          ref="tableRef"
          @editTableEvent="editTableEvent"
        />
      </pane>
    </a-splitPanes>
  </vxe-modal>
</template>

<script lang="ts" setup>
  import { nextTick, reactive, ref } from 'vue';
  import { Pane, Splitpanes } from 'splitpanes';
  import { Tag, MenuItem, Menu } from 'ant-design-vue';
  import 'splitpanes/dist/splitpanes.css';
  import { ExTable } from '/@/components/ExTable';
  import { Pager, VxePagerEvents } from 'vxe-table';
  import { VxeGridPropTypes } from 'vxe-table/types/all';
  import { useGo } from '/@/hooks/web/usePage';

  const ASplitPanes = Splitpanes;
  const paneSize = ref<number>(12);
  const isShow = ref<boolean>(false); //弹框可见性，默认为关闭
  const currItem = ref<any>({});
  const tableRef = ref<any>('');
  const linkQueryTableData = ref<any>([]);
  const tableCols = ref<any>([]);
  const AMenuItem = MenuItem;
  const AMenu = Menu;
  type Emits = {
    (e: 'getDownSearchList'): void;
  };
  const emit = defineEmits<Emits>();

  interface ProType {
    modalTitle: string;
    tableName: string;
    gridOptions: any;
    linkQueryTableCols: VxeGridPropTypes.Columns;
    linkQueryMenuData: object[];
    linkQueryTableData: object[];
  }
  const props = withDefaults(defineProps<ProType>(), {
    tableName: '',
    modalTitle: '下查',
    linkQueryMenuData: () => {
      return [];
    },
  });

  const show = async () => {
    isShow.value = true;
  };
  const close = () => {
    linkQueryTableData.value = [];
    tableCols.value = [];
    isShow.value = false;
  };
  //点击列表项查询
  const onSelectItem = (item) => {
    console.log('item', item);
    emit('getDownSearchList');
    nextTick(function () {
      linkQueryTableData.value = props.linkQueryTableData;
      tableCols.value = props.linkQueryTableCols;
      tableRef.value.hideColumn('operate');
    });
    currItem.value = item;
  };
  const go = useGo();
  //跳转到详情
  const editTableEvent = (row) => {
    go({
      name: currItem.value.routeTo,
      query: {
        row: row.id,
      },
    });
  };
  //分页信息
  const pages = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
  });
  const tablePagerChange: VxePagerEvents.PageChange = async ({ currentPage, pageSize }) => {
    pages.currentPage = currentPage;
    pages.pageSize = pageSize;
    // await getList(currentPage);
  };

  defineExpose({
    show,
    close,
  });
</script>
<style scoped lang="less">
  .content {
    height: 100%;
    padding: 30px;
    display: flex;
    flex-wrap: wrap;
  }
  .contentNode {
    padding-bottom: 20px;
    padding-left: 50px;
    display: flex;
    width: 50%;
    margin: 0 !important;
  }
</style>
