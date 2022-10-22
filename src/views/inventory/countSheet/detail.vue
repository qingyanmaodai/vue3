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
                        :placeholder="formState.bsStatus === 'B' ? '' : '请选择负责人'"
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
                        allowClear
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
            :columns="invCountSheetOfDetailColumns"
            :gridOptions="RuleOfExaGridOptions"
            :editRules="formRules"
            ref="detailTableRef"
            @clearDetailTableEvent="clearDetailTableEvent"
            @cellClickTableEvent="cellClickTableEvent"
            :detailTableData="detailTableData"
            :isShowIcon="formState.bsStatus !== 'B'"
            :isDisableButton="formState.bsStatus === 'B'"
            @filterModalSearchEvent="filterModalSearchEvent"
            filterTableName="BdMaterial"
            :inputDataList="inputDataList"
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
    invCountSheetOfDetailColumns,
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
  import { add, audit, unAudit, getOneById, InvCountSheetEntity } from '/@/api/invCountSheet';
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
  const formData: InvCountSheetEntity = {
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
    countNum: [{ required: true, message: '请输入盘点数量' }],
  });
  formRules[material] = [{ required: true, message: '请选择检验项目' }];
  formRules[stock] = [{ required: true, message: '请选择仓库' }];
  formRules[compartment] = [{ required: true, message: '请选择分仓' }];
  formRules[location] = [{ required: true, message: '请选择仓位' }];

  //筛选条件弹框组件
  /*约定数组下标，0：仓库，1：分仓，2，仓位，3：物料*/
  let inputDataList: any = ref<object[]>([
    {
      addonBeforeLabel: '仓库 : ',
      dtoUrlConfig: 'GET_STOCK_DTO',
      tableName: 'BdStock',
      tableUrl: Url.GET_PAGE_STOCK_LIST,
      nameParam: 'stockId',
      columnParam: 'stock_id',
    },
    {
      addonBeforeLabel: '分仓 : ',
      dtoUrlConfig: 'GET_SUB_STOCK_DTO',
      tableName: 'BdStockCompartment',
      tableUrl: Url.GET_PAGE_STOCK_COMPARTMENT_LIST,
      nameParam: 'compartmentId',
      columnParam: 'compartment_id',
    },
    {
      addonBeforeLabel: '仓位 : ',
      dtoUrlConfig: 'GET_LOCATION_DTO',
      tableName: 'BdStockLocation',
      tableUrl: Url.GET_PAGE_STOCK_LOCATION_LIST,
      nameParam: 'locationId',
      columnParam: 'location_id',
    },
    {
      addonBeforeLabel: '物料 : ',
      dtoUrlConfig: 'GET_MAT_DTO',
      tableName: 'BdMaterial',
      tableUrl: Url.GET_MATERIAL_LIST,
      nameParam: 'id',
      columnParam: 'id',
    },
  ]);
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
      item.bdMaterial = bdMaterial[index];
      item.bsStatus = 'A';
      item.matId = item.id;
    });
    let data = cloneDeep(res.records);
    const tableFullData = detailTableRef.value.getDetailData();
    detailTableData.value = tableFullData.concat(data);
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
    // formState.value[currDataParam[1]] = {};
    // formState.value[currDataParam[1]].id = row.id;
    // formState.value[currDataParam[1]].name = row.name;
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
        formState.value = Object.assign({}, formState.value, data);
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
  };
  //返回上一页
  const back = () => {
    router.go(-1);
  };
  //获取初始值
  const getListById = async () => {
    if (dataId) {
      const res: any = await getOneById({ params: dataId });
      formState.value = res;
      if (formState.value.dtData) {
        formState.value.dtData.map((r) => {
          r.bsStatus = formState.value.bsStatus;
        });
      }
      detailTableData.value = cloneDeep(formState.value.dtData);
    }
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
        data.bdMaterial.number = res.number ? res.number : null;
        data.bdMaterial.name = res.name ? res.name : null;
        data.bdMaterial.model = res.model ? res.model : null;
        data.bdMaterial.baseUnitName = res.baseUnit ? res.baseUnit.name : null;
        data.bdMaterial.weightUnitName = res.weightUnit ? res.weightUnit.name : null;
        data.stockId = res.bdStock ? res.bdStock.id : null;
        data.bdStock.name = res.bdStock ? res.bdStock.name : null;
        data.compartmentId = res.compartmentId ? res.compartmentId : null;
        data.bdStockCompartment.name = res.bdStockCompartment ? res.bdStockCompartment.name : null;
        data.locationId = res.locationId ? res.locationId : null;
        data.bdStockLocation.name = res.bdStockLocation ? res.bdStockLocation.name : null;
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
  };

  onMounted(() => {
    getListById();
    //假如有dtData 让里面的sort等于seq
    if (detailTableRef.value.getDetailData()) {
      detailTableRef.value.getDetailData().map((item) => {
        item.sort = item.seq;
      });
    }
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
