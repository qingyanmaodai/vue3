import { defHttp } from '/@/utils/http/axios';

/**
 * @description: 单据查询
 */

export const findBill = (params: Object) => {
  return defHttp.post({
    url: '/pda/bill-search/find-bill',
    data: params,
  });
};


export const exportXls = (params: Object) => {
  return defHttp.post({
      url: '/pda/bill-search/exportXls-bill',
      data: params,
      responseType: 'blob',
    },{
      isTransformResponse:false
    }
  );
};

