<template>
  <div class="default-theme" style="padding: 15px; height: 100%">
    <div style="background-color: #fff; height: 100%; padding: 0 6px">
      <Search
        :control="moreSearchData"
        ref="searchRef"
        tableName="BsProMoInStock"
        searchNo="模板名称"
        :showSearchName="false"
        @getList="getList"
        @resetEvent="resetTable"
      />
      <ExTable
        :isShowImport="false"
        :columns="barcodeTemplateColumns"
        :gridOptions="GridOptions"
        :tableData="tableData"
        :tablePages="tablePages"
        tableName="BarcodeTemplate"
        ref="tableRef"
        @addTableEvent="addTableEvent"
        @editTableEvent="editTableEvent"
        @deleteRowEvent="deleteRowTableEvent"
        @delBatchEvent="deleteBatchEvent"
        @auditRowEvent="auditRowEvent"
        @auditBatchEvent="auditBatchEvent"
        @unAuditRowEvent="unAuditRowEvent"
        @unAuditBatchEvent="unAuditBatchEvent"
        @getList="getList"
      />
    </div>
  </div>
</template>
<script setup lang="ts" name="barcode-barcodeTemplate-index">
  import { ExTable } from '/@/components/ExTable';
  import { Search } from '/@/components/Search';
  import { onActivated, onMounted, reactive, ref } from 'vue';
  import {
    audit,
    auditBatch,
    delBatch,
    delById,
    getDataList,
    getSearchOption,
    unAudit,
    unAuditBatch,
  } from '/@/api/warProduce/instock';
  import 'splitpanes/dist/splitpanes.css';
  import { cloneDeep } from 'lodash-es';
  import { gridOptions, barcodeTemplateColumns } from '/@/components/ExTable/data';
  import { FormState, SearchParams, tableParams } from '/@/api/apiLink';
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
        descList: ['BsProMoInStock.update_time'],
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
  //重置
  const resetTable = () => {
    const searchFormState: FormState = {
      wlNo: '',
      wlName: '',
    };
    searchRef.value.setFormState(searchFormState);
    getList();
  };

  //添加
  const addTableEvent = () => {
    let groupId = '';
    go({
      path: PageEnum.BARCODE_Template_DETAIL,
      query: {
        groupId: groupId == '' ? '' : groupId,
      },
    });
  };
  //编辑
  const editTableEvent = (row) => {
    go({
      path: PageEnum.WAR_PRO_INSTOCK_DETAIL,
      query: {
        row: row.id,
      },
    });
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

  //获取高级查询字段数据
  // const moreSearchData = ref();
  // getSearchOption({ params: '' }).then((res) => {
  //   moreSearchData.value = res;
  // });
  onMounted(() => {
    paneSize.value = cloneDeep(installPaneSize.value);
    // getList();
  });
  //被keep-alive 缓存的组件激活时调用
  onActivated(() => {
    // getList();
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
