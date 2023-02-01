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
  //盘点单详情页
  INV_COUNT_SHEET_DETAIL = '/inventory/countSheet/detail',
  //采购订单详情页
  WAR_PUR_ORDERS_DETAIL = '/warehouse/purchase/orders/detail',
  //采购退货详情页
  WAR_PUR_RETURN_DETAIL = '/warehouse/purchase/return/detail',
  //采购入库详情页
  WAR_PUR_INPUT_DETAIL = '/warehouse/purchase/input/detail',
  //生产入库详情页
  WAR_PRO_INSTOCK_DETAIL = '/warehouse/produce/instock/detail',
  //生产订单详情页
  WAR_PRO_ORDER_DETAIL = '/warehouse/produce/order/detail',
  //生产退料单详情页
  WAR_PRO_RETURN_DETAIL = '/warehouse/produce/return/detail',
  //生产用料清单详情页
  WAR_PRO_BOM_DETAIL = '/warehouse/produce/bom/detail',
  //生产领料单详情页
  WAR_PRO_PICKS_DETAIL = '/warehouse/produce/picks/detail',
  //生产补料单详情页
  WAR_PRO_FEED_DETAIL = '/warehouse/produce/feed/detail',
  //销售订单详情页
  WAR_SALE_ORDER_DETAIL = '/warehouse/sale/order/detail',
  //销售发货详情页
  WAR_SALE_SENDOUT_DETAIL = '/warehouse/sale/sendout/detail',
  //销售退货详情页
  WAR_SALE_RETURN_DETAIL = '/warehouse/sale/return/detail',
  //销售退货通知详情页
  WAR_SALE_NOTICE_DETAIL = '/warehouse/sale/notice/detail',
  //销售订单详情页
  WAR_TRANSFER_ORDER_DETAIL = '/warehouse/transfer/order/detail',
  //其他入库详情页
  WAR_OTHERS_INPUT_DETAIL = '/warehouse/others/input/detail',
  //其它出库详情页
  WAR_OTHERS_OUTPUT_DETAIL = '/warehouse/others/output/detail',
  //条码规则
  BARCODE_RULES_DETAIL = '/barcode/barcodeRules/detail',
}
