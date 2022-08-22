export const config = {
  //基本单位表格数据
  PUBLIC_REQUEST_URL: {
    baseUnit: '/stock/bd-unit/list', //基本单位
    weightUnit: '/stock/bd-unit/list', //重量单位
    stock: '/stock/bd-stock/list', //仓库
    sub: '/stock/bd-sub-stock/list', //分仓
    location: '/stock/bd-stock-location/list', //仓位
    plan: '/stock/bd-examine/list', //检验方案
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
      value: '0',
      label: '关闭',
    },
    {
      value: '1',
      label: '开启',
    },
  ],
  //  数据业务状态
  DATA_STATUS: [
    {
      value: 'A',
      label: '创建',
    },
    {
      value: 'B',
      label: '审核',
    },
  ],
  //  数据业务状态
  BS_STATUS: {
    A: '创建',
    B: '已审核',
  },
  //  检验类型
  EXAMINE_TYPE: [
    {
      value: 'A',
      label: '免检',
    },
    {
      value: 'B',
      label: '质检',
    },
    {
      value: 'C',
      label: '全检',
    },
  ],
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
};
