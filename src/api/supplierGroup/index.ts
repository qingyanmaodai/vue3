import { RequestData, Url } from '/@/api/apiLink';
import { ErrorMessageMode, Result } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';

export interface SupplierGroupEntity {
  id?: string;
  number?: string;
  name?: string;
  parentId?: string;
  mark?: string;
  erpCode?: string;
  bsStatus?: string;
  isDelete?: number;
  createTime?: string;
  updateTime?: string;
  createBy?: string;
  updateBy?: string;
  tenantId?: number;
  children?: SupplierGroupEntity[];
  title?: string;
  key?: string;
  value?: string;
}

/**
 * 新增供应商分组
 */
export function addSupplierGroup(
  json: RequestData<SupplierGroupEntity>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.SUPPLIER_GROUP_ADD,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 编辑分组
 */
export function editSupplierGroup(
  json: RequestData<SupplierGroupEntity>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.SUPPLIER_GROUP_UPDATE,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 删除分组
 */
export function deleteSupplierGroup(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.SUPPLIER_GROUP_DELETE,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 查询当供应商分组
 */
export function queryOneSupplierGroup(
  json: RequestData<string>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<SupplierGroupEntity>(
    {
      url: Url.SUPPLIER_GROUP_GET_ONE,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 获取供应商分组
 */
export function getSupplierGroupTree(
  json: RequestData<string>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<SupplierGroupEntity[]>(
    {
      url: Url.SUPPLIER_GROUP_GET_TREE,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
