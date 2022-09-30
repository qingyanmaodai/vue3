<template>
  <div>
    <div class="search" style="background-color: #fff">
      <div v-show="props.showSearchNo">
        <span>{{ searchNo }}</span>
        <a-input class="input" v-model:value="formState.wlNo" />
      </div>
      <div v-show="props.showSearchName">
        <span>{{ searchName }}</span>
        <a-input class="input" v-model:value="formState.wlName" />
      </div>
      <div>
        <a-button class="button" type="primary" @click="searchEvent">查询</a-button>
        <a-button class="button" @click="resetEvent">重置</a-button>
        <a-button
          class="button"
          style="background-color: #2f4056; color: #fff"
          @click="moreSearchEvent"
          >高级查询</a-button
        >
      </div>
    </div>
  </div>
  <hr />
  <!--    高级查询弹框     -->
  <MoreSearch ref="moreSearchRef" @moreListEvent="moreListEvent" />
</template>
<script lang="ts" setup>
  import { Button, Input } from 'ant-design-vue';
  import { MoreSearch } from '/@/components/AMoreSearch';
  import { reactive, ref, UnwrapRef } from 'vue';
  import { SearchDataType, SearchLink, SearchMatchType, SearchParams } from '/@/api/apiLink';

  const AButton = Button;
  const AInput = Input;

  //高级查询组件ref
  const moreSearchRef: any = ref(null);
  // const options = reactive({ data: [] });
  const props = defineProps({
    tableName: {
      type: String,
      default: '',
    },
    showSearchNo: {
      type: Boolean,
      default: true,
    },
    showSearchName: {
      type: Boolean,
      default: true,
    },
    searchNo: {
      type: String,
      default: '',
    },
    searchName: {
      type: String,
      default: '',
    },
    searchTwo: {
      type: String,
      default: 'name',
    },
    searchOne: {
      type: String,
      default: 'number',
    },
  });
  interface FormState {
    wlNo: string;
    wlName: string;
    tableName: string;
    searchNo: string;
    searchName: string;
    searchOne: string;
    searchTwo: string;
  }

  const formState: UnwrapRef<FormState> = reactive({
    wlNo: '',
    wlName: '',
    tableName: props.tableName,
    searchNo: props.searchNo,
    searchName: props.searchName,
    searchOne: props.searchOne,
    searchTwo: props.searchTwo,
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
        name: formState.searchOne,
        column: formState.searchOne,
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
        name: formState.searchTwo,
        column: formState.searchTwo,
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
  let res: any = [];
  //查询高级查询字段数据
  const getOptions = async (moreSearchData) => {
    res = moreSearchData;
    moreSearchRef.value.initOptions(res);
  };
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
    emit('resetEvent');
    if (moreSearchRef.value) {
      moreSearchRef.value.resetEvent();
    }
  };
  defineExpose({ moreSearchClose, getOptions, formState, getSearchParams, resetEvent });
</script>

<style scoped lang="less">
  .search {
    display: flex;
    height: 75px;
    padding: 10px;
  }
  .input {
    width: 200px;
    margin: 10px 10px;
  }
  .button {
    margin: 10px 10px;
  }
</style>
