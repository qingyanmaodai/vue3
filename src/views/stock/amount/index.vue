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
        ref="tableRef"
        @getList="getList"
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
  import {SearchParams, tableParams} from '/@/api/apiLink';
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
    tableData.value = res.records;
  };

  //重置
  const resetTable = () => {
    stockAmountSearchRef.value.formState.matName = null;
    stockAmountSearchRef.value.formState.stockName = null;
    stockAmountSearchRef.value.formState.compartmentName = null;
    stockAmountSearchRef.value.formState.locationName = null;
    getList(1);
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
