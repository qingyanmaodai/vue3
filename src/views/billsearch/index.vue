<template>
  <div style="height: 100%">
    <Card>
      请选择单据类型：<Select
        v-model:value="formState.region"
        style="width: 200px"
        :allowClear="true"
        placeholder="请选择"
        @select="xuan"
      >
        <SelectOption v-for="(items, index) in options.data" :key="index" :value="items.value">{{
          items.label
        }}</SelectOption>
      </Select>
      <span style="margin-left: 20px">单据编号：</span
      ><Input style="width: 200px" v-model:value="formState.snName" />
      <span style="margin-left: 20px">物料编码：</span
      ><Input style="width: 200px" v-model:value="formState.wlbm" />
      <Button type="primary" @click="onSubmit" style="margin-left: 8px; left: 10px">查询</Button>
      <Button @click="reset" style="margin-left: 8px; left: 10px">重置</Button>
      <Button @click="exportBill" type="primary" style="margin-left: 8px; left: 10px">导出</Button>
    </Card>
    <Card style="margin-top: 10px" title="单据查询">
      <Table
        :columns="columns.data"
        :dataSource="dataSource.data"
        rowKey="id"
        :pagination="false"
        style="margin-top: 10px"
        :scroll="{ x: 'calc(700px + 50%)', y: 520 }"
      >
        <template #num="{ index }">
          {{ (current1 - 1) * pageSizeRef + Number(index) + 1 }}</template
        >
        <template #childs="{ text }">
          <Row v-for="tag in text" :key="tag">
            {{ tag.sn }}
          </Row>
        </template>
      </Table>
      <Pagination
        style="margin-top: 15px"
        v-model:current="current1"
        :page-size-options="pageSizeOptions"
        :total="total1"
        :show-total="total => `共 ${total} 条`"
        show-size-changer
        @change="pageChange"
        :page-size="pageSizeRef"
        @showSizeChange="onShowSizeChange"
      />
    </Card>
  </div>
</template>

<script lang="ts" setup>
  import {
    Pagination,
    Select,
    SelectOption,
    Card,
    Row,
    message,
    Table,
    Input,
    Button,
  } from 'ant-design-vue';
  import { exportXls, findBill } from '/@/api/sys/bill';
  import { useUserStore } from '/@/store/modules/user';
  import { reactive, toRaw, computed, defineComponent, ref, watch, UnwrapRef } from 'vue';
  const userStore = useUserStore();
  const funDepartNumber = computed(() => userStore.getPdaUserInfo.funDepartNumber);
  const pageSizeOptions = ref<string[]>(['10', '50', '100', '200']);
  const current1 = ref(1);
  const pageSizeRef = ref(10);
  let total1 = ref(0);
  // const pageSizeRefold = 0;
  // defineComponent;
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
        width: 80,
      },
      {
        title: '单据编号',
        dataIndex: 'djbh',
        key: 'djbh',
        width: 120,
      },
      // {
      //   title: '裸机码',
      //   dataIndex: 'lj',
      //   key: 'lj',
      //   width: 130,
      // },
      {
        title: '裸机码',
        dataIndex: 'childs',
        key: 'childs',
        slots: { customRender: 'childs' },
        width: 170,
      },
      {
        title: '彩盒码',
        dataIndex: 'parentSn',
        key: 'parentSn',
        width: 120,
        // customRender: (text, record, index) => {
        //   const obj = {
        //     children: text.text,
        //     props: {} as any,
        //   };
        //   //过滤获取到相同的数据
        //   let arr = dataSource.data.filter((res) => {
        //     return res.parentSn == text.record.parentSn;
        //   });
        //   if (text.index == 0 || dataSource.data[text.index - 1].parentSn != text.record.parentSn) {
        //     obj.props.rowSpan = arr.length;
        //   } else if (dataSource.data[text.index - 1].parentSn == '' || text.record.parentSn=='') {
        //     obj.props.rowSpan = 1;
        //   }else{
        //       obj.props.rowSpan = 0;
        //   }
        //   return obj;
        // },
      },
      {
        title: '外箱码',
        dataIndex: 'dbz',
        key: 'dbz',
        width: 120,
        // customRender: (text, record, index) => {
        //   const obj = {
        //     children: text.text,
        //     props: {} as any,
        //   };
        //   //过滤获取到相同的数据
        //   console.log(dataSource.data,"dataSource")
        //   let arr = dataSource.data.filter((res) => {
        //     return res.dbz == text.record.dbz;
        //   });
        //   if (text.index == 0 || dataSource.data[text.index - 1].dbz != text.record.dbz ) {
        //     console.log(text.record.dbz) ;
        //     obj.props.rowSpan = arr.length;
        //     if(text.record.dbz == null){
        //       obj.props.rowSpan = 1;
        //     }
        //   } else {
        //     obj.props.rowSpan = 0;
        //     if(text.record.dbz == null){
        //       obj.props.rowSpan = 1;
        //     }
        //   }
        //   return obj;
        // },
      },
      {
        title: '物料编码',
        dataIndex: 'wlbm',
        key: 'wlbm',
        width: 130,
      },
      {
        title: '物料名称',
        dataIndex: 'wlmc',
        key: 'wlmc',
        width: 150,
      },
      {
        title: '日期',
        dataIndex: 'fdate',
        key: 'fdate',
        width: 120,
      },
      {
        title: '客户名称',
        dataIndex: 'khmc',
        key: 'khmc',
        width: 150,
      },
      {
        title: '内部订单号',
        dataIndex: 'xsckdddbh',
        key: 'xsckdddbh',
        width: 120,
      },
      {
        title: '单据类型',
        dataIndex: 'djlx',
        key: 'djlx',
        width: 130,
      },
      {
        title: '线上订单号',
        dataIndex: 'xsckdxsddh',
        key: 'xsckdxsddh',
        width: 120,
      },
    ],
  });

  const dataSource = reactive<any>({
    data: [],
  });
  const options = reactive<any>({
    data: [],
  });
  const cha = async () => {
    if (funDepartNumber.value == '001' || funDepartNumber.value == '') {
      const dataSour = reactive({
        data: [
          {
            label: '采购入库',
            value: 'CGRK',
          },
          {
            label: '销售出库',
            value: 'XSCK-',
          },
          {
            label: '其他出库',
            value: 'QTCK-',
          },
          {
            label: '销售退货',
            value: 'XSTH-',
          },
        ],
      });
      options.data.push(...dataSour.data);
    } else if (funDepartNumber.value == '002') {
      const dataSour = reactive({
        data: [
          {
            label: '销售出库',
            value: 'XSCK-',
          },
          {
            label: '其他出库',
            value: 'QTCK-',
          },
          {
            label: '销售退货',
            value: 'XSTH-',
          },
        ],
      });
      options.data.push(...dataSour.data);
    } else if (funDepartNumber.value == '003') {
      formState.region = 'CGRK';
      const dataSour = reactive({
        data: [
          {
            label: '采购入库',
            value: 'CGRK',
          },
        ],
      });
      options.data.push(...dataSour.data);
    }
  };
  const onShowSizeChange = async (current: number, pageSize: number) => {
    dataSource.data = [];
    if (current == 0) {
      current = 1;
    }
    current1.value = current;
    pageSizeRef.value = pageSize;
    param.data.pageIndex = current;
    param.data.pageRows = pageSize;
    if (formState.snName != '' || formState.wlbm) {
      await onSubmit();
    }
  };
  const pageChange = async (page: number, pageSize: number) => {
    param.data.pageRows = pageSize;
    param.data.pageIndex = page;
    if (formState.snName != '' || formState.wlbm) {
      await onSubmit();
    }
  };

  //提交的参数
  const param = reactive({
    data: {
      params: {
        billType: '',
        djbh: '',
        wlbm: '',
      },
      pageIndex: current1.value,
      pageRows: pageSizeRef.value,
    },
  });

  const formState = reactive({
    name: '',
    snName: '',
    wlbm: '',
    region: 'XSCK-',
  });
  //提交
  const onSubmit = async () => {
    dataSource.data = [];
    param.data.params.billType = formState.region;
    param.data.params.djbh = formState.snName;
    param.data.params.wlbm = formState.wlbm;
    total1.value = 0;
    if (formState.snName || formState.wlbm) {
      const bill = await findBill(param.data);
      if (bill.modelList) {
        total1.value = parseInt(bill.count);
        let i = 1;
        bill.modelList.forEach((element) => {
          element.id = i;
          i = i + 1;
        });
        dataSource.data.push(...bill.modelList);
      }
    }
  };

  //导出
  const exportBill = async () => {
    param.data.params.billType = formState.region;
    param.data.params.djbh = formState.snName;
    param.data.params.wlbm = formState.wlbm;
    if (formState.snName || formState.wlbm) {
      const bill = await exportXls(param.data);
      if (!bill) {
        message.warning('文件下载失败');
        return;
      }
      let url = window.URL.createObjectURL(new Blob([bill], { type: 'application/vnd.ms-excel' }));
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', '单据列表信息.xls');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    }
  };
  const reset = async () => {
    //重置
    dataSource.data = [];
    formState.snName = '';
    formState.wlbm = '';
    formState.region = 'XSCK-';
    if (funDepartNumber.value == '003') {
      formState.region = 'CGRK';
    }
    total1.value = 0;
  };

  const xuan = async (value) => {
    formState.region = value;
  };

  cha();
</script>
<style lang="less" scoped></style>
