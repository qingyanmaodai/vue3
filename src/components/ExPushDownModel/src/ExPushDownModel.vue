<template>
  <vxe-modal v-model="visible" width="600" show-footer>
    <template #title>
      <span>下推</span>
    </template>
    <template #default>
      <div class="content">
        <vxe-radio
          class="contentNode"
          v-for="item in formState"
          name="n1"
          v-model="item.tarBillType"
          label="1"
          :content="item.name"
        />
      </div>
      <span style="display: flex; float: right">
      <button class="x-button">重置</button>
      <button class="x-button">取消</button>
      <button class="x-button">查询</button>
    </span>
    </template>

  </vxe-modal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { getPushDown } from '/@/api/invCountSheet';
  const formState = ref<any>([]);
  const props = defineProps({
    tableName: String,
  });
  const visible = ref<boolean>(false);

  const show = async () => {
    console.log(props.tableName, 'props.tableName');
    visible.value = true;
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
  .x-button {
    margin: 10px 5px 0 5px;
  }
</style>
