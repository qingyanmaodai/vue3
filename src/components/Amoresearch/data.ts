import { reactive } from 'vue';
import { VxeGridProps } from 'vxe-table';

//初始化表格
export interface DataItem {
  bsStatus: string; //状态
  bsType: string;
  createBy: string; //创建人
  createTime: string; //创建日期
  erpCode: string;
  id: number; //唯一ID
  isDelete: number;
  mark: string; //备注
  name: string; //单位名称
  number: string; //编码
  tenantId: number;
  updateBy: string; //修改人
  updateTime: string; //修改日期
}
export const nuitGridOptions = reactive<VxeGridProps>({
  border: true,
  height: 400,
  align: 'center',
  loading: false,
  columnConfig: {
    resizable: true,
  },
  // //分页设置
  // pagerConfig: {
  //   // total: data.value.length,
  //   currentPage: 1,
  //   pageSize: 10,
  //   pageSizes: [10, 20, 50, 100, 200, 500],
  //   layouts: [
  //     'Sizes',
  //     'PrevJump',
  //     'PrevPage',
  //     'Number',
  //     'NextPage',
  //     'NextJump',
  //     'FullJump',
  //     'Total',
  //   ],
  //   perfect: true,
  // },
  //表头数据
  columns: [],
  //表格数据
  data: [],
});

export const columns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '单位编码', sortable: true },
  { field: 'name', title: '单位名称', sortable: true },
  {
    field: 'createBy',
    title: '创建人',
    sortable: true,
  },
  {
    field: 'createTime',
    title: '创建日期',
    sortable: true,
  },
  {
    field: 'updateBy',
    title: '修改人',
    sortable: true,
  },
  {
    field: 'updateTime',
    title: '修改日期',
    sortable: true,
  },
  {
    field: 'bsStatus',
    title: '数据状态',
    sortable: true,
    slots: { default: 'status' },
  },
];
