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
                    onkeyup="value=value.replace(/[^\d\-\d]/g,'')"
                    maxlength="20"
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
                <a-form-item label="数据状态：" ref="bsStatus" name="bsStatus" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.bsStatus"
                    name="name"
                    disabled
                  />
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
  import { onMounted, reactive, ref, UnwrapRef } from 'vue';
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
    Textarea,
  } from 'ant-design-vue';
  import { RollbackOutlined } from '@ant-design/icons-vue';
  import { useRoute, useRouter } from 'vue-router';
  import { VXETable } from 'vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    addStockList,
    auditStockList,
    getIdStockList,
    unAuditStockList,
    updateStockList,
  } from '/@/api/mainStock';
  const { createMessage } = useMessage();
  const AForm = Form;
  const AFormItem = FormItem;
  const ACard = Card;

  const router = useRouter();
  //整个基本信息 v-model:activeKey="activeKey"
  const activeKey = ref<string>('1');

  //审核状态
  const showUnExam = ref<boolean>(false); //反审核
  const showExam = ref<boolean>(false); //审核
  const showSubmit = ref<boolean>(true); //保存

  //对应输入框绑定的值接口类型
  interface FormState {
    id?: string | undefined;
    number: string | undefined;
    name: string | undefined;
    mainBy: string | undefined;
    phone: string | undefined;
    address: string | undefined;
    bsStatus: string | undefined;
    mark: string | undefined;
    stockInExamine: number | undefined;
    stockOutExamine: number | undefined;
    labelValue: string | undefined;
    createTime: string | undefined;
    createBy: string | undefined;
    updateTime: string | undefined;
    updateBy: string | undefined;
  }
  //初始化
  const formState: UnwrapRef<FormState> = reactive({
    id: undefined,
    number: undefined,
    name: undefined,
    mainBy: undefined,
    phone: undefined,
    address: undefined,
    bsStatus: 'A',
    mark: undefined,
    labelValue: undefined,
    stockInExamine: undefined,
    stockOutExamine: undefined,
    updateBy: undefined,
    updateTime: undefined,
    createBy: undefined,
    createTime: undefined,
  });

  const formRules = reactive({
    name: [{ required: true, message: '请输入仓库名称' }],
    number: [{ required: true, message: '请输入仓库编码' }],
  });
  let getParams = () => {
    let query = router.currentRoute.value.query;
    console.log('query', query);
  };
  getParams();

  //接受参数
  let rowId = useRoute().query.row?.toString();
  let hasId = ref<boolean>(false);
  console.log('编辑id', rowId);

  //如果有id，则通过接口进入编辑页面。没有id——新增
  const getListById = async (id) => {
    if (rowId) {
      id = rowId;
      hasId.value = true;
    }
    const res: any = await getIdStockList({
      params: id,
    });
    formState.number = res.number;
    formState.name = res.name;
    formState.mainBy = res.mainBy;
    formState.phone = res.phone;
    formState.address = res.address;
    formState.bsStatus = res.bsStatus;
    //创建状态
    if (rowId && res.bsStatus === 'A') {
      showExam.value = true;
      showUnExam.value = false;
    } else if (rowId && res.bsStatus === 'B') {
      //审核状态
      showExam.value = false;
      showUnExam.value = true;
      showSubmit.value = false;
    }
    if (formState.bsStatus === 'A') {
      formState.labelValue = '创建';
    } else {
      formState.labelValue = '已审核';
    }
    formState.stockInExamine = res.stockInExamine;
    formState.stockOutExamine = res.stockOutExamine;
    formState.createTime = res.createTime;
    formState.createBy = res.createBy;
    formState.updateTime = res.updateTime;
    formState.updateBy = res.updateBy;
  };

  getListById(rowId);
  //保存事件
  const onSubmit = async () => {
    let newData = {
      id: rowId,
      number: formState.number,
      name: formState.name,
      mainBy: formState.mainBy,
      phone: formState.phone,
      address: formState.address,
      bsStatus: formState.bsStatus,
      mark: formState.mark,
      stockInExamine: formState.stockInExamine,
      stockOutExamine: formState.stockOutExamine,
      createTime: formState.createTime,
      createBy: formState.createBy,
      updateTime: formState.updateTime,
      updateBy: formState.updateBy,
    };
    if (!rowId) {
      if (!formState.name || !formState.number) {
        createMessage.error('必填字段不能为空');
      } else {
        try {
          const addList = await addStockList({
            params: newData,
          });
          if (addList.id != null) {
            createMessage.success('添加成功');
            // back();
            showExam.value = true;
            rowId = addList.id;
            await getListById(rowId);
          }
        } catch (e) {
          console.log('失败', e);
        }
      }
    } else {
      newData.id = rowId;
      if (!formState.name || !formState.number) {
        createMessage.error('必填字段不能为空');
      } else {
        try {
          const updateList = async () => {
            await updateStockList({
              params: newData,
            });
          };
          await updateList();
          createMessage.success('修改成功');
          // back();
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
    const type = await VXETable.modal.confirm('您确定要审核当前物料吗?');
    if (type == 'confirm') {
      if (formState.labelValue === 'A' || formState.labelValue === '创建') {
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
          createMessage.success('审核成功');
          await getListById(rowId);
          // back();
        } catch (e) {
          console.log('失败', e);
        }
      }
    } else {
      createMessage.error('该物料已审核，无需再次审核');
      // back();
    }
  };
  //反审核功能
  const unExam = async () => {
    const type = await VXETable.modal.confirm('您确定要反审核当前物料吗?');
    if (type == 'confirm') {
      if (formState.labelValue === 'B' || formState.labelValue === '已审核') {
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
          await getListById(rowId);
          // back();
        } catch (e) {
          console.log('失败', e);
        }
      } else {
        createMessage.error('该物料已反审核，无需再次反审核');
        // back();
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
