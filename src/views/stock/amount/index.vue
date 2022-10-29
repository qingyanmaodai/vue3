<template>
  <div style="height: 100%; padding: 15px">
    <div style="background-color: #fff; height: 100%; padding: 0 6px">
      <Search
        :control="moreSearchData"
        ref="searchRef"
        tableName=""
        searchNo="单位编码："
        searchName="单位名称："
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
        tableName="BdInventoryPreUse"
        :columns="StockAmountColumns"
        :gridOptions="GridOptions"
        :importConfig="importConfig"
        :tableData="tableData"
        :totalData="totalData"
        ref="tableRef"
        @exportTable="exportTable"
        @importModelEvent="importModelEvent"
        @getList="getList"
      />
    </div>
  </div>
</template>

<script setup lang="ts" name="basic-unit-index">
  import { ExTable } from '/@/components/ExTable';
  import { Search } from '/@/components/Search';
  import { onActivated, onMounted, reactive, ref } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { gridOptions, StockAmountColumns } from '/@/components/ExTable/data';
  import { SearchParams } from '/@/api/apiLink';
  import { OptTableHook } from '/@/api/utilHook';
  import { exportUnitList, getUnitOption, importUnitModel } from '/@/api/unit';
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
  //导入上传文件api
  let importConfig = ref<string>('IMPORT_UNIT_LIST');
  //分页信息
  const pages = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
  });
  let getParams: SearchParams[] = [];
  //获取高级查询字段数据
  const moreSearchData = ref();
  getUnitOption({ params: '' }).then((res) => {
    moreSearchData.value = res;
  });
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
    searchRef.value.moreSearchClose();
  };

  //重置
  const resetTable = () => {
    searchRef.value.formState.wlNo = null;
    searchRef.value.formState.wlName = null;
    getList(1);
  };
  //下载模板
  const importModelEvent = async () => {
    OptTableHook.importModel = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        importUnitModel({
          params: '导入模板',
        })
          .then((res) => {
            const data = { title: '计量单位信息导入模板.xls', data: res };
            resolve(data);
          })
          .catch((e) => {
            reject(e);
          });
      });
    };
  };
  //导出
  const exportTable = async () => {
    OptTableHook.exportExcel = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        exportUnitList({
          params: {
            list: getParams,
            fileName: '计量单位列表',
          },
          pageIndex: 1,
          pageRows: pages.pageSize,
        })
          .then((res) => {
            const data = { title: '计量单位列表信息.xls', data: res };
            resolve(data);
          })
          .catch((e) => {
            reject(e);
          });
      });
    };
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
