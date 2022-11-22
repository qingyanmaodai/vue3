import {
  invCountGainColumns,
  invCountLossColumns,
  invCountSheetColumns,
  warPurInputColumns,
  warPurOrdersColumns,
  warPurReturnColumns,
} from '/@/components/ExTable/data';
import { PageEnum } from '/@/enums/pageEnum';
import { Url } from '/@/api/apiLink';

//上查下查公共配置
export const getUpDownSearchList = [
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
];
export const sourceDwtail = [
  {
    billType: 'BsInventoryCountGain', //盘盈
    detailUrl: PageEnum.INV_COUNT_GAIN_DETAIL,
  },
  {
    billType: 'BsInventoryCountLoss', //盘亏
    detailUrl: PageEnum.INV_COUNT_LOSS_DETAIL,
  },
  {
    billType: 'BsInventoryCount', //盘点
    detailUrl: PageEnum.INV_COUNT_SHEET_DETAIL,
  },
  {
    billType: 'BsPurchaseOrder', //采购订单
    detailUrl: PageEnum.WAR_PUR_ORDERS_DETAIL,
  },
  {
    billType: 'BsPurchaseInStock', //采购入库
    detailUrl: PageEnum.WAR_PUR_INPUT_DETAIL,
  },
  {
    billType: 'BsPurchaseReturn', //采购退货
    detailUrl: PageEnum.WAR_PUR_RETURN_DETAIL,
  },
  {
    billType: 'BsProMoInStock', //生产入库
    detailUrl: PageEnum.WAR_PRO_INSTOCK_DETAIL,
  },
  {
    billType: 'BsProMoReturn', //生产出库
    detailUrl: PageEnum.WAR_PRO_RETURN_DETAIL,
  },
  {
    billType: 'BsProMoOrder', //生产订单----存疑
    detailUrl: PageEnum.WAR_PRO_ORDER_DETAIL,
  },
];
