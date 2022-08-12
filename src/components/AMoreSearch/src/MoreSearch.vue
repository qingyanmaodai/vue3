<template>
  <div>
    <a-modal
      style="top: 20px"
      title="高级查询"
      close-on-click-modal="false"
      center="true"
      v-model:visible="moreSearchDialog"
      width="65%"
      :footer="null"
      @cancel="handleClose"
    >
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
              :options="optionsTimeRule"
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
              :options="optionsRule"
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
              <a-select-option value="A">创建</a-select-option>
              <a-select-option value="B">已审核</a-select-option>
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
              placeholder="并且"
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
        ><br /><hr />
        <a-form-item>
          <span style="display: flex; float: right">
            <a-button class="x-button" @click="resetEvent">重置</a-button>
            <a-button type="primary" class="x-button" @click="handleCel">取消</a-button>
            <a-button type="primary" class="x-button" @click="moreSearch">查询</a-button>
          </span>
        </a-form-item>
      </a-form>
    </a-modal>
    <BasicSearch
      style="top: 20px"
      @openSearch="openSearch"
      @cellClickEvent="cellClickEvent"
      :gridOptions="unitGridOptions"
      title="基础信息查询"
      ref="basicSearchRef"
    />
  </div>
</template>
<script lang="ts" setup>
  import {
    Button,
    DatePicker,
    Form,
    FormItem,
    Input,
    InputSearch,
    Modal,
    Select,
    SelectOption,
    Space,
  } from 'ant-design-vue';
  import { reactive, ref, UnwrapRef } from 'vue';
  import { MinusOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { unitGridOptions, unitColumns } from '/@/components/AMoreSearch/data';
  import BasicSearch from '/@/components/AMoreSearch/src/BasicSearch.vue';
  import dragModal from '/@/utils/dragModal';
  import { cloneDeep } from 'lodash-es';
  import { getPublicList } from '/@/api/matTable';
  import dayjs, { Dayjs } from 'dayjs';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { SearchParams } from '/@/api/apiLink';
  const { createMessage } = useMessage();
  const APlusOutlined = PlusOutlined;
  const AModal = Modal;
  const AForm = Form;
  const AFormItem = FormItem;
  const ASpace = Space;
  const ASelect = Select;
  const AButton = Button;
  const AInput = Input;
  const AInputSearch = InputSearch;
  const ASelectOption = SelectOption;
  const ADatePicker = DatePicker;

  const emit = defineEmits<Emits>();
  //查询
  type Emits = {
    (event: 'moreListEvent'): void;
    (event: 'getTableUnitEvent', keywords: object): void;
    (event: 'getTableUnitListEvent', keywords: object): void;
    (event: 'resetEvent'): void;
  };

  //基础信息组件
  const basicSearchRef: any = ref(null); //基础信息查询组件ref
  //选择框data
  const nowCheckData: any = reactive({ data: {} });
  //高级查询弹框
  const moreSearchDialog = ref(false);
  //查询条件
  const cacheQueryArr: any = reactive({ data: [] });

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

  //查询参数
  let searchKeywords: any = [];
  const getSearchParams = (): SearchParams[] => {
    const searchParams: SearchParams[] = [];
    if (searchKeywords && searchKeywords.length > 0) {
      for (let i = 0; i < searchKeywords.length; i++) {
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
    return searchParams;
  };

  //基本信息公共组件
  const publicEvent = async (keywords) => {
    if (!keywords) {
      keywords = {
        column: 'name',
        endWith: '',
        link: 'AND',
        name: 'name',
        rule: 'LIKE',
        startWith: '',
        table: '',
        type: 'string',
        val: '',
      };
    }
    return await getPublicList(
      {
        params: [keywords],
      },
      //选择分类的接口地址，如基本单位。。
      selectOption.data.requestUrl,
    );
  };

  interface Search {
    startWith: string | undefined;
    endWith: string | undefined;
    fieldName: string | undefined;
    rule: string | undefined;
    date?: Dayjs;
    val: string | undefined;
    labelValue: string | undefined;
    link: string | undefined;
    type: string | undefined;
    key: number;
    name: string | undefined;
    column: string | undefined;
    checkData: string[] | undefined;
  }
  const formRef = ref<any>(undefined);
  const dynamicValidateForm: UnwrapRef<{ searches: Search[] }> = reactive({
    searches: [
      {
        startWith: undefined,
        endWith: undefined,
        fieldName: '请选择',
        rule: 'LIKE',
        date: undefined,
        checkData: undefined,
        val: '',
        labelValue: '',
        link: 'AND',
        type: 'string',
        key: Date.now(),
        name: undefined,
        column: undefined,
      },
    ],
  });

  //判断输入框controlType类型，改变后面输入框的类型
  const selectOption: any = reactive({ data: {} });
  const handleChange = (value: string) => {
    selectOption.data = JSON.parse(value);
  };
  //判断输入框controlType类型，改变rule的默认值
  const selectOne = (data: any) => {
    data.val = '';
    if (data.labelValue || data.date) {

      data.labelValue = '';
      data.date = '';
    }
  };

  //基础信息弹框
  const onSearch = async (data) => {
    nowCheckData.data = data;
    const res = await publicEvent(data);
    basicSearchRef.value.initList(res);
    basicSearchRef.value.initCols(unitColumns);
    basicSearchRef.value.bSearch(true);
  };
  //打开基本信息弹框
  const openSearch = async (keywords) => {
    const res = await publicEvent(keywords);
    basicSearchRef.value.initList(res);
  };
  //基本信息表格双击事件
  const cellClickEvent = (row) => {
    nowCheckData.data.val = row.id;
    nowCheckData.data.labelValue = row.name;
    basicSearchRef.value.bSearch(false);
  };
  const optionsFieldName = reactive<any>({ data: [] });
  const optionsRule = reactive<any>([
    { value: 'LIKE', label: '包含' },
    { value: 'EQ', label: '等于' },
    { value: 'GE', label: '大于等于' },
    { value: 'LE', label: '小于等于' },
    { value: 'NE', label: '不等于' },
    { value: 'GT', label: '大于' },
    { value: 'LT', label: '小于' },
  ]);
  const optionsTimeRule = reactive<any>([
    { value: 'LIKE', label: '等于' },
    { value: 'EQ', label: '等于' },
    { value: 'GE', label: '大于等于' },
    { value: 'LE', label: '小于等于' },
    { value: 'NE', label: '不等于' },
    { value: 'GT', label: '大于' },
    { value: 'LT', label: '小于' },
  ]);
  // const optionsStartWith = reactive<any>([{ value: 'start', label: '(' }]);
  // const optionsEndWith = reactive<any>([{ value: 'end', label: ')' }]);
  const optionsLink = reactive<any>([
    { value: 'AND', label: '并且' },
    { value: 'OR', label: '或者' },
  ]);
  const filterOption = (input: string) => {
    return optionsFieldName.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };
  const init = (data) => {
    optionsFieldName.data = cloneDeep(data);
  };

  //打开高级查询弹框事件
  const mSearch = (data: boolean) => {
    moreSearchDialog.value = data;
    if (cacheQueryArr.data.length > 0) {
      dynamicValidateForm.searches = cloneDeep(cacheQueryArr.data);
    }
    setTimeout(() => {
      dragModal();
    }, 1000);
  };

  //基本单位字段
  const getTableUnitEvent = (data) => {
    basicSearchRef.value.getListUnitEvent(data);
  };

  //查询按钮
  const moreSearch = () => {
    dynamicValidateForm.searches.map((r) => {
      if (r.date) {
        //获取的时间格式转换
        r.val = dayjs(dayjs(r.date).valueOf()).format('YYYY-MM-DD');
      }
    });
    cacheQueryArr.data = cloneDeep(dynamicValidateForm.searches);
    searchKeywords = dynamicValidateForm.searches;
    if (searchKeywords.length > 0) {
      for (let i = 0; i < searchKeywords.length; i++) {
        if (searchKeywords[i].fieldName === '请选择') {
          createMessage.error('查询条件缺失，请选择查询条件');
          return;
        }
      }
    }
    emit('moreListEvent');
  };

  //重置方法
  const resetEvent = () => {
    formRef.value.resetFields();
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
    // cacheQueryArr.data = cloneDeep(dynamicValidateForm.searches);
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
      rule: 'LIKE',
      val: '',
      date: undefined,
      checkData: undefined,
      endWith: undefined,
      link: 'AND',
      labelValue: '',
      type: 'string',
      key: Date.now(),
      name: undefined,
      column: undefined,
    });
  };
  //将moreSearch这个方法暴露出去，传给父组件
  defineExpose({
    mSearch,
    init,
    handleClose,
    getTableUnitEvent,
    publicEvent,
    resetEvent,
    formState,
    getSearchParams,
  });
</script>
<style scoped>
  .x-button {
    margin: 10px 5px 0 5px;
  }
</style>
