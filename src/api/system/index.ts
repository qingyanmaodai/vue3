import { ErrorMessageMode, Result } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { Url, PublicModel } from '/@/api/apiLink';

export interface SystemEntity extends PublicModel {
  id: number;
  info: null;
  name: string;
  number: string;
  tenantId: number;
  val: string;
}
/**
 * 查询系统参数
 */
export function getSystemList(json: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.GET_SYSTEM_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 编辑系统参数
 */
export function updateSystemList(json: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post<SystemEntity>(
    {
      url: Url.UPDATE_SYSTEM,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 查询仓库维度
 */
export function getStockDis(json: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.GET_SYSTEM_STOCK_DIS,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 查询是否允许负库存
 */
export function getIsNeStock(json: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.GET_SYSTEM_IS_NE_STOCK,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
