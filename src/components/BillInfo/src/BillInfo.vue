<template>
  <div style="margin: auto; width: 98%">
    <p style="font-weight: bold; font-size: 22px">单据信息:</p>
    <a-card>
      <a-row style="font-size: 16px; font-weight: bold">
        <a-col :span="14">
          <span>{{ props.billName }}</span>
          <span style="padding-left: 10px">{{ props.billNo }}</span>
        </a-col>
        <a-col :span="10">
          <span>单据日期:</span>
          <span style="padding-left: 10px">{{ props.billDate }}</span>
        </a-col>
      </a-row>
    </a-card>
    <div>
      <a-table
        :rowKey="(record) => record.id"
        :columns="props.columns"
        :data-source="props.data"
        :scroll="props.scroll"
        :pagination="false"
        :ellipsis="true"
        size="middle"
        :rowClassName="rowClassName"
        bordered
      >
        <template #stock="{ text, record }">
          <a-select
            @focus="myfocus"
            :value="text.fStock"
            size="default"
            style="width: 120px"
            :options="options"
            @change="(value, option) => selectChange(value, option, record.id)"
          />
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Card, Table, Row, Col, Select } from 'ant-design-vue';
  // import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue';
  import { defineComponent, PropType, onMounted, ref } from 'vue';
  import { TableColumns } from '/@/components/BillInfo';
  import { findStock, Stock } from '/@/api/utilApi';
  import { cloneDeep } from 'lodash-es';
  const ACard = Card;
  const ASelect = Select;
  const ATable = Table;
  const ARow = Row;
  const ACol = Col;
  let thatStock;
  // const align = 'center';
  const options = ref<any>([]);
  const emits = defineEmits<{
    (e: 'autoChangeFocus', name?: string, isFocus?: boolean): void;
    (e: 'refreshTable', value: any, option: any, id: any, stock: Stock[]): void;
  }>();
  const getStock = (stock: Stock[]) => {
    options.value = [];
    // const copyStock = cloneDeep(mainStock);
    thatStock = cloneDeep(stock);
    thatStock.forEach((item) => {
      let s: any = {};
      s.label = item.fStockName;
      s.value = item.fStock;
      // s.key = item.key;
      options.value.push(cloneDeep(s));
    });
    // console.log('qu', options.value);
  };
  const selectChange = (value, option, id) => {
    console.log('看看copy', thatStock);
    emits('refreshTable', value, option, id, thatStock);
  };
  const myfocus = () => {
    emits('autoChangeFocus', 'other', true);
  };
  interface dProps {
    billName?: string;
    billNo?: string | number;
    billDate?: string;
    columns?: TableColumns[];
    data?: any[];
    scroll?: any;
    // mainStock?: Stock[];
  }
  const rowClassName = (record, index) => {
    return 'tableStyle';
  };
  const props = withDefaults(defineProps<dProps>(), {
    billName: '出库单号:',
    billNo: '',
    billDate: '',
    columns: () => [],
    data: () => [],
    scroll: () => {
      return { x: 800, y: 400 };
    },
    // mainStock: () => [],
  });
  //非ts
  // const props = defineProps({
  //   billNo: {
  //     type: String,
  //     default: '',
  //   },
  //   billName: {
  //     type: String,
  //     default: '出库单号:',
  //   },
  //   billDate: {
  //     type: String,
  //     default: '',
  //   },
  //   columns: {
  //     type: Array as PropType<TableColumns[]>,
  //     default: () => [],
  //   },
  //   data: {
  //     type: Array,
  //     default: () => [],
  //   },
  // });
  defineExpose({ getStock });
</script>
<style lang="less" scoped>
  //@aaa: ~'>>>';
  :deep(.ant-card-body) {
    padding: 18px;
  }
  :deep(.ant-card) {
    border: 0.02rem solid transparent;
    border-radius: 8px 8px 0 0;
  }

  .tableStyle {
    font-size: 18px;
    font-weight: bold;
  }

  :deep(table) {
    font-size: 16px !important;
  }
</style>
