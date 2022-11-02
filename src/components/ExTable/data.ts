import { reactive } from 'vue';
import { VxeGridProps } from 'vxe-table';

//初始化表格
export interface DataItem {
  mark: string; //备注
  number: string; //物料编码
  erpCode: string;
  bsStatus: string; //业务状态A创建B审核
  isDelete: number; //是否删除
  creatTime: string; //创建时间
  createBy: string; //创建人员
  updateBy: string; //更新人员
  tenantId: number; //租户ID
  id: number; //唯一ID
  name: string; //物料名称
  model: string; //规格型号
  baseUnitId: number; //基本单位ID
  weightUnitId: number; //重量单位
  groupId: string; //物料分组编码
  attr: string; //物料属性：A自制，B外购，C委外，D虚拟
  packId: string; //包装容器ID
  examineSet: string; //检验设置A采购检验B生产检验 可组合用，隔开
  examineType: string; //检验类型A免检，B质检，C全检
  examineProjectId: number; //检验方案id
  examineRuleId: number; //抽检规则
}
export const gridOptions = reactive<VxeGridProps>({
  border: true,
  align: 'center',
  loading: false,
  columnConfig: {
    resizable: true,
  },
  rowConfig: {
    isHover: true,
  },
  //操作按钮
  toolbarConfig: {
    slots: {
      buttons: 'toolbar_buttons',
    },
    zoom: true,
    // zoom: {
    //   iconIn: 'vxe-icon--upload',
    //   iconOut: 'vxe-icon--zoomout',
    // },
    custom: true,
  },
  //表头数据
  columns: [],
  //表格数据
  data: [],
});

export const linkQueryGridOptions = reactive<VxeGridProps>({
  border: true,
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
//操作结果
export const resultGridOptions = reactive<VxeGridProps>({
  border: true,
  align: 'center',
  loading: false,
  columnConfig: {
    resizable: true,
  },
  rowConfig: {
    isHover: true,
  },
  //操作按钮
  toolbarConfig: {
    zoom: true,
    custom: true,
  },
  //表头数据
  columns: [],
  //表格数据
  data: [],
});

/*批量操作结果*/
export const resultByBatchColumns = [
  { type: 'seq', title: '序号', width: 50 },
  { field: 'info.title', title: '关键字' },
  { field: 'info.status', title: '状态', slots: { default: 'batchStatus' } },
  { field: 'info.msg', title: '信息' },
  { field: 'info.type', title: '信息类型' },
];
/*物料列表表头*/
export const matColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '物料编码', slots: { default: 'number' }, sortable: true },
  { field: 'name', title: '物料名称', sortable: true },
  { field: 'model', title: '规格型号', sortable: true },
  { field: 'baseUnit.name', title: '基本单位', sortable: true },
  { field: 'weightUnit.name', title: '重量单位', sortable: true },
  { field: 'bdMaterialGroup.name', title: '物料分组', sortable: true },
  {
    field: 'attr',
    title: '物料属性',
    sortable: true,
    slots: { default: 'attr' },
  },
  {
    field: 'bsStatus',
    title: '数据状态',
    sortable: true,
    slots: { default: 'status' },
  },
  { field: 'operate', title: '操作', width: 160, slots: { default: 'operate' }, fixed: 'right' },
];

/*供应商列表表头*/
export const supplierColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '编码', width: 120, slots: { default: 'number' }, sortable: true },
  { field: 'name', title: '供应商', sortable: true, width: 120 },
  { field: 'shortName', title: '供应商简称', sortable: true, width: 120 },
  { field: 'contact', title: '联系人', sortable: true, width: 120 },
  { field: 'phone', title: '联系电话', sortable: true, width: 120 },
  { field: 'bdEmployee.name', title: '负责人', sortable: true, width: 120 },
  { field: 'address', title: '地址', sortable: true, width: 120 },
  {
    field: 'level',
    title: '等级',
    sortable: true,
    slots: { default: 'SupplierLevel' },
    width: 120,
  },
  { field: 'bdCountryCountry.name', title: '国家', sortable: true, width: 120 },
  { field: 'bdCountryProvincial.name', title: '省', sortable: true, width: 120 },
  { field: 'bdCountryMunicipal.name', title: '市', sortable: true, width: 120 },
  { field: 'bdCountryDistrict.name', title: '区', sortable: true, width: 120 },
  { field: 'bdSupplierGroup.name', title: '供应商分组', sortable: true, width: 120 },
  { field: 'createTime', title: '创建日期', sortable: true, width: 160 },
  { field: 'updateTime', title: '修改日期', sortable: true, width: 160 },
  {
    field: 'bsStatus',
    title: '业务状态',
    slots: { default: 'status' },
    width: 120,
  },
  { field: 'operate', title: '操作', width: 160, slots: { default: 'operate' }, fixed: 'right' },
];

/*客户列表表头*/
export const customerColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '编码', width: 120, slots: { default: 'number' }, sortable: true },
  { field: 'name', title: '客户', sortable: true, width: 120 },
  { field: 'shortName', title: '客户简称', sortable: true, width: 120 },
  { field: 'contact', title: '联系人', sortable: true, width: 120 },
  { field: 'phone', title: '联系电话', sortable: true, width: 120 },
  { field: 'address', title: '地址', sortable: true, width: 120 },
  { field: 'bdCountryCountry.name', title: '国家', sortable: true, width: 120 },
  { field: 'bdCountryProvincial.name', title: '省', sortable: true, width: 120 },
  { field: 'bdCountryMunicipal.name', title: '市', sortable: true, width: 120 },
  { field: 'bdCountryDistrict.name', title: '区', sortable: true, width: 120 },
  { field: 'bdCustomerGroup.name', title: '客户分组', sortable: true, width: 120 },
  { field: 'createTime', title: '创建日期', sortable: true, width: 160 },
  { field: 'updateTime', title: '修改日期', sortable: true, width: 160 },
  {
    field: 'bsStatus',
    title: '业务状态',
    slots: { default: 'status' },
    width: 120,
  },
  { field: 'operate', title: '操作', width: 160, slots: { default: 'operate' }, fixed: 'right' },
];

/*人员列表表头*/
export const employeeColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '编码', width: 120, slots: { default: 'number' }, sortable: true },
  { field: 'name', title: '人员', sortable: true, width: 120 },
  { field: 'sex', title: '性别', sortable: true, width: 120, slots: { default: 'sex' } },
  { field: 'job', title: '职位', sortable: true, width: 120, slots: { default: 'job' } },
  { field: 'bdDepartment.name', title: '部门', sortable: true, width: 120 },
  { field: 'phone', title: '联系电话', sortable: true, width: 120 },
  { field: 'address', title: '地址', sortable: true, width: 120 },
  { field: 'email', title: '邮箱', sortable: true, width: 120 },
  { field: 'birthday', title: '出生日期', sortable: true, width: 160 },
  { field: 'entryDate', title: '入职日期', sortable: true, width: 160 },
  { field: 'createTime', title: '创建日期', sortable: true, width: 160 },
  { field: 'updateTime', title: '修改日期', sortable: true, width: 160 },
  {
    field: 'bsStatus',
    title: '业务状态',
    slots: { default: 'status' },
    width: 120,
  },
  { field: 'operate', title: '操作', width: 160, slots: { default: 'operate' }, fixed: 'right' },
];

/*仓库列表表头*/
export const stockColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '仓库编码', slots: { default: 'number' }, sortable: true },
  { field: 'name', title: '仓库名称', sortable: true },
  { field: 'bdEmployee.name', title: '负责人', sortable: true },
  { field: 'phone', title: '联系方式', sortable: true },
  { field: 'address', title: '地址', sortable: true },
  { field: 'mark', title: '备注', sortable: true },
  { field: 'createTime', title: '创建日期', sortable: true },

  {
    field: 'bsStatus',
    title: '数据状态',
    sortable: true,
    slots: { default: 'status' },
  },
  { field: 'operate', title: '操作', width: 160, slots: { default: 'operate' }, fixed: 'right' },
];

/*分仓列表表头*/
export const stockCompartmentColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '分仓编码', slots: { default: 'number' }, sortable: true },
  { field: 'name', title: '分仓名称', sortable: true },
  { field: 'bdStock.name', title: '所属仓库', sortable: true },
  { field: 'bdEmployee.name', title: '负责人', sortable: true },
  { field: 'phone', title: '联系方式', sortable: true },
  { field: 'address', title: '地址', sortable: true },
  { field: 'mark', title: '备注', sortable: true },
  { field: 'createTime', title: '创建日期', sortable: true },
  {
    field: 'bsStatus',
    title: '数据状态',
    sortable: true,
    slots: { default: 'status' },
  },
  { field: 'operate', title: '操作', width: 160, slots: { default: 'operate' }, fixed: 'right' },
];

/*仓位列表表头*/
export const stockLocationColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '仓位编码', slots: { default: 'number' }, sortable: true },
  { field: 'name', title: '仓位名称', sortable: true },
  { field: 'bdStock.name', title: '所属仓库', sortable: true },
  { field: 'bdStockCompartment.name', title: '所属分仓', sortable: true },
  { field: 'address', title: '地址', sortable: true },
  { field: 'mark', title: '备注', sortable: true },
  { field: 'createTime', title: '创建日期', sortable: true },
  {
    field: 'bsStatus',
    title: '数据状态',
    sortable: true,
    slots: { default: 'status' },
  },
  { field: 'operate', title: '操作', width: 160, slots: { default: 'operate' }, fixed: 'right' },
];

//检验项目
export const exaProjectColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '项目编码', slots: { default: 'number' }, sortable: true },
  { field: 'name', title: '项目名称', sortable: true },
  { field: 'bdExamineGroup.name', title: '检验类别', sortable: true },
  { field: 'description', title: '描述', sortable: true },
  { field: 'isOpen', title: '启用状态', sortable: true, slots: { default: 'open' } },
  {
    field: 'bsStatus',
    title: '数据状态',
    sortable: true,
    slots: { default: 'status' },
  },
  { field: 'operate', title: '操作', width: 160, slots: { default: 'operate' }, fixed: 'right' },
];

//计量单位
export const unitColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '单位编码', slots: { default: 'number' }, sortable: true },
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
  { field: 'mark', title: '备注', sortable: true },
  {
    field: 'bsStatus',
    title: '数据状态',
    sortable: true,
    slots: { default: 'status' },
  },
  { field: 'operate', title: '操作', width: 160, slots: { default: 'operate' }, fixed: 'right' },
];

//计量单位
export const StockAmountColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'matId', title: '物料ID', sortable: true, width: 160 },
  { field: 'stockId', title: '仓库ID', sortable: true, width: 160 },
  { field: 'compartmentId', title: '分仓ID', sortable: true, width: 160 },
  { field: 'locationId', title: '仓位ID', sortable: true, width: 160 },
  { field: 'bdStock.name', title: '仓库', sortable: true, width: 120 },
  { field: 'bdStockCompartment.name', title: '分仓', sortable: true, width: 120 },
  { field: 'bdStockLocation.name', title: '仓位', sortable: true, width: 120 },
  { field: 'bdMaterial.number', title: '物料编号', sortable: true, width: 120 },
  { field: 'bdMaterial.name', title: '物料名称', sortable: true, width: 120 },
  { field: 'bdMaterial.model', title: '规格型号', sortable: true, width: 120 },
  { field: 'bdMaterial.baseUnitName', title: '基本单位', sortable: true, width: 120 },
  { field: 'bdMaterial.weightUnitName', title: '重量单位', sortable: true, width: 120 },
  { field: 'bdMaterial.createTime', title: '创建日期', sortable: true, width: 160 },
  { field: 'bdMaterial.updateTime', title: '更新日期', sortable: true, width: 160 },
  { field: 'stockNum', title: '库存数量', sortable: true, width: 120 },
  { field: 'preUse', title: '即时库存', sortable: true, width: 120 },
];
//检验规则
export const exaRuleColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '规则编码', slots: { default: 'number' }, sortable: true },
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
  { field: 'operate', title: '操作', width: 160, slots: { default: 'operate' }, fixed: 'right' },
];

//检验方案
export const exaSchemeColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '方案编码', slots: { default: 'number' }, sortable: true },
  { field: 'name', title: '方案名称', sortable: true },
  { field: 'description', title: '描述', sortable: true },
  { field: 'mark', title: '备注', sortable: true },
  { field: 'isOpen', title: '启用状态', sortable: true, slots: { default: 'open' } },
  {
    field: 'bsStatus',
    title: '数据状态',
    sortable: true,
    slots: { default: 'status' },
  },
  { field: 'operate', title: '操作', width: 160, slots: { default: 'operate' }, fixed: 'right' },
];

//盘盈单
export const invCountGainColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '单据编号', width: 250, slots: { default: 'number' }, sortable: true },
  { field: 'srcBill', title: '来源单号', width: 250, sortable: true },
  { field: 'matNumber', title: '物料编号', width: 120, sortable: true },
  { field: 'matName', title: '物料名称', width: 120, sortable: true },
  { field: 'matModel', title: '规格型号', width: 120, sortable: true },
  { field: 'unitName', title: '基本单位', width: 120, sortable: true },
  {
    field: 'bsDate',
    title: '盘点日期',
    width: 120,
    // formatter: ['formatDate', 'yyyy-MM-dd'],
    sortable: true,
  },
  { field: 'gain', title: '盘盈数量', width: 120, sortable: true },
  { field: 'stockName', title: '仓库', width: 120, sortable: true },
  { field: 'compartmentName', title: '分仓', width: 120, sortable: true },
  { field: 'locationName', title: '仓位', width: 120, sortable: true },
  { field: 'way', title: '盘点方式', width: 120, slots: { default: 'way' }, sortable: true }, //普通盘点，全盘点
  { field: 'empName', title: '盘点人', width: 120, sortable: true },
  { field: 'mark', title: '备注', width: 150, sortable: true },
  {
    field: 'bsStatus',
    title: '数据状态',
    width: 120,
    sortable: true,
    slots: { default: 'status' },
  },
  { field: 'operate', title: '操作', width: 160, slots: { default: 'operate' }, fixed: 'right' },
];
//盘亏单
export const invCountLossColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '单据编号', width: 250, slots: { default: 'number' }, sortable: true },
  { field: 'srcBill', title: '来源单号', width: 250, sortable: true },
  { field: 'matNumber', title: '物料编号', width: 120, sortable: true },
  { field: 'matName', title: '物料名称', width: 120, sortable: true },
  { field: 'matModel', title: '规格型号', width: 120, sortable: true },
  { field: 'unitName', title: '基本单位', width: 120, sortable: true },
  {
    field: 'bsDate',
    title: '盘点日期',
    width: 120,
    // formatter: ['formatDate', 'yyyy-MM-dd'],
    sortable: true,
  },
  { field: 'loss', title: '盘亏数量', width: 120, sortable: true },
  { field: 'stockName', title: '仓库', width: 120, sortable: true },
  { field: 'compartmentName', title: '分仓', width: 120, sortable: true },
  { field: 'locationName', title: '仓位', width: 120, sortable: true },
  { field: 'way', title: '盘点方式', width: 120, slots: { default: 'way' }, sortable: true }, //普通盘点，全盘点
  { field: 'empName', title: '盘点人', width: 120, sortable: true },
  { field: 'mark', title: '备注', width: 150, sortable: true },
  {
    field: 'bsStatus',
    title: '数据状态',
    width: 120,
    sortable: true,
    slots: { default: 'status' },
  },
  { field: 'operate', title: '操作', width: 160, slots: { default: 'operate' }, fixed: 'right' },
];
//盘点单
export const invCountSheetColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '单据编号', width: 250, slots: { default: 'number' }, sortable: true },
  { field: 'matNumber', title: '物料编号', width: 120, sortable: true },
  { field: 'matName', title: '物料名称', width: 120, sortable: true },
  { field: 'matModel', title: '规格型号', width: 120, sortable: true },
  { field: 'unitName', title: '基本单位', width: 120, sortable: true },
  { field: 'bsDate', title: '盘点日期', width: 120, sortable: true },
  { field: 'countNum', title: '盘点数量', width: 120, sortable: true },
  { field: 'stockName', title: '仓库', width: 120, sortable: true },
  { field: 'compartmentName', title: '分仓', width: 120, sortable: true },
  { field: 'locationName', title: '仓位', width: 120, sortable: true },
  { field: 'way', title: '盘点方式', width: 120, slots: { default: 'way' }, sortable: true }, //普通盘点，全盘点
  { field: 'empName', title: '盘点人', width: 120, sortable: true },
  { field: 'mark', title: '备注', width: 150, sortable: true },
  {
    field: 'bsStatus',
    title: '数据状态',
    width: 120,
    sortable: true,
    slots: { default: 'status' },
  },
  { field: 'operate', title: '操作', width: 160, slots: { default: 'operate' }, fixed: 'right' },
];

//采购退货
export const warPurReturnColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '单据编号', width: 250, slots: { default: 'number' }, sortable: true },
  { field: 'empName', title: '负责人', width: 120, sortable: true },
  { field: 'matNumber', title: '物料编号', width: 120, sortable: true },
  { field: 'matName', title: '物料名称', width: 120, sortable: true },
  { field: 'matModel', title: '规格型号', width: 120, sortable: true },
  { field: 'unitName', title: '基本单位', width: 120, sortable: true },
  { field: 'bsDate', title: '退货日期', width: 120, sortable: true },
  { field: 'supId', title: '供应商', width: 120, sortable: true },
  { field: 'countNum', title: '实退数量', width: 120, sortable: true },
  { field: 'stockName', title: '仓库', width: 120, sortable: true },
  { field: 'compartmentName', title: '分仓', width: 120, sortable: true },
  { field: 'locationName', title: '仓位', width: 120, sortable: true },
  // { field: 'way', title: '退货方式', width: 120, slots: { default: 'way' }, sortable: true },
  { field: 'mark', title: '备注', width: 150, sortable: true },
  {
    field: 'bsStatus',
    title: '数据状态',
    width: 120,
    sortable: true,
    slots: { default: 'status' },
  },
  { field: 'operate', title: '操作', width: 160, slots: { default: 'operate' }, fixed: 'right' },
];
