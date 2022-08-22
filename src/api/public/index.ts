import { ErrorMessageMode, Result, UploadFileParams } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { PublicModel, RequestData, Url } from '/@/api/apiLink';

//国家地区实体信息
export interface CountryEntity extends PublicModel {
  id?: string;
  number?: string;
  name?: string;
  level?: number;
  parentId?: string;
  children?: CountryEntity[];
  label?: string;
  value?: string;
  isLeaf?: boolean;
}

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
 * 公共请求
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

/**
 * 获取地区
 */
export function getCountryTree(json: RequestData<string>, mode: ErrorMessageMode = 'message') {
  return defHttp.post<CountryEntity[]>(
    {
      url: Url.COUNTRY_TREE,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
}
