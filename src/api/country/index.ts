import { ErrorMessageMode } from '/#/axios';
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
