<template>
  <div>
    <LayoutHeader style="background-color: #fff; height: 60px; padding: 0 20px">
      <a style="font-size: 1.4rem; font-weight: bold; color: #000; line-height: 60px" @click="back"
        ><RollbackOutlined /> 返回</a
      >
      <div style="display: flex; float: right">
        <Button type="primary" class="button" @click="save" v-if="showSave">保存</Button>
        <Button danger class="button" @click="handleAudit(0)" v-if="showAudit">审核</Button>
        <Button danger class="button" @click="handleAudit(1)" v-if="!showAudit">反审核</Button>
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
                <a-form-item label="地区：" ref="district" name="district" class="item">
                  <a-cascader
                    style="width: 16rem; height: 2rem; margin: 0 60px 0 2px"
                    :disabled="isDisable"
                    v-model:value="formState.district"
                    :options="districtData"
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
                    v-model:value="formState.groupName"
                    :disabled="isDisable"
                    @search="onGroupSearch"
                    @clear="onClear"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="业务状态：" ref="bsStatus" name="bsStatus" class="item">
                  <Select v-model:value="formState.bsStatus" class="select" disabled>
                    <SelectOption
                      v-for="(item, index) in config['DATA_STATUS']"
                      :key="index"
                      :value="item.value"
                    >
                      {{ item.label }}</SelectOption
                    >
                  </Select>
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
  import { onMounted, reactive, ref, UnwrapRef } from 'vue';
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

  /* data */

  //表单对象
  const formState: UnwrapRef<SupplierEntity> = reactive({
    id: undefined,
    number: undefined,
    name: undefined,
    shortName: undefined,
    contact: undefined,
    phone: undefined,
    mainBy: undefined,
    address: undefined,
    country: undefined,
    district: undefined,
    level: undefined,
    groupId: undefined,
    groupName: undefined,
    mark: undefined,
    erpCode: undefined,
    bsStatus: undefined,
    isDelete: undefined,
    createTime: undefined,
    updateTime: undefined,
    createBy: undefined,
    updateBy: undefined,
  });
  //表单必填规则配置
  const formRules = reactive({
    name: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
    number: [{ required: true, message: '请输入供应商编码', trigger: 'blur' }],
  });
  const formRef: any = ref<String | null>(null); //表单引用对象
  const supplierId = ref<string>(''); //路由参数，供应商Id
  const treeData = ref<TreeItem>([]); //供应商分组数据
  const countryData = ref<object[]>([]); //国家数据
  const districtData = ref<object[]>([]); //地区数据
  const supplierGroupModel = ref<boolean>(false); //供应商分组弹框显示状态
  const showAudit = ref<boolean>(false); //显示审核/反审核按钮
  const showSave = ref<boolean>(true); //显示保存按钮
  const activeTabs = ref<string>('basicInfo'); //当前激活板块
  const isDisable = ref<boolean>(false); //表单禁用状态

  /* method */

  /**
   * 页面加载
   */
  onMounted(() => {
    supplierId.value = useRoute().query.row?.toString() || '';
    if (supplierId.value) {
      getSupplier();
    }
  });

  /**
   * 获取供应商详细信息
   */
  const getSupplier = async () => {
    const res = await getOneSupplier(supplierId.value);
    console.log(res);
  };

  /**
   * 保存事件
   */
  const save = async () => {
    try {
      const values = await formRef.value.validateFields();
      console.log('Success:', values);
      //保存操作
      if (supplierId.value) {
        const res = await saveSupplier({
          params: formState,
        });
        console.log(res);
      } else {
        const res = await saveSupplier({
          params: formState,
        });
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
      if (formState.bsStatus === 'A') {
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
    formState.groupName = node ? node[0] : '';
    formState.groupId = value;
    supplierGroupModel.value = false;
  };

  /**
   * 获取树
   */
  const getTree = async () => {
    const tree = await getSupplierGroupTree({ params: '0' });
    runTree(tree);
    console.log('tree', tree);
    treeData.value = cloneDeep(tree);
  };
  /**
   * 初始化树
   * @param tree
   */
  const runTree = (tree: SupplierGroupEntity[]) => {
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
    formState.groupId = '';
    formState.groupName = '';
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
