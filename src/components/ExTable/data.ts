import { reactive } from 'vue';
import { VxeGridProps } from 'vxe-table';
import XEUtils from 'xe-utils';

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

export const notToolInGridOptions = reactive<VxeGridProps>({
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

//库存数量
export const StockAmountColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'bdMaterial.number', title: '物料编号', sortable: true, width: 120 },
  { field: 'bdMaterial.name', title: '物料名称', sortable: true, width: 120 },
  { field: 'bdMaterial.model', title: '规格型号', sortable: true, width: 120 },
  { field: 'bdStock.name', title: '仓库', sortable: true, width: 120 },
  { field: 'bdStockCompartment.name', title: '分仓', sortable: true, width: 120 },
  { field: 'bdStockLocation.name', title: '仓位', sortable: true, width: 120 },
  { field: 'stockNum', title: '库存数量', sortable: true, width: 120 },
  { field: 'preUse', title: '预用数量', sortable: true, width: 120 },
  { field: 'num', title: '可用数量', sortable: true, width: 120 },
  { field: 'bdMaterial.baseUnitName', title: '基本单位', sortable: true, width: 120 },
  { field: 'bdMaterial.weightUnitName', title: '重量单位', sortable: true, width: 120 },
  { field: 'bdMaterial.createTime', title: '创建日期', sortable: true, width: 160 },
  { field: 'bdMaterial.updateTime', title: '更新日期', sortable: true, width: 160 },
  {
    field: 'operate',
    title: '操作',
    width: 160,
    slots: { default: 'operateOfStock' },
    fixed: 'right',
  },
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
  { field: 'number', title: '单据编号', width: 220, slots: { default: 'number' }, sortable: true },
  { field: 'srcBill', title: '来源单号', width: 220, sortable: true },
  { field: 'matNumber', title: '物料编号', width: 120, sortable: true },
  { field: 'matName', title: '物料名称', width: 120, sortable: true },
  { field: 'matModel', title: '规格型号', width: 120, sortable: true },
  { field: 'unitName', title: '基本单位', width: 120, sortable: true },
  {
    field: 'bsDate',
    title: '盘点日期',
    width: 160,
    slots: { default: 'bsDate' },
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
  { field: 'number', title: '单据编号', width: 220, slots: { default: 'number' }, sortable: true },
  { field: 'srcBill', title: '来源单号', width: 220, sortable: true },
  { field: 'matNumber', title: '物料编号', width: 120, sortable: true },
  { field: 'matName', title: '物料名称', width: 120, sortable: true },
  { field: 'matModel', title: '规格型号', width: 120, sortable: true },
  { field: 'unitName', title: '基本单位', width: 120, sortable: true },
  {
    field: 'bsDate',
    title: '盘点日期',
    width: 160,
    slots: { default: 'bsDate' },
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
  { field: 'number', title: '单据编号', width: 220, slots: { default: 'number' }, sortable: true },
  { field: 'matNumber', title: '物料编号', width: 120, sortable: true },
  { field: 'matName', title: '物料名称', width: 120, sortable: true },
  { field: 'matModel', title: '规格型号', width: 120, sortable: true },
  { field: 'unitName', title: '基本单位', width: 120, sortable: true },
  { field: 'bsDate', title: '盘点日期', width: 160, slots: { default: 'bsDate' }, sortable: true },
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

//采购订单
export const warPurOrdersColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '单据编号', width: 220, slots: { default: 'number' }, sortable: true },
  { field: 'srcBill', title: '来源单号', width: 220, sortable: true },
  { field: 'empName', title: '采购员', width: 120, sortable: true },
  { field: 'matNumber', title: '物料编号', width: 120, sortable: true },
  { field: 'matName', title: '物料名称', width: 120, sortable: true },
  { field: 'matModel', title: '规格型号', width: 120, sortable: true },
  { field: 'unitName', title: '基本单位', width: 120, sortable: true },
  { field: 'bsDate', title: '业务日期', width: 160, slots: { default: 'bsDate' }, sortable: true },
  { field: 'supplierName', title: '供应商', width: 120, sortable: true },
  { field: 'num', title: '采购数量', width: 120, sortable: true },
  { field: 'price', title: '单价', width: 120, sortable: true },
  {
    field: 'totalPrice',
    title: '总额',
    width: 120,
    editRender: { props: { type: 'float', min: 0 } },
    sortable: true,
  },
  {
    field: 'pushNum',
    title: '已下推数量',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
  {
    field: 'doneNum',
    title: '已入库数量',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
  { field: 'stockName', title: '仓库', width: 120, sortable: true },
  { field: 'compartmentName', title: '分仓', width: 120, sortable: true },
  { field: 'locationName', title: '仓位', width: 120, sortable: true },
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
//采购退货单
export const warPurReturnColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '单据编号', width: 220, slots: { default: 'number' }, sortable: true },
  { field: 'srcBill', title: '来源单号', width: 220, sortable: true },
  { field: 'empName', title: '负责人', width: 120, sortable: true },
  { field: 'matNumber', title: '物料编号', width: 120, sortable: true },
  { field: 'matName', title: '物料名称', width: 120, sortable: true },
  { field: 'matModel', title: '规格型号', width: 120, sortable: true },
  { field: 'unitName', title: '基本单位', width: 120, sortable: true },
  { field: 'bsDate', title: '退货日期', width: 160, slots: { default: 'bsDate' }, sortable: true },
  { field: 'supId', title: '供应商', width: 120, sortable: true },
  { field: 'num', title: '应退数量', width: 120, sortable: true },
  { field: 'realNum', title: '实退数量', width: 120, sortable: true },
  {
    field: 'pushNum',
    title: '已下推数量',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
  {
    field: 'doneNum',
    title: '已处理数量',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
  { field: 'stockName', title: '仓库', width: 120, sortable: true },
  { field: 'compartmentName', title: '分仓', width: 120, sortable: true },
  { field: 'locationName', title: '仓位', width: 120, sortable: true },
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
//采购入库单
export const warPurInputColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '单据编号', width: 220, slots: { default: 'number' }, sortable: true },
  { field: 'srcBill', title: '来源单号', width: 220, sortable: true },
  { field: 'empName', title: '仓管员', width: 120, sortable: true },
  { field: 'matNumber', title: '物料编号', width: 120, sortable: true },
  { field: 'matName', title: '物料名称', width: 120, sortable: true },
  { field: 'matModel', title: '规格型号', width: 120, sortable: true },
  { field: 'unitName', title: '基本单位', width: 120, sortable: true },
  { field: 'bsDate', title: '入库日期', width: 160, slots: { default: 'bsDate' }, sortable: true },
  { field: 'supName', title: '供应商', width: 120, sortable: true },
  { field: 'num', title: '应收数量', width: 120, sortable: true },
  { field: 'realNum', title: '实收数量', width: 120, sortable: true },
  {
    field: 'pushNum',
    title: '已下推数量',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
  {
    field: 'doneNum',
    title: '已退货数量',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
  { field: 'stockName', title: '仓库', width: 120, sortable: true },
  { field: 'compartmentName', title: '分仓', width: 120, sortable: true },
  { field: 'locationName', title: '仓位', width: 120, sortable: true },
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
//生产订单
export const warProOrderColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '单据编号', width: 220, slots: { default: 'number' }, sortable: true },
  { field: 'srcBill', title: '来源单号', width: 220, sortable: true },
  { field: 'matNumber', title: '物料编号', width: 120, sortable: true },
  { field: 'matName', title: '物料名称', width: 120, sortable: true },
  { field: 'matModel', title: '规格型号', width: 120, sortable: true },
  { field: 'unitName', title: '基本单位', width: 120, sortable: true },
  { field: 'empName', title: '计划员', width: 120, sortable: true },
  { field: 'bsDate', title: '业务日期', width: 160, slots: { default: 'bsDate' }, sortable: true },
  { field: 'num', title: '生产数量', width: 120, sortable: true },
  {
    field: 'pushNum',
    title: '已下推数量',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
  {
    field: 'doneNum',
    title: '已入库数量',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
  {
    field: 'planTime',
    title: '计划开工日期',
    width: 160,
    formatter: ({ cellValue }) => XEUtils.toDateString(cellValue, 'yyyy-MM-dd'),
    sortable: true,
  },
  {
    field: 'planFinTime',
    title: '计划完工日期',
    width: 160,
    formatter: ({ cellValue }) => XEUtils.toDateString(cellValue, 'yyyy-MM-dd'),
    sortable: true,
  },
  { field: 'mark', title: '备注', width: 150, sortable: true },
  {
    field: 'proMoStatus',
    title: '生产状态',
    width: 120,
    sortable: true,
    slots: { default: 'proMoStatus' },
  },
  {
    field: 'bsStatus',
    title: '数据状态',
    width: 120,
    sortable: true,
    slots: { default: 'status' },
  },
  { field: 'operate', title: '操作', width: 160, slots: { default: 'operate' }, fixed: 'right' },
];
//生产入库单
export const warProInStockColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '单据编号', width: 220, slots: { default: 'number' }, sortable: true },
  { field: 'srcBill', title: '来源单号', width: 220, sortable: true },
  { field: 'empName', title: '仓管员', width: 120, sortable: true },
  { field: 'matNumber', title: '物料编号', width: 120, sortable: true },
  { field: 'matName', title: '物料名称', width: 120, sortable: true },
  { field: 'matModel', title: '规格型号', width: 120, sortable: true },
  { field: 'unitName', title: '基本单位', width: 120, sortable: true },
  { field: 'bsDate', title: '入库日期', width: 160, slots: { default: 'bsDate' }, sortable: true },
  { field: 'num', title: '应收数量', width: 120, sortable: true },
  { field: 'realNum', title: '实收数量', width: 120, sortable: true },
  {
    field: 'pushNum',
    title: '已下推数量',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
  {
    field: 'doneNum',
    title: '已退货数量',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
  { field: 'stockName', title: '仓库', width: 120, sortable: true },
  { field: 'compartmentName', title: '分仓', width: 120, sortable: true },
  { field: 'locationName', title: '仓位', width: 120, sortable: true },
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
//生产用料清单
export const warProBomColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '单据编号', width: 220, slots: { default: 'number' }, sortable: true },
  { field: 'proMoNumber', title: '生产订单编号', width: 220, sortable: true },
  { field: 'matNumber', title: '物料编号', width: 120, sortable: true },
  { field: 'matName', title: '物料名称', width: 120, sortable: true },
  { field: 'matModel', title: '规格型号', width: 120, sortable: true },
  { field: 'unitName', title: '基本单位', width: 120, sortable: true },
  { field: 'bsDate', title: '业务日期', width: 160, slots: { default: 'bsDate' }, sortable: true },
  { field: 'num', title: '数量', width: 120, sortable: true },
  {
    field: 'doneNum',
    title: '已领数量',
    width: 120,
    sortable: true,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
  },
  {
    field: 'pushNum',
    title: '已推领料',
    width: 120,
    sortable: true,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
  },
  {
    field: 'reissueNum',
    title: '已补数量',
    width: 120,
    sortable: true,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
  },
  {
    field: 'pushReissueNum',
    title: '已推补料',
    width: 120,
    sortable: true,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
  },
  { field: 'mark', title: '备注', width: 150, sortable: true },
  {
    field: 'proMoStatus',
    title: '生产状态',
    width: 120,
    sortable: true,
    slots: { default: 'proMoStatus' },
  },
  {
    field: 'bsStatus',
    title: '数据状态',
    width: 120,
    sortable: true,
    slots: { default: 'status' },
  },
  { field: 'operate', title: '操作', width: 160, slots: { default: 'operate' }, fixed: 'right' },
];
//生产领料单
export const warProPicksColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '单据编号', width: 220, slots: { default: 'number' }, sortable: true },
  { field: 'srcBill', title: '来源单号', width: 220, sortable: true },
  { field: 'empName', title: '领料员', width: 120, sortable: true },
  { field: 'matNumber', title: '物料编号', width: 120, sortable: true },
  { field: 'matName', title: '物料名称', width: 120, sortable: true },
  { field: 'matModel', title: '规格型号', width: 120, sortable: true },
  { field: 'unitName', title: '基本单位', width: 120, sortable: true },
  { field: 'bsDate', title: '领料日期', width: 160, sortable: true },
  { field: 'num', title: '申请数量', width: 120, sortable: true },
  { field: 'realNum', title: '已领数量', width: 120, sortable: true },
  { field: 'doneNum', title: '已补数量', width: 120, sortable: true },
  { field: 'needNum', title: '待领数量', width: 120, sortable: true },
  {
    field: 'pushReturnNum',
    title: '已推退料',
    width: 120,
    sortable: true,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
  },
  {
    field: 'pushReissueNum',
    title: '已推补料',
    width: 120,
    sortable: true,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
  },
  {
    field: 'returnNum',
    title: '已退货数量',
    width: 120,
    sortable: true,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
  },
  { field: 'stockName', title: '仓库', width: 120, sortable: true },
  { field: 'compartmentName', title: '分仓', width: 120, sortable: true },
  { field: 'locationName', title: '仓位', width: 120, sortable: true },
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
//生产补料单
export const warProFeedColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '单据编号', width: 220, slots: { default: 'number' }, sortable: true },
  { field: 'srcBill', title: '来源单号', width: 220, sortable: true },
  { field: 'empName', title: '补料员', width: 120, sortable: true },
  { field: 'matNumber', title: '物料编号', width: 120, sortable: true },
  { field: 'matName', title: '物料名称', width: 120, sortable: true },
  { field: 'matModel', title: '规格型号', width: 120, sortable: true },
  { field: 'unitName', title: '基本单位', width: 120, sortable: true },
  { field: 'bsDate', title: '补料日期', width: 160, sortable: true },
  { field: 'reissueCause', title: '申请原因', width: 120, sortable: true },
  { field: 'num', title: '申请数量', width: 120, sortable: true },
  { field: 'scrapNum', title: '报废数量', width: 120, sortable: true },
  { field: 'realNum', title: '已领数量', width: 120, sortable: true },
  {
    field: 'returnNum',
    title: '已退数量',
    width: 120,
    sortable: true,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
  },
  {
    field: 'pushReturnNum',
    title: '已下推数量',
    width: 120,
    sortable: true,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
  },
  { field: 'stockName', title: '仓库', width: 120, sortable: true },
  { field: 'compartmentName', title: '分仓', width: 120, sortable: true },
  { field: 'locationName', title: '仓位', width: 120, sortable: true },
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
//生产退料单
export const warProReturnColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '单据编号', width: 220, slots: { default: 'number' }, sortable: true },
  { field: 'srcBill', title: '来源单号', width: 220, sortable: true },
  { field: 'empName', title: '退料员', width: 120, sortable: true },
  { field: 'matNumber', title: '物料编号', width: 120, sortable: true },
  { field: 'matName', title: '物料名称', width: 120, sortable: true },
  { field: 'matModel', title: '规格型号', width: 120, sortable: true },
  { field: 'unitName', title: '基本单位', width: 120, sortable: true },
  { field: 'bsDate', title: '退料日期', width: 160, slots: { default: 'bsDate' }, sortable: true },
  {
    field: 'returnCause',
    title: '退料原因',
    width: 120,
    slots: { default: 'returnCause' },
    sortable: true,
  },
  { field: 'num', title: '可退数量', width: 120, sortable: true },
  { field: 'realNum', title: '实退数量', width: 120, sortable: true },
  // { field: 'needNum', title: '待退数量', width: 120, sortable: true },
  // {
  //   field: 'pushNum',
  //   title: '已下推数量',
  //   width: 120,
  //   formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
  //   sortable: true,
  // },
  {
    field: 'doneNum',
    title: '已入库数量',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
  { field: 'stockName', title: '仓库', width: 120, sortable: true },
  { field: 'compartmentName', title: '分仓', width: 120, sortable: true },
  { field: 'locationName', title: '仓位', width: 120, sortable: true },
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
/*预用来源*/
export const preUseColumns = [
  { type: 'seq', title: '行号', width: 50 },
  { field: 'number', title: '单据编号', width: 220, slots: { default: 'number' }, sortable: true },
  { field: 'billType', title: '单据类型', slots: { default: 'billType' } },
  { field: 'tag', title: '业务操作', slots: { default: 'tag' } },
  { field: 'num', title: '操作数量' }, //出库数量 -1，入库数量 1
  { field: 'createTime', title: '业务日期' },
];
/*库存明细*/
export const stoSourceColumns = [
  { type: 'seq', title: '行号', width: 50 },
  { field: 'number', title: '单据编号', width: 220, slots: { default: 'number' }, sortable: true },
  { field: 'billType', title: '单据类型', slots: { default: 'billType' } },
  { field: 'tag', title: '业务操作', slots: { default: 'tag' } },
  { field: 'num', title: '操作数量' }, //出库数量 -1，入库数量 1
  { field: 'createTime', title: '业务日期' },
];
//销售订单
export const warSaleOrderColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '单据编号', width: 220, slots: { default: 'number' }, sortable: true },
  { field: 'srcBill', title: '来源单号', width: 220, sortable: true },
  { field: 'empName', title: '销售员', width: 120, sortable: true },
  { field: 'cusName', title: '客户', width: 120, sortable: true },
  { field: 'matNumber', title: '物料编号', width: 120, sortable: true },
  { field: 'matName', title: '物料名称', width: 120, sortable: true },
  { field: 'matModel', title: '规格型号', width: 120, sortable: true },
  { field: 'unitName', title: '基本单位', width: 120, sortable: true },
  { field: 'bsDate', title: '业务日期', width: 160, slots: { default: 'bsDate' }, sortable: true },
  { field: 'num', title: '销售数量', width: 120, sortable: true },
  { field: 'price', title: '单价', width: 120, sortable: true },
  {
    field: 'totalPrice',
    title: '总额',
    width: 120,
    editRender: { props: { type: 'float', min: 0 } },
    sortable: true,
  },
  {
    field: 'pushNum',
    title: '已推发货',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
  {
    field: 'doneNum',
    title: '已发货数量',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
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

//销售发货单
export const warSaleSendOutColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '单据编号', width: 220, slots: { default: 'number' }, sortable: true },
  { field: 'srcBill', title: '来源单号', width: 220, sortable: true },
  { field: 'empName', title: '发货员', width: 120, sortable: true },
  { field: 'cusName', title: '客户', width: 120, sortable: true },
  { field: 'matNumber', title: '物料编号', width: 120, sortable: true },
  { field: 'matName', title: '物料名称', width: 120, sortable: true },
  { field: 'matModel', title: '规格型号', width: 120, sortable: true },
  { field: 'unitName', title: '基本单位', width: 120, sortable: true },
  { field: 'bsDate', title: '业务日期', width: 160, slots: { default: 'bsDate' }, sortable: true },
  { field: 'num', title: '应发数量', width: 120, sortable: true },
  { field: 'realNum', title: '实发数量', width: 120, sortable: true },
  { field: 'price', title: '单价', width: 120, sortable: true },
  {
    field: 'totalPrice',
    title: '总额',
    width: 120,
    editRender: { props: { type: 'float', min: 0 } },
    sortable: true,
  },
  {
    field: 'pushNum',
    title: '已推退货',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
  {
    field: 'doneNum',
    title: '已退货数量',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
  {
    field: 'noticePushNum',
    title: '已推通知',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
  {
    field: 'noticeDoneNum',
    title: '已通知数量',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
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

//销售退货单
export const warSaleReturnColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '单据编号', width: 220, slots: { default: 'number' }, sortable: true },
  { field: 'srcBill', title: '来源单号', width: 220, sortable: true },
  { field: 'empName', title: '退料员', width: 120, sortable: true },
  { field: 'cusName', title: '退货客户', width: 120, sortable: true },
  { field: 'matNumber', title: '物料编号', width: 120, sortable: true },
  { field: 'matName', title: '物料名称', width: 120, sortable: true },
  { field: 'matModel', title: '规格型号', width: 120, sortable: true },
  { field: 'unitName', title: '基本单位', width: 120, sortable: true },
  { field: 'bsDate', title: '业务日期', width: 160, slots: { default: 'bsDate' }, sortable: true },
  {
    field: 'returnReason',
    title: '退料原因',
    width: 120,
    slots: { default: 'returnReason' },
    sortable: true,
  },
  { field: 'num', title: '应退数量', width: 120, sortable: true },
  { field: 'realNum', title: '实退数量', width: 120, sortable: true },
  { field: 'price', title: '单价', width: 120, sortable: true },
  {
    field: 'totalPrice',
    title: '总额',
    width: 120,
    editRender: { props: { type: 'float', min: 0 } },
    sortable: true,
  },
  {
    field: 'pushNum',
    title: '已推数量',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
  {
    field: 'doneNum',
    title: '已处理数量',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
  { field: 'stockName', title: '仓库', width: 120, sortable: true },
  { field: 'compartmentName', title: '分仓', width: 120, sortable: true },
  { field: 'locationName', title: '仓位', width: 120, sortable: true },
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
//销售退货通知单
export const warSaleNoticeColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '单据编号', width: 220, slots: { default: 'number' }, sortable: true },
  { field: 'srcBill', title: '来源单号', width: 220, sortable: true },
  { field: 'empName', title: '仓管员', width: 120, sortable: true },
  { field: 'cusName', title: '退货客户', width: 120, sortable: true },
  { field: 'matNumber', title: '物料编号', width: 120, sortable: true },
  { field: 'matName', title: '物料名称', width: 120, sortable: true },
  { field: 'matModel', title: '规格型号', width: 120, sortable: true },
  { field: 'unitName', title: '基本单位', width: 120, sortable: true },
  { field: 'bsDate', title: '业务日期', width: 160, slots: { default: 'bsDate' }, sortable: true },
  {
    field: 'returnReason',
    title: '退料原因',
    width: 120,
    slots: { default: 'returnReason' },
    sortable: true,
  },
  { field: 'num', title: '应收通知数量', width: 120, sortable: true },
  { field: 'realNum', title: '实收通知数量', width: 120, sortable: true },
  { field: 'price', title: '单价', width: 120, sortable: true },
  {
    field: 'totalPrice',
    title: '总额',
    width: 120,
    editRender: { props: { type: 'float', min: 0 } },
    sortable: true,
  },
  {
    field: 'pushNum',
    title: '已推数量',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
  {
    field: 'doneNum',
    title: '已退货数量',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
  { field: 'stockName', title: '仓库', width: 120, sortable: true },
  { field: 'compartmentName', title: '分仓', width: 120, sortable: true },
  { field: 'locationName', title: '仓位', width: 120, sortable: true },
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

//调拨订单
export const warTransferOrderColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '单据编号', width: 220, slots: { default: 'number' }, sortable: true },
  { field: 'srcBill', title: '来源单号', width: 220, sortable: true },
  { field: 'empName', title: '仓管员', width: 120, sortable: true },
  { field: 'matNumber', title: '物料编号', width: 120, sortable: true },
  { field: 'matName', title: '物料名称', width: 120, sortable: true },
  { field: 'matModel', title: '规格型号', width: 120, sortable: true },
  { field: 'unitName', title: '基本单位', width: 120, sortable: true },
  { field: 'bsDate', title: '业务日期', width: 160, slots: { default: 'bsDate' }, sortable: true },
  { field: 'num', title: '调拨数量', width: 120, sortable: true },
  { field: 'bdInStock.name', title: '调入仓库', width: 120, sortable: true },
  { field: 'bdInStockCompartment.name', title: '调入分仓', width: 120, sortable: true },
  { field: 'bdInStockLocation.name', title: '调入仓位', width: 120, sortable: true },
  { field: 'bdOutStock.name', title: '调出仓库', width: 120, sortable: true },
  { field: 'bdOutStockCompartment.name', title: '调出分仓', width: 120, sortable: true },
  { field: 'bdOutStockLocation.name', title: '调出仓位', width: 120, sortable: true },
  // {
  //   field: 'pushNum',
  //   title: '已推发货',
  //   width: 120,
  //   formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
  //   sortable: true,
  // },
  // {
  //   field: 'doneNum',
  //   title: '已发货数量',
  //   width: 120,
  //   formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
  //   sortable: true,
  // },
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

//其他入库单
export const warOthersInputColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '单据编号', width: 220, slots: { default: 'number' }, sortable: true },
  { field: 'srcBill', title: '来源单号', width: 220, sortable: true },
  { field: 'empName', title: '仓管员', width: 120, sortable: true },
  { field: 'matNumber', title: '物料编号', width: 120, sortable: true },
  { field: 'matName', title: '物料名称', width: 120, sortable: true },
  { field: 'matModel', title: '规格型号', width: 120, sortable: true },
  { field: 'unitName', title: '基本单位', width: 120, sortable: true },
  { field: 'bsDate', title: '入库日期', width: 160, slots: { default: 'bsDate' }, sortable: true },
  { field: 'supName', title: '供应商', width: 120, sortable: true },
  { field: 'num', title: '应入库数量', width: 120, sortable: true },
  { field: 'realNum', title: '实入库数量', width: 120, sortable: true },
  {
    field: 'pushNum',
    title: '已下推数量',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
  {
    field: 'doneNum',
    title: '已出库数量',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
  { field: 'stockName', title: '仓库', width: 120, sortable: true },
  { field: 'compartmentName', title: '分仓', width: 120, sortable: true },
  { field: 'locationName', title: '仓位', width: 120, sortable: true },
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

//其他出库单
export const warOthersOutputColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '单据编号', width: 220, slots: { default: 'number' }, sortable: true },
  { field: 'srcBill', title: '来源单号', width: 220, sortable: true },
  { field: 'empName', title: '负责人', width: 120, sortable: true },
  { field: 'matNumber', title: '物料编号', width: 120, sortable: true },
  { field: 'matName', title: '物料名称', width: 120, sortable: true },
  { field: 'matModel', title: '规格型号', width: 120, sortable: true },
  { field: 'unitName', title: '基本单位', width: 120, sortable: true },
  { field: 'bsDate', title: '出库日期', width: 160, slots: { default: 'bsDate' }, sortable: true },
  { field: 'supId', title: '供应商', width: 120, sortable: true },
  { field: 'num', title: '可出库数量', width: 120, sortable: true },
  { field: 'realNum', title: '实出库数量', width: 120, sortable: true },
  {
    field: 'pushNum',
    title: '已下推数量',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
  {
    field: 'doneNum',
    title: '已入库数量',
    width: 120,
    formatter: ({ cellValue }) => (cellValue ? cellValue : '0'),
    sortable: true,
  },
  { field: 'stockName', title: '仓库', width: 120, sortable: true },
  { field: 'compartmentName', title: '分仓', width: 120, sortable: true },
  { field: 'locationName', title: '仓位', width: 120, sortable: true },
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
