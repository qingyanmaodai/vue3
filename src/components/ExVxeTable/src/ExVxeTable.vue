<template>
  <vxe-grid
    border
    ref="xGrid"
    class="table"
    max-height="100%"
    v-bind="props.gridOptions"
    :columns="props.columns"
    :export-config="{}"
  >
    <template #toolbar_buttons>
      <div style="width: 100%; margin-left: 10px">
        <vxe-button @click="insertRowEvent">新增行</vxe-button>
        <vxe-button @click="removeRowEvent">删除选中</vxe-button>
      </div>
    </template>
    <template #status="{ row }">
      <Tag :color="row.bsStatus === 'B' ? 'processing' : 'default'" v-if="row.bsStatus">{{
        formatData(row.bsStatus, config['DATA_STATUS'])
      }}</Tag>
    </template>
  </vxe-grid>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { VXETable, VxeGridInstance, VxeTablePropTypes } from 'vxe-table';
  import { Tag, Button, Upload, message } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { config, configEntity } from '/@/utils/publicParamConfig'; //公共配置ts

  const { createMessage } = useMessage();
  const AButton = Button;

  const props = defineProps({
    gridOptions: Object,
    columns: Array,
    buttons: Array,
    count: Number,
    height: Number,
    treeSelectData: Number,
    show: Boolean,
    isShowImport: {
      type: Boolean,
      default: true,
    },
    isShowExport: {
      type: Boolean,
      default: true,
    },
    importConfig: String,
  });

  const xGrid = ref<VxeGridInstance>();
  //格式化数据
  const formatData = (data: string | number, source: configEntity[]) => {
    let res;
    if (source && source.length > 0) {
      res = source.find((item) => item.value === data);
    }
    return res ? res.label : '';
  };
  //新增行
  const insertRowEvent = async () => {
    const $grid: any = xGrid.value;
    const record = {};
    const { row: newRow } = await $grid.insert(record);
    await $grid.setEditCell(newRow, 'name');
  };
  //删除行
  const removeRowEvent = () => {
    const $grid: any = xGrid.value;
    $grid.removeCheckboxRow();
  };
</script>
<style scoped lang="less">
  .table {
    background-color: #fff;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  :deep(.vxe-toolbar .vxe-tools--operate) {
    margin-right: 10px;
  }
</style>
