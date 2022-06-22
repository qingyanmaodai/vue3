import { defHttp } from '/@/utils/http/axios';

/**
 * @description: 新增版本
 */

export const addNewVersion = (params: Object) => {
  return defHttp.post(
    {
      url: '/pda/system/saveOrUpdateVersion',
      data: { params },
    },
    {
      isTransformResponse: false,
    },
  );
};

//删除
export const delNewVersion = (params: Object) => {
  return defHttp.post(
    {
      url: '/pda/system/deleteVersion',
      data: { params },
    },
    {
      isTransformResponse: false,
    },
  );
};
//查询用户角色
export const getAllSysDepart = () => {
  return defHttp.get(
    {
      url: '/sys/sysDepart/queryTreeList',
    },
    {
      isTransformResponse: false,
    },
  );
};

//查询用户
export const queryAllUserBackCombo = () => {
  return defHttp.get(
    {
      url: '/sys/user/queryUserByTenantId',
    },
    {
      isTransformResponse: false,
    },
  );
};
