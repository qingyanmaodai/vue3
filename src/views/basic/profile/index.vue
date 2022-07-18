<template>
  <div>
    <LayoutHeader style="background-color: #fff; height: 60px; padding: 0 20px">
      <a style="font-size: 1.4rem; font-weight: bold; color: #000; line-height: 60px" @click="back"
        ><RollbackOutlined /> 返回</a
      >
      <div style="display: flex; float: right">
        <Button type="primary" class="button" @click="onSubmit">保存</Button>
        <Button type="warning" class="button" @click="onExam" v-if="rowId">审核</Button>
      </div>
    </LayoutHeader>
    <a-card class="content">
      <Tabs v-model:activeKey="activeKey" class="tabs">
        <TabPane key="1" tab="基本信息">
          <a-form
            :model="formState"
            :rules="formRules"
            @finish="handleFinish"
            @finishFailed="handleFinishFailed"
          >
            <Row>
              <Col :span="8">
                <a-form-item label="物料编码：" ref="number" name="number" class="item">
                  <Input
                    class="input"
                    v-model:value="formState.number"
                    placeholder="请输入物料编码"
                    :disabled="rowId"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="物料名称：" ref="name" name="name" class="item">
                  <Input
                    class="input"
                    v-model:value="formState.name"
                    name="name"
                    placeholder="请输入物料名称"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="简称：" ref="shortName" name="shortName" class="item">
                  <Input
                    class="input"
                    v-model:value="formState.shortName"
                    placeholder="请输入简称"
                  />
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="基本单位：" ref="baseUnitId" name="baseUnitId" class="item">
                  <InputSearch
                    readonly
                    v-model:value="formState.baseUnitId"
                    class="input"
                    placeholder="请选择基本单位"
                    @search="onStock('baseUnit')"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="物料分组：" ref="groupId" name="groupId" class="item">
                  <InputSearch
                    readonly
                    v-model:value="formState.groupId"
                    class="input"
                    placeholder="请选择物料分组"
                    @search="onGroupSearch(formState)"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="物料属性：" ref="attr" name="attr" class="item">
                  <Select v-model:value="formState.attr" class="select">
                    <SelectOption value="A">自制</SelectOption>
                    <SelectOption value="B">外购</SelectOption>
                    <SelectOption value="C">委外</SelectOption>
                    <SelectOption value="D">虚拟</SelectOption>
                  </Select>
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="重量单位：" ref="weightUnitId" name="weightUnitId" class="item">
                  <InputSearch
                    readonly
                    v-model:value="formState.weightUnitId"
                    class="input"
                    placeholder="请选择重量单位"
                    @search="onStock('weightUnit')"
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
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="规格型号：" ref="model" name="model" class="item">
                  <Input
                    class="input"
                    v-model:value="formState.model"
                    placeholder="请输入规格型号"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="数据状态：" ref="bsStatus" name="bsStatus" class="item">
                  <Select v-model:value="formState.bsStatus" class="select" disabled="true">
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
                  />
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="仓库：" ref="stockId" name="stockId" class="item">
                  <InputSearch
                    readonly
                    class="input"
                    v-model:value="formState.stockId"
                    placeholder="请选择仓库"
                    @search="onStock('stock')"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="分仓：" ref="subStockId" name="subStockId" class="item">
                  <InputSearch
                    readonly
                    class="input"
                    :disabled="hasSub"
                    v-model:value="formState.subStockId"
                    placeholder="请选择分仓"
                    @search="onStock('sub')"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item
                  readonly
                  label="仓位："
                  ref="bdStockLocationId"
                  name="bdStockLocationId"
                  class="item"
                >
                  <InputSearch
                    class="input"
                    v-model:value="formState.bdStockLocationId"
                    placeholder="请选择仓位"
                    :disabled="hasLocation"
                    @search="onStock('location')"
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
                  />
                </a-form-item>
              </Col>
            </Row>
          </a-form>
        </TabPane>
        <TabPane key="2" tab="质量信息">
          <a-form :model="formState" :rules="formRules">
            <Row>
              <Col :span="8">
                <a-form-item
                  label="来料检验"
                  ref="stockInExamine"
                  name="stockInExamine"
                  class="item"
                  style="width: 33%"
                >
                  <Switch
                    checked-children="开"
                    un-checked-children="关"
                    :checkedValue="1"
                    :unCheckedValue="0"
                    v-model:checked="formState.stockInExamine"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item
                  label="生产检验"
                  ref="produceExamine"
                  name="produceExamine"
                  class="item"
                  style="width: 33%"
                >
                  <Switch
                    checked-children="开"
                    un-checked-children="关"
                    :checkedValue="1"
                    :unCheckedValue="0"
                    v-model:checked="formState.produceExamine"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item
                  label="发货检验"
                  ref="stockOutExamine"
                  name="stockOutExamine"
                  class="item"
                  style="width: 33%"
                >
                  <Switch
                    checked-children="开"
                    un-checked-children="关"
                    :checkedValue="1"
                    :unCheckedValue="0"
                    v-model:checked="formState.stockOutExamine"
                  />
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item
                  label="启用SN："
                  ref="enableSn"
                  name="enableSn"
                  class="item"
                  style="width: 33%"
                >
                  <Switch
                    checked-children="开"
                    un-checked-children="关"
                    :checkedValue="1"
                    :unCheckedValue="0"
                    v-model:checked="formState.enableSn"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item
                  label="批次管理："
                  ref="enableBatch"
                  name="enableBatch"
                  class="item"
                  style="width: 33%"
                >
                  <Switch
                    checked-children="开"
                    un-checked-children="关"
                    :checkedValue="1"
                    :unCheckedValue="0"
                    v-model:checked="formState.enableBatch"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="检验方案" ref="isSn" name="isSn" class="item">
                  <InputSearch class="input" readonly />
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="最小库存：" ref="minSize" name="minSize" class="item">
                  <InputNumber
                    class="input"
                    v-model:value="formState.minStockNum"
                    :min="0" /></a-form-item
              ></Col>
              <Col :span="8">
                <a-form-item label="最大库存：" ref="maxSize" name="maxSize" class="item">
                  <InputNumber
                    class="input"
                    v-model:value="formState.maxStockNum"
                    :min="0" /></a-form-item
              ></Col>
              <Col :span="8">
                <a-form-item label="安全库存：" ref="safeStockNum" name="safeStockNum" class="item">
                  <InputNumber
                    class="input"
                    v-model:value="formState.safeStockNum"
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
                  <InputNumber class="input" v-model:value="formState.storagePeriod" :min="0" />
                </a-form-item>
              </Col>
            </Row>
          </a-form>
        </TabPane>
        <TabPane key="3" tab="其他信息">
          <a-form :model="formState" :rules="formRules">
            <Row>
              <Col :span="8">
                <a-form-item label="创建时间：" ref="createTime" name="createTime" class="item">
                  <Input class="input" v-model:value="formState.createTime" disabled="true" />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="创建人：" ref="createBy" name="createBy" class="item">
                  <Input class="input" v-model:value="formState.createBy" disabled="true" />
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="修改时间：" ref="updateTime" name="updateTime" class="item">
                  <Input
                    class="input"
                    v-model:value="formState.updateTime"
                    disabled="true"
                  /> </a-form-item
              ></Col>
              <Col :span="8">
                <a-form-item label="修改人：" ref="updateBy" name="updateBy" class="item">
                  <Input
                    class="input"
                    v-model:value="formState.updateBy"
                    disabled="true"
                  /> </a-form-item
              ></Col>
            </Row>
          </a-form>
        </TabPane>
      </Tabs>
    </a-card>
    <a-modal
      v-model:visible="visibleGroupModal"
      title="物料分组"
      ref="node"
      @ok="groupModalOK"
      @cancel="groupModalCancel"
    >
      <a-tree-select
        show-search
        v-model="formState.node"
        style="width: 100%"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        placeholder="请选择物料分组"
        treeNodeFilterProp="title"
        allow-clear
        tree-default-expand-all
        :treeData="treeData"
        @change="groupSelect"
      />
    </a-modal>
    <BasicSearch
      style="top: 20px"
      @cellClickEvent="cellClickEvent"
      @searchUnitList="searchUnitList"
      title="基础信息查询"
      ref="basicSearchRef"
      :gridOptions="nuitGridOptions"
      :isUnit="isUnit"
    />
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, UnwrapRef } from 'vue';
  import {
    Button,
    Card,
    Col,
    Form,
    FormItem,
    Input,
    InputNumber,
    InputSearch,
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
  import { RollbackOutlined } from '@ant-design/icons-vue';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import BasicSearch from '/@/components/Amoresearch/src/Basicsearch.vue';
  import { nuitGridOptions, stockColumns, unitColumns } from '/@/components/Amoresearch/data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useRoute, useRouter } from 'vue-router';
  import { TreeItem } from '/@/components/Tree';
  import { MatGroupEntity, treeMatGroup } from '/@/api/matgroup';
  import {
    addMatTable,
    auditMatTable,
    getMatTableById,
    getMatTableUnit,
    getMatTableUnitList,
    getPublicList,
    updateMatTable,
  } from '/@/api/mattable';
  import { cloneDeep } from 'lodash-es';

  const AModal = Modal;
  const AForm = Form;
  const AFormItem = FormItem;
  const ATreeSelect = TreeSelect;
  const ACard = Card;

  const router = useRouter();
  const activeKey = ref<string>('1');
  const visibleGroupModal: any = ref<boolean>(false);
  const onGroupSearch = () => {
    visibleGroupModal.value = true;
  };
  //基础信息
  const basicSearchRef: any = ref<any>(null); //基础信息查询组件ref
  //更新表头数据
  const getCurrentCols = (key: any) => {
    const colConfig = {
      baseUnit: unitColumns,
      weightUnit: unitColumns,
      stock: stockColumns,
      sub: stockColumns,
      location: stockColumns,
    };
    return colConfig[key];
  };
  //待用URL
  let urlConfig = {
    baseUnit: '/stock/bd-unit/list',
    weightUnit: '/stock/bd-unit/list',
    stock: '/stock/bd-stock/list',
    sub: '/stock/bd-sub-stock/list',
    location: '/stock/bd-stock-location/list',
    plan: '',
  };
  //所选框
  let chosenModal: String = '';
  //点击放大镜事件
  const onStock: any = async (key) => {
    const res: any = await getPublicList(
      {
        params: [
          {
            table: '',
            name: 'name',
            column: 'name',
            link: 'AND',
            rule: 'LIKE',
            type: 'string',
            val: '',
            startWith: '',
            endWith: '',
          },
        ],
      },
      urlConfig[key],
    );
    chosenModal = key;
    let dataCols = getCurrentCols(key);
    let dataList = res;
    basicSearchRef.value.bSearch(true);
    basicSearchRef.value.initCols(dataCols);
    basicSearchRef.value.initList(dataList);
    basicSearchRef.value.initSearch(key);
    console.log('获取基本单位表格数据0', dataList);
    return res;
  };
  //双击单元格事件
  let unitId = '';
  let weightId = '';
  let stockId = '';
  let subStockId = '';
  let locationId = '';
  const hasSub = ref(false);
  const hasLocation = ref(false);
  const cellClickEvent = (row) => {
    console.log('所选', chosenModal);
    switch (chosenModal) {
      case 'baseUnit':
        formState.baseUnitId = row.name;
        unitId = row.id;
        break;
      case 'weightUnit':
        formState.weightUnitId = row.name;
        weightId = row.id;
        break;
      case 'stock':
        formState.stockId = row.name;
        stockId = row.id;
        console.log(stockId);
        getNextStock('stock', 'stockId', stockId);
        break;
      case 'sub':
        formState.subStockId = row.name;
        subStockId = row.id;
        getNextStock('sub', 'subStockId', subStockId);
        break;
      case 'location':
        formState.bdStockLocationId = row.name;
        locationId = row.id;
        getNextStock('location', 'bdStockLocationId', locationId);
        break;
    }
    basicSearchRef.value.bSearch(false);
  };
  //选择仓库后查询
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
      urlConfig[key],
    );
    if (res.records) {
      hasSub.value = true;
      hasLocation.value = true;
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
      console.log('key', item.key);
    });
  };
  let groupValue = null;
  //物料分组弹框关
  const groupSelect = (value, node) => {
    formState.node = node;
    groupValue = value;
    console.log('物料分组弹框node', value, node);
    formState.groupId = formState.node;
    visibleGroupModal.value = false;
  };
  let getParams = () => {
    let query = router.currentRoute.value.query;
    console.log('currentRoute.value', router.currentRoute.value);
    console.log('query', query);
  };
  getParams();
  //接受参数
  let rowId = useRoute().query.row;
  console.log('编辑id', rowId);
  const getListById = async () => {
    const res: any = await getMatTableById({
      params: rowId,
    });
    if (res.weightUnitId == 0) {
      res.weightUnitId = null;
    }
    if (res.storagePeriod == 0) {
      res.storagePeriod = null;
    }
    if (res.minStockNum == 0) {
      res.minStockNum = null;
    }
    if (res.maxStockNum == 0) {
      res.maxStockNum = null;
    }
    if (res.safeStockNum == 0) {
      res.safeStockNum = null;
    }
    formState.number = res.number;
    formState.name = res.name;
    formState.shortName = res.shortName;
    formState.baseUnitId = res.baseUnit.name;
    formState.baseUnitName = res.baseUnit.name;
    formState.groupId = res.bdMaterialGroup.name;
    formState.groupName = res.bdMaterialGroup.name;
    formState.attr = res.attr;
    formState.weightUnitId = res.weightUnitId;
    if (formState.weightUnitId) {
      formState.weightUnitId = res.weightUnit.name;
    }
    formState.weightName = res.weightUnit.name;
    formState.netWeight = res.netWeight;
    formState.model = res.model;
    formState.bsStatus = res.bsStatus;
    if (formState.bsStatus === 'A') {
      formState.bsStatus = '创建';
    } else {
      formState.bsStatus = '已审核';
    }
    formState.oldMatNumber = res.oldMatNumber;
    formState.mark = res.mark;
    formState.stockId = res.bdStock;
    if (formState.stockId) {
      formState.stockId = res.bdStock.name;
    }
    formState.bdStock = res.bdStock;
    formState.subStockId = res.subStockId;
    if (formState.subStockId) {
      formState.subStockId = res.bdSubStock.name;
    }
    formState.bdSubStock = res.bdSubStock;
    formState.bdStockLocationId = res.bdStockLocationId;
    if (formState.bdStockLocationId) {
      formState.bdStockLocationId = res.bdStockLocation.name;
    }
    formState.bdStockLocationName = res.bdStockLocation;
    formState.enableSn = res.enableSn;
    formState.enableBatch = res.enableBatch;
    formState.storagePeriod = res.storagePeriod;
    formState.minStockNum = res.minStockNum;
    formState.maxStockNum = res.minStockNum;
    formState.safeStockNum = res.safeStockNum;
    formState.stockInExamine = res.stockInExamine;
    formState.stockOutExamine = res.stockOutExamine;
    formState.produceExamine = res.produceExamine;
    formState.createTime = res.createTime;
    formState.createBy = res.createBy;
    formState.updateTime = res.updateTime;
    formState.updateBy = res.updateBy;
  };
  if (rowId) {
    getListById();
  }
  interface FormState {
    number: string;
    name: string;
    shortName: string;
    baseUnitName: string;
    baseUnitId: string;
    groupId: string;
    groupName: string;
    attr: string;
    weightUnitId: number | null;
    weightName: string;
    netWeight: number | null;
    model: string | null;
    bsStatus: string | null;
    oldMatNumber: number | null;
    mark: string | null;
    node: string | null;
    stockId: string | null;
    bdStock: string | null;
    subStockId: string | null;
    bdSubStock: string | null;
    bdStockLocationId: string | null;
    bdStockLocationName: string | null;
    enableSn: number | null;
    enableBatch: number | null;
    storagePeriod: number | null;
    minStockNum: number | null;
    maxStockNum: number | null;
    safeStockNum: number | null;
    stockInExamine: number | null;
    stockOutExamine: number | null;
    produceExamine: number | null;
    createTime: string | null;
    createBy: string | null;
    updateTime: string | null;
    updateBy: string | null;
  }
  const formState: UnwrapRef<FormState> = reactive({
    number: '',
    name: '',
    shortName: '',
    baseUnitName: '',
    baseUnitId: unitId,
    groupId: '',
    groupName: '',
    attr: 'A',
    weightUnitId: null,
    weightName: '',
    netWeight: null,
    model: '',
    bsStatus: '创建',
    oldMatNumber: null,
    mark: '',
    node: '',
    bdStock: '',
    bdSubStock: '',
    stockId: stockId,
    subStockId: null,
    bdStockLocationId: null,
    bdStockLocationName: null,
    enableSn: null,
    enableBatch: null,
    storagePeriod: null,
    minStockNum: null,
    maxStockNum: null,
    safeStockNum: null,
    stockInExamine: null,
    stockOutExamine: null,
    produceExamine: null,
    updateBy: '',
    updateTime: '',
    createBy: '',
    createTime: '',
  });
  const formRules = reactive({
    name: [{ required: true, message: '请输入物料名称', trigger: 'blur' }],
    number: [{ required: true, message: '请输入物料编码', trigger: 'blur' }],
    groupId: [{ required: true, message: '请输入物料分组', trigger: 'blur', type: 'array' }],
    baseUnitId: [{ required: true, message: '请输入基本单位', trigger: 'blur' }],
    attr: [{ required: true, message: '请输入物料属性', trigger: 'blur' }],
  });
  const handleFinish = (values: FormState) => {
    console.log(values, formState);
  };
  const handleFinishFailed = (errors: ValidateErrorEntity<FormState>) => {
    console.log(errors);
  };
  //获取基本单位字段
  const getTableUnit = async () => {
    try {
      let data = await getMatTableUnit({});
      basicSearchRef.value.init(data);
      console.log('详情页基本单位字段', data);
    } catch (e) {
      console.log('详情页获取基本单位字段失败', e);
    }
  };
  getTableUnit();
  //获取基本单位表格
  // const getTableUnitList = async () => {
  //   try {
  //     const res = await getMatTableUnitList({
  //       params: [
  //         {
  //           table: '',
  //           name: 'name',
  //           column: 'name',
  //           link: 'AND',
  //           rule: 'LIKE',
  //           type: 'string',
  //           val: '',
  //           startWith: '',
  //           endWith: '',
  //         },
  //       ],
  //     });
  //     let dataList = res;
  //     basicSearchRef.value.initList(dataList);
  //     console.log('获取基本单位表格数据0', dataList);
  //   } catch (e) {
  //     console.log('获取基本单位表格失败', e);
  //   }
  // };
  //基本单位搜索功能
  const searchUnitList = async (keywords) => {
    const res = await getMatTableUnitList({
      // params: JSON.parse(keywords),
      params: [keywords],
    });
    let data = res;
    basicSearchRef.value.initList(data);
  };
  // getTableUnitList();
  getTableUnit();
  //保存事件
  const onSubmit = async () => {
    if (!rowId) {
      const newData = {
        number: formState.number,
        name: formState.name,
        shortName: formState.shortName,
        baseUnitId: unitId,
        groupId: groupValue,
        attr: formState.attr,
        weightUnitId: weightId,
        netWeight: formState.netWeight,
        model: formState.model,
        bsStatus: formState.bsStatus,
        oldMatNumber: formState.oldMatNumber,
        mark: formState.mark,
        stockId: stockId,
        subStockId: subStockId,
        bdStockLocationId: locationId,
        enableSn: formState.enableSn,
        enableBatch: formState.enableBatch,
        storagePeriod: formState.storagePeriod,
        minStockNum: formState.minStockNum,
        maxStockNum: formState.maxStockNum,
        safeStockNum: formState.safeStockNum,
        stockInExamine: formState.stockInExamine,
        stockOutExamine: formState.stockOutExamine,
        produceExamine: formState.produceExamine,
        createTime: formState.createTime,
        createBy: formState.createBy,
        updateTime: formState.updateTime,
        updateBy: formState.updateBy,
      };
      if (
        !formState.name ||
        !formState.number ||
        !formState.baseUnitId ||
        !formState.groupId ||
        !formState.attr
      ) {
        useMessage().createMessage.error('必填字段不能为空');
      } else {
        try {
          const addList = await addMatTable({
            params: newData,
          });
          if (addList.id != null) {
            useMessage().createMessage.success('添加成功');
            back();
          }
        } catch (e) {
          console.log('失败', e);
        }
      }
    } else {
      const newData = {
        id: rowId,
        number: formState.number,
        name: formState.name,
        shortName: formState.shortName,
        baseUnitId: unitId,
        groupId: groupValue,
        attr: formState.attr,
        weightUnitId: weightId,
        netWeight: formState.netWeight,
        model: formState.model,
        oldMatNumber: formState.oldMatNumber,
        mark: formState.mark,
        stockId: stockId,
        subStockId: subStockId,
        bdStockLocationId: locationId,
        enableSn: formState.enableSn,
        enableBatch: formState.enableBatch,
        storagePeriod: formState.storagePeriod,
        minStockNum: formState.minStockNum,
        maxStockNum: formState.maxStockNum,
        safeStockNum: formState.safeStockNum,
        stockInExamine: formState.stockInExamine,
        stockOutExamine: formState.stockOutExamine,
        produceExamine: formState.produceExamine,
        createTime: formState.createTime,
        createBy: formState.createBy,
        updateTime: formState.updateTime,
        updateBy: formState.updateBy,
      };
      if (
        !formState.name ||
        !formState.number ||
        !formState.baseUnitId ||
        !formState.groupId ||
        !formState.attr
      ) {
        useMessage().createMessage.error('必填字段不能为空');
      } else {
        try {
          const updateList = async () => {
            await updateMatTable({
              params: newData,
            });
          };
          updateList();
          useMessage().createMessage.success('修改成功');
          back();
        } catch (e) {
          console.log('失败', e);
        }
      }
    }
  };
  const onExam = () => {
    if (formState.bsStatus === 'A' || formState.bsStatus === '创建') {
      try {
        const aduitEvent = async () => {
          await auditMatTable({
            params: {
              id: rowId,
            },
          });
        };
        aduitEvent();
        useMessage().createMessage.success('审核成功');
        back();
      } catch (e) {
        console.log('失败', e);
      }
    } else {
      useMessage().createMessage.error('该物料已审核，无需再次审核');
      back();
    }
  };
  const back = () => {
    router.push({ path: '../material/index' });
  };
</script>
<style scoped>
  .item {
    flex-flow: nowrap;
  }
  .input {
    width: 20rem;
    height: 2rem;
    margin: 0 60px 0 10px;
  }
  .textArea {
    width: 20rem;
    height: 2rem;
    margin: 0 60px 0 10px;
  }
  .select {
    width: 20rem;
    margin: 0 60px 0 10px;
  }
  .content {
    border: 1px solid #e5e7eb;
    margin: 10px;
    height: 80vh;
  }
  .span {
    width: 56px;
    text-align: justify;
  }
  .span span {
    display: inline-block;
    width: 100%;
  }
  .button {
    margin: 15px;
  }
</style>
