<template>
  <vxe-modal
    v-model="isShow"
    height="83%"
    width="80%"
    show-zoom
    resize
    :position="{ top: 40 }"
    @close="close"
  >
    <template #title>
      <span>{{ props.modalTitle }}</span>
    </template>
    <a-splitPanes class="default-theme" style="padding: 5px; height: 100%">
      <pane :size="paneSize">
        <div style="background-color: #fff; height: 100%">
          <a-menu
            mode="inline"
            v-model:selectedKeys="selectedKeys"
            :openKeys="['sub1']"
            @click="handleClick"
          >
            <a-sub-menu key="sub1">
              <template #title>全部</template>
              <a-menu-item v-for="(item, index) in props.linkQueryMenuData" :key="index">
                {{ item.tarBillIds.length > 0 ? item.name : item.source }} ({{
                  item.tarBillIds.length > 0 ? item.tarBillIds.length : item.srcBillIds.length
                }})</a-menu-item
              >
            </a-sub-menu>
          </a-menu>
        </div>
      </pane>
      <pane :size="100 - paneSize" style="background-color: #fff">
        <ExTable
          :isShowImport="false"
          :isShowExport="false"
          :tableName="props.tableName"
          :columns="tableColumns"
          :gridOptions="linkQueryGridOptions"
          :totalData="totalData"
          :tableData="tableData"
          :height="height"
          ref="tableRef"
          @editTableEvent="editTableEvent"
          v-if="tableShow"
          @getList="getList"
        />
      </pane>
    </a-splitPanes>
  </vxe-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { Pane, Splitpanes } from 'splitpanes';
  import { MenuItem, Menu, SubMenu } from 'ant-design-vue';
  import 'splitpanes/dist/splitpanes.css';
  import { ExTable } from '/@/components/ExTable';
  import { VxeGridPropTypes } from 'vxe-table/types/all';
  import { useGo } from '/@/hooks/web/usePage';
  import { getUpDownSearchList } from '/@/enums/routeEnum';
  import { linkQueryGridOptions } from '/@/components/ExTable/data';
  import { getPublicList } from '/@/api/public';
  import { SearchDataType, SearchLink, SearchMatchType } from '/@/api/apiLink';
  import { cloneDeep } from 'lodash-es';
  let height = '90%';
  const ASplitPanes = Splitpanes;
  const paneSize = ref<number>(12);
  const isShow = ref<boolean>(false); //弹框可见性，默认为关闭
  const tableShow = ref<boolean>(false); //表格可见性，默认为关闭
  const currKey = ref<any>({});
  const tableRef = ref<any>('');
  const tableColumns: any = ref<VxeGridPropTypes.Columns[]>([]);
  let tableData = ref<object[]>([]);
  let totalData = ref<number>(0);
  const AMenuItem = MenuItem;
  const AMenu = Menu;
  const ASubMenu = SubMenu;
  const selectedKeys = ref<any[]>([]);
  interface linkQueryMenuData {
    source: string;
    id?: string;
    mark?: string;
    name: string;
    routeTo: string;
    srcBillIds: any[];
    srcBillType: string;
    tarBillIds: any[];
    tarBillLkType: string;
    tarBillType: string;
    tenantId: number;
  }
  interface ProType {
    modalTitle: string;
    tableName: string;
    linkQueryMenuData: linkQueryMenuData[];
  }
  const props = withDefaults(defineProps<ProType>(), {
    tableName: '',
    modalTitle: '下查',
    linkQueryMenuData: () => {
      return [];
    },
  });
  const show = async () => {
    isShow.value = true;
  };
  const close = () => {
    isShow.value = false;
    tableShow.value = false;
    selectedKeys.value = [];
  };
  const handleClick = (e) => {
    currKey.value = e.key;
    getList();
  };
  //分页信息
  const pages = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
  });
  //点击关联查询
  const getList = async (currPage = 1, pageSize = pages.pageSize) => {
    let filter;
    if (props.linkQueryMenuData[currKey.value].tarBillIds.length > 0) {
      filter = getUpDownSearchList.filter(
        (arr) => arr.type === props.linkQueryMenuData[currKey.value].tarBillType,
      );
    } else {
      filter = getUpDownSearchList.filter(
        (arr) => arr.type === props.linkQueryMenuData[currKey.value].srcBillType,
      );
    }
    let listUrl = filter[0].listUrl;
    //删除筛选出来的操作那一列
    tableColumns.value = cloneDeep(filter[0].TableCols);
    tableColumns.value.splice(
      cloneDeep(filter[0].TableCols).findIndex((item) => {
        return item.field === 'operate';
      }),
      1,
    );
    // 查询表格
    let res: any = await getPublicList(
      {
        params: [
          {
            table: '',
            name: 'id',
            column: 'id',
            link: SearchLink.AND,
            rule: SearchMatchType.IN,
            type: SearchDataType.string,
            val:
              props.linkQueryMenuData[currKey.value].tarBillIds.length > 0
                ? props.linkQueryMenuData[currKey.value].tarBillIds
                : props.linkQueryMenuData[currKey.value].srcBillIds,
            startWith: '',
            endWith: '',
          },
        ],
        pageIndex: currPage,
        pageRows: pageSize,
      },
      listUrl,
    );
    tableShow.value = true;
    totalData.value = res.total;
    pages.currentPage = currPage;
    pages.pageSize = pageSize;
    tableData.value = res.records;
  };
  const go = useGo();
  //跳转到详情
  const editTableEvent = (row) => {
    let filter;
    if (props.linkQueryMenuData[currKey.value].tarBillIds.length > 0) {
      filter = getUpDownSearchList.filter(
        (e) => e.type === props.linkQueryMenuData[currKey.value].tarBillType,
      );
    } else {
      filter = getUpDownSearchList.filter(
        (e) => e.type === props.linkQueryMenuData[currKey.value].srcBillType,
      );
    }
    let detailUrl = filter[0].detailUrl;
    go({
      path: detailUrl,
      query: {
        row: row.id,
      },
    });
  };

  defineExpose({
    show,
    close,
  });
</script>
<style scoped lang="less">
  .content {
    height: 100%;
    padding: 30px;
    display: flex;
    flex-wrap: wrap;
  }
  .contentNode {
    padding-bottom: 20px;
    padding-left: 50px;
    display: flex;
    width: 50%;
    margin: 0 !important;
  }
</style>
