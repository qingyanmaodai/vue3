export const testApi = 'http://192.168.200.114:6211';
export enum Url {
  //物料信息
  ADD_MATERIAL_GROUP = '/stock/bd-material-group/save', //添加
  EDIT_MATERIAL_GROUP = '/stock/bd-material-group/update', //编辑
  DELETE_MATERIAL_GROUP = '/stock/bd-material-group/delete',
  QUERY_ONE_MATERIAL_GROUP = '/stock/bd-material-group/query-one',
  TREE_MATERIAL_GROUP = '/stock/bd-material-group/tree',
  GET_TABLE_LIST = '/stock/bd-material/getPageList',
  GET_OPTIONS_LIST = '/stock/bd-material/query-dto', //获取基本单位实体信息
  ADD_TABLE_LIST = '/stock/bd-material/save',
  AUDIT_TABLE_LIST = '/stock/bd-material/audit',
  BATCH_AUDIT_TABLE_LIST = '/stock/bd-material/batch-audit',
  UNAUDIT_TABLE_LIST = '/stock/bd-material/un-audit',
  BATCH_UNAUDIT_TABLE_LIST = '/stock/bd-material/batch-un-audit',
  UPDATE_TABLE_LIST = '/stock/bd-material/update',
  GET_TABLE_BY_ID = '/stock/bd-material/getOneMaterial',
  DEL_TABLE_LIST = '/stock/bd-material/delete',
  BATCH_DEL_TABLE_LIST = '/stock/bd-material/batch-delete',
  // GET_TABLE_UNIT_LIST = '/mainStock/bd-unit/list',
  EXPORT_TABLE_LIST = '/stock/bd-material/export-list',
  IMPORT_MATERIAL = 'http://192.168.200.136:9999/stock/bd-material/import-list',
  IMPORT_MODEL = '/stock/bd-material/import-model',
  SUPPLIER_GET_DATA = '/stock/bd-supplier/list', //获取供应商列表
  SUPPLIER_AUDIT = '/stock/bd-supplier/audit', //供应商审核
  SUPPLIER_BATCH_AUDIT = '/stock/bd-supplier/batch-audit', //供应商批量审核
  SUPPLIER_UN_AUDIT = '/stock/bd-supplier/un-audit', //供应反审核
  SUPPLIER_BATCH_UN_AUDIT = '/stock/bd-supplier/batch-un-audit', //供应商批量反审核
  SUPPLIER_DELETE = '/stock/bd-supplier/delete', //供应商批量删除
  SUPPLIER_BATCH_DELETE = '/stock/bd-supplier/batch-delete', //供应商批量删除
  SUPPLIER_EXPORT_DATA = '/stock/bd-supplier/export-list', //供应商导出
  SUPPLIER_IMPORT = 'http://192.168.200.136:9999/stock/bd-supplier/import-list', //供应商导入
  SUPPLIER_IMPORT_MODEL = '/stock/bd-supplier/import-model', //供应商导入模板下载
  SUPPLIER_GROUP_ADD = '/stock/bd-supplier-group/save', //新增供应商分组
  SUPPLIER_GROUP_UPDATE = '/stock/bd-supplier-group/update', //修改供应商分组
  SUPPLIER_GROUP_DELETE = '/stock/bd-supplier-group/delete', //删除供应商分组
  SUPPLIER_GROUP_GET_ONE = '/stock/bd-supplier-group/query-one', //查询单个供应商分组
  SUPPLIER_GROUP_GET_TREE = '/stock/bd-supplier-group/tree', //获取供应商分组
  //共用
  GET_TABLE_UNIT = '/stock/bd-unit/query-dto', //基本单位查询字段
  GET_STOCK_LIST = '/stock/bd-stock/query-dto', //获取仓库实体信息--搜索的下拉框
  GET_SUB_LIST = '/stock/bd-sub-stock/query-dto', //获取分仓实体信息
  GET_LOCATION_LIST = '/stock/bd-stock-location/query-dto', //获取仓位实体信息
  //仓库管理
  AUDIT_STOCK_LIST = '/stock/bd-stock/audit',
  BATCH_AUDIT_STOCK_LIST = '/stock/bd-stock/batch-audit',
  UN_AUDIT_STOCK_LIST = '/stock/bd-stock/un_audit',
  UN_BATCH_AUDIT_STOCK_LIST = '/stock/bd-stock/batch-un-audit',
  DELETE_STOCK_LIST = '/stock/bd-stock/delete',
  BATCH_DELETE_STOCK_LIST = '/stock/bd-stock/batch-delete',
  GET_PAGE_STOCK_LIST = '/stock/bd-stock/list', //分页查询
  GET_ID_STOCK_LIST = '/stock/bd-stock/query-one', //id查询
  IMPORT_STOCK_LIST = '/stock/bd-stock/import-list',
  IMPORT_MODEL_STOCK_LIST = '/stock/bd-stock/import-model',
  EXPORT_STOCK_LIST = '/stock/bd-stock/export-list',
  ADD_STOCK_LIST = '/stock/bd-stock/save',
  UPDATE_STOCK_LIST = '/stock/bd-stock/update',
}

export const TableColum = {
  //基本单位表头
  GET_TABLE_UNIT: [
    { type: 'checkbox', width: 50 },
    { type: 'seq', title: '序号', width: 50 },
    { field: 'number', title: '单位编码', sortable: true },
    { field: 'name', title: '单位名称', sortable: true },
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
  ],
  //仓库
  GET_STOCK_LIST: [
    { type: 'checkbox', width: 50 },
    { type: 'seq', title: '序号', width: 50 },
    { field: 'number', title: '仓库编码', sortable: true },
    { field: 'name', title: '仓库名称', sortable: true },
    { field: 'address', title: '仓库地址', sortable: true },
    { field: 'mainBy', title: '仓库管理员', sortable: true },
    { field: 'phone', title: '联系电话', sortable: true },
    {
      field: 'bsStatus',
      title: '数据状态',
      sortable: true,
      slots: { default: 'status' },
    },
  ],
  //分仓
  GET_SUB_LIST: [
    { type: 'checkbox', width: 50 },
    { type: 'seq', title: '序号', width: 50 },
    { field: 'number', title: '分仓编码', sortable: true },
    { field: 'name', title: '分仓名称', sortable: true },
    { field: 'address', title: '仓库地址', sortable: true },
    { field: 'mainBy', title: '仓库管理员', sortable: true },
    { field: 'phone', title: '联系电话', sortable: true },
    {
      field: 'bsStatus',
      title: '数据状态',
      sortable: true,
      slots: { default: 'status' },
    },
  ],
  //仓位
  GET_LOCATION_LIST: [
    { type: 'checkbox', width: 50 },
    { type: 'seq', title: '序号', width: 50 },
    { field: 'number', title: '仓位编码', sortable: true },
    { field: 'name', title: '仓位名称', sortable: true },
    { field: 'address', title: '仓位地址', sortable: true },
    { field: 'mainBy', title: '仓位管理员', sortable: true },
    { field: 'phone', title: '联系电话', sortable: true },
    {
      field: 'bsStatus',
      title: '数据状态',
      sortable: true,
      slots: { default: 'status' },
    },
  ],
  //检验方案
};

export enum SearchLink {
  AND = 'AND',
  OR = 'OR',
}
export enum SearchMatchType {
  EQ = 'EQ', //等于
  LIKE = 'LIKE', //包含
  GE = 'GE', //大于等于
  LE = 'LE', //小于等于
  NE = 'NE', //不等于
  GT = 'GT', //大于
  LT = 'LT', //小于
}
export enum SearchDataType {
  string = 'string',
  number = 'number',
}
export interface OrderByBean {
  ascList?: string[];
  descList?: string[];
}
export interface RequestData<T> {
  pageIndex?: number;
  pageRows?: number;
  orderByBean?: OrderByBean;
  params: T;
}
export interface SearchParams {
  table: string;
  name: string;
  column: string;
  link: SearchLink;
  rule: SearchMatchType;
  type: SearchDataType;
  val: string;
  date?: string;
  startWith?: string;
  endWith?: string;
}
