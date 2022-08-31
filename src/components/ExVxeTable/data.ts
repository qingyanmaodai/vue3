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
  editConfig: { trigger: 'dblclick', mode: 'cell', showStatus: true },
  //操作按钮
  toolbarConfig: {
    slots: {
      buttons: 'toolbar_buttons',
    },
  },
  //表头数据
  columns: [],
  //表格数据
  data: [],
});

//检验方案
export const ruleOfExaColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  {
    field: 'number',
    title: '项目编码',
    editRender: { name: 'input', attrs: { placeholder: '请输入项目编码' } },
  },
  {
    field: 'name',
    title: '项目名称',
    clearable: true,
    sortable: true,
    editRender: { name: 'input', attrs: { placeholder: '请输入项目名称' } },
  },
  {
    field: 'bdExamineGroup.name',
    title: '下拉选择类型',
    sortable: true,
    editRender: { name: '$select', options: [], attrs: { placeholder: '请输入检验类别' } },
  },
  {
    field: 'description',
    title: '数字型',
    sortable: true,
    editRender: { name: '$input', props: { type: 'number', min: 1, max: 120 } },
  },
  {
    field: 'isOpen',
    title: '时间型',
    sortable: true,
    // clearable: true,
    // transfer: true,
    editRender: { name: '$input', props: { type: 'date' } },
  },
  {
    field: 'desc.name',
    title: '弹框型',
    sortable: true,
    params: {
      list: 'GET_EXA_RULE_LIST',
      select: 'GET_EXA_RULE_OPTIONS_LIST',
    },
    editRender: { name: '$input', props: { type: 'modal' } },
    slots: {
      // 使用 JSX 渲染
      edit: 'model',
    },
  },
  {
    field: 'desc1.name',
    title: '弹框型1',
    sortable: true,
    params: {
      list: 'GET_EXA_PROJECT_LIST',
      select: 'GET_EXA_PROJECT_OPTIONS_LIST',
    },
    editRender: { name: '$input', props: { type: 'modal' } },
    slots: {
      // 使用 JSX 渲染
      edit: 'model',
    },
  },
  {
    field: 'bsStatus',
    title: '数据状态',
    sortable: true,
    slots: { default: 'status' },
  },
];
