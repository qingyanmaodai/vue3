<template>
  <div style="height: 100%">
    <a-splitPanes class="default-theme" style="padding: 15px; height: 100%">
      <a-pane :size="paneSize">
        <ex-tree
          :toolbar="true"
          :search="true"
          :tree-data="treeData"
          ref="customerGroupTreeRef"
          title="客户分组"
          @editEvent="editGroupEvent"
          @addEvent="addGroupEvent"
          @addSubEvent="addGroupSubEvent"
          @deleteEvent="deleteGroupEvent"
          @selectEvent="selectGroupEvent"
        />
      </a-pane>
      <a-pane :size="100 - paneSize">
        <div style="background-color: #fff; height: 100%; padding: 0 6px">
          <Search
            :control="moreSearchData"
            ref="customerSearchRef"
            tableName="BdCustomer"
            searchNo="编码"
            searchName="客户"
            @getList="getCustomerList"
            @resetEvent="resetTable"
          />
          <ExTable
            :columns="customerColumns"
            :gridOptions="GridOptions"
            :tableData="tableData"
            :totalData="totalData"
            ref="customerTableRef"
            @addTableEvent="addTableEvent"
            @editTableEvent="editTableEvent"
            @deleteRowEvent="deleteRowTableEvent"
            @delBatchEvent="deleteMatBatchEvent"
            @auditRowEvent="auditRowEvent"
            @auditBatchEvent="auditBatchEvent"
            @unAuditRowEvent="unAuditRowEvent"
            @unAuditBatchEvent="unAuditBatchEvent"
            @exportTable="exportTable"
            @importModelEvent="importModelEvent"
            @getList="getCustomerList"
          />
        </div>
      </a-pane>
    </a-splitPanes>
  </div>
</template>

<script setup lang="ts" name="basic-customer-index">
  import { onActivated, onMounted, reactive, ref } from 'vue';
  import { PageEnum } from '/@/enums/pageEnum'; //页面路由
  import { useGo } from '/@/hooks/web/usePage'; //页面跳转
  const routerGo = useGo();
  import 'splitpanes/dist/splitpanes.css'; //分割容器css
  import { Pane, Splitpanes } from 'splitpanes'; //分割容器
  const ASplitPanes = Splitpanes;
  const APane = Pane;
  import { ExTree } from '/@/components/ExTree'; //树组件
  import { ExTable } from '/@/components/ExTable'; //表格组件
  import { Search } from '/@/components/Search'; //查询组件
  import { TreeItem } from '/@/components/Tree';
  import { OptGroupHook, OptTableHook } from '/@/api/utilHook';
  import { gridOptions, customerColumns } from '/@/components/ExTable/data'; //表格配置
  const GridOptions = gridOptions;
  import { useMessage } from '/@/hooks/web/useMessage'; //提示信息组件
  const { createMessage } = useMessage();
  import {
    audit,
    batchAuditCustomer,
    batchUnAuditCustomer,
    deleteCustomer,
    getCustomerData,
    unAudit,
    batchDeleteCustomer,
    exportCustomerData,
    customerImportModel,
    getCustomerEntity,
  } from '/@/api/customer';
  import {
    addCustomerGroup,
    editCustomerGroup,
    deleteCustomerGroup,
    queryOneCustomerGroup,
    getCustomerGroupTree,
    CustomerGroupEntity,
  } from '/@/api/customerGroup';
  import { SearchParams } from '/@/api/apiLink';

  /* data */
  const paneSize = ref(16); //面板尺寸
  const customerSearchRef: any = ref<String | null>(null); //表格查询组件引用ref
  const customerTableRef: any = ref<String | null>(null); //表格组件引用ref
  let tableData = ref<object[]>([]); //表格数据
  let totalData = ref<number>(0);
  const customerGroupTreeRef: any = ref<String | null>(null); //树组件引用ref
  let ParamsData: SearchParams[] = []; //查询参数数据
  const treeData = ref<TreeItem>([]); //树组件数据
  //分页参数
  const pages = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
  });

  /* method */

  /**
   * 获取客户列表
   * @param currPage
   * @param pageSize
   */
  const getCustomerList = async (currPage = 1, pageSize = pages.pageSize) => {
    ParamsData = [];
    if (
      customerGroupTreeRef.value.getSearchParams() &&
      customerGroupTreeRef.value.getSearchParams().length > 0
    ) {
      ParamsData = ParamsData.concat(customerGroupTreeRef.value.getSearchParams());
    }
    if (
      customerSearchRef.value.getSearchParams() &&
      customerSearchRef.value.getSearchParams().length > 0
    ) {
      ParamsData = ParamsData.concat(customerSearchRef.value.getSearchParams());
    }

    //表格查询
    const res: any = await getCustomerData({
      params: ParamsData,
      orderByBean: {
        descList: ['update_time'],
      },
      pageIndex: currPage,
      pageRows: pageSize,
    });
    totalData.value = res.total;
    pages.currentPage = currPage;
    tableData.value = res.records;
    customerSearchRef.value.moreSearchClose();
  };

  /**
   * 表格新增数据
   */
  const addTableEvent = () => {
    let groupId = customerGroupTreeRef.value.getSelectedKeys();
    routerGo({
      path: PageEnum.CUSTOMER_DETAIL, //客户详情页
      //需要带到详情页的参数
      query: {
        groupId: groupId == '' ? '' : groupId,
      },
    });
  };

  /**
   * 表格修改数据
   */
  const editTableEvent = (row) => {
    routerGo({
      path: PageEnum.CUSTOMER_DETAIL, //客户详情页
      query: {
        row: row.id,
      },
    });
  };

  /**
   * 表格审核事件
   * @param row
   */
  const auditRowEvent = async (row) => {
    await audit({
      params: row,
    });
    await getCustomerList();
    createMessage.success('操作成功');
  };

  /**
   * 表格批量审核事件
   */
  const auditBatchEvent = async (rows: any[]) => {
    const ids = rows.map((item) => {
      return item.id;
    });
    let res = await batchAuditCustomer({
      params: ids,
    });
    await customerTableRef.value.computeData(res);
    await getCustomerList();
  };

  /**
   * 表格反审核事件
   * @param row
   */
  const unAuditRowEvent = async (row: any) => {
    await unAudit({
      params: row,
    });
    await getCustomerList();
    createMessage.success('操作成功');
  };

  /**
   * 表格批量反审核事件
   */
  const unAuditBatchEvent = async (rows: any[]) => {
    const ids = rows.map((item) => {
      return item.id;
    });
    let res = await batchUnAuditCustomer({
      params: ids,
    });
    await customerTableRef.value.computeData(res);
    await getCustomerList();
  };

  /**
   * 表格批量删除事件
   */
  const deleteMatBatchEvent = async (rows: any[]) => {
    const ids = rows.map((item) => {
      return item.id;
    });
    let res = await batchDeleteCustomer({ params: ids });
    await customerTableRef.value.computeData(res);
    await getCustomerList();
  };
  /**
   * 表格删除事件
   * @param row
   */
  const deleteRowTableEvent = async (row) => {
    await deleteCustomer({ params: row.id });
    await getCustomerList();
  };

  /**
   * 刷新表格数据
   */
  const resetTable = () => {
    customerGroupTreeRef.value.setSelectedKeys([]);
    customerSearchRef.value.formState.wlNo = null;
    customerSearchRef.value.formState.wlName = null;
    getCustomerList();
  };

  /**
   * 导出
   */
  const exportTable = async () => {
    OptTableHook.exportExcel = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        exportCustomerData({
          params: {
            list: [],
            fileName: '客户列表',
          },
          pageIndex: 1,
          pageRows: pages.pageSize,
        })
          .then((res) => {
            const data = { title: '客户列表信息.xls', data: res };
            resolve(data);
          })
          .catch((e) => {
            reject(e);
          });
      });
    };
  };

  /**
   * 下载导入模板
   */
  const importModelEvent = async () => {
    OptTableHook.importModel = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        customerImportModel({
          params: '导入模板',
        })
          .then((res) => {
            const data = { title: '客户信息导入模板.xls', data: res };
            resolve(data);
          })
          .catch((e) => {
            reject(e);
          });
      });
    };
  };

  /**
   * 获取高级查询下拉框
   */
  const moreSearchData = ref();
  getCustomerEntity().then((res) => {
    moreSearchData.value = res;
  });

  /**
   * 选中分组事件
   * @param selectedKeys
   * @param data
   */
  const selectGroupEvent = (selectedKeys: string[], data: any) => {
    console.log(selectedKeys, data);
    getCustomerList();
  };

  /**
   * 新增客户分组
   */
  const addGroupEvent = () => {
    customerGroupTreeRef.value.resetGroupFormData();
    OptGroupHook.submitGroup = async () => {
      await addCustomerGroup({
        params: {
          number: customerGroupTreeRef.value.groupFormData.number,
          name: customerGroupTreeRef.value.groupFormData.name,
        },
      });
      await refreshTree();
    };
  };

  /**
   * 编辑客户分组
   * @param node
   */
  const editGroupEvent = async (node: TreeItem) => {
    const result = await queryOneCustomerGroup({ params: node.key?.toString() || '0' });
    if (result) {
      customerGroupTreeRef.value.groupFormData.number = result.number;
      customerGroupTreeRef.value.groupFormData.name = result.name;
      customerGroupTreeRef.value.groupFormData.id = result.id;
      customerGroupTreeRef.value.groupFormData.parent = { id: result.id, name: result.name };
    }
    OptGroupHook.submitGroup = async () => {
      await editCustomerGroup({
        params: {
          id: node.key?.toString() || '0',
          number: customerGroupTreeRef.value.groupFormData.number,
          name: customerGroupTreeRef.value.groupFormData.name,
        },
      });
      await refreshTree();
    };
  };

  /**
   * 新增客户下级分组
   * @param node
   */
  const addGroupSubEvent = (node: TreeItem) => {
    customerGroupTreeRef.value.resetGroupFormData();
    customerGroupTreeRef.value.groupFormData.parent = { id: node.key, name: node.title };
    OptGroupHook.submitGroup = async () => {
      await addCustomerGroup({
        params: {
          parentId: node.key?.toString() || '0',
          number: customerGroupTreeRef.value.groupFormData.number,
          name: customerGroupTreeRef.value.groupFormData.name,
        },
      });
      await refreshTree();
    };
  };
  /**
   * 删除客户分组
   * @param node
   */
  const deleteGroupEvent = (node: TreeItem) => {
    OptGroupHook.submitGroup = async () => {
      await deleteCustomerGroup({ params: node.key ? node.key.toString() : '' });
      await refreshTree();
    };
  };
  /**
   * 刷新树
   */
  const refreshTree = async () => {
    const tree = await getCustomerGroupTree({ params: '0' });
    runTree(tree);
    treeData.value = tree;
  };
  /**
   * 初始化树
   * @param tree
   */
  const runTree = (tree: CustomerGroupEntity[]) => {
    tree.forEach((item) => {
      item.title = item.name;
      item.key = item.id;
      runTree(item.children || []);
    });
  };
  /**
   * 页面加载
   */
  onMounted(() => {
    refreshTree();
    getCustomerList();
  });
  /**
   * 被keep-alive 缓存的组件激活时调用
   */
  onActivated(() => {
    getCustomerList();
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
