<template>
  <vxe-grid
    border
    ref="xGrid"
    height="auto"
    show-overflow
    show-header-overflow
    v-bind="props.gridOptions"
    :data="props.detailTableData"
    :columns="props.columns"
    :edit-rules="props.editRules"
    @edit-closed="editClosed"
    :cell-style="cellStyle"
    auto-resize
  >
    <template #toolbar_buttons>
      <a-button
        type="primary"
        :disabled="props.isDisableButton"
        v-show="props.isShowInsertButton"
        @click="insertRowEvent"
        >新增行</a-button
      >
      <a-button
        style="margin-left: 10px"
        danger
        :disabled="props.isDisableButton"
        v-show="props.isShowRemoveButton"
        @click="removeRowEvent"
        >删除行</a-button
      >
      <a-button
        style="margin-left: 10px"
        type="primary"
        :disabled="props.isDisableButton"
        v-show="props.isShowFilterButton"
        @click="filterEvent"
        >筛选</a-button
      >
    </template>
    <template #model="{ row, column }">
      <ExInput
        placeholder="请选择"
        :show="props.isShowIcon"
        :disabled="row.bsStatus === 'B'"
        v-model:value="row[sliceBasicProp(column.field)].number"
        @search="onSearch(row, column)"
        @clear="onClear(row, column)"
      />
    </template>
    <template #model1="{ row, column }">
      <ExInput
        :disabled="row.bsStatus === 'B'"
        :show="props.isShowIcon"
        placeholder="请选择"
        v-model:value="row[sliceBasicProp(column.field)]"
        @search="onSearch(row, column)"
        @clear="onClear(row, column)"
      />
    </template>
    <template #date="{ row }">
      <DatePicker
        placeholder="请选择交货日期"
        :showToday="true"
        class="select"
        valueFormat="YYYY-MM-DD HH:mm:ss"
        format="YYYY-MM-DD"
        v-model.lazy:value="row.dlDate"
      />
    </template>
    <template #open="{ row }">
      <Switch
        :disabled="row.bsStatus === 'B'"
        :checked-children="config.YES_OR_NO[1]"
        :un-checked-children="config.YES_OR_NO[0]"
        :checkedValue="1"
        :unCheckedValue="0"
        v-model:checked="row.isOpen"
      />
    </template>
    <template #gain="{ row }">
      <span>{{ row.gain }}</span>
    </template>
    <template #loss="{ row }">
      <span>{{ row.loss }}</span>
    </template>
    <template #numPrice="{ row }">
      <span>{{
        row.num && row.price ? (row.totalPrice = row.num * row.price).toFixed(2) : null
      }}</span>
    </template>
    <template #realNumPrice="{ row }">
      <span>{{
        row.realNum && row.price ? (row.totalPrice = row.realNum * row.price).toFixed(2) : null
      }}</span>
    </template>
    <template #needNum="{ row }">
      <span>{{ row.needNum }}</span>
    </template>
    <template #isRequire="{ row }">
      <Switch
        :disabled="row.bsStatus === 'B'"
        :checked-children="config.YES_OR_NO[1]"
        :un-checked-children="config.YES_OR_NO[0]"
        :checkedValue="1"
        :unCheckedValue="0"
        v-model:checked="row.isRequire"
      />
    </template>
    <template #wayDefault="{ row }">
      <span>{{ formatData(row.way, config['WAY_BAR_RULES'])['label'] }}</span>
    </template>
    <template #way="{ row }">
      <vxe-select v-model="row.way" transfer>
        <vxe-option
          v-for="item in config.WAY_BAR_RULES"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </vxe-select>
    </template>
    <template #attrName="{ row }">
      <vxe-select v-model="row.name">
        <vxe-option
          v-for="(item, key) in props.attrNameData"
          :key="key + 'k1'"
          :value="item.name"
          :label="item.name"
        />
      </vxe-select>
    </template>
    <template #attrType="{ row }">
      <span>{{
        formatData(row.name ? props.attrTypeData : '', config['ATTR_TYPE'])['label']
      }}</span>
    </template>
    <!--    <template #formatDefault="{ row }">-->
    <!--      <span>{{ formatData(row.format, config['DATE_FORMAT'])['label'] }}</span>-->
    <!--    </template>-->
    <template #formatDefault="{ row }">
      <span>{{ formatData(row.format, config['WAY_BAR_RULES'])['label'] }}</span>
    </template>
    <template #format="{ row }">
      <vxe-select v-model="row.format" transfer>
        <vxe-option
          v-for="item in config.WAY_BAR_RULES"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </vxe-select>
    </template>
  </vxe-grid>
  <BasicSearch
    @basicClickEvent="basicClickEvent"
    :gridOptions="basicGridOptions"
    ref="basicSearchRef"
    :control="basicControl"
    :tableCols="basicTableCols"
    :tableName="basicTableName"
  />
</template>

<script lang="ts" setup>
  import { onMounted, PropType, reactive, ref } from 'vue';
  import { VxeGridInstance } from 'vxe-table';
  import { ExInput } from '/@/components/ExInput';
  import { Button, Switch, DatePicker } from 'ant-design-vue';
  import { config, configEntity } from '/@/utils/publicParamConfig';
  import {
    ControlSet,
    SearchDataType,
    SearchLink,
    SearchMatchType,
    SearchParams,
    TableColum,
    Url,
  } from '/@/api/apiLink'; //公共配置ts
  import { getPublicList } from '/@/api/public';
  import { basicGridOptions } from '/@/components/AMoreSearch/data';
  import { BasicSearch } from '/@/components/AMoreSearch';
  import { VxeGridPropTypes, VxeTablePropTypes } from 'vxe-table/types/all';

  const AButton = Button;
  const props = defineProps({
    gridOptions: Object,
    columns: Array,
    isShowIcon: Boolean,
    isDisableButton: Boolean,
    isShowInsertButton: {
      type: Boolean,
      default: true,
    },
    isShowRemoveButton: {
      type: Boolean,
      default: true,
    },
    isShowFilterButton: {
      type: Boolean,
      default: true,
    },
    editRules: Object as PropType<VxeTablePropTypes.EditRules>, //校验规则
    detailTableData: {
      type: Array,
    },
    attrNameData: {
      type: Array,
    },
    attrTypeData: {
      type: String,
      default: '',
    },
  });
  const emit = defineEmits<Emits>();
  type Emits = {
    (event: 'cellClickTableEvent', row, data, column): void; //双击获取字段数据
    (event: 'clearDetailTableEvent', data, column): void; //明细表清空事件
    (event: 'setDefaultTableData', obj): void; //新增行时设置默认值
    (event: 'editDefaultTableData', obj): void; //编辑时，单元格数据变化
    (event: 'getCountAmount', data): void; //编辑单元格自动计算数量
    (event: 'filterEvent'): void; ///筛选条件查询
  };
  const tableFullData: any = ref<object[]>([]); //表格数据
  let validAllErrMapData = ref<string>(''); //表格校验数据
  const nowColumFileName: any = reactive({ data: {} }); //当前选中单元格节点
  const nowCheckRow: any = reactive({ data: {} }); //当前选中行数据
  const xGrid = ref<VxeGridInstance>();
  //基础信息查询组件ref
  const basicSearchRef: any = ref<any>(undefined);
  const basicControl = ref<ControlSet[]>(); //下拉框
  const basicTableCols = ref<VxeGridPropTypes.Columns[]>([]); //表头
  let basicTableName = ref<string>(''); //需要查询的表名
  //打开弹框，获取数据
  const onSearch = async (data, column) => {
    nowColumFileName.data = column; //输入框column.field
    nowCheckRow.data = data; //当前选中行数据
    const res = await getPublicList({ params: [] }, Url[column.params.select]);
    basicControl.value = res;
    basicTableCols.value = TableColum[column.params.select];
    basicTableName.value = column.params.tableName;
    let filterParams: SearchParams[] = [];
    if (
      column.field === 'bdStockCompartment.name' ||
      column.field === 'bdInStockCompartment.name' ||
      column.field === 'bdOutStockCompartment.name'
    ) {
      if (data.stockId) {
        filterParams = [
          {
            table: 'BdStockCompartment',
            name: 'stockId',
            column: 'stock_id',
            link: SearchLink.AND,
            rule: SearchMatchType.EQ,
            type: SearchDataType.string,
            val: data.stockId,
          },
        ];
      } else if (data.inStockId && column.field === 'bdInStockCompartment.name') {
        filterParams = [
          {
            table: 'BdStockCompartment',
            name: 'stockId',
            column: 'stock_id',
            link: SearchLink.AND,
            rule: SearchMatchType.EQ,
            type: SearchDataType.string,
            val: data.inStockId,
          },
        ];
      } else if (data.outStockId && column.field === 'bdOutStockCompartment.name') {
        filterParams = [
          {
            table: 'BdStockCompartment',
            name: 'stockId',
            column: 'stock_id',
            link: SearchLink.AND,
            rule: SearchMatchType.EQ,
            type: SearchDataType.string,
            val: data.outStockId,
          },
        ];
      }
    }
    if (
      column.field === 'bdStockLocation.name' ||
      column.field === 'bdInStockLocation.name' ||
      column.field === 'bdOutStockLocation.name'
    ) {
      if (data.compartmentId) {
        filterParams = [
          {
            table: 'BdStockLocation',
            name: 'compartmentId',
            column: 'compartment_id',
            link: SearchLink.AND,
            rule: SearchMatchType.EQ,
            type: SearchDataType.string,
            val: data.compartmentId,
          },
        ];
      } else if (data.inCompartmentId && column.field === 'bdInStockLocation.name') {
        filterParams = [
          {
            table: 'BdStockLocation',
            name: 'compartmentId',
            column: 'compartment_id',
            link: SearchLink.AND,
            rule: SearchMatchType.EQ,
            type: SearchDataType.string,
            val: data.inCompartmentId,
          },
        ];
      } else if (data.outCompartmentId && column.field === 'bdOutStockLocation.name') {
        filterParams = [
          {
            table: 'BdStockLocation',
            name: 'compartmentId',
            column: 'compartment_id',
            link: SearchLink.AND,
            rule: SearchMatchType.EQ,
            type: SearchDataType.string,
            val: data.outCompartmentId,
          },
        ];
      }
    }
    basicSearchRef.value.setFilter(filterParams);
    basicSearchRef.value.init(Url[column.params.list]);
  };
  /**
   * 格式化数据
   * @param data
   * @param source
   */
  const formatData = (data: string | number, source: configEntity[]) => {
    let res;
    if (source && source.length > 0) {
      res = source.find((item) => item.value === data);
    }
    return res ? res : '';
  };
  //截取基本属性
  const sliceBasicProp = (data: string) => {
    return data.split('.')[0];
  };

  const editClosed = (row: any, column: any) => {
    emit('getCountAmount', row.row); //点击单元格时计算
    emit('editDefaultTableData', row.row); //点击单元格
    console.log('column', column);
  };

  //基本信息表格双击事件
  const basicClickEvent = async (row: object) => {
    let columnFile = sliceBasicProp(nowColumFileName.data.field);
    emit('cellClickTableEvent', row, nowCheckRow.data, columnFile);
    basicSearchRef.value.close();
  };

  //修改表格样式
  const cellStyle: VxeTablePropTypes.CellStyle = ({ row, column }) => {
    switch (true) {
      case row.bsStatus === 'B':
        return {
          backgroundColor: 'rgb(225 225 224)',
        };
      case column.field == 'bdStockCompartment.name' && (row.stockDis == 'A' || !row.stockId):
        return {
          backgroundColor: 'rgb(225 225 224)',
        };
      case column.field == 'bdStockLocation.name' && (row.stockDis !== 'C' || !row.compartmentId):
        return {
          backgroundColor: 'rgb(225 225 224)',
        };
      case column.field == 'bdInStockCompartment.name' && (row.stockDis == 'A' || !row.inStockId):
        return {
          backgroundColor: 'rgb(225 225 224)',
        };
      case column.field == 'bdInStockLocation.name' &&
        (row.stockDis !== 'C' || !row.inCompartmentId):
        return {
          backgroundColor: 'rgb(225 225 224)',
        };
      case column.field == 'bdOutStockCompartment.name' && (row.stockDis == 'A' || !row.outStockId):
        return {
          backgroundColor: 'rgb(225 225 224)',
        };
      case column.field == 'bdOutStockLocation.name' &&
        (row.stockDis !== 'C' || !row.outCompartmentId):
        return {
          backgroundColor: 'rgb(225 225 224)',
        };
      // //条码规则
      case row.bsStatus === 'B':
        return {
          backgroundColor: 'rgb(225 225 224)',
        };
      case column.field == 'format' && row.attrType && row.attrType !== 'DATE':
        return {
          backgroundColor: 'rgb(225 225 224)',
        };
    }
  };
  //点击清空图标清空事件
  const onClear = (data: object, column: object) => {
    emit('clearDetailTableEvent', data, column);
  };

  //新增行
  const insertRowEvent = () => {
    const $grid: any = xGrid.value;
    let obj = { sort: 0 };
    let arr = $grid.getTableData();
    obj.sort = Number(arr.fullData.length) + 1;
    emit('setDefaultTableData', obj);
    const record = obj;
    $grid.insertAt(record, -1);
  };

  //删除行
  const removeRowEvent = () => {
    const $grid: any = xGrid.value;
    $grid.removeCheckboxRow();
  };
  //显示筛选弹框
  const filterEvent = () => {
    emit('filterEvent');
  };
  //获取校验规则
  const getValidAllData = async () => {
    const $grid: any = xGrid.value;
    validAllErrMapData.value = await $grid.validate(true);
    return validAllErrMapData.value;
  };
  //获取表格数据
  const getDetailData = (): object[] => {
    const $grid: any = xGrid.value;
    let tableData = $grid.getTableData();
    tableFullData.value = tableData.fullData;
    for (let i = 0; i < tableFullData.value.length; i++) {
      tableFullData.value[i].seq = i + 1;
    }
    return tableFullData.value;
  };
  defineExpose({
    getValidAllData,
    getDetailData,
  });

  onMounted(() => {});
</script>
<style scoped lang="less">
  :deep(.disableProp) {
    background-color: rgb(225 225 224);
  }
  :deep(.vxe-toolbar .vxe-tools--operate) {
    margin-right: 10px;
  }
  :deep(.ant-select) {
    width: 100%;
  }
</style>
