<template>
  <div>
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
    <a-card class="content">
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
                    placeholder="请输入物料编码"
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
                    placeholder="请输入物料名称"
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
                    placeholder="请输入简称"
                    :disabled="formState.bsStatus === 'B'"
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
                    :show="formState.bsStatus !== 'B'"
                    autocomplete="off"
                    class="input"
                    placeholder="请选择基本单位"
                    v-model:value="formState.baseUnitName"
                    :disabled="formState.bsStatus === 'B'"
                    @search="onStock('baseUnit')"
                    @clear="onClear(['baseUnitId', 'baseUnitName'])"
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
                    :show="formState.bsStatus !== 'B'"
                    v-model:value="formState.groupName"
                    :disabled="formState.bsStatus === 'B'"
                    @search="onGroupSearch(formState.groupName)"
                    @clear="onClear(['groupId', 'groupName'])"
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
                    :show="formState.bsStatus !== 'B'"
                    v-model:value="formState.weightName"
                    :disabled="formState.bsStatus === 'B'"
                    @search="onStock('weightUnit')"
                    @clear="onClear(['weightUnitId', 'weightName'])"
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
                    :disabled="formState.bsStatus === 'B'"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="规格型号：" ref="model" name="model" class="item">
                  <Input
                    class="input"
                    v-model:value="formState.model"
                    placeholder="请输入规格型号"
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
                    placeholder="请输入旧物料编码"
                    :disabled="formState.bsStatus === 'B'"
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
                    :show="formState.bsStatus !== 'B'"
                    v-model:value="formState.stockName"
                    :disabled="formState.bsStatus === 'B'"
                    @search="onStock('stock')"
                    @clear="
                      onClear([
                        'stockId',
                        'stockName',
                        'subStockId',
                        'subStockName',
                        'bdStockLocationId',
                        'bdStockLocationName',
                      ])
                    "
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
                    :show="formState.bsStatus !== 'B'"
                    v-model:value="formState.subStockName"
                    :disabled="formState.bsStatus === 'B'"
                    @search="onStock('sub')"
                    @clear="
                      onClear([
                        'subStockId',
                        'subStockName',
                        'bdStockLocationId',
                        'bdStockLocationName',
                      ])
                    "
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
                    :show="formState.bsStatus !== 'B'"
                    v-model:value="formState.bdStockLocationName"
                    :disabled="formState.bsStatus === 'B'"
                    @search="onStock('location')"
                    @clear="onClear(['bdStockLocationId', 'bdStockLocationName'])"
                  />
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="备注：" ref="mark" name="mark" class="item">
                  <a-textArea
                    v-model:value="formState.mark"
                    placeholder="请添加描述"
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
                      :show="formState.bsStatus !== 'B'"
                      v-model:value="formState.bdExamineName"
                      :disabled="formState.bsStatus === 'B'"
                      @search="onStock('plan')"
                      @clear="onClear(['examineId', 'bdExamineName'])"
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
                      :disabled="formState.bsStatus === 'B'"
                      :min="0" /></a-form-item
                ></Col>
                <Col :span="8">
                  <a-form-item label="最大库存：" ref="maxSize" name="maxSize" class="item">
                    <InputNumber
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
  import { onMounted, reactive, ref, toRef } from 'vue';
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
    Switch,
    TabPane,
    Tabs,
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
  import { MatGroupEntity, queryOneMatGroup, treeMatGroup } from '/@/api/matGroup';
  import { config } from '/@/utils/publicParamConfig';
  import {
    addMatTable,
    auditMatTable,
    getMatTableById,
    MatProfileEntity,
    unAuditMatTable,
    updateMatTable,
  } from '/@/api/matTable';
  import { getStockOption } from '/@/api/mainStock';
  import { getSubOption } from '/@/api/subStock';
  import { getLocationOption } from '/@/api/stockLocation';
  import { getUnitOption } from '/@/api/unit';
  import { getPublicList } from '/@/api/public';
  import { cloneDeep } from 'lodash-es';
  import { VXETable } from 'vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  const { createMessage } = useMessage();
  const AModal = Modal;
  const AForm = Form;
  const AFormItem = FormItem;
  const ATreeSelect = TreeSelect;
  const ACard = Card;
  const ATextArea = Input.TextArea;

  const router = useRouter();
  //空参数
  const paramsNull = { params: '' };
  //整个基本信息 v-model:activeKey="activeKey"
  const activeKey = ref<string>('1');
  //物料分组弹框visible
  const visibleGroupModal: any = ref<boolean>(false);
  //弹窗类型
  let modalType = ref<string>('');
  //表单ref
  const formRef = ref();
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

  //对应输入框绑定的值接口类型
  const formData: MatProfileEntity = { id: undefined, number: '', name: '', attr: 'A' };
  //初始化
  const formStateInit = reactive({
    data: formData,
  });
  const formState = toRef(formStateInit, 'data');
  let groupSelectId = router.currentRoute.value.query.groupId?.toString();
  //物料分组重新赋值
  const groupEvent = async () => {
    const result = await queryOneMatGroup({ params: groupSelectId || '0' });
    if (result) {
      formState.value.groupId = result.id;
      formState.value.groupName = result.name;
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
  const onGroupSearch = (name) => {
    visibleGroupModal.value = true;
    formState.value.node = name;
    if (formState.value.node == '') {
      formState.value.node = undefined;
    }
  };
  //点击清空图标清空事件
  const onClear = (key: string[]) => {
    key.forEach((e) => {
      formState.value[e] = '';
    });
  };
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
        let data = await getUnitOption(paramsNull);
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

  //选择仓库后查询——联动-----key:在待用url中选择的----colName:需要查询的名字，如编码，名称。。。---id:输入的值
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
        formState.value.baseUnitId = row.id;
        formState.value.baseUnitName = row.name;
        break;
      case 'weightUnit':
        formState.value.weightName = row.name;
        formState.value.bdStockLocationName = '';
        formState.value.weightUnitId = row.id;
        break;
      case 'stock':
        formState.value.stockId = row.id;
        formState.value.stockName = row.name;
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
        await getNextStock('stock', 'formState.stockId', formState.value.stockId);
        break;
      case 'sub':
        formState.value.subStockId = row.id;
        formState.value.subStockName = row.name;
        //存疑--待测试
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
        formState.value.stockId = stockByStock.records[0].id;
        formState.value.stockName = stockByStock.records[0].name;
        break;
      case 'location':
        formState.value.bdStockLocationId = row.id;
        formState.value.bdStockLocationName = row.name;
        const subStockByStockLocation = await getNextStock('sub', 'id', row.subStockId);
        const stockByStockLocation = await getNextStock('stock', 'id', row.stockId);
        formState.value.subStockId = subStockByStockLocation.records[0].id;
        formState.value.subStockName = subStockByStockLocation.records[0].name;
        formState.value.stockId = stockByStockLocation.records[0].id;
        formState.value.stockName = stockByStockLocation.records[0].name;
        break;
      case 'plan':
        formState.value.examineId = row.id;
        formState.value.bdExamineName = row.name;
        break;
    }
    basicSearchRef.value.bSearch(false);
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
    formState.value.node = node;
    formState.value.groupName = formState.value.node;
    formState.value.groupId = value;
    visibleGroupModal.value = false;
  };

  //接受参数
  let rowId = useRoute().query.row?.toString() || '';

  const getListById = async (rowId) => {
    if (rowId) {
      const res: any = await getMatTableById({ params: rowId });
      formState.value = res;
      if (res.baseUnit) {
        formState.value.baseUnitId = res.baseUnit.id;
        formState.value.baseUnitName = res.baseUnit.name;
      }
      if (res.bdStockLocation) {
        formState.value.bdStockLocationId = res.bdStockLocation.id;
        formState.value.bdStockLocationName = res.bdStockLocation.name;
      }
      if (res.bdExamine) {
        formState.value.bdExamineName = res.bdExamine.name;
        formState.value.examineId = res.bdExamine.id;
      }
      if (res.weightUnit) {
        formState.value.weightUnitId = res.weightUnit.id;
        formState.value.weightName = res.weightUnit.name;
      }
      if (res.bdMaterialGroup) {
        formState.value.groupId = res.bdMaterialGroup.id;
        formState.value.groupName = res.bdMaterialGroup.name;
      }
      if (formState.value.stockId) {
        formState.value.stockId = res.bdStock.id;
        formState.value.stockName = res.bdStock.name;
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
      if (formState.value.subStockId) {
        formState.value.subStockId = res.bdSubStock.id;
        formState.value.subStockName = res.bdSubStock.name;
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
    }
  };
  getListById(rowId);

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
    let data;
    formRef.value
      .validate()
      .then(async () => {
        if (!formState.value.id) {
          data = await addMatTable({ params: formState.value });
        } else {
          data = await updateMatTable({ params: formState.value });
        }
        await getListById(data.id);
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
  onMounted(() => {});
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
