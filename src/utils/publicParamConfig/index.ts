export interface configEntity {
  label?: string;
  value?: string | number;
}
export const config = {
  //基本信息表格数据
  PUBLIC_REQUEST_URL: {
    baseUnit: '/stock/bd-unit/list', //基本单位
    weightUnit: '/stock/bd-unit/list', //重量单位
    stock: '/stock/bd-stock/list', //仓库
    sub: '/stock/bd-stock-compartment/list', //分仓
    location: '/stock/bd-stock-location/list', //仓位
    plan: '/stock/bd-examine/list', //检验方案
    EMP: '/stock/bd-employee/list', //负责人
    rule: '/stock/bd-examine-rule/list', //检验规则
    INV_BY_MAT_STOCK: '/stock/bd-inventory/get-inv-by-mat-stock', //即时库存-物料号与仓位获取库存信息
  },
  //物料属性
  MATERIAL_ATTR: [
    {
      value: 'A',
      label: '自制',
    },
    {
      value: 'B',
      label: '委外',
    },
    {
      value: 'C',
      label: '虚拟',
    },
  ],
  // 启用状态
  ENABLE_STATUS: [
    {
      value: 0,
      label: '停用',
    },
    {
      value: 1,
      label: '开启',
    },
  ],
  ENABLE_STATUS_SPE: {
    0: '停用',
    1: '启用',
  },
  YES_OR_NO: {
    0: '否',
    1: '是',
  },
  //  数据业务状态
  DATA_STATUS: [
    {
      value: 'A',
      label: '创建',
      color: 'processing',
    },
    {
      value: 'B',
      label: '已审核',
      color: 'default',
    },
  ],
  //  生产业务状态
  PRODUCT_STATUS1: {
    A: '未进行',
    B: '进行中',
    C: '已完成',
  },
  PRODUCT_STATUS: [
    {
      value: 'A',
      label: '未进行',
      color: 'grey',
    },
    {
      value: 'B',
      label: '进行中',
      color: 'blue',
    },
    {
      value: 'C',
      label: '已完成',
      color: 'green',
    },
  ],
  //  生产业务状态
  PRODUCE_STATUS: {
    A: '未进行',
    B: '进行中',
    C: '已完成',
  },
  //  数据业务状态
  BS_STATUS: {
    A: '创建',
    B: '已审核',
  },
  //检验设置
  EXAMINE_SET: [
    {
      value: 'A',
      label: '采购检验',
    },
    {
      value: 'B',
      label: '生产检验',
    },
  ],
  //时间类型的选规则选择
  TIME_OPTION_RULE: [
    {
      value: 'LIKE',
      label: '等于',
    },
    {
      value: 'GE',
      label: '大于等于',
    },
    {
      value: 'LE',
      label: '小于等于',
    },
    {
      value: 'NE',
      label: '不等于',
    },
    {
      value: 'GT',
      label: '大于',
    },
    {
      value: 'LT',
      label: '小于',
    },
  ],
  //一般类型的选规则选择
  OPTION_RULE: [
    {
      value: 'LIKE',
      label: '包含',
    },
    {
      value: 'EQ',
      label: '等于',
    },
    {
      value: 'GE',
      label: '大于等于',
    },
    {
      value: 'LE',
      label: '小于等于',
    },
    {
      value: 'NE',
      label: '不等于',
    },
    {
      value: 'GT',
      label: '大于',
    },
    {
      value: 'LT',
      label: '小于',
    },
  ],
  //供应商等级
  SUPPLIER_GRADE: [
    {
      value: 'A',
      label: 'A级',
    },
    {
      value: 'B',
      label: 'B级',
    },
    {
      value: 'C',
      label: 'C级',
    },
    {
      value: 'D',
      label: 'D级',
    },
  ],
  //性别
  GENDER: [
    {
      value: 0,
      label: '女',
    },
    {
      value: 1,
      label: '男',
    },
  ],
  //职位
  JOB: [
    {
      value: 'A',
      label: '董事长',
    },
    {
      value: 'B',
      label: '经理',
    },
    {
      value: 'C',
      label: '主管',
    },
    {
      value: 'D',
      label: '组长',
    },
    {
      value: 'E',
      label: '普通员工',
    },
  ],
  //单位类型
  UNIT_TYPE: [
    {
      value: 'A',
      label: '基本单位',
    },
    {
      value: 'B',
      label: '重量单位',
    },
  ],
  //检验类型
  EXAMINE_SCHEME_TYPE: [
    {
      value: 'A',
      label: '全检',
    },
    {
      value: 'B',
      label: '抽检',
    },
  ],
  //检验业务类型
  EXAMINE_BUSINESS: [
    {
      value: 'A',
      label: '采购检验',
    },
    {
      value: 'B',
      label: '成品检验',
    },
    {
      value: 'C',
      label: '发货检验',
    },
  ],
  //盘点方式
  INVENTORY_WAY: [
    {
      value: 'A',
      label: '普通盘点',
    },
    {
      value: 'B',
      label: '全盘点',
    },
  ],
  //仓库维度
  STOCK_DIS: [
    {
      value: 'A',
      label: '仓库',
    },
    {
      value: 'B',
      label: '分仓',
    },
    {
      value: 'C',
      label: '仓位',
    },
  ],
  //关联查询
  LINK_QUERY: [
    {
      value: 'A',
      label: '上查',
    },
    {
      value: 'B',
      label: '下查',
    },
  ],
  //业务操作
  ORDER_QUERY: [
    {
      value: 'A',
      label: '生成用料清单',
    },
    {
      value: 'B',
      label: '查询用料清单',
    },
  ],
  //退货原因
  RETURN_REASON: [
    {
      value: 'A',
      label: '7天无理由退货返修',
    },
    {
      value: 'B',
      label: '品质原因',
    },
    {
      value: 'C',
      label: '供应商缺货',
    },
    {
      value: 'D',
      label: '产线品质不良退料',
    },
    {
      value: 'E',
      label: '其他',
    },
  ],
  //退料原因
  PRO_RETURN_REASON: [
    {
      value: 'A',
      label: '良品退料',
    },
    {
      value: 'B',
      label: '来料不良退料',
    },
    {
      value: 'C',
      label: '作业不良退料',
    },
    {
      value: 'D',
      label: '其他',
    },
  ],
  //补料原因
  FEED_REASON: [
    {
      value: 'A',
      label: '少领',
    },
    {
      value: 'B',
      label: '报废',
    },
  ],
  //采购单据类型
  NUMBER_REASON: [
    {
      value: 'A',
      label: '标准采购入库',
    },
    {
      value: 'B',
      label: '零散采购入库单',
    },
    {
      value: 'C',
      label: '委外入库单',
    },
    {
      value: 'D',
      label: '分销购销入库单',
    },
    {
      value: 'E',
      label: '资产入库单',
    },
    {
      value: 'F',
      label: '费用入库单',
    },
    {
      value: 'G',
      label: 'VMI入库单',
    },
    {
      value: 'H',
      label: '现购入库单',
    },
  ],
  //业务操作
  TAG: [
    {
      value: 1,
      label: '入库',
    },
    {
      value: -1,
      label: '出库',
    },
  ],
  //单据类型
  BILL_TYPE: [
    {
      value: 'BsInventoryCountGain',
      label: '盘盈单',
    },
    {
      value: 'BsInventoryCountLoss',
      label: '盘亏单',
    },
    {
      value: 'BsInventoryCount',
      label: '盘点单',
    },
    {
      value: 'BsProMoInStock',
      label: '生产入库',
    },
    {
      value: 'BsProMoPick',
      label: '生产领料',
    },
    {
      value: 'BsProMoReissue',
      label: '生产补料',
    },
    {
      value: 'BsProMoReturn',
      label: '生产退料',
    },
    {
      value: 'BsProMoOrder',
      label: '生产工单',
    },
    {
      value: 'BsPurchaseInStock',
      label: '采购入库',
    },
    {
      value: 'BsPurchaseOrder',
      label: '采购订单',
    },
    {
      value: 'BsPurchaseReturn',
      label: '采购退库',
    },
    {
      value: 'BsSaleOrder',
      label: '销售订单',
    },
    {
      value: 'BsSaleNotice',
      label: '销售通知',
    },
    {
      value: 'BsSaleOut',
      label: '销售发货',
    },
    {
      value: 'BsSaleReturn',
      label: '销售退货',
    },
    {
      value: 'BsOtherIn',
      label: '其他入库',
    },
    {
      value: 'BsOtherOut',
      label: '其他出库',
    },
  ],
  //条码类型
  BARCODE_TYPE: [
    {
      value: 1,
      label: '序列码',
    },
    {
      value: 2,
      label: '批次码',
    },
  ],
  //属性来源
  WAY_BAR_RULES: [
    {
      value: 1,
      label: '固定值',
    },
    {
      value: 2,
      label: '单据属性',
    },
  ],
  //是否默认规则
  IS_DEFAULT: [
    {
      value: true,
      label: '是',
    },
    {
      value: false,
      label: '否',
    },
  ],
  //属性名称
  // ATTR_NAME: [
  //   {
  //     value: 'A',
  //     label: '文本输入',
  //   },
  //   {
  //     value: 'B',
  //     label: '当前日期',
  //   },
  //   {
  //     value: 'C',
  //     label: '流水号',
  //   },
  // ],
  //属性类型
  ATTR_TYPE: [
    {
      value: 'TEXT',
      label: '文本',
    },
    {
      value: 'DATE',
      label: '日期',
    },
    {
      value: 'SENO',
      label: '流水号',
    },
  ],
  //格式中的日期选择
  DATE_FORMAT: [
    {
      value: 'A',
      label: 'yyyy-MM-dd HH:mm:ss',
    },
    {
      value: 'B',
      label: 'yyyy-MM-dd',
    },
    {
      value: 'C',
      label: 'yyyy-MM',
    },
    {
      value: 'D',
      label: 'yyyy',
    },
    {
      value: 'E',
      label: 'yy-MM-dd HH:mm:ss',
    },
    {
      value: 'F',
      label: 'yy-MM-dd',
    },
    {
      value: 'G',
      label: 'yy-MM',
    },
    {
      value: 'H',
      label: 'yy',
    },
  ],
};
