<template>
  <div style="height: 100%">
    <div style="background-color: #fff; height: 100%">
      <Search
        ref="searchRef"
        tableName=""
        searchNo="仓库编码："
        searchName="仓库名称："
        @getList="getList"
        @resetEvent="resetTable"
      />
      <ExTable
        style="margin-left: 15px"
        :columns="stockColumns"
        :buttons="buttons"
        :gridOptions="GridOptions"
        :importConfig="importConfig"
        ref="tableRef"
        @addEvent="addTableEvent"
        @editEvent="editTableEvent"
        @deleteRowEvent="deleteRowTableEvent"
        @delBatchEvent="deleteMatBatchEvent"
        @auditRowEvent="auditRowEvent"
        @auditBatchEvent="auditBatchEvent"
        @unAuditRowEvent="unAuditRowEvent"
        @unAuditBatchEvent="unAuditBatchEvent"
        @exportTable="exportTable"
        @importModelEvent="importModelEvent"
        @refreshTable="refreshTable"
      />
      <div>
        <Pager
          background
          v-model:current-page="pages.currentPage"
          v-model:page-size="pages.pageSize"
          :total="pages.total"
          :layouts="[
            'PrevJump',
            'PrevPage',
            'JumpNumber',
            'NextPage',
            'NextJump',
            'Sizes',
            'FullJump',
            'Total',
          ]"
          @page-change="tablePagerChange"
          style="width: calc(100% - 5px); height: 42px; margin: 4px"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="basic-mainStock-index">
  import { ExTable } from '/@/components/ExTable';
  import { Search } from '/@/components/Search';
  import { onActivated, onMounted, reactive, ref } from 'vue';
  import { Pager, VxePagerEvents } from 'vxe-table';
  import { cloneDeep } from 'lodash-es';
  import { gridOptions, stockColumns } from '/@/components/ExTable/data';
  import { SearchParams } from '/@/api/apiLink';
  import { OptTableHook } from '/@/api/utilHook';
  import { useGo } from '/@/hooks/web/usePage';
  import { PageEnum } from '/@/enums/pageEnum';
  import {
    getStockOption,
    auditStockList,
    auditStockListBatch,
    delStockListBatch,
    delStockListById,
    exportStockList,
    getStockTable,
    importStockModel,
    unAuditStockList,
    unAuditStockListBatch,
  } from '/@/api/mainStock';
  const go = useGo();
  const GridOptions = gridOptions;
  const paneSize = ref<number>(16);
  const installPaneSize = ref<number>(16);
  //表格事件
  const tableRef: any = ref<String | null>(null);
  //查询组件
  const searchRef: any = ref<String | null>(null);
  //导入上传文件api
  let importConfig = ref<string>('IMPORT_STOCK_LIST');
  //分页信息
  const pages = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
  });
  let getParams: SearchParams[] = [];
  const tablePagerChange: VxePagerEvents.PageChange = async ({ currentPage, pageSize }) => {
    pages.currentPage = currentPage;
    pages.pageSize = pageSize;
    await getList(currentPage);
  };
  //空参数
  const paramsNull = { params: '' };
  //获取高级查询字段数据
  const getOptions = async () => {
    const moreSearchData = await getStockOption(paramsNull);
    searchRef.value.getOptions(moreSearchData);
  };
  getOptions();
  //表格查询
  const getList = async (currPage = 1, pageSize = pages.pageSize) => {
    getParams = [];
    if (searchRef.value.getSearchParams() && searchRef.value.getSearchParams().length > 0) {
      getParams = getParams.concat(searchRef.value.getSearchParams());
    }
    //表格查询
    const res: any = await getStockTable({
      params: getParams,
      orderByBean: {
        descList: ['update_time'],
      },
      pageIndex: currPage,
      pageRows: pageSize,
    });
    pages.total = res.total;
    pages.currentPage = currPage;
    let data = res.records;
    tableRef.value.init(data);
    searchRef.value.moreSearchClose();
  };

  //重置
  const resetTable = () => {
    searchRef.value.formState.wlNo = null;
    searchRef.value.formState.wlName = null;
    getList(1);
  };

  //按钮----批量
  const buttons = [
    {
      type: 'primary',
      label: '添加',
      onClick: () => {
        addTableEvent();
      },
    },
    {
      type: 'primary',
      label: '审核',
      onClick: (row) => {
        auditEvent(row);
      },
    },
    {
      type: 'default',
      label: '反审核',
      onClick: (row) => {
        unAuditEvent(row);
      },
    },
    {
      type: 'danger',
      label: '批量删除',
      onClick: (row) => {
        delTableEvent(row);
      },
    },
  ];

  //添加
  const addTableEvent = () => {
    go({
      path: PageEnum.MAIN_STOCK_DETAIL_AND_EDIT,
    });
  };
  //编辑
  const editTableEvent = (row) => {
    go({
      path: PageEnum.MAIN_STOCK_DETAIL_AND_EDIT,
      query: {
        row: row.id,
      },
    });
    console.log('编辑:', row.id);
  };
  //删除表格单条数据
  const deleteRowTableEvent = async (row) => {
    await delStockListById({ params: row.id });
    await getList();
  };
  //批量删除表格
  const delTableEvent = (row) => {
    tableRef.value.delTable(row);
  };
  const deleteMatBatchEvent = async (row) => {
    await delStockListBatch({ params: row });
    await getList();
  };
  //审核单条
  const auditRowEvent = async (row) => {
    console.log('231e3e3', row.id);
    await auditStockList({
      params: {
        id: row.id,
      },
    });
    await getList();
  };

  //批量审核事件
  const auditEvent = (row) => {
    tableRef.value.auditTable(row);
  };
  let res: any = '';
  const auditBatchEvent = async (row) => {
    res = await auditStockListBatch({
      params: row,
    });
    await tableRef.value.computeData(res);
    await getList();
  };
  //单条反审核
  const unAuditRowEvent = async (row: any) => {
    await unAuditStockList({
      params: {
        id: row?.id,
      },
    });
    await getList();
  };
  //批量反审核
  const unAuditEvent = (row) => {
    tableRef.value.unAuditTable(row);
  };
  const unAuditBatchEvent = async (row) => {
    res = await unAuditStockListBatch({
      params: row,
    });
    await tableRef.value.computeData(res);
    await getList();
  };
  //下载模板
  const importModelEvent = async () => {
    OptTableHook.importModel = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        importStockModel({
          params: '导入模板',
        })
          .then((res) => {
            const data = { title: '仓库信息导入模板.xls', data: res };
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
        exportStockList({
          params: {
            list: getParams,
            fileName: '仓库料列表',
          },
          pageIndex: 1,
          pageRows: pages.pageSize,
        })
          .then((res) => {
            const data = { title: '仓库列表信息.xls', data: res };
            resolve(data);
          })
          .catch((e) => {
            reject(e);
          });
      });
    };
  };
  //导入文件页面刷新
  const refreshTable = () => {
    getList();
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
