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
  editConfig: { trigger: 'dblclick', mode: 'cell', showStatus: true },
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

//检验方案
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
  { type: 'checkbox', width: 50, fixed: 'left' },
  { type: 'seq', title: '行号', width: 50, fixed: 'left' },
  {
    field: 'sort',
    title: '顺序',
    sortable: true,
    width: 120,
    fixed: 'left',
    editRender: { name: '$input', props: { type: 'integer', min: 1 } },
  },
  // { field: 'number', title: '编码', width: 150, editRender: { name: '$input' } },
  // { field: 'name', title: '检验详情名称', width: 150, editRender: { name: '$input' } },
  {
    field: 'bdExamineProject.number',
    title: '检验项目编码',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'bdExamineProject.name',
    title: '检验项目名称',
    sortable: true,
    width: 150,
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
    field: 'min',
    title: '最小值',
    width: 120,
    sortable: true,
    editRender: { name: '$input', props: { type: 'float' } },
  },
  {
    field: 'max',
    title: '最大值',
    width: 120,
    sortable: true,
    editRender: { name: '$input', props: { type: 'float' } },
  },
  { field: 'refer', title: '参考数据', width: 120, editRender: { name: '$input' } },
  {
    field: 'description',
    title: '检验描述',
    width: 120,
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
