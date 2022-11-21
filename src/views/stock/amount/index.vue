<template>
  <div style="height: 100%; padding: 15px">
    <div style="background-color: #fff; height: 100%; padding: 0 6px">
      <StockAmountSearch
        :showMoreSearch="false"
        ref="stockAmountSearchRef"
        tableName="BdInventory"
        @getList="getList"
        @resetEvent="resetTable"
      />
      <ExTable
        :isAddShow="false"
        :isAuditShow="false"
        :isUnAuditShow="false"
        :isDeleteShow="false"
        :isRelatedShow="false"
        :isPushDown="false"
        :isShowExport="false"
        :isShowImport="false"
        tableName="BdInventory"
        :columns="StockAmountColumns"
        :gridOptions="GridOptions"
        :tableData="tableData"
        :tablePages="tablePages"
        ref="tableRef"
        @getList="getList"
        @getParamsData="getParamsData"
        :preUseUrl="Url.GET_INV_PRE_USE_SOURCE_DETAIL"
        :stockUrl="Url.GET_INV_SOURCE_DETAIL"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ExTable } from '/@/components/ExTable';
  import { StockAmountSearch } from '/@/components/Search';
  import { onActivated, onMounted, reactive, ref } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { gridOptions, StockAmountColumns } from '/@/components/ExTable/data';
  import {
    SearchDataType,
    SearchLink,
    SearchMatchType,
    SearchParams,
    StockFormState,
    tableParams,
    Url,
  } from '/@/api/apiLink';
  import { getInvList } from '/@/api/realTimeInv';
  const GridOptions = gridOptions;
  const paneSize = ref<number>(16);
  const installPaneSize = ref<number>(16);
  //表格数据
  const tableRef = ref<any>('');
  const tableData = ref<object[]>([]);
  const tablePages = reactive(tableParams);
  //查询组件
  const stockAmountSearchRef: any = ref<String | null>(null);
  let getParams: SearchParams[] = [];
  //表格查询
  const getList = async (currPage = tablePages.currentPage, pageSize = tablePages.pageSize) => {
    getParams = [];
    if (
      stockAmountSearchRef.value.getSearchParams() &&
      stockAmountSearchRef.value.getSearchParams().length > 0
    ) {
      getParams = getParams.concat(stockAmountSearchRef.value.getSearchParams());
    }
    //表格查询
    const res: any = await getInvList({
      params: getParams,
      orderByBean: {
        descList: ['update_time'],
      },
      pageIndex: currPage,
      pageRows: pageSize,
    });
    tablePages.total = res.total;
    tablePages.currentPage = currPage;
    tablePages.pageSize = pageSize;
    tableData.value = res.records;
  };

  //重置
  const resetTable = () => {
    const searchFormState: StockFormState = {
      matName: '',
      stockName: '',
      compartmentName: '',
      locationName: '',
      matId: '',
      stockId: '',
      compartmentId: '',
      locationId: '',
    };
    stockAmountSearchRef.value.setFormState(searchFormState);
    getList(1);
  };

  const getParamsData = (row): SearchParams[] => {
    let getParams: SearchParams[] = [];
    getParams.push({
      column: 'mat_id',
      endWith: '',
      link: SearchLink.AND,
      rule: SearchMatchType.LIKE,
      type: SearchDataType.string,
      name: 'matId',
      startWith: '',
      table: '',
      val: row.matId,
    });
    getParams.push({
      column: 'stock_id',
      endWith: '',
      link: SearchLink.AND,
      rule: SearchMatchType.LIKE,
      type: SearchDataType.string,
      name: 'stockId',
      startWith: '',
      table: '',
      val: row.stockId,
    });
    return getParams;
  };
  onMounted(() => {
    paneSize.value = cloneDeep(installPaneSize.value);
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
