<template>
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
    :height="props.height"
    auto-resize
    :column-config="{ resizable: true }"
    @cell-dblclick="cellClickEvent"
  >
    <template #toolbar_buttons>
      <div style="width: 100%; margin-left: 10px">
        <AButton
          type="primary"
          style="margin-right: 5px"
          @click="addTableEvent"
          v-show="props.isAddShow"
          >添加</AButton
        >
        <AButton
          type="primary"
          style="margin-right: 5px"
          @click="auditTable"
          v-show="props.isAuditShow"
          >审核</AButton
        >
        <AButton
          type="default"
          style="margin-right: 5px"
          @click="unAuditTable"
          v-show="props.isUnAuditShow"
          >反审核</AButton
        >
        <AButton style="margin-right: 5px" @click="delTable" v-show="props.isDeleteShow" danger
          >批量删除</AButton
        >
        <AButton
          type="primary"
          style="margin-right: 5px"
          @click="pushDownEvent"
          v-show="props.isPushDown"
          >下推</AButton
        >
        <a-dropdown v-if="props.isRelatedShow">
          <a-button type="primary" style="margin-right: 5px">
            关联查询
            <a-down-outlined />
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item
                v-for="item in config.LINK_QUERY"
                :key="item.value"
                @click="linkQuerySelect(item)"
              >
                {{ item.label }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-dropdown v-if="props.isOrderShow">
          <a-button type="primary" style="margin-right: 5px">
            业务操作
            <a-down-outlined />
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item
                v-for="item in config.ORDER_QUERY"
                :key="item.value"
                @click="OrderSelect(item)"
              >
                {{ item.label }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
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
      <Tag v-if="row.level">{{ formatData(row.level, config['SUPPLIER_GRADE'])['label'] }}</Tag>
    </template>
    <template #status="{ row }">
      <Tag :color="formatData(row.bsStatus, config['DATA_STATUS'])['color']" v-if="row.bsStatus">{{
        formatData(row.bsStatus, config['DATA_STATUS'])['label']
      }}</Tag>
    </template>
    <template #bsType="{ row }">
      <Tag v-if="row.bsType">{{ formatData(row.bsType, config['UNIT_TYPE'])['label'] }}</Tag>
    </template>
    <template #open="{ row }">
      <Tag
        :color="row.isOpen === 1 ? 'processing' : 'default'"
        v-if="row.isOpen || row.isOpen == 0"
        >{{ formatData(row.isOpen, config['ENABLE_STATUS'])['label'] }}</Tag
      >
    </template>
    <template #sex="{ row }">
      <Tag v-if="row.sex || row.sex == 0">{{ formatData(row.sex, config['GENDER'])['label'] }}</Tag>
    </template>
    <template #job="{ row }">
      <Tag v-if="row.job">{{ formatData(row.job, config['JOB'])['label'] }}</Tag>
    </template>
    <template #way="{ row }">
      <Tag v-if="row.way">{{ formatData(row.way, config['INVENTORY_WAY'])['label'] }}</Tag>
    </template>
    <template #proMoStatus="{ row }">
      <Tag
        :color="formatData(row.proMoStatus, config['PRODUCT_STATUS'])['color']"
        v-if="row.proMoStatus"
        >{{ formatData(row.proMoStatus, config['PRODUCT_STATUS'])['label'] }}</Tag
      >
    </template>
    <template #attr="{ row }"
      >{{ formatData(row.attr, config['MATERIAL_ATTR'])['label'] }}
    </template>
    <template #bsDate="{ row }">{{ formatDate(row.bsDate) }} </template>
    <template #billType="{ row }"
      ><Tag v-if="row.billType">{{
        formatData(row.billType, config['BILL_TYPE'])['label']
      }}</Tag></template
    >
    <template #returnReason="{ row }"
      ><Tag v-if="row.returnReason">{{
        formatData(row.returnReason, config['RETURN_REASON'])['label']
      }}</Tag></template
    >
    <template #returnCause="{ row }"
      ><Tag v-if="row.returnCause">{{
        formatData(row.returnCause, config['PRO_RETURN_REASON'])['label']
      }}</Tag></template
    >
    <template #tag="{ row }"
      ><Tag>{{ formatData(row.tag, config['TAG'])['label'] }}</Tag></template
    >
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
    <template #operateOfStock="{ row }">
      <AButton type="link" class="link" @click="checkEvent(row, 'PreUse')">预用来源</AButton>
      <AButton type="link" class="link" @click="checkEvent(row, 'Stock')">明细</AButton>
    </template>
  </vxe-grid>
  <div>
    <Pager
      background
      v-model:current-page="tablePage.currentPage"
      v-model:page-size="tablePage.pageSize"
      :total="tablePage.total"
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
      @page-change="tablePagerChange"
      style="width: calc(100% - 5px); height: 42px; margin: 5px 0px"
    />
  </div>
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
</template>

<script lang="ts" setup>
  import {
    Pager,
    VXETable,
    VxeGridInstance,
    VxeTablePropTypes,
    VxePagerEvents,
    VxeGridEvents,
  } from 'vxe-table';
  import { computed, reactive, ref } from 'vue';
  import { Tag, Button, Upload, message, Dropdown, MenuItem, Menu } from 'ant-design-vue';
  import { UploadOutlined, DownOutlined } from '@ant-design/icons-vue';
  import { resultByBatchColumns, resultGridOptions } from '/@/components/ExTable/data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { OptTableHook } from '/@/api/utilHook';
  import { importData } from '/@/api/public';
  import { config, configEntity } from '/@/utils/publicParamConfig';
  import { cloneDeep, uniqBy } from 'lodash-es';
  import XEUtils from 'xe-utils';

  const { createMessage } = useMessage();
  const AButton = Button;
  const AUpload = Upload;
  const ResultGridOptions = resultGridOptions;
  const ADownOutlined = DownOutlined;
  const AMenuItem = MenuItem;
  const ADropdown = Dropdown;
  const AMenu = Menu;
  interface ProType {
    gridOptions?: object;
    height?: string;
    columns?: any[];
    show?: boolean;
    tableName?: string;
    tableData?: any[];
    isAddShow?: boolean;
    isAuditShow?: boolean;
    isUnAuditShow?: boolean;
    isDeleteShow?: boolean;
    isRelatedShow?: boolean;
    isPushDown?: boolean;
    isShowExport?: boolean;
    isShowImport?: boolean;
    importConfig?: string;
    isOrderShow?: boolean;
    urlConfig?: string;
    tablePages?: TableType;
  }
  type TableType = {
    total: number;
    currentPage: number;
    pageSize: number;
  };
  const props = withDefaults(defineProps<ProType>(), {
    tableName: '',
    show: true,
    isAddShow: true,
    isAuditShow: true,
    isUnAuditShow: true,
    isDeleteShow: true,
    isRelatedShow: true,
    isPushDown: true,
    isShowExport: true,
    isShowImport: true,
    isOrderShow: false,
    height: '83%',
    tablePages: () => {
      return {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      };
    },
    columns: () => {
      return [];
    },
    tableData: () => {
      return [];
    },
  });
  type Emits = {
    (e: 'addTableEvent'): void;
    (e: 'editTableEvent', row: any): void;
    (e: 'deleteRowEvent', row: object): void;
    (e: 'delBatchEvent', selectRecords: any): void;
    (e: 'exportTable'): void;
    (e: 'importModelEvent'): void;
    (e: 'getList', currPage?: number, pageSize?: number, url?: string): void; //刷新表格
    (e: 'auditRowEvent', row: any): void;
    (e: 'auditBatchEvent', selectRecords: any): void;
    (e: 'unAuditRowEvent', row: any): void;
    (e: 'unAuditBatchEvent', row: any): void;
    (e: 'pushDownEvent', selectRecords: any): void;
    (e: 'createOrderEvent', selectRecords: any): void;
    (e: 'queryOrderEvent', row: any): void;
    (e: 'updownSearchEvent', row: any, choice: string): void;
    (e: 'basicClickEvent', data: object): void; //表格双击事件
    (e: 'checkDetailEvent', row: any, type: string): any;
  };
  const tablePage = computed(() => {
    return props.tablePages;
  });
  const emit = defineEmits<Emits>();
  const cellClickEvent: VxeGridEvents.CellClick = (row) => {
    emit('basicClickEvent', row.row);
  };
  const xGrid = ref<VxeGridInstance>();

  const visibleUploadModal: any = ref<boolean>(false);
  //批量审核弹框
  let adResult = reactive({ data: {} }); //审核结果数据
  const resultModal = ref(false); //审核结果弹框
  let resY = ref(0); //审核成功
  let resF = ref(0); //审核失败

  const tablePagerChange: VxePagerEvents.PageChange = ({ currentPage, pageSize }) => {
    emit('getList', currentPage, pageSize, props.urlConfig);
  };
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
  };
  /*约定 A是上查，B是下查*/
  const linkQuerySelect = async (item) => {
    let selectRecords = await getListData();
    if (selectRecords.length > 0) {
      switch (item.value) {
        case 'A':
          emit('updownSearchEvent', selectRecords, 'A');
          break;
        case 'B':
          emit('updownSearchEvent', selectRecords, 'B');
          break;
      }
    } else {
      createMessage.warning('请至少勾选一条数据。');
    }
  };
  //业务操作
  const OrderSelect = async (item) => {
    let selectRecords = await getDtData();
    if (selectRecords.length === 1) {
      switch (item.value) {
        case 'A':
          emit('createOrderEvent', selectRecords);
          break;
        case 'B':
          emit('queryOrderEvent', selectRecords[0]);
          break;
      }
    } else {
      createMessage.warning('只能勾选一条数据');
    }
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
    return res ? res : '';
  };
  const formatDate = (value: any) => {
    if (value) {
      return XEUtils.toDateString(value, 'yyyy-MM-dd');
    } else {
      return '';
    }
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
  //获取勾选的列表值
  const getListData = async () => {
    const $grid: any = xGrid.value;
    let selectRecords = $grid.getCheckboxRecords();
    preSelectRecords = selectRecords.length;
    return selectRecords;
  };
  let preSelectRecords = 1; //保存选中的数组长度
  //dtData封装
  const getDtData = async () => {
    let selectRecords = await getListData();
    let selectRecords1 = cloneDeep(selectRecords);
    let selectRecords2 = cloneDeep(selectRecords);
    // 根据单号去重
    selectRecords1 = uniqBy(selectRecords1, 'number');
    // 赋值dtData
    for (const item of selectRecords1) {
      item.dtData = [];
      for (const item2 of selectRecords2) {
        if (item2.number === item.number) {
          item2.id = item2.detailId;
          item2.bsStatus = 'A';
          item.dtData.push(item2);
        }
      }
    }
    return selectRecords1;
  };
  //查看预用来源
  const checkEvent = (row: any, type: string) => {
    emit('checkDetailEvent', row, type);
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
  };
  //批量删除
  const delTable = async () => {
    let selectRecords = await getListData();
    if (preSelectRecords > 0) {
      const type = await VXETable.modal.confirm({
        title: '警告',
        status: 'info',
        content:
          '您确定要删除所选的 ' + preSelectRecords + ' 条 数据?(【已审核】状态的数据不可删除)',
      });
      if (type === 'confirm') {
        emit('delBatchEvent', selectRecords);
      }
    } else {
      createMessage.warning('请至少勾选一条数据。');
    }
  };
  //审核单条
  const auditRow = async (row) => {
    //VXETable自带的弹框
    const type = await VXETable.modal.confirm(
      '您确定要审核该数据吗?(【已审核】状态的数据不可审核)',
    );
    if (type === 'confirm') {
      try {
        emit('auditRowEvent', row);
      } catch (e) {
        console.log('审核单条数据失败', e);
      }
    }
  };
  //反审核单条
  const unAuditRow = async (row) => {
    const type = await VXETable.modal.confirm(
      '您确定要反审核该数据?(【创建】状态的数据不可反审核)',
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
    let selectRecords = await getListData();
    if (preSelectRecords > 0) {
      const type = await VXETable.modal.confirm({
        title: '警告',
        status: 'info',
        content: '您确定要审核所选 ' + preSelectRecords + ' 条 数据?(【已审核】状态的数据不可审核)',
      });
      if (type === 'confirm') {
        emit('auditBatchEvent', selectRecords);
      }
    } else {
      createMessage.warning('请至少勾选一条数据。');
    }
  };
  //批量反审核
  const unAuditTable = async () => {
    let selectRecords = await getListData();
    if (preSelectRecords > 0) {
      const type = await VXETable.modal.confirm({
        title: '警告',
        status: 'info',
        content:
          '您确定要反审核所选 ' + preSelectRecords + ' 条 数据?(【创建】状态的数据不可反审核)',
      });
      if (type === 'confirm') {
        emit('unAuditBatchEvent', selectRecords);
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
  //下推弹框
  const pushDownEvent = async () => {
    let selectRecords = await getDtData();
    if (selectRecords.length > 0) {
      emit('pushDownEvent', selectRecords);
    } else {
      createMessage.warning('请至少勾选一条数据。');
    }
  };
  //上传文件前的判断
  const beforeUpload = (file, UpFileList) => {
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
      emit('getList');
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
  :deep(.vxe-toolbar .vxe-tools--operate) {
    margin-right: 10px;
  }
</style>
