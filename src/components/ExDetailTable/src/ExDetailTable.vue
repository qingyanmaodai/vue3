<template>
  <vxe-grid
    border
    ref="xGrid"
    height="auto"
    show-overflow
    show-header-overflow
    v-bind="props.gridOptions"
    :columns="props.columns"
    :data="tableInitData"
    :edit-rules="editRules"
    auto-resize
  >
    <template #toolbar_buttons>
      <a-button
        type="primary"
        ghost
        v-show="props.isShowInsertRow"
        size="small"
        @click="insertRowEvent"
        >新增行</a-button
      >
      <a-button
        style="margin-left: 10px"
        danger
        v-show="props.isShowRemoveRow"
        size="small"
        @click="removeRowEvent"
        >删除行</a-button
      >
    </template>
    <template #model="{ row, column }">
      <ExInput
        :show="props.isShowIcon"
        v-model:value="row[sliceBasicProp(column.field)].name"
        @search="onSearch(row, column)"
        @clear="onClear(row, column)"
      />
    </template>
    <template #sum="{ row, column }">
      <a style="color: #0960bd">{{ calc(row, column) }}</a>
    </template>
    <template #select="{ row }">
      <vxe-select v-model="row.select" :options="config.EXAMINE_BUSINESS" transfer />
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
  import { onMounted, PropType, reactive, ref, toRef } from 'vue';
  import { VxeGridInstance } from 'vxe-table';
  import { cloneDeep } from 'lodash-es';
  import { ExInput } from '/@/components/ExInput';
  import { Button } from 'ant-design-vue';
  import { config } from '/@/utils/publicParamConfig';
  import { SearchDataType, SearchLink, SearchMatchType, TableColum, Url } from '/@/api/apiLink'; //公共配置ts
  import { getPublicList } from '/@/api/public';
  import { basicGridOptions } from '/@/components/AMoreSearch/data';
  import { BasicSearch } from '/@/components/AMoreSearch';
  import { VxeTablePropTypes } from 'vxe-table/types/all';
  const AButton = Button;
  const props = defineProps({
    gridOptions: Object,
    columns: Array,
    isShowIcon: Boolean,
    isShowInsertRow: {
      type: Boolean,
      default: true,
    },
    isShowRemoveRow: {
      type: Boolean,
      default: true,
    },
    editRules: Object as PropType<VxeTablePropTypes.EditRules>, //校验规则
    sunAmount: String,
    fieldName: {
      type: String,
      default: 'sort',
    },
    order: {
      type: String,
      default: 'asc',
    },
  });
  const emit = defineEmits<Emits>();
  type Emits = {
    (event: 'cellClickTableEvent', row, data, column): void; //双击获取字段数据
    (event: 'countAmount', data): void; //编辑单元格自动计算总价
  };
  const tableFullData = ref<object[]>([]); //表格数据
  const nowCheckData: any = reactive({ data: {} }); //当前选中单元格节点
  const nowCheckRow: any = reactive({ data: {} }); //当前选中行数据
  const basicSearchRef: any = ref(null); //基础信息查询组件ref
  const xGrid = ref<VxeGridInstance>();
  const tableData: any[] = [];
  //数据初始化
  const tableInit = reactive({
    data: tableData,
  });
  const tableInitData = toRef(tableInit, 'data');
  //从详情页获取表格初始值
  const init = (data) => {
    tableInitData.value.push(data);
    tableInitData.value = cloneDeep(tableInitData.value);
  };

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
    return data.slice(0, -5);
  };

  //基本信息表格双击事件
  const basicClickEvent = (row) => {
    emit('cellClickTableEvent', row, nowCheckRow.data, sliceBasicProp(nowCheckData.data.field));
    let prop = sliceBasicProp(nowCheckData.data.field);
    nowCheckRow.data[prop] = {
      id: row.id,
      name: row.name,
    };
    console.log(nowCheckRow.data, '基本信息表格双击', prop);
    basicSearchRef.value.bSearch(false);
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
      //选择分类的接口地址，如基本单位。。
      Url[column.params.list],
    );
  };

  //格式化数据
  // const formatData = (data: string | number, source: configEntity[]) => {
  //   let res;
  //   if (source && source.length > 0) {
  //     res = source.find((item) => item.value === data);
  //   }
  //   return res ? res.label : '';
  // };

  //只对 edit-config 配置时有效，单元格编辑状态下被关闭时会触发该事件-----------获取当前行
  // const editClosed = (row) => {
  //   emit('countAmount', row.row); //计算
  //   // sortColumEvent(row.row); //排序
  //   saveDataEvent();
  // };
  const calc = (row, column) => {
    emit('countAmount', row); //计算
    // sortColumEvent(row.row); //排序
    saveDataEvent();
    return row[column.field];
  };

  // 单元格有值时自动排序---字段名：fieldName，排序方式：order
  // const sortColumEvent = (data) => {
  //   const $grid: any = xGrid.value;
  //   if (data) {
  //     $grid.sort(props.fieldName, props.order);
  //   }
  // };

  //点击清空图标清空事件
  const onClear = (data, column) => {
    data[sliceBasicProp(column.field)] = {
      id: '',
      name: '',
    };
  };
  //新增行
  const insertRowEvent = () => {
    const $grid: any = xGrid.value;
    const record = {};
    $grid.insertAt(record, -1);
  };

  //删除行
  const removeRowEvent = () => {
    const $grid: any = xGrid.value;
    $grid.removeCheckboxRow();
  };
  //保存数据
  const saveDataEvent = () => {
    const $grid: any = xGrid.value;
    const tableData = $grid.getTableData();
    tableFullData.value = tableData.fullData;
  };
  defineExpose({
    init,
    saveDataEvent,
    tableFullData,
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
  //:deep(.vxe-button.type--button.is--circle) {
  //  width: 1em;
  //  height: 2em;
  //  min-width: 20px;
  //  min-height: 20px;
  //}
  //:deep(.vxe-button.type--button) {
  //  width: 10em;
  //  height: 15em;
  //}
</style>
