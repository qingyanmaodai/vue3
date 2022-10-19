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
