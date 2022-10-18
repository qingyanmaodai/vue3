<template>
  <vxe-modal v-model="demo1.value1" width="600" show-footer>
    <template #title>
      <span>下推</span>
    </template>
    <template #default>
      <div class="content">
        <vxe-radio
          class="contentNode"
          v-for="item in formState"
          name="n1"
          v-model="item.id"
          label="1"
          :content="item.name"
        />
      </div>
    </template>
  </vxe-modal>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { getPushDown } from '/@/api/invCountSheet';
  const formState = ref<any>([{}, {}]);
  const props = defineProps({
    tableName: String,
  });
  const demo1 = reactive({
    value1: false,
  });

  const show = async () => {
    console.log(props.tableName, 'props.tableName');
    demo1.value1 = true;
    // formState.value = await getPushDown({
    //   srcBillType: props.tableName,
    // });
    formState.value = await getPushDown({
      params: {
        srcBillType: props.tableName,
      },
    });
    console.log(formState.value, '2222222222222');
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
</style>
