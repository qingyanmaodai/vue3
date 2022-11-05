<template>
  <div>
    <div class="search" style="background-color: #fff">
      <div>
        <span>物料</span>
        <ExInput
          class="input"
          label="物料"
          v-model:value="formState.matName"
          @search="
            onSearch('GET_MAT_DTO', 'bdMaterial', Url.GET_MATERIAL_LIST, ['matId', 'matName'])
          "
          @clear="onClear(['matId', 'matName'])"
        />
      </div>
      <div>
        <span>仓库</span>
        <ExInput
          class="input"
          label="仓库"
          v-model:value="formState.stockName"
          @search="
            onSearch('GET_STOCK_DTO', 'BdStock', Url.GET_PAGE_STOCK_LIST, ['stockId', 'stockName'])
          "
          @clear="onClear(['stockId', 'stockName'])"
        />
      </div>
      <div>
        <span>分仓</span>
        <ExInput
          class="input"
          label="分仓"
          v-model:value="formState.compartmentName"
          @search="
            onSearch(
              'GET_SUB_STOCK_DTO',
              'BdStockCompartment',
              Url.GET_PAGE_STOCK_COMPARTMENT_LIST,
              ['compartmentId', 'compartmentName'],
            )
          "
          @clear="onClear(['compartmentId', 'compartmentName'])"
        />
      </div>
      <div>
        <span>仓位</span>
        <ExInput
          class="input"
          label="仓位"
          v-model:value="formState.locationName"
          @search="
            onSearch('GET_LOCATION_DTO', 'BdStockLocation', Url.GET_PAGE_STOCK_LOCATION_LIST, [
              'locationId',
              'locationName',
            ])
          "
          @clear="onClear(['locationId', 'locationName'])"
        />
      </div>
      <div>
        <a-button class="button" type="primary" @click="searchEvent">查询</a-button>
        <a-button class="button" @click="resetEvent">重置/刷新</a-button>
        <a-button
          class="button"
          style="background-color: #2f4056; color: #fff"
          v-show="props.showMoreSearch"
          @click="moreSearchEvent"
          >高级查询</a-button
        >
      </div>
    </div>
  </div>
  <BasicSearch
    @basicClickEvent="basicClickEvent"
    :gridOptions="basicGridOptions"
    ref="basicSearchRef"
    :control="basicControl"
    :tableCols="basicTableCols"
    :tableName="basicTableName"
  />
  <hr />
  <!--    高级查询弹框     -->

  <MoreSearch
    :tableName="props.tableName"
    ref="moreSearchRef"
    @searchEvent="searchEvent"
    :control="props.control"
  />
</template>
<script lang="ts" setup>
  import { Button } from 'ant-design-vue';
  import { ExInput } from '/@/components/ExInput';
  import { MoreSearch } from '/@/components/AMoreSearch';
  import { BasicSearch } from '/@/components/AMoreSearch';
  import { reactive, ref, UnwrapRef } from 'vue';
  import {
    SearchDataType,
    SearchLink,
    SearchMatchType,
    SearchParams,
    ControlSet,
    Url,
    TableColum,
  } from '/@/api/apiLink';
  import { getPublicList } from '/@/api/public';
  import { VxeGridPropTypes } from 'vxe-table/types/all';
  import { basicGridOptions } from '/@/components/AMoreSearch/data';
  const AButton = Button;
  //高级查询组件ref
  const moreSearchRef: any = ref(null);
  //基础信息查询组件ref
  const basicSearchRef: any = ref<any>(undefined);
  const basicControl = ref<ControlSet[]>(); //下拉框
  const basicTableCols = ref<VxeGridPropTypes.Columns[]>([]); //表头
  let basicTableName = ref<string>(''); //需要查询的表名
  interface ProType {
    tableName: string;
    showMoreSearch?: boolean;
    searchMatID?: string;
    searchStockId?: string;
    searchCompartmentId?: string;
    searchLocationId?: string;
    control?: ControlSet[];
  }
  const props = withDefaults(defineProps<ProType>(), {
    tableName: '',
    showMoreSearch: true,
    control: () => {
      return [];
    },
  });
  interface FormState {
    matName: string;
    stockName: string;
    compartmentName: string;
    locationName: string;
    matId: string;
    stockId: string;
    compartmentId: string;
    locationId: string;
    tableName: string;
  }

  const formState: UnwrapRef<FormState> = reactive({
    matName: '',
    stockName: '',
    compartmentName: '',
    locationName: '',
    tableName: props.tableName,
  });
  type Emits = {
    (event: 'getList', keywords?: object, selected?): void;
    (event: 'resetEvent'): void;
  };
  //点击清空图标清空事件
  const onClear = (key: string[]) => {
    key.forEach((e) => {
      formState[e] = null;
    });
  };
  // 负责人弹框选放大镜事件
  let currDataParam: string[] = []; //约定数组下标0为数据ID，1为数据包
  /**
   * 弹窗
   * @param dtoUrlConfig  获取负责人查询链接属性
   * @param tableName  指向的表名根据DTO链接可以查询到
   * @param tableUrl  表格列表数据链接
   * @param dataParam 当前选中的数据包
   */
  const onSearch: any = async (
    dtoUrlConfig: string,
    tableName: string,
    tableUrl: string,
    dataParam: string[],
  ) => {
    currDataParam = dataParam;
    const res = await getPublicList({ params: [] }, Url[dtoUrlConfig]);
    basicControl.value = res;
    basicTableCols.value = TableColum[dtoUrlConfig];
    basicTableName.value = tableName;
    basicSearchRef.value.init(tableUrl);
  };
  //双击单元格选择事件——获取双击所选的值并赋值到对应字段
  const basicClickEvent = async (row) => {
    basicSearchRef.value.close();
    formState[currDataParam[0]] = row.id;
    formState[currDataParam[1]] = row.name;
  };
  const emit = defineEmits<Emits>();
  const getSearchParams = (): SearchParams[] => {
    let searchParams: SearchParams[] = [];
    if (formState.matName) {
      searchParams.push({
        table: formState.tableName,
        name: 'matId',
        column: 'mat_id',
        link: SearchLink.AND,
        rule: SearchMatchType.LIKE,
        type: SearchDataType.string,
        val: formState.matId,
        startWith: '',
        endWith: '',
      });
    }
    if (formState.stockName) {
      searchParams.push({
        table: formState.tableName,
        name: 'stockId',
        column: 'stock_id',
        link: SearchLink.AND,
        rule: SearchMatchType.LIKE,
        type: SearchDataType.string,
        val: formState.stockId,
        startWith: '',
        endWith: '',
      });
    }
    if (formState.compartmentName) {
      searchParams.push({
        table: formState.tableName,
        name: 'compartmentId',
        column: 'compartment_id',
        link: SearchLink.AND,
        rule: SearchMatchType.LIKE,
        type: SearchDataType.string,
        val: formState.compartmentId,
        startWith: '',
        endWith: '',
      });
    }
    if (formState.locationName) {
      searchParams.push({
        table: formState.tableName,
        name: 'locationId',
        column: 'location_id',
        link: SearchLink.AND,
        rule: SearchMatchType.LIKE,
        type: SearchDataType.string,
        val: formState.locationId,
        startWith: '',
        endWith: '',
      });
    }
    if (moreSearchRef.value.getSearchParams() && moreSearchRef.value.getSearchParams().length > 0) {
      searchParams = searchParams.concat(moreSearchRef.value.getSearchParams());
    }
    return searchParams;
  };
  //查询功能
  const searchEvent = () => {
    emit('getList');
  };
  // 高级查询打开
  const moreSearchEvent = () => {
    moreSearchRef.value.show();
  };
  // 高级查询关闭
  const moreSearchClose = () => {
    moreSearchRef.value.close();
  };
  //重置
  const resetEvent = () => {
    emit('resetEvent');
    if (moreSearchRef.value) {
      moreSearchRef.value.resetEvent();
    }
  };
  defineExpose({ moreSearchClose, formState, getSearchParams });
</script>

<style scoped lang="less">
  .search {
    display: flex;
    height: 75px;
    padding: 10px;
    div {
      display: flex;
      align-items: center;
      span {
        white-space: nowrap;
      }
    }
  }
  .input {
    width: 200px;
    margin: 10px 10px;
  }
  .button {
    margin: 10px 10px;
  }
</style>
