<template>
  <div>
    <a-card class="search" style="background-color: #fff">
      <a-form :model="formState" ref="formRef" v-model="formRef">
        <span>物料编码：</span>
        <a-input class="input" v-model:value="formState.wlNo" />
        <span>物料名称：</span>
        <a-input class="input" v-model:value="formState.wlName" />
        <a-button class="button" type="primary" @click="searchEvent">查询</a-button>
        <a-button class="button" type="none" @click="resetEvent">重置</a-button>
        <a-button
          class="button"
          style="background-color: #2f4056; color: #fff"
          @click="moreSearchEvent"
          >高级查询</a-button
        >
      </a-form>
    </a-card>
  </div>
  <hr />
  <!--    高级查询弹框     -->
  <MoreSearch
    style="top: 20px"
    :options="options.data"
    title="高级查询"
    ref="moreSearchRef"
    @moreListEvent="moreListEvent"
    @resetEvent="resetEvent"
  />
</template>
<script lang="ts" setup>
  import { Button, Card, Form, Input } from 'ant-design-vue';
  import MoreSearch from '/@/components/Amoresearch/src/Moresearch.vue';
  import { reactive, ref, UnwrapRef } from 'vue';
  import { getMatOption } from '/@/api/mattable';
  // import { useMessage } from '/@/hooks/web/useMessage';

  const AButton = Button;
  const AForm = Form;
  const AInput = Input;
  const ACard = Card;
  const moreSearchRef: any = ref(null); //高级查询组件ref
  type Emits = {
    (event: 'getKeyword', num: string, name: string): void;
    (event: 'getList', keywords?: object, selected?): void;
    (event: 'refreshTable'): void;
    (event: 'init'): void;
    (event: 'getTableUnitList'): void;
    (event: 'searchList', keywords: object): void;
    (event: 'resetTable'): void;
    (event: 'getMoreKey', moreKeys): void;
  };
  const emit = defineEmits<Emits>();
  //空参数
  const np = { params: '' };
  //查询菜单数据
  const getOptions = async () => {
    const res = await getMatOption(np);
    console.log('op', res);
    moreSearchRef.value.init(res);
  };
  getOptions();
  //查询功能
  // const searchEvent = (keywords) => {
  //   if (formState.wlNo || formState.wlName) {
  //     keywords = [formState.wlNo, formState.wlName];
  //     // emit('searchList', keywords);
  //     emit('getList', keywords);
  //   } else {
  //     useMessage().createMessage.warning('输入不能为空');
  //   }
  // };
  const searchEvent = (num, name) => {
    // if (formState.wlNo || formState.wlName) {
    num = formState.wlNo;
    name = formState.wlName;
    emit('getKeyword', num, name);
    emit('getList');
    // } else {
    //   useMessage().createMessage.warning('输入不能为空');
    // }
  };
  //高级查询中基本单位字段数据
  const init = (data) => {
    moreSearchRef.value.getTableUnitEvent(data);
    console.log('高级查询中基本单位字段数据', data);
  };
  //高级查询
  const moreListEvent = (moreKeys) => {
    emit('getMoreKey', moreKeys);
    emit('getList', moreKeys);
  };
  const moreSearchEvent = () => {
    moreSearchRef.value.mSearch(true);
  };
  interface FormState {
    wlNo: string;
    wlName: string;
  }
  const formRef = ref();
  const formState: UnwrapRef<FormState> = reactive({
    wlNo: '',
    wlName: '',
  });
  // 高级查询关闭
  const moreSearchClose = () => {
    moreSearchRef.value.handleClose();
  };
  //重置
  const resetEvent = () => {
    formState.wlNo = '';
    formState.wlName = '';
    moreSearchRef.value.reset();
    emit('resetTable');
  };
  defineExpose({ moreSearchClose, init, resetEvent }); //initList,searchUnit
  const options = reactive({ data: [] });
</script>

<style scoped lang="less">
  .search {
    display: flex;
    height: 90px;
    padding: 10px;
  }
  .input {
    width: 200px;
    margin: 10px 10px;
  }
  .button {
    margin: 0 10px;
  }
</style>
