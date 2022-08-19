import { ErrorMessageMode, Result, UploadFileParams } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { Url, RequestData, SearchParams } from '/@/api/apiLink';

export interface StockLocationProfileEntity {
  id?: string;
  number?: string;
  name?: string;
  stockId?: string;
  subStockId?: string;
  address?: string;
  erpCode?: string;
  info?: string;
  isDelete?: string;
  tenantId?: string;
  bsStatus?: string;
  mark?: string;
  createTime?: string;
  createBy?: string;
  updateTime?: string;
  updateBy?: string;
}
/**
 * 获取表格信息
 */
export function getStockLocationTable(
  json: RequestData<SearchParams[]>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.GET_PAGE_STOCK_LOCATION_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 添加仓位信息
 */
export function addStockLocationList(
  json: RequestData<StockLocationProfileEntity>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.ADD_STOCK_LOCATION_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 编辑仓位信息
 */
export function updateStockLocationList(
  json: RequestData<StockLocationProfileEntity>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.UPDATE_STOCK_LOCATION_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 审核仓位信息
 */
export function auditStockLocationList(
  json: RequestData<object>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.AUDIT_STOCK_LOCATION_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 批量审核仓位信息
 */
export function auditStockLocationListBatch(
  json: RequestData<object>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.BATCH_AUDIT_STOCK_LOCATION,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 反审核仓位信息
 */
export function unAuditStockLocationList(
  json: RequestData<object>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.UN_AUDIT_STOCK_LOCATION_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 批量反审核仓位信息
 */
export function unAuditStockLocationListBatch(
  json: RequestData<object>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.UN_BATCH_AUDIT_STOCK_LOCATION,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 查询单条
 */
export function getStockLocationListById(
  json: RequestData<string>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.GET_ID_STOCK_LOCATION_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 删除单条
 */
export function delStockLocationListById(
  json: RequestData<string>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.DELETE_STOCK_LOCATION_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 删除多条
 */
export function delStockLocationListBatch(
  json: RequestData<Array<string>>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.BATCH_DELETE_STOCK_LOCATION,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 基本单位查询字段
 */
// export function getStockLocationListUnit(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
//   return defHttp.post<Result>(
//     {
//       url: Url.GET_STOCK_LOCATION_UNIT,
//       data: json,
//     },
//     {
//       errorMessageMode: mode,
//       isTransformResponse: true,
//     },
//   );
// }
/**
 * 导出表格数据
 */
export function exportStockLocationList(
  json: RequestData<any>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.EXPORT_STOCK_LOCATION_LIST,
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
 * 导入仓位数据
 */
export function importStockLocationList(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<any>(
    {
      url: Url.IMPORT_STOCK_LOCATION_LIST,
      onUploadProgress,
    },
    params,
  );
}
/**
 * 导入的下载模板
 */
export function importStockLocationModel(
  json: RequestData<any>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.IMPORT_MODEL_STOCK_LOCATION,
      data: json,
      responseType: 'blob',
    },
    {
      errorMessageMode: mode,
      isTransformResponse: false,
    },
  );
}
