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
                        @search="
                          onSearch('GET_EMPLOYEE_DTO', 'bdEmployee', Url.EMPLOYEE_GET_DATA, [
                            'empId',
                            'empName',
                          ])
                        "
                        @clear="onClear(['empId', 'empName'])"
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
            ref="detailTableRef"
            @clearDetailTableEvent="clearDetailTableEvent"
            @cellClickTableEvent="cellClickTableEvent"
            :detailTableData="detailTableData"
            @setDefaultTableData="setDefaultTableData"
            @getJudgeClickData="getJudgeClickData"
            @getCountAmount="getCountAmount"
            :isShowIcon="formState.bsStatus !== 'B'"
            :isDisableButton="formState.bsStatus === 'B'"
          />
        </pane>
      </a-splitpanes>
    </div>
    <BasicSearch
      @basicClickEvent="basicClickEvent"
      :gridOptions="basicGridOptions"
      ref="basicSearchRef"
      :control="basicControl"
      :tableCols="basicTableCols"
      :tableName="basicTableName"
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
  import { basicGridOptions } from '/@/components/AMoreSearch/data';
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
    // update,
    getInventoryList,
  } from '/@/api/invCountGain';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { config } from '/@/utils/publicParamConfig';
  import { VXETable } from 'vxe-table';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { cloneDeep } from 'lodash-es';
  import { getPublicList } from '/@/api/public';
  import moment from 'moment';
  import { ControlSet, TableColum, Url } from '/@/api/apiLink';
  import { VxeGridPropTypes } from 'vxe-table/types/all';
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
  const detailTableRef: any = ref<String | null>(null);
  const detailTableData: any = ref<object[]>([]); //表格数据

  //基础信息查询组件ref
  const basicSearchRef: any = ref<any>(undefined);
  const basicControl = ref<ControlSet[]>(); //下拉框
  const basicTableCols = ref<VxeGridPropTypes.Columns[]>([]); //表头
  let basicTableName = ref<string>(''); //需要查询的表名

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

  //初始化
  const formStateInit = reactive({
    data: formData,
  });
  // 明细表表头名
  const formState = toRef(formStateInit, 'data');
  const material = 'bdMaterial.number';
  const stock = 'bdStock.name';
  const compartment = 'bdStockCompartment.name';
  const location = 'bdStockLocation.name';

  const formRules = reactive({
    countNum: [
      { required: true, message: '请输入比帐存数量大的盘点数量' },
      {
        validator({ cellValue, row }) {
          if (Number(cellValue) && Number(row.stockNum) > Number(cellValue)) {
            return new Error('盘点数量应该大于帐存数量');
          }
        },
      },
    ],
  });
  formRules[material] = [{ required: true, message: '请选择检验项目' }];
  formRules[material] = [{ required: true, message: '请选择检验项目' }];
  formRules[stock] = [{ required: true, message: '请选择仓库' }];
  formRules[compartment] = [{ required: true, message: '请选择分仓' }];
  formRules[location] = [{ required: true, message: '请选择仓位' }];

  //点击清空图标清空事件
  const onClear = (key: string[]) => {
    key.forEach((e) => {
      formState.value[e] = undefined;
    });
  };
  //列表页清空事件
  const clearDetailTableEvent = (data, column) => {
    console.log(column);
    if (column.field === 'bdMaterial.number') {
      data.stockNum = '';
      data.countNum = '';
      for (const key in column.params.param) {
        data[key] = '';
        data[column.params.param[key]] = {};
      }
    } else {
      for (const key in column.params.param) {
        data[key] = '';
        data[column.params.param[key]] = {};
      }
    }
  };
  // 负责人弹框选放大镜事件
  let currDataParam: string[] = []; //约定数组下标0为数据ID，1为数据包
  /**
   * 负责人弹窗
   * @param dtoUrlConfig  获取负责人查询链接属性
   * @param tableName  指向的表名根据DTO链接可以查询到
   * @param tableUrl  表格列表数据链接
   * @param dataParam 当前选中的数据包
   */
  const onSearch: any = async (
    dtoUrlConfig: string,
    tableName: string,
    tableUrl: string,
    dataParam: string[],
  ) => {
    currDataParam = dataParam;
    const res = await getPublicList({ params: [] }, Url[dtoUrlConfig]);
    basicControl.value = res;
    basicTableCols.value = TableColum[dtoUrlConfig];
    basicTableName.value = tableName;
    basicSearchRef.value.init(tableUrl);
  };
  //双击单元格选择事件——获取双击所选的值并赋值到对应字段
  const basicClickEvent = async (row) => {
    basicSearchRef.value.close();
    formState.value[currDataParam[0]] = row.id;
    formState.value[currDataParam[1]] = {};
    formState.value[currDataParam[1]].id = row.id;
    formState.value[currDataParam[1]].name = row.name;
  };
  //接受参数
  let dataId = useRoute().query.row?.toString() || '';
  //保存
  const onSubmit = async () => {
    formRef.value
      .validate()
      .then(async () => {
        const tableFullData = detailTableRef.value.getDetailData();
        const validAllErrMapData = await detailTableRef.value.getValidAllData();
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
        //保存：新增+更新
        let data = await add({ params: formState.value });
        console.log('data.id', data.id);
        formState.value.bsDate = moment(formState.value.bsDate, 'YYYY-MM-DD hh:mm:ss');
        await getListById(data.id);
        createMessage.success('操作成功');
      })
      .catch((error: ValidateErrorEntity<FormData>) => {
        createMessage.error('数据校检不通过，请检查!');
        console.log(error);
      });
  };
  //审核
  const onAudit = async () => {
    formRef.value
      .validate()
      .then(async () => {
        const type = await VXETable.modal.confirm('您确定要保存并审核吗?');
        if (type === 'confirm') {
          const tableFullData = detailTableRef.value.getDetailData();
          const validAllErrMapData = await detailTableRef.value.getValidAllData();
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
  //反审核
  const onUnAudit = async () => {
    const type = await VXETable.modal.confirm('您确定要反审核吗?');
    if (type === 'confirm') {
      const tableFullData = detailTableRef.value.getDetailData();
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
      if (formState.value.empId) {
        formState.value.empId = res.empId ? res.empId : '';
        formState.value.empName = res.empName ? res.empName : '';
      }
      formState.value.bsDate = moment(formState.value.bsDate, 'YYYY-MM-DD hh:mm:ss');
      if (formState.value.dtData) {
        formState.value.dtData.map((r) => {
          r.bsStatus = formState.value.bsStatus;
        });
      }
      detailTableData.value = cloneDeep(formState.value.dtData);
      console.log(detailTableData.value);
    }
  };

  //计算数量
  const getCountAmount = (row) => {
    if (row.countNum && row.stockNum !== null) {
      row.gain = row.countNum - row.stockNum;
    } else {
      row.gain = '';
    }
    return row;
  };

  //获取判断双击赋值事件的值
  const getJudgeClickData = (arr, row, callback) => {
    let judgeClickIndex = arr.fullData.findIndex(
      (e) =>
        e.stockId === row.id ||
        e.compartmentId === row.id ||
        e.locationId === row.id ||
        e.matId === row.id,
    );
    callback(judgeClickIndex);
  };

  //双击赋值事件
  const cellClickTableEvent = async (row, data, column) => {
    console.log('row', row);
    console.log('data', data);
    switch (column) {
      case 'bdMaterial':
        data.matId = row.id ? row.id : null;
        data.bdMaterial.number = row.number ? row.number : null;
        data.bdMaterial.name = row.name ? row.name : null;
        data.bdMaterial.model = row.model ? row.model : null;
        data.bdMaterial.baseUnitName = row.baseUnit ? row.baseUnit.name : null;
        data.bdMaterial.weightUnitName = row.weightUnit ? row.weightUnit.name : null;
        data.stockId = row.stockId ? row.stockId : null;
        data.bdStock.name = row.bdStock ? row.bdStock.name : null;
        data.compartmentId = row.compartmentId ? row.compartmentId : null;
        data.bdStockCompartment.name = row.bdStockCompartment ? row.bdStockCompartment : null;
        data.locationId = row.locationId ? row.locationId : null;
        data.bdStockLocation.name = row.bdStockLocation ? row.bdStockLocation.name : null;
        break;
      case 'bdStock':
        data.stockId = row.id ? row.id : null;
        data.bdStock.name = row.name ? row.name : null;
        break;
      case 'bdStockCompartment':
        data.compartmentId = row.id ? row.id : null;
        data.bdStockCompartment.name = row.name ? row.name : null;
        if (row.stockId) {
          data.bdStock = row.bdStock;
          data.stockId = row.stockId;
        }
        break;
      case 'bdStockLocation':
        data.locationId = row.id ? row.id : null;
        data.bdStockLocation.name = row.name ? row.name : null;
        if (row.stockId && row.compartmentId) {
          data.bdStock = row.bdStock;
          data.stockId = row.stockId;
          data.bdStockCompartment = row.bdStockCompartment;
          data.compartmentId = row.compartmentId;
        }
        break;
    }
    let stockNumData = await getInventoryList({ params: data });
    if (stockNumData) {
      data.stockNum = cloneDeep(stockNumData);
    } else {
      data.stockNum = 0;
    }
  };
  //新增行时设置默认值
  const setDefaultTableData = (obj) => {
    // obj.isOpen = 1;
    // obj.isRequire = 1;
    obj.sort = cloneDeep(detailTableRef.value.rowSortData);
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
