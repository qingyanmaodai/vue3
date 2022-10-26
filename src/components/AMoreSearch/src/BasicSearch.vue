<template>
  <vxe-modal
    v-model="isShow"
    id="basicSearchModal"
    show-zoom
    resize
    :position="{ top: 40 }"
    width="55%"
    @close="handleClose"
  >
    <div class="form-style">
      <Row class="row">
        <a-space>
          <span style="font-weight: bolder">查询条件</span>
          <Col>
            <vxe-select
              clearable
              v-model="defaultParam.name"
              placeholder="请选择"
              style="width: 200px"
              transfer
              @change="handleChange"
            >
              <vxe-option
                v-for="(v2, i2) in props.control"
                :value="v2.propName"
                :label="v2.displayName"
                :key="i2 + 'col1'"
              />
            </vxe-select>
          </Col>
          <Col>
            <vxe-select
              v-model="defaultParam.rule"
              :options="defaultParam.ruleType"
              style="width: 100px"
              transfer
            />
          </Col>
          <Col>
            <a-input v-show="!defaultParam.name" style="width: 200px" disabled />
            <vxe-select
              v-show="defaultParam.control.controlType === 'select'"
              v-model="defaultParam.val"
              placeholder="请选择..."
              style="width: 200px"
              transfer
            >
              <vxe-option
                v-for="(item, optionIndex) in config[defaultParam.control.queryConfig]"
                :key="optionIndex"
                :value="item.value"
                :label="item.label"
              />
            </vxe-select>
            <a-input
              v-show="defaultParam.control.controlType === 'input'"
              style="width: 200px"
              placeholder="请输入..."
              v-model:value="defaultParam.val"
            />
            <a-input-search
              v-show="defaultParam.control.controlType === 'inputSearch'"
              style="width: 200px"
              onfocus="this.blur();"
              placeholder="请选择输入..."
              v-model:value="defaultParam.valLabel"
              @click="onSearch(defaultParam)"
              @search="onSearch(defaultParam)"
            />
            <a-space
              direction="vertical"
              :size="12"
              v-show="defaultParam.control.controlType === 'date'"
            >
              <a-date-picker
                v-if="defaultParam.control.controlType === 'date'"
                style="width: 200px"
                v-model:value="defaultParam.val"
                placeholder="请选择时间..."
                valueFormat="YYYY-MM-DD"
              />
            </a-space>
            <a-tree-select
              v-if="defaultParam.control.controlType === 'treeSelect'"
              v-model:value="defaultParam.val"
              show-search
              treeNodeFilterProp="title"
              :replaceFields="{ label: 'name', value: 'id', key: 'id' }"
              style="width: 200px"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              placeholder="请选择"
              allow-clear
              tree-default-expand-all
              :tree-data="defaultParam.treeData"
            />
          </Col>
          <span style="margin-left: 10px">
            <a-button type="primary" class="x-button" @click="resetSearch">重置</a-button>
            <a-button type="primary" class="x-button" @click="searchEvent">查询</a-button>
            <a-button
              class="x-button"
              style="background-color: #2f4056; color: #fff"
              @click="childMoreSearchEvent"
              >高级查询</a-button
            >
          </span>
        </a-space>
      </Row>
      <!--          table表单                  -->
      <vxe-grid
        ref="xGrid"
        v-bind="props.gridOptions"
        :data="tableData"
        :columns="props.tableCols"
        :export-config="{}"
        @cell-dblclick="cellClickEvent"
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
      <vxe-pager
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
      />
    </div>
    <template #title>
      <span>基础信息查询</span>
    </template>
  </vxe-modal>
  <!--    高级查询弹框     -->
  <MoreSearchByBasic
    v-if="isShow"
    ref="childMoreSearchRef"
    @searchEvent="searchEvent"
    :control="controlOfBasic"
    :tableName="basicTableName"
  />

  <!--  基础信息查询-->
  <BasicSearch
    v-if="isShow"
    @basicClickEvent="basicClickEvent"
    :gridOptions="basicGridOptions"
    ref="childBasicSearchRef"
    :control="basicControl"
    :tableCols="basicTableCols"
    :tableName="basicTableName"
  />
</template>
<script lang="ts" setup>
  import {
    Button,
    Row,
    Col,
    Input,
    DatePicker,
    Space,
    InputSearch,
    Tag,
    TreeSelect,
  } from 'ant-design-vue';
  import { reactive, ref, toRef, onMounted} from 'vue';
  import { VxeGridEvents, VxeGridInstance, VxePagerEvents } from 'vxe-table';
  import { config, configEntity } from '/@/utils/publicParamConfig';
  import { getPublicList } from '/@/api/public';
  import { cloneDeep } from 'lodash-es';
  import { BasicSearch, MoreSearch } from '/@/components/AMoreSearch';
  import { basicGridOptions } from '/@/components/AMoreSearch/data';
  const MoreSearchByBasic = MoreSearch;
  const ASpace = Space;
  const AButton = Button;
  const AInput = Input;
  const AInputSearch = InputSearch;
  const ADatePicker = DatePicker;
  const ATreeSelect = TreeSelect;
  import {
    ControlSet,
    SearchDataType,
    SearchLink,
    SearchMatchType,
    SearchParams,
    TableColum,
    Url,
  } from '/@/api/apiLink';
  import { VxeGridPropTypes } from 'vxe-table/types/all';
  import { TreeItem } from '/@/components/Tree';

  type Emits = {
    (event: 'basicClickEvent', data: object): void; //表格双击事件
    (event: 'onSearch', data: object): void; //基本信息的的选择框点击事件
    (event: 'searchList', type: string, searchParams: any): void; //详情页的基本信息搜索
  };
  interface Param {
    column: string;
    endWith: string;
    link: SearchLink;
    name: string;
    rule: SearchMatchType;
    startWith: string;
    table: string;
    type: SearchDataType;
    val: string | undefined;
    control: ControlSet;
    ruleType?: any;
    valLabel?: string;
    treeData?: TreeItem[];
  }
  interface ProType {
    tableName: string;
    control: ControlSet[];
    gridOptions: any;
    tableCols: VxeGridPropTypes.Columns;
  }
  const props = withDefaults(defineProps<ProType>(), {
    tableName: '',
    control: () => {
      return [];
    },
  });
  const defaultControl: ControlSet = {
    controlType: '',
    displayName: '',
    fieldName: '',
    propName: '',
    queryConfig: '',
    requestUrl: '',
    tableAsName: '',
  };
  const defaultP: Param = {
    startWith: '',
    endWith: '',
    val: '',
    link: SearchLink.AND,
    rule: SearchMatchType.LIKE,
    type: SearchDataType.string,
    name: '',
    column: '',
    table: props.tableName,
    ruleType: cloneDeep(config.OPTION_RULE),
    treeData: [],
    // control: undefined,
    control: defaultControl,
  };
  const defaultParams: Param[] = [defaultP];
  const formDataInit = reactive({
    data: cloneDeep(defaultParams),
    param: cloneDeep(defaultP),
  });
  const isShow = ref<boolean>(false);
  const tableData = ref<any[]>([]);
  const defaultParam = toRef(formDataInit, 'param');
  const basicControl = ref<ControlSet[]>();
  const basicTableCols = ref<VxeGridPropTypes.Columns[]>([]);
  const basicShow = ref<boolean>(false);
  const basicTableName = ref<string>('');
  const currParam = ref<Param>();
  let getParams: SearchParams[] = [];
  const listUrl = ref<string>();
  //高级查询组件ref
  const childMoreSearchRef: any = ref(null);
  const tableNameOfBasic = ref<string>('');
  const controlOfBasic = ref<ControlSet[]>([]);
  //基础信息查询组件ref
  const childBasicSearchRef: any = ref(null);
  const xGrid = ref<VxeGridInstance>();
  // 高级查询打开
  const childMoreSearchEvent = async () => {
    await childMoreSearchRef.value.show();
    tableNameOfBasic.value = cloneDeep(props.tableName);
    controlOfBasic.value = cloneDeep(props.control);
  };

  //格式化数据
  const formatData = (data: string | number, source: configEntity[]) => {
    let res;
    if (source && source.length > 0) {
      res = source.find((item) => item.value === data);
    }
    return res ? res.label : '';
  };

  //基本信息弹框中的基础信息表格双击事件
  const basicClickEvent = (row) => {
    currParam.value ? (currParam.value.val = row.id) : currParam.value;
    currParam.value ? (currParam.value.valLabel = row.name) : currParam.value;
    childBasicSearchRef.value.close();
  };
  //改变选择的字段选项
  const handleChange = async (value: any) => {
    defaultParam.value.ruleType = config.OPTION_RULE;
    defaultParam.value.rule = SearchMatchType.LIKE;
    if (value.value === defaultParam.value.name) {
      defaultParam.value.control = getControl(value.value);
      defaultParam.value.treeData = [];
      defaultParam.value.val = undefined;
      if (defaultParam.value.control.controlType === 'date') {
        defaultParam.value.ruleType = cloneDeep(config.OPTION_RULE.slice(1));
        defaultParam.value.rule = SearchMatchType.EQ;
      }
      if (defaultParam.value.control.controlType === 'treeSelect') {
        defaultParam.value.treeData = await getPublicList(
          { params: 0 },
          defaultParam.value.control.requestUrl,
        );
      }
    }
  };
  const getControl = (name: string): ControlSet => {
    let res: ControlSet = defaultControl;
    props.control.forEach((item) => {
      if (item.propName === name) {
        res = item;
        return;
      }
    });
    return res;
  };

  //基础信息弹框--打开放大镜
  const onSearch = async (param: Param) => {
    basicShow.value = true;
    const control = getControl(param.name);
    basicTableCols.value = TableColum[control.queryConfig];
    //获取查询筛选条件
    const res = await getPublicList({ params: [] }, Url[control.queryConfig]);
    basicControl.value = res as ControlSet[];
    basicTableName.value = control.tableAsName;
    await childBasicSearchRef.value.init(control.requestUrl);
    currParam.value = param;
  };

  //双击单元格事件
  const emit = defineEmits<Emits>();
  const cellClickEvent: VxeGridEvents.CellClick = (row) => {
    emit('basicClickEvent', row.row);
  };

  //关闭
  const handleClose = () => {
    defaultParam.value = cloneDeep(defaultP);
    isShow.value = false;
  };
  //查询按钮
  const searchEvent = async () => {
    await getList(listUrl.value, 1);
  };
  //重置
  const resetSearch = async () => {
    defaultParam.value = cloneDeep(defaultP);
  };
  //分页信息
  const pages = reactive({
    currentPage: 0,
    pageSize: 10,
    total: 0,
  });
  //分页处理
  const tablePagerChange: VxePagerEvents.PageChange = async ({ currentPage, pageSize }) => {
    pages.currentPage = currentPage;
    pages.pageSize = pageSize;
    await getList(listUrl.value, currentPage);
  };

  const getList = async (url, currPage = 1, pageSize = pages.pageSize) => {
    getParams = [];
    const data = defaultParam.value;
    if (filterParams.value && filterParams.value.length > 0) {
      getParams = getParams.concat(filterParams.value);
    }
    if (data.name && data.val) {
      getParams.push({
        table: data.control.tableAsName,
        name: data.name,
        column: data.control.fieldName,
        link: data.link,
        rule: data.rule,
        type: SearchDataType.string,
        val: data.val ? data.val : '',
      });
    }
    getParams.push({
      column: 'bs_status',
      endWith: '',
      link: SearchLink.AND,
      rule: SearchMatchType.LIKE,
      type: SearchDataType.string,
      name: 'bsStatus',
      startWith: '',
      table: '',
      val: 'B',
    });
    if (
      childMoreSearchRef.value &&
      childMoreSearchRef.value.getSearchParams() &&
      childMoreSearchRef.value.getSearchParams().length > 0
    ) {
      getParams = getParams.concat(childMoreSearchRef.value.getSearchParams());
    }
    // 表格查询
    const res: any = await getPublicList(
      {
        params: getParams,
        pageIndex: currPage,
        pageRows: pageSize,
      },
      url,
    );
    pages.total = res.total;
    pages.currentPage = currPage;
    pages.pageSize = pageSize;
    tableData.value = res.records;
  };

  const show = () => {
    isShow.value = true;
  };
  const close = () => {
    isShow.value = false;
  };
  const init = (tableUrl: string) => {
    isShow.value = true;
    listUrl.value = tableUrl;
    getList(tableUrl);
  };
  const filterParams = ref<SearchParams[]>([]);
  /**
   * 设置过滤条件
   * @param params
   */
  const setFilter = (params: SearchParams[]) => {
    filterParams.value = params;
  };
  defineExpose({
    show,
    close,
    setFilter,
    init,
  });
</script>
<style scoped lang="less">
  .x-button {
    margin: 10px 5px;
  }
  .form-style {
    text-align: center;
  }
  .row {
    display: inherit !important;
    margin-top: 15px;
  }
  :deep(.vxe-table .vxe-sort--desc-btn.sort--active) {
    color: #409eff;
    border-color: #409eff;
  }
  :deep(.vxe-table .vxe-sort--asc-btn.sort--active) {
    color: #409eff;
    border-color: #409eff;
  }
</style>
