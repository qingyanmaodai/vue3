<template>
  <div style="height: 100%">
    <!-- 查询区域 -->
    <Card style="margin-top: 5px">
      <span>搜索版本名：</span
      ><Input
        style="width: 200px"
        placeholder="请输入搜索关键词"
        v-model:value="queryParam.params.versionName"
      />
      <Button type="primary" style="left: 10px" @click="searchQuery(1)">
        <template #icon><SearchOutlined /></template>
        查询</Button
      >
      <Button type="primary" style="margin-left: 8px; left: 10px" @click="addVersion(null)">
        <template #icon><PlusOutlined /></template>
        添加</Button
      >
      <Button type="primary" @click="searchReset" style="margin-left: 8px; left: 10px">
        <template #icon><RedoOutlined /></template>重置</Button
      >
    </Card>

    <!-- 新增弹框       -->
    <Modal
      style="top: 20px"
      :title="title1"
      v-model:visible="addVersionDialog"
      @cancel="close"
      @ok="handleOk"
      destroy-on-close="true"
    >
      <Form
        :model="addParam"
        v-bind="layout"
        style="width: 98%"
        name="nest-messages"
        ref="formRef"
        :rules="rules.data"
      >
        <FormItem name="versionNo" style="margin-top: 15px" label="版本号：">
          <InputNumber
            style="width: 300px"
            :min="0"
            placeholder="请输入版本号："
            v-model:value="addParam.versionNo"
          />
        </FormItem>
        <FormItem name="versionName" label="版本名称">
          <Input
            autocomplete="off"
            style="width: 300px"
            placeholder="请输入版本名称"
            v-model:value="addParam.versionName"
          />
        </FormItem>
        <FormItem name="updateUserIds" label="可更新用户：">
          <Select
            mode="multiple"
            style="width: 300px"
            showSearch
            :allowClear="true"
            :showArrow="true"
            v-model:value="addParam.updateUserIds"
            :filterOption="filterOption"
            placeholder="请选择可更新用户"
          >
            <SelectOption v-for="(items, index) in useroptions.data" :key="index" :value="items.id">
              {{ items.realname }}</SelectOption
            ></Select
          >
        </FormItem>

        <FormItem name="updateRoleIds" label="可更新角色：">
          <TreeSelect
            v-model:value="addParam.updateRoleIds"
            style="width: 300px"
            :tree-data="departoptions.data"
            tree-checkable
            allow-clear
            :showSearch="true"
            treeNodeFilterProp="title"
            placeholder="请选择可更新角色"
          />
        </FormItem>
        <FormItem name="remindTime" label="提示更新时间：">
          <Space direction="vertical" :size="12">
            <DatePicker
              style="width: 300px"
              v-model:value="addParam.remindTime"
              show-time
              placeholder="请选择更新时间"
              @change="onChange"
            />
          </Space>
        </FormItem>
        <FormItem name="fileSize" label="应用大小：">
          <InputNumber
            style="width: 200px"
            :min="0"
            placeholder="请输入应用大小"
            :step="0.001"
            v-model:value="addParam.fileSize"
          />
          ( 单位为 : kb)
        </FormItem>
        <FormItem name="updateContent" label="更新内容：">
          <TextArea
            style="width: 300px"
            placeholder="请输入更新内容"
            v-model:value="addParam.updateContent"
          />
        </FormItem>
        <FormItem name="downloadUrl" label="下载地址：">
          <Input
            autocomplete="off"
            style="width: 300px"
            placeholder="请输入下载地址"
            v-model:value="addParam.downloadUrl"
          />
        </FormItem>
        <FormItem label="是否强制更新：">
          <Switch v-model:checked="addParam.isForceUpdate" />
        </FormItem>
      </Form>
    </Modal>

    <!-- table区域-begin   -->
    <Card style="margin-top: 10px" title="版本更新">
      <Table
        ref="table"
        size="middle"
        rowKey="id"
        :ellipsis="true"
        :columns="columns.data"
        :dataSource="dataSource.data"
        @change="handleTableChange"
        :pagination="false"
        :scroll="{ x: 'calc(700px + 60%)', y: 400 }"
      >
        <!-- 查询id，用户名，角色 -->
        <template #num="{ index }">
          {{ (current1 - 1) * pageSizeRef + Number(index) + 1 }}</template
        >
        <template #users="{ text }">
          <Tag v-for="tag in text" :key="tag" color="green">
            {{ tag.username }}
          </Tag>
        </template>
        <template #roles="{ text }">
          <Tag v-for="tag in text" :key="tag" color="yellow">
            {{ tag.departName }}
          </Tag>
        </template>
        <!--  @click="ediVersion(record.$index, record.row)" -->
        <template #operate="{ record }">
          <div v-if="new Date(record.remindTime).getTime() >= new Date().getTime()">
            <Button type="primary" size="small" @click="addVersion(record)" style="margin: 5px 5px">
              编辑
            </Button>
            <Button
              type="primary"
              style="background-color: crimson; border: none"
              size="small"
              @click="onDelete(record)"
              >删除</Button
            >
          </div>
          <!-- <div v-else>
            <Button disabled size="small">已过更新时间</Button>
          </div> -->
        </template>
      </Table>
      <!--      分页      -->
      <Pagination
        style="margin-top: 15px"
        v-model:current="current1"
        :page-size-options="pageSizeOptions"
        :total="total1"
        :show-total="(total) => `共 ${total} 条`"
        show-size-changer
        @change="pageChange"
        :page-size="pageSizeRef"
        @showSizeChange="onShowSizeChange"
      />
      <!-- table区域-end -->
    </Card>
  </div>
</template>
<script lang="ts" setup>
  import {
    Pagination,
    Tag,
    message,
    Select,
    SelectOption,
    InputNumber,
    Card,
    Table,
    Space,
    Switch,
    Form,
    Input,
    DatePicker,
    FormItem,
    Modal,
    TreeSelect,
    Button,
  } from 'ant-design-vue';
  import { getUpdateRecord } from '/@/api/sys/version';
  import {
    addNewVersion,
    delNewVersion,
    getAllSysDepart,
    queryAllUserBackCombo,
  } from '/@/api/sys/addversion';
  import {
    SearchOutlined,
    RedoOutlined,
    PlusOutlined,
    ExclamationCircleOutlined,
  } from '@ant-design/icons-vue';
  import { reactive, ref, toRaw, UnwrapRef, createVNode } from 'vue';
  import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';
  import { Moment } from 'moment';
  const TextArea = Input.TextArea;
  const pageSizeOptions = ref<string[]>(['10', '50', '100', '200']);
  const current1 = ref(1);
  const pageSizeRef = ref(10);
  const onChange = (value: Moment, dateString: string) => {
    addParam.remindTime = dateString;
  };
  const title1 = ref('新增');
  let total1 = ref(0);
  const onShowSizeChange = async (current: number, pageSize: number) => {
    dataSource.data = [];
    if (current == 0) {
      current = 1;
    }
    current1.value = current;
    pageSizeRef.value = pageSize;
    queryParam.pageNo = current;
    queryParam.pageSize = pageSize;
    await searchQuery(current);
  };
  const pageChange = async (page: number, pageSize: number) => {
    queryParam.pageSize = pageSize;
    queryParam.pageNo = page;
    await searchQuery(page);
  };
  // 可更新角色
  const departoptions = reactive<any>({
    data: [],
  });
  const filterOption = (input: string, option: any) => {
    return option.children[0].el.nodeValue.toLowerCase().indexOf(input.toLowerCase()) != -1;
  };

  // 可更新用户
  const useroptions = reactive<any>({
    data: [],
  });

  // 版本弹框
  const addVersionDialog = ref(false);

  // 查询条件
  const queryParam = reactive<any>({
    params: {
      versionName: '',
      column: 'createTime',
      order: 'desc',
    },
    pageIndex: current1.value,
    pageRows: pageSizeRef.value,
  });
  //添加
  const addParam: UnwrapRef<AddParam> = reactive({
    id: '',
    downloadUrl: '', //下载地址
    fileSize: undefined, //应用大小
    updateContent: '', //更新内容
    remindTime: '', //提示更新时间
    versionNo: undefined, //版本号
    versionName: '', //版本名称
    updateUserIds: [], //可更新用户
    updateRoleIds: [], //可更新角色
    isForceUpdate: false, //是否强制更新
    // isIgnore: '', //是否可忽略更新
  });

  //表单验证
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  interface AddParam {
    id: string;
    downloadUrl: string;
    fileSize: number | undefined;
    updateContent: string;
    remindTime: string;
    versionNo: number | undefined;
    versionName: string;
    updateUserIds: Array<string> | string;
    updateRoleIds: Array<string> | string;
    isForceUpdate: boolean;
  }
  const rules = reactive({
    data: {
      downloadUrl: [{ required: true, message: '请填写下载地址', trigger: 'blur' }],
      fileSize: [{ required: true, message: '请填写应用大小', trigger: 'change', type: 'number' }],
      updateContent: [{ required: true, message: '请填写更新内容', trigger: 'blur' }],
      remindTime: [{ required: true, message: '请填写提示更新时间', trigger: 'change' }],
      versionNo: [{ required: true, message: '请填写版本号', trigger: 'change', type: 'number' }],
      versionName: [{ required: true, message: '请填写版本名称', trigger: 'blur' }],
      // updateUserIds: [
      //   { required: true, message: '请填写可更新用户', type: 'array', trigger: 'change' },
      // ],
      // updateRoleIds: [
      //   { required: true, message: '请填写可更新角色', type: 'array', trigger: 'change' },
      // ],
    },
  });

  // 表头
  const columns = reactive({
    data: [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        fixed: 'left',
        slots: {
          customRender: 'num',
        },
        width: 40,
      },
      {
        title: '版本名称',
        align: 'center',
        dataIndex: 'versionName',
        width: 100,
        slots: { customRender: 'versionName' },
      },
      {
        title: '版本号',
        dataIndex: 'versionNo',
        align: 'center',
        width: 100,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        align: 'center',
        sorter: true,
        width: 150,
      },
      {
        title: '更新内容',
        dataIndex: 'updateContent',
        align: 'center',
        width: 150,
      },
      {
        title: '应用大小(单位:kb)',
        dataIndex: 'fileSize',
        align: 'center',
        width: 70,
      },
      {
        title: '下载地址',
        dataIndex: 'downloadUrl',
        align: 'center',
        width: 150,
      },
      {
        title: '可更新用户',
        dataIndex: 'users',
        align: 'center',
        width: 100,
        slots: { customRender: 'users' },
      },
      {
        title: '可更新角色',
        dataIndex: 'roles',
        align: 'center',
        width: 100,
        slots: { customRender: 'roles' },
      },
      {
        title: '是否强制更新',
        dataIndex: 'isForceUpdate',
        align: 'center',
        width: 100,
        customRender: (text, record, index) => {
          const obj = {
            children: '',
            props: {} as any,
          };
          if (text.text == 1) {
            obj.children = '是';
          } else if (text.text == 0) {
            obj.children = '否';
          }
          return obj;
        },
      },
      // {
      //   title: '是否可忽略该版本',
      //   dataIndex: 'isIgnore',
      //   align: 'center',
      //   width: 100,
      //   customRender: (text, record, index) => {
      //     const obj = {
      //       children: '',
      //       props: {} as any,
      //     };
      //     if (text.text == 1) {
      //       obj.children = '是';
      //     } else if (text.text == 0) {
      //       obj.children = '否';
      //     }
      //     return obj;
      //   },
      // },
      {
        title: '提示更新时间',
        dataIndex: 'remindTime',
        align: 'center',
        sorter: true,
        width: 150,
      },
      {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        width: 120,
        fixed: 'right',
        slots: { customRender: 'operate' },
      },
    ],
  });
  //关闭新增
  const close = () => {
    addParam.id = '';
    addParam.downloadUrl = '';
    addParam.fileSize = undefined;
    addParam.updateContent = '';
    addParam.remindTime = '';
    addParam.versionNo = undefined;
    addParam.versionName = '';
    addParam.updateUserIds = [];
    addParam.updateRoleIds = [];
    // formRef.value.resetFields();
    addParam.isForceUpdate = false;
    console.log('更新版本');
  };

  // 重置
  const searchReset = async () => {
    queryParam.params.versionName = '';
    console.log('重置');
    (queryParam.pageIndex = current1.value),
      (queryParam.pageRows = pageSizeRef.value),
      await searchQuery(current1.value);
  };

  //删除
  const onDelete = async (record: any) => {
    // if (new Date(record.remindTime).getTime() >= new Date().getTime()) {
    //   showDialog(record.id);
    // } else {
    //   message.error('已过提示更新时间，不可删除');
    // }
    showDialog(record.id);
  };
  const showDialog = (number: number) => {
    Modal.confirm({
      title: () => '提示',
      icon: () => createVNode(ExclamationCircleOutlined),
      content: () => createVNode('div', { style: 'color:black;' }, '确定要删除吗'),
      class: 'test',

      onOk: async () => {
        const delV = await delNewVersion({ versionId: number });
        message.success('删除成功！');
        searchQuery(1);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  // 获取当前时间
  // let currentTime = new Date().getTime();
  // let rtime = title.remindTime.getTime();

  //点击添加,编辑，，打开弹框
  const addVersion = async (title: any) => {
    addParam.updateUserIds = [];
    addParam.updateRoleIds = [];
    console.log(title);
    if (!title) {
      console.log('新增');
      title1.value = '新增';
      addVersionDialog.value = true;
    } else {
      // let currentTime = new Date().getTime();
      // let rtime = new Date(title.remindTime).getTime();
      // if (rtime < currentTime) {
      //   message.error('已过提示更新时间，不可编辑');
      //   return;
      // }
      title1.value = '编辑';
      console.log('编辑');
      addParam.downloadUrl = title.downloadUrl;
      addParam.fileSize = title.fileSize;
      addParam.updateContent = title.updateContent;
      addParam.remindTime = title.remindTime;
      addParam.versionNo = title.versionNo;
      addParam.versionName = title.versionName;
      addParam.id = title.id;
      if (title.users) {
        title.users.forEach((element) => {
          addParam.updateUserIds.push(element.id.toString());
        });
      }
      if (title.roles) {
        title.roles.forEach((element) => {
          addParam.updateRoleIds.push(element.id);
        });
      }
      if (title.isForceUpdate == 1) {
        addParam.isForceUpdate = true;
      } else {
        addParam.isForceUpdate = false;
      }
    }
    departoptions.data = [];
    useroptions.data = [];
    let param = reactive({
      data: {
        orgCode: 'A03',
        pageNo: 1,
        pageSize: 999,
      },
    });
    // 接口
    const depart = await getAllSysDepart();
    const user = await queryAllUserBackCombo();
    for (let i = depart.result.length - 1; i >= 0; i--) {
      if (depart.result[i].id != '122da6781e2c46f78e6e92ff30b220ff') {
        depart.result.splice(i, 1);
      }
    }
    departoptions.data = depart.result;
    useroptions.data = user.result;
    addVersionDialog.value = true;
  };

  //点击弹框中的确定，新增信息
  const formRef = ref();
  const handleOk = async () => {
    formRef.value
      .validate()
      .then(async () => {
        console.log('values', addParam, toRaw(addParam));
        addParam.updateUserIds = addParam.updateUserIds.toString();
        addParam.updateRoleIds = addParam.updateRoleIds.toString();
        console.log('这里', addParam.updateRoleIds);
        const add = await addNewVersion(addParam);
        if (add.code == 200) {
          if (title1.value == '新增') {
            message.success('添加成功');
          } else {
            message.success('编辑成功');
          }
        } else {
          message.error(add.message);
        }
        addVersionDialog.value = false;
        searchQuery(1);
        close();
        addParam.isForceUpdate = false;
      })
      .catch((error: ValidateErrorEntity<AddParam>) => {
        console.log('error', error);
        addParam.isForceUpdate = false;
        close();
        // alert('添加失败,返回重新添加');
      });
  };

  const dataSource = reactive<any>({
    data: [],
  });

  //查询
  const searchQuery = async (pageNo: any) => {
    dataSource.data = [];
    current1.value = pageNo;
    queryParam.pageIndex = current1.value;

    const data1 = await getUpdateRecord(queryParam);
    console.log(data1);
    const { data, total } = data1;
    total1.value = total;
    dataSource.data.push(...data);
  };

  // 排序
  const handleTableChange = async (pagination, filters, sorter) => {
    queryParam.params.column = sorter.field;
    if (sorter.order == 'ascend') {
      queryParam.params.order = 'asc';
    } else if (sorter.order == 'descend') {
      queryParam.params.order = 'desc';
    }
    console.log('测试一下', sorter);
    await searchQuery(1);
  };
  searchQuery(1); //从第一页开始
</script>

<style lang="less"></style>
