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
      <a-splitpanes class="default-theme" horizontal>
        <pane :size="paneSize" style="background-color: #fff">
          <Tabs v-model:activeKey="activeKey" class="tabs">
            <TabPane key="1" tab="基本信息">
              <a-form ref="formRef" :model="formState" :rules="formRules">
                <Row>
                  <Col :span="8">
                    <a-form-item label="单据编号：" ref="number" name="number" class="item">
                      <Input
                        allowClear
                        class="input"
                        autocomplete="off"
                        v-model:value="formState.number"
                        placeholder="保存后自动生成"
                        disabled
                      />
                    </a-form-item>
                  </Col>
                  <Col :span="8">
                    <a-form-item
                      label="生产订单编号："
                      ref="proMoNumber"
                      name="proMoNumber"
                      class="item"
                    >
                      <Input class="input" v-model:value="formState.proMoNumber" disabled />
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
                        disabled
                      />
                    </a-form-item>
                  </Col>
                </Row>
                <Row>
                  <Col :span="8">
                    <a-form-item
                      label="产品编号："
                      ref="moMatNumber"
                      name="moMatNumber"
                      class="item"
                    >
                      <Input class="input" v-model:value="formState.moMatNumber" disabled />
                    </a-form-item>
                  </Col>
                  <Col :span="8">
                    <a-form-item label="产品订单数量：" ref="proMoNum" name="proMoNum" class="item">
                      <Input class="input" v-model:value="formState.proMoNum" disabled />
                    </a-form-item>
                  </Col>
                  <Col :span="8">
                    <a-form-item label="生产工单行号：" ref="moSeq" name="moSeq" class="item">
                      <Input class="input" v-model:value="formState.moSeq" disabled />
                    </a-form-item>
                  </Col>
                </Row>
                <Row>
                  <Col :span="8">
                    <a-form-item label="业务日期：" ref="bsDate" name="bsDate" class="item">
                      <a-date-picker
                        :showToday="false"
                        class="select"
                        valueFormat="YYYY-MM-DD HH:mm:ss"
                        format="YYYY-MM-DD"
                        v-model:value="formState.bsDate"
                        :disabled="formState.bsStatus === 'B'"
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
                      <Input
                        class="input"
                        v-model:value="formState.updateBy"
                        disabled
                      /> </a-form-item
                  ></Col>
                </Row>
              </a-form>
            </TabPane>
          </Tabs>
        </pane>
        <pane :size="100 - paneSize">
          <ExDetailTable
            :columns="warProBomOfDetailColumns"
            :gridOptions="DetailOfExaGridOptions"
            :editRules="formDataRules"
            ref="detailTableRef"
            @clearDetailTableEvent="clearDetailTableEvent"
            @cellClickTableEvent="cellClickTableEvent"
            @setDefaultTableData="setDefaultTableData"
            @filterEvent="filterEvent"
            :detailTableData="detailTableData"
            :isShowIcon="formState.bsStatus !== 'B'"
            :isDisableButton="formState.bsStatus === 'B'"
          />
        </pane>
      </a-splitpanes>
    </div>
    <ExFilterModal
      ref="filterModalRef"
      @filterModalSearchEvent="filterModalSearchEvent"
      tableName="BdMaterial"
    />
  </div>
</template>
<script lang="ts" setup name="warehouse-produce-bom-detail">
  import {
    detailOfExaGridOptions,
    warProBomOfDetailColumns,
  } from '/@/components/ExDetailTable/data';
  import { onMounted, reactive, ref, toRef } from 'vue';
  import {
    Button,
    Col,
    Form,
    FormItem,
    Input,
    LayoutHeader,
    Row,
    DatePicker,
    TabPane,
    Tabs,
  } from 'ant-design-vue';
  import { Pane, Splitpanes } from 'splitpanes';
  import 'splitpanes/dist/splitpanes.css';
  import { ExDetailTable } from '/@/components/ExDetailTable';
  import { RollbackOutlined } from '@ant-design/icons-vue';
  import { useRoute, useRouter } from 'vue-router';
  import { add, audit, unAudit, getOneById, produceBomEntity } from '/@/api/warProduce/bom';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { config } from '/@/utils/publicParamConfig';
  import { VXETable } from 'vxe-table';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { cloneDeep } from 'lodash-es';
  import moment from 'moment';
  import { SearchParams } from '/@/api/apiLink';
  import { getMatTable, getMatTableById } from '/@/api/matTable';

  const { createMessage } = useMessage();
  const ASplitpanes = Splitpanes;
  const ADatePicker = DatePicker;
  const DetailOfExaGridOptions = detailOfExaGridOptions;
  const paneSize = ref<number>(50);
  const AForm = Form;
  const AFormItem = FormItem;
  const ATextArea = Input.TextArea;
  const router = useRouter();
  const formRef = ref();
  const activeKey = ref<string>('1');
  const detailTableRef: any = ref<String | null>(null);
  const detailTableData: any = ref<object[]>([]); //表格数据

  //获取当前时间
  const getCurrentData = () => {
    return new Date().toLocaleDateString();
  };
  //输入框默认值
  const formData: produceBomEntity = {
    id: undefined,
    number: '',
    way: 'A',
    moId: undefined,
    bsDate: moment(getCurrentData(), 'YYYY-MM-DD'),
  };

  //初始化
  const formStateInit = reactive({
    data: formData,
  });
  // 明细表表头名
  const formState = toRef(formStateInit, 'data');
  const formRules = reactive({});
  const formDataRules = reactive({
    'bdMaterial.number': [{ required: true, message: '请选择物料信息' }],
    num: [{ required: true, message: '请输入数量' }],
  });
  //筛选条件弹框组件
  const filterEvent = () => {
    filterModalRef.value.show();
  };
  //筛选弹框组件ref
  import { ExFilterModal } from '/@/components/ExFilterModal';
  const filterModalRef: any = ref<any>(undefined);
  const filterModalParams = (): SearchParams[] => {
    return filterModalRef.value.getSearchParams();
  };
  //筛选条件查询
  const filterModalSearchEvent = async (currPage = 1, pageSize = 1000000) => {
    let getParams: SearchParams[] = [];
    if (filterModalParams() && filterModalParams().length > 0) {
      getParams = getParams.concat(filterModalParams());
    }
    const res: any = await getMatTable({
      params: getParams,
      orderByBean: {
        descList: ['BdMaterial.update_time'],
      },
      pageIndex: currPage,
      pageRows: pageSize,
    });
    let bdMaterial = res.records.map((item) => {
      return Object.assign(
        {},
        {
          id: item.id,
          name: item.name,
          number: item.number,
          model: item.model,
          baseUnitName: item.baseUnit.name,
          weightUnitName: item.weightUnit.name,
          baseUnitId: item.baseUnit.id,
          weightUnitId: item.weightUnit.id,
        },
      );
    });
    res.records.forEach((item, index) => {
      item.bdMaterial = bdMaterial[index];
      item.matId = item.id;
    });
    formState.value.dtData = cloneDeep(res.records);
    await setDataStatus();
    detailTableData.value = cloneDeep(formState.value.dtData);
  };
  //保存
  const onSubmit = async () => {
    formRef.value
      .validate()
      .then(async () => {
        const tableFullData = detailTableRef.value.getDetailData();
        const validAllErrMapData = await detailTableRef.value.getValidAllData();
        if (tableFullData) {
          if (validAllErrMapData) {
            createMessage.error('明细表数据校检不通过，请检查!');
            return;
          }
          if (!formState.value.pushDownStatus) {
            if (
              tableFullData.some(
                (e) => tableFullData.filter((e1) => e1.matId === e.matId).length > 1,
              )
            ) {
              createMessage.error('明细表存在相同数据，请检查!');
              return;
            }
          }
          formState.value.dtData = cloneDeep(tableFullData);
        }
        //保存：新增+更新
        formState.value = await add({ params: formState.value });
        await setDataStatus();
        detailTableData.value = cloneDeep(formState.value.dtData);
        createMessage.success('操作成功');
      })
      .catch((error: ValidateErrorEntity<FormData>) => {
        console.log(error);
        if (error.errorFields) {
          createMessage.error('数据校检不通过，请检查!');
        }
      });
  };
  //审核
  const onAudit = async () => {
    formRef.value
      .validate()
      .then(async () => {
        const type = await VXETable.modal.confirm('您确定要保存并审核吗?');
        if (type === 'confirm') {
          const tableFullData = detailTableRef.value.getDetailData();
          const validAllErrMapData = await detailTableRef.value.getValidAllData();
          if (tableFullData) {
            if (validAllErrMapData) {
              createMessage.error('明细表数据校检不通过，请检查!');
              return;
            }
            if (!formState.value.pushDownStatus) {
              if (
                tableFullData.some(
                  (e) => tableFullData.filter((e1) => e1.matId === e.matId).length > 1,
                )
              ) {
                createMessage.error('明细表存在相同数据，请检查!');
                return;
              }
            }
            formState.value.dtData = cloneDeep(tableFullData);
          }
          formState.value = await audit({ params: formState.value });
          await setDataStatus();
          detailTableData.value = cloneDeep(formState.value.dtData);
          createMessage.success('操作成功');
        }
      })
      .catch((error: ValidateErrorEntity<FormData>) => {
        console.log(error);
        if (error.errorFields) {
          createMessage.error('数据校检不通过，请检查!');
        }
      });
  };
  //反审核
  const onUnAudit = async () => {
    const type = await VXETable.modal.confirm('您确定要反审核吗?');
    if (type === 'confirm') {
      const tableFullData = detailTableRef.value.getDetailData();
      if (tableFullData) {
        formState.value.dtData = cloneDeep(tableFullData);
      }
      formState.value = await unAudit({ params: formState.value });
      await setDataStatus();
      detailTableData.value = cloneDeep(formState.value.dtData);
      createMessage.success('操作成功');
    }
  };
  //返回上一页
  const back = () => {
    router.go(-1);
  };

  //获取初始值
  const getListById = async () => {
    if (useRoute().query.row) {
      let dataId = useRoute().query.row?.toString() || '';
      const res: any = await getOneById({ params: dataId });
      formState.value = res;
    } else if (useRoute().params.pushDownParam) {
      formState.value = JSON.parse(useRoute().params.pushDownParam as string);
    } else if (useRoute().params.createOrderParam) {
      formState.value = JSON.parse(useRoute().params.createOrderParam as string); //查询用料清单
    }
    await setDataStatus();
    detailTableData.value = cloneDeep(formState.value.dtData);
  };

  //明细表清空事件
  const clearDetailTableEvent = (data, column) => {
    if (column.field === 'bdMaterial.number') {
      data.countNum = '';
      for (const key in column.params.param) {
        data[key] = '';
        data[column.params.param[key]] = {};
      }
    } else {
      for (const key in column.params.param) {
        data[key] = '';
        data[column.params.param[key]] = {};
      }
    }
  };

  //双击赋值事件
  const cellClickTableEvent = async (row, data, column) => {
    switch (column) {
      case 'bdMaterial':
        const res: any = await getMatTableById({
          params: row.id,
        });
        data.matId = res.id ? res.id : null;
        data.bdMaterial = res;
        data.bdMaterial.baseUnitName = res.baseUnit ? res.baseUnit.name : null;
        data.bdMaterial.weightUnitName = res.weightUnit ? res.weightUnit.name : null;
        break;
    }
  };
  //新增行时设置默认值
  const setDefaultTableData = (obj) => {
    obj.seq = obj.sort;
  };
  //dtData状态赋值
  const setDataStatus = () => {
    if (formState.value.dtData) {
      formState.value.dtData.map((r) => {
        r.bsStatus = formState.value.bsStatus;
      });
    }
  };
  onMounted(() => {
    getListById();
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
    height: calc(100% - 80px);
    background-color: #fff;
    padding: 10px;
  }
  .default-theme {
    //height: calc(100% - 80px);
  }
  :deep(.vxe-grid) {
    font-size: 14px;
    height: 100%;
  }
  .button {
    margin: 15px;
  }
</style>
