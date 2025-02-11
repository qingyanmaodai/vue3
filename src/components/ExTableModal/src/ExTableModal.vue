<template>
  <vxe-modal
    v-model="isShow"
    id="tableModal"
    show-zoom
    resize
    :position="{ top: 40 }"
    width="65%"
    @close="close"
  >
    <template #title>
      <span>{{ props.tableModalTitle }}</span>
    </template>
    <ExTable
      :columns="props.tableModalColumns"
      :gridOptions="notToolInGridOptions"
      :tableData="tableData"
      :tablePages="tablePages"
      ref="tableRef"
      height="90%"
      v-if="tableShow"
      :urlConfig="listUrl"
      @getList="getList"
      @editTableEvent="editTableEvent"
    />
  </vxe-modal>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { ExTable } from '/@/components/ExTable';
  import { notToolInGridOptions } from '/@/components/ExTable/data';
  import { getPublicList } from '/@/api/public';
  import { tableParams } from '/@/api/apiLink';
  import { filterType, publicUrlList } from '/@/enums/routeEnum';
  import { useGo } from '/@/hooks/web/usePage';
  import { cloneDeep } from 'lodash-es';
  //表格数据
  const tableRef = ref<any>('');
  const tableData = ref<object[]>([]);
  let tablePages = reactive(cloneDeep(tableParams));
  // type Emits = {};
  // const emit = defineEmits<Emits>();
  interface ProType {
    tableModalColumns?: object[];
    tableModalTitle?: string;
    tableModalParams?: object[];
  }
  const props = withDefaults(defineProps<ProType>(), {
    tableModalColumns: () => {
      return [];
    },
    tableModalTitle: '',
    tableModalParams: () => {
      return [];
    },
  });

  const isShow = ref<boolean>(false);
  const listUrl = ref<string>();
  const tableShow = ref<boolean>(false); //表格可见性，默认为关闭
  const getList = async (
    currPage = tablePages.currentPage,
    pageSize = tablePages.pageSize,
    url,
  ) => {
    const res: any = await getPublicList(
      {
        params: props.tableModalParams,
        orderByBean: {
          descList: ['create_time'],
        },
        pageIndex: currPage,
        pageRows: pageSize,
      },
      url,
    );
    tablePages.total = res.total;
    tablePages.currentPage = currPage;
    tablePages.pageSize = pageSize;
    tableData.value = res.records;
  };

  //跳转到相对应的详情页
  const go = useGo();
  const editTableEvent = (row) => {
    let filter;
    if (tableData.value.length > 0) {
      filter = filterType(publicUrlList, row.billType);
    }
    let detailUrl = filter[0].detailUrl;
    go({
      path: detailUrl,
      query: {
        row: row.billId,
      },
    });
  };
  const show = () => {
    isShow.value = true;
    tableShow.value = true;
  };
  const close = () => {
    isShow.value = false;
    tableShow.value = false;
    tablePages.currentPage = tableParams.currentPage;
    tablePages.total = tableParams.total;
    tablePages.pageSize = tableParams.pageSize;
  };
  const init = async (tableUrl: string) => {
    await getList(tablePages.currentPage, tablePages.pageSize, tableUrl);
    listUrl.value = tableUrl;
    isShow.value = true;
    tableShow.value = true;
  };

  defineExpose({
    show,
    close,
    init,
  });
</script>
<style scoped lang="less">
  .x-button {
    margin: 10px 5px;
  }
  .form-style {
    text-align: center;
  }
  .row {
    display: inherit !important;
    margin-top: 15px;
  }
  :deep(.vxe-table .vxe-sort--desc-btn.sort--active) {
    color: #409eff;
    border-color: #409eff;
  }
  :deep(.vxe-table .vxe-sort--asc-btn.sort--active) {
    color: #409eff;
    border-color: #409eff;
  }
</style>
