import { ErrorMessageMode, Result } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { Url, RequestData, SearchParams, PublicModel } from '/@/api/apiLink';

export interface StockProfileEntity extends PublicModel {
  id?: string;
  number?: string;
  name?: string;
  address?: string;
  bsProperty?: string;
  info?: string;
  isDefault?: string;
  isDelete?: string;
  mainBy?: string;
  phone?: string;
  tenantId?: number;
  stockInExamine?: string;
  stockOutExamine?: string;
  labelValue?: string;
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
 * 获取表格信息
 */
export function getStockTable(
  json: RequestData<SearchParams[]>,
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
 * 根据id获取表格信息
 */
export function getOneStockById(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.GET_ONE_STOCK_LIST,
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
export function addStockList(
  json: RequestData<StockProfileEntity>,
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
export function updateStockList(
  json: RequestData<StockProfileEntity>,
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
export function auditStockList(json: RequestData<object>, mode: ErrorMessageMode = 'message') {
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
export function auditStockListBatch(json: RequestData<object>, mode: ErrorMessageMode = 'message') {
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
export function unAuditStockList(json: RequestData<object>, mode: ErrorMessageMode = 'message') {
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
export function unAuditStockListBatch(
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
// export function getStockListById(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
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
export function delStockListById(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
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
export function delStockListBatch(
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
// export function getStockListUnit(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
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
