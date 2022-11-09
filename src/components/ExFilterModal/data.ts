import { Url } from '/@/api/apiLink';

/*约定数组下标，0：仓库，1：分仓，2，仓位，3：物料*/
export const inputDataList = [
  {
    addonBeforeLabel: '仓库 : ',
    dtoUrlConfig: 'GET_STOCK_DTO',
    tableName: 'BdStock',
    tableUrl: Url.GET_PAGE_STOCK_LIST,
    nameParam: 'stockId',
    columnParam: 'stock_id',
    disabledInput: false,
  },
  {
    addonBeforeLabel: '分仓 : ',
    dtoUrlConfig: 'GET_SUB_STOCK_DTO',
    tableName: 'BdStockCompartment',
    tableUrl: Url.GET_PAGE_STOCK_COMPARTMENT_LIST,
    nameParam: 'compartmentId',
    columnParam: 'compartment_id',
    disabledInput: true,
  },
  {
    addonBeforeLabel: '仓位 : ',
    dtoUrlConfig: 'GET_LOCATION_DTO',
    tableName: 'BdStockLocation',
    tableUrl: Url.GET_PAGE_STOCK_LOCATION_LIST,
    nameParam: 'locationId',
    columnParam: 'location_id',
    disabledInput: true,
  },
  {
    addonBeforeLabel: '物料 : ',
    dtoUrlConfig: 'GET_MAT_DTO',
    tableName: 'BdMaterial',
    tableUrl: Url.GET_MATERIAL_LIST,
    nameParam: 'id',
    columnParam: 'id',
    disabledInput: false,
  },
];
