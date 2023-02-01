import { reactive } from 'vue';
import { VxeGridProps } from 'vxe-table';

export const detailOfExaGridOptions = reactive<VxeGridProps>({
  border: true,
  keepSource: true,
  align: 'center',
  // syncResize: true,
  loading: false,
  columnConfig: {
    resizable: true,
  },
  rowConfig: {
    isHover: true,
  },

  // sortConfig: {
  //   trigger: 'cell',
  //   defaultSort: { field: 'sort', order: 'asc' },
  //   orders: ['asc', 'desc', null],
  // },
  editConfig: {
    trigger: 'dblclick',
    mode: 'cell',
    // showStatus: true,
    beforeEditMethod({ row, column }) {
      switch (true) {
        case row.bsStatus === 'B':
          return false;
        case column.field == 'bdStockCompartment.name' && (row.stockDis == 'A' || !row.stockId):
          return false;
        case column.field == 'bdStockLocation.name' && (row.stockDis !== 'C' || !row.compartmentId):
          return false;
        case column.field == 'bdInStockCompartment.name' && (row.stockDis == 'A' || !row.inStockId):
          return false;
        case column.field == 'bdInStockLocation.name' &&
          (row.stockDis !== 'C' || !row.inCompartmentId):
          return false;
        case column.field == 'bdOutStockCompartment.name' &&
          (row.stockDis == 'A' || !row.outStockId):
          return false;
        case column.field == 'bdOutStockLocation.name' &&
          (row.stockDis !== 'C' || !row.outCompartmentId):
          return false;
        default:
          return true;
      }
    },
  },
  //操作按钮
  toolbarConfig: {
    slots: {
      buttons: 'toolbar_buttons',
    },
    zoom: true,
    custom: true,
  },
  //表头数据
  columns: [],
  //表格数据
  data: [],
});

//检验方案详情
export const exaProjectOfDetailColumns = [
  { type: 'checkbox', width: 50 },
  { field: 'seq', type: 'seq', title: '行号', width: 50 },
  {
    field: 'sort',
    title: '顺序',
    sortable: true,
    width: 120,
    editRender: { name: '$input', props: { type: 'integer', min: 1 } },
  },
  // { field: 'number', title: '编码', width: 150, editRender: { name: '$input' } },
  // { field: 'name', title: '检验详情名称', width: 150, editRender: { name: '$input' } },
  {
    field: 'bdExamineProject.number',
    title: '检验项目编码',
    sortable: true,
    width: 180,
    params: {
      tableName: 'BdExamineProject',
      list: 'GET_EXA_PROJECT_LIST', //检验项目表格数据
      select: 'GET_EXA_PROJECT_DTO', //基本信息下拉框+表头
      param: {
        exaProjectId: 'bdExamineProject',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
  {
    field: 'bdExamineProject.name',
    title: '检验项目名称',
    className: 'disableProp',
    sortable: true,
    width: 150,
  },
  {
    field: 'min',
    title: '最小值',
    sortable: true,
    width: 120,
    editRender: { name: '$input', props: { type: 'float' } },
  },
  {
    field: 'max',
    title: '最大值',
    sortable: true,
    width: 120,
    editRender: { name: '$input', props: { type: 'float' } },
  },
  { field: 'refer', title: '参考数据', width: 120, editRender: { name: '$input' } },
  {
    field: 'description',
    title: '检验描述',
    // width: 120,
    sortable: true,
    editRender: { name: '$input' },
  },
  {
    field: 'isRequire',
    title: '是否必要',
    width: 120,
    slots: { default: 'isRequire' },
  },
  {
    field: 'isOpen',
    title: '是否启用',
    width: 120,
    slots: { default: 'open' },
  },
];
//盘盈单详情
export const invCountGainOfDetailColumns = [
  { type: 'checkbox', width: 50 },
  { field: 'seq', type: 'seq', title: '行号', className: 'disableProp', width: 50 },
  {
    field: 'bdMaterial.number',
    title: '物料编码',
    sortable: true,
    width: 150,
    params: {
      tableName: 'bdMaterial', //物料信息表名
      list: 'GET_MATERIAL_LIST', //物料信息表格数据
      select: 'GET_MAT_DTO', //基本信息下拉框+表头
      param: {
        matId: 'bdMaterial',
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
  {
    field: 'bdMaterial.name',
    title: '物料名称',
    className: 'disableProp',
    sortable: true,
    width: 150,
  },
  {
    field: 'bdMaterial.model',
    title: '规格型号',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdMaterial.baseUnitName',
    title: '基本单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'stockNum',
    title: '帐存数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'countNum',
    title: '盘点数量',
    editRender: { name: '$input', props: { type: 'integer', min: 1 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'gain',
    title: '盘盈数量',
    slots: { default: 'gain' },
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStock.name',
    title: '仓库',
    params: {
      list: 'GET_PAGE_STOCK_LIST',
      select: 'GET_STOCK_DTO',
      param: {
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockCompartment.name',
    title: '分仓',
    params: {
      list: 'GET_PAGE_STOCK_COMPARTMENT_LIST',
      select: 'GET_SUB_STOCK_DTO',
      param: {
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockLocation.name',
    title: '仓位',
    params: {
      list: 'GET_PAGE_STOCK_LOCATION_LIST',
      select: 'GET_LOCATION_DTO',
      param: {
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  { field: 'lot', title: '批次', editRender: { name: '$input' }, width: 150, sortable: true },
  { field: 'mark', title: '备注', editRender: { name: '$input' }, width: 150, sortable: true },
];
//盘点单详情
export const invCountSheetOfDetailColumns = [
  { type: 'checkbox', width: 50 },
  { field: 'seq', type: 'seq', title: '行号', className: 'disableProp', width: 50 },
  {
    field: 'bdMaterial.number',
    title: '物料编码',
    sortable: true,
    width: 150,
    params: {
      tableName: 'bdMaterial', //物料信息表名
      list: 'GET_MATERIAL_LIST', //物料信息表格数据
      select: 'GET_MAT_DTO', //基本信息下拉框+表头
      param: {
        matId: 'bdMaterial',
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
  {
    field: 'bdMaterial.name',
    title: '物料名称',
    className: 'disableProp',
    sortable: true,
    width: 150,
  },
  {
    field: 'bdMaterial.model',
    title: '规格型号',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdMaterial.baseUnitName',
    title: '基本单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'countNum',
    title: '盘点数量',
    editRender: { name: '$input', props: { type: 'integer', min: 1 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStock.name',
    title: '仓库',
    params: {
      list: 'GET_PAGE_STOCK_LIST',
      select: 'GET_STOCK_DTO',
      param: {
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockCompartment.name',
    title: '分仓',
    params: {
      list: 'GET_PAGE_STOCK_COMPARTMENT_LIST',
      select: 'GET_SUB_STOCK_DTO',
      param: {
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockLocation.name',
    title: '仓位',
    params: {
      list: 'GET_PAGE_STOCK_LOCATION_LIST',
      select: 'GET_LOCATION_DTO',
      param: {
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  { field: 'lot', title: '批次', editRender: { name: '$input' }, width: 150, sortable: true },
  { field: 'mark', title: '备注', editRender: { name: '$input' }, width: 150, sortable: true },
];
//盘亏单详情
export const invCountLossOfDetailColumns = [
  { type: 'checkbox', width: 50 },
  { field: 'seq', type: 'seq', title: '行号', className: 'disableProp', width: 50 },
  {
    field: 'bdMaterial.number',
    title: '物料编码',
    sortable: true,
    width: 150,
    params: {
      tableName: 'bdMaterial', //物料信息表名
      list: 'GET_MATERIAL_LIST', //物料信息表格数据
      select: 'GET_MAT_DTO', //基本信息下拉框+表头
      param: {
        matId: 'bdMaterial',
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
  {
    field: 'bdMaterial.name',
    title: '物料名称',
    className: 'disableProp',
    sortable: true,
    width: 150,
  },
  {
    field: 'bdMaterial.model',
    title: '规格型号',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdMaterial.baseUnitName',
    title: '基本单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'stockNum',
    title: '帐存数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'countNum',
    title: '盘点数量',
    editRender: { name: '$input', props: { type: 'integer', min: 1 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'loss',
    title: '盘亏数量',
    slots: { default: 'loss' },
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStock.name',
    title: '仓库',
    params: {
      list: 'GET_PAGE_STOCK_LIST',
      select: 'GET_STOCK_DTO',
      param: {
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockCompartment.name',
    title: '分仓',
    params: {
      list: 'GET_PAGE_STOCK_COMPARTMENT_LIST',
      select: 'GET_SUB_STOCK_DTO',
      param: {
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockLocation.name',
    title: '仓位',
    params: {
      list: 'GET_PAGE_STOCK_LOCATION_LIST',
      select: 'GET_LOCATION_DTO',
      param: {
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  { field: 'lot', title: '批次', editRender: { name: '$input' }, width: 150, sortable: true },
  { field: 'mark', title: '备注', editRender: { name: '$input' }, width: 150, sortable: true },
];
//采购订单详情明细
export const warPurOrdersOfDetailColumns = [
  { type: 'checkbox', width: 50 },
  { field: 'seq', type: 'seq', title: '行号', className: 'disableProp', width: 50 },
  {
    field: 'bdMaterial.number',
    title: '物料编码',
    sortable: true,
    width: 150,
    params: {
      tableName: 'bdMaterial', //物料信息表名
      list: 'GET_MATERIAL_LIST', //物料信息表格数据
      select: 'GET_MAT_DTO', //基本信息下拉框+表头
      param: {
        matId: 'bdMaterial',
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
  {
    field: 'bdMaterial.name',
    title: '物料名称',
    className: 'disableProp',
    sortable: true,
    width: 150,
  },
  {
    field: 'bdMaterial.model',
    title: '规格型号',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdMaterial.baseUnitName',
    title: '基本单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'dlDate',
    title: '交货日期',
    editRender: {
      name: '$input',
      props: { clearable: true, valueFormat: 'yyyy-MM-dd HH:mm:ss', type: 'date' },
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'price',
    title: '单价',
    editRender: { name: '$input', props: { type: 'float', min: 0 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'num',
    title: '采购数量',
    editRender: { name: '$input', props: { type: 'integer', min: 1 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'pushNum',
    title: '已下推数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'doneNum',
    title: '已入库数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'totalPrice',
    title: '金额',
    className: 'disableProp',
    editRender: { props: { type: 'float', min: 0 } },
    slots: { default: 'numPrice' },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStock.name',
    title: '仓库',
    params: {
      list: 'GET_PAGE_STOCK_LIST',
      select: 'GET_STOCK_DTO',
      param: {
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockCompartment.name',
    title: '分仓',
    params: {
      list: 'GET_PAGE_STOCK_COMPARTMENT_LIST',
      select: 'GET_SUB_STOCK_DTO',
      param: {
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockLocation.name',
    title: '仓位',
    params: {
      list: 'GET_PAGE_STOCK_LOCATION_LIST',
      select: 'GET_LOCATION_DTO',
      param: {
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  { field: 'mark', title: '备注', editRender: { name: '$input' }, width: 150, sortable: true },
];
//采购退货单详情明细
export const warPurReturnOfDetailColumns = [
  { type: 'checkbox', width: 50 },
  { field: 'seq', type: 'seq', title: '行号', className: 'disableProp', width: 50 },
  {
    field: 'bdMaterial.number',
    title: '物料编码',
    sortable: true,
    width: 150,
    params: {
      tableName: 'bdMaterial', //物料信息表名
      list: 'GET_MATERIAL_LIST', //物料信息表格数据
      select: 'GET_MAT_DTO', //基本信息下拉框+表头
      param: {
        matId: 'bdMaterial',
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
  {
    field: 'bdMaterial.name',
    title: '物料名称',
    className: 'disableProp',
    sortable: true,
    width: 150,
  },
  {
    field: 'bdMaterial.model',
    title: '规格型号',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdMaterial.baseUnitName',
    title: '基本单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'num',
    title: '可退数量',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'realNum',
    title: '实退数量',
    editRender: { name: '$input', props: { type: 'integer', min: 1 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'pushNum',
    title: '已下推数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'doneNum',
    title: '已入库数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdStock.name',
    title: '仓库',
    params: {
      list: 'GET_PAGE_STOCK_LIST',
      select: 'GET_STOCK_DTO',
      param: {
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockCompartment.name',
    title: '分仓',
    params: {
      list: 'GET_PAGE_STOCK_COMPARTMENT_LIST',
      select: 'GET_SUB_STOCK_DTO',
      param: {
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockLocation.name',
    title: '仓位',
    params: {
      list: 'GET_PAGE_STOCK_LOCATION_LIST',
      select: 'GET_LOCATION_DTO',
      param: {
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  { field: 'lot', title: '批次', editRender: { name: '$input' }, width: 150, sortable: true },
  { field: 'mark', title: '备注', editRender: { name: '$input' }, width: 150, sortable: true },
];
//采购入库单详情明细
export const warPurInputOfDetailColumns = [
  { type: 'checkbox', width: 50 },
  { field: 'seq', type: 'seq', title: '行号', className: 'disableProp', width: 50 },
  {
    field: 'bdMaterial.number',
    title: '物料编码',
    sortable: true,
    width: 150,
    params: {
      tableName: 'bdMaterial', //物料信息表名
      list: 'GET_MATERIAL_LIST', //物料信息表格数据
      select: 'GET_MAT_DTO', //基本信息下拉框+表头
      param: {
        matId: 'bdMaterial',
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
  {
    field: 'bdMaterial.name',
    title: '物料名称',
    className: 'disableProp',
    sortable: true,
    width: 150,
  },
  {
    field: 'bdMaterial.model',
    title: '规格型号',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdMaterial.baseUnitName',
    title: '基本单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'num',
    title: '应收数量',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'realNum',
    title: '实收数量',
    editRender: { name: '$input', props: { type: 'integer', min: 1 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'pushNum',
    title: '已下推数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'doneNum',
    title: '已入库数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdStock.name',
    title: '仓库',
    params: {
      list: 'GET_PAGE_STOCK_LIST',
      select: 'GET_STOCK_DTO',
      param: {
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockCompartment.name',
    title: '分仓',
    params: {
      list: 'GET_PAGE_STOCK_COMPARTMENT_LIST',
      select: 'GET_SUB_STOCK_DTO',
      param: {
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockLocation.name',
    title: '仓位',
    params: {
      list: 'GET_PAGE_STOCK_LOCATION_LIST',
      select: 'GET_LOCATION_DTO',
      param: {
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  { field: 'lot', title: '批次', editRender: { name: '$input' }, width: 150, sortable: true },
  { field: 'mark', title: '备注', editRender: { name: '$input' }, width: 150, sortable: true },
];
//生产订单详情明细
export const warProOrderOfDetailColumns = [
  { type: 'checkbox', width: 50 },
  { field: 'seq', type: 'seq', title: '行号', className: 'disableProp', width: 50 },
  {
    field: 'bdMaterial.number',
    title: '物料编码',
    sortable: true,
    width: 150,
    params: {
      tableName: 'bdMaterial', //物料信息表名
      list: 'GET_MATERIAL_LIST', //物料信息表格数据
      select: 'GET_MAT_DTO', //基本信息下拉框+表头
      param: {
        matId: 'bdMaterial',
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
  {
    field: 'bdMaterial.name',
    title: '物料名称',
    className: 'disableProp',
    sortable: true,
    width: 150,
  },
  {
    field: 'bdMaterial.model',
    title: '规格型号',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdMaterial.baseUnitName',
    title: '基本单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'num',
    title: '生产数量',
    editRender: { name: '$input', props: { type: 'integer', min: 1 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'doneNum',
    title: '已入库数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'pushNum',
    title: '已下推数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'planTime',
    title: '计划开工日期',
    editRender: {
      name: '$input',
      props: { clearable: true, valueFormat: 'yyyy-MM-dd HH:mm:ss', type: 'date' },
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'planFinTime',
    title: '计划完工日期',
    editRender: {
      name: '$input',
      props: { clearable: true, valueFormat: 'yyyy-MM-dd HH:mm:ss', type: 'date' },
    },
    width: 150,
    sortable: true,
  },
  { field: 'lot', title: '批次', editRender: { name: '$input' }, width: 150, sortable: true },
  { field: 'mark', title: '备注', editRender: { name: '$input' }, width: 150, sortable: true },
];
//生产入库单详情明细
export const warProInStockOfDetailColumns = [
  { type: 'checkbox', width: 50 },
  { field: 'seq', type: 'seq', title: '行号', className: 'disableProp', width: 50 },
  {
    field: 'bdMaterial.number',
    title: '物料编码',
    sortable: true,
    width: 150,
    params: {
      tableName: 'bdMaterial', //物料信息表名
      list: 'GET_MATERIAL_LIST', //物料信息表格数据
      select: 'GET_MAT_DTO', //基本信息下拉框+表头
      param: {
        matId: 'bdMaterial',
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
  {
    field: 'bdMaterial.name',
    title: '物料名称',
    className: 'disableProp',
    sortable: true,
    width: 150,
  },
  {
    field: 'bdMaterial.model',
    title: '规格型号',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdMaterial.baseUnitName',
    title: '基本单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'num',
    title: '应收数量',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'realNum',
    title: '实收数量',
    editRender: { name: '$input', props: { type: 'integer', min: 1 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'pushNum',
    title: '已下推数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'doneNum',
    title: '已入库数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdStock.name',
    title: '仓库',
    params: {
      list: 'GET_PAGE_STOCK_LIST',
      select: 'GET_STOCK_DTO',
      param: {
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockCompartment.name',
    title: '分仓',
    params: {
      list: 'GET_PAGE_STOCK_COMPARTMENT_LIST',
      select: 'GET_SUB_STOCK_DTO',
      param: {
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockLocation.name',
    title: '仓位',
    params: {
      list: 'GET_PAGE_STOCK_LOCATION_LIST',
      select: 'GET_LOCATION_DTO',
      param: {
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  { field: 'lot', title: '批次', editRender: { name: '$input' }, width: 150, sortable: true },
  { field: 'mark', title: '备注', editRender: { name: '$input' }, width: 150, sortable: true },
];
//生产退料单详情明细
export const warProReturnOfDetailColumns = [
  { type: 'checkbox', width: 50 },
  { field: 'seq', type: 'seq', title: '行号', className: 'disableProp', width: 50 },
  {
    field: 'bdMaterial.number',
    title: '物料编码',
    sortable: true,
    width: 150,
    params: {
      tableName: 'bdMaterial', //物料信息表名
      list: 'GET_MATERIAL_LIST', //物料信息表格数据
      select: 'GET_MAT_DTO', //基本信息下拉框+表头
      param: {
        matId: 'bdMaterial',
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
  {
    field: 'bdMaterial.name',
    title: '物料名称',
    className: 'disableProp',
    sortable: true,
    width: 150,
  },
  {
    field: 'bdMaterial.model',
    title: '规格型号',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdMaterial.baseUnitName',
    title: '基本单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'num',
    title: '可退数量',
    className: 'disableProp',
    // editRender: { name: '$input', props: { type: 'integer', min: 1 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'realNum',
    title: '实退数量',
    editRender: { name: '$input', props: { type: 'integer', min: 1 } },
    width: 150,
    sortable: true,
  },
  // {
  //   field: 'needNum',
  //   title: '待退数量',
  //   slots: { default: 'needNum' },
  //   className: 'disableProp',
  //   width: 150,
  //   sortable: true,
  // },
  {
    field: 'doneNum',
    title: '已入库数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  // {
  //   field: 'pushNum',
  //   title: '已下推数量',
  //   width: 150,
  //   className: 'disableProp',
  //   sortable: true,
  // },
  {
    field: 'bdStock.name',
    title: '仓库',
    params: {
      list: 'GET_PAGE_STOCK_LIST',
      select: 'GET_STOCK_DTO',
      param: {
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockCompartment.name',
    title: '分仓',
    params: {
      list: 'GET_PAGE_STOCK_COMPARTMENT_LIST',
      select: 'GET_SUB_STOCK_DTO',
      param: {
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockLocation.name',
    title: '仓位',
    params: {
      list: 'GET_PAGE_STOCK_LOCATION_LIST',
      select: 'GET_LOCATION_DTO',
      param: {
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  { field: 'lot', title: '批次', editRender: { name: '$input' }, width: 150, sortable: true },
  { field: 'mark', title: '备注', editRender: { name: '$input' }, width: 150, sortable: true },
];
//生产用料清单详情明细
export const warProBomOfDetailColumns = [
  { type: 'checkbox', width: 50 },
  { field: 'seq', type: 'seq', title: '行号', className: 'disableProp', width: 50 },
  {
    field: 'bdMaterial.number',
    title: '物料编码',
    sortable: true,
    width: 150,
    params: {
      tableName: 'bdMaterial', //物料信息表名
      list: 'GET_MATERIAL_LIST', //物料信息表格数据
      select: 'GET_MAT_DTO', //基本信息下拉框+表头
      param: {
        matId: 'bdMaterial',
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
  {
    field: 'bdMaterial.name',
    title: '物料名称',
    className: 'disableProp',
    sortable: true,
    width: 150,
  },
  {
    field: 'bdMaterial.model',
    title: '规格型号',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdMaterial.baseUnitName',
    title: '基本单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'num',
    title: '数量',
    editRender: { name: '$input', props: { type: 'integer', min: 0 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'doneNum',
    title: '已领数量',
    editRender: { name: '$input', props: { type: 'integer', min: 0 } },
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'pushNum',
    title: '已推领料',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'reissueNum',
    title: '已补数量',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'pushReissueNum',
    title: '已推补料',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  { field: 'lot', title: '批次', editRender: { name: '$input' }, width: 150, sortable: true },
  { field: 'mark', title: '备注', editRender: { name: '$input' }, width: 150, sortable: true },
];
//生产领料单详情明细
export const warProPicksOfDetailColumns = [
  { type: 'checkbox', width: 50 },
  { field: 'seq', type: 'seq', title: '行号', className: 'disableProp', width: 50 },
  {
    field: 'bdMaterial.number',
    title: '物料编码',
    sortable: true,
    width: 150,
    params: {
      tableName: 'bdMaterial', //物料信息表名
      list: 'GET_MATERIAL_LIST', //物料信息表格数据
      select: 'GET_MAT_DTO', //基本信息下拉框+表头
      param: {
        matId: 'bdMaterial',
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
  {
    field: 'bdMaterial.name',
    title: '物料名称',
    className: 'disableProp',
    sortable: true,
    width: 150,
  },
  {
    field: 'bdMaterial.model',
    title: '规格型号',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdMaterial.baseUnitName',
    title: '基本单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'num',
    title: '申请数量',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'realNum',
    title: '已领数量',
    editRender: { name: '$input', props: { type: 'integer', min: 0 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'reissueNum',
    title: '已补数量',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'needNum',
    title: '待领数量',
    width: 150,
    slots: { default: 'needNum' },
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'pushReissueNum',
    title: '已推补料',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'pushReturnNum',
    title: '已推退料',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'returnNum',
    title: '已退货数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdStock.name',
    title: '仓库',
    params: {
      list: 'GET_PAGE_STOCK_LIST',
      select: 'GET_STOCK_DTO',
      param: {
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockCompartment.name',
    title: '分仓',
    params: {
      list: 'GET_PAGE_STOCK_COMPARTMENT_LIST',
      select: 'GET_SUB_STOCK_DTO',
      param: {
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockLocation.name',
    title: '仓位',
    params: {
      list: 'GET_PAGE_STOCK_LOCATION_LIST',
      select: 'GET_LOCATION_DTO',
      param: {
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  { field: 'lot', title: '批次', editRender: { name: '$input' }, width: 150, sortable: true },
  { field: 'mark', title: '备注', editRender: { name: '$input' }, width: 150, sortable: true },
];
//生产补料单详情明细
export const warProFeedOfDetailColumns = [
  { type: 'checkbox', width: 50 },
  { field: 'seq', type: 'seq', title: '行号', className: 'disableProp', width: 50 },
  {
    field: 'bdMaterial.number',
    title: '物料编码',
    sortable: true,
    width: 150,
    params: {
      tableName: 'bdMaterial', //物料信息表名
      list: 'GET_MATERIAL_LIST', //物料信息表格数据
      select: 'GET_MAT_DTO', //基本信息下拉框+表头
      param: {
        matId: 'bdMaterial',
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
  {
    field: 'bdMaterial.name',
    title: '物料名称',
    className: 'disableProp',
    sortable: true,
    width: 150,
  },
  {
    field: 'bdMaterial.model',
    title: '规格型号',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdMaterial.baseUnitName',
    title: '基本单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'num',
    title: '申请数量',
    editRender: { name: '$input', props: { type: 'integer', min: 0 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'scrapNum',
    title: '报废数量',
    width: 150,
    editRender: { name: '$input', props: { type: 'integer', min: 0 } },
    sortable: true,
  },
  {
    field: 'realNum',
    title: '实补数量',
    editRender: { name: '$input', props: { type: 'integer', min: 1 } },
    width: 150,
    sortable: true,
  },
  // {
  //   field: 'needNum',
  //   title: '待领数量',
  //   width: 150,
  //   slots: { default: 'needNum' },
  //   className: 'disableProp',
  //   sortable: true,
  // },
  {
    field: 'returnNum',
    title: '已退数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'pushReturnNum',
    title: '已下推数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdStock.name',
    title: '仓库',
    params: {
      list: 'GET_PAGE_STOCK_LIST',
      select: 'GET_STOCK_DTO',
      param: {
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockCompartment.name',
    title: '分仓',
    params: {
      list: 'GET_PAGE_STOCK_COMPARTMENT_LIST',
      select: 'GET_SUB_STOCK_DTO',
      param: {
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockLocation.name',
    title: '仓位',
    params: {
      list: 'GET_PAGE_STOCK_LOCATION_LIST',
      select: 'GET_LOCATION_DTO',
      param: {
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  { field: 'lot', title: '批次', editRender: { name: '$input' }, width: 150, sortable: true },
  { field: 'mark', title: '备注', editRender: { name: '$input' }, width: 150, sortable: true },
];
//销售订单详情明细
export const warSaleOrderOfDetailColumns = [
  { type: 'checkbox', width: 50 },
  { field: 'seq', type: 'seq', title: '行号', className: 'disableProp', width: 50 },
  {
    field: 'bdMaterial.number',
    title: '物料编码',
    sortable: true,
    width: 150,
    params: {
      tableName: 'bdMaterial', //物料信息表名
      list: 'GET_MATERIAL_LIST', //物料信息表格数据
      select: 'GET_MAT_DTO', //基本信息下拉框+表头
      param: {
        matId: 'bdMaterial',
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
  {
    field: 'bdMaterial.name',
    title: '物料名称',
    className: 'disableProp',
    sortable: true,
    width: 150,
  },
  {
    field: 'bdMaterial.model',
    title: '规格型号',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdMaterial.baseUnitName',
    title: '基本单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'num',
    title: '销售数量',
    editRender: { name: '$input', props: { type: 'integer', min: 1 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'price',
    title: '单价',
    editRender: { name: '$input', props: { type: 'float', min: 0 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'totalPrice',
    title: '总额',
    className: 'disableProp',
    editRender: { props: { type: 'float', min: 0 } },
    slots: { default: 'numPrice' },
    width: 150,
    sortable: true,
  },
  {
    field: 'pushNum',
    title: '已推发货',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'doneNum',
    title: '已发货数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  { field: 'lot', title: '批次', editRender: { name: '$input' }, width: 150, sortable: true },
  { field: 'mark', title: '备注', editRender: { name: '$input' }, width: 150, sortable: true },
];
//销售发货单详情明细
export const warSaleSendOutOfDetailColumns = [
  { type: 'checkbox', width: 50 },
  { field: 'seq', type: 'seq', title: '行号', className: 'disableProp', width: 50 },
  {
    field: 'bdMaterial.number',
    title: '物料编码',
    sortable: true,
    width: 150,
    params: {
      tableName: 'bdMaterial', //物料信息表名
      list: 'GET_MATERIAL_LIST', //物料信息表格数据
      select: 'GET_MAT_DTO', //基本信息下拉框+表头
      param: {
        matId: 'bdMaterial',
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
  {
    field: 'bdMaterial.name',
    title: '物料名称',
    className: 'disableProp',
    sortable: true,
    width: 150,
  },
  {
    field: 'bdMaterial.model',
    title: '规格型号',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdMaterial.baseUnitName',
    title: '基本单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'num',
    title: '应发数量',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'realNum',
    title: '实发数量',
    editRender: { name: '$input', props: { type: 'integer', min: 1 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'price',
    title: '单价',
    editRender: { name: '$input', props: { type: 'float', min: 0 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'totalPrice',
    title: '总额',
    className: 'disableProp',
    editRender: { props: { type: 'float', min: 0 } },
    slots: { default: 'realNumPrice' },
    width: 150,
    sortable: true,
  },
  {
    field: 'pushNum',
    title: '已推退货',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'doneNum',
    title: '已退货数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'noticePushNum',
    title: '已推通知',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'noticeDoneNum',
    title: '已通知数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdStock.name',
    title: '仓库',
    params: {
      list: 'GET_PAGE_STOCK_LIST',
      select: 'GET_STOCK_DTO',
      param: {
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockCompartment.name',
    title: '分仓',
    params: {
      list: 'GET_PAGE_STOCK_COMPARTMENT_LIST',
      select: 'GET_SUB_STOCK_DTO',
      param: {
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockLocation.name',
    title: '仓位',
    params: {
      list: 'GET_PAGE_STOCK_LOCATION_LIST',
      select: 'GET_LOCATION_DTO',
      param: {
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  { field: 'lot', title: '批次', editRender: { name: '$input' }, width: 150, sortable: true },
  { field: 'mark', title: '备注', editRender: { name: '$input' }, width: 150, sortable: true },
];
//销售退货单详情明细
export const warSaleReturnOfDetailColumns = [
  { type: 'checkbox', width: 50 },
  { field: 'seq', type: 'seq', title: '行号', className: 'disableProp', width: 50 },
  {
    field: 'bdMaterial.number',
    title: '物料编码',
    sortable: true,
    width: 150,
    params: {
      tableName: 'bdMaterial', //物料信息表名
      list: 'GET_MATERIAL_LIST', //物料信息表格数据
      select: 'GET_MAT_DTO', //基本信息下拉框+表头
      param: {
        matId: 'bdMaterial',
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
  {
    field: 'bdMaterial.name',
    title: '物料名称',
    className: 'disableProp',
    sortable: true,
    width: 150,
  },
  {
    field: 'bdMaterial.model',
    title: '规格型号',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdMaterial.baseUnitName',
    title: '基本单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'num',
    title: '应退数量',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'realNum',
    title: '实退数量',
    editRender: { name: '$input', props: { type: 'integer', min: 1 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'price',
    title: '单价',
    editRender: { name: '$input', props: { type: 'float', min: 0 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'totalPrice',
    title: '总额',
    className: 'disableProp',
    editRender: { props: { type: 'float', min: 0 } },
    slots: { default: 'realNumPrice' },
    width: 150,
    sortable: true,
  },
  {
    field: 'doneNum',
    title: '已处理数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'pushNum',
    title: '已推数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdStock.name',
    title: '仓库',
    params: {
      list: 'GET_PAGE_STOCK_LIST',
      select: 'GET_STOCK_DTO',
      param: {
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockCompartment.name',
    title: '分仓',
    params: {
      list: 'GET_PAGE_STOCK_COMPARTMENT_LIST',
      select: 'GET_SUB_STOCK_DTO',
      param: {
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockLocation.name',
    title: '仓位',
    params: {
      list: 'GET_PAGE_STOCK_LOCATION_LIST',
      select: 'GET_LOCATION_DTO',
      param: {
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  { field: 'lot', title: '批次', editRender: { name: '$input' }, width: 150, sortable: true },
  { field: 'mark', title: '备注', editRender: { name: '$input' }, width: 150, sortable: true },
];
//退货通知单详情明细
export const warSaleNoticeOfDetailColumns = [
  { type: 'checkbox', width: 50 },
  { field: 'seq', type: 'seq', title: '行号', className: 'disableProp', width: 50 },
  {
    field: 'bdMaterial.number',
    title: '物料编码',
    sortable: true,
    width: 150,
    params: {
      tableName: 'bdMaterial', //物料信息表名
      list: 'GET_MATERIAL_LIST', //物料信息表格数据
      select: 'GET_MAT_DTO', //基本信息下拉框+表头
      param: {
        matId: 'bdMaterial',
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
  {
    field: 'bdMaterial.name',
    title: '物料名称',
    className: 'disableProp',
    sortable: true,
    width: 150,
  },
  {
    field: 'bdMaterial.model',
    title: '规格型号',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdMaterial.baseUnitName',
    title: '基本单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'num',
    title: '应收通知数量',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'realNum',
    title: '实收通知数量',
    editRender: { name: '$input', props: { type: 'integer', min: 1 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'price',
    title: '单价',
    editRender: { name: '$input', props: { type: 'float', min: 0 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'totalPrice',
    title: '总额',
    className: 'disableProp',
    editRender: { props: { type: 'float', min: 0 } },
    slots: { default: 'realNumPrice' },
    width: 150,
    sortable: true,
  },
  {
    field: 'doneNum',
    title: '已退货数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'pushNum',
    title: '已推退货',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdStock.name',
    title: '仓库',
    params: {
      list: 'GET_PAGE_STOCK_LIST',
      select: 'GET_STOCK_DTO',
      param: {
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockCompartment.name',
    title: '分仓',
    params: {
      list: 'GET_PAGE_STOCK_COMPARTMENT_LIST',
      select: 'GET_SUB_STOCK_DTO',
      param: {
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockLocation.name',
    title: '仓位',
    params: {
      list: 'GET_PAGE_STOCK_LOCATION_LIST',
      select: 'GET_LOCATION_DTO',
      param: {
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  { field: 'lot', title: '批次', editRender: { name: '$input' }, width: 150, sortable: true },
  { field: 'mark', title: '备注', editRender: { name: '$input' }, width: 150, sortable: true },
];
//调拨订单详情明细
export const warTransferOrderOfDetailColumns = [
  { type: 'checkbox', width: 50 },
  { field: 'seq', type: 'seq', title: '行号', className: 'disableProp', width: 50 },
  {
    field: 'bdMaterial.number',
    title: '物料编码',
    sortable: true,
    width: 150,
    params: {
      tableName: 'bdMaterial', //物料信息表名
      list: 'GET_MATERIAL_LIST', //物料信息表格数据
      select: 'GET_MAT_DTO', //基本信息下拉框+表头
      param: {
        matId: 'bdMaterial',
        inStockId: 'bdInStock',
        inCompartmentId: 'bdInStockCompartment',
        inLocationId: 'bdInStockLocation',
        outStockId: 'bdOutStock',
        outCompartmentId: 'bdOutStockCompartment',
        outLocationId: 'bdOutStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
  {
    field: 'bdMaterial.name',
    title: '物料名称',
    className: 'disableProp',
    sortable: true,
    width: 150,
  },
  {
    field: 'bdMaterial.model',
    title: '规格型号',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdMaterial.baseUnitName',
    title: '基本单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'num',
    title: '调拨数量',
    editRender: { name: '$input', props: { type: 'integer', min: 1 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdInStock.name',
    title: '调入仓库',
    params: {
      list: 'GET_PAGE_STOCK_LIST',
      select: 'GET_STOCK_DTO',
      param: {
        inStockId: 'bdInStock',
        inCompartmentId: 'bdInStockCompartment',
        inLocationId: 'bdInStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdInStockCompartment.name',
    title: '调入分仓',
    params: {
      list: 'GET_PAGE_STOCK_COMPARTMENT_LIST',
      select: 'GET_SUB_STOCK_DTO',
      param: {
        inCompartmentId: 'bdInStockCompartment',
        inLocationId: 'bdInStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdInStockLocation.name',
    title: '调入仓位',
    params: {
      list: 'GET_PAGE_STOCK_LOCATION_LIST',
      select: 'GET_LOCATION_DTO',
      param: {
        inLocationId: 'bdInStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdOutStock.name',
    title: '调出仓库',
    params: {
      list: 'GET_PAGE_STOCK_LIST',
      select: 'GET_STOCK_DTO',
      param: {
        outStockId: 'bdOutStock',
        outCompartmentId: 'bdOutStockCompartment',
        outLocationId: 'bdOutStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdOutStockCompartment.name',
    title: '调出分仓',
    params: {
      list: 'GET_PAGE_STOCK_COMPARTMENT_LIST',
      select: 'GET_SUB_STOCK_DTO',
      param: {
        outCompartmentId: 'bdOutStockCompartment',
        outLocationId: 'bdOutStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdOutStockLocation.name',
    title: '调出仓位',
    params: {
      list: 'GET_PAGE_STOCK_LOCATION_LIST',
      select: 'GET_LOCATION_DTO',
      param: {
        outLocationId: 'bdOutStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  { field: 'lot', title: '批次', editRender: { name: '$input' }, width: 150, sortable: true },
  { field: 'mark', title: '备注', editRender: { name: '$input' }, width: 150, sortable: true },
];
//其他入库单详情明细
export const warOthersInputOfDetailColumns = [
  { type: 'checkbox', width: 50 },
  { field: 'seq', type: 'seq', title: '行号', className: 'disableProp', width: 50 },
  {
    field: 'bdMaterial.number',
    title: '物料编码',
    sortable: true,
    width: 150,
    params: {
      tableName: 'bdMaterial', //物料信息表名
      list: 'GET_MATERIAL_LIST', //物料信息表格数据
      select: 'GET_MAT_DTO', //基本信息下拉框+表头
      param: {
        matId: 'bdMaterial',
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
  {
    field: 'bdMaterial.name',
    title: '物料名称',
    className: 'disableProp',
    sortable: true,
    width: 150,
  },
  {
    field: 'bdMaterial.model',
    title: '规格型号',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdMaterial.baseUnitName',
    title: '基本单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'num',
    title: '应入库数量',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'realNum',
    title: '实入库数量',
    editRender: { name: '$input', props: { type: 'integer', min: 1 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'pushNum',
    title: '已下推数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'doneNum',
    title: '已出库数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdStock.name',
    title: '仓库',
    params: {
      list: 'GET_PAGE_STOCK_LIST',
      select: 'GET_STOCK_DTO',
      param: {
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockCompartment.name',
    title: '分仓',
    params: {
      list: 'GET_PAGE_STOCK_COMPARTMENT_LIST',
      select: 'GET_SUB_STOCK_DTO',
      param: {
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockLocation.name',
    title: '仓位',
    params: {
      list: 'GET_PAGE_STOCK_LOCATION_LIST',
      select: 'GET_LOCATION_DTO',
      param: {
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  { field: 'lot', title: '批次', editRender: { name: '$input' }, width: 150, sortable: true },
  { field: 'mark', title: '备注', editRender: { name: '$input' }, width: 150, sortable: true },
];
//其他出库单详情明细
export const warOthersOutputOfDetailColumns = [
  { type: 'checkbox', width: 50 },
  { field: 'seq', type: 'seq', title: '行号', className: 'disableProp', width: 50 },
  {
    field: 'bdMaterial.number',
    title: '物料编码',
    sortable: true,
    width: 150,
    params: {
      tableName: 'bdMaterial', //物料信息表名
      list: 'GET_MATERIAL_LIST', //物料信息表格数据
      select: 'GET_MAT_DTO', //基本信息下拉框+表头
      param: {
        matId: 'bdMaterial',
        inStockId: 'bdInStock',
        inCompartmentId: 'bdInStockCompartment',
        inLocationId: 'bdInStockLocation',
        outStockId: 'bdOutStock',
        outCompartmentId: 'bdOutStockCompartment',
        outLocationId: 'bdOutStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model',
    },
  },
  {
    field: 'bdMaterial.name',
    title: '物料名称',
    className: 'disableProp',
    sortable: true,
    width: 150,
  },
  {
    field: 'bdMaterial.model',
    title: '规格型号',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdMaterial.baseUnitName',
    title: '基本单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'num',
    title: '可出库数量',
    className: 'disableProp',
    width: 150,
    sortable: true,
  },
  {
    field: 'realNum',
    title: '实出库数量',
    editRender: { name: '$input', props: { type: 'integer', min: 1 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'pushNum',
    title: '已下推数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'doneNum',
    title: '已入库数量',
    width: 150,
    className: 'disableProp',
    sortable: true,
  },
  {
    field: 'bdStock.name',
    title: '仓库',
    params: {
      list: 'GET_PAGE_STOCK_LIST',
      select: 'GET_STOCK_DTO',
      param: {
        stockId: 'bdStock',
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockCompartment.name',
    title: '分仓',
    params: {
      list: 'GET_PAGE_STOCK_COMPARTMENT_LIST',
      select: 'GET_SUB_STOCK_DTO',
      param: {
        compartmentId: 'bdStockCompartment',
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdStockLocation.name',
    title: '仓位',
    params: {
      list: 'GET_PAGE_STOCK_LOCATION_LIST',
      select: 'GET_LOCATION_DTO',
      param: {
        locationId: 'bdStockLocation',
      },
    },
    editRender: { name: '$input' },
    slots: {
      edit: 'model1',
    },
    width: 150,
    sortable: true,
  },
  { field: 'lot', title: '批次', editRender: { name: '$input' }, width: 150, sortable: true },
  { field: 'mark', title: '备注', editRender: { name: '$input' }, width: 150, sortable: true },
];
//条码规则详情
export const barcodeRulesOfDetailColumns = [
  { type: 'checkbox', width: 50 },
  { field: 'seq', type: 'seq', title: '行号', width: 50 },
  {
    field: 'sort',
    title: '顺序',
    sortable: true,
    width: 120,
    editRender: { name: '$input', props: { type: 'integer', min: 1 } },
  },
  {
    field: 'way',
    title: '属性来源',
    width: 120,
    sortable: true,
    editRender: { name: '$input' },
    slots: { default: 'wayDefault', edit: 'way' },
  },
  {
    field: 'name',
    title: '属性名称',
    width: 120,
    sortable: true,
    editRender: { name: '$input' },
    slots: { default: 'attrNameDefault', edit: 'attrName' },
  },
  {
    field: 'attrType',
    title: '属性类型',
    width: 120,
    sortable: true,
    editRender: { name: '$input' },
    slots: { default: 'attrTypeDefault', edit: 'attrType' },
  },
  {
    field: 'format',
    title: '格式',
    width: 120,
    sortable: true,
    editRender: { name: '$input' },
    slots: { default: 'formatDefault', edit: 'formatFormat' },
  },
  {
    field: 'len',
    title: '长度',
    width: 120,
    sortable: true,
    editRender: { name: '$input', props: { type: 'integer' } },
  },
  {
    field: 'val',
    title: '设置值',
    width: 120,
    sortable: true,
    editRender: { name: '$input' },
  },
  {
    field: 'left',
    title: '左截断',
    width: 120,
    sortable: true,
    editRender: { name: '$input', props: { type: 'integer' } },
  },
  {
    field: 'right',
    title: '右截断',
    width: 120,
    sortable: true,
    editRender: { name: '$input', props: { type: 'integer' } },
  },
  {
    field: 'leftFix',
    title: '左补位符',
    width: 120,
    sortable: true,
    editRender: { name: '$input' },
  },
  {
    field: 'rightFix',
    title: '右补位符',
    width: 120,
    sortable: true,
    editRender: { name: '$input' },
  },
  {
    field: 'split',
    title: '分隔符',
    width: 120,
    sortable: true,
    editRender: { name: '$input' },
  },
];
