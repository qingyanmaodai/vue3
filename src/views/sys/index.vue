<template>
  <div style="height: 100%">
    <LayoutHeader style="background-color: #fff; height: 60px; padding: 0 20px">
      <div style="display: flex; float: right">
        <a-button type="primary" class="button" @click="onSubmit">保存</a-button>
      </div>
    </LayoutHeader>
    <div class="content">
      <Form class="form" :label-col="{ span: 8 }" :model="formState">
        <FormItem label="仓库维度：" ref="number" name="number" class="formItem">
          <div>
            <Select
              class="select"
              v-model:value="formState[1].val"
              :options="config.STOCK_DIS"
              :disabled="formState[1].bsStatus === 'B'"
            />
          </div>
        </FormItem>
        <FormItem label="是否开启负库存：" class="formItem">
          <Switch
            checkedChildren="开"
            unCheckedChildren="关"
            :checkedValue="'B'"
            :unCheckedValue="'A'"
            v-model:checked="formState[0].val"
            :disabled="formState[0].bsStatus === 'B'"
          />
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Select, Form, FormItem, Switch, Button, LayoutHeader } from 'ant-design-vue';
  const AButton = Button;
  import { onMounted, ref } from 'vue';
  import { config } from '/@/utils/publicParamConfig';
  const { createMessage } = useMessage();
  import { getSystemList, updateSystemList } from '/@/api/system';
  import { useMessage } from '/@/hooks/web/useMessage';
  const formState = ref<any>([{}, {}]);

  onMounted(() => {
    getSystemList({}).then((res) => {
      formState.value = res;
    });
  });
  //保存事件
  const onSubmit = async () => {
    updateSystemList({ params: formState.value })
      .then(() => {
        createMessage.success('操作成功');
      })
      .catch(() => {
        createMessage.error('操作失败');
      });
  };
</script>

<style scoped lang="less">
  .content {
    margin: 10px;
    border: 1px solid #e5e7eb;
    background-color: #fff;
    height: 100%;
    padding: 10px;
  }
  .form {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
  }
  .formItem {
    width: 33%;
  }
  .select {
    width: 16rem;
  }
  .button {
    margin: 15px;
  }
</style>
