<template>
  <div style="height: 100%; padding: 15px">
    <div style="background-color: #fff; height: 100%; padding: 0 6px">
      <Search
        :showSearchNo="false"
        :showSearchName="false"
        :showSearchMatID="true"
        :showSearchStockId="true"
        :showSearchCompartmentId="true"
        :showSearchLocationId="true"
        :showMoreSearch="false"
        ref="searchRef"
        tableName="BdInventory"
        searchMatID="物料ID"
        searchStockId="仓库ID"
        searchCompartmentId="分仓ID"
        searchLocationId="仓位ID"
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
        :totalData="totalData"
        ref="tableRef"
        @getList="getList"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ExTable } from '/@/components/ExTable';
  import { Search } from '/@/components/Search';
  import { onActivated, onMounted, reactive, ref } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { gridOptions, StockAmountColumns } from '/@/components/ExTable/data';
  import { SearchParams } from '/@/api/apiLink';
  import { getInvList } from '/@/api/realTimeInv';
  const GridOptions = gridOptions;
  const paneSize = ref<number>(16);
  const installPaneSize = ref<number>(16);
  //表格事件
  const tableRef: any = ref<String | null>(null);
  //表格数据
  let tableData = ref<object[]>([]);
  let totalData = ref<number>(0);
  //查询组件
  const searchRef: any = ref<String | null>(null);
  //分页信息
  const pages = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
  });
  let getParams: SearchParams[] = [];
  //表格查询
  const getList = async (currPage = 1, pageSize = pages.pageSize) => {
    getParams = [];
    if (searchRef.value.getSearchParams() && searchRef.value.getSearchParams().length > 0) {
      getParams = getParams.concat(searchRef.value.getSearchParams());
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
    totalData.value = res.total;
    pages.currentPage = currPage;
    pages.pageSize = pageSize;
    tableData.value = res.records;
  };

  //重置
  const resetTable = () => {
    searchRef.value.formState.wlMatID = null;
    searchRef.value.formState.wlStockId = null;
    searchRef.value.formState.wlCompartmentId = null;
    searchRef.value.formState.wlLocationId = null;
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
