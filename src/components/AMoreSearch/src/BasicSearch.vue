<template>
  <div>
    <vxe-modal
      v-model="basicSearchDialog"
      show-zoom
      resize
      :position="{ top: 40 }"
      width="55%"
      @close="handleClose"
    >
      <a-form ref="formRef" name="dynamic_form_nest_item" :model="dynamicValidateForm">
        <div>
          <a-space
            v-for="(search, index) in dynamicValidateForm.searches"
            :key="search.key"
            style="display: flex; margin: 10px 10px"
          >
            <span style="font-weight: bolder">查询条件</span>
            <a-form-item style="margin: 5px 5px" :name="['searches', index, 'fieldName']">
              <a-select
                v-model:value="search.fieldName"
                show-search
                placeholder="请输入或选择关键字"
                style="width: 200px"
                :filterOption="filterOption"
                @change="handleChange"
                @select="selectOne(search)"
              >
                <a-select-option
                  v-for="(item, v) in optionsUnitFieldName.data"
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
            <a-form-item style="margin: 5px 5px" :name="['searches', index, 'val']">
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
              <a-tree-select
                v-if="
                  search.fieldName !== '请选择'
                    ? JSON.parse(search.fieldName).controlType === 'treeSelect'
                    : false
                "
                v-model:value="search.val"
                show-search
                :replaceFields="{ label: 'name', value: 'id', key: 'id' }"
                style="width: 200px"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择"
                allow-clear
                tree-default-expand-all
                :tree-data="search.treeData"
              />
            </a-form-item>
            <span style="margin-left: 10px">
              <a-button type="primary" class="x-button" @click="resetSearch">重置</a-button>
              <a-button type="primary" class="x-button" @click="basicSearchEvent">查询</a-button>
            </span>
          </a-space>
        </div>
        <!--          table表单                  -->
        <a-form-item style="margin: 16px">
          <vxe-grid
            ref="xGrid"
            v-bind="props.gridOptions"
            :data="tableData"
            :columns="tableCols"
            :export-config="{}"
            @cell-dblclick="cellClickEvent"
          >
            <template #status="{ row }">
              <Tag :color="row.bsStatus === 'B' ? 'processing' : 'default'" v-if="row.bsStatus">{{
                formatData(row.bsStatus, config['DATA_STATUS'])
              }}</Tag>
            </template>
            <template #bsType="{ row }">
              <Tag v-if="row.bsType">{{ formatData(row.bsType, config['UNIT_TYPE']) }}</Tag>
            </template>
            <template #attr="{ row }">
              <Tag v-if="row.attr">{{ formatData(row.attr, config['MATERIAL_ATTR']) }}</Tag>
            </template>
          </vxe-grid>
        </a-form-item>
        <Pager
          v-model:current-page="pages.currentPage"
          v-model:page-size="pages.pageSize"
          :total="pages.total"
          :layouts="[
            'PrevJump',
            'PrevPage',
            'JumpNumber',
            'NextPage',
            'NextJump',
            'Sizes',
            'FullJump',
            'Total',
          ]"
          @page-change="handlePageChange"
        />
      </a-form>
      <template #title>
        <span>基础信息查询</span>
      </template>
    </vxe-modal>
  </div>
  <!--  基础信息查询-->
  <BasicSearch
    v-if="isShowModel"
    @openSearch="openSearch"
    @basicClickEvent="basicClickEvent"
    :gridOptions="basicGridOptions"
    ref="childBasicSearchRef"
  />
</template>
<script lang="ts" setup>
  import {
    Select,
    SelectOption,
    Button,
    Form,
    Input,
    FormItem,
    DatePicker,
    Space,
    InputSearch,
    Tag,
    TreeSelect,
  } from 'ant-design-vue';
  import { reactive, ref } from 'vue';
  import { VxeGridEvents, VxeGridInstance, Pager } from 'vxe-table';
  import { config, configEntity } from '/@/utils/publicParamConfig';
  import { useMessage } from '/@/hooks/web/useMessage';
  import dayjs, { Dayjs } from 'dayjs';
  import { getPublicList } from '/@/api/public';
  import { cloneDeep } from 'lodash-es';
  import { BasicSearch } from '/@/components/AMoreSearch';
  import { basicGridOptions } from '/@/components/AMoreSearch/data';
  const { createMessage } = useMessage();
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
  import { SearchDataType, SearchLink, SearchMatchType, TableColum, Url } from '/@/api/apiLink';
  const optionsUnitFieldName = reactive<any>({ data: [] });

  type Emits = {
    (event: 'basicClickEvent', data: object): void; //表格双击事件
    (event: 'getListUnitEvent', keywords: object): void; //获取下拉框字段
    (event: 'openSearch', keywords: object): void; //打开基本信息弹框以及获取基本信息数据
    (event: 'onSearch', data: object): void; //基本单位的的选择框点击事件
    (event: 'searchList', type: string, keywords: object): void; //详情页的基本信息搜索
  };
  //获取父组件的数据
  const props = defineProps({
    gridOptions: Object,
    tableCols: String,
    tableData: String,
    modalType: String,
  });
  //1111---开始---基础信息查询的弹框
  const isShowModel = ref<boolean>(false);
  //判断输入框controlType类型，改变后面输入框的类型
  const selectOption: any = reactive({ data: {} });
  //选择框data
  const nowCheckData: any = reactive({ data: {} });
  //基础信息查询组件ref
  const childBasicSearchRef: any = ref(null);
  //1111--结束---基础信息查询的弹框
  const xGrid = ref<VxeGridInstance>();
  //判断窗体类型
  let isUnit = ref<string>();
  //高级查询基本单位表格数据
  const tableCols = ref<any>([]);
  //高级查询字段数据
  const tableData = ref<any>([]);
  //弹框
  const basicSearchDialog = ref(false);
  //格式化数据
  const formatData = (data: string | number, source: configEntity[]) => {
    let res;
    if (source && source.length > 0) {
      res = source.find((item) => item.value === data);
    }
    return res ? res.label : '';
  };
  //详情页查询字段数据——渲染数据
  const init = (data) => {
    optionsUnitFieldName.data = data;
  };
  //判断窗体类型
  const initSearch = (data) => {
    // isUnit.value = data == 'baseUnit' || data == 'weightUnit' || !data;
    isUnit.value = data;
    return isUnit;
  };
  //高级查询基本单位表格数据——表头
  const initCols = (data) => {
    tableCols.value = data;
  };
  //----开始-----基础信息查询的弹框
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
  //基本信息表格双击事件
  const basicClickEvent = (row) => {
    nowCheckData.data.val = row.id;
    nowCheckData.data.labelValue = row.name;
    childBasicSearchRef.value.bSearch(false);
  };
  //改变选择的字段数据
  const handleChange = (value: string) => {
    selectOption.data = JSON.parse(value);
  };
  const onSearch = async (data) => {
    nowCheckData.data = data; //输入框的值
    isShowModel.value = true;
    const res = await publicEvent(data); //获取数据
    childBasicSearchRef.value.initList(res); //表格数据
    childBasicSearchRef.value.initCols(TableColum[selectOption.data.queryConfig]); //表头
    childBasicSearchRef.value.bSearch(true); //打开弹框
    await getPublicListOption();
  };
  const openSearch = async (keywords) => {
    const res = await publicEvent(keywords);
    childBasicSearchRef.value.initList(res);
  };
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
      childBasicSearchRef.value.getListUnitEvent(arr);
    } catch (e) {
      console.log('高级查询获取基本信息字段失败', e);
    }
  };
  //----结束-----基础信息查询的弹框
  //表格内容
  const initList = (data) => {
    tableData.value = data.records;
    pages.currentPage = data.current;
    pages.total = data.total;
    pages.pageSize = data.size;
  };
  //高级查询字段数据
  const getListUnitEvent = (data) => {
    optionsUnitFieldName.data = data;
  };

  //显示弹框
  const bSearch = (data) => {
    basicSearchDialog.value = data;
  };
  //双击单元格事件
  const emit = defineEmits<Emits>();
  const cellClickEvent: VxeGridEvents.CellClick = (row) => {
    emit('basicClickEvent', row.row);
  };
  interface Search {
    startWith: string | undefined;
    fieldName: string | undefined;
    rule: string | undefined;
    val: string | undefined;
    labelValue: string | undefined;
    treeData?: object[] | undefined;
    date?: Dayjs;
    endWith: string | undefined;
    link: string | undefined;
    controlType: string | undefined;
    key: number;
  }
  const formRef: any = ref(null);
  const dynamicValidateForm = reactive<{ searches: Search[] }>({
    searches: [
      {
        startWith: undefined,
        fieldName: '请选择',
        rule: 'LIKE',
        val: '',
        labelValue: '',
        date: undefined,
        treeData: undefined,
        controlType: 'string',
        endWith: undefined,
        link: undefined,
        key: Date.now(),
      },
    ],
  });

  const filterOption = (input: string, option: any) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };
  //选择公共属性
  const selectConfigOption = (data) => {
    if (data !== '' && data !== '请选择') return JSON.parse(data).queryConfig;
  };
  //选择事件
  const selectOne = async (data: any) => {
    data.val = '';
    data.rule = 'LIKE';
    if (data.labelValue || data.date) {
      data.labelValue = '';
      data.date = '';
    }
    if (data.fieldName) {
      let obj = JSON.parse(data.fieldName);
      if (obj.controlType && obj.controlType === 'treeSelect') {
        const res = await getPublicList(
          {
            params: 0,
          },
          //选择分类的接口地址，如基本单位。。
          obj.requestUrl,
        );
        data.val = undefined;
        data.treeData = cloneDeep(res);
      }
    }
  };
  //关闭
  const handleClose = () => {
    formRef.value.resetFields();
    dynamicValidateForm.searches.length = 1;
  };
  //查询按钮
  const basicSearchEvent = (type, keywords) => {
    type = props.modalType;
    dynamicValidateForm.searches.map((r) => {
      if (r.date) {
        r.val = dayjs(dayjs(r.date).valueOf()).format('YYYY-MM-DD');
      }
    });
    if (dynamicValidateForm.searches) {
      keywords = dynamicValidateForm.searches;
      if (keywords.length == 1) {
        if (keywords[0].fieldName === '请选择') {
          createMessage.error('请选择查询条件');
          return;
        }
      }
      keywords = {
        table: '',
        name: JSON.parse(keywords[0].fieldName).propName,
        column: JSON.parse(keywords[0].fieldName).fieldName,
        startWith: keywords[0].startWith,
        endWith: keywords[0].endWith,
        type: keywords[0].controlType,
        link: 'AND',
        rule: keywords[0].rule,
        date: keywords[0].date,
        val: keywords[0].val,
      };
      emit('searchList', type, keywords);
      emit('openSearch', keywords);
    } else {
      createMessage.error('输入不可为空');
    }
  };
  //重置
  const resetSearch = (type, keywords) => {
    type = props.modalType;
    formRef.value.resetFields();
    emit('searchList', type, keywords);
    emit('openSearch', keywords);
  };
  //分页信息
  const pages = reactive({
    currentPage: 0,
    pageSize: 0,
    total: 0,
  });
  //分页处理
  const handlePageChange = async ({ currentPage, pageSize }) => {
    pages.currentPage = currentPage;
    pages.pageSize = pageSize;
  };
  defineExpose({
    init,
    bSearch,
    initList,
    initCols,
    initSearch,
    getListUnitEvent,
  });
</script>
<style scoped lang="less">
  .x-button {
    margin: 10px 5px;
  }
  :deep(.vxe-table .vxe-sort--desc-btn.sort--active) {
    color: #409eff;
    border-color: #409eff;
  }
  :deep(.vxe-table .vxe-sort--asc-btn.sort--active) {
    color: #409eff;
    border-color: #409eff;
  }
</style>
