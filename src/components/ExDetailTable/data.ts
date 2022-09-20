import { reactive } from 'vue';
import { VxeGridProps } from 'vxe-table';

export const ruleOfExaGridOptions = reactive<VxeGridProps>({
  border: true,
  keepSource: true,
  align: 'center',
  loading: false,
  columnConfig: {
    resizable: true,
  },
  rowConfig: {
    isHover: true,
  },
  // sortConfig: {
  //   trigger: 'cell',
  //   defaultSort: { field: 'sort', order: 'asc' },
  //   orders: ['asc', 'desc', null],
  // },
  editConfig: {
    trigger: 'dblclick',
    mode: 'cell',
    showStatus: true,
    beforeEditMethod({ row }) {
      if (row.bsStatus === 'B') {
        return false;
      }
      return true;
    },
  },
  //操作按钮
  toolbarConfig: {
    slots: {
      buttons: 'toolbar_buttons',
    },
    zoom: true,
    custom: true,
  },
  //表头数据
  columns: [],
  //表格数据
  data: [],
});

export const ruleOfExaColumns = [
  { type: 'checkbox', width: 50, fixed: 'left' },
  { type: 'seq', title: '行号', width: 50, fixed: 'left' },
  {
    field: 'sort',
    title: '顺序',
    width: 100,
    sortable: true,
    editRender: { name: '$input' },
    fixed: 'left',
  },
  {
    field: 'number',
    title: '项目编码',
    sortable: true,
    width: 222,
    className: 'disableProp',
    // editRender: { name: '$input', attrs: { placeholder: '请输入项目编码' } },
  },
  {
    field: 'name',
    title: '项目名称',
    sortable: true,
    width: 100,
    className: 'disableProp',
    // editRender: { name: '$input', attrs: { placeholder: '请输入项目名称' } },
  },
  {
    field: 'select',
    title: '下拉选择类型',
    sortable: true,
    width: 222,
    slots: { edit: 'select' },
    editRender: { name: '$select' },
  },
  {
    field: 'min',
    title: '数字型-单价',
    sortable: true,
    width: 222,
    editRender: { name: '$input', props: { type: 'number', min: 1, max: 120 } },
  },
  {
    field: 'max',
    title: '数字型-数量',
    sortable: true,
    width: 222,
    editRender: { name: '$input', props: { type: 'number', min: 1, max: 120 } },
  },
  {
    field: 'sum',
    title: '数字型-总价',
    sortable: true,
    width: 222,
    slots: { default: 'sum' },
  },
  {
    field: 'time',
    title: '时间型',
    sortable: true,
    width: 100,
    editRender: { name: '$input', props: { type: 'date' } },
  },
  {
    field: 'desc.name',
    title: '弹框型',
    width: 100,
    sortable: true,
    params: {
      list: 'GET_EXA_RULE_LIST',
      select: 'GET_EXA_RULE_OPTIONS_LIST',
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
  {
    field: 'desc1.name',
    title: '弹框型1',
    sortable: true,
    width: 100,
    params: {
      list: 'GET_EXA_PROJECT_LIST', //弹框表格数据
      select: 'GET_EXA_PROJECT_OPTIONS_LIST', //基本信息下拉框+表头
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
];

//检验方案详情
export const exaProjectOfDetailColumns = [
  { type: 'checkbox', width: 50 },
  { field: 'seq', type: 'seq', title: '行号', width: 50 },
  {
    field: 'sort',
    title: '顺序',
    sortable: true,
    width: 120,
    editRender: { name: '$input', props: { type: 'integer', min: 1 } },
  },
  // { field: 'number', title: '编码', width: 150, editRender: { name: '$input' } },
  // { field: 'name', title: '检验详情名称', width: 150, editRender: { name: '$input' } },
  {
    field: 'bdExamineProject.number',
    title: '检验项目编码',
    sortable: true,
    width: 180,
    params: {
      list: 'GET_EXA_PROJECT_LIST', //检验项目表格数据
      select: 'GET_EXA_PROJECT_OPTIONS_LIST', //基本信息下拉框+表头
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
  {
    field: 'bdExamineProject.name',
    title: '检验项目名称',
    className: 'disableProp',
    sortable: true,
    // width: 150,
  },
  {
    field: 'min',
    title: '最小值',
    sortable: true,
    width: 120,
    editRender: { name: '$input', props: { type: 'float' } },
  },
  {
    field: 'max',
    title: '最大值',
    sortable: true,
    width: 120,
    editRender: { name: '$input', props: { type: 'float' } },
  },
  { field: 'refer', title: '参考数据', width: 120, editRender: { name: '$input' } },
  {
    field: 'description',
    title: '检验描述',
    // width: 120,
    sortable: true,
    editRender: { name: '$input' },
  },
  {
    field: 'isRequire',
    title: '是否必要',
    width: 120,
    slots: { default: 'isRequire' },
  },
  {
    field: 'isOpen',
    title: '是否启用',
    width: 120,
    slots: { default: 'open' },
  },
];
//盘盈单详情
export const invCountGainOfDetailColumns = [
  { type: 'checkbox', width: 50 },
  { field: 'seq', type: 'seq', title: '行号', width: 50 },
  {
    field: 'sort',
    title: '顺序',
    sortable: true,
    width: 100,
    editRender: { name: '$input', props: { type: 'integer', min: 1 } },
  },
  {
    field: 'matId', //物料编码
    visible: false,
  },
  {
    field: 'locationId', //仓位
    visible: false,
  },
  {
    field: 'compartmentId', //分仓
    visible: false,
  },
  {
    field: 'stockId', //分仓
    visible: false,
  },
  {
    field: 'bdMaterial.number',
    title: '物料编码',
    sortable: true,
    width: 150,
    params: {
      list: 'GET_TABLE_LIST', //物料信息表格数据
      select: 'GET_OPTIONS_LIST', //基本信息下拉框+表头
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
  {
    field: 'bdMaterial.name',
    title: '物料名称',
    className: 'disableProp',
    sortable: true,
    width: 150,
  },
  { field: 'bdMaterial.model', title: '规格型号', width: 150, sortable: true },
  {
    field: 'baseUnitName',
    title: '基本单位',
    editRender: { name: '$input' },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    editRender: { name: '$input' },
    width: 150,
    sortable: true,
  },
  {
    field: 'stockNum',
    title: '帐存数量',
    editRender: { name: '$input' },
    width: 150,
    sortable: true,
  },
  {
    field: 'countNum',
    title: '盘点数量',
    editRender: { name: '$input', props: { type: 'integer', min: 1 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'gain',
    title: '盘盈数量',
    slots: { default: 'gain' },
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStock.name',
    title: '仓库',
    params: {
      list: 'GET_PAGE_STOCK_LIST',
      select: 'GET_STOCK_LIST',
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockCompartment.name',
    title: '分仓',
    params: {
      list: 'GET_PAGE_STOCK_COMPARTMENT_LIST',
      select: 'GET_SUB_LIST',
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockLocation.name',
    title: '仓位',
    params: {
      list: 'GET_PAGE_STOCK_LOCATION_LIST',
      select: 'GET_LOCATION_LIST',
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
    width: 150,
    sortable: true,
  },
  { field: 'lot', title: '批次', editRender: { name: '$input' }, width: 150, sortable: true },
  { field: 'mark', title: '备注', editRender: { name: '$input' }, width: 150, sortable: true },
];
