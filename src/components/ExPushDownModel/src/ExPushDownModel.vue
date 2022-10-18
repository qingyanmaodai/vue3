<template>
  <vxe-modal v-model="visible" width="600" show-footer show-zoom resize>
    <template #title>
      <span>下推</span>
    </template>
    <template #default>
      <div class="content">
        <vxe-radio
          class="contentNode"
          v-for="(item, index) in formState"
          name="n1"
          :key="index"
          label="item"
          :content="item.name"
          @change="change(index)"
        />
      </div>
    </template>
    <template #footer>
      <vxe-button type="submit" status="primary" @click="Submit(PushDownTableName)"
        >提交</vxe-button
      >
      <vxe-button type="reset">取消</vxe-button>
    </template>
  </vxe-modal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { getPushDownList } from '/@/api/invCountSheet';
  const formState = ref<any>([]); //得到的列表保存数据
  const PushDownTableName = ref<string>(''); //单选框切换的表名
  type Emits = {
    (e: 'pushDownSelect', value: any): void;
  };
  const emit = defineEmits<Emits>();
  const props = defineProps({
    tableName: String,
  });

  const visible = ref<boolean>(false); //弹框可见性，默认为关闭

  const show = async () => {
    // console.log(props.tableName, 'props.tableName');
    visible.value = true;
    formState.value = await getPushDownList({
      params: {
        srcBillType: props.tableName,
      },
    });
    // console.log(formState.value, '2222222222222');
  };
  const Submit = (PushDownTableName) => {
    emit('pushDownSelect', PushDownTableName);
  };
  const change = (index) => {
    PushDownTableName.value = formState.value[index].tarBillType;
    console.log(PushDownTableName.value);
  };
  defineExpose({
    show,
    close,
  });
</script>
<style scoped lang="less">
  .content {
    height: 100%;
    padding: 30px;
    display: flex;
    flex-wrap: wrap;
  }
  .contentNode {
    padding-bottom: 20px;
    padding-left: 50px;
    display: flex;
    width: 50%;
    margin: 0 !important;
  }
  .x-button {
    margin: 10px 5px 0 5px;
  }
</style>
