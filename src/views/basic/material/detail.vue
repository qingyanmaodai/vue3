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
        <Button danger class="button" @click="onExam" v-if="formState.bsStatus === 'A'"
          >审核</Button
        >
        <Button danger class="button" @click="unExam" v-if="formState.bsStatus === 'B'"
          >反审核</Button
        >
      </div>
    </LayoutHeader>
    <div class="content">
      <Tabs v-model:activeKey="activeKey" class="tabs">
        <TabPane key="1" tab="基本信息">
          <a-form ref="formRef" :model="formState" :rules="formRules">
            <Row>
              <Col :span="8">
                <a-form-item label="物料编码：" ref="number" name="number" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.number"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请输入物料编码'"
                    :disabled="formState.bsStatus === 'B'"
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
                    :placeholder="formState.bsStatus === 'B' ? '' : '请输入物料名称'"
                    :disabled="formState.bsStatus === 'B'"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="简称：" ref="shortName" name="shortName" class="item">
                  <Input
                    allowClear
                    class="input"
                    v-model:value="formState.shortName"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请输入简称'"
                    :disabled="formState.bsStatus === 'B'"
                  />
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="基本单位:" ref="baseUnitId" name="baseUnitId" class="item">
                  <ExInput
                    :show="formState.bsStatus !== 'B'"
                    autocomplete="off"
                    class="input"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请选择基本单位'"
                    v-model:value="formState.baseUnit"
                    :disabled="formState.bsStatus === 'B'"
                    @search="
                      onSearch('GET_UNIT_DTO', 'bdUnit', Url.GET_PAGE_UNIT_LIST, [
                        'baseUnitId',
                        'baseUnit',
                      ])
                    "
                    @clear="onClear(['baseUnitId', 'baseUnit'])"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="物料分组：" ref="groupId" name="groupId" class="item">
                  <ExInput
                    autocomplete="off"
                    class="input"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请选择物料分组'"
                    label="物料分组"
                    :show="formState.bsStatus !== 'B'"
                    v-model:value="formState.bdMaterialGroup"
                    :disabled="formState.bsStatus === 'B'"
                    @search="onGroupSearch"
                    @clear="onClear(['groupId', 'bdMaterialGroup'])"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="物料属性：" ref="attr" name="attr" class="item">
                  <Select
                    v-model:value="formState.attr"
                    class="select"
                    :options="config.MATERIAL_ATTR"
                    :disabled="formState.bsStatus === 'B'"
                  />
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="重量单位：" ref="weightUnitId" name="weightUnitId" class="item">
                  <ExInput
                    class="input"
                    autocomplete="off"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请选择重量单位'"
                    label="重量单位"
                    :show="formState.bsStatus !== 'B'"
                    v-model:value="formState.weightUnit"
                    :disabled="formState.bsStatus === 'B'"
                    @search="
                      onSearch('GET_UNIT_DTO', 'bdUnit', Url.GET_PAGE_UNIT_LIST, [
                        'weightUnitId',
                        'weightUnit',
                      ])
                    "
                    @clear="onClear(['weightUnitId', 'weightUnit'])"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="净重：" ref="netWeight" name="netWeight" class="item">
                  <InputNumber
                    :placeholder="formState.bsStatus === 'B' ? '' : '请输入净重'"
                    class="input"
                    :min="0"
                    :step="0.1"
                    :disabled="formState.bsStatus === 'B'"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="规格型号：" ref="model" name="model" class="item">
                  <Input
                    class="input"
                    v-model:value="formState.model"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请输入规格型号'"
                    :disabled="formState.bsStatus === 'B'"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="业务状态：" ref="bsStatus" name="bsStatus" class="item">
                  <Input
                    allowClear
                    class="input"
                    :value="config.BS_STATUS[formState.bsStatus] || '暂存'"
                    name="bsStatus"
                    :disabled="true"
                  />
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
                    :placeholder="formState.bsStatus === 'B' ? '' : '请输入旧物料编码'"
                    :disabled="formState.bsStatus === 'B'"
                  />
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="仓库：" ref="stockId" name="stockId" class="item">
                  <ExInput
                    autocomplete="off"
                    class="input"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请选择仓库'"
                    label="仓库"
                    :show="formState.bsStatus !== 'B'"
                    v-model:value="formState.bdStock"
                    :disabled="formState.bsStatus === 'B'"
                    @search="
                      onSearch('GET_STOCK_DTO', 'BdStock', Url.GET_PAGE_STOCK_LIST, [
                        'stockId',
                        'bdStock',
                      ])
                    "
                    @clear="
                      onClear([
                        'stockId',
                        'bdStock',
                        'compartmentId',
                        'bdStockCompartment',
                        'locationId',
                        'bdStockLocation',
                      ])
                    "
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="分仓" ref="compartmentId" name="compartmentId" class="item">
                  <ExInput
                    autocomplete="off"
                    class="input"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请选择分仓'"
                    label="分仓"
                    :show="
                      !(
                        formState.bsStatus === 'B' ||
                        stockDis === 'A' ||
                        !formState.stockId ||
                        formState.stockId === undefined
                      )
                    "
                    v-model:value="formState.bdStockCompartment"
                    :disabled="
                      formState.bsStatus === 'B' ||
                      stockDis === 'A' ||
                      !formState.stockId ||
                      formState.stockId === undefined
                    "
                    @search="
                      onSearch(
                        'GET_SUB_STOCK_DTO',
                        'BdStockCompartment',
                        Url.GET_PAGE_STOCK_COMPARTMENT_LIST,
                        ['compartmentId', 'bdStockCompartment'],
                      )
                    "
                    @clear="
                      onClear([
                        'compartmentId',
                        'bdStockCompartment',
                        'locationId',
                        'bdStockLocation',
                      ])
                    "
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="仓位：" ref="locationId" name="locationId" class="item">
                  <ExInput
                    autocomplete="off"
                    class="input"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请选择仓位'"
                    label="仓位"
                    :show="
                      !(
                        formState.bsStatus === 'B' ||
                        !formState.compartmentId ||
                        formState.compartmentId === undefined ||
                        stockDis === 'B'
                      )
                    "
                    v-model:value="formState.bdStockLocation"
                    :disabled="
                      formState.bsStatus === 'B' ||
                      !formState.compartmentId ||
                      formState.compartmentId === undefined ||
                      stockDis === 'B'
                    "
                    @search="
                      onSearch(
                        'GET_LOCATION_DTO',
                        'BdStockLocation',
                        Url.GET_PAGE_STOCK_LOCATION_LIST,
                        ['locationId', 'bdStockLocation'],
                      )
                    "
                    @clear="onClear(['locationId', 'bdStockLocation'])"
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
        <TabPane key="2" tab="质量信息">
          <a-form ref="formRef" :model="formState" :rules="formRules">
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
                        :disabled="formState.bsStatus === 'B'"
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
                        :disabled="formState.bsStatus === 'B'"
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
                        :disabled="formState.bsStatus === 'B'"
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
                        :disabled="formState.bsStatus === 'B'"
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
                        :disabled="formState.bsStatus === 'B'"
                      />
                    </div>
                  </a-form-item>
                </Col>
                <Col :span="8">
                  <a-form-item
                    label="检验方案"
                    ref="bdExamineId"
                    name="bdExamineId"
                    class="item"
                    @clear="onClear"
                  >
                    <ExInput
                      autocomplete="off"
                      class="input"
                      :placeholder="formState.bsStatus === 'B' ? '' : '请选择检验方案'"
                      label="检验方案"
                      :show="formState.bsStatus !== 'B'"
                      v-model:value="formState.bdExamine"
                      :disabled="formState.bsStatus === 'B'"
                      @search="
                        onSearch('GET_EXA_SCHEME_DTO', 'BdExamine', Url.GET_EXA_SCHEME_LIST, [
                          'examineId',
                          'bdExamine',
                        ])
                      "
                      @clear="onClear(['examineId', 'bdExamine'])"
                    />
                  </a-form-item>
                </Col>
              </Row>
              <Row>
                <Col :span="8">
                  <a-form-item label="最小库存：" ref="minSize" name="minSize" class="item">
                    <InputNumber
                      :placeholder="formState.bsStatus === 'B' ? '' : '请输入最小库存'"
                      class="input"
                      v-model:value="formState.minStockNum"
                      :disabled="formState.bsStatus === 'B'"
                      :min="0" /></a-form-item
                ></Col>
                <Col :span="8">
                  <a-form-item label="最大库存：" ref="maxSize" name="maxSize" class="item">
                    <InputNumber
                      :placeholder="formState.bsStatus === 'B' ? '' : '请输入最大库存'"
                      class="input"
                      v-model:value="formState.maxStockNum"
                      :disabled="formState.bsStatus === 'B'"
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
                      :placeholder="formState.bsStatus === 'B' ? '' : '请输入安全库存'"
                      class="input"
                      v-model:value="formState.safeStockNum"
                      :disabled="formState.bsStatus === 'B'"
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
                      :placeholder="formState.bsStatus === 'B' ? '' : '请输入存储期'"
                      class="input"
                      v-model:value="formState.storagePeriod"
                      :min="0"
                      :disabled="formState.bsStatus === 'B'"
                    />
                  </a-form-item>
                </Col>
              </Row>
            </div>
          </a-form>
        </TabPane>
        <TabPane key="3" tab="其他信息">
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
                  <Input class="input" v-model:value="formState.updateBy" disabled /> </a-form-item
              ></Col>
            </Row>
          </a-form>
        </TabPane>
      </Tabs>
    </div>
    <!--  点击物料分组弹框  -->
    <a-modal v-model:visible="visibleGroupModal" title="物料分组" ref="node">
      <a-tree-select
        loading
        show-search
        v-model:value="formState.groupId"
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
  import { onMounted, reactive, ref, toRef } from 'vue';
  import {
    Button,
    Col,
    Form,
    FormItem,
    Input,
    InputNumber,
    LayoutHeader,
    Modal,
    Row,
    Select,
    Switch,
    TabPane,
    Tabs,
    TreeSelect,
  } from 'ant-design-vue';
  import { ExInput } from '/@/components/ExInput';
  import { RollbackOutlined } from '@ant-design/icons-vue';
  import { BasicSearch } from '/@/components/AMoreSearch';
  import { basicGridOptions } from '/@/components/AMoreSearch/data';
  import { useRoute, useRouter } from 'vue-router';
  import { TreeItem } from '/@/components/Tree';
  import { MatGroupEntity, queryOneMatGroup, treeMatGroup } from '/@/api/matGroup';
  import { config } from '/@/utils/publicParamConfig';
  import {
    addMatTable,
    auditMatTable,
    getMatTableById,
    MatEntity,
    unAuditMatTable,
    updateMatTable,
  } from '/@/api/matTable';
  import { getPublicList } from '/@/api/public';
  import { cloneDeep } from 'lodash-es';
  import { VXETable } from 'vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import {
    ControlSet,
    SearchDataType,
    SearchLink,
    SearchMatchType,
    SearchParams,
    TableColum,
    Url,
  } from '/@/api/apiLink';
  import { VxeGridPropTypes } from 'vxe-table/types/all';
  import { getStockDis } from '/@/api/system';
  const { createMessage } = useMessage();
  const AModal = Modal;
  const AForm = Form;
  const AFormItem = FormItem;
  const ATreeSelect = TreeSelect;
  const ATextArea = Input.TextArea;

  const router = useRouter();
  const activeKey = ref<string>('1');
  //物料分组弹框visible
  const visibleGroupModal: any = ref<boolean>(false);
  //表单ref
  const formRef = ref();
  //基础信息查询组件ref
  const basicSearchRef: any = ref<any>(undefined);
  const basicControl = ref<ControlSet[]>(); //下拉框
  const basicTableCols = ref<VxeGridPropTypes.Columns[]>([]); //表头
  let basicTableName = ref<string>(''); //需要查询的表名

  const formData: MatEntity = { id: undefined, number: '', name: '', attr: 'A' };
  //初始化
  const formStateInit = reactive({
    data: formData,
  });
  const formState = toRef(formStateInit, 'data');
  let stockDis = ref<string>(''); //仓库维度
  //获取仓库维度
  const getStockDisData = async () => {
    const arr: any = await getStockDis({});
    stockDis.value = arr;
  };
  getStockDisData();
  let groupSelectId = router.currentRoute.value.query.groupId?.toString();
  //物料分组重新赋值
  const groupEvent = async () => {
    const result = await queryOneMatGroup({ params: groupSelectId || '0' });
    if (result) {
      formState.value.groupId = result.id;
      formState.value.bdMaterialGroup = result;
    }
  };
  groupEvent();
  const formRules = reactive({
    name: [{ required: true, message: '请输入物料名称' }],
    number: [{ required: true, message: '请输入物料编码' }],
    baseUnitId: [{ required: true, message: '请选择基本单位' }],
    attr: [{ required: true, message: '请选择物料属性' }],
  });

  //物料分组弹框
  const onGroupSearch = () => {
    visibleGroupModal.value = true;
  };
  //点击清空图标清空事件
  const onClear = (key: string[]) => {
    key.forEach((e) => {
      formState.value[e] = undefined;
    });
  };

  let currDataParam: string[] = []; //约定数组下标0为数据ID，1为数据包
  /**
   * 基础资料弹窗
   * @param dtoUrlConfig  获取基础资料查询链接属性
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
    let filterParams: SearchParams[] = [];
    if (tableName === 'BdStockCompartment') {
      if (formState.value.stockId) {
        filterParams = [
          {
            table: 'BdStockCompartment',
            name: 'stockId',
            column: 'stock_id',
            link: SearchLink.AND,
            rule: SearchMatchType.EQ,
            type: SearchDataType.string,
            val: formState.value.stockId,
          },
        ];
      }
    }
    if (tableName === 'BdStockLocation') {
      if (formState.value.compartmentId) {
        filterParams = [
          {
            table: 'BdStockLocation',
            name: 'compartmentId',
            column: 'compartment_id',
            link: SearchLink.AND,
            rule: SearchMatchType.EQ,
            type: SearchDataType.string,
            val: formState.value.compartmentId,
          },
        ];
      }
    }
    basicSearchRef.value.setFilter(filterParams);
    basicSearchRef.value.init(tableUrl);
  };

  //双击单元格选择事件——获取双击所选的值并赋值到对应字段
  const basicClickEvent = async (row) => {
    basicSearchRef.value.close();
    formState.value[currDataParam[0]] = row.id;
    formState.value[currDataParam[1]] = {};
    formState.value[currDataParam[1]].id = row.id;
    formState.value[currDataParam[1]].name = row.name;
    if (basicTableName.value === 'BdStock' && formState.value.compartmentId) {
      formState.value.bdStockCompartment = {};
      formState.value.compartmentId = undefined;
      if (formState.value.locationId) {
        formState.value.bdStockLocation = {};
        formState.value.locationId = undefined;
      }
    }
    if (basicTableName.value === 'BdStockCompartment' && formState.value.locationId) {
      formState.value.bdStockLocation = {};
      formState.value.locationId = undefined;
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
  const groupSelect = (value: string, names: string[]) => {
    formState.value.bdMaterialGroup = { id: value, name: names[0] || '' };
    formState.value.groupId = value;
    visibleGroupModal.value = false;
  };

  //接受参数
  let rowId = useRoute().query.row?.toString() || '';
  const getListById = async () => {
    if (rowId) {
      const res: any = await getMatTableById({ params: rowId });
      formState.value = res;
    }
  };

  //保存事件
  const onSubmit = async () => {
    let data;
    formRef.value
      .validate()
      .then(async () => {
        if (!formState.value.id) {
          data = await addMatTable({ params: formState.value });
        } else {
          data = await updateMatTable({ params: formState.value });
        }
        formState.value = Object.assign({}, formState.value, data);
        createMessage.success('操作成功');
      })
      .catch((error: ValidateErrorEntity<FormData>) => {
        createMessage.error('数据校检不通过，请检查!');
        console.log(error);
      });
  };

  //审核功能
  const onExam = async () => {
    formRef.value
      .validate()
      .then(async () => {
        const type = await VXETable.modal.confirm('您确定要保存并审核吗?');
        if (type === 'confirm') {
          const data = await auditMatTable({ params: formState.value });
          formState.value = Object.assign({}, formState.value, data);
          createMessage.success('操作成功');
        }
      })
      .catch((error: ValidateErrorEntity<FormData>) => {
        createMessage.error('数据校检不通过，请检查!');
        console.log(error);
      });
  };
  //反审核功能
  const unExam = async () => {
    const type = await VXETable.modal.confirm('您确定要反审核吗?');
    if (type === 'confirm') {
      const data = await unAuditMatTable({ params: formState.value });
      formState.value = Object.assign({}, formState.value, data);
      createMessage.success('操作成功');
    }
  };

  //返回上一页
  const back = () => {
    router.go(-1);
  };
  //刚进入页面——加载完后，需要执行的方法
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
  .button {
    margin: 15px;
  }
</style>
