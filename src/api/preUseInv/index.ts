import { RequestData, SearchParams, Url } from '/@/api/apiLink';
import { ErrorMessageMode, Result } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';

/**
 * 明细来源
 */
export function getPreUseSourceDetail(
  json: RequestData<SearchParams[]>,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Result>(
    {
      url: Url.GET_INV_PRE_USE_SOURCE_DETAIL,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
