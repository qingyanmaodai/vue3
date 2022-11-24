import { ErrorMessageMode, UploadFileParams } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { RequestData, Url } from '/@/api/apiLink';

/**
 * 上传文件接口
 * @param urlConfig
 * @param params
 * @param onUploadProgress
 */
export function importData(
  urlConfig: string,
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<any>(
    {
      url: Url[urlConfig],
      onUploadProgress,
    },
    params,
  );
}

/**
 * 下推配置查询
 */
export function getPushDownList(json: RequestData<object>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<any>(
    {
      url: Url.GET_PUSHDOWN_LIST,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
/**
 * 公共请求
 */
export function getPublicList(
  json: RequestData<any>,
  url: string,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<any>(
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
