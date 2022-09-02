import { reactive } from 'vue';
import { VxeGridProps } from 'vxe-table';

//初始化表格
export interface DataItem {
  bsStatus: string; //状态
  bsType: string;
  createBy: string; //创建人
  createTime: string; //创建日期
  erpCode: string;
  id: number; //唯一ID
  isDelete: number;
  mark: string; //备注
  name: string; //单位名称
  number: string; //编码
  tenantId: number;
  updateBy: string; //修改人
  updateTime: string; //修改日期
}
export const basicGridOptions = reactive<VxeGridProps>({
  border: true,
  height: 400,
  align: 'center',
  loading: false,
  columnConfig: {
    resizable: true,
  },
  rowConfig: {
    isHover: true,
  },
  //表头数据
  columns: [],
  //表格数据
  data: [],
});
export const unitColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '单位编码', sortable: true },
  { field: 'name', title: '单位名称', sortable: true },
  { field: 'bsType', title: '单位类型', slots: { default: 'bsType' }, sortable: true },
  {
    field: 'createBy',
    title: '创建人',
    sortable: true,
  },
  {
    field: 'createTime',
    title: '创建日期',
    sortable: true,
  },
  {
    field: 'updateBy',
    title: '修改人',
    sortable: true,
  },
  {
    field: 'updateTime',
    title: '修改日期',
    sortable: true,
  },
  {
    field: 'bsStatus',
    title: '数据状态',
    sortable: true,
    slots: { default: 'status' },
  },
];
export const stockColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '仓库编码', sortable: true },
  { field: 'name', title: '仓库名称', sortable: true },
  { field: 'address', title: '仓库地址', sortable: true },
  { field: 'bdEmployee.name', title: '仓库管理员', sortable: true },
  { field: 'phone', title: '联系电话', sortable: true },
  {
    field: 'bsStatus',
    title: '数据状态',
    sortable: true,
    slots: { default: 'status' },
  },
];
export const stockCompartmentColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '分仓编码', sortable: true },
  { field: 'name', title: '分仓名称', sortable: true },
  { field: 'address', title: '仓库地址', sortable: true },
  { field: 'bdEmployee.name', title: '仓库管理员', sortable: true },
  { field: 'phone', title: '联系电话', sortable: true },
  {
    field: 'bsStatus',
    title: '数据状态',
    sortable: true,
    slots: { default: 'status' },
  },
];
export const locationColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '仓位编码', sortable: true },
  { field: 'name', title: '仓位名称', sortable: true },
  { field: 'address', title: '仓位地址', sortable: true },
  {
    field: 'bsStatus',
    title: '数据状态',
    sortable: true,
    slots: { default: 'status' },
  },
];
export const planColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '方案编码', sortable: true },
  { field: 'name', title: '方案名称', sortable: true },
  { field: 'updateBy', title: '修改人员', sortable: true },
  { field: 'updateTime', title: '修改时间', sortable: true },
  {
    field: 'bsStatus',
    title: '数据状态',
    sortable: true,
    slots: { default: 'status' },
  },
];
//检验规则
export const exaRuleColumns = [
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
//人员档案
export const employeeColumns = [
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '编码', sortable: true },
  { field: 'name', title: '人员名称', sortable: true },
  { field: 'entryDate', title: '入职日期', sortable: true },
  { field: 'birthday', title: '出生日期', sortable: true },
  { field: 'address', title: '地址', sortable: true },
  { field: 'mark', title: '备注', sortable: true },
  {
    field: 'bsStatus',
    title: '数据状态',
    sortable: true,
    slots: { default: 'status' },
  },
];
