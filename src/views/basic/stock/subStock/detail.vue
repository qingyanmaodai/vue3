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
                <a-form-item label="分仓编码：" ref="number" name="number" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.number"
                    placeholder="请输入分仓编码"
                    :disabled="formState.bsStatus === 'B'"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="分仓名称：" ref="name" name="name" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.name"
                    name="name"
                    placeholder="请输入分仓名称"
                    :disabled="formState.bsStatus === 'B'"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item
                  label="所属仓库："
                  ref="stockId"
                  name="stockId"
                  class="item"
                >
                  <ExInput
                    autocomplete="off"
                    class="input"
                    placeholder="请选择所属仓库"
                    label="仓库"
                    :show="formState.bsStatus !== 'B'"
                    v-model:value="formState.stockName"
                    :disabled="formState.bsStatus === 'B'"
                    @search="onStock()"
                    @clear="onClear(['stockId', 'stockName'])"
                  />
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="负责人：" ref="mainBy" name="mainBy" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.mainBy"
                    name="name"
                    placeholder="请输入负责人"
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
                    placeholder="请输入联系电话"
                    :disabled="formState.bsStatus === 'B'"
                    onkeyup="value=value.replace(/[^\d\-]/g,'')"
                    :maxlength="20"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="地址：" ref="address" name="address" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.address"
                    name="name"
                    placeholder="请输入地址"
                    :disabled="formState.bsStatus === 'B'"
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
    </a-card>
    <BasicSearch
      @basicClickEvent="basicClickEvent"
      @openSearch="openSearch"
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
    LayoutHeader,
    Row,
    TabPane,
    Tabs,
  } from 'ant-design-vue';
  import { ExInput } from '/@/components/ExInput';
  import { RollbackOutlined } from '@ant-design/icons-vue';
  import { useRoute, useRouter } from 'vue-router';
  import { VXETable } from 'vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    addSubStockList,
    auditSubStockList,
    getSubStockListById,
    SubStockProfileEntity,
    unAuditSubStockList,
    updateSubStockList,
  } from '/@/api/subStock';
  import { unitGridOptions, stockColumns } from '/@/components/AMoreSearch/data';
  import { BasicSearch } from '/@/components/AMoreSearch';
  import { cloneDeep } from 'lodash-es';
  import { config } from '/@/utils/publicParamConfig';
  import { getStockOption, getStockTable } from '/@/api/mainStock';
  import { SearchDataType, SearchLink, SearchMatchType } from '/@/api/apiLink';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';

  const { createMessage } = useMessage();
  const AForm = Form;
  const AFormItem = FormItem;
  const ACard = Card;
  const ATextArea = Input.TextArea;

  const router = useRouter();
  const activeKey = ref<string>('1');
  const formRef = ref();
  //基础信息查询组件ref
  const basicSearchRef: any = ref(null);

  const formRules = reactive({
    name: [{ required: true, message: '请输入分仓名称' }],
    number: [{ required: true, message: '请输入分仓编码' }],
    stockId: [{ required: true, message: '请输入所属仓库' }],
  });
  //初始化
  const formData: SubStockProfileEntity = {
    id: undefined,
    number: '',
    name: '',
  };
  const formStateInit = reactive({
    data: formData,
  });
  let formState = toRef(formStateInit, 'data');

  //打开基本信息弹框
  const openSearch = async () => {
    const res = await onStock();
    basicSearchRef.value.initList(res);
  };

  //接受参数
  let rowId = useRoute().query.row?.toString() || '';

  //获取初始值
  const getListById = async (rowId) => {
    if (rowId) {
      const res: any = await getSubStockListById({ params: rowId });
      formState.value = res;
      if (res.bdStock) {
        formState.value.stockId = res.bdStock.id;
        formState.value.stockName = res.bdStock.name;
      }
    }
  };
  getListById(rowId);
  //点击清空图标清空事件
  const onClear = (key: string[]) => {
    key.forEach((e) => {
      formState.value[e] = '';
    });
  };
  //打开放大镜
  const onStock = async () => {
    const res: any = await getStockTable({
      params: [
        {
          table: '',
          name: 'bsStatus',
          column: 'bs_status',
          link: SearchLink.AND,
          rule: SearchMatchType.EQ,
          type: SearchDataType.string,
          val: 'B',
          startWith: '',
          endWith: '',
        },
      ],
    });
    let data = res;
    basicSearchRef.value.bSearch(true);
    basicSearchRef.value.initList(data);
    basicSearchRef.value.initCols(stockColumns);
    await getStockTableOption();
    return res;
  };
  //获取基本信息字段
  const getStockTableOption = async () => {
    try {
      let arr: any = [];
      let data = await getStockOption({ params: '' });
      arr = cloneDeep(data);
      arr = arr.filter((e) => e.fieldName != 'bs_status');
      basicSearchRef.value.init(arr);
    } catch (e) {
      console.log('获取基本信息字段失败', e);
    }
  };
  //基本信息表格双击事件
  const basicClickEvent = (row) => {
    formState.value.stockId = row.id;
    formState.value.stockName = row.name;
    basicSearchRef.value.bSearch(false);
  };

  //保存事件
  const onSubmit = async () => {
    let data;
    formRef.value
      .validate()
      .then(async () => {
        if (!formState.value.id) {
          data = await addSubStockList({ params: formState.value });
        } else {
          data = await updateSubStockList({ params: formState.value });
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
        const type = await VXETable.modal.confirm('您确定要保存并审核当前数据吗?');
        if (type === 'confirm') {
          const data = await auditSubStockList({ params: formState.value });
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
    const type = await VXETable.modal.confirm('您确定要反审核当前数据吗?');
    if (type === 'confirm') {
      const data = await unAuditSubStockList({ params: formState.value });
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
