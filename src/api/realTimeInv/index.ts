import { RequestData, SearchParams, Url } from '/@/api/apiLink';
import { ErrorMessageMode, Result } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';

/**
 * 获取即时库存数据
 */
export function getInventoryList(
  json: RequestData<SearchParams[]>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.GET_INV_BY_MAT_STOCK_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}

/**
 * 分页查询
 */
export function getInvList(json: RequestData<SearchParams[]>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.GET_INV_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}

/**
 * 增加库存
 */
export function addStock(json: RequestData<SearchParams[]>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.GET_INV_ADD_STOCK,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}

/**
 * 减少库存
 */
export function reduceStock(json: RequestData<SearchParams[]>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Url.GET_INV_REDUCE_STOCK,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 明细来源
 */
export function getSourceDetail(
  json: RequestData<SearchParams[]>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.GET_INV_SOURCE_DETAIL,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
