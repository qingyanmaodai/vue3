export const testApi = 'http://192.168.200.114:6211';
export enum Url {
  ADD_MATERIAL_GROUP = '/stock/bd-material-group/save',
  EDIT_MATERIAL_GROUP = '/stock/bd-material-group/update',
  DELETE_MATERIAL_GROUP = '/stock/bd-material-group/delete',
  QUERY_ONE_MATERIAL_GROUP = '/stock/bd-material-group/query-one',
  TREE_MATERIAL_GROUP = '/stock/bd-material-group/tree',
  GET_TABLE_LIST = '/stock/bd-material/getPageList',
  GET_OPTIONS_LIST = '/stock/bd-material/query-dto',
  GET_STOCK_LIST = '/stock/bd-stock/query-dto',
  GET_SUB_LIST = '/stock/bd-sub-stock/query-dto',
  GET_LOCATION_LIST = '/stock/bd-stock-location/query-dto',
  ADD_TABLE_LIST = '/stock/bd-material/save',
  AUDIT_TABLE_LIST = '/stock/bd-material/audit',
  BATCH_AUDIT_TABLE_LIST = '/stock/bd-material/batch-audit',
  UNAUDIT_TABLE_LIST = '/stock/bd-material/un-audit',
  BATCH_UNAUDIT_TABLE_LIST = '/stock/bd-material/batch-un-audit',
  UPDATE_TABLE_LIST = '/stock/bd-material/update',
  GET_TABLE_BY_ID = '/stock/bd-material/getOneMaterial',
  DEL_TABLE_LIST = '/stock/bd-material/delete',
  BATCH_DEL_TABLE_LIST = '/stock/bd-material/batch-delete',
  GET_TABLE_UNIT = '/stock/bd-unit/query-dto',
  // GET_TABLE_UNIT_LIST = '/stock/bd-unit/list',
  EXPORT_TABLE_LIST = '/stock/bd-material/export-list',
  IMPORT_MATERIAL = 'http://192.168.200.136:9999/stock/bd-material/import-list',
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
