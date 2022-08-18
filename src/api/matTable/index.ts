import { ErrorMessageMode, Result, UploadFileParams } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { Url, RequestData } from '/@/api/apiLink';

export interface MatTableEntity {
  table?: string;
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
 * 获取表格信息
 */
export function getMatTable(
  json: RequestData<MatTableEntity[]>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.GET_TABLE_LIST,
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
      url: Url.GET_OPTIONS_LIST,
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
 * 获取分仓选项
 */
export function getSubOption(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.GET_SUB_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 获取仓位选项
 */
export function getLocationOption(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.GET_LOCATION_LIST,
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
export function addMatTable(
  json: RequestData<MatProfileEntity>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.ADD_TABLE_LIST,
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
export function updateMatTable(
  json: RequestData<MatProfileEntity>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.UPDATE_TABLE_LIST,
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
      url: Url.AUDIT_TABLE_LIST,
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
      url: Url.BATCH_AUDIT_TABLE_LIST,
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
      url: Url.UNAUDIT_TABLE_LIST,
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
      url: Url.BATCH_UNAUDIT_TABLE_LIST,
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
      url: Url.GET_TABLE_BY_ID,
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
      url: Url.DEL_TABLE_LIST,
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
      url: Url.BATCH_DEL_TABLE_LIST,
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
export function getMatTableUnit(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.GET_TABLE_UNIT,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 基本单位查询
 */
// export function getMatTableUnitList(json: RequestData<object>, mode: ErrorMessageMode = 'message') {
//   return defHttp.post<Result>(
//     {
//       url: Url.GET_TABLE_UNIT_LIST,
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
export function exportTableList(json: RequestData<any>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.EXPORT_TABLE_LIST,
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
 * 导入物料数据
 */
export function importMaterial(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<any>(
    {
      url: Url.IMPORT_MATERIAL,
      onUploadProgress,
    },
    params,
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
/**
 * 公共
 */
export function getPublicList(
  json: RequestData<any>,
  url: string,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: url,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
