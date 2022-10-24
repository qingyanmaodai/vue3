<template>
  <!--  <div class="table">-->
  <vxe-grid
    style="padding-right: 2px"
    border
    ref="xGrid"
    v-bind="props.gridOptions"
    :columns="props.columns"
    :export-config="{}"
    :data="props.tableData"
    :show="props.show"
    show-overflow
    show-header-overflow
    height="83%"
    auto-resize
    :column-config="{ resizable: true }"
  >
    <template #toolbar_buttons>
      <div style="width: 100%; margin-left: 10px">
        <AButton
          type="primary"
          style="margin-right: 5px"
          @click="addTableEvent"
          v-show="props.isShow"
          >添加</AButton
        >
        <AButton type="primary" style="margin-right: 5px" @click="auditTable" v-show="props.isShow"
          >审核</AButton
        >
        <AButton
          type="default"
          style="margin-right: 5px"
          @click="unAuditTable"
          v-show="props.isShow"
          >反审核</AButton
        >
        <AButton style="margin-right: 5px" @click="delTable" v-show="props.isShow" danger
          >批量删除</AButton
        >
        <AButton
          type="primary"
          style="margin-right: 5px"
          @click="pushDownEvent"
          v-show="props.isPushDown"
          >下推</AButton
        >
        <span style="float: right; padding-right: 10px">
          <AButton
            type="default"
            style="margin: 0 10px"
            @click="upTable"
            v-show="props.isShowImport"
            >导入</AButton
          >
          <AButton
            style="background-color: rgb(47, 64, 86); color: #fff"
            @click="exportTable"
            v-show="props.isShowExport"
            >导出</AButton
          >
        </span>
      </div>
    </template>
    <template #number="{ row }">
      <a style="color: #0960bd" @click="editTableEvent(row)">{{ row.number }}</a>
    </template>
    <template #SupplierLevel="{ row }">
      <Tag v-if="row.level">{{ formatData(row.level, config['SUPPLIER_GRADE']) }}</Tag>
    </template>
    <template #status="{ row }">
      <Tag :color="row.bsStatus === 'B' ? 'processing' : 'default'" v-if="row.bsStatus">{{
        formatData(row.bsStatus, config['DATA_STATUS'])
      }}</Tag>
    </template>
    <template #bsType="{ row }">
      <Tag v-if="row.bsType">{{ formatData(row.bsType, config['UNIT_TYPE']) }}</Tag>
    </template>
    <template #open="{ row }">
      <Tag :color="row.isOpen === 1 ? 'processing' : 'default'">{{
        formatData(row.isOpen, config['ENABLE_STATUS'])
      }}</Tag>
    </template>
    <template #sex="{ row }">
      <Tag>{{ formatData(row.sex, config['GENDER']) }}</Tag>
    </template>
    <template #job="{ row }">
      <Tag>{{ formatData(row.job, config['JOB']) }}</Tag>
    </template>
    <template #way="{ row }">
      <Tag>{{ formatData(row.way, config['INVENTORY_WAY']) }}</Tag>
    </template>
    <template #attr="{ row }">{{ formatData(row.attr, config['MATERIAL_ATTR']) }} </template>
    <template #operate="{ row }">
      <AButton type="link" class="link" @click="editTableEvent(row)">编辑</AButton>
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
  <vxe-modal
    v-model="resultModal"
    id="resultByBatchModal"
    :position="{ top: 20 }"
    show-zoom
    resize
    width="50%"
    @close="closeRes"
  >
    <div>操作完成，共{{ adResult.data.length }}条数据，成功{{ resY }}条，失败{{ resF }}条。</div>
    <vxe-grid
      border
      show-overflow
      :row-style="rowStyle"
      :row-config="{ isHover: true }"
      v-bind="ResultGridOptions"
      :columns="resultByBatchColumns"
      :data="adResult.data"
    >
      <template #batchStatus="{ row }">
        <Tag :color="row.info.status === 'Y' ? 'success' : 'error'" v-if="row.info.status">{{
          row.info.status === 'Y' ? '成功' : '失败'
        }}</Tag>
      </template>
    </vxe-grid>
    <template #title>
      <span>操作结果</span>
    </template>
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
  </vxe-modal>

  <vxe-modal v-model="visibleUploadModal" width="400px" :position="{ top: 40 }">
    <template #title>
      <span>上传文件</span>
    </template>
    <div class="modalCenter" style="text-align: center">
      <a-button type="primary" style="margin: 10px 20px" @click="importModelEvent"
        >下载模板</a-button
      >
      <a-upload :beforeUpload="beforeUpload" :customRequest="uploadFile" @change="handleChange">
        <a-button>
          <upload-outlined />
          上传文件
        </a-button>
      </a-upload>
    </div>
    <br />
    <p style="color: red; text-align: center">提示：仅允许导入‘xls' 或 'xlsx' 格式文件</p>
  </vxe-modal>
  <!--  </div>-->
  <ExPushDownModel
    ref="ExPushDownModelRef"
    :tableName="tableName"
    @pushDownSelect="pushDownSelect"
  />
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { VXETable, VxeGridInstance, VxeTablePropTypes } from 'vxe-table';
  import { Tag, Button, Upload, message } from 'ant-design-vue';
  import { UploadOutlined } from '@ant-design/icons-vue';
  import { resultByBatchColumns, resultGridOptions } from '/@/components/ExTable/data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { OptTableHook } from '/@/api/utilHook';
  import { importData } from '/@/api/public';
  import { config, configEntity } from '/@/utils/publicParamConfig';
  import { ExPushDownModel } from '/@/components/ExPushDownModel';
  import { pushDown } from '/@/api/invCountSheet';
  import { cloneDeep, uniqBy } from 'lodash-es';
  import { getInvList } from '/@/api/realTimeInv';
  import { SearchDataType, SearchLink, SearchMatchType } from '/@/api/apiLink';
  import { useGo } from '/@/hooks/web/usePage';
  // import { ResultEnum } from '/@/enums/httpEnum';
  // import dayjs from 'dayjs';
  // import { Moment } from 'moment';

  //基础信息查询组件ref
  const ExPushDownModelRef: any = ref(null); //
  const { createMessage } = useMessage();
  const AButton = Button;
  const AUpload = Upload;
  const ResultGridOptions = resultGridOptions;

  const props = defineProps({
    gridOptions: Object,
    columns: Array,
    buttons: Array,
    count: Number,
    show: Boolean,
    tableName: String,
    tableData: Array,
    tableURL: String,
    isShowExport: {
      type: Boolean,
      default: true,
    },
    isShowImport: {
      type: Boolean,
      default: true,
    },
    isPushDown: {
      type: Boolean,
      default: true,
    },
    isShow: {
      type: Boolean,
      default: true,
    },
    importConfig: String,
  });
  type Emits = {
    (e: 'addTableEvent'): void;
    (e: 'editTableEvent', row: any): void;
    (e: 'deleteRowEvent', row: object): void;
    (e: 'delBatchEvent', row: any): void;
    (e: 'exportTable'): void;
    (e: 'importModelEvent'): void;
    (e: 'refreshTable'): void; //刷新表格
    (e: 'auditRowEvent', row: any): void;
    (e: 'auditBatchEvent', row: any): void;
    (e: 'unAuditRowEvent', row: any): void;
    (e: 'unAuditBatchEvent', row: any): void;
  };
  const emit = defineEmits<Emits>();
  const xGrid = ref<VxeGridInstance>();

  const visibleUploadModal: any = ref<boolean>(false);
  //批量审核弹框
  let adResult = reactive({ data: {} }); //审核结果数据
  const resultModal = ref(false); //审核结果弹框
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
  // const tableData = reactive<any>({ data: [] });
  const init = (data) => {
    console.log(data);
    // tableData.data = data;
  };

  /**
   * 格式化数据
   * @param data
   * @param source
   */
  const formatData = (data: string | number, source: configEntity[]) => {
    let res;
    if (source && source.length > 0) {
      res = source.find((item) => item.value === data);
    }
    return res ? res.label : '';
  };

  //操作结果输出
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
      resultModal.value = true;
    }
  };
  //新增
  const addTableEvent = () => {
    emit('addTableEvent');
  };
  //编辑
  const editTableEvent = (row: any) => {
    emit('editTableEvent', row);
  };
  //删除单条
  const deleteRowEvent = async (row: any) => {
    //删除确认窗口
    const type = await VXETable.modal.confirm('您确定要删除该数据?(【已审核】状态的数据不可删除)');
    const $grid = xGrid.value;
    if ($grid) {
      if (type === 'confirm') {
        if (row.bsStatus == 'A') {
          try {
            emit('deleteRowEvent', row);
          } catch (e) {
            console.log('删除单条数据失败', e);
          }
        } else {
          createMessage.error('已审核的数据不可删除');
        }
      }
    }
  };
  //批量删除
  const delTable = async () => {
    const $grid: any = xGrid.value;
    const selectRecords = $grid.getCheckboxRecords();
    let okRow: any[] = [];
    if (selectRecords.length > 0) {
      const type = await VXETable.modal.confirm({
        title: '警告',
        status: 'info',
        content:
          '您确定要删除所选的 ' + selectRecords.length + ' 条 数据?(【已审核】状态的数据不可删除)',
      });
      if (type === 'confirm') {
        okRow.push(...selectRecords);
        emit('delBatchEvent', okRow);
      }
    } else {
      createMessage.warning('请至少勾选一条数据。');
    }
  };
  //审核单条
  const auditRow = async (row) => {
    //VXETable自带的弹框
    const type = await VXETable.modal.confirm('您确定要审该数据吗?(【已审核】状态的数据不可审核)');
    const $grid = xGrid.value;
    if ($grid) {
      if (type === 'confirm') {
        try {
          emit('auditRowEvent', row);
        } catch (e) {
          console.log('审核单条数据失败', e);
        }
      }
    }
  };
  //反审核单条
  const unAuditRow = async (row) => {
    const type = await VXETable.modal.confirm(
      '您确定要反审核该数据?(【审核】状态的数据不可反审核)',
    );
    const $grid = xGrid.value;
    if ($grid) {
      if (type === 'confirm') {
        try {
          emit('unAuditRowEvent', row);
        } catch (e) {
          console.log('反审核单条数据失败', e);
        }
      }
    }
  };

  //批量审核
  const auditTable = async () => {
    let okRow: any[] = [];
    const $grid: any = xGrid.value;
    const selectRecords = $grid.getCheckboxRecords();
    if (selectRecords.length > 0) {
      const type = await VXETable.modal.confirm({
        title: '警告',
        status: 'info',
        content:
          '您确定要审核所选 ' + selectRecords.length + ' 条 数据?(【已审核】状态的数据不可审核)',
      });
      if (type === 'confirm') {
        okRow.push(...selectRecords);
        emit('auditBatchEvent', okRow);
      }
    } else {
      createMessage.warning('请至少勾选一条数据。');
    }
  };
  //批量反审核
  const unAuditTable = async () => {
    let okRow: any[] = [];
    const $grid: any = xGrid.value;
    const selectRecords = $grid.getCheckboxRecords();
    if (selectRecords.length > 0) {
      const type = await VXETable.modal.confirm({
        title: '警告',
        status: 'info',
        content:
          '您确定要反审核所选 ' + selectRecords.length + ' 条 数据?(【审核】状态的数据不可反审核)',
      });
      if (type === 'confirm') {
        okRow.push(...selectRecords);
        emit('unAuditBatchEvent', okRow);
      }
    } else {
      createMessage.warning('请至少勾选一条数据。');
    }
  };
  //关闭审核/反审核结果的窗口
  const closeRes = () => {
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
  //dtData封装
  const getdtData = async () => {
    const $grid: any = xGrid.value;
    let selectRecords = $grid.getCheckboxRecords();
    let selectRecords1 = cloneDeep(selectRecords);
    let selectRecords2 = cloneDeep(selectRecords);
    // 放入对象存在matId的值
    const val = selectRecords1.map((item) => {
      if (item.matId) {
        return item.matId;
      }
    });
    // 请求分页查询接口
    let res: any = await getInvList({
      pageRows: 1000000,
      params: [
        {
          table: '',
          name: 'matId',
          column: 'mat_id',
          link: SearchLink.AND,
          rule: SearchMatchType.IN,
          type: SearchDataType.string,
          val: val,
          startWith: '',
          endWith: '',
        },
      ],
    });
    // 遍历数组赋值stockNum
    for (let item of selectRecords2) {
      let filterNum = res.records.filter(
        (e) =>
          e.matId === item.matId &&
          e.stockId === item.stockId &&
          e.compartmentId === item.compartmentId &&
          e.locationId === item.locationId,
      );
      item.stockNum = filterNum ? filterNum[0].stockNum : 0;
    }
    // 根据单号去重
    selectRecords1 = uniqBy(selectRecords1, 'number');
    // 赋值dtData
    for (const item of selectRecords1) {
      item.dtData = [];
      for (const item2 of selectRecords2) {
        if (item2.number === item.number) {
          item2.id = item2.detailId;
          item.dtData.push(item2);
        }
      }
    }
    return selectRecords1;
  };
  const go = useGo();
  //下推功能
  const pushDownSelect = async (pushDownParam) => {
    let selectRecords = await getdtData();
    let res = await pushDown(
      {
        params: selectRecords,
      },
      pushDownParam.tarBillType,
    );
    if (res.dtData.length > 0) {
      createMessage.success('下推成功');
      go({
        name: pushDownParam.routeTo,
        params: { pushDownParam: JSON.stringify(res) },
        // path: PageEnum[pushDownParam.routeTo],
        // query: { pushDownParam: JSON.stringify(res) },
      });
    } else {
      createMessage.error('无法下推到该下游单据/已有下游单据');
    }
  };
  //下推弹框
  const pushDownEvent = async () => {
    const $grid: any = xGrid.value;
    const selectRecords = $grid.getCheckboxRecords();
    if (selectRecords.length > 0) {
      ExPushDownModelRef.value.show();
    } else {
      createMessage.warning('请至少勾选一条数据。');
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
      file.onError();
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
    delTable,
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
    //overflow: auto;
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
  //:deep(.vxe-table .vxe-sort--desc-btn.sort--active) {
  //  color: #409eff;
  //  border-color: #409eff;
  //}
  //:deep(.vxe-table .vxe-sort--asc-btn.sort--active) {
  //  color: #409eff;
  //  border-color: #409eff;
  //}
  :deep(.vxe-toolbar .vxe-tools--operate) {
    margin-right: 10px;
  }
</style>
