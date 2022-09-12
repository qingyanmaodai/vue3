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
    :row-style="rowStyle"
    auto-resize
  >
    <template #toolbar_buttons>
      <a-button
        type="primary"
        :disabled="props.isDisableButton"
        v-show="props.isShowInsertRow"
        @click="insertRowEvent"
        >新增行</a-button
      >
      <a-button
        style="margin-left: 10px"
        danger
        :disabled="props.isDisableButton"
        v-show="props.isShowRemoveRow"
        @click="removeRowEvent"
        >删除行</a-button
      >
    </template>
    <template #model="{ row, column }">
      <ExInput
        :show="props.isShowIcon"
        v-model:value="row[sliceBasicProp(column.field)].number"
        @search="onSearch(row, column)"
        @clear="onClear(row, column)"
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
  </vxe-grid>
  <BasicSearch
    @openSearch="openSearch"
    @basicClickEvent="basicClickEvent"
    :gridOptions="basicGridOptions"
    ref="basicSearchRef"
  />
</template>

<script lang="ts" setup>
  import { onMounted, PropType, reactive, ref } from 'vue';
  import { VxeGridInstance } from 'vxe-table';
  import { cloneDeep } from 'lodash-es';
  import { ExInput } from '/@/components/ExInput';
  import { Button, Switch } from 'ant-design-vue';
  import { config } from '/@/utils/publicParamConfig';
  import { SearchDataType, SearchLink, SearchMatchType, TableColum, Url } from '/@/api/apiLink'; //公共配置ts
  import { getPublicList } from '/@/api/public';
  import { basicGridOptions } from '/@/components/AMoreSearch/data';
  import { BasicSearch } from '/@/components/AMoreSearch';
  import { VxeTablePropTypes } from 'vxe-table/types/all';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  const AButton = Button;
  const props = defineProps({
    gridOptions: Object,
    columns: Array,
    isShowIcon: Boolean,
    isDisableButton: Boolean,
    isShowInsertRow: {
      type: Boolean,
      default: true,
    },
    isShowRemoveRow: {
      type: Boolean,
      default: true,
    },
    editRules: Object as PropType<VxeTablePropTypes.EditRules>, //校验规则
    detailTableData: {
      type: Array,
    },
  });
  const emit = defineEmits<Emits>();
  type Emits = {
    (event: 'cellClickTableEvent', row, data, column): void; //双击获取字段数据
    (event: 'changeSwitch', obj): void; //新增行时设置默认值
    (event: 'getJudgeClickData', arr, row, callback): void; //获取判断双击赋值事件的值
  };
  const tableFullData: any = ref<object[]>([]); //表格数据
  const rowSortData = ref<number>(1); //表格顺序
  let validAllErrMapData = ref<string>(''); //表格校验数据
  const nowCheckData: any = reactive({ data: {} }); //当前选中单元格节点
  const nowCheckRow: any = reactive({ data: {} }); //当前选中行数据
  const basicSearchRef: any = ref(null); //基础信息查询组件ref
  const xGrid = ref<VxeGridInstance>();
  //打开弹框，获取数据
  const onSearch = async (data, column) => {
    nowCheckData.data = column; //输入框column.field
    nowCheckRow.data = data; //当前选中行数据
    const res = await publicEvent(undefined, column); //表格获取数据
    basicSearchRef.value.initList(res); //表格数据
    basicSearchRef.value.initCols(TableColum[column.params.select]); //表头
    basicSearchRef.value.bSearch(true); //打开弹框
    await getPublicListOption(column); //基本信息查询下拉框
  };
  //基本信息查询下拉框
  const getPublicListOption = async (column: any) => {
    try {
      const data: any = await getPublicList(
        {
          params: [],
        },
        Url[column.params.select],
      );
      let arr = cloneDeep(data);
      arr = arr.filter((e) => e.fieldName != 'bs_status');
      basicSearchRef.value.getListUnitEvent(arr);
    } catch (e) {
      console.log('高级查询获取基本信息字段失败', e);
    }
  };
  //基本信息弹框中需要的数据
  const openSearch = async (keywords) => {
    const res = await publicEvent(keywords, nowCheckData.data);
    basicSearchRef.value.initList(res);
  };
  //截取基本属性
  const sliceBasicProp = (data: string) => {
    return data.split('.')[0];
  };

  //基本信息表格双击事件
  const basicClickEvent = async (row) => {
    const $grid: any = xGrid.value;
    let arr = $grid.getTableData();
    let prop = sliceBasicProp(nowCheckData.data.field);
    emit('getJudgeClickData', arr, row, (index) => {
      if (index !== -1) {
        createMessage.error('该项目已被选择!');
        return;
      }
      emit('cellClickTableEvent', row, nowCheckRow.data, prop);
      nowCheckRow.data[prop] = {
        number: row.number,
        name: row.name,
        id: row.id,
      };
      basicSearchRef.value.bSearch(false);
    });
  };

  //基本信息数据查询
  const publicEvent = async (keywords, column) => {
    let paramArr: any = [];
    if (keywords) {
      paramArr.push(keywords);
    }
    paramArr.push({
      column: 'bs_status',
      endWith: '',
      link: SearchLink.AND,
      rule: SearchMatchType.LIKE,
      type: SearchDataType.string,
      name: 'bsStatus',
      startWith: '',
      table: '',
      val: 'B',
    });
    return await getPublicList(
      {
        params: paramArr,
      },
      //选择分类的接口地址，如基本单位
      Url[column.params.list],
    );
  };

  // 格式化数据
  // const formatData = (data: string | number, source: configEntity[]) => {
  //   let res;
  //   if (source && source.length > 0) {
  //     res = source.find((item) => item.value === data);
  //   }
  //   return res ? res.label : '';
  // };

  //修改表格样式
  const rowStyle: VxeTablePropTypes.RowStyle = ({ row }) => {
    if (row.bsStatus === 'B') {
      return {
        backgroundColor: 'rgb(225 225 224)',
      };
    }
  };
  //点击清空图标清空事件
  const onClear = (data, column) => {
    data[sliceBasicProp(column.field)] = {
      number: '',
      name: '',
      id: '',
    };
  };

  //新增行
  const insertRowEvent = () => {
    const $grid: any = xGrid.value;
    let obj = {};
    let arr = $grid.getTableData();
    rowSortData.value = Number(arr.fullData.length) + 1;
    emit('changeSwitch', obj);
    const record = obj;
    $grid.insertAt(record, -1);
  };

  //删除行
  const removeRowEvent = () => {
    const $grid: any = xGrid.value;
    $grid.removeCheckboxRow();
  };

  //获取校验规则
  const getValidAllData = async () => {
    const $grid: any = xGrid.value;
    validAllErrMapData.value = await $grid.validate(true);
    return validAllErrMapData.value;
  };

  //获取表格数据
  const getDetailData = (): object[] => {
    // let tableData: any = '';
    const $grid: any = xGrid.value;
    let tableData = $grid.getTableData();
    tableFullData.value = tableData.fullData;
    return tableFullData.value;
  };

  defineExpose({
    getValidAllData,
    tableFullData,
    rowSortData,
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
