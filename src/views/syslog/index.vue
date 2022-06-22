<template>
  <div>
    <!-- 查询区域 -->
    <Card style="margin-top: 5px">
      <span>搜索日志：</span
      ><Input
        style="width: 200px"
        placeholder="请输入搜索关键词"
        v-model:value="queryParam.keyWord"
      ></Input>
      <span style="margin-left: 10px">创建时间：</span
      ><DatePickerRangePicker
        style="width: 210px"
        v-model:value="queryParam.createTimeRange"
        format="YYYY-MM-DD"
        :placeholder="['开始时间', '结束时间']"
        @change="onDateChange"
      />
      <span style="margin-left: 10px">操作类型：</span
      ><Select
        style="width: 200px"
        :allowClear="true"
        v-model:value="queryParam.operateType"
        placeholder="请选择操作类型"
        dictCode="operate_type"
        @select="selectlx"
        :options="options1"
      />
      <Button type="primary" style="left: 10px" @click="searchQuery(1)">
        <template #icon><SearchOutlined /></template>
        查询</Button
      >
      <Button type="primary" @click="searchReset" style="margin-left: 8px; left: 10px">
        <template #icon><RedoOutlined /></template>重置</Button
      >
    </Card>
    <!-- table区域-begin -->
    <Card style="margin-top:10px" title="操作日志">
      <Table
        ref="table"
        size="middle"
        rowKey="id"
        :ellipsis="true"
        :columns="columns.data"
        :dataSource="dataSource.data"
        @change="handleTableChange"
        :pagination="false"
        :scroll="{ x: 'calc(700px + 60%)', y: 400 }"
      >
        <template #logContent="{ text }">
          <InPutTextArea readOnly :defaultValue="text" :rows="3"> </InPutTextArea>
        </template>
        <template #num="{ index }">
          {{ (current1 - 1) * pageSizeRef + Number(index) + 1 }}</template
        >
        <template #operateType="{ text }">
          <span v-for="(items, index) in options1" :key="index">
            <span v-if="text == items.value">{{ items.label }}</span>
          </span>
        </template>
      </Table>
      <Pagination
        style="margin-top:15px"
        v-model:current="current1"
        :page-size-options="pageSizeOptions"
        :total="total1"
        :show-total="total => `共 ${total} 条`"
        show-size-changer
        @change="pageChange"
        :page-size="pageSizeRef"
        @showSizeChange="onShowSizeChange"
      >
      </Pagination>
      <!-- table区域-end -->
    </Card>
  </div>
</template>
<script lang="ts">
  import { Input, DatePicker } from 'ant-design-vue';
  export default {
    components: {
      InPutTextArea: Input.TextArea,
      DatePickerRangePicker: DatePicker.RangePicker,
    },
  };
</script>
<script lang="ts" setup>
  import {
    Pagination,
    Row,
    Col,
    Select,
    SelectOption,
    Card,
    Table,
    Form,
    Input,
    RangePicker,
    FormItem,
    Button,
  } from 'ant-design-vue';
  import { logList } from '/@/api/sys/log';
  import { SelectTypes } from 'ant-design-vue/es/select';
  import { SearchOutlined, RedoOutlined } from '@ant-design/icons-vue';
  import { TableState } from 'ant-design-vue/es/table/interface';
  import { reactive, ref } from 'vue';
  const pageSizeOptions = ref<string[]>(['10', '50', '100', '200']);
  const current1 = ref(1);
  const pageSizeRef = ref(10);
  let total1 = ref(0);
  const onShowSizeChange = async (current: number, pageSize: number) => {
    dataSource.data = [];
    if (current == 0) {
      current = 1;
    }
    current1.value = current;
    pageSizeRef.value = pageSize;
    queryParam.pageNo = current;
    queryParam.pageSize = pageSize;
    await searchQuery(current);
  };
  const pageChange = async (page: number, pageSize: number) => {
    queryParam.pageSize = pageSize;
    queryParam.pageNo = page;
    await searchQuery(page);
  };
  const options1 = ref<SelectTypes['options']>([
    {
      value: '1',
      label: '查询',
    },
    // {
    //   value: '2',
    //   label: '添加',
    // },
    // {
    //   value: '3',
    //   label: '修改',
    // },
    // {
    //   value: '4',
    //   label: '删除',
    // },
    // {
    //   value: '5',
    //   label: '导入',
    // },
    // {
    //   value: '6',
    //   label: '导出',
    // },
    {
      value: '7',
      label: '单据操作',
    },
    {
      value: '8',
      label: '其他',
    },
  ]);

  // 查询条件
  const queryParam = reactive<any>({
    ipInfo: '',
    createTimeRange: [],
    logType: '2',
    keyWord: '',
    operateType: null,
    column: 'createTime',
    order: 'desc',
    pageNo: current1.value,
    pageSize: pageSizeRef.value,
  });
  // 表头
  const columns = reactive({
    data: [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        slots: {
          customRender: 'num',
        },
        width: 70,
      },
      {
        title: '日志内容',
        align: 'left',
        dataIndex: 'logContent',
        width: 270,
        ellipsis: 'true',
        slots: { customRender: 'logContent' },
      },
      {
        title: '操作人ID',
        dataIndex: 'userid',
        align: 'center',
        width: 100,
      },
      {
        title: '操作人名称',
        dataIndex: 'username',
        align: 'center',
        width: 100,
      },
      {
        title: 'IP',
        dataIndex: 'ip',
        align: 'center',
        width: 120,
      },
      {
        title: '耗时(毫秒)',
        dataIndex: 'costTime',
        align: 'center',
        sorter: true,
        width: 90,
      },
      {
        title: '日志类型',
        dataIndex: 'logType_dictText',
        align: 'center',
        width: 100,
      },
      {
        title: '操作类型',
        dataIndex: 'operateType',
        align: 'center',
        width: 90,
        slots: { customRender: 'operateType' },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        align: 'center',
        sorter: true,
        width: 160,
      },
    ],
  });

  const dataSource = reactive<any>({
    data: [],
  });

  // 重置
  const searchReset = async () => {
    queryParam.column= 'createTime',
    queryParam.order= 'desc',
    queryParam.pageNo= current1.value,
    queryParam.pageSize= pageSizeRef.value,
    queryParam.ipInfo = null;
    queryParam.createTimeRange = [];
    queryParam.createTime_begin = "";
    queryParam.createTime_end = "";
    queryParam.logType = '2';
    queryParam.operateType = null;
    queryParam.keyWord = "";
    await searchQuery(current1.value);
  };

  //查询
  const searchQuery = async (pageNo: any) => {
    dataSource.data = [];
    delete queryParam.createTimeRange;
    // if (
    //   queryParam.keyWord ||
    //   queryParam.createTime_begin ||
    //   queryParam.createTime_end ||
    //   queryParam.operateType 
    // ) {
    current1.value = pageNo;
    queryParam.pageNo = current1.value;
    // }
    const data = await logList(queryParam);
    const { code, result } = data;
    if(code == 0){
      total1.value = result.total;
      dataSource.data.push(...result.records);
    }
  };

  const onDateChange = async (value, dateString) => {
    queryParam.createTime_begin = dateString[0];
    queryParam.createTime_end = dateString[1];
  };

  const handleTableChange = async (pagination, filters, sorter) => {
    queryParam.column = sorter.field;
    if(sorter.order == "ascend"){
      queryParam.order = "asc"
    }else if(sorter.order == "descend"){
      queryParam.order = "desc"
    }
    await searchQuery();
  };
  const selectlx = async (value) => {
    queryParam.operateType = value;
  };
  searchQuery(1);
</script>

<style lang="less" scoped></style>
