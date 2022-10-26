<template>
  <vxe-modal
    v-model="isShow"
    height="83%"
    width="80%"
    show-zoom
    resize
    :position="{ top: 40 }"
    @close="close"
  >
    <template #title>
      <span>{{ props.modalTitle }}</span>
    </template>
    <a-splitPanes class="default-theme" style="padding: 5px; height: 100%">
      <pane :size="paneSize">
        <div style="background-color: #fff; height: 100%">
          <a-menu>
            <template v-for="(item, index) in props.linkQueryMenuData" :key="index">
              <a-menu-item @click="onSelectItem(item)">
                {{ item.tarBillIds.length > 0 ? item.name : item.source }} ({{
                  item.tarBillIds.length > 0 ? item.tarBillIds.length : item.srcBillIds.length
                }})</a-menu-item
              >
            </template>
          </a-menu>
        </div>
      </pane>
      <pane :size="100 - paneSize" style="background-color: #fff">
        <ExTable
          :isShowImport="false"
          :isShowExport="false"
          tableName="BsInventoryCountGainModel"
          :columns="props.linkQueryTableCols"
          :gridOptions="props.gridOptions"
          :totalData="props.linkQueryTableData.total"
          :tableData="props.linkQueryTableData"
          :height="height"
          ref="tableRef"
          @editTableEvent="editTableEvent"
          v-if="tableShow"
        />
      </pane>
    </a-splitPanes>
  </vxe-modal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Pane, Splitpanes } from 'splitpanes';
  import { MenuItem, Menu } from 'ant-design-vue';
  import 'splitpanes/dist/splitpanes.css';
  import { ExTable } from '/@/components/ExTable';
  import { VxeGridPropTypes } from 'vxe-table/types/all';
  import { useGo } from '/@/hooks/web/usePage';
  let height = '90%';
  const ASplitPanes = Splitpanes;
  const paneSize = ref<number>(12);
  const isShow = ref<boolean>(false); //弹框可见性，默认为关闭
  const tableShow = ref<boolean>(false); //表格可见性，默认为关闭
  const currItem = ref<any>({});
  const tableRef = ref<any>('');
  const AMenuItem = MenuItem;
  const AMenu = Menu;
  type Emits = {
    (e: 'getSearchList', item: any): void;
  };
  const emit = defineEmits<Emits>();
  interface ProType {
    modalTitle: string;
    tableName: string;
    gridOptions: any;
    linkQueryTableCols: VxeGridPropTypes.Columns;
    linkQueryMenuData: any;
    linkQueryTableData: any;
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
    isShow.value = false;
    tableShow.value = false;
  };
  //点击列表项查询
  const onSelectItem = async (item) => {
    console.log('item', item);
    emit('getSearchList', item);
    tableShow.value = true;
    setTimeout(() => {
      tableRef.value.hideColumn(['operate']);
    }, 0);
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
