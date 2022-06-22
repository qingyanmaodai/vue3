/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
  captcha?: string;
  checkKey?: number;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
  userInfo?: any;
  sysAllDictItems?: any;
  pdaUser?: any;
  departs?: any;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
  //所属租户
  tenantList?: any[];
}
