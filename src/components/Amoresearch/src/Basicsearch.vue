<template>
  <div>
    <a-modal
      style="top: 20px"
      v-model:visible="basicSearchDialog"
      width="70%"
      centered
      :footer="null"
      :maskClosable="false"
      @cancel="handleClose"
    >
      <a-form ref="formRef" name="dynamic_form_nest_item" :model="dynamicValidateForm">
        <!--v-show="isUnit"-->
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
                @focus="handleFocus"
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
                  search.fieldName != '请选择'
                    ? JSON.parse(search.fieldName).controlType === 'date'
                    : false
                "
                v-model:value="search.rule"
                placeholder="等于"
                :options="optionsTime"
                style="width: 100px"
                :filterOption="filterOption"
              />
              <a-select
                v-show="
                  search.fieldName != '请选择'
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
              <!--@click="onSearch(search)" -->
              <a-input-search
                v-show="
                  search.fieldName !== '请选择'
                    ? JSON.parse(search.fieldName).controlType === 'inputsearch'
                    : false
                "
                style="width: 200px"
                onfocus="this.blur();"
                placeholder="请选择输入..."
                v-model:value="search.val"
                :filterOption="filterOption"
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
            v-bind="props.gridOptions"
            :data="tableData.data"
            :columns="tableCols.data"
            :export-config="{}"
            @cell-dblclick="cellClickEvent"
          >
            <template #status="{ row }">
              <Tag :color="row.bsStatus === 'B' ? 'processing' : 'default'" v-if="row.bsStatus">{{
                row.bsStatus === 'A' ? '创建' : '已审核'
              }}</Tag>
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
  import { reactive, ref } from 'vue';
  import { VxeGridEvents, VxeGridInstance, Pager } from 'vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import dayjs, { Dayjs } from 'dayjs';
  const { createMessage } = useMessage();
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

  type Emits = {
    (event: 'cellClickEvent', data: object): void;
    (event: 'getListUnitEvent', keywords: object): void;
    // (event: 'searchUnitList', keywords: object): void;
    (event: 'openSearch', keywords: object): void;
    (event: 'searchList', type: string, keywords: object): void;
  };
  //获取父组件的数据
  const props = defineProps({
    gridOptions: String,
    tableCols: String,
    tableData: String,
    modalType: String,
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
  //详情页查询字段数据
  const init = (data) => {
    console.log('详情页字段数据', data);
    optionsUnitFieldName.data = data;
  };
  //判断窗体类型
  let isUnit = ref<string>();
  const initSearch = (data) => {
    console.log('inits', data);
    // isUnit.value = data == 'baseUnit' || data == 'weightUnit' || !data;
    isUnit.value = data;
    return isUnit;
  };
  //详情页基本单位表格数据
  const tableCols = reactive<any>({ data: [] });
  const initCols = (data) => {
    tableCols.data = data;
    console.log('详情页基本单位表格数据', data);
  };
  const tableData = reactive<any>({ data: [] });
  const initList = (data) => {
    console.log('mmm', data);
    tableData.data = data.records;
    pages.currentPage = data.current;
    pages.total = data.total;
    pages.pageSize = data.size;
  };
  //高级查询字段数据
  const getListUnitEvent = (data) => {
    console.log('高级查询字段数据', data);
    optionsUnitFieldName.data = data;
    console.log(data.total);
  };
  //弹框
  const basicSearchDialog = ref(false);
  //显示弹框
  const bSearch = (data) => {
    basicSearchDialog.value = data;
    console.log('基础查询弹框：', data);
  };
  //双击单元格事件
  const emit = defineEmits<Emits>();
  const cellClickEvent: VxeGridEvents.CellClick = (row) => {
    console.log('单元格内容：', row);
    emit('cellClickEvent', row.row);
  };
  const optionsUnitFieldName = reactive<any>({ data: [] });
  const optionsRule = reactive<any>([
    { value: 'LIKE', label: '包含' },
    { value: 'EQ', label: '等于' },
    { value: 'GE', label: '大于等于' },
    { value: 'LE', label: '小于等于' },
    { value: 'NE', label: '不等于' },
    { value: 'GT', label: '大于' },
    { value: 'LT', label: '小于' },
  ]);
  const optionsTime = reactive<any>([
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
        rule: undefined,
        val: undefined,
        date: undefined,
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
    console.log(`selected ${value}`);
  };
  const selectOne = (data: any) => {
    data.val = '';
    if (data.labelValue) {
      data.labelValue = '';
    }
  };
  //关闭
  const handleClose = () => {
    formRef.value.resetFields();
    dynamicValidateForm.searches.length = 1;
  };
  //查询
  const basicSearch = (type, keywords) => {
    type = props.modalType;
    dynamicValidateForm.searches.map((r) => {
      if (r.date) {
        r.val = dayjs(dayjs(r.date).valueOf()).format('YYYY-MM-DD 00:00:00');
      }
    });
    if (dynamicValidateForm.searches) {
      console.log('基础查询里面的查询按钮：', dynamicValidateForm.searches);
      keywords = dynamicValidateForm.searches;
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
      console.log('参数', keywords);
      // emit('searchUnitList', keywords);
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
    // emit('searchUnitList', type);
    emit('searchList', type, keywords);
    emit('openSearch', keywords);
  };
  defineExpose({ init, bSearch, basicSearch, initList, initCols, initSearch, getListUnitEvent }); //getListUnitEventList,
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
