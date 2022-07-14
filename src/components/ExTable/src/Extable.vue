<template>
  <div>
    <vxe-grid
      ref="xGrid"
      v-bind="props.gridOptions"
      :columns="props.columns"
      :buttons="props.buttons"
      :export-config="{}"
      :data="tableData.data"
    >
      <template #toolbar_buttons>
        <vxe-button v-for="button in buttons" :status="button.status" @click="button.onClick()">{{
          button.label
        }}</vxe-button>
      </template>
      <template #status="{ row }">
        <Tag :color="row.bsStatus == 'B' ? 'green' : 'warning'" v-if="row.bsStatus">{{
          row.bsStatus == 'A' ? '创建' : '已审核'
        }}</Tag>
      </template>
      <template #attr="{ row }"
        >{{
          row.attr === 'A' ? '自制' : row.attr === 'B' ? '外购' : row.attr === 'C' ? '委外' : '虚拟'
        }}
      </template>
      <template #operate="{ row }">
        <vxe-button status="primary" @click="editTable(row)">编辑</vxe-button>
        <vxe-button status="danger" @click="removeRowEvent(row)">删除</vxe-button>
      </template>
    </vxe-grid>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { VXETable, VxeGridInstance, VxeButtonEvents } from 'vxe-table';
  import { Tag } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import { useMessage } from '/@/hooks/web/useMessage';
  // import { gridOptions } from '/@/components/ExTable/data';
  // import { delMatTableBatch, delMatTableById } from '/@/api/mattable';
  const { createMessage } = useMessage();
  const props = defineProps({
    gridOptions: String,
    columns: String,
    buttons: String,
    count: Number,
  });
  type Emits = {
    (event: 'getList'): void;
    (event: 'delMatOneEvent', row: object): void;
    (event: 'delMatBatchEvent', row: any): void;
  };
  const emit = defineEmits<Emits>();
  const xGrid = ref<VxeGridInstance>();
  const router = useRouter();
  //数据初始化
  const tableData = reactive<any>({ data: [] });
  const init = (data) => {
    tableData.data = data;
    console.log('ccc', tableData.data[0].attr);
  };
  //新增信息
  const addTable = () => {
    console.log('新增');
    router.push({
      path: '../profile/index',
    });
  };
  //编辑
  const editTable = (row: any) => {
    console.log('编辑:', row.id);
    router.push({
      path: '../profile/index',
      // name:'';
      query: {
        row: row.id,
      },
    });
  };
  //删除单条
  const removeRowEvent = async (row: any) => {
    const type = await VXETable.modal.confirm('您确定要删除该数据?');
    const $grid = xGrid.value;
    if ($grid) {
      if (type === 'confirm') {
        try {
          emit('delMatOneEvent', row);
          await $grid.remove(row);
          emit('getList');
          useMessage().createMessage.success('删除成功');
        } catch (e) {
          console.log('删除1失败', e);
        }
      }
    }
  };
  //批量删除
  const delTable = async (row: number[]) => {
    const $grid: any = xGrid.value;
    const selectRecords = $grid.getCheckboxRecords();
    if (selectRecords.length > 0) {
      const type = await VXETable.modal.confirm({
        title: '警告',
        status: 'info',
        content: '您确定要删除所选' + selectRecords.length + '数据?',
      });
      if (type === 'confirm') {
        row = [];
        try {
          for (let i = 0; i < selectRecords.length; i++) {
            row.push(selectRecords[i].id);
          }
          emit('delMatBatchEvent', row);
          console.log('dd', row);
          $grid.remove(selectRecords);
          emit('getList');
          createMessage.success('删除成功');
        } catch (e) {
          console.log('删除n失败', e);
        }
      }
    } else {
      createMessage.warning('请至少勾选一条记录。');
    }
  };
  //导出
  const expTable: VxeButtonEvents.Click = () => {
    const $grid: any = xGrid.value;
    $grid.openExport();
    console.log('导出');
  };
  defineExpose({ addTable, delTable, expTable, removeRowEvent, editTable, init });
</script>

<style scoped lang="less">
  .table {
    background-color: #fff;
    height: 700px;
    border: 1px solid #e5e7eb;
    border-bottom: none;
    width: 100%;
    padding: 5px;
  }
  .button-group {
    margin: 5px 0;
  }
  .table-button {
    margin: 2px 5px;
  }
  .pager {
    margin: 0 10px;
    padding: 0 10px;
    border: 2px solid #e5e7eb;
  }
  .input {
    width: 200px;
    margin: 0 10px;
  }
  .form-body {
    padding: 20px;
  }
</style>
