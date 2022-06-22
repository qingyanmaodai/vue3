import { defHttp } from '/@/utils/http/axios';

/**
 * @description: Get user menu based on id
 */

export const getwlbmandxlh = (params: Object) => {
  return defHttp.post({
    url: '/pda/sn/wlbmandxlh-info',
    data: params,
  });
};

export const findtracesthequeryInfo = (params: Object) => {
  return defHttp.post({
    url: '/pda/sn/tracesthequery-info',
    data: params,
  });
};

export const findPackageRemove = (params: Object) => {
  return defHttp.post({
    url: '/pda/package/find-package-remove',
    data: params,
  });
};
