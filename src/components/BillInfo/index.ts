import { withInstall } from '/@/utils';

import billInfo from './src/BillInfo.vue';

export const BillInfo = withInstall(billInfo);

export interface TableColumns {
  dataIndex: string; //id
  key: string; //id
  title: string; //标题
  fixed?: string; //固定
  width?: number; //宽度
  align?: string; //对齐
  ellipsis?: boolean; //省略超出文本
  maxWidth?: number; //最大宽度
  minWidth?: number; //最小宽度
  slots?: any;
}
