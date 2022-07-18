<template>
  <div>
    <a-modal
      style="top: 20px"
      v-model:visible.sync="basicSearchDialog"
      width="70%"
      centered
      :footer="null"
      :maskClosable="false"
      @cancel="handleClose"
    >
      <a-form ref="formRef" name="dynamic_form_nest_item" :model="dynamicValidateForm">
        <div v-show="isUnit">
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
                @focus="handleFocus"
                @change="handleChange"
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
                v-model:value="search.rule"
                placeholder="等于"
                :options="optionsRule"
                style="width: 100px"
                :filterOption="filterOption"
                @focus="handleFocus"
              />
            </a-form-item>
            <a-form-item style="margin: 5px 5px" :name="['searches', index, 'val']">
              <a-input v-show="search.fieldName == '请选择'" style="width: 200px" disabled />
              <a-select
                v-show="
                  search.fieldName != '请选择'
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
                  search.fieldName != '请选择'
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
                  search.fieldName != '请选择'
                    ? JSON.parse(search.fieldName).controlType === 'inputsearch'
                    : false
                "
                style="width: 200px"
                readonly
                placeholder="请选择输入..."
                v-model:value="search.val"
                :filterOption="filterOption"
                @search="onSearch(search)"
              />
              <a-space
                direction="vertical"
                :size="12"
                v-show="
                  search.fieldName != '请选择'
                    ? JSON.parse(search.fieldName).controlType === 'date'
                    : false
                "
              >
                <a-date-picker
                  style="width: 200px"
                  v-model="search.val"
                  show-time
                  placeholder="请选择时间..."
                />
              </a-space>
              <a-select
                v-show="
                  search.fieldName != '请选择'
                    ? JSON.parse(search.fieldName).controlType === 'checkbox'
                    : false
                "
                mode="multiple"
                showSearch
                style="width: 200px"
                :allowClear="true"
                :showArrow="true"
                v-model:value="search.val"
                :filterOption="filterOption"
                placeholder="请选择...多选。。"
              />
            </a-form-item>
            <span style="margin-left: 10px">
              <a-button type="primary" class="x-button" @click="resetSearch">重置</a-button>
              <a-button type="primary" class="x-button" @click="basicSearch">查询</a-button>
            </span>
          </a-space>
        </div>
        <!--          table表单                  -->
        <a-form-item style="margin: 16px">
          <vxe-grid
            ref="xGrid"
            v-bind="gridOptions"
            :data="tableData.data"
            :columns="tableCols.data"
            :export-config="{}"
            @cell-dblclick="cellClickEvent"
          >
            <template #status="{ row }">
              <a-tag
                :color="row.bsStatus.label === '已审核' ? 'success' : 'warning'"
                v-if="row.bsStatus"
                >{{ row.bsStatus == 'B' ? '已审核' : '创建' }}</a-tag
              >
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
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import {
    Modal,
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
  } from 'ant-design-vue';
  import { reactive, defineProps, ref, defineExpose, defineEmits } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { VxeGridEvents, VxeGridInstance, Pager } from 'vxe-table';

  const AModal = Modal;
  const AForm = Form;
  const AFormItem = FormItem;
  const ASpace = Space;
  const ASelect = Select;
  const ATag = Tag;
  const AButton = Button;
  const AInput = Input;
  const AInputSearch = InputSearch;
  const ASelectOption = SelectOption;
  const ADatePicker = DatePicker;

  type Emits = {
    (event: 'cellClickEvent', data: object): void;
    (event: 'getListUnitEvent', keywords: object): void;
    (event: 'searchUnitList', keywords: object): void;
    // (event: 'searchListUnitEventList', keywords: object): void;
    (event: 'openSearch', keywords: object): void;
  };
  //获取父组件的数据
  const props = defineProps({
    gridOptions: String,
    tableCols: String,
    tableData: String,
  });
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
    console.log('hand', currentPage, pageSize);
  };

  const xGrid = ref<VxeGridInstance>();
  // const router = useRouter();
  //详情页查询字段数据
  const init = (data) => {
    console.log('详情页aaa', data);
    optionsUnitFieldName.data = data;
  };
  //判断窗体是否显示搜索
  let isUnit = ref(true);
  const initSearch = (data) => {
    console.log('inits', data);
    if (data == 'baseUnit' || data == 'weightUnit' || !data) {
      isUnit.value = true;
    } else {
      isUnit.value = false;
    }
    return isUnit;
  };
  //详情页基本单位表格数据
  const tableCols = reactive<any>({ data: [] });
  const initCols = (data) => {
    tableCols.data = data;
    console.log('kkk', data);
  };
  const tableData = reactive<any>({ data: [] });
  const initList = (data) => {
    console.log('mmm', data);
    tableData.data = data.records;
    console.log('详情页ccc', tableData.data);
    console.log('详情页页码总数：', data.total);
    pages.currentPage = data.current;
    pages.total = data.total;
    pages.pageSize = data.size;
  };
  //高级查询字段数据
  const getListUnitEvent = (data) => {
    console.log('高级查询bbb', data);
    optionsUnitFieldName.data = data;
    console.log(data.total);
  };
  //高级查询基本单位表格数据
  // const getListUnitEventList = (data) => {
  //   tableData.data = data.records;
  //   console.log('高级查询ccc', tableData.data);
  //   console.log('高级查询页码：', data.total);
  //   pages.currentPage = data.current;
  //   pages.total = data.total;
  //   pages.pageSize = data.size;
  // };
  //弹框
  const basicSearchDialog = ref(false);
  //显示弹框
  const bSearch = (data) => {
    basicSearchDialog.value = data;
    console.log('基础查询弹框：', data);
  };
  //双击单元格事件
  const emit = defineEmits<Emits>();
  // const cellClickEvent = (row) => {
  //   emit('cellClickEvent', row.row);
  // };
  const cellClickEvent: VxeGridEvents.CellClick = (row) => {
    console.log('单元格内容：', row);
    emit('cellClickEvent', row.row);
  };
  const optionsUnitFieldName = reactive<any>({ data: [] });
  const optionsRule = reactive<any>([
    { value: 'EQ', label: '等于' },
    { value: 'GE', label: '大于等于' },
    { value: 'LE', label: '小于等于' },
    { value: 'NE', label: '不等于' },
    { value: 'GT', label: '大于' },
    { value: 'LT', label: '小于' },
  ]);
  interface Search {
    startWith: string | undefined;
    fieldName: string | undefined;
    rule: string | undefined;
    val: string | undefined;
    endWith: string | undefined;
    link: string | undefined;
    controlType: string | undefined;
    key: number;
  }
  // const formRef = ref<FormInstance>();
  const formRef: any = ref(null);
  const dynamicValidateForm = reactive<{ searches: Search[] }>({
    searches: [
      {
        startWith: undefined,
        fieldName: '请选择',
        rule: 'EQ',
        val: undefined,
        controlType: 'string',
        endWith: undefined,
        link: undefined,
        key: Date.now(),
      },
    ],
  });

  const handleFocus = () => {
    console.log('focus');
  };
  const filterOption = (input: string, option: any) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  //选择事件
  const handleChange = (value: string) => {
    // console.log('选择', val);
    console.log(`selected ${value}`);
  };
  //关闭
  const handleClose = () => {
    formRef.value.resetFields();
    // nowCheckData.data = '';
    // moreSearchDialog.value = false;
    dynamicValidateForm.searches.length = 1;
  };
  //查询
  const basicSearch = (keywords) => {
    if (dynamicValidateForm.searches) {
      console.log('基础查询里面的查询按钮：', dynamicValidateForm.searches);
      keywords = dynamicValidateForm.searches;
      console.log(keywords);
      keywords = {
        table: '',
        name: JSON.parse(keywords[0].fieldName).propName,
        column: JSON.parse(keywords[0].fieldName).fieldName,
        startWith: keywords[0].startWith,
        endWith: keywords[0].endWith,
        type: keywords[0].controlType,
        link: 'AND',
        rule: keywords[0].rule,
        val: keywords[0].val,
      };
      console.log('参数', keywords);
      emit('searchUnitList', keywords);
      emit('openSearch', keywords);
    } else {
      useMessage().createMessage.error('输入不可为空');
    }
  };
  //重置
  const resetSearch = () => {
    formRef.value.resetFields();
    // nowCheckData.data = '';
  };
  defineExpose({ init, bSearch, basicSearch, initList, initCols, initSearch, getListUnitEvent }); //getListUnitEventList,
</script>
<style scoped>
  .x-button {
    margin: 10px 5px;
  }
</style>
