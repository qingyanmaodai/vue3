import { reactive } from 'vue';
import { VxeGridProps } from 'vxe-table';

export const ruleOfExaGridOptions = reactive<VxeGridProps>({
  border: true,
  align: 'center',
  loading: false,
  columnConfig: {
    resizable: true,
  },
  rowConfig: {
    isHover: true,
  },
  // editRules: 'validRules',
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

//检验规则
export const ruleOfExaColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '规则编码', sortable: true },
  { field: 'name', title: '规则名称', sortable: true },
  { field: 'min', title: '最小值', sortable: true },
  { field: 'max', title: '最大值', sortable: true },
  { field: 'percent', title: '抽检百分比', sortable: true },
  { field: 'mark', title: '备注', sortable: true },
  {
    field: 'bsStatus',
    title: '数据状态',
    sortable: true,
    slots: { default: 'status' },
  },
];
