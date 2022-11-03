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
                    <a-form-item label="方案编码：" ref="number" name="number" class="item">
                      <Input
                        allowClear
                        class="input"
                        autocomplete="off"
                        v-model:value="formState.number"
                        :placeholder="formState.bsStatus === 'B' ? '' : '请输入方案编码'"
                        :disabled="formState.bsStatus === 'B'"
                      />
                    </a-form-item>
                  </Col>
                  <Col :span="8">
                    <a-form-item label="方案名称：" ref="name" name="name" class="item">
                      <Input
                        allowClear
                        class="input"
                        autocomplete="off"
                        v-model:value="formState.name"
                        name="name"
                        :placeholder="formState.bsStatus === 'B' ? '' : '请输入方案名称'"
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
                    <a-form-item
                      label="检验类型："
                      ref="examineType"
                      name="examineType"
                      class="item"
                    >
                      <Select
                        v-model:value="formState.examineType"
                        class="select"
                        :options="config.EXAMINE_SCHEME_TYPE"
                        :disabled="formState.bsStatus === 'B'"
                      />
                    </a-form-item>
                  </Col>
                  <Col :span="8">
                    <a-form-item label="抽检规则：" ref="ruleId" name="ruleId" class="item">
                      <ExInput
                        autocomplete="off"
                        class="input"
                        :placeholder="formState.bsStatus === 'B' ? '' : '请选择抽检规则'"
                        label="抽检规则"
                        :show="formState.bsStatus !== 'B'"
                        :value="formState.bdExamineRule"
                        :disabled="formState.bsStatus === 'B'"
                        @search="
                          onSearch('GET_EXA_RULE_DTO', 'bdExamineRule', Url.GET_EXA_RULE_LIST, [
                            'ruleId',
                            'bdExamineRule',
                          ])
                        "
                        @clear="onClear(['ruleId', 'bdExamineRule'])"
                      />
                    </a-form-item>
                  </Col>
                  <Col :span="8">
                    <a-form-item label="业务类型：" ref="business" name="business" class="item">
                      <Select
                        v-model:value="formState.business"
                        class="select"
                        :options="config.EXAMINE_BUSINESS"
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
                    <a-form-item
                      label="方案描述："
                      ref="description"
                      name="description"
                      class="item"
                    >
                      <a-textArea
                        v-model:value="formState.description"
                        :placeholder="formState.bsStatus === 'B' ? '' : '请添加方案描述'"
                        :rows="3"
                        class="textArea"
                        :disabled="formState.bsStatus === 'B'"
                      />
                    </a-form-item>
                  </Col>
                  <Col :span="8">
                    <a-form-item label="备注：" ref="mark" name="mark" class="item">
                      <a-textArea
                        v-model:value="formState.mark"
                        :placeholder="formState.bsStatus === 'B' ? '' : '请输入备注'"
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
            :columns="exaProjectOfDetailColumns"
            :gridOptions="DetailOfExaGridOptions"
            :editRules="formRules"
            ref="detailTableRef"
            @cellClickTableEvent="cellClickTableEvent"
            @clearDetailTableEvent="clearDetailTableEvent"
            :detailTableData="detailTableData"
            @setDefaultTableData="setDefaultTableData"
            @getJudgeClickData="getJudgeClickData"
            :isShowIcon="formState.bsStatus !== 'B'"
            :isDisableButton="formState.bsStatus === 'B'"
          />
        </pane>
      </a-splitpanes>
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
  import {
    detailOfExaGridOptions,
    exaProjectOfDetailColumns,
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
    Switch,
    TabPane,
    Tabs,
    Select,
  } from 'ant-design-vue';
  import { Pane, Splitpanes } from 'splitpanes';
  import 'splitpanes/dist/splitpanes.css';
  import { BasicSearch } from '/@/components/AMoreSearch';
  import { ExInput } from '/@/components/ExInput';
  import { ExDetailTable } from '/@/components/ExDetailTable';
  import { RollbackOutlined } from '@ant-design/icons-vue';
  import { useRoute, useRouter } from 'vue-router';
  import { add, audit, unAudit, ExaEntity, getOneById, update } from '/@/api/exa';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { config } from '/@/utils/publicParamConfig';
  import { VXETable } from 'vxe-table';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { ControlSet, SearchParams, TableColum, Url } from '/@/api/apiLink';
  import { basicGridOptions } from '/@/components/AMoreSearch/data';
  import { cloneDeep } from 'lodash-es';
  import { getPublicList } from '/@/api/public';
  import { VxeGridPropTypes } from 'vxe-table/types/all';
  import { getInventoryList } from '/@/api/realTimeInv';
  const { createMessage } = useMessage();
  const ASplitpanes = Splitpanes;
  const DetailOfExaGridOptions = detailOfExaGridOptions;
  const paneSize = ref<number>(50);
  const AForm = Form;
  const AFormItem = FormItem;
  const ATextArea = Input.TextArea;
  const router = useRouter();
  const formRef = ref();
  const activeKey = ref<string>('1');
  const basicSearchRef: any = ref(null); //基础信息查询组件ref
  const basicControl = ref<ControlSet[]>(); //下拉框
  const basicTableCols = ref<VxeGridPropTypes.Columns[]>([]); //表头
  let basicTableName = ref<string>(''); //需要查询的表名
  const detailTableRef: any = ref<String | null>(null);
  const formData: ExaEntity = {
    id: undefined,
    number: '',
    name: '',
    isOpen: 1,
    description: '',
    examineType: 'A',
    business: 'A',
    ruleId: '',
  };

  const detailTableData: any = ref<object[]>([]); //表格数据
  //初始化
  const formStateInit = reactive({
    data: formData,
  });
  const formState = toRef(formStateInit, 'data');
  const project = 'bdExamineProject.number';

  const formRules = reactive({
    name: [{ required: true, message: '请输入方案名称' }],
    number: [{ required: true, message: '请输入方案编码' }],
    ruleId: [{ required: true, message: '请选择抽检规则' }],
    business: [{ required: true, message: '请选择抽检规则' }],
    examineType: [{ required: true, message: '请选择抽检规则' }],
    max: [
      { required: false },
      {
        validator({ cellValue, row }) {
          if (Number(cellValue) && Number(row.min) > Number(cellValue)) {
            return new Error('最大值应该大于最小值');
          }
        },
      },
    ],
    min: [
      { required: false },
      {
        validator({ cellValue, row }) {
          if (Number(cellValue) && Number(row.max) < Number(cellValue)) {
            return new Error('最小值应该小于最大值');
          }
        },
      },
    ],
  });
  formRules[project] = [{ required: true, message: '请选择检验项目' }];

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
    const res = await getPublicList({ params: [] }, Url[dtoUrlConfig]);
    basicControl.value = res;
    basicTableCols.value = TableColum[dtoUrlConfig];
    basicTableName.value = tableName;
    let filterParams: SearchParams[] = [];
    basicSearchRef.value.setFilter(filterParams);
    basicSearchRef.value.init(tableUrl);
  };

  //双击单元格选择事件——获取双击所选的值并赋值到对应字段
  const basicClickEvent = async (row) => {
    basicSearchRef.value.close();
    formState.value[currDataParam[0]] = row.id;
    formState.value[currDataParam[1]] = {};
    formState.value[currDataParam[1]].id = row.id;
    formState.value[currDataParam[1]].name = row.name;
    console.log(formState.value);
  };
  //接受参数
  const dataId = useRoute().query.row?.toString() || '';

  //保存
  const onSubmit = async () => {
    formRef.value
      .validate()
      .then(async () => {
        const tableFullData = detailTableRef.value.getDetailData();
        const validAllErrMapData = await detailTableRef.value.getValidAllData();
        if (tableFullData) {
          if (validAllErrMapData) {
            await VXETable.modal.message({
              status: 'error',
              message: '明细表数据校检不通过，请检查!',
            });
            return;
          }
          formState.value.bdExamineDetailList = cloneDeep(tableFullData);
        }
        let data;
        if (!formState.value.id) {
          data = await add({ params: formState.value });
          formState.value = Object.assign({}, formState.value, data);
        } else {
          data = await update({ params: formState.value });
          formState.value = Object.assign({}, formState.value, data);
        }
        createMessage.success('操作成功');
      })
      .catch((error: ValidateErrorEntity<FormData>) => {
        createMessage.error('数据校检不通过，请检查!');
        console.log(error);
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
              await VXETable.modal.message({ status: 'error', message: '数据校检不通过，请检查!' });
              return;
            }
            formState.value.bdExamineDetailList = cloneDeep(tableFullData);
          }
          const data = await audit({ params: formState.value });
          formState.value = Object.assign({}, formState.value, data);
          if (data.bsStatus === 'B' && tableFullData) {
            tableFullData.map((e) => {
              e.bsStatus = 'B';
              return e;
            });
          }
          createMessage.success('操作成功');
        }
      })
      .catch((error: ValidateErrorEntity<FormData>) => {
        createMessage.error('数据校检不通过，请检查!');
        console.log(error);
      });
  };
  //反审核
  const onUnAudit = async () => {
    const type = await VXETable.modal.confirm('您确定要反审核吗?');
    if (type === 'confirm') {
      const tableFullData = detailTableRef.value.getDetailData();
      if (tableFullData) {
        formState.value.bdExamineDetailList = cloneDeep(tableFullData);
      }
      const data = await unAudit({ params: formState.value });
      formState.value = Object.assign({}, formState.value, data);
      if (data.bsStatus === 'A' && tableFullData) {
        tableFullData.map((e) => {
          e.bsStatus = 'A';
          return e;
        });
      }
      createMessage.success('操作成功');
    }
  };
  //返回上一页
  const back = () => {
    router.go(-1);
  };
  //获取初始值
  const init = async () => {
    if (dataId) {
      const res: any = await getOneById({ params: dataId });
      formState.value = res;
      if (formState.value.bdExamineDetailList) {
        formState.value.bdExamineDetailList.map((r) => {
          r.bsStatus = formState.value.bsStatus;
        });
      }
      detailTableData.value = cloneDeep(formState.value.bdExamineDetailList);
    }
  };

  //明细表获取判断双击赋值事件的值
  const getJudgeClickData = (arr, row, callback) => {
    let judgeClickIndex = arr.fullData.findIndex((e) => e.bdExamineProject.id === row.id);
    callback(judgeClickIndex);
  };
  //明细表双击赋值事件
  const cellClickTableEvent = async (row, data, column) => {
    switch (column) {
      case 'bdExamineProject':
        data.exaProjectId = row.id;
        // data.bdExamineProject.id = row.id;
        // data.bdExamineProject.number = row.number;
        // data.bdExamineProject.name = row.name;
        data.bdExamineProject = row;
        break;
    }
  };
  //明细表清空事件
  const clearDetailTableEvent = (data, column) => {
    for (const key in column.params.param) {
      data[key] = '';
      data[column.params.param[key]] = {};
    }
  };
  //设置Switch默认
  const setDefaultTableData = (obj) => {
    obj.isOpen = 1;
    obj.isRequire = 1;
    obj.sort = cloneDeep(detailTableRef.value.rowSortData);
  };
  //刚进入页面——加载完后，需要执行的方法
  onMounted(() => {
    init();
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
