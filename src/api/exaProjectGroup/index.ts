import { ErrorMessageMode, Result } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { Url, RequestData } from '/@/api/apiLink';

export interface ExaProjectGroupEntity {
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
  children?: ExaProjectGroupEntity[];
  title?: string;
  key?: string;
  value?: string;
}

/**
 * 新增物料分组
 */
export function addExaGroup(
  json: RequestData<ExaProjectGroupEntity>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.ADD_EXA_GROUP,
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
export function editExaGroup(
  json: RequestData<ExaProjectGroupEntity>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.EDIT_EXA_GROUP,
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
export function deleteExaGroup(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.DELETE_EXA_GROUP,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 查询物料分组
 */
export function queryOneExaGroup(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<ExaProjectGroupEntity>(
    {
      url: Url.QUERY_ONE_EXA_GROUP,
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
export function treeExaGroup(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<ExaProjectGroupEntity[]>(
    {
      url: Url.TREE_EXA_GROUP,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
