import { ErrorMessageMode, Result, UploadFileParams } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { Url, RequestData } from '/@/api/apiLink';

export interface StockTableEntity {
  stock?: string;
  id?: string;
  name?: string;
  column?: string;
  link?: string;
  rule?: string;
  type?: string;
  val?: string;
  startWith?: string;
  endWith?: string;
}
export interface MatProfileEntity {
  id?: string;
  number?: string;
  name?: string;
  address?: string;
  bsProperty?: string;
  erpCode?: string;
  info?: string;
  isDefault?: string;
  isDelete?: string;
  mainBy?: string;
  phone?: string;
  tenantId?: number;
  attr?: string;
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
export function getStockTable(
  json: RequestData<StockTableEntity[]>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.GET_PAGE_STOCK_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 获取仓库选项
 */
export function getStockOption(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.GET_STOCK_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 添加仓库信息
 */
export function addStockTable(
  json: RequestData<MatProfileEntity>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.ADD_STOCK_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 编辑仓库信息
 */
export function updateStockTable(
  json: RequestData<MatProfileEntity>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.UPDATE_STOCK_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 审核仓库信息
 */
export function auditStockTable(json: RequestData<object>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.AUDIT_STOCK_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 批量审核仓库信息
 */
export function auditStockTableBatch(
  json: RequestData<object>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.BATCH_AUDIT_STOCK_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 反审核仓库信息
 */
export function unAuditStockTable(json: RequestData<object>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.UN_AUDIT_STOCK_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 批量反审核仓库信息
 */
export function unAuditStockTableBatch(
  json: RequestData<object>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.UN_BATCH_AUDIT_STOCK_LIST,
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
// export function getStockTableById(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
//   return defHttp.post<Result>(
//     {
//       url: Url.GET_Stock_BY_ID,
//       data: json,
//     },
//     {
//       errorMessageMode: mode,
//       isTransformResponse: true,
//     },
//   );
// }
/**
 * 删除单条
 */
export function delStockTableById(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.DELETE_STOCK_LIST,
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
export function delStockTableBatch(
  json: RequestData<Array<string>>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.BATCH_DELETE_STOCK_LIST,
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
// export function getStockTableUnit(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
//   return defHttp.post<Result>(
//     {
//       url: Url.GET_Stock_UNIT,
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
export function exportStockList(json: RequestData<any>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.EXPORT_STOCK_LIST,
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
 * 导入仓库数据
 */
export function importStockList(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<any>(
    {
      url: Url.IMPORT_STOCK_LIST,
      onUploadProgress,
    },
    params,
  );
}
/**
 * 导入的下载模板
 */
export function importStockModel(json: RequestData<any>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.IMPORT_MODEL_STOCK_LIST,
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
 * 公共
 */
// export function getPublicList(
//   json: RequestData<any>,
//   url: string,
//   mode: ErrorMessageMode = 'message',
// ) {
//   return defHttp.post<Result>(
//     {
//       url: url,
//       data: json,
//     },
//     {
//       errorMessageMode: mode,
//       isTransformResponse: true,
//     },
//   );
// }
