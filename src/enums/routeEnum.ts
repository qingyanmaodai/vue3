import {
  invCountGainColumns,
  invCountLossColumns,
  invCountSheetColumns,
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
];
