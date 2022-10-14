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
        <Button danger class="button" @click="handleAudit(0)" v-if="formState.bsStatus === 'A'"
          >审核</Button
        >
        <Button danger class="button" @click="handleAudit(1)" v-if="formState.bsStatus === 'B'"
          >反审核</Button
        >
      </div>
    </LayoutHeader>
    <div class="content">
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
                    :placeholder="formState.bsStatus === 'B' ? '' : '请输入客户编码'"
                    :disabled="formState.bsStatus === 'B'"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="客户名称：" ref="name" name="name" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.name"
                    name="name"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请输入客户名称'"
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
                <a-form-item label="国家：" ref="country" name="country" class="item">
                  <a-select
                    allowClear
                    class="input"
                    :disabled="formState.bsStatus === 'B'"
                    v-model:value="formState.country"
                    show-search
                    :placeholder="formState.bsStatus === 'B' ? '' : '请选择'"
                    :options="countryData"
                    :filter-option="filterOption"
                    @change="countryHandleChange"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="地区：" ref="districtArr" name="districtArr" class="item">
                  <a-cascader
                    allowClear
                    v-if="isShowDistrict"
                    style="width: 16rem; height: 2rem; margin: 0 60px 0 2px"
                    :disabled="formState.bsStatus === 'B'"
                    v-model:value="formState.districtArr"
                    :options="districtData"
                    :load-data="loadDistrictData"
                    change-on-select
                    :placeholder="formState.bsStatus === 'B' ? '' : '请选择'"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="详细地址：" ref="address" name="address" class="item">
                  <Input
                    allowClear
                    class="input"
                    v-model:value="formState.address"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请输入地址'"
                    :disabled="formState.bsStatus === 'B'"
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
                    :placeholder="formState.bsStatus === 'B' ? '' : '请输入联系人'"
                    :disabled="formState.bsStatus === 'B'"
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
                    :placeholder="formState.bsStatus === 'B' ? '' : '请输入联系电话'"
                    :disabled="formState.bsStatus === 'B'"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="客户分组：" ref="groupId" name="groupId" class="item">
                  <ExInput
                    autocomplete="off"
                    class="input"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请选择客户分组'"
                    label="客户分组"
                    :show="formState.bsStatus !== 'B'"
                    v-model:value="formState.bdCustomerGroup"
                    :disabled="formState.bsStatus === 'B'"
                    @search="onGroupSearch"
                    @clear="onClear(['groupId', 'bdCustomerGroup'])"
                  />
                </a-form-item>
              </Col>
            </Row>
            <Row>
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
              <Col :span="8">
                <a-form-item label="备注：" ref="mark" name="mark" class="item">
                  <TextArea
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
    </div>
    <!--  客户分组弹框  -->
    <a-modal v-model:visible="customerGroupModel" title="客户分组" ref="node">
      <a-tree-select
        loading
        show-search
        v-model:value="formState.groupId"
        style="width: 100%"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        placeholder="请选择客户分组"
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
    Col,
    Form,
    FormItem,
    Input,
    LayoutHeader,
    Modal,
    Row,
    Select,
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
  const ASelect = Select;
  const ACascader = Cascader;
  import { ExInput } from '/@/components/ExInput';
  import { RollbackOutlined } from '@ant-design/icons-vue';
  import { config } from '/@/utils/publicParamConfig'; //公共配置ts
  import { useRoute, useRouter } from 'vue-router'; //路由
  const router = useRouter();
  import { getOneCustomer, save, update, audit, unAudit, CustomerEntity } from '/@/api/customer'; //客户api
  import {
    getCustomerGroupTree,
    queryOneCustomerGroup,
    CustomerGroupEntity,
  } from '/@/api/customerGroup'; //客户分组api
  import { TreeItem } from '/@/components/Tree';
  import { VXETable } from 'vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage'; //提示信息组件
  const { createMessage } = useMessage();
  import { cloneDeep } from 'lodash-es';
  import { CountryEntity, getCountryTree } from '/@/api/country';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';

  /* data */
  //表单初始数据
  const formData: UnwrapRef<CustomerEntity> = {
    id: undefined,
    number: '',
    name: '',
    districtArr: [], //地区数组
  };
  const formInitState = reactive({ data: formData });

  const formState = toRef(formInitState, 'data'); //表单对象

  //表单必填规则配置
  const formRules = reactive({
    name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
    number: [{ required: true, message: '请输入客户编码', trigger: 'blur' }],
  });
  const formRef: any = ref<String | null>(null); //表单引用对象
  const customerId = ref<string>(''); //路由参数，客户Id
  const selectGroupId = ref<string>(''); //路由参数，客户分组Id
  const treeData = ref<TreeItem>([]); //客户分组数据
  const countryData = ref<CountryEntity[]>([]); //国家数据
  const districtData = ref<CountryEntity[]>([]); //地区数据
  const customerGroupModel = ref<boolean>(false); //客户分组弹框显示状态
  const activeTabs = ref<string>('basicInfo'); //当前激活板块
  const isShowDistrict = ref<boolean>(false); //是否显示地区组件

  /* method */

  /**
   * 页面加载
   */
  onMounted(() => {
    customerId.value = useRoute().query.row?.toString() || '';
    selectGroupId.value = router.currentRoute.value.query.groupId?.toString() || '';
    init(); //页面初始化
  });

  const init = async () => {
    await getCountry();
    if (customerId.value) {
      await getCustomer();
    } else {
      //获取客户分组
      const result = await queryOneCustomerGroup({ params: selectGroupId.value || '0' });
      if (result) {
        formState.value.groupId = result.id;
        formState.value.bdCustomerGroup = result;
      }
    }
    isShowDistrict.value = true;
  };

  /**
   * 获取客户详细信息
   */
  const getCustomer = async (supId = customerId.value) => {
    const res: any = await getOneCustomer(supId);
    if (res) {
      formState.value = res;
      //回显地区信息
      await echoDistrict();
    }
  };

  /**
   * 保存事件
   */
  const onSubmit = async () => {
    //表单验证
    formRef.value
      .validate()
      .then(async () => {
        formState.value.provincial = formState.value.districtArr[0]
          ? formState.value.districtArr[0]
          : undefined; //省
        formState.value.municipal = formState.value.districtArr[1]
          ? formState.value.districtArr[1]
          : undefined; //市
        formState.value.district = formState.value.districtArr[2]
          ? formState.value.districtArr[2]
          : undefined; //区
        let res;
        if (customerId.value) {
          res = await update({ params: formState.value });
        } else {
          res = await save({ params: formState.value });
        }
        formState.value = Object.assign({}, formState.value, res);
        createMessage.success('操作成功');
      })
      .catch((error: ValidateErrorEntity<FormData>) => {
        createMessage.error('数据校检不通过，请检查!');
        console.log(error);
      });
  };

  /**
   * 审核/反审核方法
   * @param flag 0.审核 1.反审核
   */
  const handleAudit = async (flag: number) => {
    let mess = flag === 1 ? '反审核' : '保存并审核';
    const type = await VXETable.modal.confirm(`确定${mess}当前客户吗?`);
    if (type == 'confirm') {
      formRef.value
        .validate()
        .then(async () => {
          let data;
          if (flag === 0) {
            data = await audit({ params: formState.value });
          } else {
            data = await unAudit({ params: formState.value });
          }
          formState.value = Object.assign({}, formState.value, data);
          createMessage.success('操作成功');
        })
        .catch((error: ValidateErrorEntity<FormData>) => {
          createMessage.error('数据校检不通过，请检查!');
          console.log(error);
        });
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
   * 客户分组弹框
   */
  const onGroupSearch = () => {
    getTree(); //获取分组数据
    customerGroupModel.value = true;
  };

  /**
   * 客户分组选择事件
   * @param value
   * @param names
   */
  const groupSelect = (value: string, names: string[]) => {
    formState.value.bdCustomerGroup = { id: value, name: names[0] || '' };
    formState.value.groupId = value;
    customerGroupModel.value = false;
  };

  /**
   * 获取客户分组树
   */
  const getTree = async () => {
    const tree = await getCustomerGroupTree({ params: '0' });
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
    try {
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
                ssqData[provincialIndex].children![municipalIndex].children =
                  cloneDeep(districtRes);
              }
            }
          }
        }
      }
      districtData.value = cloneDeep(ssqData);
      formState.value.districtArr = arr;
    } catch (e) {
      console.log(e);
    }
  };

  /**
   * 初始化树
   * @param tree
   */
  const runTree = (tree: CustomerGroupEntity[] | CountryEntity[]) => {
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
  const onClear = (key: string[]) => {
    key.forEach((e) => {
      formState.value[e] = undefined;
    });
  };

  const back = () => {
    router.go(-1);
  };
</script>
<style scoped lang="less">
  .item {
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
    background-color: #fff;
    padding: 10px;
    height: calc(100% - 80px);
  }
  .button {
    margin: 15px;
  }
</style>
