import { ErrorMessageMode, Result } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { Url, RequestData, SearchParams, PublicModel } from '/@/api/apiLink';
import { StockEntity } from '/@/api/mainStock';
import { EmployeeEntity } from '/@/api/employee';

export interface StockCompartmentEntity extends PublicModel {
  id?: string;
  number?: string;
  name?: string;
  address?: string;
  empId?: string;
  phone?: string;
  stockId?: string;
  bdStock?: StockEntity;
  bdEmployee?: EmployeeEntity;
}

/**
 * 获取分仓选项
 */
export function getSubOption(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.GET_SUB_STOCK_DTO,
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
export function getStockCompartmentTable(
  json: RequestData<SearchParams[]>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.GET_PAGE_STOCK_COMPARTMENT_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 添加分仓信息
 */
export function addStockCompartmentList(
  json: RequestData<StockCompartmentEntity>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.ADD_STOCK_COMPARTMENT_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 编辑分仓信息
 */
export function updateStockCompartmentList(
  json: RequestData<StockCompartmentEntity>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.UPDATE_STOCK_COMPARTMENT_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 审核分仓信息
 */
export function auditStockCompartmentList(
  json: RequestData<object>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.AUDIT_STOCK_COMPARTMENT_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 批量审核分仓信息
 */
export function auditStockCompartmentListBatch(
  json: RequestData<object>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.BATCH_AUDIT_STOCK_COMPARTMENT_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 反审核分仓信息
 */
export function unAuditStockCompartmentList(
  json: RequestData<object>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.UN_AUDIT_STOCK_COMPARTMENT_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 批量反审核分仓信息
 */
export function unAuditStockCompartmentListBatch(
  json: RequestData<object>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.UN_BATCH_AUDIT_STOCK_COMPARTMENT_LIST,
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
export function getStockCompartmentListById(
  json: RequestData<string>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.GET_ID_STOCK_COMPARTMENT_LIST,
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
export function delStockCompartmentListById(
  json: RequestData<string>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.DELETE_STOCK_COMPARTMENT_LIST,
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
export function delStockCompartmentListBatch(
  json: RequestData<Array<string>>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.BATCH_DELETE_STOCK_COMPARTMENT_LIST,
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
export function exportStockCompartmentList(
  json: RequestData<any>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.EXPORT_STOCK_COMPARTMENT_LIST,
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
export function importStockCompartmentModel(
  json: RequestData<any>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.IMPORT_MODEL_STOCK_COMPARTMENT_LIST,
      data: json,
      responseType: 'blob',
    },
    {
      errorMessageMode: mode,
      isTransformResponse: false,
    },
  );
}
