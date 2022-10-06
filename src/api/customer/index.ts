import { ErrorMessageMode, Result } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { Url, RequestData, SearchParams, PublicModel } from '/@/api/apiLink';

export interface CustomerEntity extends PublicModel {
  id?: string;
  number?: string;
  name?: string;
  shortName?: string;
  contact?: string;
  phone?: string;
  address?: string;
  country?: string;
  provincial?: number;
  municipal?: number;
  district?: number;
  groupId?: string;
}

export function getOneCustomer(id: string, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.CUSTOMER_GET_ONE,
      data: {
        params: id,
      },
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}

/**
 * 获取供应商列表
 */
export function getCustomerData(
  json: RequestData<SearchParams[]>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.CUSTOMER_GET_DATA,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}

/**
 * 获取选项
 */
export function getCustomerEntity(mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.GET_CUSTOMER_DTO,
      data: {},
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}

/**
 * 保存供应商
 */
export function save(json: RequestData<object>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.CUSTOMER_SAVE,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}

/**
 * 修改供应商
 */
export function update(json: RequestData<object>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.CUSTOMER_UPDATE,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}

/**
 * 审核供应商
 */
export function audit(json: RequestData<object>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.CUSTOMER_AUDIT,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}

/**
 * 反审核供应商
 */
export function unAudit(json: RequestData<object>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.CUSTOMER_UN_AUDIT,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}

/**
 * 批量审核
 */
export function batchAuditCustomer(json: RequestData<object>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.CUSTOMER_BATCH_AUDIT,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}

/**
 * 批量反审核
 */
export function batchUnAuditCustomer(
  json: RequestData<object>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.CUSTOMER_BATCH_UN_AUDIT,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}

/**
 * 删除供应商
 */
export function deleteCustomer(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.CUSTOMER_DELETE,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}

/**
 * 批量删除供应商
 */
export function batchDeleteCustomer(
  json: RequestData<Array<string>>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.CUSTOMER_BATCH_DELETE,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}

/**
 * 导出表格数据
 */
export function exportCustomerData(json: RequestData<any>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.CUSTOMER_EXPORT_DATA,
      data: json,
      responseType: 'blob',
    },
    {
      errorMessageMode: mode,
      isTransformResponse: false,
    },
  );
}
/**
 * 导入的下载模板
 */
export function customerImportModel(json: RequestData<any>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.CUSTOMER_IMPORT_MODEL,
      data: json,
      responseType: 'blob',
    },
    {
      errorMessageMode: mode,
      isTransformResponse: false,
    },
  );
}
