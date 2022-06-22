<template>
  <div name="pdiv">
    <Card>
      <Form :model="formState" :label-col="labelCol" :layout="formState.layout">
        <FormItem class="fromitem" label="序列号" :required="true">
          <Input v-model:value="formState.sn" placeholder="序列号" />
        </FormItem>
        <FormItem class="fromitem" label="物料编码">
          <Input v-model:value="formState.wlbm" placeholder="物料编码" disabled />
        </FormItem>
        <FormItem class="fromitem" label="国家码">
          <Input v-model:value="formState.gjm" placeholder="国家码" disabled />
        </FormItem>
        <FormItem class="fromitem" label="产品名称">
          <InPutTextArea v-model:value="formState.cpmc" placeholder="产品名称" disabled :rows="1" />
        </FormItem>
        <FormItem class="fromitem" label="产品规格">
          <Input v-model:value="formState.cpgg" placeholder="产品规格" disabled />
        </FormItem>
        <FormItem class="fromitem" label="产品颜色">
          <Input v-model:value="formState.cpys" placeholder="产品颜色" disabled />
        </FormItem>
        <FormItem class="fromitem" label="箱规">
          <Input v-model:value="formState.xg" placeholder="箱规" disabled />
        </FormItem>
        <FormItem class="fromitem">
          <Button class="buttontou" type="primary" @click="querySY">查询追溯</Button>
          <Button class="buttontou" type="primary" @click="showModalandPackageRemove"
            >查询包装拆卸记录</Button
          >
        </FormItem>
      </Form>
    </Card>
    <Card title="序列号追溯查询" style="margin-top: 10px">
      <Table
        :columns="columns1.data"
        rowKey="djbh"
        :dataSource="dataSource1.data"
        :pagination="false"
        :scroll="{ x: 'calc(700px + 60%)', y: 400 }"
      />
      <Pagination
        style="margin-top: 15px"
        v-model:current="current1"
        :page-size-options="pageSizeOptions1"
        :total="total1"
        show-size-changer
        show-quick-jumper
        @change="pageChange1"
        :page-size="pageSizeRef1"
        :show-total="(total) => `共 ${total1} 条`"
        @showSizeChange="onShowSizeChange1"
      >
        <template #buildOptionText="props">
          <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
          <span v-else>全部</span>
        </template>
      </Pagination>
    </Card>
    <Modal
      v-model:visible="visible"
      title="拆包记录明细"
      @ok="handleOk"
      width="80%"
      wrapClassName="pdiv"
      :footer="null"
    >
      <Card>
        <Table
          :columns="columns2.data"
          rowKey="f_ymkj_wlbm"
          :dataSource="dataSource2.data"
          :pagination="false"
          :scroll="{ x: 'calc(700px + 50%)', y: 600 }"
        />
        <Pagination
          style="margin-top: 15px"
          v-model:current="current2"
          :page-size-options="pageSizeOptions2"
          :total="total2"
          show-size-changer
          show-quick-jumper
          @change="pageChange2"
          :page-size="pageSizeRef2"
          :show-total="(total) => `共 ${total2} 条`"
          @showSizeChange="onShowSizeChange2"
        >
          <template #buildOptionText="props">
            <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
            <span v-else>全部</span>
          </template>
        </Pagination>
      </Card>
    </Modal>
  </div>
</template>
<script lang="ts">
  import { Input } from 'ant-design-vue';
  export default {
    components: {
      InPutTextArea: Input.TextArea,
    },
  };
</script>
<script lang="ts" setup>
  import {
    getwlbmandxlh,
    findtracesthequeryInfo,
    findPackageRemove,
  } from '/@/api/sys/tracesthequery';
  import { useUserStore } from '/@/store/modules/user';
  import { reactive, UnwrapRef, ref, computed } from 'vue';
  import {
    Form,
    FormItem,
    Button,
    Input,
    Table,
    Tag,
    Modal,
    message,
    Card,
    Pagination,
  } from 'ant-design-vue';

  //当前登录用户信息
  const userStore = useUserStore();
  const funDepartNumber = computed(() => userStore.getPdaUserInfo.funDepartNumber);

  //表单参数
  const labelCol = reactive({ span: 10, style: { width: '100px' } });
  interface FormState {
    //基本参数
    gjm: String;
    cpmc: String;
    cpgg: String;
    cpys: String;
    xg: String;
    sn: String;
    wlbm: String;
    username: String;
    password: String;
    //配置参数
    layout: string;
  }
  const formState: UnwrapRef<FormState> = reactive({
    //基本参数
    gjm: '',
    cpmc: '',
    cpgg: '',
    cpys: '',
    xg: '',
    sn: '',
    wlbm: '',
    username: '',
    password: '',
    //配置参数
    layout: 'inline',
  });

  //追溯查询表格参数
  const current1 = ref(1);
  const pageSizeRef1 = ref(10);
  let total1 = ref(0);
  const pageSizeOptions1 = ref<string[]>(['10', '20', '30', '40', '50']);
  const dataSource1 = reactive<any>({
    data: [],
  });
  const columns1 = reactive<any>({
    data: [
      {
        title: '单据类型',
      },
      {
        title: '单据编号',
      },
      {
        title: '日期',
      },
      {
        title: '供应商',
      },
      {
        title: '客户名称',
      },
      {
        title: '部门',
      },
      {
        title: '方向',
      },
      {
        title: '线上订单号',
      },
      {
        title: '内部订单号',
      },
    ],
  });
  const colspany1 = reactive<any>({
    data: {
      bm: 1,
      xsckdddbh: 1,
      xsckdxsddh: 1,
      gysmc: 1,
      khmc: 1,
      dbfx: 1,
    },
  });

  interface queryCondition1 {
    params: {
      sn: String;
      wlbm: String;
      funDepartNumber: String;
    };
    pageIndex: number;
    pageRows: number;
  }
  const queryCondition1: UnwrapRef<queryCondition1> = reactive({
    // 查询条件
    params: {
      sn: '',
      wlbm: '',
      funDepartNumber: '',
    },
    pageIndex: current1.value,
    pageRows: pageSizeRef1.value,
  });

  //拆包记录查询表格参数
  const current2 = ref(1);
  const pageSizeRef2 = ref(10);
  let total2 = ref(0);
  const pageSizeOptions2 = ref<string[]>(['10', '20', '30', '40', '50']);
  const dataSource2 = reactive<any>({
    data: [],
  });
  const columns2 = reactive<any>({
    data: [
      {
        title: '操作类型',
        dataIndex: 'f_ymkj_czjl',
        key: 'f_ymkj_czjl',
      },
      {
        title: '业务日期',
        dataIndex: 'fdate',
        key: 'fdate',
      },
      {
        title: '物料编码',
        dataIndex: 'f_ymkj_wlbm',
        key: 'f_ymkj_wlbm',
      },
      {
        title: '物料名称',
        dataIndex: 'wlmc',
        key: 'wlmc',
      },
      {
        title: '产品规格',
        dataIndex: 'cpgg',
        key: 'cpgg',
      },
      {
        title: '外箱BZ码',
        dataIndex: 'f_ymkj_dbzm',
        key: 'f_ymkj_dbzm',
      },
      {
        title: '彩盒CH码',
        dataIndex: 'f_ymkj_xbzm',
        key: 'f_ymkj_xbzm',
      },
      {
        title: '裸机SN码',
        dataIndex: 'f_ymkj_ljm',
        key: 'f_ymkj_ljm',
      },
      {
        title: '数量',
        dataIndex: 'f_ymkj_sl',
        key: 'f_ymkj_sl',
      },
    ],
  });
  interface queryCondition_cb {
    params: {
      sn: String;
      wlbm: String;
      funDepartNumber: String;
    };
    pageIndex: number;
    pageRows: number;
  }
  const queryCondition_cb: UnwrapRef<queryCondition_cb> = reactive({
    // 查询条件
    params: {
      sn: '',
      wlbm: '',
      funDepartNumber: '',
    },
    pageIndex: current2.value,
    pageRows: pageSizeRef2.value,
  });

  //可复用数组
  const dataSource1new = reactive<any>({
    data: [],
  });
  const dataSource1new_number = reactive<any>({
    data: [],
  });

  //追溯查询
  const zsSelect = async () => {
    const tracesthequeryInfo = await findtracesthequeryInfo(queryCondition1);
    if (tracesthequeryInfo.pagingresult.length === 0) {
      dataSource1.data = [];
      dataSource1new.data = [];
      dataSource1new_number.data = [];
    } else {
      dataSource1.data = [];
      dataSource1new.data = [];
      dataSource1new_number.data = [];
      for (var i = 0; i < tracesthequeryInfo.pagingresult.length; i++) {
        //if (funDepartNumber.value == '001' || funDepartNumber.value == '') {}
        if (funDepartNumber.value == '002') {
          if (
            tracesthequeryInfo.pagingresult[i].fopt == 'PueOrder' ||
            tracesthequeryInfo.pagingresult[i].fopt == 'SaleOut' ||
            tracesthequeryInfo.pagingresult[i].fopt == 'SaleReturn' ||
            tracesthequeryInfo.pagingresult[i].fopt == 'OtherOut' ||
            tracesthequeryInfo.pagingresult[i].fopt == 'OtherIn'
          ) {
            dataSource1new.data.push(tracesthequeryInfo.pagingresult[i]);
          }
        } else if (funDepartNumber.value == '003') {
          if (
            tracesthequeryInfo.pagingresult[i].fopt == 'PueOrder' ||
            tracesthequeryInfo.pagingresult[i].fopt == 'PurIn'
          ) {
            dataSource1new.data.push(tracesthequeryInfo.pagingresult[i]);
          }
        } else {
          dataSource1new.data.push(tracesthequeryInfo.pagingresult[i]);
        }
      }
      for (var i = 0; i < tracesthequeryInfo.nopagingresult.length; i++) {
        if (funDepartNumber.value == '002') {
          if (
            tracesthequeryInfo.nopagingresult[i].fopt == 'PueOrder' ||
            tracesthequeryInfo.nopagingresult[i].fopt == 'SaleOut' ||
            tracesthequeryInfo.nopagingresult[i].fopt == 'SaleReturn' ||
            tracesthequeryInfo.nopagingresult[i].fopt == 'OtherOut' ||
            tracesthequeryInfo.nopagingresult[i].fopt == 'OtherIn'
          ) {
            dataSource1new_number.data.push(tracesthequeryInfo.nopagingresult[i]);
          }
        } else if (funDepartNumber.value == '003') {
          if (
            tracesthequeryInfo.nopagingresult[i].fopt == 'PueOrder' ||
            tracesthequeryInfo.nopagingresult[i].fopt == 'PurIn'
          ) {
            dataSource1new_number.data.push(tracesthequeryInfo.nopagingresult[i]);
          }
        } else {
          dataSource1new_number.data.push(tracesthequeryInfo.nopagingresult[i]);
        }
      }

      //判断对应列是否所有行的数据都为null
      //部门
      for (let i in dataSource1new.data) {
        if (
          dataSource1new.data[i].bm === null ||
          dataSource1new.data[i].bm === ' ' ||
          dataSource1new.data[i].bm === ''
        ) {
          colspany1.data.bm = 0;
        } else {
          colspany1.data.bm = 1;
          break;
        }
      }
      //线上订单号and线下订单号
      for (let i in dataSource1new.data) {
        if (dataSource1new.data[i].tableName !== 'T_SAL_OUTSTOCK') {
          colspany1.data.xsckdddbh = 0;
          colspany1.data.xsckdxsddh = 0;
        } else {
          colspany1.data.xsckdddbh = 1;
          colspany1.data.xsckdxsddh = 1;
          break;
        }
      }
      //供应商名称
      for (let i in dataSource1new.data) {
        if (
          dataSource1new.data[i].gysmc === null ||
          dataSource1new.data[i].gysmc === ' ' ||
          dataSource1new.data[i].gysmc === ''
        ) {
          colspany1.data.gysmc = 0;
        } else {
          colspany1.data.gysmc = 1;
          break;
        }
      }
      //客户名称
      for (let i in dataSource1new.data) {
        if (
          dataSource1new.data[i].khmc === null ||
          dataSource1new.data[i].khmc === ' ' ||
          dataSource1new.data[i].khmc === ''
        ) {
          colspany1.data.khmc = 0;
        } else {
          colspany1.data.khmc = 1;
          break;
        }
      }
      //方向
      for (let i in dataSource1new.data) {
        if (
          dataSource1new.data[i].dbfx === null ||
          dataSource1new.data[i].dbfx === ' ' ||
          dataSource1new.data[i].dbfx === ''
        ) {
          colspany1.data.dbfx = 0;
        } else {
          colspany1.data.dbfx = 1;
          break;
        }
      }

      columns1.data = [
        {
          title: '单据类型',
          dataIndex: 'djlx',
          key: 'djlx',
        },
        {
          title: '单据编号',
          dataIndex: 'djbh',
          key: 'djbh',
        },
        {
          title: '日期',
          dataIndex: 'fdate',
          key: 'fdate',
        },
        {
          title: colspany1.data.gysmc == '1' ? '供应商' : '',
          width: colspany1.data.gysmc == '1' ? '' : '0px',
          dataIndex: 'gysmc',
          key: 'gysmc',
        },
        {
          title: colspany1.data.khmc == '1' ? '客户名称' : '',
          width: colspany1.data.khmc == '1' ? '' : '0px',
          dataIndex: 'khmc',
          key: 'khmc',
        },
        {
          title: colspany1.data.bm == '1' ? '部门' : '',
          width: colspany1.data.bm == '1' ? '' : '0px',
          dataIndex: 'bm',
          key: 'bm',
        },
        {
          title: colspany1.data.dbfx == '1' ? '方向' : '',
          width: colspany1.data.dbfx == '1' ? '' : '0px',
          dataIndex: 'dbfx',
          key: 'dbfx',
        },
        {
          title: colspany1.data.xsckdxsddh == '1' ? '线上订单号' : '',
          width: colspany1.data.xsckdxsddh == '1' ? '' : '0px',
          dataIndex: 'xsckdxsddh',
          key: 'xsckdxsddh',
        },
        {
          title: colspany1.data.xsckdddbh == '1' ? '内部订单号' : '',
          width: colspany1.data.xsckdddbh == '1' ? '' : '0px',
          dataIndex: 'xsckdddbh',
          key: 'xsckdddbh',
        },
      ];

      total1.value = parseInt(dataSource1new_number.data.length);
      dataSource1.data.push(...dataSource1new.data);
      //console.log('wfy追溯数据：', tracesthequeryInfo.nopagingresult);
    }
  };
  // 查询SN码
  const querySY = async () => {
    if (formState.sn !== '') {
      queryCondition1.params.sn = formState.sn;
      const selectresult = await getwlbmandxlh(queryCondition1);
      if (selectresult.length === 0) {
        message.warning('该序列号查询不到物料编码，请检查序列号！');
        //赋值操作
        formState.gjm = '';
        formState.cpmc = '';
        formState.cpgg = '';
        formState.cpys = '';
        formState.xg = '';
        formState.wlbm = '';
      } else {
        //赋值操作
        formState.gjm = selectresult[0].gjm;
        formState.cpmc = selectresult[0].wlmc;
        formState.cpgg = selectresult[0].cpgg;
        formState.cpys = selectresult[0].cpys;
        formState.xg = selectresult[0].xg;
        formState.wlbm = selectresult[0].wlbm;

        queryCondition1.params.wlbm = selectresult[0].wlbm;
        zsSelect();
      }
    } else {
      message.warning('请先输入序列号！');
    }
  };
  //页码变动-追溯查询 方法
  const zscx = async (currentandpage: number, pageSize: number) => {
    queryCondition1.pageIndex = currentandpage;
    queryCondition1.pageRows = pageSize;
    current1.value = currentandpage;
    pageSizeRef1.value = pageSize;
    zsSelect();
  };
  const onShowSizeChange1 = async (current: number, pageSize: number) => {
    zscx(current, pageSize);
  };
  const pageChange1 = async (page: number, pageSize: number) => {
    zscx(page, pageSize);
  };

  // 查询包装拆卸记录
  const PackageRemove = async () => {
    dataSource2.data = [];
    if (formState.sn !== '') {
      queryCondition_cb.params.sn = formState.sn;
      queryCondition_cb.params.wlbm = formState.wlbm;
      const selectresult = await findPackageRemove(queryCondition_cb);
      if (selectresult.length === 0) {
        message.warning('该包装查询不到包装拆卸记录，请检查序列号！');
      } else {
        total2.value = parseInt(selectresult.total.length);
        dataSource2.data.push(...selectresult.data);
        visible.value = true;
        //console.log('拆包数据：', selectresult);
        //return 1;
      }
    } else {
      message.warning('请先输入序列号！');
    }
  };
  //页码变动-拆包记录查询 方法
  const zscx_cb = async (currentandpage: number, pageSize: number) => {
    queryCondition_cb.pageIndex = currentandpage;
    queryCondition_cb.pageRows = pageSize;
    current2.value = currentandpage;
    pageSizeRef2.value = pageSize;
    const selectresult = await findPackageRemove(queryCondition_cb);
    if (selectresult.length === 0) {
      message.warning('该包装查询不到包装拆卸记录，请检查序列号！');
      dataSource2.data = [];
    } else {
      dataSource2.data = [];
      total2.value = parseInt(selectresult.total.length);
      dataSource2.data.push(...selectresult.data);
      //console.log('拆包数据：', selectresult);
      //return 1;
    }
  };
  const onShowSizeChange2 = async (current: number, pageSize: number) => {
    zscx_cb(current, pageSize);
  };
  const pageChange2 = async (page: number, pageSize: number) => {
    zscx_cb(page, pageSize);
  };

  const visible = ref<boolean>(false);
  const showModalandPackageRemove = () => {
    PackageRemove();
  };
  const handleOk = (e: MouseEvent) => {
    visible.value = false;
  };
</script>

<style lang="less" scoped>
  // label{
  //   font-size: 32px;
  // }
  .ant-form-inline .ant-form-item {
    margin-bottom: 10px;
  }
  .buttontou {
    margin-left: 25px;
  }
</style>
