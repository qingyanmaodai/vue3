<template>
  <vxe-grid
    border
    ref="xGrid"
    class="table"
    max-height="100%"
    v-bind="props.gridOptions"
    :columns="props.columns"
    :data="tableInitData"
    :edit-rules="editRules"
    :export-config="{}"
  >
    <template #toolbar_buttons>
      <div style="width: 100%; margin-left: 10px">
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
      </div>
    </template>
    <template #model="{ row, column }">
      <ExInput
        :show="props.isShowIcon"
        v-model:value="row[sliceBasicProp(column.field)].name"
        @search="onSearch(row, column)"
        @clear="onClear(row, column)"
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
  import { onMounted, reactive, ref, toRef } from 'vue';
  import { VxeGridInstance } from 'vxe-table';
  import { cloneDeep } from 'lodash-es';
  import { ExInput } from '/@/components/ExInput';
  import { Button } from 'ant-design-vue';
  import { SearchDataType, SearchLink, SearchMatchType, TableColum, Url } from '/@/api/apiLink'; //公共配置ts
  import { getPublicList } from '/@/api/public';
  import { basicGridOptions } from '/@/components/AMoreSearch/data';
  import { BasicSearch } from '/@/components/AMoreSearch';
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
    editRules: Object, //校验规则
  });
  //选择框data
  const emit = defineEmits<Emits>();
  type Emits = {
    (event: 'cellClickTableEvent', row, data): void; //查询
  };

  const nowCheckData: any = reactive({ data: {} }); //当前选中单元格节点
  const nowCheckRow: any = reactive({ data: {} }); //当前选中行数据
  const basicSearchRef: any = ref(null); //基础信息查询组件ref
  const xGrid = ref<VxeGridInstance>();
  const tableInit = reactive<any>({ data: [] }); //数据初始化

  const tableInitData = toRef(tableInit, 'data');
  //获取表格初始值
  const init = (data) => {
    console.log(data, 'asa');
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
    emit('cellClickTableEvent', row, nowCheckRow.data);
    let prop = sliceBasicProp(nowCheckData.data.field);
    nowCheckRow.data[prop] = {
      id: row.id,
      name: row.name,
    };
    console.log(nowCheckRow.data, '111111', prop);
    console.log(tableInitData.value, 'asasqas');
    sortEventNum();
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
  //单元格有值时自动排序
  const sortEventNum = () => {
    const $grid: any = xGrid.value;
    if (nowCheckRow.data.number) {
      $grid.sort('number', 'asc');
    }
  };
  // sortEventNum();

  //点击清空图标清空事件
  const onClear = (data, column) => {
    data[sliceBasicProp(column.field)] = {
      id: '',
      name: '',
    };
  };
  //新增行
  const insertRowEvent = async () => {
    const $grid: any = xGrid.value;
    const record = {};
    const { row: newRow } = await $grid.insert(record);
    tableInitData.value.push(newRow);
    console.log('tableInitData.value', tableInitData.value);
  };
  //删除行
  const removeRowEvent = () => {
    const $grid: any = xGrid.value;
    $grid.removeCheckboxRow();
  };
  //保存数据
  const saveDataEvent = () => {
    // data = tableInitData.value;
    const data = tableInitData.value;
    console.log('baocun--data', data);
  };
  defineExpose({
    init,
    saveDataEvent,
  });

  onMounted(() => {
  });
</script>
<style scoped lang="less">
  :deep(.disableProp) {
    background-color: rgb(225 225 224);
  }
  .table {
    background-color: #fff;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  :deep(.vxe-toolbar .vxe-tools--operate) {
    margin-right: 10px;
  }
</style>
