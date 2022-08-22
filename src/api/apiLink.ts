export const testApi = 'http://192.168.200.114:6211';
export enum Url {
  //物料分组
  ADD_MATERIAL_GROUP = '/stock/bd-material-group/save', //添加
  EDIT_MATERIAL_GROUP = '/stock/bd-material-group/update', //编辑
  DELETE_MATERIAL_GROUP = '/stock/bd-material-group/delete',
  QUERY_ONE_MATERIAL_GROUP = '/stock/bd-material-group/query-one',
  TREE_MATERIAL_GROUP = '/stock/bd-material-group/tree',
  //物料信息
  GET_TABLE_LIST = '/stock/bd-material/list', //获取基本单位列表
  GET_OPTIONS_LIST = '/stock/bd-material/query-dto', //获取物料信息实体信息
  ADD_TABLE_LIST = '/stock/bd-material/save',
  AUDIT_TABLE_LIST = '/stock/bd-material/audit',
  BATCH_AUDIT_TABLE_LIST = '/stock/bd-material/batch-audit',
  UN_AUDIT_TABLE_LIST = '/stock/bd-material/un-audit',
  BATCH_UN_AUDIT_TABLE_LIST = '/stock/bd-material/batch-un-audit',
  UPDATE_TABLE_LIST = '/stock/bd-material/update',
  GET_TABLE_BY_ID = '/stock/bd-material/getOneMaterial',
  DEL_TABLE_LIST = '/stock/bd-material/delete',
  BATCH_DEL_TABLE_LIST = '/stock/bd-material/batch-delete',
  // GET_TABLE_UNIT_LIST = '/mainStock/bd-unit/list',
  EXPORT_TABLE_LIST = '/stock/bd-material/export-list',
  IMPORT_MATERIAL = 'http://192.168.200.136:9999/stock/bd-material/import-list',
  IMPORT_MODEL = '/stock/bd-material/import-model',

  //供应商
  SUPPLIER_GET_DATA = '/stock/bd-supplier/list', //获取供应商列表
  SUPPLIER_GET_ONE = '/stock/bd-supplier/query-one', //查询单个供应商
  SUPPLIER_SAVE = '/stock/bd-supplier/save', //查询单个供应商
  SUPPLIER_AUDIT = '/stock/bd-supplier/audit', //供应商审核
  SUPPLIER_BATCH_AUDIT = '/stock/bd-supplier/batch-audit', //供应商批量审核
  SUPPLIER_UN_AUDIT = '/stock/bd-supplier/un-audit', //供应反审核
  SUPPLIER_BATCH_UN_AUDIT = '/stock/bd-supplier/batch-un-audit', //供应商批量反审核
  SUPPLIER_DELETE = '/stock/bd-supplier/delete', //供应商删除
  SUPPLIER_BATCH_DELETE = '/stock/bd-supplier/batch-delete', //供应商批量删除
  SUPPLIER_EXPORT_DATA = '/stock/bd-supplier/export-list', //供应商导出
  SUPPLIER_IMPORT = 'http://192.168.200.136:9999/stock/bd-supplier/import-list', //供应商导入
  SUPPLIER_IMPORT_MODEL = '/stock/bd-supplier/import-model', //供应商导入模板下载
  SUPPLIER_GROUP_ADD = '/stock/bd-supplier-group/save', //新增供应商分组
  SUPPLIER_GROUP_UPDATE = '/stock/bd-supplier-group/update', //修改供应商分组
  SUPPLIER_GROUP_DELETE = '/stock/bd-supplier-group/delete', //删除供应商分组
  SUPPLIER_GROUP_GET_ONE = '/stock/bd-supplier-group/query-one', //查询单个供应商分组
  SUPPLIER_GROUP_GET_TREE = '/stock/bd-supplier-group/tree', //获取供应商分组

  //共用--实体信息--搜索的下拉框
  GET_TABLE_UNIT = '/stock/bd-unit/query-dto', //基本单位查询字段
  GET_STOCK_LIST = '/stock/bd-stock/query-dto', //获取仓库实体信息--搜索的下拉框
  GET_SUB_LIST = '/stock/bd-sub-stock/query-dto', //获取分仓实体信息
  GET_LOCATION_LIST = '/stock/bd-stock-location/query-dto', //获取仓位实体信息

  //仓库管理
  AUDIT_STOCK_LIST = '/stock/bd-stock/audit', //审核
  BATCH_AUDIT_STOCK_LIST = '/stock/bd-stock/batch-audit', //批量审核
  UN_AUDIT_STOCK_LIST = '/stock/bd-stock/un-audit', //反审核
  UN_BATCH_AUDIT_STOCK_LIST = '/stock/bd-stock/batch-un-audit', //批量反审核
  DELETE_STOCK_LIST = '/stock/bd-stock/delete', //删除
  BATCH_DELETE_STOCK_LIST = '/stock/bd-stock/batch-delete', //批量删除
  GET_PAGE_STOCK_LIST = '/stock/bd-stock/list', //分页查询--获取仓库列表
  GET_ID_STOCK_LIST = '/stock/bd-stock/query-one', //查询单条
  IMPORT_STOCK_LIST = 'http://192.168.200.136:9999/stock/bd-stock/import-list', //导入
  IMPORT_MODEL_STOCK_LIST = '/stock/bd-stock/import-model', //导入模板下载
  EXPORT_STOCK_LIST = '/stock/bd-stock/export-list', //导出
  ADD_STOCK_LIST = '/stock/bd-stock/save', //添加
  UPDATE_STOCK_LIST = '/stock/bd-stock/update', //编辑

  //质量检验
  ADD_EXA_GROUP = '/stock/bd-examine-group/save', //添加
  EDIT_EXA_GROUP = '/stock/bd-examine-group/update', //编辑
  DELETE_EXA_GROUP = '/stock/bd-examine-group/delete',
  QUERY_ONE_EXA_GROUP = '/stock/bd-examine-group/query-one',
  TREE_EXA_GROUP = '/stock/bd-examine-group/tree',
  GET_EXA_PROJECT_LIST = '/stock/bd-examine-project/list', //检验项目列表
  AUDIT_EXA_PROJECT = '/stock/bd-examine-project/audit', //检验项目审核
  BATCH_AUDIT_EXA_PROJECT = '/stock/bd-examine-project/batch-audit', //检验项目批量审核
  UNAUDIT_EXA_PROJECT = '/stock/bd-examine-project/un-audit', //反审核检验项目
  BATCH_UNAUDIT_EXA_PROJECT = '/stock/bd-examine-project/batch-un-audit', //检验项目批量反审核
  BATCH_DEL_EXA_PROJECT = '/stock/bd-examine-project/batch-delete', //删除检验项目
  GET_EXA_PROJECT_OPTIONS_LIST = '/stock/bd-examine-project/query-dto', //获取实体信息

  //分仓管理
  AUDIT_SUB_STOCK_LIST = '/stock/bd-sub-stock/audit',
  BATCH_AUDIT_SUB_STOCK_LIST = '/stock/bd-sub-stock/batch-audit',
  UN_AUDIT_SUB_STOCK_LIST = '/stock/bd-sub-stock/un-audit',
  UN_BATCH_AUDIT_SUB_STOCK_LIST = '/stock/bd-sub-stock/batch-un-audit',
  DELETE_SUB_STOCK_LIST = '/stock/bd-sub-stock/delete',
  BATCH_DELETE_SUB_STOCK_LIST = '/stock/bd-sub-stock/batch-delete',
  GET_PAGE_SUB_STOCK_LIST = '/stock/bd-sub-stock/getPageList', //获取分仓列表
  GET_ID_SUB_STOCK_LIST = '/stock/bd-sub-stock/getOne', //查询单条
  IMPORT_SUB_STOCK_LIST = 'http://192.168.200.136:9999/stock/bd-sub-stock/import-list',
  IMPORT_MODEL_SUB_STOCK_LIST = '/stock/bd-sub-stock/import-model',
  EXPORT_SUB_STOCK_LIST = '/stock/bd-sub-stock/export-list',
  ADD_SUB_STOCK_LIST = '/stock/bd-sub-stock/save',
  UPDATE_SUB_STOCK_LIST = '/stock/bd-sub-stock/update',

  //仓位管理
  AUDIT_STOCK_LOCATION_LIST = '/stock/bd-stock-location/audit',
  BATCH_AUDIT_STOCK_LOCATION = '/stock/bd-stock-location/batch-audit',
  UN_AUDIT_STOCK_LOCATION_LIST = '/stock/bd-stock-location/un-audit',
  UN_BATCH_AUDIT_STOCK_LOCATION = '/stock/bd-stock-location/batch-un-audit',
  DELETE_STOCK_LOCATION_LIST = '/stock/bd-stock-location/delete',
  BATCH_DELETE_STOCK_LOCATION = '/stock/bd-stock-location/batch-delete',
  GET_PAGE_STOCK_LOCATION_LIST = '/stock/bd-stock-location/getPageList', //获取仓位列表
  // GET_LIST_STOCK_LOCATION = '/stock/bd-stock-location/list', //分页查询
  GET_ID_STOCK_LOCATION_LIST = '/stock/bd-stock-location/getOne', //查询单条
  IMPORT_STOCK_LOCATION_LIST = 'http://192.168.200.136:9999/stock/bd-stock-location/import-list',
  IMPORT_MODEL_STOCK_LOCATION = '/stock/bd-stock-location/import-model',
  EXPORT_STOCK_LOCATION_LIST = '/stock/bd-stock-location/export-list',
  ADD_STOCK_LOCATION_LIST = '/stock/bd-stock-location/save',
  UPDATE_STOCK_LOCATION_LIST = '/stock/bd-stock-location/update',

  //国家地区
  COUNTRY_TREE = '/stock/bd-country/getCountryByParentId',
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
export interface PublicModel {
  bsStatus?: string;
  mark?: string;
  createTime?: string;
  createBy?: string;
  updateTime?: string;
  updateBy?: string;
  erpCode?: string;
}
