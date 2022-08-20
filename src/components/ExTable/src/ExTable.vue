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
            <AButton style="background-color: rgb(47, 64, 86); color: #fff" @click="exportTable"
              >导出</AButton
            >
          </span>
        </div>
      </template>
      <template #number="{ row }">
        <a style="color: #0960bd" @click="editTable(row)">{{ row.number }}</a>
      </template>
      <template #status="{ row }">
        <Tag :color="row.bsStatus === 'B' ? 'processing' : 'default'" v-if="row.bsStatus">{{
          row.bsStatus === 'A' ? '创建' : '已审核'
        }}</Tag>
      </template>
      <template #open="{ row }">
        <Tag :color="row.isOpen === '1' ? 'processing' : 'default'" v-if="row.isOpen">{{
          row.isOpen === '1' ? '启用' : '禁止'
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
        <AButton type="link" class="link" danger @click="deleteRowEvent(row)" v-show="row.bsStatus"
          >删除</AButton
        >
      </template>
    </vxe-grid>
    <a-modal
      v-model:visible="auditModal"
      title="操作结果"
      :footer="null"
      width="800px"
      @cancel="closeRes"
    >
      <div v-if="isAudit"
        >审核完成，共{{ adResult.data.length }}条数据，成功{{ resY }}条，失败{{ resF }}条。</div
      >
      <div v-if="unAudit"
        >反审核完成，共{{ adResult.data.length }}条数据，成功{{ resY }}条，失败{{ resF }}条。</div
      >
      <vxe-table
        border
        show-overflow
        :row-style="rowStyle"
        :row-config="{ isHover: true }"
        :data="adResult.data"
      >
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column field="info.title" title="关键字" width="180" />
        <vxe-column field="info.status" title="状态" width="80">
          <template #default="{ row }">
            <Tag :color="row.info.status === 'Y' ? 'success' : 'error'" v-if="row.info.status">{{
              row.info.status === 'Y' ? '成功' : '失败'
            }}</Tag>
          </template>
        </vxe-column>
        <vxe-column field="info.msg" title="信息" />
        <vxe-column field="info.type" title="信息类型" width="80" />
      </vxe-table>
      <vxe-pager
        background
        :total="adResult.data.length"
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
      />
    </a-modal>

    <!--    action:	上传的地址  headers：设置上传的请求头部-->
    <a-modal v-model:visible="visibleUploadModal" title="上传文件" :footer="null" width="500px">
      <span style="margin: 10px 10px">
        <a-button type="primary" style="margin: 10px 10px" @click="importModelEvent"
          >下载模板</a-button
        >
        <!--                      v-model:file-list="fileList"-->
        <a-upload :beforeUpload="beforeUpload" :customRequest="uploadFile" @change="handleChange">
          <a-button>
            <upload-outlined />
            上传文件
          </a-button>
        </a-upload>
      </span>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { VXETable, VxeGridInstance, VxeTablePropTypes } from 'vxe-table';
  import { Tag, Button, Modal, Upload, message } from 'ant-design-vue';
  import { UploadOutlined } from '@ant-design/icons-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { OptTableHook } from '/@/api/utilHook';
  import { importData } from '/@/api/public';
  // import { useRouter } from 'vue-router';
  // const router = useRouter();

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
    importConfig: String,
  });
  type Emits = {
    (e: 'addEvent'): void;
    (e: 'editEvent', row: any): void;
    (e: 'deleteRowEvent', row: object): void;
    (e: 'delBatchEvent', row: any): void;
    (e: 'exportTable'): void;
    (e: 'importModelEvent'): void;
    (e: 'refreshTable'): void;
    (e: 'auditRowEvent', row: any): void;
    (e: 'auditBatchEvent', row: any): void;
    (e: 'unAuditRowEvent', row: any): void;
    (e: 'unAuditBatchEvent', row: any): void;
  };
  const emit = defineEmits<Emits>();
  const xGrid = ref<VxeGridInstance>();

  const visibleUploadModal: any = ref<boolean>(false);
  //批量审核弹框
  const isAudit = ref(false); //审核
  const unAudit = ref(false); //反审核
  let adResult = reactive({ data: {} }); //审核结果数据
  const auditModal = ref(false); //审核结果弹框
  let resY = ref(0); //审核成功
  let resF = ref(0); //审核失败

  //上传文件
  interface FileItem {
    uid: string;
    name?: string;
    status?: string;
    response?: string;
    url?: string;
    error?: string;
  }

  //上传文件后状态
  interface FileInfo {
    file: FileItem;
    fileList: FileItem[];
  }
  //数据初始化
  const tableData = reactive<any>({ data: [] });
  const init = (data) => {
    tableData.data = data;
  };
  //新增
  const addTable = () => {
    emit('addEvent');
  };
  //编辑
  const editTable = (row: any) => {
    emit('editEvent', row);
  };

  //删除单条
  const deleteRowEvent = async (row: any) => {
    //删除确认窗口
    const type = await VXETable.modal.confirm('您确定要删除该数据?');
    const $grid = xGrid.value;
    if ($grid) {
      if (type === 'confirm') {
        if (row.bsStatus == 'A') {
          try {
            emit('deleteRowEvent', row);
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
            emit('delBatchEvent', row);
            createMessage.success('删除成功');
          } catch (e) {
            console.log('删除多条失败', e);
          }
        }
      }
    } else {
      createMessage.warning('请至少勾选一条记录。');
    }
  };
  //审核单条
  const auditRow = async (row) => {
    //VXETable自带的弹框
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
            console.log('审核单条失败', e);
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
            console.log('反审核单条失败', e);
          }
        } else {
          useMessage().createMessage.error('当前状态不能完成【反审核】操作');
        }
      }
    }
  };
  //批量审核或反审核结果输出
  const computeData = (res) => {
    if (res) {
      adResult.data = res;
      let arr = res;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].info.status == 'Y') {
          resY.value += 1;
        } else {
          resF.value += 1;
        }
      }
      auditModal.value = true;
      isAudit.value = true;
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
          console.log('审核多条失败', e);
        }
      }
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
          console.log('反审核多条失败', e);
        }
      }
    } else {
      createMessage.warning('请至少勾选一条记录。');
    }
  };
  //关闭审核/反审核结果的窗口
  const closeRes = () => {
    unAudit.value = false;
    isAudit.value = false;
    resY.value = 0;
    resF.value = 0;
  };
  //结果表格颜色
  const rowStyle: VxeTablePropTypes.RowStyle = ({ row }) => {
    if (row.info.status == 'F') {
      return {
        backgroundColor: '#f5f7fa',
        color: 'red',
      };
    }
  };

  //上传文件前的判断
  const beforeUpload = (file, UpFileList) => {
    console.log(file, UpFileList);
    //控制上传文件的类型 arr是上传类型的白名单
    const type = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase();
    const arr = ['.xls', '.xlsx'];
    if (arr.includes('.' + type)) {
      return true;
    } else {
      createMessage.warning(`不支持以 .${type} 扩展类型的文件或图片上传!`);
      file.status = 'error';
      return false;
    }
  };
  //上传文件后状态判断以及表格刷新
  const handleChange = (info: FileInfo) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.response}`);
      //重新加载表格数据
      emit('refreshTable');
    } else if (info.file.status === 'error') {
      info.fileList = [];
      message.error(`${info.file.error}`);
    }
  };
  //上传文件
  const uploadFile = async (file) => {
    const form = new FormData();
    form.append('file', file.file);
    //获取上传进度
    const onUploadProgress = (progressEvent) => {
      let progressPercent = parseInt(
        ((progressEvent.loaded / progressEvent.total) * 100).toFixed(2),
      );
      file.onProgress({ percent: progressPercent });
    };
    // 调用上传接口
    let url = props.importConfig || '';
    const res: any = await importData(url, { file: file.file }, onUploadProgress);
    console.log(res.data, 'result');
    if (res.data.code !== 200) {
      file.status = 'error';
      file.onError(res.data.message);
    } else {
      file.status = 'done';
      file.onSuccess(res.data.message);
    }
  };
  //下载模板
  const importModelEvent = async () => {
    emit('importModelEvent');
    OptTableHook.importModel().then((res: any) => {
      //“URL.createObjectURL()方法会根据传入的参数创建一个指向该参数对象的URL. 这个URL的生命仅存在于它被创建的这个文档里.
      let url = window.URL.createObjectURL(
        new Blob([res.data], { type: 'application/vnd.ms-excel' }),
      );
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', res.title);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    });
  };
  //导入
  const upTable = () => {
    visibleUploadModal.value = true;
  };
  //导出
  const exportTable = async () => {
    emit('exportTable');
    OptTableHook.exportExcel().then((res: any) => {
      //“URL.createObjectURL()方法会根据传入的参数创建一个指向该参数对象的URL. 这个URL的生命仅存在于它被创建的这个文档里.
      let url = window.URL.createObjectURL(
        new Blob([res.data], { type: 'application/vnd.ms-excel' }),
      );
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', res.title);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    });
  };
  defineExpose({
    addTable,
    delTable,
    auditTable,
    unAuditTable,
    // exportTable,
    editTable,
    init,
    computeData,
  });
</script>

<style scoped lang="less">
  .table {
    background-color: #fff;
    border-bottom: none;
    width: 100%;
    height: calc(100vh - 250px);
    max-height: 640px;
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
