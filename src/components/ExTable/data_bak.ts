// import { reactive, Ref, ref, computed } from 'vue';
// import { VxeGridProps } from 'vxe-table';
// import { getPermissionMenu } from '/@/api/sys/model/menuModel';
//
// //初始化表格
// export interface DataItem {
//   // key: string;
//   // pno: string;
//   // pname: string;
//   // ptype: string;
//   // pmodel: string;
//   // puser: string;
//   // punit: string;
//   // pattribute: string;
//   // pstatus: string;
//   //
//   mark: string; //备注
//   number: string; //物料编码
//   erpCode: string;
//   bsStatus: string; //业务状态A创建B审核
//   isDelete: boolean; //是否删除
//   creatTime: string; //创建时间
//   createBy: string; //创建人员
//   updateBy: string; //更新人员
//   tenantId: number; //租户ID
//   id: number; //唯一ID
//   name: string; //物料名称
//   model: string; //规格型号
//   baseUnitId: number; //基本单位ID
//   weightUnitId: number; //重量单位
//   groupId: string; //物料分组编码
//   attr: string; //物料属性：A自制，B外购，C委外，D虚拟
//   packId: string; //包装容器ID
//   examinSet: string; //检验设置A采购检验B生产检验 可组合用，隔开
//   examineType: string; //检验类型A免检，B质检，C全检
//   examineProjectId: number; //检验方案id
//   examineRuleId: number; //抽检规则
// }
// export const data_bak: Ref<DataItem[]> = ref([
//   {
//     key: '1',
//     pno: '010.B612.02',
//     pname: 'Square床头灯系列成品（含快递包装）',
//     ptype: '半成品',
//     pmodel: 'LYYD01,无线音乐台灯',
//     puser: '广州某贸易公司',
//     punit: '台',
//     pattribute: '委外',
//     pstatus: '已审核',
//   },
//   {
//     key: '2',
//     pno: '010.B612.03',
//     pname: 'Square床头灯系列成品（含快递包装）',
//     ptype: '成品',
//     pmodel: 'LYYD01,无线音乐台灯',
//     puser: '广州某贸易公司',
//     punit: '台',
//     pattribute: '自制',
//     pstatus: '已审核',
//   },
//   {
//     key: '3',
//     pno: '010.B612.04',
//     pname: 'Square床头灯系列成品（含快递包装）',
//     ptype: '成品',
//     pmodel: 'LYYD01,无线音乐台灯',
//     puser: '广州某贸易公司',
//     punit: '台',
//     pattribute: '自制',
//     pstatus: '创建',
//   },
//   {
//     key: '4',
//     pno: '010.B612.01',
//     pname: 'Square床头灯系列成品（含快递包装）',
//     ptype: '半成品',
//     pmodel: 'LYYD01,无线音乐台灯',
//     puser: '广州某贸易公司',
//     punit: '台',
//     pattribute: '自制',
//     pstatus: '已审核',
//   },
//   {
//     key: '5',
//     pno: '010.B612.01',
//     pname: 'Square床头灯系列成品（含快递包装）',
//     ptype: '半成品',
//     pmodel: 'LYYD01,无线音乐台灯',
//     puser: '广州某贸易公司',
//     punit: '台',
//     pattribute: '委外',
//     pstatus: '创建',
//   },
//   {
//     key: '6',
//     pno: '010.B612.01',
//     pname: 'Square床头灯系列成品（含快递包装）',
//     ptype: '成品',
//     pmodel: 'LYYD01,无线音乐台灯',
//     puser: '广州某贸易公司',
//     punit: '台',
//     pattribute: '委外',
//     pstatus: '创建',
//   },
//   {
//     key: '7',
//     pno: '010.B612.01',
//     pname: 'Square床头灯系列成品（含快递包装）',
//     ptype: '半成品',
//     pmodel: 'LYYD01,无线音乐台灯',
//     puser: '佛山某贸易公司',
//     punit: '台',
//     pattribute: '自制',
//     pstatus: '创建',
//   },
//
//   {
//     key: '8',
//     pno: '010.B612.01',
//     pname: 'Square床头灯系列成品（含快递包装）',
//     ptype: '成品',
//     pmodel: 'LYYD01,无线音乐台灯',
//     puser: '广州某贸易公司',
//     punit: '台',
//     pattribute: '委外',
//     pstatus: '已审核',
//   },
//   {
//     key: '9',
//     pno: '010.B612.01',
//     pname: 'Square床头灯系列成品（含快递包装）',
//     ptype: '半成品',
//     pmodel: 'LYYD01,无线音乐台灯',
//     puser: '佛山某贸易公司',
//     punit: '台',
//     pattribute: '委外',
//     pstatus: '已审核',
//   },
//
//   {
//     key: '10',
//     pno: '010.B612.01',
//     pname: 'Square床头灯系列成品（含快递包装）',
//     ptype: '成品',
//     pmodel: 'LYYD01,无线音乐台灯',
//     puser: '广州某贸易公司',
//     punit: '台',
//     pattribute: '委外',
//     pstatus: '已审核',
//   },
//   {
//     key: '11',
//     pno: '010.B612.01',
//     pname: 'Square床头灯系列成品（含快递包装）',
//     ptype: '半成品',
//     pmodel: 'LYYD01,无线音乐台灯',
//     puser: '广州某贸易公司',
//     punit: '台',
//     pattribute: '委外',
//     pstatus: '已审核',
//   },
//   {
//     key: '12',
//     pno: '010.B612.01',
//     pname: 'Square床头灯系列成品（含快递包装）',
//     ptype: '成品',
//     pmodel: 'LYYD01,无线音乐台灯',
//     puser: '中山某贸易公司',
//     punit: '台',
//     pattribute: '委外',
//     pstatus: '已审核',
//   },
//   {
//     key: '13',
//     pno: '010.B612.01',
//     pname: 'Square床头灯系列成品（含快递包装）',
//     ptype: '半成品',
//     pmodel: 'LYYD01,无线音乐台灯',
//     puser: '中山某贸易公司',
//     punit: '台',
//     pattribute: '委外',
//     pstatus: '已审核',
//   },
//
//   {
//     key: '14',
//     pno: '010.B612.01',
//     pname: 'Square床头灯系列成品（含快递包装）',
//     ptype: '成品',
//     pmodel: 'LYYD01,无线音乐台灯',
//     puser: '中山某贸易公司',
//     punit: '台',
//     pattribute: '委外',
//     pstatus: '已审核',
//   },
//   {
//     key: '15',
//     pno: '010.B612.01',
//     pname: 'Square床头灯系列成品（含快递包装）',
//     ptype: '半成品',
//     pmodel: 'LYYD01,无线音乐台灯',
//     puser: '中山某贸易公司',
//     punit: '台',
//     pattribute: '委外',
//     pstatus: '已审核',
//   },
// ]);
// export const gridOptions = reactive<VxeGridProps>({
//   border: true,
//   height: 840,
//   align: 'center',
//   loading: false,
//   columnConfig: {
//     resizable: true,
//   },
//   //分页设置
//   pagerConfig: {
//     total: data_bak.value.length,
//     currentPage: 1,
//     pageSize: 10,
//     pageSizes: [10, 20, 50, 100, 200, 500],
//     layouts: [
//       'Sizes',
//       'PrevJump',
//       'PrevPage',
//       'Number',
//       'NextPage',
//       'NextJump',
//       'FullJump',
//       'Total',
//     ],
//     perfect: true,
//   },
//   //操作按钮
//   toolbarConfig: {
//     slots: {
//       buttons: 'toolbar_buttons',
//     },
//   },
//   //表头数据
//   columns: [],
//   //表格数据
//   data: [],
// });
// export const columns = [
//   { type: 'checkbox', width: 50 },
//   { type: 'seq', title: '序号', width: 50 },
//   { field: 'pno', title: '物料编码', sortable: true },
//   { field: 'pname', title: '物料名称', sortable: true },
//   {
//     field: 'ptype',
//     title: '物料类型',
//     slots: { default: 'type' },
//     sortable: true,
//     // filters: [
//     //   { label: '成品', value: '成品' },
//     //   { label: '半成品', value: '半成品' },
//     // ],
//   },
//   { field: 'pmodel', title: '规格型号', sortable: true },
//   {
//     field: 'puser',
//     title: '使用组织',
//     sortable: true,
//     // filters: [
//     //   { label: '佛山某贸易公司', value: '佛山某贸易公司' },
//     //   { label: '中山某贸易公司', value: '中山某贸易公司' },
//     //   { label: '广州某贸易公司', value: '广州某贸易公司' },
//     // ],
//   },
//   { field: 'punit', title: '基本单位' },
//   {
//     field: 'pattribute',
//     title: '物料属性',
//     sortable: true,
//     // filters: [
//     //   { label: '委外', value: '委外' },
//     //   { label: '自制', value: '自制' },
//     // ],
//   },
//   {
//     field: 'pstatus',
//     title: '数据状态',
//     sortable: true,
//     // filters: [
//     //   { label: '已审核', value: '已审核' },
//     //   { label: '创建', value: '创建' },
//     // ],
//   },
//   { title: '操作', width: 160, slots: { default: 'operate' } },
// ];
//
// export const count = data_bak.value.length;
