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
        <Button danger class="button" @click="onAudit" v-if="formState.bsStatus === 'A'"
          >审核</Button
        >
        <Button danger class="button" @click="onUnAudit" v-if="formState.bsStatus === 'B'"
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
                <a-form-item label="项目编码：" ref="number" name="number" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.number"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请输入项目编码'"
                    :disabled="formState.bsStatus === 'B'"
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
                    :placeholder="formState.bsStatus === 'B' ? '' : '请输入项目名称'"
                    :disabled="formState.bsStatus === 'B'"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="是否启用" ref="isOpen" name="isOpen" class="switch">
                  <div class="switchDiv">
                    <Switch
                      :checked-children="config.ENABLE_STATUS_SPE[1]"
                      :un-checked-children="config.ENABLE_STATUS_SPE[0]"
                      :checkedValue="1"
                      :unCheckedValue="0"
                      v-model:checked="formState.isOpen"
                      :disabled="formState.bsStatus === 'B'"
                    />
                  </div>
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="最小数：" ref="min" name="min" class="item">
                  <InputNumber
                    class="input"
                    v-model:value="formState.min"
                    :disabled="formState.bsStatus === 'B'"
                    :min="1"
                /></a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="最大数：" ref="max" name="max" class="item">
                  <InputNumber
                    class="input"
                    v-model:value="formState.max"
                    :disabled="formState.bsStatus === 'B'"
                    :min="1"
                /></a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="百分比%：" ref="percent" name="percent" class="item">
                  <InputNumber
                    class="input"
                    v-model:value="formState.percent"
                    :disabled="formState.bsStatus === 'B'"
                    :min="1"
                /></a-form-item>
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
        <TabPane key="2" tab="其他信息">
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
    LayoutHeader,
    Row,
    Switch,
    TabPane,
    Tabs,
    InputNumber,
  } from 'ant-design-vue';
  import { RollbackOutlined } from '@ant-design/icons-vue';
  import { useRoute, useRouter } from 'vue-router';
  import { add, audit, unAudit, ExaRuleEntity, getOneById, update } from '/@/api/exaRule';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { config } from '/@/utils/publicParamConfig';
  import { VXETable } from 'vxe-table';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  const { createMessage } = useMessage();
  const AForm = Form;
  const AFormItem = FormItem;
  const ATextArea = Input.TextArea;
  const router = useRouter();
  const formRef = ref();
  //整个基本信息 v-model:activeKey="activeKey"
  const activeKey = ref<string>('1');
  const formData: ExaRuleEntity = {
    id: undefined,
    number: '',
    name: '',
    min: 1,
    max: 10,
    percent: 1,
  };
  //初始化
  const formStateInit = reactive({
    data: formData,
  });
  const formState = toRef(formStateInit, 'data');
  //重新物料分组赋值
  const formRules = reactive({
    name: [{ required: true, message: '请输入物料名称' }],
    number: [{ required: true, message: '请输入物料编码' }],
    percent: [{ required: true, message: '请输入检验百分比' }],
    min: [{ required: true, message: '请输入检验最小数' }],
    max: [{ required: true, message: '请输入检验最大数' }],
  });
  //接受参数
  const dataId = useRoute().query.row?.toString();
  const onSubmit = async () => {
    formRef.value
      .validate()
      .then(async () => {
        if (!formState.value.id) {
          const data = await add({ params: formState.value });
          formState.value = Object.assign({}, formState.value, data);
        } else {
          const data = await update({ params: formState.value });
          formState.value = Object.assign({}, formState.value, data);
        }
        createMessage.success('操作成功');
      })
      .catch((error: ValidateErrorEntity<FormData>) => {
        console.log(error);
        if(error.errorFields) {
          createMessage.error('数据校检不通过，请检查!');
        }
      });
  };
  const onAudit = async () => {
    formRef.value
      .validate()
      .then(async () => {
        const type = await VXETable.modal.confirm('您确定要保存并审核吗?');
        if (type === 'confirm') {
          const data = await audit({ params: formState.value });
          formState.value = Object.assign({}, formState.value, data);
          createMessage.success('操作成功');
        }
      })
      .catch((error: ValidateErrorEntity<FormData>) => {
        console.log(error);
        if(error.errorFields) {
          createMessage.error('数据校检不通过，请检查!');
        }
      });
  };
  const onUnAudit = async () => {
    const type = await VXETable.modal.confirm('您确定要反审核吗?');
    if (type === 'confirm') {
      const data = await unAudit({ params: formState.value });
      formState.value = Object.assign({}, formState.value, data);
      createMessage.success('操作成功');
    }
  };
  //返回上一页
  const back = () => {
    router.go(-1);
  };
  const init = async () => {
    if (dataId) {
      await getOneById({ params: dataId }).then(async (res) => {
        formState.value = res;
      });
    }
  };
  init();
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
    height: calc(100% - 80px);
    background-color: #fff;
    padding: 10px;
  }
  .button {
    margin: 15px;
  }
</style>
