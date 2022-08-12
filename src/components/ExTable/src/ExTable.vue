<template>
  <div>
    <vxe-grid
      ref="xGrid"
      :scroll-x="{ gt: 5 }"
      :scroll-y="{ gt: 50 }"
      v-bind="props.gridOptions"
      :columns="props.columns"
      :export-config="{}"
      :data="tableData.data"
      :show="props.show"
      :treeSelectData="treeSelectData"
      show-overflow="tooltip"
      show-header-overflow
      height="auto"
      class="table"
    >
      <template #toolbar_buttons>
        <div style="width: 100%">
          <AButton
            v-for="(button, key) in buttons"
            :type="button.type !== 'danger' ? button.type : 'default'"
            :key="key"
            :danger="button.type === 'danger'"
            @click="button.onClick()"
            style="margin-right: 10px"
            >{{ button.label }}
          </AButton>
          <span style="float: right">
            <AButton type="default" style="margin: 0 10px" @click="upTable">导入</AButton>
            <AButton style="background-color: rgb(47, 64, 86); color: #fff" @click="expTable"
              >导出</AButton
            >
          </span>
        </div>
      </template>
      <template #number="{ row }">
        <!--        <AButton type="link" @click="editTable(row)">{{ row.number }}</AButton>-->
        <a style="color: #0960bd" @click="editTable(row)">{{ row.number }}</a>
      </template>
      <template #status="{ row }">
        <Tag :color="row.bsStatus === 'B' ? 'processing' : 'default'" v-if="row.bsStatus">{{
          row.bsStatus === 'A' ? '创建' : '已审核'
        }}</Tag>
      </template>
      <template #attr="{ row }"
        >{{ row.attr === 'A' ? '自制' : row.attr === 'B' ? '外购' : '虚拟' }}
      </template>
      <template #operate="{ row }">
        <AButton type="link" class="link" @click="editTable(row)">编辑</AButton>
        <AButton
          v-if="row.bsStatus === 'A'"
          type="link"
          class="link"
          style="width: 54px"
          @click="auditRow(row)"
          >审核</AButton
        >
        <AButton v-if="row.bsStatus === 'B'" type="link" class="link" @click="unAuditRow(row)"
          >反审核</AButton
        >
        <AButton type="link" class="link" danger @click="removeRowEvent(row)" v-show="row.bsStatus"
          >删除</AButton
        >
      </template>
    </vxe-grid>
    <!--    action:	上传的地址  headers：设置上传的请求头部-->
    <template>
      <a-modal v-model:visible="visibleUploadModal" title="上传文件" :footer="null" width="500px">
        <span style="margin: 10px 10px">
          <a-button type="primary" style="margin: 10px 10px">下载模板</a-button>
          <!--                      v-model:file-list="fileList"-->
          <a-upload
            name="file"
            :multiple="true"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            :headers="headers"
            @change="handleChange"
          >
            <a-button>
              <upload-outlined />
              上传文件
            </a-button>
          </a-upload>
        </span>
      </a-modal>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { VXETable, VxeGridInstance, VxeGridProps } from 'vxe-table'; //VxeButtonEvents
  import { Tag, Button, Modal, Upload, message } from 'ant-design-vue';
  import { UploadOutlined } from '@ant-design/icons-vue';
  import { useRouter } from 'vue-router';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  const AButton = Button;
  const AModal = Modal;
  const AUpload = Upload;

  const props = defineProps({
    gridOptions: Object,
    columns: Array,
    buttons: Array,
    count: Number,
    treeSelectData: Number,
    show: Boolean,
  });
  console.log('看看1312312', props.buttons);
  type Emits = {
    (event: 'getList'): void;
    (event: 'expTable'): void;
    (event: 'refreshTable'): void;
    (event: 'delMatOneEvent', row: object): void;
    (event: 'delMatBatchEvent', row: any): void;
    (event: 'auditRowEvent', row: any): void;
    (event: 'auditBatchEvent', row: any): void;
    (event: 'unAuditRowEvent', row: any): void;
    (event: 'unAuditBatchEvent', row: any): void;
  };
  const emit = defineEmits<Emits>();
  const xGrid = ref<VxeGridInstance>();
  const router = useRouter();
  const groupId = ref('');
  const groupName = ref('');
  const visibleUploadModal: any = ref<boolean>(false);
  //获取物料分组
  const setGroupId = (data: string, selectedKeys: string) => {
    groupId.value = data;
    groupName.value = selectedKeys;
    console.log('setting', groupId.value, groupName.value);
  };
  //数据初始化
  const tableData = reactive<any>({ data: [] });
  const init = (data) => {
    tableData.data = data;
  };
  //新增信息
  const addTable = () => {
    console.log('新增groupId', groupId);
    router.push({
      path: '../profile/index',
      //需要带到详情页的参数
      query: {
        groupId: groupId.value == '' ? '' : groupId.value,
        groupName: groupName.value == '' ? '' : groupName.value,
      },
    });
  };
  //编辑
  const editTable = (row: any) => {
    console.log('编辑:', row.id);
    router.push({
      path: '../profile/index',
      query: {
        row: row.id,
      },
    });
  };
  //审核单条
  const auditRow = async (row) => {
    const type = await VXETable.modal.confirm('您确定要审核该数据?');
    const $grid = xGrid.value;
    if ($grid) {
      if (type === 'confirm') {
        if (row.bsStatus == 'A') {
          try {
            emit('auditRowEvent', row);
            useMessage().createMessage.success('审核成功');
            row.bsStatus = 'B';
          } catch (e) {
            console.log('删除1失败', e);
          }
        } else {
          useMessage().createMessage.error('当前状态不能完成【审核】操作');
        }
      }
    }
  };
  //反审核单条
  const unAuditRow = async (row) => {
    const type = await VXETable.modal.confirm('您确定要反审核该数据?');
    const $grid = xGrid.value;
    if ($grid) {
      if (type === 'confirm') {
        if (row.bsStatus == 'B') {
          try {
            emit('unAuditRowEvent', row);
            useMessage().createMessage.success('反审核成功');
            row.bsStatus = 'A';
          } catch (e) {
            console.log('删除1失败', e);
          }
        } else {
          useMessage().createMessage.error('当前状态不能完成【反审核】操作');
        }
      }
    }
  };
  //删除单条
  const removeRowEvent = async (row: any) => {
    //删除确认窗口
    const type = await VXETable.modal.confirm('您确定要删除该数据?');
    const $grid = xGrid.value;
    if ($grid) {
      if (type === 'confirm') {
        if (row.bsStatus == 'A') {
          try {
            emit('delMatOneEvent', row);
            //前端删除更新
            await $grid.remove(row);
            //重新查询数据
            emit('getList');
            useMessage().createMessage.success('删除成功');
          } catch (e) {
            console.log('删除1失败', e);
          }
        } else {
          useMessage().createMessage.error('已审核的资料不可删除');
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
        for (let i = 0; i < selectRecords.length; i++) {
          if (selectRecords[i].bsStatus == 'B') {
            createMessage.error('【已审核】状态的信息不可删除,请检查后重新操作');
            selectRecords.length = 0;
          }
        }
        if (selectRecords.length != 0) {
          try {
            for (let i = 0; i < selectRecords.length; i++) {
              row.push(selectRecords[i].id);
            }
            emit('delMatBatchEvent', row);
            $grid.remove(selectRecords);
            emit('getList');
            createMessage.success('删除成功');
          } catch (e) {
            console.log('删除n失败', e);
          }
        }
      }
    } else {
      createMessage.warning('请至少勾选一条记录。');
    }
  };
  //批量审核
  const auditTable = async (row: number[]) => {
    const $grid: any = xGrid.value;
    const selectRecords = $grid.getCheckboxRecords();
    if (selectRecords.length > 0) {
      const type = await VXETable.modal.confirm({
        title: '警告',
        status: 'info',
        content: '您确定要审核所选' + selectRecords.length + '数据?',
      });
      if (type === 'confirm') {
        row = [];
        try {
          for (let i = 0; i < selectRecords.length; i++) {
            row.push(selectRecords[i].id);
          }
          emit('auditBatchEvent', row);
          for (let i = 0; i < selectRecords.length; i++) {
            $grid.getCheckboxRecords()[i].bsStatus = 'B';
          }
        } catch (e) {
          console.log('审核n失败', e);
        }
      }
      // }
    } else {
      createMessage.warning('请至少勾选一条记录。');
    }
  };
  //批量反审核
  const unAuditTable = async (row: number[]) => {
    const $grid: any = xGrid.value;
    const selectRecords = $grid.getCheckboxRecords();
    if (selectRecords.length > 0) {
      const type = await VXETable.modal.confirm({
        title: '警告',
        status: 'info',
        content: '您确定要反审核所选' + selectRecords.length + '数据?',
      });
      if (type === 'confirm') {
        row = [];
        try {
          for (let i = 0; i < selectRecords.length; i++) {
            row.push(selectRecords[i].id);
          }
          emit('unAuditBatchEvent', row);
          for (let i = 0; i < selectRecords.length; i++) {
            $grid.getCheckboxRecords()[i].bsStatus = 'A';
          }
        } catch (e) {
          console.log('反审核n失败', e);
        }
        // }
      }
    } else {
      createMessage.warning('请至少勾选一条记录。');
    }
  };
  //导入
  const upTable = () => {
    console.log('1111111111111');
    visibleUploadModal.value = true;
  };

  interface FileItem {
    uid: string;
    name?: string;
    status?: string;
    response?: string;
    url?: string;
  }

  interface FileInfo {
    file: FileItem;
    fileList: FileItem[];
  }
  const headers = {
    authorization: 'authorization-text',
  };
  const handleChange = (info: FileInfo) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  //导出
  const expTable = async () => {
    emit('expTable');
  };
  defineExpose({
    addTable,
    delTable,
    auditTable,
    unAuditTable,
    expTable,
    removeRowEvent,
    editTable,
    init,
    setGroupId,
  });
</script>

<style scoped lang="less">
  .table {
    background-color: #fff;
    //border: 1px solid #e5e7eb;
    border-bottom: none;
    width: 100%;
    height: calc(100vh - 250px);
    max-height: 640px;
    //height: calc(100vh - 27rem);
    padding: 0 5px;
  }
  .button-group {
    margin: 5px 0;
  }
  .link {
    padding: 5px;
  }
  .table-button {
    margin: 2px 5px;
  }
  .input {
    width: 200px;
    margin: 0 10px;
  }
  .form-body {
    padding: 20px;
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
