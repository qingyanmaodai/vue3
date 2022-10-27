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
        :columns="unitColumns"
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

<script setup lang="ts" name="basic-unit-index">
  import { ExTable } from '/@/components/ExTable';
  import { Search } from '/@/components/Search';
  import { onActivated, onMounted, reactive, ref } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { gridOptions, unitColumns } from '/@/components/ExTable/data';
  import { SearchParams } from '/@/api/apiLink';
  import { OptTableHook } from '/@/api/utilHook';
  import { useGo } from '/@/hooks/web/usePage';
  import { PageEnum } from '/@/enums/pageEnum';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    auditUnitList,
    auditUnitListBatch,
    delUnitListBatch,
    delUnitListById,
    exportUnitList,
    getUnitOption,
    getUnitTable,
    importUnitModel,
    unAuditUnitList,
    unAuditUnitListBatch,
  } from '/@/api/unit';
  const { createMessage } = useMessage();
  const go = useGo();
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
    const res: any = await getUnitTable({
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
    go({
      path: PageEnum.UNIT_DETAIL,
    });
  };
  //编辑
  const editTableEvent = (row) => {
    go({
      path: PageEnum.UNIT_DETAIL,
      query: {
        row: row.id,
      },
    });
  };
  //删除表格单条数据
  const deleteRowTableEvent = async (row) => {
    await delUnitListById({ params: row.id });
    createMessage.success('删除成功');
    await getList();
  };
  //批量删除表格
  const deleteBatchEvent = async (rows: any[]) => {
    const ids = rows.map((item) => {
      return item.id;
    });
    const res = await delUnitListBatch({ params: ids });
    await tableRef.value.computeData(res);
    await getList();
  };
  //审核单条
  const auditRowEvent = async (row) => {
    await auditUnitList({
      params: row,
    });
    createMessage.success('审核成功');
    await getList();
  };
  //单条反审核
  const unAuditRowEvent = async (row: any) => {
    await unAuditUnitList({
      params: row,
    });
    createMessage.success('反审核成功');
    await getList();
  };
  //批量审核事件
  const auditBatchEvent = async (rows: any[]) => {
    const ids = rows.map((item) => {
      return item.id;
    });
    const res = await auditUnitListBatch({
      params: ids,
    });
    await tableRef.value.computeData(res);
    await getList();
  };

  //批量反审核
  const unAuditBatchEvent = async (rows: any[]) => {
    const ids = rows.map((item) => {
      return item.id;
    });
    const res = await unAuditUnitListBatch({
      params: ids,
    });
    await tableRef.value.computeData(res);
    await getList();
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
