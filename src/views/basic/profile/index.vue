<template>
  <div>
    <LayoutHeader style="background-color: #fff; height: 60px; padding: 0 20px">
      <a style="font-size: 1.4rem; font-weight: bold; color: #000; line-height: 60px" @click="back"
        ><RollbackOutlined /> 返回</a
      >
      <div style="display: flex; float: right">
        <Button type="primary" class="button" @click="onSubmit" v-if="showSubmit">保存</Button>
        <Button danger class="button" @click="onExam" v-if="showExam">审核</Button>
        <Button danger class="button" @click="unExam" v-if="showUnExam">反审核</Button>
      </div>
    </LayoutHeader>
    <a-card class="content">
      <Tabs v-model:activeKey="activeKey" class="tabs">
        <TabPane key="1" tab="基本信息">
          <a-form :model="formState" :rules="formRules">
            <Row>
              <Col :span="8">
                <a-form-item label="物料编码：" ref="number" name="number" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.number"
                    placeholder="请输入物料编码"
                    :disabled="hasId"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="物料名称：" ref="name" name="name" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.name"
                    name="name"
                    placeholder="请输入物料名称"
                    :disabled="showUnExam"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="简称：" ref="shortName" name="shortName" class="item">
                  <Input
                    allowClear
                    class="input"
                    v-model:value="formState.shortName"
                    placeholder="请输入简称"
                    :disabled="showUnExam"
                  />
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item
                  label="基本单位:"
                  v-model:value="formState.baseUnitId"
                  ref="baseUnitId"
                  name="baseUnitId"
                  class="item"
                >
                  <ExInput
                    :show="showUnExam"
                    autocomplete="off"
                    class="input"
                    placeholder="请选择基本单位"
                    v-model:value="formState.baseUnitName"
                    :disabled="showUnExam"
                    @search="onStock('baseUnit')"
                    @clear="onClear('baseUnit')"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item
                  label="物料分组："
                  v-model:value="formState.groupId"
                  ref="groupId"
                  name="groupId"
                  class="item"
                >
                  <ExInput
                    autocomplete="off"
                    class="input"
                    placeholder="请选择物料分组"
                    label="物料分组"
                    :show="showUnExam"
                    v-model:value="formState.groupName"
                    :disabled="showUnExam"
                    @search="onGroupSearch(formState.groupName)"
                    @clear="onClear('group')"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="物料属性：" ref="attr" name="attr" class="item">
                  <Select v-model:value="formState.attr" class="select" :disabled="showUnExam">
                    <SelectOption value="A">自制</SelectOption>
                    <SelectOption value="B">委外</SelectOption>
                    <SelectOption value="C">虚拟</SelectOption>
                  </Select>
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item
                  label="重量单位："
                  ref="weightUnitId"
                  name="weightUnitId"
                  class="item"
                  v-model:value="formState.weightUnitId"
                >
                  <ExInput
                    class="input"
                    autocomplete="off"
                    placeholder="请选择重量单位"
                    label="重量单位"
                    :show="showUnExam"
                    v-model:value="formState.weightName"
                    :disabled="showUnExam"
                    @search="onStock('weightUnit')"
                    @clear="onClear('weightUnit')"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="净重：" ref="netWeight" name="netWeight" class="item">
                  <InputNumber
                    class="input"
                    v-model:value="formState.netWeight"
                    :min="0"
                    :step="0.1"
                    :disabled="showUnExam"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="规格型号：" ref="model" name="model" class="item">
                  <Input
                    class="input"
                    v-model:value="formState.model"
                    placeholder="请输入规格型号"
                    :disabled="showUnExam"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="数据状态：" ref="bsStatus" name="bsStatus" class="item">
                  <Select v-model:value="formState.bsStatus" class="select" disabled>
                    <SelectOption value="A">创建</SelectOption>
                    <SelectOption value="B">已审核</SelectOption>
                  </Select>
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item
                  label="旧物料编码："
                  ref="oldMatNumber"
                  name="oldMatNumber"
                  class="item"
                >
                  <Input
                    class="input"
                    v-model:value="formState.oldMatNumber"
                    placeholder="请输入旧物料编码"
                    :disabled="showUnExam"
                  />
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item
                  label="仓库："
                  ref="stockId"
                  name="stockId"
                  class="item"
                  v-model:value="formState.stockId"
                >
                  <ExInput
                    autocomplete="off"
                    class="input"
                    placeholder="请选择仓库"
                    label="仓库"
                    :show="showUnExam"
                    v-model:value="formState.stockName"
                    :disabled="showUnExam"
                    @search="onStock('stock')"
                    @clear="onClear('stock')"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item
                  v-model:value="formState.subStockId"
                  label="分仓："
                  ref="subStockId"
                  name="subStockId"
                  class="item"
                >
                  <ExInput
                    autocomplete="off"
                    class="input"
                    placeholder="请选择分仓"
                    label="分仓"
                    :show="showUnExam"
                    v-model:value="formState.subStockName"
                    :disabled="hasSub"
                    @search="onStock('sub')"
                    @clear="onClear('sub')"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item
                  v-model:value="formState.bdStockLocationId"
                  label="仓位："
                  ref="bdStockLocationId"
                  name="bdStockLocationId"
                  class="item"
                >
                  <ExInput
                    autocomplete="off"
                    class="input"
                    placeholder="请选择仓位"
                    label="仓位"
                    :show="showUnExam"
                    v-model:value="formState.bdStockLocationName"
                    :disabled="hasLocation"
                    @search="onStock('location')"
                    @clear="onClear('location')"
                  />
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="备注：" ref="mark" name="mark" class="item">
                  <Textarea
                    v-model:value="formState.mark"
                    placeholder="请添加描述"
                    :rows="3"
                    class="textArea"
                    :disabled="showUnExam"
                  />
                </a-form-item>
              </Col>
            </Row>
          </a-form>
        </TabPane>
        <TabPane key="2" tab="质量信息">
          <a-form :model="formState" :rules="formRules">
            <div class="keyTwo">
              <Row>
                <Col :span="8">
                  <a-form-item
                    label="来料检验"
                    ref="stockInExamine"
                    name="stockInExamine"
                    class="switch"
                  >
                    <div class="switchDiv">
                      <Switch
                        checked-children="开"
                        un-checked-children="关"
                        :checkedValue="1"
                        :unCheckedValue="0"
                        v-model:checked="formState.stockInExamine"
                        :disabled="showUnExam"
                      />
                    </div>
                  </a-form-item>
                </Col>
                <Col :span="8">
                  <a-form-item
                    label="生产检验"
                    ref="produceExamine"
                    name="produceExamine"
                    class="switch"
                  >
                    <div class="switchDiv">
                      <Switch
                        checked-children="开"
                        un-checked-children="关"
                        :checkedValue="1"
                        :unCheckedValue="0"
                        v-model:checked="formState.produceExamine"
                        :disabled="showUnExam"
                      />
                    </div>
                  </a-form-item>
                </Col>
                <Col :span="8">
                  <a-form-item
                    label="发货检验"
                    ref="stockOutExamine"
                    name="stockOutExamine"
                    class="switch"
                  >
                    <div class="switchDiv">
                      <Switch
                        checked-children="开"
                        un-checked-children="关"
                        :checkedValue="1"
                        :unCheckedValue="0"
                        v-model:checked="formState.stockOutExamine"
                        :disabled="showUnExam"
                      />
                    </div>
                  </a-form-item>
                </Col>
              </Row>
              <Row>
                <Col :span="8">
                  <a-form-item label="启用SN：" ref="enableSn" name="enableSn" class="switch">
                    <div class="switchDiv">
                      <Switch
                        checked-children="开"
                        un-checked-children="关"
                        :checkedValue="1"
                        :unCheckedValue="0"
                        v-model:checked="formState.enableSn"
                        :disabled="showUnExam"
                      />
                    </div>
                  </a-form-item>
                </Col>
                <Col :span="8">
                  <a-form-item
                    label="批次管理："
                    ref="enableBatch"
                    name="enableBatch"
                    class="switch"
                  >
                    <div class="switchDiv">
                      <Switch
                        checked-children="开"
                        un-checked-children="关"
                        :checkedValue="1"
                        :unCheckedValue="0"
                        v-model:checked="formState.enableBatch"
                        :disabled="showUnExam"
                      />
                    </div>
                  </a-form-item>
                </Col>
                <Col :span="8">
                  <a-form-item
                    v-model:value="formState.examineId"
                    label="检验方案"
                    ref="bdExamineId"
                    name="bdExamineId"
                    class="item"
                    @clear="onClear"
                  >
                    <ExInput
                      autocomplete="off"
                      class="input"
                      placeholder="请选择检验方案"
                      label="检验方案"
                      :show="showUnExam"
                      v-model:value="formState.bdExamineName"
                      :disabled="showUnExam"
                      @search="onStock('plan')"
                      @clear="onClear('plan')"
                    />
                  </a-form-item>
                </Col>
              </Row>
              <Row>
                <Col :span="8">
                  <a-form-item label="最小库存：" ref="minSize" name="minSize" class="item">
                    <InputNumber
                      class="input"
                      v-model:value="formState.minStockNum"
                      :disabled="showUnExam"
                      :min="0" /></a-form-item
                ></Col>
                <Col :span="8">
                  <a-form-item label="最大库存：" ref="maxSize" name="maxSize" class="item">
                    <InputNumber
                      class="input"
                      v-model:value="formState.maxStockNum"
                      :disabled="showUnExam"
                      :min="0" /></a-form-item
                ></Col>
                <Col :span="8">
                  <a-form-item
                    label="安全库存："
                    ref="safeStockNum"
                    name="safeStockNum"
                    class="item"
                  >
                    <InputNumber
                      class="input"
                      v-model:value="formState.safeStockNum"
                      :disabled="showUnExam"
                      :min="0" /></a-form-item
                ></Col>
              </Row>
              <Row>
                <Col :span="8">
                  <a-form-item
                    label="存储期（天）："
                    ref="storagePeriod"
                    name="storagePeriod"
                    class="item"
                  >
                    <InputNumber
                      class="input"
                      v-model:value="formState.storagePeriod"
                      :min="0"
                      :disabled="showUnExam"
                    />
                  </a-form-item>
                </Col>
              </Row>
            </div>
          </a-form>
        </TabPane>
        <TabPane key="3" tab="其他信息">
          <a-form :model="formState" :rules="formRules">
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
                  <Input class="input" v-model:value="formState.updateBy" disabled /> </a-form-item
              ></Col>
            </Row>
          </a-form>
        </TabPane>
      </Tabs>
    </a-card>
    <!--  点击物料分组弹框  -->
    <a-modal v-model:visible="visibleGroupModal" title="物料分组" ref="node">
      <a-tree-select
        loading
        show-search
        v-model:value="formState.node"
        style="width: 100%"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        placeholder="请选择物料分组"
        treeNodeFilterProp="title"
        tree-default-expand-all
        :treeData="treeData"
        @change="groupSelect"
      />
    </a-modal>
    <BasicSearch
      style="top: 20px"
      :modalType="modalType"
      @cellClickEvent="cellClickEvent"
      @searchList="searchList"
      title="基础信息查询"
      ref="basicSearchRef"
      :gridOptions="unitGridOptions"
    />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref, UnwrapRef } from 'vue';
  import {
    Button,
    Card,
    Col,
    Form,
    FormItem,
    Input,
    InputNumber,
    LayoutHeader,
    Modal,
    Row,
    Select,
    SelectOption,
    Switch,
    TabPane,
    Tabs,
    Textarea,
    TreeSelect,
  } from 'ant-design-vue';
  import { ExInput } from '/@/components/ExInput';
  import { RollbackOutlined } from '@ant-design/icons-vue';
  import { BasicSearch } from '/@/components/AMoreSearch';
  import {
    unitGridOptions,
    planColumns,
    stockColumns,
    subStockColumns,
    locationColumns,
    unitColumns,
  } from '/@/components/AMoreSearch/data';
  import { useRoute, useRouter } from 'vue-router';
  import { TreeItem } from '/@/components/Tree';
  import { MatGroupEntity, treeMatGroup } from '/@/api/matGroup';
  import { config } from '/@/utils/publicParamConfig';
  import {
    addMatTable,
    auditMatTable,
    getLocationOption,
    getMatTableById,
    getMatTableUnit,
    getPublicList,
    getStockOption,
    getSubOption,
    unAuditMatTable,
    updateMatTable,
  } from '/@/api/matTable';
  import { cloneDeep } from 'lodash-es';
  import { VXETable } from 'vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  const AModal = Modal;
  const AForm = Form;
  const AFormItem = FormItem;
  const ATreeSelect = TreeSelect;
  const ACard = Card;

  const router = useRouter();
  //空参数
  const paramsNull = { params: '' };
  //整个基本信息 v-model:activeKey="activeKey"
  const activeKey = ref<string>('1');
  //物料分组弹框visible
  const visibleGroupModal: any = ref<boolean>(false);
  //弹窗类型
  let modalType = ref<string>('');
  //基础信息查询组件ref
  const basicSearchRef: any = ref<any>(undefined);
  //更新基础信息表头数据
  const getCurrentCols = (key: any) => {
    const colConfig = {
      baseUnit: unitColumns,
      weightUnit: unitColumns,
      stock: stockColumns,
      sub: subStockColumns,
      location: locationColumns,
      plan: planColumns,
    };
    return colConfig[key];
  };
  //选择对应的基本信息弹框
  let chosenModal: String = '';
  //审核状态
  const hasSub = ref<boolean>(false); //分仓
  const hasLocation = ref<boolean>(false); //仓位
  const showUnExam = ref<boolean>(false); //反审核
  const showExam = ref<boolean>(false); //审核
  const showSubmit = ref<boolean>(true); //保存

  //对应输入框绑定的值接口类型
  interface FormState {
    id?: string | undefined;
    number: string | undefined;
    name: string | undefined;
    shortName: string | undefined;
    baseUnitName: string | undefined;
    baseUnitId: string | undefined;
    groupId: string | undefined;
    groupName: string | undefined;
    attr: string | undefined;
    weightUnitId: string | undefined;
    weightName: string | undefined;
    netWeight: number | undefined;
    model: string | undefined;
    bsStatus: string | undefined;
    labelValue: string | undefined;
    oldMatNumber: number | undefined;
    mark: string | undefined;
    node: string | undefined;
    stockId: string | undefined;
    stockName: string | undefined;
    bdStock: string | undefined;
    subStockId: string | undefined;
    subStockName: string | undefined;
    bdSubStock: string | undefined;
    bdStockLocation: string | undefined;
    bdStockLocationId: string | undefined;
    bdStockLocationName: string | undefined;
    enableSn: number | undefined;
    enableBatch: number | undefined;
    storagePeriod: number | undefined;
    minStockNum: number | undefined;
    maxStockNum: number | undefined;
    safeStockNum: number | undefined;
    examineId: string | undefined;
    bdExamineName: string | undefined;
    stockInExamine: number | undefined;
    stockOutExamine: number | undefined;
    produceExamine: number | undefined;
    createTime: string | undefined;
    createBy: string | undefined;
    updateTime: string | undefined;
    updateBy: string | undefined;
  }
  //初始化
  const formState: UnwrapRef<FormState> = reactive({
    id: undefined,
    number: undefined,
    name: undefined,
    shortName: undefined,
    baseUnitName: undefined,
    baseUnitId: undefined,
    groupId: router.currentRoute.value.query.groupId?.toString(),
    groupName: router.currentRoute.value.query.groupName?.toString(),
    attr: 'A',
    weightUnitId: undefined,
    weightName: undefined,
    netWeight: undefined,
    model: undefined,
    bsStatus: 'A',
    labelValue: undefined,
    oldMatNumber: undefined,
    mark: undefined,
    node: undefined,
    bdStock: undefined,
    bdSubStock: undefined,
    stockId: undefined,
    stockName: undefined,
    subStockId: undefined,
    subStockName: undefined,
    bdStockLocation: undefined,
    bdStockLocationId: undefined,
    bdStockLocationName: undefined,
    enableSn: undefined,
    enableBatch: undefined,
    storagePeriod: undefined,
    minStockNum: undefined,
    maxStockNum: undefined,
    safeStockNum: undefined,
    examineId: undefined,
    bdExamineName: undefined,
    stockInExamine: undefined,
    stockOutExamine: undefined,
    produceExamine: undefined,
    updateBy: undefined,
    updateTime: undefined,
    createBy: undefined,
    createTime: undefined,
  });

  const formRules = reactive({
    name: [{ required: true, message: '请输入物料名称' }],
    number: [{ required: true, message: '请输入物料编码' }],
    groupId: [{ required: true, message: '请选择物料分组' }],
    baseUnitId: [{ required: true, message: '请选择基本单位' }],
    attr: [{ required: true, message: '请选择物料属性' }],
  });

  //物料分组弹框
  const onGroupSearch = (name) => {
    visibleGroupModal.value = true;
    formState.node = name;
    if (formState.node == '') {
      formState.node = undefined;
    }
  };

  //点击清空图标清空事件
  const onClear = (key: string) => {
    switch (key) {
      case 'baseUnit':
        formState.baseUnitName = '';
        formState.baseUnitId = '';
        break;
      case 'weightUnit':
        formState.weightName = '';
        formState.weightUnitId = '';
        break;
      case 'group':
        formState.groupId = '';
        formState.groupName = '';
        break;
      case 'stock':
        formState.stockId = '';
        formState.stockName = '';
        formState.subStockId = '';
        formState.subStockName = '';
        formState.bdStockLocationId = '';
        formState.bdStockLocationName = '';
        break;
      case 'sub':
        formState.subStockId = '';
        formState.subStockName = '';
        formState.bdStockLocationId = '';
        formState.bdStockLocationName = '';
        break;
      case 'location':
        formState.bdStockLocationId = '';
        formState.bdStockLocationName = '';
        break;
      case 'plan':
        formState.examineId = '';
        formState.bdExamineName = '';
        break;
    }
  };
  //获取仓库字段
  const getStockOps = async (key) => {
    if (key == 'stock') {
      try {
        let data = await getStockOption(paramsNull);
        basicSearchRef.value.init(data);
      } catch (e) {
        console.log('获取仓库选项字段失败', e);
      }
    } else if (key == 'sub') {
      try {
        let arr: any = [];
        let data = await getSubOption(paramsNull);
        arr = cloneDeep(data);
        arr = arr.filter((e) => e.fieldName != 'stock_id');
        basicSearchRef.value.init(arr);
      } catch (e) {
        console.log('获取分仓选项字段失败', e);
      }
    } else if (key == 'location') {
      try {
        let arr: any = [];
        let data = await getLocationOption(paramsNull);
        arr = cloneDeep(data);
        arr = arr.filter((e) => e.fieldName != 'sub_stock_id' && e.fieldName != 'stock_id');
        basicSearchRef.value.init(arr);
      } catch (e) {
        console.log('获取仓位选项字段失败', e);
      }
    } else {
      try {
        let arr: any = [];
        let data = await getMatTableUnit(paramsNull);
        arr = cloneDeep(data);
        arr = arr.filter((e) => e.fieldName != 'bs_status');
        basicSearchRef.value.init(arr);
      } catch (e) {
        console.log('详情页获取基本单位字段失败', e);
      }
    }
  };
  //弹窗类型
  let queryStockParam = reactive({
    subStock: {},
    stockLocation: {},
    subStockName: {},
    stockName: {},
  });
  //输入框点击放大镜事件
  const onStock: any = async (key) => {
    let q = {};
    await getStockOps(key);
    modalType.value = key;
    const res: any = await getPublicList(
      {
        params: [
          q,
          {
            table: '',
            name: 'bsStatus',
            column: 'bs_status',
            link: 'AND',
            rule: 'EQ',
            type: 'string',
            val: 'B',
            startWith: '',
            endWith: '',
          },
        ],
      },
      config.PUBLIC_REQUEST_URL[key],
    );
    chosenModal = key;
    let dataCols = getCurrentCols(key);
    let dataList = res;
    basicSearchRef.value.bSearch(true);
    basicSearchRef.value.initCols(dataCols);
    basicSearchRef.value.initList(dataList);
    basicSearchRef.value.initSearch(key);
    return res;
  };

  //选择仓库后查询——联动
  //key:在待用url中选择的
  //colName:需要查询的名字，如编码，名称。。。
  //id:输入的值
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
  //双击单元格选择事件——获取双击所选的值并赋值到对应字段
  const cellClickEvent = async (row) => {
    switch (chosenModal) {
      case 'baseUnit':
        formState.baseUnitId = row.id;
        formState.baseUnitName = row.name;
        break;
      case 'weightUnit':
        formState.weightName = row.name;
        formState.bdStockLocationName = '';
        formState.weightUnitId = row.id;
        break;
      case 'stock':
        formState.stockId = row.id;
        formState.stockName = row.name;
        queryStockParam.subStock = {
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
        await getNextStock('stock', 'formState.stockId', formState.stockId);
        break;
      case 'sub':
        formState.subStockId = row.id;
        formState.subStockName = row.name;
        queryStockParam.stockLocation = {
          table: '',
          name: 'subStockId',
          column: 'sub_stock_id',
          link: 'AND',
          rule: 'EQ',
          type: 'string',
          val: row.id,
          startWith: '',
          endWith: '',
        };
        const stockByStock = await getNextStock('stock', 'id', row.stockId);
        formState.stockId = stockByStock.records[0].id;
        formState.stockName = stockByStock.records[0].name;
        break;
      case 'location':
        formState.bdStockLocationId = row.id;
        formState.bdStockLocationName = row.name;
        queryStockParam.subStockName = {
          table: '',
          name: 'subStockId',
          column: 'sub_stock_id',
          link: 'AND',
          rule: 'EQ',
          type: 'string',
          val: row.id,
          startWith: '',
          endWith: '',
        };
        const subStockByStockLocation = await getNextStock('sub', 'id', row.subStockId);
        const stockByStockLocation = await getNextStock('stock', 'id', row.stockId);
        formState.subStockId = subStockByStockLocation.records[0].id;
        formState.subStockName = subStockByStockLocation.records[0].name;
        formState.stockId = stockByStockLocation.records[0].id;
        formState.stockName = stockByStockLocation.records[0].name;
        break;
      case 'plan':
        formState.examineId = row.id;
        formState.bdExamineName = row.name;
        break;
    }
    basicSearchRef.value.bSearch(false);
    if (formState.stockId) {
      hasSub.value = false;
      if (formState.subStockId) {
        hasLocation.value = false;
      }
    }
  };

  //获取物料分组数据
  let treeData = ref<TreeItem[]>([]);
  const getGroup = async () => {
    const tree = await treeMatGroup({ params: '0' });
    runTree(tree);
    // treeData.value = JSON.parse(JSON.stringify(tree));   //两种方式
    treeData.value = cloneDeep(tree);
  };
  getGroup();
  const runTree = (tree: MatGroupEntity[]) => {
    tree.forEach((item) => {
      item.title = item.name;
      item.value = item.id;
      item.key = item.id;
      runTree(item.children || []);
    });
  };
  //物料分组弹框关
  const groupSelect = (value, node) => {
    formState.node = node;
    formState.groupName = formState.node;
    formState.groupId = value;
    visibleGroupModal.value = false;
  };
  let getParams = () => {
    let query = router.currentRoute.value.query;
    console.log('query', query);
  };
  getParams();

  //接受参数
  let rowId = useRoute().query.row?.toString();
  let hasId = ref<boolean>(false);
  console.log('编辑id', rowId);

  //如果有id，则通过getMatTableById，进入编辑页面。没有id——新增
  const getListById = async (id) => {
    if (rowId) {
      id = rowId;
      hasId.value = true;
    }
    const res: any = await getMatTableById({
      params: id,
    });
    formState.number = res.number;
    formState.name = res.name;
    formState.shortName = res.shortName;
    formState.baseUnitId = res.baseUnit.id;
    formState.baseUnitName = res.baseUnit.name;
    formState.groupId = res.bdMaterialGroup.id;
    formState.groupName = res.bdMaterialGroup.name;
    formState.attr = res.attr;
    formState.netWeight = res.netWeight;
    formState.model = res.model;
    formState.bsStatus = res.bsStatus;
    //创建状态
    if (rowId && res.bsStatus === 'A') {
      showExam.value = true;
      showUnExam.value = false;
    } else if (rowId && res.bsStatus === 'B') {
      //审核状态
      showExam.value = false;
      showUnExam.value = true;
      showSubmit.value = false;
      hasSub.value = true;
      hasLocation.value = true;
    }
    if (formState.bsStatus === 'A') {
      formState.labelValue = '创建';
    } else {
      formState.labelValue = '已审核';
    }
    formState.oldMatNumber = res.oldMatNumber;
    formState.mark = res.mark;
    formState.stockId = res.stockId;
    if (formState.stockId) {
      formState.stockId = res.bdStock.id;
      formState.stockName = res.bdStock.name;
      queryStockParam.subStock = {
        table: '',
        name: 'stockId',
        column: 'stock_id',
        link: 'AND',
        rule: 'EQ',
        type: 'string',
        val: res.bdStock.id,
        startWith: '',
        endWith: '',
      };
    }
    formState.bdStock = res.bdStock;
    formState.subStockId = res.subStockId;
    if (formState.subStockId) {
      formState.subStockId = res.bdSubStock.id;
      formState.subStockName = res.bdSubStock.name;
      queryStockParam.stockLocation = {
        table: '',
        name: 'subStockId',
        column: 'sub_stock_id',
        link: 'AND',
        rule: 'EQ',
        type: 'string',
        val: res.bdSubStock.id,
        startWith: '',
        endWith: '',
      };
    }
    formState.bdSubStock = res.bdSubStock;
    formState.bdStockLocationId = res.bdStockLocationId;
    if (formState.bdStockLocationId) {
      formState.bdStockLocationId = res.bdStockLocation.id;
      formState.bdStockLocationName = res.bdStockLocation.name;
    }
    formState.bdStockLocation = res.bdStockLocation;
    formState.enableSn = res.enableSn;
    formState.enableBatch = res.enableBatch;
    formState.storagePeriod = res.storagePeriod;
    formState.minStockNum = res.minStockNum;
    formState.maxStockNum = res.minStockNum;
    formState.safeStockNum = res.safeStockNum;
    if (res.bdExamine != undefined && res.bdExamine.id) {
      formState.examineId = res.bdExamine.id;
      formState.bdExamineName = res.bdExamine.name;
    }
    formState.stockInExamine = res.stockInExamine;
    formState.stockOutExamine = res.stockOutExamine;
    formState.produceExamine = res.produceExamine;
    formState.createTime = res.createTime;
    formState.createBy = res.createBy;
    formState.updateTime = res.updateTime;
    formState.updateBy = res.updateBy;
    formState.weightUnitId = res.weightUnitId;
    if (formState.weightUnitId) {
      formState.weightUnitId = res.weightUnit.id;
      formState.weightName = res.weightUnit.name;
    }
  };
  const stockHandle = async () => {
    //修改
    if (rowId) {
      await getListById(rowId);
      if (formState.bsStatus == 'B') {
        hasSub.value = true;
        hasLocation.value = true;
      } else {
      }
    } else {
    }
  };
  stockHandle();
  //搜索功能
  const searchList = async (type, keywords) => {
    let param: any = [];
    param.push(keywords);
    if (type == 'sub') {
      param.push(queryStockParam.subStock);
    } else if (type == 'location') {
      param.push(queryStockParam.stockLocation);
    }
    basicSearchRef.value.initList(
      await getPublicList(
        {
          params: param,
        },
        config.PUBLIC_REQUEST_URL[type],
      ),
    );
  };
  //保存事件
  const onSubmit = async () => {
    let newData = {
      id: rowId,
      number: formState.number,
      name: formState.name,
      shortName: formState.shortName,
      baseUnitName: formState.baseUnitName,
      baseUnitId: formState.baseUnitId,
      groupName: formState.groupName,
      groupId: formState.groupId,
      attr: formState.attr,
      netWeight: formState.netWeight,
      model: formState.model,
      bsStatus: formState.bsStatus,
      oldMatNumber: formState.oldMatNumber,
      mark: formState.mark,
      stockName: formState.stockName,
      stockId: formState.stockId,
      subStockId: formState.subStockId,
      subStockName: formState.subStockName,
      bdStockLocationId: formState.bdStockLocationId,
      bdStockLocationName: formState.bdStockLocationName,
      enableSn: formState.enableSn,
      enableBatch: formState.enableBatch,
      storagePeriod: formState.storagePeriod,
      minStockNum: formState.minStockNum,
      maxStockNum: formState.maxStockNum,
      safeStockNum: formState.safeStockNum,
      examineId: formState.examineId,
      bdExamineName: formState.bdExamineName,
      stockInExamine: formState.stockInExamine,
      stockOutExamine: formState.stockOutExamine,
      produceExamine: formState.produceExamine,
      createTime: formState.createTime,
      createBy: formState.createBy,
      updateTime: formState.updateTime,
      updateBy: formState.updateBy,
      weightUnitId: formState.weightUnitId,
    };
    if (!rowId) {
      if (
        !formState.name ||
        !formState.number ||
        !formState.baseUnitId ||
        !formState.groupId ||
        !formState.attr
      ) {
        createMessage.error('必填字段不能为空');
      } else {
        try {
          const addList = await addMatTable({
            params: newData,
          });
          if (addList.id != null) {
            createMessage.success('添加成功');
            // back();
            showExam.value = true;
            rowId = addList.id;
            await getListById(rowId);
          }
        } catch (e) {
          console.log('失败', e);
        }
      }
    } else {
      newData.id = rowId;
      if (
        !formState.name ||
        !formState.number ||
        !formState.baseUnitId ||
        !formState.groupId ||
        !formState.attr
      ) {
        createMessage.error('必填字段不能为空');
      } else {
        try {
          const updateList = async () => {
            await updateMatTable({
              params: newData,
            });
          };
          await updateList();
          createMessage.success('修改成功');
          // back();
        } catch (e) {
          console.log('失败', e);
        }
      }
    }
  };

  //点击新增时:控制审核与反审核按钮显示
  const btnChecking = () => {
    if (!rowId) {
      showExam.value = false;
      showUnExam.value = false;
    }
  };
  //审核功能
  const onExam = async () => {
    const type = await VXETable.modal.confirm('您确定要审核当前物料吗?');
    if (type == 'confirm') {
      if (formState.labelValue === 'A' || formState.labelValue === '创建') {
        try {
          const auditEvent = async () => {
            await auditMatTable({
              params: {
                id: rowId,
              },
            });
          };
          await auditEvent();
          showSubmit.value = false;
          showExam.value = false;
          showUnExam.value = true;
          hasSub.value = true;
          hasLocation.value = true;
          createMessage.success('审核成功');
          await getListById(rowId);
          // back();
        } catch (e) {
          console.log('失败', e);
        }
      }
    } else {
      createMessage.error('该物料已审核，无需再次审核');
      // back();
    }
  };
  //反审核功能
  const unExam = async () => {
    const type = await VXETable.modal.confirm('您确定要反审核当前物料吗?');
    if (type == 'confirm') {
      if (formState.labelValue === 'B' || formState.labelValue === '已审核') {
        try {
          const unAuditEvent = async () => {
            await unAuditMatTable({
              params: {
                id: rowId,
              },
            });
          };
          await unAuditEvent();
          showSubmit.value = true;
          showExam.value = true;
          showUnExam.value = false;
          hasSub.value = false;
          hasLocation.value = false;
          createMessage.success('反审核成功');
          await getListById(rowId);
          // back();
        } catch (e) {
          console.log('失败', e);
        }
      } else {
        createMessage.error('该物料已反审核，无需再次反审核');
        // back();
      }
    }
  };
  //返回上一页
  const back = () => {
    router.go(-1);
  };
  //刚进入页面——加载完后，需要执行的方法
  onMounted(() => {
    btnChecking();
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
    height: 80vh;
  }
  .button {
    margin: 15px;
  }
</style>
