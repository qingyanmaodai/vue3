<template>
  <div class="default-theme" style="padding: 15px; height: 100%">
    <div style="background-color: #fff; height: 100%; padding: 0 6px">
      <Search
        :control="moreSearchData"
        ref="searchRef"
        tableName="BsInventoryCountGainModel"
        searchNo="单据编号"
        searchName="物料编号"
        :showSearchName="false"
        @getList="getList"
        @resetEvent="resetTable"
      />
      <ExTable
        :isShowImport="false"
        :isShowExport="false"
        tableName="BsInventoryCountGainModel"
        :columns="invCountGainColumns"
        :gridOptions="GridOptions"
        :importConfig="importConfig"
        :tableData="tableData"
        :tablePages="tablePages"
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
        @pushDownEvent="pushDownEvent"
        @downSearchEvent="downSearchEvent"
        @upSearchEvent="upSearchEvent"
        :linkQueryMenuData="linkQueryMenuData"
      />
    </div>
  </div>
</template>

<script setup lang="ts" name="inventory-countGain-index">
  import { ExTable } from '/@/components/ExTable';
  import { Search } from '/@/components/Search';
  import {onActivated, onMounted, reactive, ref} from 'vue';
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
    pushDown,
  } from '/@/api/invCountGain';
  import 'splitpanes/dist/splitpanes.css';
  import { cloneDeep } from 'lodash-es';
  import { gridOptions, invCountGainColumns } from '/@/components/ExTable/data';
  import {SearchParams, tableParams} from '/@/api/apiLink';
  import { OptTableHook } from '/@/api/utilHook';
  import { useMessage } from '/@/hooks/web/useMessage';
  const go = useGo();
  import { useGo } from '/@/hooks/web/usePage';
  import { PageEnum } from '/@/enums/pageEnum';
  const { createMessage } = useMessage();
  const GridOptions = gridOptions;
  import { getInvList } from '/@/api/realTimeInv';
  import { SearchDataType, SearchLink, SearchMatchType } from '/@/api/apiLink';
  const paneSize = ref<number>(16);
  const installPaneSize = ref<number>(16);
  //导入上传文件api
  let importConfig = ref<string>('IMPORT_INV_COUNT_GAIN');
  //表格数据
  const tableRef = ref<any>('');
  const tableData = ref<object[]>([]);
  const tablePages = reactive(tableParams);
  //查询组件
  const searchRef: any = ref<String | null>(null);
  let getParams: SearchParams[] = [];

  //表格查询
  const getList = async (currPage = tablePages.currentPage, pageSize = tablePages.pageSize) => {
    getParams = [];
    if (searchRef.value.getSearchParams() && searchRef.value.getSearchParams().length > 0) {
      getParams = getParams.concat(searchRef.value.getSearchParams());
    }
    //表格查询
    const res: any = await getDataList({
      params: getParams,
      orderByBean: {
        descList: ['update_time'],
      },
      pageIndex: currPage,
      pageRows: pageSize,
    });
    tablePages.total = res.total;
    tableData.value = res.records;
    searchRef.value.moreSearchClose();
  };
  const linkQueryMenuData: any = ref<any>([]);
  const modalTitle: any = ref<any>('');

  //上查
  const upSearchEvent = async (row) => {
    const res: any = await upSearch({ params: row });
    modalTitle.value = '盘盈单-上查';
    linkQueryMenuData.value = res;
    tableRef.value.isUpDownSearch(linkQueryMenuData.value);
  };
  //下查
  const downSearchEvent = async (row) => {
    const res: any = await downSearch({ params: row });
    modalTitle.value = '盘盈单-下查';
    linkQueryMenuData.value = res;
    tableRef.value.isUpDownSearch(linkQueryMenuData.value);
  };
  //添加
  const addTableEvent = () => {
    let groupId = '';
    go({
      path: PageEnum.INV_COUNT_GAIN_DETAIL,
      query: {
        groupId: groupId == '' ? '' : groupId,
      },
    });
  };
  //编辑
  const editTableEvent = (row) => {
    go({
      path: PageEnum.INV_COUNT_GAIN_DETAIL,
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
    // await delById({ params: row.id });
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
  //下推
  const pushDownEvent = async (selectRecords, pushDownParam) => {
    let val: string[] = [];
    selectRecords.map((item) => {
      if (item.dtData && item.dtData.length > 0) {
        item.dtData.map((i) => {
          val.push(i.matId);
        });
      }
    });
    // 请求分页查询接口
    let setStockNum: any = await getInvList({
      pageRows: 1000000,
      params: [
        {
          table: '',
          name: 'matId',
          column: 'mat_id',
          link: SearchLink.AND,
          rule: SearchMatchType.IN,
          type: SearchDataType.string,
          val: val,
          startWith: '',
          endWith: '',
        },
      ],
    });
    // 遍历数组赋值stockNum
    selectRecords.map((item) => {
      if (item.dtData && item.dtData.length > 0) {
        item.dtData.map((i) => {
          let filterNum = setStockNum.records.filter(
            (e) =>
              e.matId === i.matId &&
              e.stockId === i.stockId &&
              e.compartmentId === i.compartmentId &&
              e.locationId === i.locationId,
          );
          i.stockNum = filterNum[0] ? filterNum[0].stockNum : 0;
        });
      }
    });
    let res = await pushDown(
      {
        params: selectRecords,
      },
      pushDownParam.tarBillType,
    );
    if (res) {
      createMessage.success('下推成功');
      go({
        name: pushDownParam.routeTo,
        params: { pushDownParam: JSON.stringify(res) },
      });
    } else {
      createMessage.error('无法下推到该下游单据/已有下游单据');
    }
  };
  //下载模板
  const importModelEvent = async () => {
    OptTableHook.importModel = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        importFile({
          params: '导入模板',
        })
          .then((res) => {
            const data = { title: '盘盈单导入模板.xls', data: res };
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
            fileName: '盘盈单',
          },
          pageIndex: 1,
          pageRows: tableRef.value.pages.pageSize,
        })
          .then((res) => {
            const data = { title: '盘盈单.xls', data: res };
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
