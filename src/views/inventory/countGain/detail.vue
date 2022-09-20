<template>
  <div style="height: 100%">
    <LayoutHeader style="background-color: #fff; height: 60px; padding: 0 20px">
      <a style="font-size: 1.4rem; font-weight: bold; color: #000; line-height: 60px" @click="back"
        ><RollbackOutlined /> 返回</a
      >
      <div style="display: flex; float: right">
        <Button type="primary" class="button" @click="onSubmit" v-if="formState.bsStatus !== 'B'"
          >保存</Button
        >
        <Button danger class="button" @click="onAudit" v-if="formState.bsStatus === 'A'"
          >审核</Button
        >
        <Button danger class="button" @click="onUnAudit" v-if="formState.bsStatus === 'B'"
          >反审核</Button
        >
      </div>
    </LayoutHeader>
    <div class="content">
      <a-splitpanes class="default-theme" horizontal>
        <pane :size="paneSize" style="background-color: #fff">
          <Tabs v-model:activeKey="activeKey" class="tabs">
            <TabPane key="1" tab="基本信息">
              <a-form ref="formRef" :model="formState" :rules="formRules">
                <Row>
                  <Col :span="8">
                    <a-form-item label="单据编号：" ref="number" name="number" class="item">
                      <Input
                        allowClear
                        class="input"
                        autocomplete="off"
                        v-model:value="formState.number"
                        placeholder="保存后自动生成"
                        disabled
                      />
                    </a-form-item>
                  </Col>
                  <Col :span="8">
                    <a-form-item label="来源单号：" ref="srcField" name="srcField" class="item">
                      <Input class="input" v-model:value="formState.srcField" disabled />
                    </a-form-item>
                  </Col>
                  <Col :span="8">
                    <a-form-item label="业务状态：" ref="bsStatus" name="bsStatus" class="item">
                      <Input
                        allowClear
                        class="input"
                        autocomplete="off"
                        :value="config.BS_STATUS[formState.bsStatus] || '暂存'"
                        name="bsStatus"
                        :disabled="true"
                      />
                    </a-form-item>
                  </Col>
                </Row>
                <Row>
                  <Col :span="8">
                    <a-form-item label="负责人：" ref="empId" name="empId" class="item">
                      <ExInput
                        autocomplete="off"
                        class="input"
                        placeholder="请选择负责人"
                        label="负责人"
                        :show="formState.bsStatus !== 'B'"
                        :value="formState.empName"
                        :disabled="formState.bsStatus === 'B'"
                        @search="onRule()"
                        @clear="onClear(['ruleId', 'ruleName'])"
                      />
                    </a-form-item>
                  </Col>
                  <Col :span="8">
                    <a-form-item label="盘点方式：" ref="way" name="way" class="item">
                      <Select
                        v-model:value="formState.way"
                        class="select"
                        :options="config.INVENTORY_WAY"
                        :disabled="formState.bsStatus === 'B'"
                      />
                    </a-form-item>
                  </Col>
                  <Col :span="8">
                    <a-form-item label="业务日期：" ref="bsDate" name="bsDate" class="item">
                      <a-date-picker
                        :showToday="false"
                        class="select"
                        format="YYYY-MM-DD"
                        v-model:value="formState.bsDate"
                        :disabled="formState.bsStatus === 'B'"
                        placeholder="请选择业务日期"
                      />
                    </a-form-item>
                  </Col>
                </Row>
                <Row>
                  <Col :span="8">
                    <a-form-item label="备注：" ref="mark" name="mark" class="item">
                      <a-textArea
                        v-model:value="formState.mark"
                        placeholder="请添加备注"
                        :rows="3"
                        class="textArea"
                        :disabled="formState.bsStatus === 'B'"
                      />
                    </a-form-item>
                  </Col>
                </Row>
              </a-form>
            </TabPane>
            <TabPane key="2" tab="其他信息">
              <a-form ref="formRef" :model="formState" :rules="formRules">
                <Row>
                  <Col :span="8">
                    <a-form-item label="创建时间：" ref="createTime" name="createTime" class="item">
                      <Input class="input" v-model:value="formState.createTime" disabled />
                    </a-form-item>
                  </Col>
                  <Col :span="8">
                    <a-form-item label="创建人：" ref="createBy" name="createBy" class="item">
                      <Input class="input" v-model:value="formState.createBy" disabled />
                    </a-form-item>
                  </Col>
                </Row>
                <Row>
                  <Col :span="8">
                    <a-form-item label="修改时间：" ref="updateTime" name="updateTime" class="item">
                      <Input
                        class="input"
                        v-model:value="formState.updateTime"
                        disabled
                      /> </a-form-item
                  ></Col>
                  <Col :span="8">
                    <a-form-item label="修改人：" ref="updateBy" name="updateBy" class="item">
                      <Input
                        class="input"
                        v-model:value="formState.updateBy"
                        disabled
                      /> </a-form-item
                  ></Col>
                </Row>
              </a-form>
            </TabPane>
          </Tabs>
        </pane>
        <pane :size="100 - paneSize">
          <ExDetailTable
            :columns="invCountGainOfDetailColumns"
            :gridOptions="RuleOfExaGridOptions"
            :editRules="formRules"
            ref="vxeTableRef"
            @cellClickTableEvent="cellClickTableEvent"
            :detailTableData="detailTableData"
            @changeSwitch="changeSwitch"
            @getJudgeClickData="getJudgeClickData"
            @getCountAmount="getCountAmount"
            :isShowIcon="formState.bsStatus !== 'B'"
            :isDisableButton="formState.bsStatus === 'B'"
          />
        </pane>
      </a-splitpanes>
    </div>
    <BasicSearch
      @basicClickEvent="onRuleClickEvent"
      @openSearch="openSearch"
      ref="basicSearchRef"
      :gridOptions="basicGridOptions"
    />
  </div>
</template>
<script lang="ts" setup>
  import {
    ruleOfExaGridOptions,
    invCountGainOfDetailColumns,
  } from '/@/components/ExDetailTable/data';
  import { onMounted, reactive, ref, toRef } from 'vue';
  import {
    Button,
    Col,
    Form,
    FormItem,
    Input,
    LayoutHeader,
    Row,
    DatePicker,
    TabPane,
    Tabs,
    Select,
  } from 'ant-design-vue';
  import { Pane, Splitpanes } from 'splitpanes';
  import 'splitpanes/dist/splitpanes.css';
  import { BasicSearch } from '/@/components/AMoreSearch';
  import { ExInput } from '/@/components/ExInput';
  import { ExDetailTable } from '/@/components/ExDetailTable';
  import { RollbackOutlined } from '@ant-design/icons-vue';
  import { useRoute, useRouter } from 'vue-router';
  import {
    add,
    audit,
    unAudit,
    InvCountGainEntity,
    getOneById,
    update,
    getInventoryList,
  } from '/@/api/invCountGain';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { config } from '/@/utils/publicParamConfig';
  import { VXETable } from 'vxe-table';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { SearchDataType, SearchLink, SearchMatchType } from '/@/api/apiLink';
  import { getEmployeeData, getEmployeeEntity } from '/@/api/employee';
  import { basicGridOptions, employeeColumns } from '/@/components/AMoreSearch/data';
  import { cloneDeep } from 'lodash-es';
  import { getPublicList } from '/@/api/public';
  import moment from 'moment';
  const { createMessage } = useMessage();
  const ASplitpanes = Splitpanes;
  const ADatePicker = DatePicker;
  const RuleOfExaGridOptions = ruleOfExaGridOptions;
  const paneSize = ref<number>(50);
  const AForm = Form;
  const AFormItem = FormItem;
  const ATextArea = Input.TextArea;
  const router = useRouter();
  const formRef = ref();
  const activeKey = ref<string>('1');
  const basicSearchRef: any = ref(null);
  const vxeTableRef: any = ref<String | null>(null);

  //获取当前时间
  const getCurrentData = () => {
    return new Date().toLocaleDateString();
  };
  //输入框默认值
  const formData: InvCountGainEntity = {
    id: undefined,
    number: '',
    way: 'A',
    bsDate: moment(getCurrentData(), 'YYYY-MM-DD'),
  };

  const detailTableData: any = ref<object[]>([]); //表格数据
  //初始化
  const formStateInit = reactive({
    data: formData,
  });
  const formState = toRef(formStateInit, 'data');
  const material = 'bdMaterial.number';
  const stock = 'bdStock.name';
  const compartment = 'bdStockCompartment.name';
  const location = 'bdStockLocation.name';

  const formRules = reactive({
    gain: [{ required: false, message: '请输入方案名称' }],
    countNum: [{ required: true, message: '请输入盘点数量' }],
  });
  formRules[material] = [{ required: true, message: '请选择检验项目' }];
  formRules[material] = [{ required: true, message: '请选择检验项目' }];
  formRules[stock] = [{ required: true, message: '请选择仓库' }];
  formRules[compartment] = [{ required: true, message: '请选择分仓' }];
  formRules[location] = [{ required: true, message: '请选择仓位' }];

  //点击清空图标清空事件
  const onClear = (key: string[]) => {
    key.forEach((e) => {
      formState.value[e] = '';
    });
  };
  const openSearch = async () => {
    const res = await onRule();
    basicSearchRef.value.initList(res);
  };
  //基本信息表格双击事件
  const onRuleClickEvent = (row) => {
    formState.value.empId = row.id;
    formState.value.empName = row.name;
    basicSearchRef.value.bSearch(false);
  };
  //打开放大镜
  const onRule = async () => {
    const res: any = await getEmployeeData({
      params: [
        {
          table: '',
          name: 'bsStatus',
          column: 'bs_status',
          link: SearchLink.AND,
          rule: SearchMatchType.EQ,
          type: SearchDataType.string,
          val: 'B',
          startWith: '',
          endWith: '',
        },
      ],
    });
    let data = res;
    basicSearchRef.value.bSearch(true);
    basicSearchRef.value.initList(data);
    basicSearchRef.value.initCols(employeeColumns);
    await getEmployeeOption();
    return res;
  };
  //获取基本单位字段
  const getEmployeeOption = async () => {
    try {
      let arr: any = [];
      let data = await getEmployeeEntity();
      arr = cloneDeep(data);
      arr = arr.filter((e) => e.fieldName != 'bs_status');
      basicSearchRef.value.init(arr);
    } catch (e) {
      console.log('获取基本信息字段失败', e);
    }
  };
  //接受参数
  let dataId = useRoute().query.row?.toString() || '';

  //保存
  const onSubmit = async () => {
    formRef.value
      .validate()
      .then(async () => {
        const tableFullData = vxeTableRef.value.getDetailData();
        const validAllErrMapData = await vxeTableRef.value.getValidAllData();
        if (tableFullData) {
          if (validAllErrMapData) {
            await VXETable.modal.message({ status: 'error', message: '数据校检不通过，请检查!' });
            return;
          }
          formState.value.dtData = cloneDeep(tableFullData);
        }
        // if (!formState.value.id) {
        let data = await add({ params: formState.value });
        // formState.value = Object.assign({}, formState.value, data);
        // } else {
        //   const data = await update({ params: formState.value });
        //   formState.value = Object.assign({}, formState.value, data);
        // }
        // formState.value.bsStatus = 'A';
        await getListById(data.id);
        createMessage.success('操作成功');
      })
      .catch((error: ValidateErrorEntity<FormData>) => {
        createMessage.error('数据校检不通过，请检查!');
        console.log(error);
      });
  };
  const onAudit = async () => {
    formRef.value
      .validate()
      .then(async () => {
        const type = await VXETable.modal.confirm('您确定要保存并审核吗?');
        if (type === 'confirm') {
          const tableFullData = vxeTableRef.value.getDetailData();
          const validAllErrMapData = await vxeTableRef.value.getValidAllData();
          if (tableFullData) {
            if (validAllErrMapData) {
              await VXETable.modal.message({
                status: 'error',
                message: '明细表数据校检不通过，请检查!',
              });
              return;
            }
            formState.value.dtData = cloneDeep(tableFullData);
          }
          const data = await audit({ params: formState.value });
          formState.value = Object.assign({}, formState.value, data);
          if (data.bsStatus === 'B' && tableFullData) {
            tableFullData.map((e) => {
              e.bsStatus = 'B';
              return e;
            });
          }
          createMessage.success('操作成功');
        }
        formState.value.bsDate = moment(formState.value.bsDate, 'YYYY-MM-DD hh:mm:ss');
      })
      .catch((error: ValidateErrorEntity<FormData>) => {
        createMessage.error('数据校检不通过，请检查!');
        console.log(error);
      });
  };
  const onUnAudit = async () => {
    const type = await VXETable.modal.confirm('您确定要反审核吗?');
    if (type === 'confirm') {
      const tableFullData = vxeTableRef.value.getDetailData();
      if (tableFullData) {
        formState.value.dtData = cloneDeep(tableFullData);
      }
      const data = await unAudit({ params: formState.value });
      formState.value = Object.assign({}, formState.value, data);
      if (data.bsStatus === 'A' && tableFullData) {
        tableFullData.map((e) => {
          e.bsStatus = 'A';
          return e;
        });
      }
      createMessage.success('操作成功');
    }
    formState.value.bsDate = moment(formState.value.bsDate, 'YYYY-MM-DD hh:mm:ss');
  };
  //返回上一页
  const back = () => {
    router.go(-1);
  };
  //获取初始值
  const getListById = async (dataId) => {
    if (dataId) {
      const res: any = await getOneById({ params: dataId });
      formState.value = res;
      // if (formState.value.empId) {
      //   console.log(formState.value, 'swdsa');
      // formState.value.empId = res.empName ? res.bdExamineRule.id : '';
      // formState.value.empName = res.empName ? res.empName : '';
      // }
      formState.value.bsDate = moment(formState.value.bsDate, 'YYYY-MM-DD hh:mm:ss');
      if (formState.value.dtData) {
        formState.value.dtData.map((r) => {
          r.bsStatus = formState.value.bsStatus;
          if (!r.bdStock) {
            r.bdStock = {
              id: '',
              name: '',
              number: '',
            };
            return r;
          }
        });
      }
      detailTableData.value = cloneDeep(formState.value.dtData);
    }
  };

  //计算数量
  const getCountAmount = (row) => {
    if (row.countNum && row.stockNum !== null) {
      row.gain = row.countNum - row.stockNum;
      return row;
    }
  };

  //获取判断双击赋值事件的值
  const getJudgeClickData = (arr, row, callback) => {
    let judgeClickIndex = arr.fullData.findIndex((e) => e.bdStock.id === row.id);
    callback(judgeClickIndex);
  };
  let queryStockParam = reactive({
    stockCompartment: {},
    stockLocation: {},
  });
  const getNextStock = async (key, colName, id) => {
    const res: any = await getPublicList(
      {
        params: [
          {
            table: '',
            name: colName,
            column: colName,
            link: 'AND',
            rule: 'LIKE',
            type: 'number',
            val: id,
            startWith: '',
            endWith: '',
          },
        ],
      },
      config.PUBLIC_REQUEST_URL[key],
    );
    return res;
  };
  //双击赋值事件
  const cellClickTableEvent = async (row, data, column) => {
    console.log('row', row);
    console.log('data', data);
    switch (column) {
      case 'bdMaterial':
        data.matId = row.id;
        data.bdMaterial.number = row.number;
        data.bdMaterial.name = row.name;
        data.bdMaterial.model = row.model;
        if (row.baseUnit) {
          data.bdMaterial.baseUnitName = row.baseUnit.name;
        }
        if (row.weightUnit) {
          data.bdMaterial.weightUnitName = row.weightUnit.name;
        }
        if (row.stockId) {
          const stockByMaterial = await getNextStock('stock', 'id', row.stockId);
          data.stockId = stockByMaterial.records[0].id;
          data.bdStock.name = stockByMaterial.records[0].name;
          data.bdStock.id = stockByMaterial.records[0].id;
        } else {
          data.stockId = '';
          data.bdStock.name = '';
        }
        if (row.compartmentId) {
          const compartmentByMaterial = await getNextStock('sub', 'id', row.compartmentId);
          data.compartmentId = compartmentByMaterial.records[0].id;
          data.bdStockCompartment.name = compartmentByMaterial.records[0].name;
          data.bdStockCompartment.id = compartmentByMaterial.records[0].id;
        } else {
          data.compartmentId = '';
          data.bdStockCompartment.name = '';
        }
        if (row.locationId) {
          const locationByMaterial = await getNextStock('location', 'id', row.locationId);
          data.locationId = locationByMaterial.records[0].id;
          data.bdStockLocation.name = locationByMaterial.records[0].name;
          data.bdStockLocation.id = locationByMaterial.records[0].id;
        } else {
          data.locationId = '';
          data.bdStockLocation.name = '';
        }
        // if (row.locationId || row.compartmentId || row.stockId || row.id) {
        //   let
        //   const stockNumData = await getNextStock('INV_BY_MAT_STOCK', 'id', row.id);
        //   console.log('stocknum', stockNumData)
        // }
        break;
      case 'bdStock':
        data.stockId = row.id;
        data.bdStock.name = row.name;
        queryStockParam.stockCompartment = {
          table: '',
          name: 'stockId',
          column: 'stock_id',
          link: 'AND',
          rule: 'EQ',
          type: 'string',
          val: row.id,
          startWith: '',
          endWith: '',
        };
        break;
      case 'bdStockCompartment':
        data.compartmentId = row.id;
        data.bdStockCompartment.name = row.name;
        const stockByStock = await getNextStock('stock', 'id', row.stockId);
        data.stockId = stockByStock.records[0].id;
        data.bdStock.name = stockByStock.records[0].name;
        queryStockParam.stockLocation = {
          table: '',
          name: 'compartmentId',
          column: 'stock_compartment_id',
          link: 'AND',
          rule: 'EQ',
          type: 'string',
          val: row.id,
          startWith: '',
          endWith: '',
        };
        break;
      case 'bdStockLocation':
        data.locationId = row.id;
        data.bdStockLocation.name = row.name;
        const compartmentByStockLocation = await getNextStock('sub', 'id', row.compartmentId);
        const stockByStockLocation = await getNextStock('stock', 'id', row.stockId);
        data.compartmentId = compartmentByStockLocation.records[0].id;
        data.bdStockCompartment.name = compartmentByStockLocation.records[0].name;
        data.stockId = stockByStockLocation.records[0].id;
        data.bdStock.name = stockByStockLocation.records[0].name;
        break;
    }
    let stockNumData: any = '';
    stockNumData = await getInventoryList({ params: data });
    console.log('stock', stockNumData);
    if (stockNumData) {
      data.stockNum = cloneDeep(stockNumData.stockNum);
    } else {
      data.stockNum = 0;
    }
  };
  //设置Switch默认
  const changeSwitch = (obj) => {
    obj.isOpen = 1;
    obj.isRequire = 1;
    obj.sort = cloneDeep(vxeTableRef.value.rowSortData);
  };

  onMounted(() => {
    getListById(dataId);
  });
</script>
<style scoped lang="less">
  .switchDiv {
    width: 318px;
  }
  .item {
    flex-flow: nowrap;
  }
  .switch {
    flex-flow: nowrap;
  }
  .input {
    width: 16rem;
    height: 2rem;
    margin: 0 60px 0 2px;
  }
  .textArea {
    width: 16rem;
    height: 2rem;
    margin: 0 60px 0 2px;
  }
  .select {
    width: 16rem;
    margin: 0 60px 0 2px;
  }
  .content {
    border: 1px solid #e5e7eb;
    margin: 10px;
    height: calc(100% - 80px);
    background-color: #fff;
    padding: 10px;
  }
  .default-theme {
    //height: calc(100% - 80px);
  }
  :deep(.vxe-grid) {
    font-size: 14px;
    height: 100%;
  }
  .button {
    margin: 15px;
  }
</style>
