<template>
  <vxe-modal v-model="isShow" height="82%" width="80%" show-zoom resize :position="{ top: 40 }">
    <template #title>
      <span>{{ props.modalTitle }}</span>
    </template>
    <a-splitPanes class="default-theme" style="padding: 5px; height: 100%">
      <pane :size="paneSize">
        <div style="background-color: #fff; height: 100%; padding: 0 6px">
          <a-menu>
            <a-sub-menu key="sub4">
              <template #icon>
                <QqOutlined />
              </template>
            <template v-for="(item, index) in props.linkQueryMenuData" :key="index">
              <a-menu-item> {{ item.name }} ({{ item.tarBillIds.length }})</a-menu-item>
            </template>
            </a-sub-menu>
          </a-menu>
        </div>
      </pane>
      <pane :size="100 - paneSize">
        <vxe-grid
          ref="xGrid"
          v-bind="props.gridOptions"
          :data="tableData"
          :columns="unitColumns"
          :export-config="{}"
        >
          <template #status="{ row }">
            <Tag :color="row.bsStatus === 'B' ? 'processing' : 'default'" v-if="row.bsStatus">{{
              formatData(row.bsStatus, config['DATA_STATUS'])
            }}</Tag>
          </template>
          <template #bsType="{ row }">
            <Tag v-if="row.bsType">{{ formatData(row.bsType, config['UNIT_TYPE']) }}</Tag>
          </template>
          <template #attr="{ row }">
            <Tag v-if="row.attr">{{ formatData(row.attr, config['MATERIAL_ATTR']) }}</Tag>
          </template>
        </vxe-grid>
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
      </pane>
    </a-splitPanes>
  </vxe-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue';
  import { MailOutlined, QqOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue';
  import { Pane, Splitpanes } from 'splitpanes';
  import { Tag, MenuItem, Menu, SubMenu } from 'ant-design-vue';
  import 'splitpanes/dist/splitpanes.css';
  import { config, configEntity } from '/@/utils/publicParamConfig';
  import { SearchParams } from '/@/api/apiLink';
  import { Pager, VxePagerEvents } from 'vxe-table';
  import { getMatTable } from '/@/api/matTable';
  import { VxeGridPropTypes } from 'vxe-table/types/all';
  import { unitColumns } from '/@/components/AMoreSearch/data';

  const ASplitPanes = Splitpanes;
  const paneSize = ref<number>(12);
  const isShow = ref<boolean>(false); //弹框可见性，默认为关闭
  let tableData = ref<object[]>([]);
  const AMenuItem = MenuItem;
  const AMenu = Menu;
  const ASubMenu = SubMenu;
  // type Emits = {};
  // const emit = defineEmits<Emits>();

  //格式化数据
  const formatData = (data: string | number, source: configEntity[]) => {
    let res;
    if (source && source.length > 0) {
      res = source.find((item) => item.value === data);
    }
    return res ? res.label : '';
  };
  interface ProType {
    modalTitle: string;
    tableName: string;
    // control: ControlSet[];
    gridOptions: any;
    tableCols: VxeGridPropTypes.Columns;
    linkQueryMenuData: object[];
  }
  const props = withDefaults(defineProps<ProType>(), {
    tableName: '',
    modalTitle: '下查',
    linkQueryMenuData: () => {
      return [];
    },
  });
  const treeData = [
    {
      title: '0-0',
      key: '0-0',
      children: [
        { title: '0-0-0-0', key: '0-0-0-0' },
        { title: '0-0-0-1', key: '0-0-0-1' },
        { title: '0-0-0-2', key: '0-0-0-2' },
      ],
    },
  ];
  const selectTree = () => {
    console.log('selectTree');
  };
  const expandedKeys = ref<string[]>(['0-0-0', '0-0-1']);

  const show = async () => {
    isShow.value = true;
  };
  const close = () => {
    isShow.value = false;
  };

  watch(expandedKeys, () => {
    console.log('expandedKeys', expandedKeys);
  });
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
    // await getList(currentPage);
  };
  //表格查询
  const getList = async (currPage = 1, pageSize = pages.pageSize) => {
    getParams = [];
    //表格查询
    const res: any = await getMatTable({
      params: getParams,
      orderByBean: {
        descList: ['BdMaterial.update_time'],
      },
      pageIndex: currPage,
      pageRows: pageSize,
    });
    pages.total = res.total;
    pages.currentPage = currPage;
    tableData.value = res.records;
  };
  getList();
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
