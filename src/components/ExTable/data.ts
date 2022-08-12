import { reactive } from 'vue';
import { VxeGridProps } from 'vxe-table';

//初始化表格
export interface DataItem {
  mark: string; //备注
  number: string; //物料编码
  erpCode: string;
  bsStatus: string; //业务状态A创建B审核
  isDelete: number; //是否删除
  creatTime: string; //创建时间
  createBy: string; //创建人员
  updateBy: string; //更新人员
  tenantId: number; //租户ID
  id: number; //唯一ID
  name: string; //物料名称
  model: string; //规格型号
  baseUnitId: number; //基本单位ID
  weightUnitId: number; //重量单位
  groupId: string; //物料分组编码
  attr: string; //物料属性：A自制，B外购，C委外，D虚拟
  packId: string; //包装容器ID
  examineSet: string; //检验设置A采购检验B生产检验 可组合用，隔开
  examineType: string; //检验类型A免检，B质检，C全检
  examineProjectId: number; //检验方案id
  examineRuleId: number; //抽检规则
}
export const gridOptions = reactive<VxeGridProps>({
  border: true,
  align: 'center',
  loading: false,
  columnConfig: {
    resizable: true,
  },
  rowConfig: {
    isHover: true,
  },
  //操作按钮
  toolbarConfig: {
    slots: {
      buttons: 'toolbar_buttons',
    },
  },
  //表头数据
  columns: [],
  //表格数据
  data: [],
});
export const matColumns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'number', title: '物料编码', slots: { default: 'number' }, sortable: true },
  { field: 'name', title: '物料名称', sortable: true },
  { field: 'model', title: '规格型号', sortable: true },
  { field: 'baseUnit.name', title: '基本单位', sortable: true },
  { field: 'weightUnit.name', title: '重量单位', sortable: true },
  { field: 'bdMaterialGroup.name', title: '物料分组', sortable: true },
  {
    field: 'attr',
    title: '物料属性',
    sortable: true,
    slots: { default: 'attr' },
  },
  {
    field: 'bsStatus',
    title: '数据状态',
    sortable: true,
    slots: { default: 'status' },
  },
  { title: '操作', width: 160, slots: { default: 'operate' }, fixed: 'right' },
];
