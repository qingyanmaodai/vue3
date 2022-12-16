import {
  invCountGainColumns,
  invCountLossColumns,
  invCountSheetColumns,
  warProInStockColumns,
  warProOrderColumns,
  warProPicksColumns,
  warProReturnColumns,
  warPurInputColumns,
  warPurOrdersColumns,
  warPurReturnColumns,
  warSaleOrderColumns,
  warSaleSendOutColumns,
  warSaleReturnColumns,
  warSaleNoticeColumns, warProBomColumns,
} from '/@/components/ExTable/data';
import { PageEnum } from '/@/enums/pageEnum';
import { Url } from '/@/api/apiLink';
export const filterType = (arr, current: string) => {
  return arr.filter((e) => e.type === current);
};
//公共配置
export const publicUrlList = [
  {
    type: 'BsInventoryCountGain', //盘盈
    listUrl: Url.GET_PAGE_INV_COUNT_GAIN_LIST,
    detailUrl: PageEnum.INV_COUNT_GAIN_DETAIL,
    TableCols: invCountGainColumns,
  },
  {
    type: 'BsInventoryCountLoss', //盘亏
    listUrl: Url.GET_PAGE_INV_COUNT_LOSS_LIST,
    detailUrl: PageEnum.INV_COUNT_LOSS_DETAIL,
    TableCols: invCountLossColumns,
  },
  {
    type: 'BsInventoryCount', //盘点
    listUrl: Url.GET_PAGE_INV_COUNT_LIST,
    detailUrl: PageEnum.INV_COUNT_SHEET_DETAIL,
    TableCols: invCountSheetColumns,
  },
  {
    type: 'BsPurchaseOrder', //采购订单
    listUrl: Url.GET_PAGE_PURCHASE_ORDER_LIST,
    detailUrl: PageEnum.WAR_PUR_ORDERS_DETAIL,
    TableCols: warPurOrdersColumns,
  },
  {
    type: 'BsPurchaseInStock', //采购入库
    listUrl: Url.GET_PAGE_PURCHASE_INSTOCK_LIST,
    detailUrl: PageEnum.WAR_PUR_INPUT_DETAIL,
    TableCols: warPurInputColumns,
  },
  {
    type: 'BsPurchaseReturn', //采购退货
    listUrl: Url.GET_PAGE_PURCHASE_RETURN_LIST,
    detailUrl: PageEnum.WAR_PUR_RETURN_DETAIL,
    TableCols: warPurReturnColumns,
  },
  {
    type: 'BsProMoInStock', //生产入库
    listUrl: Url.GET_PAGE_PRODUCE_INSTOCK_LIST,
    detailUrl: PageEnum.WAR_PRO_INSTOCK_DETAIL,
    TableCols: warProInStockColumns,
  },
  {
    type: 'BsProMo', //生产工单
    listUrl: Url.GET_PAGE_PRODUCE_ORDER_LIST,
    detailUrl: PageEnum.WAR_PRO_ORDER_DETAIL,
    TableCols: warProOrderColumns,
  },
  {
    type: 'BsProMoPick', //生产领料
    listUrl: Url.GET_PAGE_PRODUCE_PICK_LIST,
    detailUrl: PageEnum.WAR_PRO_PICKS_DETAIL,
    TableCols: warProPicksColumns,
  },
  {
    type: 'BsProMoReissue', //生产补料
    listUrl: Url.GET_PAGE_PRODUCE_FEED_LIST,
    detailUrl: PageEnum.WAR_PRO_FEED_DETAIL,
    TableCols: warProPicksColumns,
  },
  {
    type: 'BsProMoReturn', //生产退料
    listUrl: Url.GET_PAGE_PRODUCE_RETURN_LIST,
    detailUrl: PageEnum.WAR_PRO_RETURN_DETAIL,
    TableCols: warProReturnColumns,
  },
  {
    type: 'BsProMoOrder', //用料清单
    listUrl: Url.GET_PAGE_PRODUCE_BOM_LIST,
    detailUrl: PageEnum.WAR_PRO_BOM_DETAIL,
    TableCols: warProBomColumns,
  },
  {
    type: 'BsSaleOrder', //销售订单
    listUrl: Url.GET_PAGE_SALE_ORDER_LIST,
    detailUrl: PageEnum.WAR_SALE_ORDER_DETAIL,
    TableCols: warSaleOrderColumns,
  },
  {
    type: 'BsSaleOut', //销售发货
    listUrl: Url.GET_PAGE_SALE_SENDOUT_LIST,
    detailUrl: PageEnum.WAR_SALE_SENDOUT_DETAIL,
    TableCols: warSaleSendOutColumns,
  },
  {
    type: 'BsSaleReturn', //销售退货
    listUrl: Url.GET_PAGE_SALE_RETURN_LIST,
    detailUrl: PageEnum.WAR_SALE_RETURN_DETAIL,
    TableCols: warSaleReturnColumns,
  },
  {
    type: 'BsSaleNotice', //销售退货
    listUrl: Url.GET_PAGE_SALE_NOTICE_LIST,
    detailUrl: PageEnum.WAR_SALE_NOTICE_DETAIL,
    TableCols: warSaleNoticeColumns,
  },
];

export const checkDetailUrl = [
  {
    type: 'BdInventory', //库存数量
    preUseUrl: Url.GET_INV_PRE_USE_SOURCE_DETAIL,
    stockUrl: Url.GET_INV_SOURCE_DETAIL,
  },
];
