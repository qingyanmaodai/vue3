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
        <Button danger class="button" @click="handleAudit(0)" v-if="formState.bsStatus === 'A'"
          >审核</Button
        >
        <Button danger class="button" @click="handleAudit(1)" v-if="formState.bsStatus === 'B'"
          >反审核</Button
        >
      </div>
    </LayoutHeader>
    <div class="content">
      <Tabs v-model:activeKey="activeTabs" class="tabs">
        <TabPane key="basicInfo" tab="基本信息">
          <a-form :model="formState" :rules="formRules" ref="formRef">
            <Row>
              <Col :span="8">
                <a-form-item label="编码：" ref="number" name="number" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.number"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请输入供应商编码'"
                    :disabled="formState.bsStatus === 'B'"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="供应商名称：" ref="name" name="name" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.name"
                    name="name"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请输入供应商名称'"
                    :disabled="formState.bsStatus === 'B'"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="简称：" ref="shortName" name="shortName" class="item">
                  <Input
                    allowClear
                    class="input"
                    v-model:value="formState.shortName"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请输入简称'"
                    :disabled="formState.bsStatus === 'B'"
                  />
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="联系人：" ref="contact" name="contact" class="item">
                  <Input
                    allowClear
                    class="input"
                    autocomplete="off"
                    v-model:value="formState.contact"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请输入联系人'"
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
                    name="name"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请输入联系电话'"
                    :disabled="formState.bsStatus === 'B'"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="责任人：" ref="empId" name="empId" class="item">
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
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="国家：" ref="country" name="country" class="item">
                  <a-select
                    allowClear
                    class="input"
                    :disabled="formState.bsStatus === 'B'"
                    v-model:value="formState.country"
                    show-search
                    :placeholder="formState.bsStatus === 'B' ? '' : '请选择'"
                    :options="countryData"
                    :filter-option="filterOption"
                    @change="countryHandleChange"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="地区：" ref="districtArr" name="districtArr" class="item">
                  <a-cascader
                    allowClear
                    v-if="isShowDistrict"
                    style="width: 16rem; height: 2rem; margin: 0 60px 0 2px"
                    :disabled="formState.bsStatus === 'B'"
                    v-model:value="formState.districtArr"
                    :options="districtData"
                    :load-data="loadDistrictData"
                    change-on-select
                    :placeholder="formState.bsStatus === 'B' ? '' : '请选择'"
                  />
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="详细地址：" ref="address" name="address" class="item">
                  <Input
                    allowClear
                    class="input"
                    v-model:value="formState.address"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请输入地址'"
                    :disabled="formState.bsStatus === 'B'"
                  />
                </a-form-item>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <a-form-item label="供应商等级：" ref="level" name="level" class="item">
                  <Select
                    allowClear
                    v-model:value="formState.level"
                    class="select"
                    :disabled="formState.bsStatus === 'B'"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请选择'"
                  >
                    <SelectOption
                      v-for="(item, index) in config['SUPPLIER_GRADE']"
                      :key="index"
                      :value="item.value"
                    >
                      {{ item.label }}</SelectOption
                    >
                  </Select>
                </a-form-item>
              </Col>
              <Col :span="8">
                <a-form-item label="供应商分组：" ref="groupId" name="groupId" class="item">
                  <ExInput
                    autocomplete="off"
                    class="input"
                    :placeholder="formState.bsStatus === 'B' ? '' : '请选择供应商分组'"
                    label="供应商分组"
                    :show="formState.bsStatus !== 'B'"
                    v-model:value="formState.bdSupplierGroup"
                    :disabled="formState.bsStatus === 'B'"
                    @search="onGroupSearch"
                    @clear="onClear(['groupId', 'bdSupplierGroup'])"
                  />
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
        <TabPane key="otherInfo" tab="其他信息">
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
    </div>
    <!--  供应商分组弹框  -->
    <a-modal v-model:visible="supplierGroupModel" title="供应商分组" ref="node">
      <a-tree-select
        loading
        show-search
        v-model:value="formState.groupId"
        style="width: 100%"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        placeholder="请选择供应商分组"
        treeNodeFilterProp="title"
        tree-default-expand-all
        :treeData="treeData"
        @change="groupSelect"
      />
    </a-modal>
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
  import { onMounted, reactive, ref, toRef, UnwrapRef } from 'vue';
  import {
    Button,
    Col,
    Form,
    FormItem,
    Input,
    LayoutHeader,
    Modal,
    Row,
    Select,
    SelectOption,
    TabPane,
    Tabs,
    TreeSelect,
    Cascader,
  } from 'ant-design-vue'; //ant组件
  const AModal = Modal;
  const AForm = Form;
  const TextArea = Input.TextArea;
  const AFormItem = FormItem;
  const ATreeSelect = TreeSelect;
  const ASelect = Select;
  const ACascader = Cascader;
  import { ExInput } from '/@/components/ExInput';
  import { RollbackOutlined } from '@ant-design/icons-vue';
  import { config } from '/@/utils/publicParamConfig'; //公共配置ts
  import { useRoute, useRouter } from 'vue-router'; //路由
  import { BasicSearch } from '/@/components/AMoreSearch';
  const router = useRouter();
  import { getOneSupplier, save, update, audit, unAudit, SupplierEntity } from '/@/api/supplier'; //供应商api
  import {
    getSupplierGroupTree,
    queryOneSupplierGroup,
    SupplierGroupEntity,
  } from '/@/api/supplierGroup'; //供应商分组api
  import { basicGridOptions } from '/@/components/AMoreSearch/data';
  import { TreeItem } from '/@/components/Tree';
  import { VXETable } from 'vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage'; //提示信息组件
  const { createMessage } = useMessage();
  import { cloneDeep } from 'lodash-es';
  import { CountryEntity, getCountryTree } from '/@/api/country';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { getPublicList } from '/@/api/public';
  import { ControlSet, TableColum, Url } from '/@/api/apiLink';
  import { VxeGridPropTypes } from 'vxe-table/types/all';

  //基础信息查询组件ref
  const basicSearchRef = ref<any>(null);
  const basicControl = ref<ControlSet[]>(); //下拉框
  const basicTableCols = ref<VxeGridPropTypes.Columns[]>([]); //表头
  const basicTableName = ref<string>(''); //表格数据
  //表单初始数据
  const formData: UnwrapRef<SupplierEntity> = {
    id: '',
    number: '',
    name: '',
    districtArr: [],
  };
  const formInitState = reactive({ data: formData });

  const formState = toRef(formInitState, 'data'); //表单对象

  //表单必填规则配置
  const formRules = reactive({
    name: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
    number: [{ required: true, message: '请输入供应商编码', trigger: 'blur' }],
  });
  const formRef: any = ref<String | null>(null); //表单引用对象
  const supplierId = ref<string>(''); //路由参数，供应商Id
  const selectGroupId = ref<string>(''); //路由参数，供应商分组Id
  const treeData = ref<TreeItem>([]); //供应商分组数据
  const countryData = ref<CountryEntity[]>([]); //国家数据
  const districtData = ref<CountryEntity[]>([]); //地区数据
  const supplierGroupModel = ref<boolean>(false); //供应商分组弹框显示状态
  const activeTabs = ref<string>('basicInfo'); //当前激活板块
  const isShowDistrict = ref<boolean>(false); //是否显示地区组件

  /* method */

  /**
   * 页面加载
   */
  onMounted(() => {
    supplierId.value = useRoute().query.row?.toString() || '';
    selectGroupId.value = router.currentRoute.value.query.groupId?.toString() || '';
    init(); //页面初始化
  });

  const init = async () => {
    await getCountry();
    if (supplierId.value) {
      await getSupplier();
    } else {
      //获取供应商分组
      const result = await queryOneSupplierGroup({ params: selectGroupId.value || '0' });
      if (result) {
        formState.value.groupId = result.id;
        formState.value.bdSupplierGroup = result;
      }
    }
    isShowDistrict.value = true;
  };

  /**
   * 获取供应商详细信息
   */
  const getSupplier = async (supId = supplierId.value) => {
    const res: any = await getOneSupplier(supId);
    if (res) {
      formState.value = res;
      //回显地区信息
      await echoDistrict();
    }
  };

  /**
   * 保存事件
   */
  const onSubmit = async () => {
    //表单验证
    formRef.value
      .validate()
      .then(async () => {
        formState.value.provincial = formState.value.districtArr[0]
          ? formState.value.districtArr[0]
          : undefined; //省
        formState.value.municipal = formState.value.districtArr[1]
          ? formState.value.districtArr[1]
          : undefined; //市
        formState.value.district = formState.value.districtArr[2]
          ? formState.value.districtArr[2]
          : undefined; //区
        let res;
        if (supplierId.value) {
          res = await update({ params: formState.value });
        } else {
          res = await save({ params: formState.value });
        }
        formState.value = Object.assign({}, formState.value, res);
        createMessage.success('操作成功');
      })
      .catch((error: ValidateErrorEntity<FormData>) => {
        console.log(error);
        if (error.errorFields) {
          createMessage.error('数据校检不通过，请检查!');
        }
      });
  };

  /**
   * 审核/反审核方法
   * @param flag 0.审核 1.反审核
   */
  const handleAudit = async (flag: number) => {
    let mess = flag === 1 ? '反审核' : '保存并审核';
    const type = await VXETable.modal.confirm(`确定${mess}当前供应商吗?`);
    if (type == 'confirm') {
      formRef.value
        .validate()
        .then(async () => {
          let data;
          if (flag === 0) {
            data = await audit({ params: formState.value });
          } else {
            data = await unAudit({ params: formState.value });
          }
          formState.value = Object.assign({}, formState.value, data);
          createMessage.success('操作成功');
        })
        .catch((error: ValidateErrorEntity<FormData>) => {
          console.log(error);
          if (error.errorFields) {
            createMessage.error('数据校检不通过，请检查!');
          }
        });
    }
  };

  /**
   * 国家选择框change事件
   * @param data
   */
  const countryHandleChange = (data) => {
    console.log(data);
  };

  /**
   * 国家选择框过滤
   * @param input
   * @param option
   */
  const filterOption = (input: string, option: any) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
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

  /**
   * 供应商分组弹框
   */
  const onGroupSearch = () => {
    getTree(); //获取分组数据
    supplierGroupModel.value = true;
  };

  /**
   * 供应商分组选择事件
   * @param value
   * @param names
   */
  const groupSelect = (value: string, names: string[]) => {
    formState.value.bdSupplierGroup = { id: value, name: names[0] || '' };
    formState.value.groupId = value;
    supplierGroupModel.value = false;
  };

  /**
   * 获取供应商分组树
   */
  const getTree = async () => {
    const tree = await getSupplierGroupTree({ params: '0' });
    runTree(tree);
    treeData.value = cloneDeep(tree);
  };

  /**
   * 获取国家地区
   */
  const getCountry = async () => {
    const res = await getCountryTree({ params: '-1' });
    if (res.length > 0) {
      res.forEach((item) => {
        item.label = item.name;
        item.value = item.id;
      });
      countryData.value = cloneDeep(res); //国家数据;
      formState.value.country = countryData.value[0].id; //默认选中第一条
      const data = await getCountryTree({ params: countryData.value[0].number || '' });
      if (res.length > 0) {
        data.forEach((item) => {
          item.label = item.name;
          item.value = item.id;
          item.isLeaf = false;
        });
        districtData.value = data;
      }
    }
  };

  /**
   * 获取地区数据
   */
  const loadDistrictData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    //懒加载
    const res = await getCountryTree({ params: targetOption.number });
    if (res.length > 0) {
      res.forEach((item) => {
        item.label = item.name;
        item.value = item.id;
        item.isLeaf = item.level == 3;
      });
      targetOption.children = res;
      districtData.value = [...districtData.value]; //地区数据
    }
    targetOption.loading = false;
  };

  /**
   * 省市区回显
   */
  const echoDistrict = async () => {
    try {
      let arr: number[] = [];
      let ssqData = cloneDeep(districtData.value);
      if (formState.value.provincial) {
        arr.push(formState.value.provincial);
        if (formState.value.municipal) {
          arr.push(formState.value.municipal);
          let provincialIndex = ssqData.findIndex((e) => e.id == formState.value.provincial);
          if (provincialIndex != -1) {
            const municipalRes = await getCountryTree({
              params: ssqData[provincialIndex].number || '',
            });
            municipalRes.forEach((item) => {
              item.label = item.name;
              item.value = item.id;
              item.isLeaf = item.level == 3;
            });
            ssqData[provincialIndex].children = cloneDeep(municipalRes);
            if (formState.value.district) {
              arr.push(formState.value.district);
              let municipalIndex = ssqData[provincialIndex].children!.findIndex(
                (e) => e.id == formState.value.municipal,
              );
              if (municipalIndex != -1) {
                const districtRes = await getCountryTree({
                  params: ssqData[provincialIndex].children![municipalIndex].number || '',
                });
                districtRes.forEach((item) => {
                  item.label = item.name;
                  item.value = item.id;
                  item.isLeaf = item.level == 3;
                });
                ssqData[provincialIndex].children![municipalIndex].children =
                  cloneDeep(districtRes);
              }
            }
          }
        }
      }
      districtData.value = cloneDeep(ssqData);
      formState.value.districtArr = arr;
    } catch (e) {
      console.log(e);
    }
  };

  /**
   * 初始化树
   * @param tree
   */
  const runTree = (tree: SupplierGroupEntity[] | CountryEntity[]) => {
    tree.forEach((item) => {
      item.title = item.name;
      item.value = item.id;
      item.key = item.id;
      runTree(item.children || []);
    });
  };

  /**
   * 清空事件
   */
  const onClear = (key: string[]) => {
    key.forEach((e) => {
      formState.value[e] = undefined;
    });
  };

  const back = () => {
    router.go(-1);
  };
</script>
<style scoped lang="less">
  .item {
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
