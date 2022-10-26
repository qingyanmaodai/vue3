<template>
  <div class="default-theme" style="padding: 15px; height: 100%">
    <div style="background-color: #fff; height: 100%; padding: 0 6px">
      <Search
        :control="moreSearchData"
        ref="searchRef"
        tableName="BdExamineRule"
        searchNo="规则编码"
        searchName="规则名称"
        @getList="getList"
        @resetEvent="resetTable"
      />
      <ExTable
        :isShowImport="false"
        :isShowExport="false"
        :columns="exaRuleColumns"
        :gridOptions="GridOptions"
        :importConfig="importConfig"
        :tableData="tableData"
        :totalData="totalData"
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
      />
    </div>
  </div>
</template>

<script setup lang="ts" name="examine-rule-index">
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
  } from '/@/api/exaRule';
  import 'splitpanes/dist/splitpanes.css';
  import { cloneDeep } from 'lodash-es';
  import { gridOptions, exaRuleColumns } from '/@/components/ExTable/data';
  import { SearchParams } from '/@/api/apiLink';
  import { OptTableHook } from '/@/api/utilHook';
  import { PageEnum } from '/@/enums/pageEnum';
  import { useGo } from '/@/hooks/web/usePage';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();
  const go = useGo();
  const GridOptions = gridOptions;
  const paneSize = ref<number>(16);
  const installPaneSize = ref<number>(16);
  //导入上传文件api
  let importConfig = ref<string>('UPLOAD_EXA_RULE');
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
  //获取高级查询字段数据
  const moreSearchData = ref();
  getSearchOption({ params: '' }).then((res) => {
    moreSearchData.value = res;
  });
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
  //添加
  const addTableEvent = () => {
    let groupId = '';
    go({
      path: PageEnum.EXA_RULE_DETAIL,
      query: {
        groupId: groupId == '' ? '' : groupId,
      },
    });
  };
  //编辑
  const editTableEvent = (row) => {
    go({
      path: PageEnum.EXA_RULE_DETAIL,
      query: {
        row: row.id,
      },
    });
  };
  //删除表格单条数据
  const deleteRowTableEvent = async (row) => {
    await delById({ params: row.id });
    await getList();
  };
  //批量删除表格
  const deleteBatchEvent = async (rows: any[]) => {
    const ids = rows.map((item) => {
      return item.id;
    });
    const res = await delBatch({ params: ids });
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
            const data = { title: '抽检规则导入模板.xls', data: res };
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
            fileName: '抽检规则',
          },
          pageIndex: 1,
          pageRows: pages.pageSize,
        })
          .then((res) => {
            const data = { title: '抽检规则.xls', data: res };
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
