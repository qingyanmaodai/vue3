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
                        placeholder="请输入方案编码"
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
                        placeholder="请输入方案名称"
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
                        placeholder="请选择抽检规则"
                        label="抽检规则"
                        :show="formState.bsStatus !== 'B'"
                        :value="formState.ruleName"
                        :disabled="formState.bsStatus === 'B'"
                        @search="onRule()"
                        @clear="onClear(['ruleId', 'ruleName'])"
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
                        placeholder="请添加方案描述:"
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
                        placeholder="请添加备注"
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
            :gridOptions="RuleOfExaGridOptions"
            ref="vxeTableRef"
            @changeSwitch="changeSwitch"
            :isShowIcon="formState.bsStatus !== 'B'"
            :disabledTable="formState.bsStatus === 'B'"
          />
        </pane>
      </a-splitpanes>
    </div>
    <BasicSearch
      @basicClickEvent="onRuleClickEvent"
      @openSearch="openSearch"
      ref="basicSearchRef"
      :gridOptions="basicGridOptions"
    />
  </div>
</template>
<script lang="ts" setup>
  import {
    ruleOfExaGridOptions,
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
  import { add, audit, unAudit, ExaEntity, getOneById, update, ExaDetailEntity } from '/@/api/exa';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { config } from '/@/utils/publicParamConfig';
  import { VXETable } from 'vxe-table';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { SearchDataType, SearchLink, SearchMatchType } from '/@/api/apiLink';
  import { getDataList, getSearchOption } from '/@/api/exaRule';
  import { basicGridOptions, exaRuleColumns } from '/@/components/AMoreSearch/data';
  import { cloneDeep } from 'lodash-es';
  import { getStockCompartmentListById } from '/@/api/stockCompartment';
  const { createMessage } = useMessage();
  const ASplitpanes = Splitpanes;
  const RuleOfExaGridOptions = ruleOfExaGridOptions;
  const paneSize = ref<number>(50);
  const AForm = Form;
  const AFormItem = FormItem;
  const ATextArea = Input.TextArea;
  const router = useRouter();
  const formRef = ref();
  const activeKey = ref<string>('1');
  const basicSearchRef: any = ref(null);
  const vxeTableRef: any = ref<String | null>(null);
  const formData: ExaEntity = {
    id: undefined,
    number: '',
    name: '',
    isOpen: 1,
    description: '',
    examineType: 'A',
    business: 'A',
    ruleId: '',
    ruleName: '',
  };
  //初始化
  const formStateInit = reactive({
    data: formData,
  });
  const formState = toRef(formStateInit, 'data');
  const formRules = reactive({
    name: [{ required: true, message: '请输入方案名称' }],
    number: [{ required: true, message: '请输入方案编码' }],
    ruleId: [{ required: true, message: '请选择抽检规则' }],
    business: [{ required: true, message: '请选择抽检规则' }],
    examineType: [{ required: true, message: '请选择抽检规则' }],
  });

  //点击清空图标清空事件
  const onClear = (key: string[]) => {
    key.forEach((e) => {
      formState.value[e] = '';
    });
  };
  const openSearch = async () => {
    const res = await onRule();
    basicSearchRef.value.initList(res);
  };
  //基本信息表格双击事件
  const onRuleClickEvent = (row) => {
    formState.value.ruleId = row.id;
    formState.value.ruleName = row.name;
    basicSearchRef.value.bSearch(false);
  };
  //打开放大镜
  const onRule = async () => {
    const res: any = await getDataList({
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
    basicSearchRef.value.initCols(exaRuleColumns);
    await getRuleOption();
    return res;
  };
  //获取基本单位字段
  const getRuleOption = async () => {
    try {
      let arr: any = [];
      let data = await getSearchOption({ params: '' });
      arr = cloneDeep(data);
      arr = arr.filter((e) => e.fieldName != 'bs_status');
      basicSearchRef.value.init(arr);
    } catch (e) {
      console.log('获取基本信息字段失败', e);
    }
  };
  //接受参数
  const dataId = useRoute().query.row?.toString();
  //保存
  const onSubmit = async () => {
    formRef.value
      .validate()
      .then(async () => {
        const tableFullData = vxeTableRef.value.saveDataEvent();
        if (tableFullData) {
          formState.value.bdExamineDetailList = cloneDeep(tableFullData);
        }
        if (!formState.value.id) {
          const data = await add({ params: formState.value });
          formState.value = Object.assign({}, formState.value, data);
        } else {
          const data = await update({ params: formState.value });
          formState.value = Object.assign({}, formState.value, data);
        }
        formState.value.bsStatus = 'A';
        createMessage.success('操作成功');
      })
      .catch((error: ValidateErrorEntity<FormData>) => {
        createMessage.error('数据校检不通过，请检查!');
        console.log(error);
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
        createMessage.error('数据校检不通过，请检查!');
        console.log(error);
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
  //获取初始值
  const init = async () => {
    if (dataId) {
      const res: any = await getOneById({ params: dataId });
      formState.value = res;
      if (formState.value.ruleId) {
        formState.value.ruleId = res.bdExamineRule ? res.bdExamineRule.id : '';
        formState.value.ruleName = res.bdExamineRule ? res.bdExamineRule.name : '';
      }
      if (formState.value.bdExamineDetailList){
        formState.value.bdExamineDetailList.map(r => {
          if(!r.bdExamineProject){
            r.bdExamineProject = {
              id: '',
              name: '',
              number: '',
            }
            return r;
          }
        })
      }
      vxeTableRef.value.init(formState.value.bdExamineDetailList);
    }
  };
  //设置Switch默认
  const changeSwitch = (obj) => {
    obj.isOpen = 1;
    obj.isRequire = 1;
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
