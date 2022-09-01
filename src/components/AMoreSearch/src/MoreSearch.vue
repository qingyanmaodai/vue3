<template>
  <vxe-modal
    v-model="moreSearchDialog"
    id="moreSearchModal"
    show-zoom
    resize
    :position="{ top: 40 }"
    width="50%"
    @close="handleClose"
  >
    <div class="form-style">
      <a-form ref="formRef" name="dynamic_form_nest_item" :model="dynamicValidateForm">
        <a-space
          v-for="(search, index) in dynamicValidateForm.searches"
          :key="search.key"
          style="display: flex; margin: 5px 10px"
        >
          <!--          <a-form-item style="margin: 5px 5px" :name="['searches', index, 'startWith']">-->
          <!--            <a-select-->
          <!--              allowClear-->
          <!--              v-model:value="search.startWith"-->
          <!--              placeholder="括号"-->
          <!--              :options="optionsStartWith"-->
          <!--              style="width: 70px"-->
          <!--              :filterOption="filterOption"-->
          <!--            />-->
          <!--          </a-form-item>-->
          <a-form-item style="margin: 5px 5px" :name="['searches' + '', index, 'fieldName']">
            <a-select
              v-model:value="search.fieldName"
              onfocus="this.blur();"
              show-search
              placeholder="请输入或选择关键字"
              style="width: 200px"
              :filterOption="filterOption"
              @change="handleChange"
              @select="selectOne(search)"
            >
              <a-select-option
                v-for="(item, v) in optionsFieldName.data"
                :value="JSON.stringify(item)"
                :label="item.displayName"
                :key="v"
                >{{ item.displayName }}</a-select-option
              >
            </a-select>
          </a-form-item>
          <a-form-item style="margin: 5px 5px" :name="['searches', index, 'rule']">
            <a-select
              v-show="
                search.fieldName !== '请选择'
                  ? JSON.parse(search.fieldName).controlType === 'date'
                  : false
              "
              v-model:value="search.rule"
              placeholder="等于"
              :options="config.TIME_OPTION_RULE"
              style="width: 100px"
              :filterOption="filterOption"
            />
            <a-select
              v-show="
                search.fieldName !== '请选择'
                  ? JSON.parse(search.fieldName).controlType !== 'date'
                  : true
              "
              v-model:value="search.rule"
              placeholder="包含"
              :options="config.OPTION_RULE"
              style="width: 100px"
              :filterOption="filterOption"
            />
          </a-form-item>
          <a-form-item
            style="margin: 5px 5px"
            :name="['searches', index, 'val']"
            v-model:value="search.val"
          >
            <a-input v-show="search.fieldName === '请选择'" style="width: 200px" disabled />
            <a-select
              v-show="
                search.fieldName !== '请选择'
                  ? JSON.parse(search.fieldName).controlType === 'select'
                  : false
              "
              v-model:value="search.val"
              placeholder="请选择..."
              style="width: 200px"
              :filterOption="filterOption"
            >
              <a-select-option
                v-for="(item, optionIndex) in config[selectConfigOption(search.fieldName)]"
                :key="optionIndex"
                :value="item.value"
                >{{ item.label }}</a-select-option
              >
            </a-select>
            <a-input
              v-show="
                search.fieldName !== '请选择'
                  ? JSON.parse(search.fieldName).controlType === 'input'
                  : false
              "
              style="width: 200px"
              placeholder="请输入..."
              v-model:value="search.val"
              :filterOption="filterOption"
            />
            <a-input-search
              v-show="
                search.fieldName !== '请选择'
                  ? JSON.parse(search.fieldName).controlType === 'inputSearch'
                  : false
              "
              style="width: 200px"
              onfocus="this.blur();"
              placeholder="请选择输入..."
              v-model:value="search.labelValue"
              :filterOption="filterOption"
              @click="onSearch(search)"
              @search="onSearch(search)"
            />
            <a-space
              direction="vertical"
              :size="12"
              v-show="
                search.fieldName !== '请选择'
                  ? JSON.parse(search.fieldName).controlType === 'date'
                  : false
              "
            >
              <a-date-picker
                style="width: 200px"
                v-model:value="search.date"
                placeholder="请选择时间..."
              />
            </a-space>
            <a-select
              v-show="
                search.fieldName !== '请选择'
                  ? JSON.parse(search.fieldName).controlType === 'checkBox'
                  : false
              "
              mode="multiple"
              showSearch
              style="width: 200px"
              :showArrow="true"
              v-model:value="search.checkData"
              :filterOption="filterOption"
              placeholder="请选择...多选。。"
            />
            <a-tree-select
              v-if="
                search.fieldName !== '请选择'
                  ? JSON.parse(search.fieldName).controlType === 'treeSelect'
                  : false
              "
              v-model:value="search.val"
              show-search
              treeNodeFilterProp="title"
              :replaceFields="{ label: 'name', value: 'id', key: 'id' }"
              style="width: 200px"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              placeholder="请选择"
              allow-clear
              tree-default-expand-all
              :tree-data="search.treeData"
            />
          </a-form-item>

          <!--          <a-form-item style="margin: 5px 5px" :name="['searches', index, 'endWith']">-->
          <!--            <a-select-->
          <!--              allowClear-->
          <!--              v-model:value="search.endWith"-->
          <!--              placeholder="括号"-->
          <!--              :options="optionsEndWith"-->
          <!--              style="width: 70px"-->
          <!--              :filterOption="filterOption"-->
          <!--            />-->
          <!--          </a-form-item>-->
          <a-form-item style="margin: 5px 5px" :name="['searches', index, 'link']">
            <a-select
              v-model:value="search.link"
              :options="optionsLink"
              style="width: 70px"
              :filterOption="filterOption"
            />
          </a-form-item>
          <a-button
            style="font-size: 14px; font-weight: bolder; padding: 2px 8px; line-height: 0"
            @click="addSearch"
            ><a-plus-outlined
          /></a-button>
          <a-button
            style="font-size: 14px; font-weight: bolder; padding: 2px 8px; line-height: 0"
            v-if="dynamicValidateForm.searches.length > 1"
            :disabled="dynamicValidateForm.searches.length === 1"
            @click="removeSearch(index)"
            ><MinusOutlined
          /></a-button> </a-space
        ><br />
      </a-form>
    </div>
    <template #title>
      <span>高级查询</span>
    </template>
    <span style="display: flex; float: right">
      <a-button class="x-button" @click="resetEvent">重置</a-button>
      <a-button type="primary" class="x-button" @click="handleCel">取消</a-button>
      <a-button type="primary" class="x-button" @click="moreSearch">查询</a-button>
    </span>
  </vxe-modal>
  <!--  基础信息查询-->
  <BasicSearch
    @openSearch="openSearch"
    @basicClickEvent="basicClickEvent"
    :gridOptions="basicGridOptions"
    ref="basicSearchRef"
  />
</template>
<script lang="ts" setup>
  import {
    Button,
    DatePicker,
    Form,
    FormItem,
    Input,
    InputSearch,
    Select,
    SelectOption,
    Space,
    TreeSelect,
  } from 'ant-design-vue';
  import { reactive, ref, UnwrapRef } from 'vue';
  import { MinusOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { basicGridOptions } from '/@/components/AMoreSearch/data';
  import { BasicSearch } from '/@/components/AMoreSearch';
  import { cloneDeep } from 'lodash-es';
  import { getPublicList } from '/@/api/public';
  import dayjs, { Dayjs } from 'dayjs';
  import {
    SearchParams,
    Url,
    TableColum,
    SearchLink,
    SearchMatchType,
    SearchDataType,
  } from '/@/api/apiLink';
  import { config } from '/@/utils/publicParamConfig';
  const APlusOutlined = PlusOutlined;
  const AForm = Form;
  const AFormItem = FormItem;
  const ASpace = Space;
  const ASelect = Select;
  const AButton = Button;
  const AInput = Input;
  const AInputSearch = InputSearch;
  const ASelectOption = SelectOption;
  const ADatePicker = DatePicker;
  const ATreeSelect = TreeSelect;

  const emit = defineEmits<Emits>();
  type Emits = {
    (event: 'moreListEvent'): void; //查询
    (event: 'resetEvent'): void; //重置
  };
  const formRef = ref<any>(null);
  //基础信息查询组件ref
  const basicSearchRef: any = ref(null); //
  //选择框data
  const nowCheckData: any = reactive({ data: {} });
  //高级查询弹框
  const moreSearchDialog = ref(false);
  //查询条件
  const cacheQueryArr: any = reactive({ data: [] });
  //判断输入框controlType类型，改变后面输入框的类型
  const selectOption: any = reactive({ data: {} });
  //选择字段数据
  const optionsFieldName = reactive<any>({ data: [] });
  const props = defineProps({
    tableName: {
      type: String,
      default: '',
    },
  });
  interface FormState {
    fieldName: string;
    labelValue: string;
    tableName: string;
    date?: string;
    checkData?: string[];
  }
  const formState: UnwrapRef<FormState> = reactive({
    fieldName: '',
    labelValue: '',
    tableName: props.tableName,
  });

  //查询按钮--查询参数
  let searchKeywords: any = [];
  const getSearchParams = (): SearchParams[] => {
    const searchParams: SearchParams[] = [];
    if (searchKeywords && searchKeywords.length > 0) {
      for (let i = 0; i < searchKeywords.length; i++) {
        if (searchKeywords[i].fieldName !== '请选择') {
          searchParams.push({
            table: formState.tableName,
            name: JSON.parse(searchKeywords[i].fieldName).propName,
            column: JSON.parse(searchKeywords[i].fieldName).fieldName,
            link: searchKeywords[i].link,
            rule: searchKeywords[i].rule,
            type: searchKeywords[i].string,
            date: dayjs(dayjs(searchKeywords[i].date).valueOf()).format('YYYY-MM-DD'),
            val: searchKeywords[i].val,
          });
        }
      }
    }
    return searchParams;
  };
  //基本信息公共组件--获取基本信息表格信息
  const publicEvent = async (keywords) => {
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
      selectOption.data.requestUrl,
    );
  };

  //选择公共属性
  const selectConfigOption = (data) => {
    if (data !== '' && data !== '请选择') return JSON.parse(data).queryConfig;
  };
  //获取基本信息字段
  const getPublicListOption = async () => {
    try {
      const data: any = await getPublicList(
        {
          params: [],
        },
        Url[selectOption.data.queryConfig],
      );
      let arr = cloneDeep(data);
      arr = arr.filter((e) => e.fieldName != 'bs_status');
      basicSearchRef.value.getListUnitEvent(arr);
    } catch (e) {
      console.log('高级查询获取基本信息字段失败', e);
    }
  };

  interface Search {
    startWith: string | undefined;
    endWith: string | undefined;
    fieldName: string | undefined;
    rule: string | undefined;
    date?: Dayjs;
    treeData?: object[] | undefined;
    val: string | undefined;
    labelValue: string | undefined;
    link: string | undefined;
    type: string | undefined;
    key: number;
    name: string | undefined;
    column: string | undefined;
    checkData: string[] | undefined;
  }
  const dynamicValidateForm: UnwrapRef<{ searches: Search[] }> = reactive({
    searches: [
      {
        startWith: undefined,
        endWith: undefined,
        fieldName: '请选择',
        date: undefined,
        treeData: undefined,
        checkData: undefined,
        val: '',
        labelValue: '',
        link: SearchLink.AND,
        rule: SearchMatchType.LIKE,
        type: SearchDataType.string,
        key: Date.now(),
        name: undefined,
        column: undefined,
      },
    ],
  });
  //改变选择的字段数据
  const handleChange = (value: string) => {
    selectOption.data = JSON.parse(value);
  };
  //判断输入框controlType类型，改变rule的默认值
  const selectOne = async (data: any) => {
    data.val = '';
    data.rule = 'LIKE';
    if (data.labelValue || data.date) {
      data.labelValue = '';
      data.date = '';
    }
    if (selectOption.data.controlType && selectOption.data.controlType === 'treeSelect') {
      const res = await getPublicList(
        {
          params: 0,
        },
        //选择分类的接口地址，如基本单位。。
        selectOption.data.requestUrl,
      );
      data.val = undefined;
      data.treeData = cloneDeep(res);
    }
  };
  //基础信息弹框--打开放大镜
  const onSearch = async (data) => {
    nowCheckData.data = data; //输入框的值
    const res = await publicEvent(data); //获取数据
    basicSearchRef.value.initList(res); //表格数据
    basicSearchRef.value.initCols(TableColum[selectOption.data.queryConfig]); //表头
    basicSearchRef.value.bSearch(true); //打开弹框
    await getPublicListOption();
  };
  //打开基本信息弹框
  const openSearch = async (keywords) => {
    const res = await publicEvent(keywords);
    basicSearchRef.value.initList(res);
  };
  //基本信息表格双击事件
  const basicClickEvent = (row) => {
    nowCheckData.data.val = row.id;
    nowCheckData.data.labelValue = row.name;
    basicSearchRef.value.bSearch(false);
  };

  // const optionsStartWith = reactive<any>([{ value: 'start', label: '(' }]);
  // const optionsEndWith = reactive<any>([{ value: 'end', label: ')' }]);
  const optionsLink = reactive<any>([
    { value: 'AND', label: '并且' },
    { value: 'OR', label: '或者' },
  ]);
  const filterOption = (input: string) => {
    return optionsFieldName.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  //选择字段数据
  const initOptions = (data) => {
    optionsFieldName.data = cloneDeep(data);
  };
  //打开高级查询弹框事件
  const mSearch = (data: boolean) => {
    moreSearchDialog.value = data;
    if (cacheQueryArr.data.length > 0) {
      dynamicValidateForm.searches = cloneDeep(cacheQueryArr.data);
    }
  };

  //查询按钮
  const moreSearch = () => {
    dynamicValidateForm.searches.map((r) => {
      if (r.date) {
        //获取的时间格式转换
        r.val = dayjs(dayjs(r.date).valueOf()).format('YYYY-MM-DD');
      }
    });
    //保留查询条件
    cacheQueryArr.data = cloneDeep(dynamicValidateForm.searches);
    searchKeywords = dynamicValidateForm.searches;
    // if (searchKeywords.length > 0) {
    //   for (let i = 0; i < searchKeywords.length; i++) {
    //     if (searchKeywords[i].fieldName === '请选择') {
    //       createMessage.error('查询条件缺失，请选择查询条件');
    //       return;
    //     }
    //   }
    // }
    emit('moreListEvent');
  };

  //重置方法
  const resetEvent = () => {
    if (formRef.value) {
      formRef.value.resetFields();
    }
    searchKeywords = [];
    cacheQueryArr.data = [];
    dynamicValidateForm.searches.length = 1;
  };

  //取消查询
  const handleCel = () => {
    moreSearchDialog.value = false;
  };
  //关闭查询弹框--X
  const handleClose = () => {
    moreSearchDialog.value = false;
  };
  //单行条件移除
  const removeSearch = (i) => {
    dynamicValidateForm.searches[i].val = '';
    dynamicValidateForm.searches.splice(i, 1);
  };
  //新增行
  const addSearch = () => {
    dynamicValidateForm.searches.push({
      startWith: undefined,
      fieldName: '请选择',
      val: '',
      date: undefined,
      checkData: undefined,
      endWith: undefined,
      link: SearchLink.AND,
      rule: SearchMatchType.LIKE,
      type: SearchDataType.string,
      labelValue: '',
      key: Date.now(),
      name: undefined,
      column: undefined,
    });
  };
  //将moreSearch这个方法暴露出去，传给父组件
  defineExpose({
    mSearch,
    initOptions,
    handleClose,
    publicEvent,
    resetEvent,
    formState,
    getSearchParams,
  });
</script>
<style lang="less" scoped>
  .x-button {
    margin: 10px 5px 0 5px;
  }
  .form-style {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
