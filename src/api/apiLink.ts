export enum Url {
  ADD_MATERIAL_GROUP = '/stock/bd-material-group/save',
  EDIT_MATERIAL_GROUP = '/stock/bd-material-group/update',
  DELETE_MATERIAL_GROUP = '/stock/bd-material-group/delete',
  QUERY_ONE_MATERIAL_GROUP = '/stock/bd-material-group/query-one',
  TREE_MATERIAL_GROUP = '/stock/bd-material-group/tree',
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
