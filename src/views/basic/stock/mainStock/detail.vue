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
                <a-form-item label="仓库编码：" ref="number" name="number" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.number"
                    placeholder="请输入仓库编码"
                    :disabled="hasId"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="仓库名称：" ref="name" name="name" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.name"
                    name="name"
                    placeholder="请输入仓库名称"
                    :disabled="showUnExam"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="负责人：" ref="mainBy" name="mainBy" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.mainBy"
                    name="name"
                    placeholder="请输入负责人"
                    :disabled="showUnExam"
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
                    placeholder="请输入联系电话"
                    :disabled="showUnExam"
                    onkeyup="value=value.replace(/[^\d\-]/g,'')"
                    :maxlength="20"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="仓库地址：" ref="address" name="address" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.address"
                    name="name"
                    placeholder="请输入仓库地址"
                    :disabled="showUnExam"
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
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="备注：" ref="mark" name="mark" class="item">
                  <TextArea
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
    LayoutHeader,
    Row,
    TabPane,
    Tabs,
  } from 'ant-design-vue';
  import { RollbackOutlined } from '@ant-design/icons-vue';
  import { useRoute, useRouter } from 'vue-router';
  import { VXETable } from 'vxe-table';
  import { config } from '/@/utils/publicParamConfig';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    addStockList,
    auditStockList,
    getOneStockById,
    StockProfileEntity,
    unAuditStockList,
    updateStockList,
  } from '/@/api/mainStock';
  import { cloneDeep } from 'lodash-es';
  const { createMessage } = useMessage();
  const AForm = Form;
  const AFormItem = FormItem;
  const ACard = Card;
  const TextArea = Input.TextArea;

  const router = useRouter();
  const activeKey = ref<string>('1');

  //审核状态
  const showUnExam = ref<boolean>(false); //反审核
  const showExam = ref<boolean>(false); //审核
  const showSubmit = ref<boolean>(true); //保存
  //规则
  const formRules = reactive({
    name: [{ required: true, message: '请输入仓库名称' }],
    number: [{ required: true, message: '请输入仓库编码' }],
  });
  //初始化
  const formData: StockProfileEntity = {
    id: undefined,
    number: '',
    name: '',
  };
  const formStateInit = reactive({
    data: formData,
  });
  let formState = toRef(formStateInit, 'data');
  let resInit = toRef(formStateInit, 'data');

  let getParams = () => {
    let query = router.currentRoute.value.query;
    console.log('query', query);
  };
  getParams();

  //接受参数
  let rowId = useRoute().query.row?.toString() || '';
  let hasId = ref<boolean>(false);

  //如果有id，则通过接口进入编辑页面。没有id——新增
  const getListById = async () => {
    if (rowId) {
      hasId.value = true;
      const res = await getOneStockById({
        params: rowId,
      });
      formState.value = cloneDeep(res);
      resInit.value = cloneDeep(res);
      console.log('resInit', resInit.value);
      console.log('formState.value', formState.value);
      //创建状态
      if (rowId && formState.value.bsStatus === 'A') {
        showExam.value = true;
        showUnExam.value = false;
      } else if (rowId && formState.value.bsStatus === 'B') {
        //审核状态
        showExam.value = false;
        showUnExam.value = true;
        showSubmit.value = false;
      }
      if (formState.value.bsStatus === 'A') {
        formState.value.labelValue = '创建';
      } else {
        formState.value.labelValue = '已审核';
      }
    }
  };

  const stockHandle = async () => {
    //修改
    if (rowId) {
      await getListById();
    }
  };
  stockHandle();
  //保存事件
  const onSubmit = async () => {
    if (!rowId) {
      if (!formState.value.name || !formState.value.number) {
        createMessage.error('必填字段不能为空');
      } else {
        try {
          const addList = await addStockList({
            params: formState.value,
          });
          if (addList.id != null) {
            showExam.value = true;
            await getListById();
            createMessage.success('添加成功');
          }
        } catch (e) {
          console.log('失败', e);
        }
      }
    } else {
      formState.value.id = rowId;
      if (!formState.value.name || !formState.value.number) {
        createMessage.error('必填字段不能为空');
      } else {
        try {
          const updateList = async () => {
            await updateStockList({
              params: formState.value,
            });
          };
          await updateList();
          await getListById();
          createMessage.success('修改成功');
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
    console.log('ssssssss', resInit.value == formState.value);
    console.log('resInit', resInit.value);
    const type = await VXETable.modal.confirm('您确定要审核当前物料吗?');
    if (type == 'confirm') {
      if (formState.value === resInit.value) {
        if (formState.value.labelValue === 'A' || formState.value.labelValue === '创建') {
          try {
            const auditEvent = async () => {
              await auditStockList({
                params: {
                  id: rowId,
                },
              });
            };
            await auditEvent();
            showSubmit.value = false;
            showExam.value = false;
            showUnExam.value = true;
            await getListById();
            createMessage.success('审核成功');
          } catch (e) {
            console.log('失败', e);
          }
        }
      } else {
        createMessage.error('您修改的数据还未保存');
      }
    } else {
      console.log('取消');
    }
  };
  //反审核功能
  const unExam = async () => {
    const type = await VXETable.modal.confirm('您确定要反审核当前物料吗?');
    if (type == 'confirm') {
      if (formState.value.labelValue === 'B' || formState.value.labelValue === '已审核') {
        try {
          const unAuditEvent = async () => {
            await unAuditStockList({
              params: {
                id: rowId,
              },
            });
          };
          await unAuditEvent();
          showSubmit.value = true;
          showExam.value = true;
          showUnExam.value = false;
          createMessage.success('反审核成功');
          await getListById();
        } catch (e) {
          console.log('失败', e);
        }
      } else {
        console.log('取消');
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
