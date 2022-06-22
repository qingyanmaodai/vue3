import { defHttp } from '/@/utils/http/axios';
import { getMenuListResultModel, getPermissionMenu } from './model/menuModel';

enum Api {
  GetMenuList = '/getMenuList',
  GetMenuPermission = '/sys/permission/getUserPermissionByToken',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defHttp.get<getPermissionMenu>({ url: Api.GetMenuPermission });
};
