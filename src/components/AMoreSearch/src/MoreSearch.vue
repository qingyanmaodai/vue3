<template>
  <vxe-modal
    v-model="isShow"
    id="moreSearchModal"
    show-zoom
    resize
    :position="{ top: 40 }"
    width="50%"
    @close="close"
  >
    <div class="form-style">
      <Row class="row" :key="i + 'row'" v-for="(v, i) in formData">
        <a-space>
          <Col>
            <vxe-select
              clearable
              v-model="v.name"
              placeholder="请选择"
              style="width: 200px"
              transfer
              @change="handleChange"
            >
              <vxe-option
                v-for="(v2, i2) in props.control"
                :value="v2.propName"
                :label="v2.displayName"
                :key="i2 + 'col1'"
              />
            </vxe-select>
          </Col>
          <Col>
            <vxe-select v-model="v.rule" :options="v.ruleType" style="width: 100px" transfer />
          </Col>
          <Col>
            <a-input v-show="!v.name" style="width: 200px" disabled />
            <vxe-select
              v-show="v.control.controlType === 'select'"
              v-model="v.val"
              placeholder="请选择..."
              style="width: 200px"
              transfer
            >
              <vxe-option
                v-for="(item, optionIndex) in config[v.control.queryConfig]"
                :key="optionIndex"
                :value="item.value"
                :label="item.label"
              />
            </vxe-select>
            <a-input
              v-show="v.control.controlType === 'input'"
              style="width: 200px"
              placeholder="请输入..."
              v-model:value="v.val"
            />
            <a-input-search
              v-show="v.control.controlType === 'inputSearch'"
              style="width: 200px"
              onfocus="this.blur();"
              placeholder="请选择输入..."
              v-model:value="v.valLabel"
              @click="onSearch(v)"
              @search="onSearch(v)"
            />
            <a-space direction="vertical" :size="12" v-show="v.control.controlType === 'date'">
              <a-date-picker
                v-if="v.control.controlType === 'date'"
                style="width: 200px"
                v-model:value="v.val"
                placeholder="请选择时间..."
                valueFormat="YYYY-MM-DD"
              />
            </a-space>
            <a-tree-select
              v-if="v.control.controlType === 'treeSelect'"
              v-model:value="v.val"
              show-search
              treeNodeFilterProp="title"
              :replaceFields="{ label: 'name', value: 'id', key: 'id' }"
              style="width: 200px"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              placeholder="请选择"
              allow-clear
              tree-default-expand-all
              :tree-data="v.treeData"
            />
          </Col>
          <Col>
            <vxe-select v-model="v.link" :options="optionsLink" style="width: 70px" transfer />
          </Col>
          <a-button
            style="font-size: 14px; font-weight: bolder; padding: 2px 8px; line-height: 0"
            @click="addSearch"
            ><a-plus-outlined
          /></a-button>
          <a-button
            style="font-size: 14px; font-weight: bolder; padding: 2px 8px; line-height: 0"
            v-if="formData.length > 1"
            :disabled="formData.length === 1"
            @click="removeSearch(i)"
            ><MinusOutlined
          /></a-button>
        </a-space>
      </Row>
      <br />
    </div>
    <template #title>
      <span>高级查询</span>
    </template>
    <span style="display: flex; float: right">
      <a-button class="x-button" @click="resetEvent">重置</a-button>
      <a-button type="primary" class="x-button" @click="close">取消</a-button>
      <a-button type="primary" class="x-button" @click="moreSearch">查询</a-button>
    </span>
  </vxe-modal>
  <!--  基础信息查询-->
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
  import {
    Button,
    DatePicker,
    // Form,
    // FormItem,
    Input,
    InputSearch,
    // Select,
    // SelectOption,
    Space,
    TreeSelect,
    Row,
    Col,
  } from 'ant-design-vue';
  import { reactive, ref, toRef } from 'vue';
  import { MinusOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { basicGridOptions } from '/@/components/AMoreSearch/data';
  import { BasicSearch } from '/@/components/AMoreSearch';
  import { cloneDeep } from 'lodash-es';
  import { getPublicList } from '/@/api/public';
  import {
    SearchParams,
    Url,
    TableColum,
    SearchLink,
    SearchMatchType,
    SearchDataType,
    ControlSet,
  } from '/@/api/apiLink';
  import { config } from '/@/utils/publicParamConfig';
  import { VxeGridPropTypes, VxeSelectPropTypes } from 'vxe-table/types/all';
  import { TreeItem } from '/@/components/Tree';
  const APlusOutlined = PlusOutlined;
  const ASpace = Space;
  const AButton = Button;
  const AInput = Input;
  const AInputSearch = InputSearch;
  const ADatePicker = DatePicker;
  const ATreeSelect = TreeSelect;

  const emit = defineEmits<Emits>();
  type Emits = {
    (event: 'searchEvent'): void; //查询
  };
  //基础信息查询组件ref
  const basicSearchRef: any = ref(null); //
  //高级查询弹框
  const isShow = ref(false);
  const basicControl = ref<ControlSet[]>();
  const basicTableCols = ref<VxeGridPropTypes.Columns[]>([]);
  const basicTableName = ref<string>('');
  const currParam = ref<Param>();

  interface Param {
    column: string;
    endWith: string;
    link: SearchLink;
    name: string;
    rule: SearchMatchType;
    startWith: string;
    table: string;
    type: SearchDataType;
    val: string | undefined;
    control: ControlSet;
    ruleType?: any;
    valLabel?: string;
    treeData?: TreeItem[];
  }
  interface ProType {
    tableName: string;
    control: ControlSet[];
  }
  const props = withDefaults(defineProps<ProType>(), {
    tableName: '',
    treeData: [],
    control: () => {
      return [];
    },
  });
  const defaultControl: ControlSet = {
    controlType: '',
    displayName: '',
    fieldName: '',
    propName: '',
    queryConfig: '',
    requestUrl: '',
    tableAsName: '',
  };
  const defaultP: Param = {
    startWith: '',
    endWith: '',
    val: '',
    link: SearchLink.AND,
    rule: SearchMatchType.LIKE,
    type: SearchDataType.string,
    name: '',
    column: '',
    table: props.tableName,
    ruleType: cloneDeep(config.OPTION_RULE),
    // control: undefined,
    control: defaultControl,
  };
  const defaultParams: Param[] = [cloneDeep(defaultP)];
  let copyDefaultParams: Param[] = [cloneDeep(defaultP)];

  const formDataInit = reactive({
    data: cloneDeep(defaultParams),
  });
  const formData = toRef(formDataInit, 'data');

  //基础信息弹框--打开放大镜
  const onSearch = async (param: Param) => {
    const control = getControl(param.name);
    basicTableCols.value = TableColum[control.queryConfig];
    //获取查询筛选条件
    const res = await getPublicList({ params: [] }, Url[control.queryConfig]);
    basicControl.value = res as ControlSet[];
    basicTableName.value = control.tableAsName;
    await basicSearchRef.value.init(control.requestUrl);
    currParam.value = param;
  };
  //改变选择的字段数据
  const handleChange = async (value: any) => {
    for (const item of formData.value) {
      item.ruleType = config.OPTION_RULE;
      item.rule = SearchMatchType.LIKE;
      item.valLabel = '';
      if (value.value === item.name) {
        item.control = getControl(value.value);
        item.val = undefined;
        item.treeData = [];
        if (item.control.controlType === 'date') {
          item.ruleType = cloneDeep(config.OPTION_RULE.slice(1));
          item.rule = SearchMatchType.EQ;
        }
        if (item.control.controlType === 'treeSelect') {
          item.treeData = await getPublicList({ params: 0 }, item.control.requestUrl);
        }
      }
    }
  };
  const getControl = (name: string): ControlSet => {
    let res: ControlSet = defaultControl;
    props.control.forEach((item) => {
      if (item.propName === name) {
        res = item;
        return;
      }
    });
    return res;
  };
  //查询按钮--查询参数
  const getSearchParams = (): SearchParams[] => {
    const searchParams: SearchParams[] = [];
    if (formData.value.length > 0) {
      for (let i = 0; i < formData.value.length; i++) {
        const data = formData.value[i];
        if (data.name && data.val) {
          searchParams.push({
            table: props.tableName,
            // table: data.control.tableAsName ? data.control.tableAsName : props.tableName,
            name: data.name,
            column: data.control.fieldName,
            link: data.link,
            rule: data.rule,
            type: SearchDataType.string,
            val: data.val ? data.val : '',
          });
        }
      }
    }
    return searchParams;
  };
  //基本信息表格双击事件
  const basicClickEvent = (row) => {
    currParam.value ? (currParam.value.val = row.id) : currParam.value;
    currParam.value ? (currParam.value.valLabel = row.name) : currParam.value;
    basicSearchRef.value.close();
  };
  const optionsLink = reactive<VxeSelectPropTypes.Options>([
    { value: 'AND', label: '并且' },
    { value: 'OR', label: '或者' },
  ]);

  //查询按钮
  const moreSearch = () => {
    isShow.value = false;
    emit('searchEvent');
    copyDefaultParams = cloneDeep(formData.value);
  };

  //重置方法
  const resetEvent = () => {
    formData.value = cloneDeep(defaultParams);
  };
  //单行条件移除
  const removeSearch = (i) => {
    formData.value.splice(i, 1);
  };
  //新增行
  const addSearch = () => {
    formData.value.push(cloneDeep(defaultP));
  };
  const show = () => {
    isShow.value = true;
  };
  const close = () => {
    formData.value = cloneDeep(copyDefaultParams);
    isShow.value = false;
  };
  defineExpose({
    resetEvent,
    getSearchParams,
    show,
    close,
  });
</script>
<style lang="less" scoped>
  .x-button {
    margin: 10px 5px 0 5px;
  }
  .form-style {
    text-align: center;
    //display: flex;
    //justify-content: center;
    //align-items: center;
  }
  .row {
    display: inherit !important;
    margin-top: 15px;
  }
</style>
