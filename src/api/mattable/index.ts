import { ErrorMessageMode, Result } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { Url, RequestData, testApi } from '/@/api/apiLink';

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
  mark?: string; //备注
  number?: string; //物料编码
  erpCode?: string;
  bsStatus?: string; //业务状态A创建B审核
  isDelete?: boolean; //是否删除
  createTime?: string; //创建时间
  updateTime?: string; //修改时间
  createBy?: string; //创建人员
  updateBy?: string; //更新人员
  tenantId?: number; //租户ID
  name?: string; //物料名称
  model?: string; //规格型号
  baseUnitId?: number; //基本单位ID
  weightUnitId?: number; //重量单位
  groupId?: string; //物料分组编码
  attr?: string; //物料属性：A自制，B外购，C委外，D虚拟
  packId?: string; //包装容器ID
  examinSet?: string; //检验设置A采购检验B生产检验 可组合用，隔开
  examineType?: string; //检验类型A免检，B质检，C全检
  examineProjectId?: number; //检验方案id
  examineRuleId?: number; //抽检规则
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
export function auditMatTable(json: RequestData<any>, mode: ErrorMessageMode = 'message') {
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
 * 高级查询
 */
// export function getMatTableMore(
//   json: RequestData<MatMoreEntity[]>,
//   mode: ErrorMessageMode = 'message',
// ) {
//   return defHttp.post<Result>(
//     {
//       url: Url.GET_TABLE_MORE,
//       data: json,
//     },
//     {
//       errorMessageMode: mode,
//       isTransformResponse: true,
//     },
//   );
// }
// /**
//  * 删除单条
//  */
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
// /**
//  * 删除单条
//  */
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
export function getMatTableUnitList(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.GET_TABLE_UNIT_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 公共
 */
export function getPublicList(
  json: RequestData<string>,
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
