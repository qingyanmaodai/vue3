<template>
  <div class="default-theme" style="padding: 15px; height: 100%">
    <div style="background-color: #fff; height: 100%; padding: 0 6px">
      <Search
        :control="moreSearchData"
        ref="searchRef"
        tableName="BsInventoryCount"
        searchNo="单据编号"
        :showSearchName="false"
        @getList="getList"
        @resetEvent="resetTable"
      />
      <ExTable
        :isShowImport="false"
        :columns="invCountSheetColumns"
        :gridOptions="GridOptions"
        :tableData="tableData"
        :tablePages="tablePages"
        tableName="BsInventoryCount"
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
        @pushDownEvent="pushDownEvent"
        @getList="getList"
        @upDownSearchEvent="upDownSearchEvent"
      />
    </div>
    <ExPushDownModel
      ref="ExPushDownModelRef"
      tableName="BsInventoryCount"
      @pushDownSelect="pushDownSelect"
    />
    <ExLinkQueryModal
      ref="exLinkQueryModelRef"
      tableName="BsInventoryCount"
      :modalTitle="modalTitle"
      :linkQueryMenuData="linkQueryMenuData"
    />
  </div>
</template>

<script setup lang="ts" name="inventory-countSheet-index">
  import { ExTable } from '/@/components/ExTable';
  import { Search } from '/@/components/Search';
  import { onActivated, onMounted, reactive, ref } from 'vue';
  import {
    audit,
    auditBatch,
    delBatch,
    delById,
    downSearch,
    exportExcel,
    getDataList,
    getSearchOption,
    pushDown,
    unAudit,
    unAuditBatch,
    upSearch,
  } from '/@/api/invCountSheet';
  import 'splitpanes/dist/splitpanes.css';
  import { cloneDeep } from 'lodash-es';
  import { gridOptions, invCountSheetColumns } from '/@/components/ExTable/data';
  import {
    FormState,
    SearchDataType,
    SearchLink,
    SearchMatchType,
    SearchParams,
    tableParams,
  } from '/@/api/apiLink';
  import { OptTableHook } from '/@/api/utilHook';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();
  const GridOptions = gridOptions;
  const paneSize = ref<number>(16);
  const installPaneSize = ref<number>(16);
  //表格数据
  const tableRef = ref<any>('');
  const tableData = ref<object[]>([]);
  const tablePages = reactive(cloneDeep(tableParams));

  const go = useGo();
  import { useGo } from '/@/hooks/web/usePage';
  import { PageEnum } from '/@/enums/pageEnum';
  import { getInvList } from '/@/api/realTimeInv';
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
        descList: ['BsInventoryCount.update_time'],
      },
      pageIndex: currPage,
      pageRows: pageSize,
    });
    tablePages.total = res.total;
    tablePages.currentPage = currPage;
    tablePages.pageSize = pageSize;
    tableData.value = res.records;
    searchRef.value.moreSearchClose();
  };
  import { ExLinkQueryModal } from '/@/components/ExLinkQueryModal';
  const exLinkQueryModelRef: any = ref(null);
  const linkQueryMenuData: any = ref<any>([]);
  const modalTitle: any = ref<any>('');
  //上下查
  const upDownSearchEvent = async (row: any, status: string) => {
    let res;
    switch (status) {
      case 'A':
        res = await upSearch({ params: row });
        modalTitle.value = '盘点单-上查';
        linkQueryMenuData.value = res;
        break;
      case 'B':
        res = await downSearch({ params: row });
        modalTitle.value = '盘点单-下查';
        linkQueryMenuData.value = res;
        break;
    }
    //判断上查还是下查
    if (res && res.length > 0) {
      exLinkQueryModelRef.value.show();
    } else {
      createMessage.warning('没有相关关联单据');
    }
  };
  //重置
  const resetTable = () => {
    const searchFormState: FormState = {
      wlNo: '',
      wlName: '',
    };
    searchRef.value.setFormState(searchFormState);
    getList(1);
  };

  //添加
  const addTableEvent = () => {
    let groupId = '';
    go({
      path: PageEnum.INV_COUNT_SHEET_DETAIL,
      query: {
        groupId: groupId == '' ? '' : groupId,
      },
    });
  };
  //编辑
  const editTableEvent = (row) => {
    go({
      path: PageEnum.INV_COUNT_SHEET_DETAIL,
      query: {
        row: row.id,
      },
    });
  };
  import { ExPushDownModel } from '/@/components/ExPushDownModel';
  const ExPushDownModelRef: any = ref(null);
  const selectDtData = ref<any>([]);
  //下推
  const pushDownEvent = async (row: any) => {
    ExPushDownModelRef.value.show();
    selectDtData.value = row;
  };
  const pushDownSelect = async (pushDownParam: any) => {
    let val: string[] = [];
    selectDtData.value.map((item) => {
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
    selectDtData.value.map((item) => {
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
        params: selectDtData.value,
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

  //导出
  const exportTable = async () => {
    OptTableHook.exportExcel = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        exportExcel({
          params: {
            list: tableData.value,
            fileName: '盘点单',
          },
          pageIndex: tablePages.currentPage,
          pageRows: tablePages.pageSize,
        })
          .then((res) => {
            const data = { title: '盘点单.xls', data: res };
            resolve(data);
          })
          .catch((e) => {
            reject(e);
          });
      });
    };
  };
  //导入文件刷新
  // const refreshTable = () => {
  //   getList();
  // };

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
