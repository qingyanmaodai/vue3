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
                <a-form-item label="仓位编码：" ref="number" name="number" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.number"
                    placeholder="请输入仓位编码"
                    :disabled="hasId"
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
                    :disabled="showUnExam"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="负责人：" ref="principal" name="principal" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.principal"
                    name="name"
                    placeholder="请输入负责人"
                    :disabled="showUnExam"
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
                  v-model:value="formState.stockId"
                >
                  <ExInput
                    autocomplete="off"
                    class="input"
                    placeholder="请选择所属仓库"
                    label="仓库"
                    :show="showUnExam"
                    v-model:value="formState.stockName"
                    :disabled="showUnExam"
                    @search="onStock('stock')"
                    @clear="onClear('stock')"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item
                  label="所属分仓："
                  ref="subStockId"
                  name="subStockId"
                  class="item"
                  v-model:value="formState.subStockId"
                >
                  <ExInput
                    autocomplete="off"
                    class="input"
                    placeholder="请选择所属分仓"
                    label="仓库"
                    :show="showUnExam"
                    v-model:value="formState.subStockName"
                    :disabled="hasSub"
                    @search="onStock('sub')"
                    @clear="onClear('sub')"
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
    <BasicSearch
      style="top: 20px"
      :modalType="modalType"
      @cellClickEvent="cellClickEvent"
      @searchList="searchList"
      title="基础信息查询"
      ref="basicSearchRef"
      :gridOptions="unitGridOptions"
    />
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
  import { ExInput } from '/@/components/ExInput';
  import { RollbackOutlined } from '@ant-design/icons-vue';
  import { BasicSearch } from '/@/components/AMoreSearch';
  import { unitGridOptions, stockColumns, subStockColumns } from '/@/components/AMoreSearch/data';
  import { useRoute, useRouter } from 'vue-router';
  import { config } from '/@/utils/publicParamConfig';
  import { getPublicList, getStockOption, getSubOption } from '/@/api/matTable';
  import { cloneDeep } from 'lodash-es';
  import { VXETable } from 'vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    addStockLocationList,
    auditStockLocationList,
    getStockLocationListById,
    unAuditStockLocationList,
    updateStockLocationList,
  } from '/@/api/stockLocation';
  const { createMessage } = useMessage();
  const AForm = Form;
  const AFormItem = FormItem;
  const ACard = Card;

  const router = useRouter();
  //空参数
  const paramsNull = { params: '' };
  //整个基本信息 v-model:activeKey="activeKey"
  const activeKey = ref<string>('1');
  //弹窗类型
  let modalType = ref<string>('');
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
  //审核状态
  const hasSub = ref<boolean>(false); //分仓
  const showUnExam = ref<boolean>(false); //反审核
  const showExam = ref<boolean>(false); //审核
  const showSubmit = ref<boolean>(true); //保存

  //对应输入框绑定的值接口类型
  interface FormState {
    id?: string | undefined;
    number: string | undefined;
    name: string | undefined;
    principal: string | undefined;
    phone: string | undefined;
    shortName: string | undefined;
    model: string | undefined;
    bsStatus: string | undefined;
    labelValue: string | undefined;
    mark: string | undefined;
    stockId: string | undefined;
    stockName: string | undefined;
    bdStock: string | undefined;
    subStockId: string | undefined;
    subStockName: string | undefined;
    bdSubStock: string | undefined;
    stockInExamine: number | undefined;
    stockOutExamine: number | undefined;
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
    shortName: undefined,
    principal: undefined,
    phone: undefined,
    model: undefined,
    bsStatus: 'A',
    labelValue: undefined,
    mark: undefined,
    bdStock: undefined,
    bdSubStock: undefined,
    stockId: undefined,
    stockName: undefined,
    subStockId: undefined,
    subStockName: undefined,
    stockInExamine: undefined,
    stockOutExamine: undefined,
    updateBy: undefined,
    updateTime: undefined,
    createBy: undefined,
    createTime: undefined,
  });

  const formRules = reactive({
    name: [{ required: true, message: '请输入仓位名称' }],
    number: [{ required: true, message: '请输入仓位编码' }],
    stockId: [{ required: true, message: '请输入所属仓库' }],
    subStockId: [{ required: true, message: '请输入所属分仓' }],
  });

  //点击清空图标清空事件
  const onClear = (key: string) => {
    switch (key) {
      case 'stock':
        formState.stockId = '';
        formState.stockName = '';
        formState.subStockId = '';
        formState.subStockName = '';
        break;
      case 'sub':
        formState.subStockId = '';
        formState.subStockName = '';
        break;
    }
  };
  //获取仓库字段
  const getStockOps = async (key) => {
    if (key == 'stock') {
      try {
        let data = await getStockOption(paramsNull);
        basicSearchRef.value.init(data);
      } catch (e) {
        console.log('获取仓库选项字段失败', e);
      }
    } else if (key == 'sub') {
      try {
        let arr: any = [];
        let data = await getSubOption(paramsNull);
        arr = cloneDeep(data);
        arr = arr.filter((e) => e.fieldName != 'stock_id');
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
  const cellClickEvent = async (row) => {
    switch (chosenModal) {
      case 'stock':
        formState.stockId = row.id;
        formState.stockName = row.name;
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
        await getNextStock('stock', 'formState.stockId', formState.stockId);
        break;
      case 'sub':
        formState.subStockId = row.id;
        formState.subStockName = row.name;
        queryStockParam.stockLocation = {
          table: '',
          name: 'subStockId',
          column: 'sub_stock_id',
          link: 'AND',
          rule: 'EQ',
          type: 'string',
          val: row.id,
          startWith: '',
          endWith: '',
        };
        const stockByStock = await getNextStock('stock', 'id', row.stockId);
        formState.stockId = stockByStock.records[0].id;
        formState.stockName = stockByStock.records[0].name;
        break;
    }
    basicSearchRef.value.bSearch(false);
    if (formState.stockId) {
      hasSub.value = false;
    }
  };

  let getParams = () => {
    let query = router.currentRoute.value.query;
    console.log('query', query);
  };
  getParams();

  //接受参数
  let rowId = useRoute().query.row?.toString();
  let hasId = ref<boolean>(false);
  console.log('编辑id', rowId);

  //如果有id，则通过接口，进入编辑页面。没有id——新增
  const getListById = async (id) => {
    if (rowId) {
      id = rowId;
      hasId.value = true;
    }
    const res: any = await getStockLocationListById({
      params: id,
    });
    console.log('jkikjkjk--id', rowId);
    console.log('jkikjkjk--res', res);
    formState.number = res.number;
    formState.name = res.name;
    formState.shortName = res.shortName;
    formState.model = res.model;
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
      hasSub.value = true;
    }
    if (formState.bsStatus === 'A') {
      formState.labelValue = '创建';
    } else {
      formState.labelValue = '已审核';
    }
    formState.mark = res.mark;
    formState.stockId = res.stockId;
    if (formState.stockId) {
      formState.stockId = res.bdStock.id;
      formState.stockName = res.bdStock.name;
      queryStockParam.subStock = {
        table: '',
        name: 'stockId',
        column: 'stock_id',
        link: 'AND',
        rule: 'EQ',
        type: 'string',
        val: res.bdStock.id,
        startWith: '',
        endWith: '',
      };
    }
    formState.bdStock = res.bdStock;
    formState.subStockId = res.subStockId;
    if (formState.subStockId) {
      formState.subStockId = res.bdSubStock.id;
      formState.subStockName = res.bdSubStock.name;
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
    formState.bdSubStock = res.bdSubStock;
    formState.stockInExamine = res.stockInExamine;
    formState.stockOutExamine = res.stockOutExamine;
    formState.createTime = res.createTime;
    formState.createBy = res.createBy;
    formState.updateTime = res.updateTime;
    formState.updateBy = res.updateBy;
  };
  getListById(rowId);
  // const stockHandle = async () => {
  //   //修改
  //   if (rowId) {
  //     await getListById(rowId);
  //     if (formState.bsStatus == 'B') {
  //       hasSub.value = true;
  //     }
  //   }
  // };
  // stockHandle();
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
  //保存事件
  const onSubmit = async () => {
    let newData = {
      id: rowId,
      number: formState.number,
      name: formState.name,
      shortName: formState.shortName,
      model: formState.model,
      bsStatus: formState.bsStatus,
      mark: formState.mark,
      stockName: formState.stockName,
      stockId: formState.stockId,
      subStockId: formState.subStockId,
      subStockName: formState.subStockName,
      stockInExamine: formState.stockInExamine,
      stockOutExamine: formState.stockOutExamine,
      createTime: formState.createTime,
      createBy: formState.createBy,
      updateTime: formState.updateTime,
      updateBy: formState.updateBy,
    };
    if (!rowId) {
      if (!formState.name || !formState.number || !formState.stockId || !formState.subStockId) {
        createMessage.error('必填字段不能为空');
      } else {
        try {
          const addList = await addStockLocationList({
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
      if (!formState.name || !formState.number || !formState.stockId || !formState.subStockId) {
        createMessage.error('必填字段不能为空');
      } else {
        try {
          const updateList = async () => {
            await updateStockLocationList({
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
            await auditStockLocationList({
              params: {
                id: rowId,
              },
            });
          };
          await auditEvent();
          showSubmit.value = false;
          showExam.value = false;
          showUnExam.value = true;
          hasSub.value = true;
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
            await unAuditStockLocationList({
              params: {
                id: rowId,
              },
            });
          };
          await unAuditEvent();
          showSubmit.value = true;
          showExam.value = true;
          showUnExam.value = false;
          hasSub.value = false;
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
