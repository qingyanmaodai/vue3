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
                    <a-form-item label="来源单号：" ref="srcBill" name="srcBill" class="item">
                      <Input class="input" v-model:value="formState.srcBill" disabled />
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
                    <a-form-item label="仓管员：" ref="empId" name="empId" class="item">
                      <ExInput
                        autocomplete="off"
                        class="input"
                        :placeholder="formState.bsStatus === 'B' ? '' : '请选择仓管员'"
                        label="仓管员"
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
                    <a-form-item label="供应商：" ref="supId" name="supId" class="item">
                      <ExInput
                        autocomplete="off"
                        class="input"
                        :placeholder="formState.bsStatus === 'B' ? '' : '请选择供应商'"
                        label="供应商"
                        :show="formState.bsStatus !== 'B'"
                        :value="formState.supName"
                        :disabled="formState.bsStatus === 'B'"
                        @search="
                          onSearch('GET_SUPPLIER_DTO', 'BdSupplier', Url.SUPPLIER_GET_DATA, [
                            'supId',
                            'supName',
                          ])
                        "
                        @clear="onClear(['supId', 'supName'])"
                      />
                    </a-form-item>
                  </Col>
                  <Col :span="8">
                    <a-form-item label="业务日期：" ref="bsDate" name="bsDate" class="item">
                      <a-date-picker
                        :showToday="false"
                        class="select"
                        valueFormat="YYYY-MM-DD HH:mm:ss"
                        format="YYYY-MM-DD"
                        v-model:value="formState.bsDate"
                        :disabled="formState.bsStatus === 'B'"
                      />
                    </a-form-item>
                  </Col>
                </Row>
                <Row>
                  <Col :span="8">
                    <a-form-item label="备注：" ref="mark" name="mark" class="item">
                      <a-textArea
                        v-model:value="formState.mark"
                        :placeholder="formState.bsStatus === 'B' ? '' : '请添加备注'"
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
            :columns="warPurInputOfDetailColumns"
            :gridOptions="DetailOfExaGridOptions"
            :editRules="formRules"
            ref="detailTableRef"
            @clearDetailTableEvent="clearDetailTableEvent"
            @cellClickTableEvent="cellClickTableEvent"
            @setDefaultTableData="setDefaultTableData"
            :detailTableData="detailTableData"
            :isShowIcon="formState.bsStatus !== 'B'"
            :isDisableButton="formState.bsStatus === 'B'"
            @filterModalSearchEvent="filterModalSearchEvent"
            filterTableName="BdMaterial"
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
<script lang="ts" setup name="warehouse-purchase-input-detail">
  import {
    detailOfExaGridOptions,
    warPurInputOfDetailColumns,
  } from '/@/components/ExDetailTable/data';
  import { computed, onMounted, reactive, ref, toRef } from 'vue';
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
  } from 'ant-design-vue';
  import { Pane, Splitpanes } from 'splitpanes';
  import 'splitpanes/dist/splitpanes.css';
  import { BasicSearch } from '/@/components/AMoreSearch';
  import { basicGridOptions } from '/@/components/AMoreSearch/data';
  import { ExInput } from '/@/components/ExInput';
  import { ExDetailTable } from '/@/components/ExDetailTable';
  import { RollbackOutlined } from '@ant-design/icons-vue';
  import { useRoute, useRouter } from 'vue-router';
  import { add, audit, unAudit, getOneById, purchaseInstockEntity } from '/@/api/warPurchase/input';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { config } from '/@/utils/publicParamConfig';
  import { VXETable } from 'vxe-table';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { cloneDeep } from 'lodash-es';
  import { getPublicList } from '/@/api/public';
  import moment from 'moment';
  import { ControlSet, SearchParams, TableColum, Url } from '/@/api/apiLink';
  import { VxeGridPropTypes } from 'vxe-table/types/all';
  import { getMatTable, getMatTableById } from '/@/api/matTable';

  const { createMessage } = useMessage();
  const ASplitpanes = Splitpanes;
  const ADatePicker = DatePicker;
  const DetailOfExaGridOptions = detailOfExaGridOptions;
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
  let stockDis = ref<any>(localStorage.getItem('stockDis')); //仓库维度

  //获取当前时间
  const getCurrentData = () => {
    return new Date().toLocaleDateString();
  };
  //输入框默认值
  const formData: purchaseInstockEntity = {
    id: undefined,
    number: '',
    way: 'A',
    bsDate: moment(getCurrentData(), 'YYYY-MM-DD'),
  };

  //初始化
  const formStateInit = reactive({
    data: formData,
  });
  const requiredLocation: any = computed(() => {
    return stockDis.value === 'C';
  });
  const requiredCompartment: any = computed(() => {
    return stockDis.value !== 'A';
  });
  // 明细表表头名
  const formState = toRef(formStateInit, 'data');
  const material = 'bdMaterial.number';
  const stock = 'bdStock.name';
  const compartment = 'bdStockCompartment.name';
  const location = 'bdStockLocation.name';

  const formRules = reactive({
    realNum: [{ required: true, message: '请输入实收数量' }],
  });
  formRules[material] = [{ required: true, message: '请选择物料信息' }];
  formRules[stock] = [{ required: true, message: '请选择仓库' }];
  formRules[compartment] = [{ required: requiredCompartment, message: '请选择分仓' }];
  formRules[location] = [{ required: requiredLocation, message: '请选择仓位' }];
  //筛选条件弹框组件
  //筛选条件查询
  const filterModalSearchEvent = async (currPage = 1, pageSize = 10) => {
    let getParams: SearchParams[] = [];
    if (
      detailTableRef.value.filterModalParams() &&
      detailTableRef.value.filterModalParams().length > 0
    ) {
      getParams = getParams.concat(detailTableRef.value.filterModalParams());
    }
    const res: any = await getMatTable({
      params: getParams,
      orderByBean: {
        descList: ['BdMaterial.update_time'],
      },
      pageIndex: currPage,
      pageRows: pageSize,
    });
    let bdMaterial = res.records.map((item) => {
      return Object.assign(
        {},
        {
          id: item.id,
          name: item.name,
          number: item.number,
          model: item.model,
          baseUnitName: item.baseUnit.name,
          weightUnitName: item.weightUnit.name,
          baseUnitId: item.baseUnit.id,
          weightUnitId: item.weightUnit.id,
        },
      );
    });
    res.records.forEach((item, index) => {
      item['stockDis'] = stockDis.value;
      item.bdMaterial = bdMaterial[index];
      item.bsStatus = 'A';
      item.matId = item.id;
      item.compartmentId =
        stockDis.value !== 'A' && item.bdStockCompartment ? item.compartmentId : null;
      item.bdStockCompartment.name =
        stockDis.value !== 'A' && item.bdStockCompartment ? item.bdStockCompartment.name : null;
      item.locationId = stockDis.value === 'C' && item.bdStockLocation ? item.locationId : null;
      item.bdStockLocation.name =
        stockDis.value === 'C' && item.bdStockLocation ? item.bdStockLocation.name : null;
    });
    let data = cloneDeep(res.records);
    detailTableData.value = data;
  };
  //点击清空图标清空事件
  const onClear = (key: string[]) => {
    key.forEach((e) => {
      formState.value[e] = null;
    });
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
    formState.value[currDataParam[1]] = row.name;
  };
  //保存
  const onSubmit = async () => {
    formRef.value
      .validate()
      .then(async () => {
        const tableFullData = detailTableRef.value.getDetailData();
        const validAllErrMapData = await detailTableRef.value.getValidAllData();
        if (tableFullData) {
          if (validAllErrMapData) {
            createMessage.error('明细表数据校检不通过，请检查!');
            return;
          }
          if (
            tableFullData.some(
              (e) =>
                tableFullData.filter(
                  (e1) =>
                    e1.stockId === e.stockId &&
                    e1.compartmentId === e.compartmentId &&
                    e1.locationId === e.locationId &&
                    e1.matId === e.matId,
                ).length > 1,
            )
          ) {
            createMessage.error('明细表存在相同数据，请检查!');
            return;
          }
          formState.value.dtData = cloneDeep(tableFullData);
        }
        //保存：新增+更新
        let data = await add({ params: formState.value });
        formState.value = data;
        detailTableData.value = cloneDeep(formState.value.dtData);
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
              createMessage.error('明细表数据校检不通过，请检查!');
              return;
            }
            if (
              tableFullData.some(
                (e) =>
                  tableFullData.filter(
                    (e1) =>
                      e1.stockId === e.stockId &&
                      e1.compartmentId === e.compartmentId &&
                      e1.locationId === e.locationId &&
                      e1.matId === e.matId,
                  ).length > 1,
              )
            ) {
              createMessage.error('明细表存在相同数据，请检查!');
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
      formState.value = data;
      if (data.bsStatus === 'A' && tableFullData) {
        tableFullData.map((e) => {
          e.bsStatus = 'A';
          return e;
        });
      }
      createMessage.success('操作成功');
    }
  };
  //返回上一页
  const back = () => {
    router.go(-1);
  };

  //获取初始值
  const getListById = async () => {
    if (useRoute().query.row) {
      let dataId = useRoute().query.row?.toString() || '';
      const res: any = await getOneById({params: dataId});
      formState.value = res;

    } else if (useRoute().params.pushDownParam) {
      formState.value = JSON.parse(useRoute().params.pushDownParam as string);
    }
    if (formState.value.dtData) {
      formState.value.dtData.map((r) => {
        r.bsStatus = formState.value.bsStatus;
        r['stockDis'] = stockDis.value;
        if (r.bdStockCompartment && r.bdStockCompartment.name) {
          r.compartmentId = stockDis.value !== 'A' ? r.compartmentId : undefined;
          r.bdStockCompartment.name =
            stockDis.value !== 'A' ? r.bdStockCompartment.name : undefined;
        }
        if (r.bdStockLocation && r.bdStockLocation.name) {
          r.locationId = stockDis.value === 'C' ? r.locationId : undefined;
          r.bdStockLocation.name = stockDis.value === 'C' ? r.bdStockLocation.name : undefined;
        }
      });
    }
    detailTableData.value = cloneDeep(formState.value.dtData);
  };

  //明细表清空事件
  const clearDetailTableEvent = (data, column) => {
    if (column.field === 'bdMaterial.number') {
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

  //双击赋值事件
  const cellClickTableEvent = async (row, data, column) => {
    switch (column) {
      case 'bdMaterial':
        const res: any = await getMatTableById({
          params: row.id,
        });
        data.matId = res.id ? res.id : null;
        data.bdMaterial = res;
        data.bdMaterial.baseUnitName = res.baseUnit ? res.baseUnit.name : null;
        data.bdMaterial.weightUnitName = res.weightUnit ? res.weightUnit.name : null;
        data.bdStock = {};
        data.bdStockCompartment = {};
        data.bdStockLocation = {};
        data.stockId = res.bdStock ? res.bdStock.id : null;
        data.bdStock.name = res.bdStock ? res.bdStock.name : null;
        data.compartmentId =
          stockDis.value !== 'A' && res.bdStockCompartment ? res.compartmentId : null;
        data.bdStockCompartment.name =
          stockDis.value !== 'A' && res.bdStockCompartment ? res.bdStockCompartment.name : null;
        data.locationId = stockDis.value === 'C' && res.bdStockLocation ? res.locationId : null;
        data.bdStockLocation.name =
          stockDis.value === 'C' && res.bdStockLocation ? res.bdStockLocation.name : null;
        break;
      case 'bdStock':
        data.stockId = row.id ? row.id : null;
        data.bdStock.name = row.name ? row.name : null;
        data.compartmentId = null;
        data.locationId = null;
        data.bdStockCompartment = {};
        data.bdStockLocation = {};
        break;
      case 'bdStockCompartment':
        data.bdStockCompartment = {};
        data.compartmentId = row.id ? row.id : null;
        data.bdStockCompartment.name = row.name ? row.name : null;
        data.locationId = null;
        data.bdStockLocation = {};
        break;
      case 'bdStockLocation':
        data.bdStockLocation = {};
        data.locationId = row.id ? row.id : null;
        data.bdStockLocation.name = row.name ? row.name : null;
        break;
    }
  };
  //新增行时设置默认值
  const setDefaultTableData = (obj) => {
    obj.sort = cloneDeep(detailTableRef.value.rowSortData);
    obj.seq = obj.sort;
    obj.stockDis = cloneDeep(stockDis.value);
  };
  onMounted(() => {
    getListById();
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
