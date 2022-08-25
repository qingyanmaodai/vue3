<template>
  <div style="height: 100%">
    <div style="background-color: #fff; height: 100%">
      <Search
        ref="searchRef"
        tableName=""
        searchNo="仓位编码："
        searchName="仓位名称："
        @getList="getList"
        @resetEvent="resetTable"
      />
      <ExTable
        style="margin-left: 15px"
        :columns="stockLocationColumns"
        :buttons="buttons"
        :gridOptions="GridOptions"
        :importConfig="importConfig"
        ref="tableRef"
        @addEvent="addTableEvent"
        @editEvent="editTableEvent"
        @deleteRowEvent="deleteRowTableEvent"
        @delBatchEvent="deleteBatchEvent"
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

<script setup lang="ts" name="basic-stockLocation-index">
  import { ExTable } from '/@/components/ExTable';
  import { Search } from '/@/components/Search';
  import { onActivated, onMounted, reactive, ref } from 'vue';
  import { Pager, VxePagerEvents } from 'vxe-table';
  import { cloneDeep } from 'lodash-es';
  import { gridOptions, stockLocationColumns } from '/@/components/ExTable/data';
  import { SearchParams } from '/@/api/apiLink';
  import { OptTableHook } from '/@/api/utilHook';
  import { useGo } from '/@/hooks/web/usePage';
  import { PageEnum } from '/@/enums/pageEnum';
  import {
    getLocationOption,
    auditStockLocationList,
    auditStockLocationListBatch,
    delStockLocationListBatch,
    delStockLocationListById,
    exportStockLocationList,
    getStockLocationTable,
    importStockLocationModel,
    unAuditStockLocationList,
    unAuditStockLocationListBatch,
  } from '/@/api/stockLocation';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  const go = useGo();
  const GridOptions = gridOptions;
  const paneSize = ref<number>(16);
  const installPaneSize = ref<number>(16);
  //表格事件
  const tableRef: any = ref<String | null>(null);
  //查询组件
  const searchRef: any = ref<String | null>(null);
  //导入上传文件api
  let importConfig = ref<string>('IMPORT_STOCK_LOCATION_LIST');
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
    const moreSearchData = await getLocationOption(paramsNull);
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
    const res: any = await getStockLocationTable({
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
      onClick: () => {
        auditEvent();
      },
    },
    {
      type: 'default',
      label: '反审核',
      onClick: () => {
        unAuditEvent();
      },
    },
    {
      type: 'danger',
      label: '批量删除',
      onClick: () => {
        delTableEvent();
      },
    },
  ];

  //添加
  const addTableEvent = () => {
    go({
      path: PageEnum.STOCK_LOCATION_DETAIL_AND_EDIT,
    });
  };
  //编辑
  const editTableEvent = (row) => {
    go({
      path: PageEnum.STOCK_LOCATION_DETAIL_AND_EDIT,
      query: {
        row: row.id,
      },
    });
    console.log('编辑:', row.id);
  };
  //删除表格单条数据
  const deleteRowTableEvent = async (row) => {
    await delStockLocationListById({ params: row.id });
    createMessage.success('删除成功');
    await getList();
  };
  //批量删除表格
  const delTableEvent = () => {
    tableRef.value.delTable();
  };
  const deleteBatchEvent = async (rows: any[]) => {
    const ids = rows.map((item) => {
      return item.id;
    });
    const res = await delStockLocationListBatch({ params: ids });
    await tableRef.value.computeData(res);
    await getList();
  };
  //审核单条
  const auditRowEvent = async (row) => {
    await auditStockLocationList({
      params: row,
    });
    createMessage.success('审核成功');
    await getList();
  };

  //批量审核事件
  const auditEvent = () => {
    tableRef.value.auditTable();
  };
  const auditBatchEvent = async (rows: any[]) => {
    const ids = rows.map((item) => {
      return item.id;
    });
    const res = await auditStockLocationListBatch({
      params: ids,
    });
    await tableRef.value.computeData(res);
    await getList();
  };
  //单条反审核
  const unAuditRowEvent = async (row: any) => {
    await unAuditStockLocationList({
      params: row,
    });
    createMessage.success('反审核成功');
    await getList();
  };
  //批量反审核
  const unAuditEvent = () => {
    tableRef.value.unAuditTable();
  };
  const unAuditBatchEvent = async (rows: any[]) => {
    const ids = rows.map((item) => {
      return item.id;
    });
    const res = await unAuditStockLocationListBatch({
      params: ids,
    });
    await tableRef.value.computeData(res);
    await getList();
  };
  //下载模板
  const importModelEvent = async () => {
    OptTableHook.importModel = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        importStockLocationModel({
          params: '导入模板',
        })
          .then((res) => {
            const data = { title: '仓位信息导入模板.xls', data: res };
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
        exportStockLocationList({
          params: {
            list: getParams,
            fileName: '仓位料列表',
          },
          pageIndex: 1,
          pageRows: pages.pageSize,
        })
          .then((res) => {
            const data = { title: '仓位列表信息.xls', data: res };
            resolve(data);
          })
          .catch((e) => {
            reject(e);
          });
      });
    };
  };
  //导入文件刷新页面
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
