<template>
  <div class="p-4">
    <Row>
      <Col :span="3" />
      <Col class="leftbiv" :span="10">
        <TypographyTitle :level="2" style="color: white">{{ username }}</TypographyTitle>
        <TypographyTitle :level="3" style="color: white">欢迎登录</TypographyTitle>
        <TypographyTitle :level="3" style="color: white">溯 源 后 台 管 理 系 统</TypographyTitle>
      </Col>
      <Col :span="1" />
      <Col class="rightbiv" :span="10">
        <img src="../../../assets/svg/tjt.svg" width="200" height="200" />
      </Col>
    </Row>
  </div>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  import { TypographyTitle, Row, Col } from 'ant-design-vue';

  //当前登录用户信息
  const userStore = useUserStore();
  const username = computed(() => userStore.getPdaUserInfo.username);
</script>

<style lang="less" scoped>
  .p-4 {
    background-color: rgb(58, 143, 247);
    height: 100%;
  }
  .leftbiv {
    margin: 200px 0px 0px 0px;
  }
  .rightbiv {
    margin: 180px 0px 0px 0px;
  }
</style>
