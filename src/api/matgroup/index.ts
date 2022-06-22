import { ErrorMessageMode, Result } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { Url, RequestData } from '/@/api/apiLink';

export interface MatGroupEntity {
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
  children?: MatGroupEntity[];
  title?: string;
  key?: string;
}
/**
 * 新增物料分组
 */
export function addMatGroup(json: RequestData<MatGroupEntity>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.ADD_MATERIAL_GROUP,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 编辑物料分组
 */
export function editMatGroup(
  json: RequestData<MatGroupEntity>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.EDIT_MATERIAL_GROUP,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 删除物料分组
 */
export function deleteMatGroup(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.DELETE_MATERIAL_GROUP,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}

/**
 * 删除物料分组
 */
export function queryOneMatGroup(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<MatGroupEntity>(
    {
      url: Url.QUERY_ONE_MATERIAL_GROUP,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 删除物料分组
 */
export function treeMatGroup(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<MatGroupEntity[]>(
    {
      url: Url.TREE_MATERIAL_GROUP,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
