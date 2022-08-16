import { ErrorMessageMode, Result } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';
import { createVNode, reactive } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
import { isFunction } from '/@/utils/is';

const showDialog = (content: string) => {
  Modal.confirm({
    title: () => '提示',
    icon: () => createVNode(ExclamationCircleOutlined),
    content: () => createVNode('div', { style: 'color:black;' }, content),
    class: 'test',
  });
};

export const showLoading = reactive({ show: false });
export const ScanHook = {
  afterScan: (res: boolean) => {
    let audio;
    if (res) {
      audio = new Audio('./audio/success.mp3');
      audio.play();
    }
    // else {
    //   audio = new Audio('./audio/fail.mp3');
    // }
  },
  afterSubmit: (res: boolean, message: string, callback?: Function) => {
    try {
      let audio;
      if (res) {
        audio = new Audio('./audio/submit_success.mp3');
      } else {
        audio = new Audio('./audio/submit_fail.mp3');
        showDialog(message);
        // createMessage.error(message);
      }
      audio.play();
      if (callback && isFunction(callback)) {
        callback();
      }
    } catch (e: any) {
      // alert(e.message);
      showDialog(e.message);
      console.log(e.message);
    }
  },
};

export enum SnOpt {
  OptPurIn = 'PurIn',
  OptSaleOut = 'SaleOut',
  OptTransferOut = 'TransferOut',
  OptPurReturn = 'PurReturn',
  OptSaleReturn = 'SaleReturn',
  OptOtherOut = 'OtherOut',
  OptOtherIn = 'OtherIn',
}
export const FlagSnOpt = {
  HasPurIn: (list: [] = []): boolean => {
    for (const k in list) {
      if ((list[k] as any).FOpt === SnOpt.OptPurIn) return true;
    }
    return false;
  },
  HasSaleOut: (list: [] = []): boolean => {
    for (const k in list) {
      if ((list[k] as any).FOpt === SnOpt.OptSaleOut) return true;
    }
    return false;
  },
  HasTransferOut: (list: [] = []): boolean => {
    for (const k in list) {
      if ((list[k] as any).FOpt === SnOpt.OptTransferOut) return true;
    }
    return false;
  },
  HasPurReturn: (list: [] = []): boolean => {
    for (const k in list) {
      if ((list[k] as any).FOpt === SnOpt.OptPurReturn) return true;
    }
    return false;
  },
  HasSaleReturn: (list: [] = []): boolean => {
    for (const k in list) {
      if ((list[k] as any).FOpt === SnOpt.OptSaleReturn) return true;
    }
    return false;
  },
  HasOtherOut: (list: [] = []): boolean => {
    for (const k in list) {
      if ((list[k] as any).FOpt === SnOpt.OptOtherOut) return true;
    }
    return false;
  },
  HasOtherIn: (list: [] = []): boolean => {
    for (const k in list) {
      if ((list[k] as any).FOpt === SnOpt.OptOtherIn) return true;
    }
    return false;
  },
};
enum Api {
  FIND_SALE_OUT = '/pda/jst/find-sale-out',
  FIND_SHOP_INFO = '/pda/erp/find-shop-info',
  SN_INFO = '/pda/sn/sn-info',
  FIND_STOCK = '/pda/erp/find-stock',
  SN_INFO_LIST = '/pda/sn/sn-info-list',
  SALE_OUT = '/pda/sale-out/save',
  OTHER_OUT = '/pda/other-out/sale-other-out',
}
export interface JstShopInfo {
  FName; //店铺名称
  custNum; //客户编码
  isSpe; //是否其他出库
  biztype?: string; //业务类型
}
export type PartialJstShopInfo = Partial<JstShopInfo>;
export interface Stock {
  fStock: string; //仓库编码
  jstNumber: string; //聚水潭仓库编码
  fStockName: string; //仓库名称
  key?: string;
}
export type PartialStock = Partial<Stock>;
export interface SaleOutBillEntry {
  i_id; //款式编码
  sku_id; //商品编码
  sale_base_price; //原价
  order_base_price; //
  pic; //图片
  ioi_id; //子单号
  sale_price; //单价
  properties_value; //颜色规格
  is_gift: boolean; //是否赠品 默认否
  qty; //数量
  combine_sku_id; //组合装商品编码
  name; //商品名称
  sale_amount; //金额
  free_amount; //优惠金额
  wms_co_id; //分仓编号
  wms_co_name; //分仓名称
  hasScanQty: number; //已扫数量
  stock?: Stock;
}
export type PartialSaleOutBillEntry = Partial<SaleOutBillEntry>;
export interface SaleOutBill {
  pay_date; //付款日期
  lc_id; //快递公司编码
  invoice_title; //发票抬头
  receiver_city; //市
  freight; //运费
  f_weight; //实称重量
  remark; //备注
  drp_co_id_from; //分销商编号
  business_staff; //	业务人员
  is_cod: boolean; //是否货到付款 默认否
  receiver_state; //省
  so_id; //线上单号
  o_id; //内部单号
  modified; //修改时间
  receiver_name; //收件人姓名
  currency; //货币类型
  receiver_country; //国家
  order_type; //单据类型
  free_amount; //优惠金额
  buyer_message; //买家留言
  created; //创建时间
  io_date; //出库时间
  receiver_district; //区
  receiver_town; //街道
  pay_amount; //应付金额
  co_id; //公司编号
  weight; //预估重量
  receiver_mobile; //收件人电话
  io_id; //出库单号
  labels; //标记|多标签
  shop_id; //店铺编号
  merge_so_id; //合并订单号
  node; //
  shop_buyer_id; //买家帐号
  wms_co_id; //分仓编号
  paid_amount; //实付金额
  receiver_address; //地址
  logistics_company; //物流公司名称
  receiver_phone; //收件人手机
  l_id; //物流单号
  stock_enabled; //是否启用库存管理
  is_spe?: boolean; //是否金蝶特殊店铺，用于其他出库或其他入库
  erp_shop_info?: PartialJstShopInfo;
  items: PartialSaleOutBillEntry[];
  status; //状态;Archive:归档,WaitConfirm:待出库,Confirmed:已出库,Cancelled:取消,Delete:作废,OuterConfirming:外部发货中
}
export type PartialSaleOutBill = Partial<SaleOutBill>;

/**
 * 查询聚水潭销售出库单
 */
export function jstSaleOutBillSearch(json: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Api.FIND_SALE_OUT,
      data: json,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: false,
    },
  );
}

/**
 * 查询聚水潭店铺
 */
export function jstFindShopInfo<T>(number: string, mode: ErrorMessageMode = 'message') {
  return defHttp.post<T>(
    {
      url: Api.FIND_SHOP_INFO,
      data: { params: number },
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 查询条码主档
 */
export function snInfo(sn: string, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Api.SN_INFO,
      data: { params: sn },
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 查询默认的条码主档列表
 */
export function snInfoList(sns: string[], mode: ErrorMessageMode = 'message') {
  return defHttp.post<[]>(
    {
      url: Api.SN_INFO_LIST,
      data: { params: sns },
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * 查询仓库
 */
export async function findStock(json: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Stock[]>(
    {
      url: Api.FIND_STOCK,
      data: json,
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * 销售出库
 */
export async function saveOut(json: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Api.SALE_OUT,
      data: json,
      timeout: 2 * 60 * 1000,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: false,
    },
  );
}

/**
 * 其他出库
 */
export async function otherOut(json: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Result>(
    {
      url: Api.OTHER_OUT,
      data: json,
      timeout: 2 * 60 * 1000,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: false,
    },
  );
}

/**
 * 判断聚水潭店铺是否特殊店铺
 */
export async function isShopSpe(billInfo: PartialSaleOutBill) {
  const shop_id = billInfo.shop_id?.toString();
  const shop_info = await jstFindShopInfo<JstShopInfo>(shop_id);
  if (shop_info.FName.search('发样')) {
    shop_info.biztype = '8';
  }
  if (shop_info.FName.search('领样')) {
    shop_info.biztype = 'A';
  }
  if (Number(shop_info.isSpe) === 1 || !billInfo.shop_id) {
    billInfo.is_spe = true;
  } else {
    billInfo.is_spe = false;
  }
  billInfo.erp_shop_info = shop_info;
  billInfo.items?.forEach((item) => {
    item.hasScanQty = 0;
  });
  return billInfo;
}
