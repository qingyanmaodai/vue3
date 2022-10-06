import { ErrorMessageMode, Result } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { Url, RequestData, SearchParams, PublicModel } from '/@/api/apiLink';
import { ExaProjectEntity } from '/@/api/exaProject';

export interface ExaEntity extends PublicModel {
  id: string | undefined;
  number: string;
  name: string;
  isOpen?: number;
  description?: string;
  examineType?: string;
  business?: string;
  ruleId?: string;
  ruleName?: string;
  bdExamineRule?: object;
  bsStatus?: string;
  bdExamineDetailList?: ExaDetailEntity[];
}
export interface ExaDetailEntity extends PublicModel {
  id: string | undefined;
  number?: string;
  name?: string;
  seq: number;
  min?: number;
  max?: number;
  refer?: string;
  isOpen?: number;
  bsStatus?: string;
  isRequire: number;
  description?: string;
  parentId?: string;
  bdExamineProject?: ExaProjectEntity;
  examine?: ExaEntity;
}
/**
 * 获取表格信息
 */
export function getDataList(json: RequestData<SearchParams[]>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.GET_EXA_SCHEME_LIST,
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
  return defHttp.post<Result>(
    {
      url: Url.GET_EXA_SCHEME_DTO,
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
export function add(json: RequestData<ExaEntity>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<ExaEntity>(
    {
      url: Url.ADD_EXA_SCHEME,
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
export function update(json: RequestData<ExaEntity>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<ExaEntity>(
    {
      url: Url.UPDATE_EXA_SCHEME,
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
  return defHttp.post<ExaEntity>(
    {
      url: Url.AUDIT_EXA_SCHEME,
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
      url: Url.BATCH_AUDIT_EXA_SCHEME,
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
      url: Url.QUERY_ONE_EXA_SCHEME,
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
      url: Url.DEL_EXA_SCHEME,
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
      url: Url.BATCH_DEL_EXA_SCHEME,
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
  return defHttp.post<ExaEntity>(
    {
      url: Url.UN_AUDIT_EXA_SCHEME,
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
      url: Url.BATCH_UN_AUDIT_EXA_SCHEME,
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
      url: Url.EXPORT_EXA_SCHEME,
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
      url: Url.IMPORT_EXA_SCHEME,
      data: json,
      responseType: 'blob',
    },
    {
      errorMessageMode: mode,
      isTransformResponse: false,
    },
  );
}
