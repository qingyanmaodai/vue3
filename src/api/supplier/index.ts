import { ErrorMessageMode, Result, UploadFileParams } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { Url, RequestData, SearchParams } from '/@/api/apiLink';

export interface SupplierEntity {
  id?: string;
  number?: string;
  name?: string;
  shortName?: string;
  baseUnitName?: string;
  baseUnitId?: string;
  groupId?: string | undefined;
  groupName?: string;
  attr?: string;
  weightUnitId?: string;
  weightName?: string;
  netWeight?: number;
  model?: string;
  bsStatus?: string;
  oldMatNumber?: number;
  mark?: string;
  node?: string;
  stockId?: string;
  bdStock?: string;
  subStockId?: string;
  bdSubStock?: string;
  bdStockLocationId?: string;
  bdStockLocationName?: string;
  enableSn?: number;
  enableBatch?: number;
  storagePeriod?: number;
  minStockNum?: number;
  maxStockNum?: number;
  safeStockNum?: number;
  stockInExamine?: number;
  stockOutExamine?: number;
  produceExamine?: number;
  createTime?: string;
  createBy?: string;
  updateTime?: string;
  updateBy?: string;
  examineId?: string;
}

/**
 * 获取供应商列表
 */
export function getSupplierData(
  json: RequestData<SearchParams[]>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.SUPPLIER_GET_DATA,
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
export function auditSupplier(json: RequestData<object>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.SUPPLIER_AUDIT,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}

/**
 * 批量审核物料信息
 */
export function batchAuditSupplier(json: RequestData<object>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.SUPPLIER_BATCH_AUDIT,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}

/**
 * 反审核物料信息
 */
export function unAuditSupplier(json: RequestData<object>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.SUPPLIER_UN_AUDIT,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}

/**
 * 批量反审核物料信息
 */
export function batchUnAuditSupplier(
  json: RequestData<object>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.SUPPLIER_BATCH_UN_AUDIT,
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
export function deleteSupplier(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.SUPPLIER_DELETE,
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
export function batchDeleteSupplier(
  json: RequestData<Array<string>>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.SUPPLIER_BATCH_DELETE,
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
export function exportSupplierData(json: RequestData<any>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.SUPPLIER_EXPORT_DATA,
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
 * 导入供应商数据
 */
export function importSupplier(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<any>(
    {
      url: Url.SUPPLIER_IMPORT,
      onUploadProgress,
    },
    params,
  );
}
/**
 * 导入的下载模板
 */
export function supplierImportModel(json: RequestData<any>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.SUPPLIER_IMPORT_MODEL,
      data: json,
      responseType: 'blob',
    },
    {
      errorMessageMode: mode,
      isTransformResponse: false,
    },
  );
}
