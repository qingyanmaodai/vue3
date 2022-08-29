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
                <a-form-item label="仓位编码：" ref="number" name="number" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.number"
                    placeholder="请输入仓位编码"
                    :disabled="formState.bsStatus === 'B'"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="仓位名称：" ref="name" name="name" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.name"
                    name="name"
                    placeholder="请输入仓位名称"
                    :disabled="formState.bsStatus === 'B'"
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
                    @search="onStock('stock')"
                    @clear="onClear(['stockId', 'stockName', 'subStockId', 'subStockName'])"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item
                  label="所属分仓："
                  ref="subStockId"
                  name="subStockId"
                  class="item"
                >
                  <ExInput
                    autocomplete="off"
                    class="input"
                    placeholder="请选择所属分仓"
                    label="仓库"
                    :show="formState.bsStatus !== 'B'"
                    v-model:value="formState.subStockName"
                    :disabled="formState.bsStatus === 'B'"
                    @search="onStock('sub')"
                    @clear="onClear(['subStockId', 'subStockName'])"
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
      :modalType="modalType"
      @basicClickEvent="basicClickEvent"
      @searchList="searchList"
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
  import { BasicSearch } from '/@/components/AMoreSearch';
  import { unitGridOptions, stockColumns, subStockColumns } from '/@/components/AMoreSearch/data';
  import { useRoute, useRouter } from 'vue-router';
  import { config } from '/@/utils/publicParamConfig';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { getStockOption } from '/@/api/mainStock';
  import { getSubOption } from '/@/api/subStock';
  import { getPublicList } from '/@/api/public';
  import { cloneDeep } from 'lodash-es';
  import { VXETable } from 'vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    addStockLocationList,
    auditStockLocationList,
    getStockLocationListById,
    StockLocationProfileEntity,
    unAuditStockLocationList,
    updateStockLocationList,
  } from '/@/api/stockLocation';
  const { createMessage } = useMessage();
  const AForm = Form;
  const AFormItem = FormItem;
  const ACard = Card;
  const ATextArea = Input.TextArea;

  const router = useRouter();
  const activeKey = ref<string>('1');
  //弹窗类型
  let modalType = ref<string>('');
  const formRef = ref();
  //基础信息查询组件ref
  const basicSearchRef: any = ref<any>(undefined);
  //更新基础信息表头数据
  const getCurrentCols = (key: any) => {
    const colConfig = {
      stock: stockColumns,
      sub: subStockColumns,
    };
    return colConfig[key];
  };
  //选择对应的基本信息弹框
  let chosenModal: String = '';
  //初始化
  const formData: StockLocationProfileEntity = {
    id: undefined,
    number: '',
    name: '',
  };
  const formStateInit = reactive({
    data: formData,
  });
  let formState = toRef(formStateInit, 'data');

  const formRules = reactive({
    name: [{ required: true, message: '请输入仓位名称' }],
    number: [{ required: true, message: '请输入仓位编码' }],
    stockId: [{ required: true, message: '请输入所属仓库' }],
    subStockId: [{ required: true, message: '请输入所属分仓' }],
  });
  //点击清空图标清空事件
  const onClear = (key: string[]) => {
    key.forEach((e) => {
      formState.value[e] = '';
    });
  };
  //获取仓库字段
  const getStockOps = async (key) => {
    if (key == 'stock') {
      try {
        let arr: any = [];
        let data = await getStockOption({ params: '' });
        arr = cloneDeep(data);
        arr = arr.filter((e) => e.fieldName != 'bs_status');
        basicSearchRef.value.init(arr);
      } catch (e) {
        console.log('获取仓库选项字段失败', e);
      }
    } else if (key == 'sub') {
      try {
        let arr: any = [];
        let data = await getSubOption({ params: '' });
        arr = cloneDeep(data);
        arr = arr.filter((e) => e.fieldName != 'stock_id' && e.fieldName != 'bs_status');
        basicSearchRef.value.init(arr);
      } catch (e) {
        console.log('获取分仓选项字段失败', e);
      }
    }
  };
  //弹窗类型
  let queryStockParam = reactive({
    subStock: {},
    stockLocation: {},
    subStockName: {},
    stockName: {},
  });
  //输入框点击放大镜事件
  const onStock: any = async (key) => {
    let q = {};
    await getStockOps(key);
    modalType.value = key;
    const res: any = await getPublicList(
      {
        params: [
          q,
          {
            table: '',
            name: 'bsStatus',
            column: 'bs_status',
            link: 'AND',
            rule: 'EQ',
            type: 'string',
            val: 'B',
            startWith: '',
            endWith: '',
          },
        ],
      },
      config.PUBLIC_REQUEST_URL[key],
    );
    chosenModal = key;
    let dataCols = getCurrentCols(key);
    let dataList = res;
    basicSearchRef.value.bSearch(true);
    basicSearchRef.value.initCols(dataCols);
    basicSearchRef.value.initList(dataList);
    basicSearchRef.value.initSearch(key);
    return res;
  };

  //选择仓库后查询——联动
  //key:在待用url中选择的
  //colName:需要查询的名字，如编码，名称。。。
  //id:输入的值
  const getNextStock = async (key, colName, id) => {
    const res: any = await getPublicList(
      {
        params: [
          {
            table: '',
            name: colName,
            column: colName,
            link: 'AND',
            rule: 'LIKE',
            type: 'number',
            val: id,
            startWith: '',
            endWith: '',
          },
        ],
      },
      config.PUBLIC_REQUEST_URL[key],
    );
    return res;
  };
  //双击单元格选择事件——获取双击所选的值并赋值到对应字段
  const basicClickEvent = async (row) => {
    switch (chosenModal) {
      case 'stock':
        formState.value.stockId = row.id;
        formState.value.stockName = row.name;
        queryStockParam.subStock = {
          table: '',
          name: 'stockId',
          column: 'stock_id',
          link: 'AND',
          rule: 'EQ',
          type: 'string',
          val: row.id,
          startWith: '',
          endWith: '',
        };
        await getNextStock('stock', 'formState.stockId', formState.value.stockId);
        break;
      case 'sub':
        formState.value.subStockId = row.id;
        formState.value.subStockName = row.name;
        const stockByStock = await getNextStock('stock', 'id', row.stockId);
        formState.value.stockId = stockByStock.records[0].id;
        formState.value.stockName = stockByStock.records[0].name;
        break;
    }
    basicSearchRef.value.bSearch(false);
  };

  //接受参数
  let rowId = useRoute().query.row?.toString() || '';

  //搜索功能
  const searchList = async (type, keywords) => {
    let param: any = [];
    param.push(keywords);
    if (type == 'sub') {
      param.push(queryStockParam.subStock);
    }
    basicSearchRef.value.initList(
      await getPublicList(
        {
          params: param,
        },
        config.PUBLIC_REQUEST_URL[type],
      ),
    );
  };
  //获取初始值
  const getListById = async (rowId) => {
    if (rowId) {
      const res: any = await getStockLocationListById({
        params: rowId,
      });
      formState.value = res;
      if (formState.value.subStockId) {
        formState.value.subStockId = res.bdSubStock.id;
        formState.value.subStockName = res.bdSubStock.name;
        queryStockParam.stockLocation = {
          table: '',
          name: 'subStockId',
          column: 'sub_stock_id',
          link: 'AND',
          rule: 'EQ',
          type: 'string',
          val: res.bdSubStock.id,
          startWith: '',
          endWith: '',
        };
      }
      if (formState.value.stockId) {
        formState.value.stockId = res.bdStock.id;
        formState.value.stockName = res.bdStock.name;
      }
    }
  };
  getListById(rowId);
  //保存事件
  const onSubmit = async () => {
    let data;
    formRef.value
      .validate()
      .then(async () => {
        if (!formState.value.id) {
          data = await addStockLocationList({ params: formState.value });
        } else {
          data = await updateStockLocationList({ params: formState.value });
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
          const data = await auditStockLocationList({ params: formState.value });
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
      const data = await unAuditStockLocationList({ params: formState.value });
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
