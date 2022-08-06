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
  GET_TABLE_UNIT_LIST = '/stock/bd-unit/list',
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
