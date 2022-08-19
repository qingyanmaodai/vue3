<template>
  <div>
    <LayoutHeader style="background-color: #fff; height: 60px; padding: 0 20px">
      <a style="font-size: 1.4rem; font-weight: bold; color: #000; line-height: 60px" @click="back"
        ><RollbackOutlined /> 返回</a
      >
      <div style="display: flex; float: right">
        <Button type="primary" class="button" @click="save" v-if="showSubmit">保存</Button>
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
                <a-form-item label="编码：" ref="number" name="number" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.number"
                    placeholder="请输入供应商编码"
                    :disabled="numberInputStatus"
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
                <a-form-item label="联系人：" ref="number" name="number" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.contact"
                    placeholder="请输入联系人"
                    :disabled="showUnExam"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="联系电话：" ref="name" name="name" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.phone"
                    name="name"
                    placeholder="请输入联系电话"
                    :disabled="showUnExam"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="责任人：" ref="shortName" name="shortName" class="item">
                  <Input
                    allowClear
                    class="input"
                    v-model:value="formState.mainBy"
                    placeholder="请输入责任人"
                    :disabled="showUnExam"
                  />
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="国家：" ref="country" name="country" class="item">
                  <a-select
                    class="input"
                    :disabled="showUnExam"
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
                <a-form-item label="地区：" ref="district" name="district" class="item">
                  <a-cascader
                    style="width: 16rem; height: 2rem; margin: 0 60px 0 2px"
                    :disabled="showUnExam"
                    v-model:value="formState.district"
                    :options="districtData"
                    placeholder="请选择"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="详细地址：" ref="shortName" name="shortName" class="item">
                  <Input
                    allowClear
                    class="input"
                    v-model:value="formState.address"
                    placeholder="请输入地址"
                    :disabled="showUnExam"
                  />
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="供应商等级：" ref="shortName" name="shortName" class="item">
                  <Input
                    allowClear
                    class="input"
                    v-model:value="formState.level"
                    placeholder="请输入供应商等级"
                    :disabled="showUnExam"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item
                  label="供应商分组："
                  v-model:value="formState.groupId"
                  ref="groupId"
                  name="groupId"
                  class="item"
                >
                  <ExInput
                    autocomplete="off"
                    class="input"
                    placeholder="请选择供应商分组"
                    label="供应商分组"
                    :show="showUnExam"
                    v-model:value="formState.groupName"
                    :disabled="showUnExam"
                    @search="onGroupSearch"
                    @clear="onClear"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="数据状态：" ref="bsStatus" name="bsStatus" class="item">
                  <Select v-model:value="formState.bsStatus" class="select" disabled>
                    <SelectOption
                      v-for="(item, index) in config['DATA_STATUS']"
                      :key="index"
                      :value="item.value"
                    >
                      {{ item.label }}}</SelectOption
                    >
                  </Select>
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
    <!--  供应商分组弹框  -->
    <a-modal v-model:visible="supplierGroupModel" title="物料分组" ref="node">
      <a-tree-select
        loading
        show-search
        v-model:value="formState.node"
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
  import { onActivated, onMounted, reactive, ref, UnwrapRef } from 'vue';
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
    Textarea,
    TreeSelect,
    Cascader,
  } from 'ant-design-vue'; //ant组件
  const AModal = Modal;
  const AForm = Form;
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
  import { getOneSupplier, SupplierEntity } from '/@/api/supplier'; //供应商api
  import { TreeItem } from '/@/components/Tree';

  /* data */

  let numberInputStatus = ref<boolean>(false); //编码输入禁用状态
  //表单对象
  const formState: UnwrapRef<SupplierEntity> = reactive({
    id: '',
    number: '',
    name: '',
    shortName: '',
    contact: '',
    phone: '',
    mainBy: '',
    address: '',
    country: '',
    district: '',
    level: '',
    groupId: '',
    groupName: '',
    mark: '',
    erpCode: '',
    bsStatus: '',
    isDelete: '',
    createTime: '',
    updateTime: '',
    createBy: '',
    updateBy: '',
    tenantId: '',
  });
  //表单必填规则配置
  const formRules = reactive({
    name: [{ required: true, message: '请输入供应商名称' }],
    number: [{ required: true, message: '请输入供应商编码' }],
    groupId: [{ required: true, message: '请选择供应商分组' }],
  });
  const rowId = ref<string>(''); //路由参数，明细Id
  const treeData = ref<TreeItem>([]); //供应商分组数据
  const countryData = ref<object[]>([]); //国家数据
  const districtData = ref<object[]>([]); //地区数据
  const supplierGroupModel = ref<boolean>(false); //供应商分组弹框显示状态
  const showUnExam = ref<boolean>(false); //反审核
  const showExam = ref<boolean>(false); //审核
  const showSubmit = ref<boolean>(true); //保存

  /* method */

  /**
   * 页面加载
   */
  onMounted(() => {
    rowId.value = useRoute().query.row?.toString() || '';
    getSupplier();
  });

  /**
   * 获取供应商详细信息
   */
  const getSupplier = async () => {
    const res = await getOneSupplier({ params: rowId.value });
    console.log(res);
  };

  /**
   * 保存事件
   */
  const save = () => {
    console.log(rowId);
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
   * @param name
   */
  const onGroupSearch = () => {
    supplierGroupModel.value = true;
  };

  /**
   * 供应商分组选择事件
   * @param value
   * @param node
   */
  const groupSelect = (value, node) => {
    formState.groupName = node;
    formState.groupId = value;
    supplierGroupModel.value = false;
  };

  /**
   * 清空事件
   */
  const onClear = () => {};

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
