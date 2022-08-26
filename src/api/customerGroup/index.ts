import { RequestData, Url } from '/@/api/apiLink';
import { ErrorMessageMode, Result } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';

export interface CustomerGroupEntity {
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
  children?: CustomerGroupEntity[];
  title?: string;
  key?: string;
  value?: string;
}

/**
 * 新增供应商分组
 */
export function addCustomerGroup(
  json: RequestData<CustomerGroupEntity>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.CUSTOMER_GROUP_ADD,
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
export function editCustomerGroup(
  json: RequestData<CustomerGroupEntity>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.CUSTOMER_GROUP_UPDATE,
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
export function deleteCustomerGroup(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.CUSTOMER_GROUP_DELETE,
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
export function queryOneCustomerGroup(
  json: RequestData<string>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<CustomerGroupEntity>(
    {
      url: Url.CUSTOMER_GROUP_GET_ONE,
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
export function getCustomerGroupTree(
  json: RequestData<string>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<CustomerGroupEntity[]>(
    {
      url: Url.CUSTOMER_GROUP_GET_TREE,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
