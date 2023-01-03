import { ErrorMessageMode, Result } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import {
  Url,
  RequestData,
  SearchParams,
  PublicModel,
  ControlSet,
  InvCountEntity,
} from '/@/api/apiLink';
import { StockEntity } from '/@/api/mainStock';
import { StockLocationEntity } from '/@/api/stockLocation';
import { StockCompartmentEntity } from '/@/api/stockCompartment';
import { MatEntity } from '/@/api/matTable';
import { Moment } from 'moment';
import { EmployeeEntity } from '/@/api/employee';
import { SupplierGroupEntity } from '/@/api/supplierGroup';

export interface saleReturnEntity extends PublicModel {
  id: string | undefined;
  number: string;
  bsDate?: string | Moment;
  empId?: string;
  empName?: string;
  supId?: string;
  supName?: string;
  reason?: string;
  supplierName?: string;
  bdEmployee?: EmployeeEntity;
  bdSupplier?: SupplierGroupEntity;
  way?: string;
  dtData?: saleReturnDetailEntity[];
  dtLk?: InvCountEntity;
  srcField?: string;
  srcBill?: string;
  srcBillId?: string;
  srcId?: string;
  srcType?: string;
  optStockNum?: string;
  compartmentId?: string;
  locationId?: string;
  lot?: string;
  matId?: string;
  parentId?: string;
  stockId?: string;
  tenantId?: string;
  pushDownStatus?: string;
}

export interface saleReturnDetailEntity extends PublicModel {
  id: string | undefined;
  number?: string;
  name?: string;
  seq: number;
  bsDate?: string;
  sort?: number;
  countNum?: string;
  lot?: string;
  parentId?: string;
  stockNum?: string;
  matId?: string;
  stockId?: string;
  compartmentId?: string;
  locationId?: string;
  bdMaterial?: MatEntity;
  bdStock?: StockEntity;
  bdStockCompartment?: StockCompartmentEntity;
  bdStockLocation?: StockLocationEntity;
}

/**
 * 获取表格信息
 */
export function getDataList(json: RequestData<SearchParams[]>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.GET_PAGE_SALE_RETURN_LIST,
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
export function getSearchOption(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<ControlSet[]>(
    {
      url: Url.GET_SALE_RETURN_DTO,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 添加信息
 */
export function add(json: RequestData<saleReturnEntity>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<saleReturnEntity>(
    {
      url: Url.ADD_WITH_DETAIL_SALE_RETURN,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 编辑信息
 */
export function update(
  json: RequestData<saleReturnEntity>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<saleReturnEntity>(
    {
      url: Url.UPDATE_SALE_RETURN,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 审核
 */
export function audit(json: RequestData<object>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<saleReturnEntity>(
    {
      url: Url.AUDIT_SALE_RETURN,
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
export function auditBatch(json: RequestData<Array<string>>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.BATCH_AUDIT_SALE_RETURN,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 下推
 */
export function pushDown(
  json: RequestData<object>,
  PushDownTableName: string, //可下推的表名
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<any>(
    {
      url: Url.PUSHDOWN_SALE_RETURN + PushDownTableName,
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
export function getOneById(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.GET_ONE_SALE_RETURN,
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
export function delById(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.DELETE_WITH_DETAIL_SALE_RETURN,
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
export function delBatch(json: RequestData<Array<string>>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.BATCH_DELETE_WITH_DETAIL_SALE_RETURN,
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
export function unAudit(json: RequestData<object>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<saleReturnEntity>(
    {
      url: Url.UN_AUDIT_SALE_RETURN,
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
export function unAuditBatch(json: RequestData<Array<string>>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.UN_BATCH_AUDIT_SALE_RETURN,
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
export function exportExcel(json: RequestData<any>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.EXPORT_SALE_RETURN,
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
export function importFile(json: RequestData<any>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.IMPORT_MODEL_SALE_RETURN,
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
 * 下查
 */
export function downSearch(json: RequestData<any>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.DOWN_SEARCH_SALE_RETURN,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 上查
 */
export function upSearch(json: RequestData<any>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.UP_SEARCH_SALE_RETURN,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
