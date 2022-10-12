export enum PageEnum {
  // basic login path
  BASE_LOGIN = '/login',
  // basic home path
  BASE_HOME = '/dashboard',
  // error page path
  ERROR_PAGE = '/exception',
  // error log page path
  ERROR_LOG_PAGE = '/error-log/list',
  //供应商详情页
  SUPPLIER_DETAIL = '/basic/supplier/detail',
  //人员详情页
  EMPLOYEE_DETAIL = '/basic/employee/detail',
  //客户详情页
  CUSTOMER_DETAIL = '/basic/customer/detail',
  //物料信息详情页
  MATERIAL_ADD_AND_EDIT = '/basic/material/detail',
  //仓库详情页
  MAIN_STOCK_DETAIL_AND_EDIT = '/basic/stock/mainStock/detail',
  //分仓详情页
  STOCK_COMPARTMENT_DETAIL_AND_EDIT = '/basic/stock/stockCompartment/detail',
  //仓位详情页
  STOCK_LOCATION_DETAIL_AND_EDIT = '/basic/stock/stockLocation/detail',
  //检验项目详情页
  EXA_PROJECT_DETAIL = '/examine/project/detail',
  //计量单位详情页
  UNIT_DETAIL = '/basic/unit/detail',
  //抽检规则详情页
  EXA_RULE_DETAIL = '/examine/rule/detail',
  //检验方案详情页
  EXA_SCHEME_DETAIL = '/examine/scheme/detail',
  //盘盈单详情页
  INV_COUNT_GAIN_DETAIL = '/inventory/countGain/detail',
  //盘亏单详情页
  INV_COUNT_LOSS_DETAIL = '/inventory/countLoss/detail',
}
