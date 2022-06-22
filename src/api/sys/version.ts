import { defHttp } from '/@/utils/http/axios';

/**
 * @description: 版本查询
 */

export const getUpdateRecord = (params: Object) => {
  return defHttp.post({
    url: '/pda/system/getUpdateRecord',
    data: params,
  });
};
