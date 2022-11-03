import { reactive } from 'vue';
import { VxeGridProps } from 'vxe-table';

export const detailOfExaGridOptions = reactive<VxeGridProps>({
  border: true,
  keepSource: true,
  align: 'center',
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
        case column.field == 'bdStockCompartment.name' &&
          (row.stockDis == 'A' || !row.bdStock.name):
          return false;
        case column.field == 'bdStockLocation.name' &&
          (row.stockDis !== 'C' || !row.bdStockCompartment.name):
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
    // editRender: { name: '$input' },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    // editRender: { name: '$input' },
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
    // editRender: { name: '$input' },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    // editRender: { name: '$input' },
    width: 150,
    sortable: true,
  },
  {
    field: 'countNum',
    title: '盘点数量',
    editRender: { name: '$input', props: { type: 'integer', min: 0 } },
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
    // editRender: { name: '$input' },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    // editRender: { name: '$input' },
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
    // editRender: { name: '$input' },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    // editRender: { name: '$input' },
    width: 150,
    sortable: true,
  },
  {
    field: 'bd',
    title: '交货日期',
    // className: 'disableProp',
    // editRender: { name: '$input' },
    width: 150,
    sortable: true,
  },
  {
    field: 'countNum11',
    title: '单价',
    editRender: { name: '$input', props: { type: 'integer', min: 0 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'countNum',
    title: '采购数量',
    editRender: { name: '$input', props: { type: 'integer', min: 0 } },
    width: 150,
    sortable: true,
  },
  {
    field: 'countNum111',
    title: '金额',
    editRender: { name: '$input', props: { type: 'integer', min: 0 } },
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
    // editRender: { name: '$input' },
    width: 150,
    sortable: true,
  },
  {
    field: 'bdMaterial.weightUnitName',
    title: '重量单位',
    className: 'disableProp',
    // editRender: { name: '$input' },
    width: 150,
    sortable: true,
  },
  {
    field: 'countNum',
    title: '实退数量',
    editRender: { name: '$input', props: { type: 'integer', min: 0 } },
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
