import { ErrorMessageMode, Result } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { Url, RequestData, SearchParams, PublicModel } from '/@/api/apiLink';
import { ExaEntity } from '/@/api/exa';
import { StockEntity } from '/@/api/mainStock';
import { StockLocationEntity } from '/@/api/stockLocation';
import { StockCompartmentEntity } from '/@/api/stockCompartment';
import { MatGroupEntity } from '/@/api/matGroup';
import { UnitEntity } from '/@/api/unit';

export interface MatEntity extends PublicModel {
  id?: string;
  number?: string;
  name?: string;
  shortName?: string;
  baseUnitName?: string;
  baseUnitId?: string;
  groupId?: string;
  groupName?: string;
  weightUnit?: UnitEntity;
  baseUnit?: UnitEntity;
  bdMaterialGroup?: MatGroupEntity;
  attr?: string;
  weightUnitId?: string;
  netWeight?: number;
  model?: string;
  oldMatNumber?: number;
  stockId?: string;
  bdStock?: StockEntity;
  compartmentId?: string;
  bdStockLocation?: StockLocationEntity;
  examineId?: string;
  bdStockCompartment?: StockCompartmentEntity;
  locationId?: string;
  enableSn?: number;
  enableBatch?: number;
  storagePeriod?: number;
  minStockNum?: number;
  maxStockNum?: number;
  safeStockNum?: number;
  stockInExamine?: number;
  stockOutExamine?: number;
  produceExamine?: number;
  bdExamine?: ExaEntity;
}
/**
 * 获取表格信息
 */
export function getMatTable(json: RequestData<SearchParams[]>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.GET_MATERIAL_LIST,
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
export function getMatOption(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.GET_MAT_DTO,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}

/**
 * 添加物料信息
 */
export function addMatTable(json: RequestData<MatEntity>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.ADD_MATERIAL,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 编辑物料信息
 */
export function updateMatTable(json: RequestData<MatEntity>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.UPDATE_MATERIAL,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 审核物料信息
 */
export function auditMatTable(json: RequestData<object>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.AUDIT_MATERIAL,
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
export function auditMatTableBatch(json: RequestData<object>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.BATCH_AUDIT_MATERIAL,
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
export function unAuditMatTable(json: RequestData<object>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.UN_AUDIT_MATERIAL,
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
export function unAuditMatTableBatch(
  json: RequestData<object>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.BATCH_UN_AUDIT_MATERIAL,
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
export function getMatTableById(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.GET_MATERIAL_BY_ID,
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
export function delMatTableById(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.DEL_MATERIAL,
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
export function delMatTableBatch(
  json: RequestData<Array<string>>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.BATCH_DEL_MATERIAL,
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
export function exportTableList(json: RequestData<any>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.EXPORT_MATERIAL_LIST,
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
export function importModel(json: RequestData<any>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.IMPORT_MODEL,
      data: json,
      responseType: 'blob',
    },
    {
      errorMessageMode: mode,
      isTransformResponse: false,
    },
  );
}
