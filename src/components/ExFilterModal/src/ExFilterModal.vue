<template>
  <div>
    <vxe-modal
      v-model="isShow"
      id="moreSearchModal"
      show-zoom
      resize
      :position="{ top: 40 }"
      width="60%"
      @close="close"
    >
      <div class="content">
        <div class="contentNode" v-for="(item, index) in inputDataList" :key="index">
          <div style="margin: 4px 5px 0 0">{{ item.addonBeforeLabel }}</div>
          <div>
            <ExInput
              class="input"
              autocomplete="off"
              placeholder="请选择"
              :show="formState.bsStatus !== 'B'"
              v-model:value="formState.inputValue[index]"
              :disabled="inputDataList[index].disabledInput"
              @search="onSearch(item, index)"
              @clear="onClear(item, index)"
          /></div>
        </div>
      </div>
      <template #title>
        <span>筛选条件</span>
      </template>
      <span style="display: flex; float: right">
        <a-button type="primary" class="x-button" @click="searchEvent">查询</a-button>
        <a-button class="x-button" @click="resetEvent">重置</a-button>
        <a-button type="primary" class="x-button" @click="close">取消</a-button>
      </span>
    </vxe-modal>
    <BasicSearch
      @basicClickEvent="basicClickEvent"
      :gridOptions="basicGridOptions"
      ref="basicSearchRef"
      :control="basicControl"
      :tableCols="basicTableCols"
      :tableName="basicTableName"
    />
  </div>
</template>

<script lang="ts" setup>
  import { Button } from 'ant-design-vue';
  import { reactive, ref, toRef } from 'vue';
  import { ExInput } from '/@/components/ExInput';
  import { BasicSearch } from '/@/components/AMoreSearch';
  import { basicGridOptions } from '/@/components/AMoreSearch/data';
  import {
    ControlSet,
    SearchDataType,
    SearchLink,
    SearchMatchType,
    SearchParams,
    TableColum,
    Url,
  } from '/@/api/apiLink';
  import { VxeGridPropTypes } from 'vxe-table/types/all';
  import { getPublicList } from '/@/api/public';
  import { cloneDeep } from 'lodash-es';
  const AButton = Button;

  const isShow = ref(false);
  //基础信息查询组件ref
  const basicSearchRef: any = ref<any>(undefined);
  const basicControl = ref<ControlSet[]>(); //下拉框
  const basicTableCols = ref<VxeGridPropTypes.Columns[]>([]); //表头
  let basicTableName = ref<string>(''); //需要查询的表名

  const emit = defineEmits<Emits>();
  type Emits = {
    (event: 'filterModalSearchEvent'): void; ///筛选条件查询
  };
  interface ProType {
    tableName: string;
  }
  const props = withDefaults(defineProps<ProType>(), {
    tableName: '',
  });
  interface FormState {
    inputValue: Array<any>;
    bsStatus?: string;
  }

  const defaultF: FormState = {
    inputValue: [],
  };
  const defaultData: FormState = cloneDeep(defaultF);

  const formStateInit = reactive({
    data: cloneDeep(defaultData),
  });
  const formState = toRef(formStateInit, 'data');
  /*约定数组下标，0：仓库，1：分仓，2，仓位，3：物料*/
  let inputDataList: any = ref<object[]>([
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
  ]);
  //查询赋值dtData
  const getSearchParams = (): SearchParams[] => {
    let getParams: SearchParams[] = [];
    for (let i = 0; i < inputDataList.value.length; i++) {
      if (formState.value.inputValue[i]) {
        getParams.push({
          table: props.tableName,
          name: inputDataList.value[i].nameParam,
          column: inputDataList.value[i].columnParam,
          link: SearchLink.AND,
          rule: SearchMatchType.LIKE,
          type: SearchDataType.string,
          val: formState.value.inputValue[i]['id'],
          startWith: '',
          endWith: '',
        });
      }
    }
    return getParams;
  };
  //点击清空图标清空事件
  const onClear = (item, index) => {
    if (item.tableName == 'BdStock') {
      formState.value.inputValue[1] = undefined;
      formState.value.inputValue[2] = undefined;
      inputDataList.value[1]['disabledInput'] = true;
      inputDataList.value[2]['disabledInput'] = true;
    }
    if (item.tableName == 'BdStockCompartment') {
      formState.value.inputValue[2] = undefined;
      inputDataList.value[2]['disabledInput'] = true;
    }
    formState.value.inputValue[index] = undefined;
  };

  let currIndex = 0;
  /**
   * 基础资料弹窗
   * @param item
   * @param index
   */
  const onSearch: any = async (item, index) => {
    currIndex = index;
    const res = await getPublicList({ params: [] }, Url[item.dtoUrlConfig]);
    basicControl.value = res;
    basicTableCols.value = TableColum[item.dtoUrlConfig];
    basicTableName.value = item.tableName;
    let filterParams: SearchParams[] = [];
    //筛选仓库，分仓
    if (item.tableName === 'BdStockLocation' || item.tableName === 'BdStockCompartment') {
      if (formState.value.inputValue[index - 1]) {
        filterParams = [
          {
            table: item.tableName,
            name: inputDataList.value[index - 1].nameParam,
            column: inputDataList.value[index - 1].columnParam,
            link: SearchLink.AND,
            rule: SearchMatchType.EQ,
            type: SearchDataType.string,
            val: formState.value.inputValue[index - 1].id,
          },
        ];
      }
    }
    basicSearchRef.value.setFilter(filterParams);
    basicSearchRef.value.init(item.tableUrl);
  };

  //双击单元格选择事件——获取双击所选的值并赋值到对应字段
  const basicClickEvent = async (row) => {
    basicSearchRef.value.close();
    formState.value.inputValue[currIndex] = row;
    if (formState.value.inputValue[currIndex]) {
      if (currIndex === 1 || currIndex === 0) {
        inputDataList.value[currIndex + 1]['disabledInput'] = false;
      }
    }
  };

  const show = () => {
    isShow.value = true;
  };
  const close = () => {
    isShow.value = false;
  };
  //查询按钮
  const searchEvent = () => {
    isShow.value = false;
    emit('filterModalSearchEvent');
  };

  //重置方法
  const resetEvent = () => {
    formState.value = cloneDeep(defaultData);
    inputDataList.value.map((item) => {
      if (item.tableName === 'BdStockLocation' || item.tableName === 'BdStockCompartment') {
        item['disabledInput'] = true;
      }
    });
  };
  defineExpose({
    show,
    close,
    getSearchParams,
  });
</script>
<style scoped lang="less">
  .x-button {
    margin: 10px 5px;
  }
  .item {
    flex-flow: nowrap;
  }
  .input {
    width: 14rem;
    height: 2rem;
    margin: 0 30px 0 2px;
  }
  .content {
    //height: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .contentNode {
    width: 50%;
    padding-bottom: 20px;
    justify-content: center;
    display: flex;
    margin: 0 !important;
  }
</style>
