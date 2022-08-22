<template>
  <div>
    <LayoutHeader style="background-color: #fff; height: 60px; padding: 0 20px">
      <a style="font-size: 1.4rem; font-weight: bold; color: #000; line-height: 60px" @click="back"
        ><RollbackOutlined /> 返回</a
      >
      <div style="display: flex; float: right">
        <Button type="primary" class="button" @click="save" v-if="showSave">保存</Button>
        <Button danger class="button" @click="handleAudit(0)" v-show="showAudit && formState.id"
          >审核</Button
        >
        <Button danger class="button" @click="handleAudit(1)" v-show="!showAudit">反审核</Button>
      </div>
    </LayoutHeader>
    <a-card class="content">
      <Tabs v-model:activeKey="activeTabs" class="tabs">
        <TabPane key="basicInfo" tab="基本信息">
          <a-form :model="formState" :rules="formRules" ref="formRef">
            <Row>
              <Col :span="8">
                <a-form-item label="编码：" ref="number" name="number" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.number"
                    placeholder="请输入供应商编码"
                    :disabled="formState.bsStatus === 'B'"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="供应商名称：" ref="name" name="name" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.name"
                    name="name"
                    placeholder="请输入供应商名称"
                    :disabled="isDisable"
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
                    :disabled="isDisable"
                  />
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="联系人：" ref="contact" name="contact" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.contact"
                    placeholder="请输入联系人"
                    :disabled="isDisable"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="联系电话：" ref="phone" name="phone" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.phone"
                    name="name"
                    placeholder="请输入联系电话"
                    :disabled="isDisable"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="责任人：" ref="mainBy" name="mainBy" class="item">
                  <Input
                    allowClear
                    class="input"
                    v-model:value="formState.mainBy"
                    placeholder="请输入责任人"
                    :disabled="isDisable"
                  />
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="国家：" ref="country" name="country" class="item">
                  <a-select
                    class="input"
                    :disabled="isDisable"
                    v-model:value="formState.country"
                    show-search
                    placeholder="请选择"
                    :options="countryData"
                    :filter-option="filterOption"
                    @change="countryHandleChange"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="地区：" ref="districtArr" name="districtArr" class="item">
                  <a-cascader
                    v-if="isShowDistrict"
                    style="width: 16rem; height: 2rem; margin: 0 60px 0 2px"
                    :disabled="isDisable"
                    v-model:value="tempFormState.districtArr"
                    :options="districtData"
                    :load-data="loadDistrictData"
                    change-on-select
                    placeholder="请选择"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="详细地址：" ref="address" name="address" class="item">
                  <Input
                    allowClear
                    class="input"
                    v-model:value="formState.address"
                    placeholder="请输入地址"
                    :disabled="isDisable"
                  />
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="供应商等级：" ref="level" name="level" class="item">
                  <Select v-model:value="formState.level" class="select" placeholder="请选择">
                    <SelectOption
                      v-for="(item, index) in config['SUPPLIER_GRADE']"
                      :key="index"
                      :value="item.value"
                    >
                      {{ item.label }}</SelectOption
                    >
                  </Select>
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item
                  label="供应商分组："
                  v-model:value="formState.groupId"
                  ref="groupName"
                  name="groupName"
                  class="item"
                >
                  <ExInput
                    autocomplete="off"
                    class="input"
                    placeholder="请选择供应商分组"
                    label="供应商分组"
                    v-model:value="tempFormState.groupName"
                    :disabled="isDisable"
                    @search="onGroupSearch"
                    @clear="onClear"
                  />
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
                <a-form-item label="备注：" ref="mark" name="mark" class="item">
                  <TextArea
                    v-model:value="formState.mark"
                    placeholder="请添加描述"
                    :rows="3"
                    class="textArea"
                    :disabled="isDisable"
                  />
                </a-form-item>
              </Col>
            </Row>
          </a-form>
        </TabPane>
        <TabPane key="otherInfo" tab="其他信息">
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
    <!--  供应商分组弹框  -->
    <a-modal v-model:visible="supplierGroupModel" title="供应商分组" ref="node">
      <a-tree-select
        loading
        show-search
        v-model:value="formState.groupId"
        style="width: 100%"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        placeholder="请选择供应商分组"
        treeNodeFilterProp="title"
        tree-default-expand-all
        :treeData="treeData"
        @change="groupSelect"
      />
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref, toRef, UnwrapRef } from 'vue';
  import {
    Button,
    Card,
    Col,
    Form,
    FormItem,
    Input,
    LayoutHeader,
    Modal,
    Row,
    Select,
    SelectOption,
    TabPane,
    Tabs,
    TreeSelect,
    Cascader,
  } from 'ant-design-vue'; //ant组件
  const AModal = Modal;
  const AForm = Form;
  const TextArea = Input.TextArea;
  const AFormItem = FormItem;
  const ATreeSelect = TreeSelect;
  const ACard = Card;
  const ASelect = Select;
  const ACascader = Cascader;
  import { ExInput } from '/@/components/ExInput';
  import { RollbackOutlined } from '@ant-design/icons-vue';
  import { config } from '/@/utils/publicParamConfig'; //公共配置ts
  import { useRoute, useRouter } from 'vue-router'; //路由
  const router = useRouter();
  import { getOneSupplier, saveSupplier, SupplierEntity } from '/@/api/supplier'; //供应商api
  import { getSupplierGroupTree, SupplierGroupEntity } from '/@/api/supplierGroup'; //供应商分组api
  import { TreeItem } from '/@/components/Tree';
  import { VXETable } from 'vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage'; //提示信息组件
  const { createMessage } = useMessage();
  import { auditMatTable } from '/@/api/matTable';
  import { cloneDeep } from 'lodash-es';
  import { CountryEntity, getCountryTree } from '/@/api/public';

  /* data */

  //额外表单数据
  type tempForm = {
    groupName: string;
    districtArr: number[];
  };
  const tempFormState: UnwrapRef<tempForm> = reactive({
    groupName: '', //供应商分组名称
    districtArr: [], //地区数组
  });
  //表单初始数据
  const formData: UnwrapRef<SupplierEntity> = {
    id: undefined,
    number: undefined,
    name: undefined,
    shortName: undefined,
    contact: undefined,
    phone: undefined,
    mainBy: undefined,
    address: undefined,
    country: undefined,
    provincial: undefined,
    municipal: undefined,
    district: undefined,
    level: undefined,
    groupId: undefined,
  };
  const formInitState = reactive({ data: formData });

  const formState = toRef(formInitState, 'data'); //表单对象

  //表单必填规则配置
  const formRules = reactive({
    name: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
    number: [{ required: true, message: '请输入供应商编码', trigger: 'blur' }],
  });
  const formRef: any = ref<String | null>(null); //表单引用对象
  const supplierId = ref<string>(''); //路由参数，供应商Id
  const treeData = ref<TreeItem>([]); //供应商分组数据
  const countryData = ref<CountryEntity[]>([]); //国家数据
  const districtData = ref<CountryEntity[]>([]); //地区数据
  const supplierGroupModel = ref<boolean>(false); //供应商分组弹框显示状态
  const showAudit = ref<boolean>(true); //显示审核/反审核按钮
  const showSave = ref<boolean>(true); //显示保存按钮
  const activeTabs = ref<string>('basicInfo'); //当前激活板块
  const isDisable = ref<boolean>(false); //表单禁用状态
  const isShowDistrict = ref<boolean>(false); //是否显示地区组件

  /* method */

  /**
   * 页面加载
   */
  onMounted(() => {
    supplierId.value = useRoute().query.row?.toString() || '';
    init(); //页面初始化
  });

  const init = async () => {
    await getCountry();
    if (supplierId.value) {
      await getSupplier();
    }
    isShowDistrict.value = true;
  };

  /**
   * 获取供应商详细信息
   */
  const getSupplier = async (supId = supplierId.value) => {
    const res = await getOneSupplier(supId);
    if (res) {
      formState.value = res;
      //回显地区信息
      await echoDistrict();
    }
  };

  /**
   * 保存事件
   */
  const save = async () => {
    formState.value.provincial = tempFormState.districtArr[0]
      ? tempFormState.districtArr[0]
      : undefined; //省
    formState.value.municipal = tempFormState.districtArr[1]
      ? tempFormState.districtArr[1]
      : undefined; //市
    formState.value.district = tempFormState.districtArr[2]
      ? tempFormState.districtArr[2]
      : undefined; //区
    console.log(formState.value);
    try {
      await formRef.value.validateFields();
      //保存操作
      if (supplierId.value) {
        const res = await saveSupplier({
          params: formState.value,
        });
        console.log(res);
      } else {
        const res = await saveSupplier({
          params: formState.value,
        });
        if (res.id) {
          await getSupplier(res.id);
          createMessage.success('新增供应商成功');
        }
        console.log(res);
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  /**
   * 审核/反审核方法
   * @param flag 0.审核 1.反审核
   */
  const handleAudit = async (flag: number) => {
    const type = await VXETable.modal.confirm('确定审核当前供应商吗?');
    if (type == 'confirm') {
      if (formState.value.bsStatus === 'A') {
        try {
          await auditMatTable({
            params: {
              id: supplierId.value,
            },
          });
          showSave.value = false;
          showAudit.value = false;
          createMessage.success('审核成功');
          const res = await getOneSupplier(supplierId.value);
          console.log('getOneSupplier', res);
        } catch (e) {
          console.log('失败', e);
        }
      }
    } else {
      createMessage.error('该物料已审核，无需再次审核');
      // back();
    }
    if (flag === 0) {
    } else {
    }
  };

  /**
   * 国家选择框change事件
   * @param data
   */
  const countryHandleChange = (data) => {
    console.log(data);
  };

  /**
   * 国家选择框过滤
   * @param input
   * @param option
   */
  const filterOption = (input: string, option: any) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  /**
   * 供应商分组弹框
   */
  const onGroupSearch = () => {
    getTree(); //获取分组数据
    supplierGroupModel.value = true;
  };

  /**
   * 供应商分组选择事件
   * @param value
   * @param node
   */
  const groupSelect = (value, node) => {
    tempFormState.groupName = node ? node[0] : '';
    formState.value.groupId = value;
    supplierGroupModel.value = false;
  };

  /**
   * 获取供应商分组树
   */
  const getTree = async () => {
    const tree = await getSupplierGroupTree({ params: '0' });
    runTree(tree);
    treeData.value = cloneDeep(tree);
  };

  /**
   * 获取国家地区
   */
  const getCountry = async () => {
    const res = await getCountryTree({ params: '-1' });
    if (res.length > 0) {
      res.forEach((item) => {
        item.label = item.name;
        item.value = item.id;
      });
      countryData.value = cloneDeep(res); //国家数据;
      formState.value.country = countryData.value[0].id; //默认选中第一条
      const data = await getCountryTree({ params: countryData.value[0].number || '' });
      if (res.length > 0) {
        data.forEach((item) => {
          item.label = item.name;
          item.value = item.id;
          item.isLeaf = false;
        });
        districtData.value = data;
      }
    }
  };

  /**
   * 获取地区数据
   */
  const loadDistrictData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    //懒加载
    const res = await getCountryTree({ params: targetOption.number });
    if (res.length > 0) {
      res.forEach((item) => {
        item.label = item.name;
        item.value = item.id;
        item.isLeaf = item.level == 3;
      });
      targetOption.children = res;
      districtData.value = [...districtData.value]; //地区数据
    }
    targetOption.loading = false;
  };

  /**
   * 省市区回显
   */
  const echoDistrict = async () => {
    let arr: number[] = [];
    let ssqData = cloneDeep(districtData.value);
    if (formState.value.provincial) {
      arr.push(formState.value.provincial);
      if (formState.value.municipal) {
        arr.push(formState.value.municipal);
        let provincialIndex = ssqData.findIndex((e) => e.id == formState.value.provincial);
        if (provincialIndex != -1) {
          const municipalRes = await getCountryTree({
            params: ssqData[provincialIndex].number || '',
          });
          municipalRes.forEach((item) => {
            item.label = item.name;
            item.value = item.id;
            item.isLeaf = item.level == 3;
          });
          ssqData[provincialIndex].children = cloneDeep(municipalRes);
          if (formState.value.district) {
            arr.push(formState.value.district);
            let municipalIndex = ssqData[provincialIndex].children!.findIndex(
              (e) => e.id == formState.value.municipal,
            );
            if (municipalIndex != -1) {
              const districtRes = await getCountryTree({
                params: ssqData[provincialIndex].children![municipalIndex].number || '',
              });
              districtRes.forEach((item) => {
                item.label = item.name;
                item.value = item.id;
                item.isLeaf = item.level == 3;
              });
              ssqData[provincialIndex].children![municipalIndex].children = cloneDeep(districtRes);
            }
          }
        }
      }
    }
    districtData.value = cloneDeep(ssqData);
    tempFormState.districtArr = arr;
  };

  /**
   * 初始化树
   * @param tree
   */
  const runTree = (tree: SupplierGroupEntity[] | CountryEntity[]) => {
    tree.forEach((item) => {
      item.title = item.name;
      item.value = item.id;
      item.key = item.id;
      runTree(item.children || []);
    });
  };

  /**
   * 清空事件
   */
  const onClear = () => {
    formState.value.groupId = '';
    tempFormState.groupName = '';
  };

  const back = () => {
    router.go(-1);
  };
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
