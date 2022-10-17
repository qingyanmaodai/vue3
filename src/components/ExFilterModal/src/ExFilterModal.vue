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
      <div>
        <a-form ref="formRef" :model="formState">
<!--        <a-form>-->
          <Row>
            <Col :span="8">
              <a-form-item label="仓库：" ref="stockId" name="stockId" class="item">
                <ExInput
                  autocomplete="off"
                  class="input"
                  placeholder="请选择"
                  :show="formState.bsStatus !== 'B'"
                  v-model:value="formState.bdStock"
                  :disabled="formState.bsStatus === 'B'"
                  @search="
                    onSearch('GET_STOCK_DTO', 'BdStock', Url.GET_PAGE_STOCK_LIST, [
                      'stockId',
                      'bdStock',
                    ])
                  "
                  @clear="
                    onClear([
                      'stockId',
                      'bdStock',
                      'compartmentId',
                      'bdStockCompartment',
                      'locationId',
                      'bdStockLocation',
                    ])
                  "
                />
              </a-form-item>
            </Col>
            <Col :span="8">
              <a-form-item label="分仓：" ref="compartmentId" name="compartmentId" class="item">
                <ExInput
                  autocomplete="off"
                  class="input"
                  placeholder="请选择"
                  :show="formState.bsStatus !== 'B'"
                  v-model:value="formState.bdStockCompartment"
                  :disabled="formState.bsStatus === 'B'"
                  @search="
                    onSearch(
                      'GET_SUB_STOCK_DTO',
                      'BdStockCompartment',
                      Url.GET_PAGE_STOCK_COMPARTMENT_LIST,
                      ['compartmentId', 'bdStockCompartment'],
                    )
                  "
                  @clear="
                    onClear([
                      'compartmentId',
                      'bdStockCompartment',
                      'locationId',
                      'bdStockLocation',
                    ])
                  "
                />
              </a-form-item>
            </Col>
            <Col :span="8">
              <a-form-item label="仓位：" ref="locationId" name="locationId" class="item">
                <ExInput
                  autocomplete="off"
                  class="input"
                  placeholder="请选择"
                  :show="formState.bsStatus !== 'B'"
                  v-model:value="formState.bdStockLocation"
                  :disabled="formState.bsStatus === 'B'"
                  @search="
                    onSearch(
                      'GET_LOCATION_DTO',
                      'BdStockLocation',
                      Url.GET_PAGE_STOCK_LOCATION_LIST,
                      ['locationId', 'bdStockLocation'],
                    )
                  "
                  @clear="onClear(['locationId', 'bdStockLocation'])"
                />
              </a-form-item>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
              <a-form-item label="物料：" ref="matId" name="matId" class="item">
                <ExInput
                  autocomplete="off"
                  class="input"
                  placeholder="请选择"
                  :show="formState.bsStatus !== 'B'"
                  v-model:value="formState.bdMaterial"
                  :disabled="formState.bsStatus === 'B'"
                  @search="
                    onSearch('GET_MAT_DTO', 'BdMaterial', Url.GET_MATERIAL_LIST, [
                      'matId',
                      'bdMaterial',
                    ])
                  "
                  @clear="onClear(['matId', 'bdMaterial'])"
                />
              </a-form-item>
            </Col>
          </Row>
        </a-form>
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
  import { Button, Col, Form, FormItem, Row } from 'ant-design-vue';
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
  import { StockEntity } from '/@/api/mainStock';
  import { StockLocationEntity } from '/@/api/stockLocation';
  import { StockCompartmentEntity } from '/@/api/stockCompartment';
  import { MatEntity } from '/@/api/matTable';
  import { cloneDeep } from 'lodash-es';
  const AButton = Button;
  const AForm = Form;
  const AFormItem = FormItem;

  const isShow = ref(false);
  //基础信息查询组件ref
  const basicSearchRef: any = ref<any>(undefined);
  const basicControl = ref<ControlSet[]>(); //下拉框
  const basicTableCols = ref<VxeGridPropTypes.Columns[]>([]); //表头
  let basicTableName = ref<string>(''); //需要查询的表名

  interface ProType {
    tableName: string;
  }
  const props = withDefaults(defineProps<ProType>(), {
    tableName: '',
  });
  interface FormState {
    bsStatus?: string;
    matId?: string;
    bdMaterial?: MatEntity;
    stockId?: string;
    bdStock?: StockEntity;
    compartmentId?: string;
    bdStockCompartment?: StockCompartmentEntity;
    locationId?: string;
    bdStockLocation?: StockLocationEntity;
  }
  const defaultF: FormState = {
    matId: undefined,
    bdMaterial: undefined,
    stockId: undefined,
    bdStock: undefined,
    compartmentId: undefined,
    bdStockCompartment: undefined,
    locationId: undefined,
    bdStockLocation: undefined,
  };
  const defaultData: FormState = cloneDeep(defaultF);
  let copyDefaultData: FormState = cloneDeep(defaultF);

  const formStateInit = reactive({
    data: cloneDeep(defaultData),
  });
  const formState = toRef(formStateInit, 'data');
  const getSearchParams = (): SearchParams[] => {
    let searchParams: SearchParams[] = [];
    if (formState.value.matId) {
      searchParams.push({
        table: props.tableName,
        name: 'number',
        column: 'number',
        link: SearchLink.AND,
        rule: SearchMatchType.LIKE,
        type: SearchDataType.string,
        val: formState.value.matId,
        startWith: '',
        endWith: '',
      });
    }
    return searchParams;
  };
  //点击清空图标清空事件
  const onClear = (key: string[]) => {
    key.forEach((e) => {
      formState.value[e] = undefined;
    });
  };

  let currDataParam: string[] = []; //约定数组下标0为数据ID，1为数据包
  /**
   * 基础资料弹窗
   * @param dtoUrlConfig  获取基础资料查询链接属性
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
    let filterParams: SearchParams[] = [];
    if (tableName === 'BdStockCompartment') {
      if (formState.value.stockId) {
        filterParams = [
          {
            table: 'BdStockCompartment',
            name: 'stockId',
            column: 'stock_id',
            link: SearchLink.AND,
            rule: SearchMatchType.EQ,
            type: SearchDataType.string,
            val: formState.value.stockId,
          },
        ];
      }
    }
    if (tableName === 'BdStockLocation') {
      if (formState.value.compartmentId) {
        filterParams = [
          {
            table: 'BdStockLocation',
            name: 'compartmentId',
            column: 'compartment_id',
            link: SearchLink.AND,
            rule: SearchMatchType.EQ,
            type: SearchDataType.string,
            val: formState.value.compartmentId,
          },
        ];
      }
    }
    basicSearchRef.value.setFilter(filterParams);
    basicSearchRef.value.init(tableUrl);
  };

  //双击单元格选择事件——获取双击所选的值并赋值到对应字段
  const basicClickEvent = async (row) => {
    basicSearchRef.value.close();
    formState.value[currDataParam[0]] = row.id;
    formState.value[currDataParam[1]] = {};
    formState.value[currDataParam[1]].id = row.id;
    formState.value[currDataParam[1]].name = row.name;
    if (row.stockId) {
      formState.value.bdStock = row.bdStock;
      formState.value.stockId = row.stockId;
    }
    if (row.compartmentId) {
      formState.value.bdStockCompartment = row.bdStockCompartment;
      formState.value.compartmentId = row.compartmentId;
    }
    if (row.locationId) {
      formState.value.bdStockLocation = row.bdStockLocation;
      formState.value.locationId = row.locationId;
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
    copyDefaultData = cloneDeep(formState.value);
    console.log('copyDefaultData', copyDefaultData);
  };

  //重置方法
  const resetEvent = () => {
    formState.value = cloneDeep(defaultData);
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
</style>
