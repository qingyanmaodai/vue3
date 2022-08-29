import { RequestData, Url } from '/@/api/apiLink';
import { ErrorMessageMode, Result } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';

export interface DepartmentEntity {
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
  children?: DepartmentEntity[];
  title?: string;
  key?: string;
  value?: string;
}

/**
 * 新增部门分组
 */
export function addDept(json: RequestData<DepartmentEntity>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.DEPT_ADD,
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
export function editDept(json: RequestData<DepartmentEntity>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.DEPT_UPDATE,
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
export function deleteDept(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.DEPT_DELETE,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 查询当部门分组
 */
export function queryOneDept(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<DepartmentEntity>(
    {
      url: Url.DEPT_GET_ONE,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 获取部门分组
 */
export function getDeptTree(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<DepartmentEntity[]>(
    {
      url: Url.DEPT_GET_TREE,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
