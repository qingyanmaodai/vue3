<template>
  <div>
    <LayoutHeader style="background-color: #fff; height: 60px; padding: 0 20px">
      <a style="font-size: 1.4rem; font-weight: bold; color: #000; line-height: 60px" @click="back"
        ><RollbackOutlined /> 返回</a
      >
      <div style="display: flex; float: right">
        <Button type="primary" class="button" @click="onSubmit" v-if="formState.bsStatus">保存</Button>
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
                <a-form-item label="项目编码：" ref="number" name="number" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.number"
                    placeholder="请输入项目编码"
                    :disabled="dataId"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="项目名称：" ref="name" name="name" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.name"
                    name="name"
                    placeholder="请输入项目名称"
                    :disabled="showUnExam"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item
                  label="项目类别："
                  v-model:value="formState.groupId"
                  ref="groupId"
                  name="groupId"
                  class="item"
                >
                  <ExInput
                    autocomplete="off"
                    class="input"
                    placeholder="请选择项目类别"
                    label="项目类别"
                    :show="showUnExam"
                    :value="formState.groupName"
                    :disabled="showUnExam"
                    @search="onGroupSearch(formState.groupName)"
                    @clear="onClear(['groupId', 'groupName'])"
                  />
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="检验描述：" ref="description" name="description" class="item">
                  <a-textArea
                    v-model:value="formState.description"
                    placeholder="请添加描述"
                    :rows="3"
                    class="textArea"
                    :disabled="showUnExam"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="备注：" ref="mark" name="mark" class="item">
                  <a-textArea
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
        <TabPane key="2" tab="其他信息">
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
    <!--  点击分组弹框  -->
    <a-modal v-model:visible="visibleGroupModal" title="检验类别">
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
    Switch,
    TabPane,
    Tabs,
    TreeSelect,
  } from 'ant-design-vue';
  import { ExInput } from '/@/components/ExInput';
  import { RollbackOutlined } from '@ant-design/icons-vue';
  import { useRoute, useRouter } from 'vue-router';
  import { TreeItem } from '/@/components/Tree';
  import { ExaProjectEntity } from '/@/api/exa';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ExaProjectGroupEntity, queryOneExaGroup, treeExaGroup } from '/@/api/exaProjectGroup';
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
  //分组弹框visible
  const visibleGroupModal: any = ref<boolean>(false);
  //弹窗类型
  let modalType = ref<string>('');
  //基础信息查询组件ref
  const basicSearchRef: any = ref<any>(undefined);
  //审核状态
  const showUnExam = ref<boolean>(false); //反审核
  const showExam = ref<boolean>(false); //审核
  const showSubmit = ref<boolean>(true); //保存
  //初始化
  const formState: UnwrapRef<ExaProjectEntity> = reactive({
    id: '0',
    number: '',
    name: '',
  });
  let groupSelectId = router.currentRoute.value.query.groupId?.toString();
  //重新物料分组赋值
  const groupEvent = async () => {
    const result = await queryOneExaGroup({ params: groupSelectId || '0' });
    if (result) {
      formState.groupId = result.id;
      formState.groupName = result.name;
    }
  };
  groupEvent();
  const formRules = reactive({
    name: [{ required: true, message: '请输入物料名称' }],
    number: [{ required: true, message: '请输入物料编码' }],
  });

  //分组弹框
  const onGroupSearch = (name) => {
    visibleGroupModal.value = true;
    formState.groupName = name;
    if (formState.groupName == '') {
      formState.groupName = undefined;
    }
  };

  //点击清空图标清空事件
  const onClear = (key: string[]) => {
    key.forEach((e) => {
      e.endsWith('Id') ? (formState[e] = '0') : (formState[e] = '');
    });
  };
  //获取物料分组数据
  let treeData = ref<TreeItem[]>([]);
  const getGroup = async () => {
    const tree = await treeExaGroup({ params: '0' });
    runTree(tree);
    treeData.value = cloneDeep(tree);
  };
  getGroup();
  const runTree = (tree: ExaProjectGroupEntity[]) => {
    tree.forEach((item) => {
      item.title = item.name;
      item.value = item.id;
      item.key = item.id;
      runTree(item.children || []);
    });
  };
  //物料分组弹框关
  const groupSelect = (value, node) => {
    formState.groupName = node[0] || '';
    formState.groupId = value;
    visibleGroupModal.value = false;
  };

  //接受参数
  const dataId = useRoute().query.row?.toString();
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
