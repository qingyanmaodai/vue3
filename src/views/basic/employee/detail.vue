<template>
  <div>
    <LayoutHeader style="background-color: #fff; height: 60px; padding: 0 20px">
      <a style="font-size: 1.4rem; font-weight: bold; color: #000; line-height: 60px" @click="back"
        ><RollbackOutlined /> 返回</a
      >
      <div style="display: flex; float: right">
        <Button type="primary" class="button" @click="onSubmit" v-show="showSave">保存</Button>
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
                    placeholder="请输入人员编码"
                    :disabled="formState.bsStatus === 'B'"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="人员名称：" ref="name" name="name" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.name"
                    name="name"
                    placeholder="请输入人员名称"
                    :disabled="isDisable"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="性别：" ref="shortName" name="shortName" class="item">
                  <a-select
                    allowClear
                    class="input"
                    :disabled="isDisable"
                    v-model:value="formState.sex"
                    show-search
                    placeholder="请选择"
                    :options="config.GENDER"
                    :filter-option="filterOption"
                  />
                </a-form-item>
              </Col>
            </Row>
            <Row>
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
                <a-form-item label="邮箱：" ref="email" name="email" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.email"
                    name="name"
                    placeholder="请输入邮箱"
                    :disabled="isDisable"
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
                <a-form-item label="职位：" ref="job" name="job" class="item">
                  <a-select
                    allowClear
                    class="input"
                    :disabled="isDisable"
                    v-model:value="formState.job"
                    show-search
                    placeholder="请选择"
                    :options="config.JOB"
                    :filter-option="filterOption"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item
                  label="部门："
                  v-model:value="formState.deptId"
                  ref="groupName"
                  name="groupName"
                  class="item"
                >
                  <ExInput
                    autocomplete="off"
                    class="input"
                    placeholder="请选择部门"
                    label="部门"
                    :show="!isDisable"
                    v-model:value="tempFormState.groupName"
                    :disabled="isDisable"
                    @search="onGroupSearch"
                    @clear="onClear"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="出生日期：" ref="birthday" name="birthday" class="item">
                  <a-date-picker
                    class="input"
                    v-model:value="formState.birthday"
                    placeholder="请选择时间..."
                    :disabled="isDisable"
                  />
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="入职日期：" ref="entryDate" name="entryDate" class="item">
                  <a-date-picker
                    class="input"
                    v-model:value="formState.entryDate"
                    placeholder="请选择时间..."
                    :disabled="isDisable"
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
    <!--  部门弹框  -->
    <a-modal v-model:visible="employeeGroupModel" title="部门" ref="node">
      <a-tree-select
        loading
        show-search
        v-model:value="formState.deptId"
        style="width: 100%"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        placeholder="请选择部门"
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
    DatePicker,
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
  } from 'ant-design-vue'; //ant组件
  const AModal = Modal;
  const AForm = Form;
  const TextArea = Input.TextArea;
  const AFormItem = FormItem;
  const ATreeSelect = TreeSelect;
  const ACard = Card;
  const ASelect = Select;
  const ADatePicker = DatePicker;
  import { ExInput } from '/@/components/ExInput';
  import { RollbackOutlined } from '@ant-design/icons-vue';
  import { config } from '/@/utils/publicParamConfig'; //公共配置ts
  import { useRoute, useRouter } from 'vue-router'; //路由
  const router = useRouter();
  import { getOneEmployee, save, update, audit, unAudit, EmployeeEntity } from '/@/api/employee';
  import { getDeptTree, queryOneDept, DepartmentEntity } from '/@/api/department'; //部门api
  import { TreeItem } from '/@/components/Tree';
  import { VXETable } from 'vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage'; //提示信息组件
  const { createMessage } = useMessage();
  import { cloneDeep } from 'lodash-es';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';

  /* data */

  //额外表单数据
  type tempForm = {
    groupName: string;
    districtArr: number[];
  };
  const tempFormState: UnwrapRef<tempForm> = reactive({
    groupName: '', //部门名称
    districtArr: [], //地区数组
  });
  //表单初始数据
  const formData: UnwrapRef<EmployeeEntity> = {
    id: undefined,
    number: undefined,
    name: undefined,
    sex: undefined,
    job: undefined,
    deptId: undefined,
    phone: undefined,
    email: undefined,
    address: undefined,
    birthday: undefined,
    entryDate: undefined,
  };
  const formInitState = reactive({ data: formData });

  const formState = toRef(formInitState, 'data'); //表单对象

  //表单必填规则配置
  const formRules = reactive({
    name: [{ required: true, message: '请输入人员名称', trigger: 'blur' }],
    number: [{ required: true, message: '请输入人员编码', trigger: 'blur' }],
  });
  const formRef: any = ref<String | null>(null); //表单引用对象
  const employeeId = ref<string>(''); //路由参数，人员Id
  const selectGroupId = ref<string>(''); //路由参数，部门Id
  const treeData = ref<TreeItem>([]); //部门数据
  const employeeGroupModel = ref<boolean>(false); //部门弹框显示状态
  const showAudit = ref<boolean>(true); //显示审核/反审核按钮
  const showSave = ref<boolean>(true); //显示保存按钮
  const activeTabs = ref<string>('basicInfo'); //当前激活板块
  const isDisable = ref<boolean>(false); //表单禁用状态

  /* method */

  /**
   * 页面加载
   */
  onMounted(() => {
    employeeId.value = useRoute().query.row?.toString() || '';
    selectGroupId.value = router.currentRoute.value.query.groupId?.toString() || '';
    init(); //页面初始化
  });

  const init = async () => {
    if (employeeId.value) {
      await getEmployee();
    } else {
      //获取部门
      const result = await queryOneDept({ params: selectGroupId.value || '0' });
      if (result) {
        formState.value.deptId = result.id;
        tempFormState.groupName = result.name || '';
      }
    }
  };

  /**
   * 获取人员详细信息
   */
  const getEmployee = async (entityId = employeeId.value) => {
    const res: any = await getOneEmployee(entityId);
    if (res) {
      formState.value = res;
      tempFormState.groupName = res.bdDepartment ? res.bdDepartment.name : '';
      if (formState.value.bsStatus === 'B') {
        isDisable.value = true;
        showAudit.value = false;
        showSave.value = false;
      }
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
        let res;
        if (employeeId.value) {
          res = await update({ params: formState.value });
        } else {
          res = await save({ params: formState.value });
        }
        await getEmployee(res.id);
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
    const type = await VXETable.modal.confirm(`确定${mess}当前人员吗?`);
    if (type == 'confirm') {
      formRef.value
        .validate()
        .then(async () => {
          let data;
          if (flag === 0) {
            data = await audit({ params: formState.value });
            isDisable.value = true;
            showAudit.value = false;
            showSave.value = false;
          } else {
            data = await unAudit({ params: formState.value });
            isDisable.value = false;
            showAudit.value = true;
            showSave.value = true;
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
   * 选择框过滤
   * @param input
   * @param option
   */
  const filterOption = (input: string, option: any) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  /**
   * 部门弹框
   */
  const onGroupSearch = () => {
    getTree(); //获取分组数据
    employeeGroupModel.value = true;
  };

  /**
   * 部门选择事件
   * @param value
   * @param node
   */
  const groupSelect = (value, node) => {
    tempFormState.groupName = node ? node[0] : '';
    formState.value.deptId = value;
    employeeGroupModel.value = false;
  };

  /**
   * 获取部门树
   */
  const getTree = async () => {
    const tree = await getDeptTree({ params: '0' });
    runTree(tree);
    treeData.value = cloneDeep(tree);
  };

  /**
   * 初始化树
   * @param tree
   */
  const runTree = (tree: DepartmentEntity[]) => {
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
    formState.value.deptId = '';
    tempFormState.groupName = '';
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
    height: 80vh;
  }
  .button {
    margin: 15px;
  }
</style>
