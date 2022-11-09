<template>
  <div>
    <div class="search" style="background-color: #fff">
      <div v-show="props.showSearchNo">
        <span>{{ props.searchNo }}</span>
        <a-input class="input" v-model:value="formState.wlNo" />
      </div>
      <div v-show="props.showSearchName">
        <span>{{ props.searchName }}</span>
        <a-input class="input" v-model:value="formState.wlName" />
      </div>
      <div>
        <a-button class="button" type="primary" @click="searchEvent">查询</a-button>
        <a-button class="button" @click="resetEvent">重置/刷新</a-button>
        <a-button
          class="button"
          style="background-color: #2f4056; color: #fff"
          v-show="props.showMoreSearch"
          @click="moreSearchEvent"
          >高级查询</a-button
        >
      </div>
    </div>
  </div>
  <hr />
  <!--    高级查询弹框     -->

  <MoreSearch
    :tableName="props.tableName"
    ref="moreSearchRef"
    @searchEvent="searchEvent"
    :control="props.control"
  />
</template>
<script lang="ts" setup>
  import { Button, Input } from 'ant-design-vue';
  import { MoreSearch } from '/@/components/AMoreSearch';
  import { reactive, ref, UnwrapRef } from 'vue';
  import {
    SearchDataType,
    SearchLink,
    SearchMatchType,
    SearchParams,
    ControlSet,
  } from '/@/api/apiLink';

  const AButton = Button;
  const AInput = Input;
  //高级查询组件ref
  const moreSearchRef: any = ref(null);
  interface ProType {
    tableName: string;
    showSearchNo?: boolean;
    showSearchName?: boolean;
    showMoreSearch?: boolean;
    searchNo?: string;
    searchName?: string;
    control?: ControlSet[];
  }
  const props = withDefaults(defineProps<ProType>(), {
    tableName: '',
    showSearchNo: true,
    showSearchName: true,
    showMoreSearch: true,
    searchNo: '',
    searchName: '',
    control: () => {
      return [];
    },
  });
  interface FormState {
    wlNo: string;
    wlName: string;
    tableName: string;
    searchNo: string;
    searchName: string;
  }

  const formState: UnwrapRef<FormState> = reactive({
    wlNo: '',
    wlName: '',
    wlMatID: '',
    wlStockId: '',
    wlCompartmentId: '',
    wlLocationId: '',
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
  //查询功能
  const searchEvent = () => {
    emit('getList');
  };
  // 高级查询打开
  const moreSearchEvent = () => {
    moreSearchRef.value.show();
  };
  // 高级查询关闭
  const moreSearchClose = () => {
    moreSearchRef.value.close();
  };
  //重置
  const resetEvent = () => {
    emit('resetEvent');
    if (moreSearchRef.value) {
      moreSearchRef.value.resetEvent();
    }
  };
  defineExpose({ moreSearchClose, formState, getSearchParams });
</script>

<style scoped lang="less">
  .search {
    display: flex;
    height: 75px;
    padding: 10px;
    div {
      display: flex;
      align-items: center;
      span {
        white-space: nowrap;
      }
    }
  }
  .input {
    width: 200px;
    margin: 10px 10px;
  }
  .button {
    margin: 10px 10px;
  }
</style>
