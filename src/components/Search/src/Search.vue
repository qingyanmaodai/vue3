<template>
  <div>
    <a-card class="search" style="background-color: #fff">
      <a-form :model="formState" ref="formRef" v-model="formRef">
        <span>{{ searchNo }}</span>
        <a-input class="input" v-model:value="formState.wlNo" />
        <span>{{ searchName }}</span>
        <a-input class="input" v-model:value="formState.wlName" />
        <a-button class="button" type="primary" @click="searchEvent">查询</a-button>
        <a-button class="button" @click="resetEvent">重置</a-button>
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
  import { MoreSearch } from '/@/components/AMoreSearch';
  import { reactive, ref, UnwrapRef } from 'vue';
  import { getMatOption } from '/@/api/matTable';
  import { SearchDataType, SearchLink, SearchMatchType, SearchParams } from '/@/api/apiLink';

  const AButton = Button;
  const AForm = Form;
  const AInput = Input;
  const ACard = Card;
  //高级查询组件ref
  const moreSearchRef: any = ref(null);
  const options = reactive({ data: [] });
  //空参数
  const paramsNull = { params: '' };
  const props = defineProps({
    tableName: {
      type: String,
      default: '',
    },
    searchNo: {
      type: String,
      default: '',
    },
    searchName: {
      type: String,
      default: '',
    },
  });
  interface FormState {
    wlNo: string;
    wlName: string;
    tableName: string;
    searchNo: string;
    searchName: string;
  }
  const formRef = ref();
  const formState: UnwrapRef<FormState> = reactive({
    wlNo: '',
    wlName: '',
    tableName: props.tableName,
    searchNo: props.searchNo,
    searchName: props.searchName,
  });
  type Emits = {
    (event: 'getList', keywords?: object, selected?): void;
    (event: 'resetEvent'): void;
  };
  const emit = defineEmits<Emits>();
  const getSearchParams = (): SearchParams[] => {
    let searchParams: SearchParams[] = [];
    if (formState.wlNo) {
      searchParams.push({
        table: formState.tableName,
        name: 'number',
        column: 'number',
        link: SearchLink.AND,
        rule: SearchMatchType.LIKE,
        type: SearchDataType.string,
        val: formState.wlNo,
        startWith: '',
        endWith: '',
      });
    }
    if (formState.wlName) {
      searchParams.push({
        table: formState.tableName,
        name: 'name',
        column: 'name',
        link: SearchLink.AND,
        rule: SearchMatchType.LIKE,
        type: SearchDataType.string,
        val: formState.wlName,
        startWith: '',
        endWith: '',
      });
    }
    if (moreSearchRef.value.getSearchParams() && moreSearchRef.value.getSearchParams().length > 0) {
      searchParams = searchParams.concat(moreSearchRef.value.getSearchParams());
    }
    return searchParams;
  };

  //查询菜单数据
  const getOptions = async () => {
    const res = await getMatOption(paramsNull);
    moreSearchRef.value.initOptions(res);
  };
  getOptions();
  //查询功能
  const searchEvent = () => {
    emit('getList');
  };

  //高级查询
  const moreListEvent = () => {
    emit('getList');
  };
  // 高级查询打开
  const moreSearchEvent = () => {
    moreSearchRef.value.mSearch(true);
  };
  // 高级查询关闭
  const moreSearchClose = () => {
    moreSearchRef.value.handleClose();
  };
  //重置
  const resetEvent = () => {
    formState.wlNo = '';
    formState.wlName = '';
    if (moreSearchRef.value) {
      moreSearchRef.value.resetEvent();
    }
    emit('resetEvent');
  };
  defineExpose({ moreSearchClose, formState, getSearchParams, resetEvent });
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
