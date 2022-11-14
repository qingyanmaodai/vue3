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
        <Button danger class="button" @click="onExam" v-if="formState.bsStatus === 'A'"
          >审核</Button
        >
        <Button danger class="button" @click="unExam" v-if="formState.bsStatus === 'B'"
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
                <a-form-item label="分仓编码：" ref="number" name="number" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.number"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请输入分仓编码'"
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
                    :placeholder="formState.bsStatus === 'B' ? '' : '请输入分仓名称'"
                    :disabled="formState.bsStatus === 'B'"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="所属仓库：" ref="stockId" name="stockId" class="item">
                  <ExInput
                    autocomplete="off"
                    class="input"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请选择所属仓库'"
                    label="仓库"
                    :show="!formState.bsStatus"
                    v-model:value="formState.bdStock"
                    :disabled="formState.bsStatus === 'B' || formState.bsStatus === 'A'"
                    @search="
                      onSearch('GET_STOCK_DTO', 'BdStock', Url.GET_PAGE_STOCK_LIST, [
                        'stockId',
                        'bdStock',
                      ])
                    "
                    @clear="onClear(['stockId', 'bdStock'])"
                  />
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="负责人：" ref="empId" name="empId" class="item">
                  <ExInput
                    autocomplete="off"
                    class="input"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请选择责任人'"
                    label="责任人"
                    :show="formState.bsStatus !== 'B'"
                    v-model:value="formState.bdEmployee"
                    :disabled="formState.bsStatus === 'B'"
                    @search="
                      onSearch('GET_EMPLOYEE_DTO', 'bdEmployee', Url.EMPLOYEE_GET_DATA, [
                        'empId',
                        'bdEmployee',
                      ])
                    "
                    @clear="onClear(['empId', 'bdEmployee'])"
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
                    :placeholder="formState.bsStatus === 'B' ? '' : '请输入联系电话'"
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
                    :placeholder="formState.bsStatus === 'B' ? '' : '请输入地址'"
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
    <BasicSearch
      @basicClickEvent="basicClickEvent"
      :gridOptions="basicGridOptions"
      ref="basicSearchRef"
      :control="basicControl"
      :tableCols="basicTableCols"
      :tableName="basicTableName"
    />
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
    TabPane,
    Tabs,
  } from 'ant-design-vue';
  import { ExInput } from '/@/components/ExInput';
  import { RollbackOutlined } from '@ant-design/icons-vue';
  import { useRoute, useRouter } from 'vue-router';
  import { VXETable } from 'vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    addStockCompartmentList,
    auditStockCompartmentList,
    getStockCompartmentListById,
    StockCompartmentEntity,
    unAuditStockCompartmentList,
    updateStockCompartmentList,
  } from '/@/api/stockCompartment';
  import { basicGridOptions } from '/@/components/AMoreSearch/data';
  import { BasicSearch } from '/@/components/AMoreSearch';
  import { config } from '/@/utils/publicParamConfig';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { getPublicList } from '/@/api/public';
  import { ControlSet, TableColum, Url } from '/@/api/apiLink';
  import { VxeGridPropTypes } from 'vxe-table/types/all';

  const { createMessage } = useMessage();
  const AForm = Form;
  const AFormItem = FormItem;
  const ATextArea = Input.TextArea;

  const router = useRouter();
  const activeKey = ref<string>('1');
  const formRef = ref();
  //基础信息查询组件ref
  const basicSearchRef: any = ref<any>(undefined);
  const basicControl = ref<ControlSet[]>(); //下拉框
  const basicTableCols = ref<VxeGridPropTypes.Columns[]>([]); //表头
  const basicTableName = ref<string>(''); //表格数据
  const formRules = reactive({
    name: [{ required: true, message: '请输入分仓名称' }],
    number: [{ required: true, message: '请输入分仓编码' }],
    stockId: [{ required: true, message: '请输入所属仓库' }],
  });
  //初始化
  const formData: StockCompartmentEntity = {
    id: undefined,
    number: '',
    name: '',
  };
  const formStateInit = reactive({
    data: formData,
  });
  let formState = toRef(formStateInit, 'data');

  //接受参数
  let rowId = useRoute().query.row?.toString() || '';

  //获取初始值
  const getListById = async () => {
    if (rowId) {
      const res: any = await getStockCompartmentListById({ params: rowId });
      formState.value = res;
    }
  };
  getListById();

  //点击清空图标清空事件
  const onClear = (key: string[]) => {
    key.forEach((e) => {
      formState.value[e] = undefined;
    });
  };
  let currDataParam: string[] = []; //约定数组下标0为数据ID，1为数据包
  /**
   * 基础资料弹窗
   * @param dtoUrlConfig  获取基础资料查询链接属性
   * @param tableName  指向的表名根据DTO链接可以查询到
   * @param tableUrl  表格列表数据链接
   * @param dataParam 当前选中的数据包
   */
  const onSearch: any = async (
    dtoUrlConfig: string,
    tableName: string,
    tableUrl: string,
    dataParam: string[],
  ) => {
    currDataParam = dataParam;
    basicSearchRef.value.show();
    const res = await getPublicList({ params: [] }, Url[dtoUrlConfig]);
    basicControl.value = res as ControlSet[];
    basicTableCols.value = TableColum[dtoUrlConfig];
    basicTableName.value = tableName;
    await basicSearchRef.value.init(tableUrl);
  };
  /**
   * 基础资料弹框双击选择事件
   * @param row
   */
  const basicClickEvent = async (row) => {
    basicSearchRef.value.close();
    formState.value[currDataParam[0]] = row.id;
    formState.value[currDataParam[1]] = {};
    formState.value[currDataParam[1]].id = row.id;
    formState.value[currDataParam[1]].name = row.name;
  };

  //保存事件
  const onSubmit = async () => {
    let data;
    formRef.value
      .validate()
      .then(async () => {
        if (!formState.value.id) {
          data = await addStockCompartmentList({ params: formState.value });
        } else {
          data = await updateStockCompartmentList({ params: formState.value });
        }
        formState.value = Object.assign({}, formState.value, data);
        createMessage.success('操作成功');
      })
      .catch((error: ValidateErrorEntity<FormData>) => {
        console.log(error);
        if(error.errorFields) {
          createMessage.error('数据校检不通过，请检查!');
        }
      });
  };

  //审核功能
  const onExam = async () => {
    formRef.value
      .validate()
      .then(async () => {
        const type = await VXETable.modal.confirm('您确定要保存并审核当前数据吗?');
        if (type === 'confirm') {
          const data = await auditStockCompartmentList({ params: formState.value });
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
  //反审核功能
  const unExam = async () => {
    const type = await VXETable.modal.confirm('您确定要反审核当前数据吗?');
    if (type === 'confirm') {
      const data = await unAuditStockCompartmentList({ params: formState.value });
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
    height: calc(100% - 80px);
    background-color: #fff;
    padding: 10px;
  }
  .button {
    margin: 15px;
  }
</style>
