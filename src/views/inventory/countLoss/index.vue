<template>
  <div class="default-theme" style="padding: 15px; height: 100%">
    <div style="background-color: #fff; height: 100%; padding: 0 6px">
      <Search
        :control="moreSearchData"
        ref="searchRef"
        tableName="BsInventoryCountLoss"
        searchNo="单据编号"
        :showSearchName="false"
        @getList="getList"
        @resetEvent="resetTable"
      />
      <ExTable
        :isShowImport="false"
        :isShowExport="false"
        :columns="invCountLossColumns"
        :gridOptions="GridOptions"
        :importConfig="importConfig"
        :tableData="tableData"
        :totalData="totalData"
        tableName="BsInventoryCountLoss"
        ref="tableRef"
        @addTableEvent="addTableEvent"
        @editTableEvent="editTableEvent"
        @deleteRowEvent="deleteRowTableEvent"
        @delBatchEvent="deleteBatchEvent"
        @auditRowEvent="auditRowEvent"
        @auditBatchEvent="auditBatchEvent"
        @unAuditRowEvent="unAuditRowEvent"
        @unAuditBatchEvent="unAuditBatchEvent"
        @exportTable="exportTable"
        @importModelEvent="importModelEvent"
        @getList="getList"
        :modalTitle="modalTitle"
        @downSearchEvent="downSearchEvent"
        @upSearchEvent="upSearchEvent"
        @getSearchList="getSearchList"
        :linkQueryMenuData="linkQueryMenuData"
        :linkQueryTableData="linkQueryTableData"
        :linkQueryTableCols="linkQueryTableCols"
      />
    </div>
  </div>
</template>

<script setup lang="ts" name="inventory-countLoss-index">
  import { ExTable } from '/@/components/ExTable';
  import { Search } from '/@/components/Search';
  import { onActivated, onMounted, reactive, ref } from 'vue';
  import {
    audit,
    auditBatch,
    delBatch,
    delById,
    exportExcel,
    getDataList,
    getSearchOption,
    importFile,
    unAudit,
    unAuditBatch,
    downSearch,
    upSearch,
  } from '/@/api/invCountLoss';
  import 'splitpanes/dist/splitpanes.css';
  import { cloneDeep } from 'lodash-es';
  import { gridOptions, invCountLossColumns } from '/@/components/ExTable/data';
  import { SearchDataType, SearchLink, SearchMatchType, SearchParams } from '/@/api/apiLink';
  import { OptTableHook } from '/@/api/utilHook';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();
  const GridOptions = gridOptions;
  const paneSize = ref<number>(16);
  const installPaneSize = ref<number>(16);
  //导入上传文件api
  let importConfig = ref<string>('IMPORT_INV_COUNT_LOSS');
  //表格事件
  const tableRef: any = ref<String | null>(null);
  let tableData = ref<object[]>([]);
  let totalData = ref<number>(0);
  //查询组件
  const searchRef: any = ref<String | null>(null);
  const go = useGo();
  import { useGo } from '/@/hooks/web/usePage';
  import { PageEnum } from '/@/enums/pageEnum';
  import { VxeGridPropTypes } from 'vxe-table/types/all';
  import { getPublicList } from '/@/api/public';
  import { getUpDownSearchList } from '/@/enums/routeEnum';
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
    const res: any = await getDataList({
      params: getParams,
      orderByBean: {
        descList: ['BsInventoryCountLoss.update_time'],
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
  const linkQueryMenuData: any = ref<any>([]);
  const linkQueryTableData: any = ref<any>([]);
  const linkQueryTableCols: any = ref<VxeGridPropTypes.Columns[]>([]);
  const modalTitle: any = ref<any>('');

  //关联查询
  const getSearchList = async (item, currPage = 1, pageSize = pages.pageSize) => {
    let filter;
    if (item.tarBillIds.length > 0) {
      filter = getUpDownSearchList.filter((e) => e.type === item.tarBillType);
    } else {
      filter = getUpDownSearchList.filter((e) => e.type === item.srcBillType);
    }
    let listUrl = filter[0].listUrl;
    linkQueryTableCols.value = filter[0].TableCols;
    // 查询表格
    let listData: any = await getPublicList(
      {
        params: [
          {
            table: '',
            name: 'id',
            column: 'id',
            link: SearchLink.AND,
            rule: SearchMatchType.IN,
            type: SearchDataType.string,
            val: item.tarBillIds.length > 0 ? item.tarBillIds : item.srcBillIds,
            startWith: '',
            endWith: '',
          },
        ],
        pageIndex: currPage,
        pageRows: pageSize,
      },
      listUrl,
    );
    linkQueryTableData.value = listData;
  };
  //上查
  const upSearchEvent = async (row) => {
    const res: any = await upSearch({ params: row });
    modalTitle.value = '盘亏单-上查';
    linkQueryMenuData.value = res;
    tableRef.value.isUpDownSearch(linkQueryMenuData.value);
  };
  //下查
  const downSearchEvent = async (row) => {
    const res: any = await downSearch({ params: row });
    modalTitle.value = '盘亏单-下查';
    linkQueryMenuData.value = res;
    tableRef.value.isUpDownSearch(linkQueryMenuData.value);
  };
  //添加
  const addTableEvent = () => {
    let groupId = '';
    go({
      path: PageEnum.INV_COUNT_LOSS_DETAIL,
      query: {
        groupId: groupId == '' ? '' : groupId,
      },
    });
  };
  //编辑
  const editTableEvent = (row) => {
    go({
      path: PageEnum.INV_COUNT_LOSS_DETAIL,
      query: {
        row: row.id,
      },
    });
  };
  //重置
  const resetTable = () => {
    searchRef.value.formState.wlNo = null;
    searchRef.value.formState.wlName = null;
    getList(1);
  };
  //删除表格单条数据
  const deleteRowTableEvent = async (row) => {
    await delById({ params: row });
    await getList();
  };
  //批量删除表格
  const deleteBatchEvent = async (rows: any[]) => {
    const res = await delBatch({ params: rows });
    await tableRef.value.computeData(res);
    await getList();
  };
  //审核单条
  const auditRowEvent = async (row) => {
    await audit({
      params: row,
    });
    await getList();
    createMessage.success('操作成功');
  };

  //审核事件
  const auditBatchEvent = async (rows) => {
    const ids = rows.map((item) => {
      return item.id;
    });
    const res = await auditBatch({
      params: ids,
    });
    await tableRef.value.computeData(res);
    await getList();
  };
  //单条反审核
  const unAuditRowEvent = async (row: any) => {
    await unAudit({
      params: row,
    });
    await getList();
    createMessage.success('操作成功');
  };
  //批量反审核
  const unAuditBatchEvent = async (rows) => {
    const ids = rows.map((item) => {
      return item.id;
    });
    const res = await unAuditBatch({
      params: ids,
    });
    await tableRef.value.computeData(res);
    await getList();
  };
  //下载模板
  const importModelEvent = async () => {
    OptTableHook.importModel = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        importFile({
          params: '导入模板',
        })
          .then((res) => {
            const data = { title: '盘亏单导入模板.xls', data: res };
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
        exportExcel({
          params: {
            list: getParams,
            fileName: '盘亏单',
          },
          pageIndex: 1,
          pageRows: pages.pageSize,
        })
          .then((res) => {
            const data = { title: '盘亏单.xls', data: res };
            resolve(data);
          })
          .catch((e) => {
            reject(e);
          });
      });
    };
  };

  //获取高级查询字段数据
  const moreSearchData = ref();
  getSearchOption({ params: '' }).then((res) => {
    moreSearchData.value = res;
  });
  onMounted(() => {
    paneSize.value = cloneDeep(installPaneSize.value);
    // getList();
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
