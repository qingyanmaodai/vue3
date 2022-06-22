import { defHttp } from '/@/utils/http/axios';

/**
 * @description: 日志查询
 */

export const logList = (params: Object) => {
  return defHttp.get(
    {
      url: '/sys/log/listlog',
      params,
    },
    {
      isTransformResponse: false,
    },
  );
};
