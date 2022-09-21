<template>
  <vxe-modal
    v-model="basicSearchDialog"
    id="basicSearchModal"
    show-zoom
    resize
    :position="{ top: 40 }"
    width="55%"
    @close="handleClose"
  >
    <div class="form-style">
      <Row class="row" :key="search.key" v-for="search in dynamicValidateForm.searches">
        <a-space>
          <span style="font-weight: bolder">查询条件</span>
          <Col>
            <vxe-select
              clearable
              v-model="search.fieldName"
              placeholder="请选择"
              style="width: 200px"
              @focus="handleChange"
              @select="selectOne(search)"
            >
              <vxe-option
                v-for="(item, v) in optionsUnitFieldName.data"
                :value="JSON.stringify(item)"
                :label="item.displayName"
                :key="v"
              />
            </vxe-select>
          </Col>
          <Col>
            <vxe-select
              v-show="
                search.fieldName ? JSON.parse(search.fieldName).controlType === 'date' : false
              "
              v-model="search.rule"
              placeholder="等于"
              :options="config.TIME_OPTION_RULE"
              style="width: 100px"
              :filterOption="filterOption"
            />
            <vxe-select
              v-show="search.fieldName ? JSON.parse(search.fieldName).controlType !== 'date' : true"
              v-model="search.rule"
              placeholder="包含"
              :options="config.OPTION_RULE"
              style="width: 100px"
              :filterOption="filterOption"
            />
          </Col>
          <Col>
            <a-input v-show="!search.fieldName" style="width: 200px" disabled />
            <vxe-select
              v-show="
                search.fieldName ? JSON.parse(search.fieldName).controlType === 'select' : false
              "
              v-model="search.val"
              placeholder="请选择"
              style="width: 200px"
            >
              <vxe-option
                v-for="(item, optionIndex) in config[selectConfigOption(search.fieldName)]"
                :key="optionIndex"
                :value="item.value"
                :label="item.label"
              />
            </vxe-select>
            <a-input
              v-show="
                search.fieldName ? JSON.parse(search.fieldName).controlType === 'input' : false
              "
              style="width: 200px"
              placeholder="请输入..."
              v-model:value="search.val"
              :filterOption="filterOption"
            />
            <a-input-search
              v-show="
                search.fieldName
                  ? JSON.parse(search.fieldName).controlType === 'inputSearch'
                  : false
              "
              style="width: 200px"
              onfocus="this.blur();"
              placeholder="请选择输入"
              v-model:value="search.labelValue"
              :filterOption="filterOption"
              @click="onSearch(search)"
              @search="onSearch(search)"
            />
            <a-space
              direction="vertical"
              :size="12"
              v-show="
                search.fieldName ? JSON.parse(search.fieldName).controlType === 'date' : false
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
                search.fieldName ? JSON.parse(search.fieldName).controlType === 'treeSelect' : false
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
          </Col>
          <span style="margin-left: 10px">
            <a-button type="primary" class="x-button" @click="resetSearch">重置</a-button>
            <a-button type="primary" class="x-button" @click="basicSearchEvent">查询</a-button>
          </span>
        </a-space>
      </Row>
      <!--          table表单                  -->
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
      <vxe-pager
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
    </div>
    <template #title>
      <span>基础信息查询</span>
    </template>
  </vxe-modal>
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
    // Select,
    // SelectOption,
    Button,
    Row,
    Col,
    Input,
    DatePicker,
    Space,
    InputSearch,
    Tag,
    TreeSelect,
  } from 'ant-design-vue';
  import { reactive, ref, UnwrapRef } from 'vue';
  import { VxeGridEvents, VxeGridInstance, VxePagerEvents } from 'vxe-table';
  import { config, configEntity } from '/@/utils/publicParamConfig';
  import { useMessage } from '/@/hooks/web/useMessage';
  import dayjs, { Dayjs } from 'dayjs';
  import { getPublicList } from '/@/api/public';
  import { cloneDeep } from 'lodash-es';
  import { BasicSearch } from '/@/components/AMoreSearch';
  import { basicGridOptions } from '/@/components/AMoreSearch/data';
  const { createMessage } = useMessage();
  const ASpace = Space;
  const AButton = Button;
  const AInput = Input;
  const AInputSearch = InputSearch;
  const ADatePicker = DatePicker;
  const ATreeSelect = TreeSelect;
  import { SearchDataType, SearchMatchType, TableColum, Url } from '/@/api/apiLink';
  const optionsUnitFieldName = reactive<any>({ data: [] });

  type Emits = {
    (event: 'basicClickEvent', data: object): void; //表格双击事件
    (event: 'getListUnitEvent', keywords: object): void; //获取下拉框字段
    (event: 'openSearch', keywords?: object, currPage?: number, pageSize?: number): void; //打开基本信息弹框以及获取基本信息数据
    (event: 'onSearch', data: object): void; //基本信息的的选择框点击事件
    (event: 'searchList', type: string, keywords: object): void; //详情页的基本信息搜索
  };
  //获取父组件的数据
  const props = defineProps({
    gridOptions: Object,
    tableCols: String,
    tableData: String,
    modalType: String,
  });
  interface Search {
    startWith: string;
    fieldName: string;
    rule: string;
    val: string;
    labelValue: string;
    treeData?: object[];
    checkData?: string[];
    date?: Dayjs | undefined;
    endWith: string;
    controlType?: string;
    key: number;
  }
  const dynamicValidateForm: UnwrapRef<{ searches: Search[] }> = reactive({
    searches: [
      {
        startWith: '',
        fieldName: '',
        rule: 'LIKE',
        val: '',
        labelValue: '',
        date: undefined,
        checkData: [],
        treeData: [],
        controlType: '',
        endWith: '',
        key: Date.now(),
      },
    ],
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
  const handleChange = (value: any) => {
    selectOption.data = value.value;
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

  const filterOption = (input: string, option: any) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };
  //选择公共属性
  const selectConfigOption = (data) => {
    if (data) return JSON.parse(data).queryConfig;
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
    // formRef.value.resetFields();
    dynamicValidateForm.searches[0] = {
      startWith: '',
      endWith: '',
      fieldName: '',
      date: undefined,
      treeData: [],
      checkData: [],
      controlType: '',
      val: '',
      labelValue: '',
      rule: SearchMatchType.LIKE,
      key: Date.now(),
    };
    basicSearchDialog.value = false;
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
      if (keywords.length == 1 && !keywords[0].fieldName) {
        return;
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
    dynamicValidateForm.searches[0] = {
      startWith: '',
      endWith: '',
      fieldName: '',
      date: undefined,
      treeData: [],
      checkData: [],
      controlType: '',
      val: '',
      labelValue: '',
      rule: SearchMatchType.LIKE,
      key: Date.now(),
    };
    dynamicValidateForm.searches.length = 1;
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
  const handlePageChange: VxePagerEvents.PageChange = async ({
    keywords = {},
    currentPage,
    pageSize,
  }) => {
    pages.currentPage = currentPage;
    pages.pageSize = pageSize;
    await emit('openSearch', keywords, currentPage, pageSize);
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
  :deep(.vxe-table .vxe-sort--desc-btn.sort--active) {
    color: #409eff;
    border-color: #409eff;
  }
  :deep(.vxe-table .vxe-sort--asc-btn.sort--active) {
    color: #409eff;
    border-color: #409eff;
  }
</style>
