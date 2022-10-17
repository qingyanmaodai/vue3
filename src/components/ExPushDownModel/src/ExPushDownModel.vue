<template>
  <vxe-modal v-model="demo1.value1" width="600" show-footer>
    <template #title>
      <span style="color: #ff6a00">自定义标题</span>
    </template>
    <template #corner>
      <vxe-icon name="bell-fill" />
      <vxe-icon name="minus" />
    </template>
    <template #default>
      <div class="content">
        <vxe-radio
          class="contentNode"
          v-for="item in 6"
          name="n1"
          v-model="item.value1"
          label="1"
          content="默认尺寸"
        />
      </div>
    </template>
  </vxe-modal>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  const demo1 = reactive({
    value1: true
  });

  const show = () => {
    demo1.value1 = true;
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
