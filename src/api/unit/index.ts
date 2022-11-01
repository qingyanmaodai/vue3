import { ErrorMessageMode, Result } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { Url, RequestData, SearchParams, PublicModel } from '/@/api/apiLink';

export interface UnitEntity extends PublicModel {
  id?: string;
  number?: string;
  name?: string;
  info?: string;
  tenantId?: string;
  bsType?: string;
}

/**
 * 基本（计量）单位查询字段
 */
export function getUnitOption(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.GET_UNIT_DTO,
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
export function getUnitTable(
  json: RequestData<SearchParams[]>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.GET_PAGE_UNIT_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 添加计量单位信息
 */
export function addUnitList(json: RequestData<UnitEntity>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.ADD_UNIT_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 编辑计量单位信息
 */
export function updateUnitList(json: RequestData<UnitEntity>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.UPDATE_UNIT_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 审核计量单位信息
 */
export function auditUnitList(json: RequestData<object>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.AUDIT_UNIT_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 批量审核计量单位信息
 */
export function auditUnitListBatch(json: RequestData<object>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.BATCH_AUDIT_UNIT_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 反审核计量单位信息
 */
export function unAuditUnitList(json: RequestData<object>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.UN_AUDIT_UNIT_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 批量反审核计量单位信息
 */
export function unAuditUnitListBatch(
  json: RequestData<object>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.UN_BATCH_AUDIT_UNIT_LIST,
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
export function getUnitListById(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.GET_ONE_UNIT_LIST,
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
export function delUnitListById(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.DELETE_UNIT_LIST,
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
export function delUnitListBatch(
  json: RequestData<Array<string>>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.BATCH_DELETE_UNIT_LIST,
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
export function exportUnitList(json: RequestData<any>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.EXPORT_UNIT_LIST,
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
export function importUnitModel(json: RequestData<any>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.IMPORT_MODEL_UNIT,
      data: json,
      responseType: 'blob',
    },
    {
      errorMessageMode: mode,
      isTransformResponse: false,
    },
  );
}
