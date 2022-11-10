<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <FormItem name="account" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.account"
        :placeholder="t('sys.login.userName')"
        class="fix-auto-fill"
      />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
      />
    </FormItem>
    <ARow class="enter-x">
      <ACol :span="12">
        <FormItem name="captcha">
          <Input
            style="width: 250px; min-width: 250px"
            size="large"
            v-model:value="formData.captcha"
            :placeholder="t('sys.login.captcha')"
          />
        </FormItem>
      </ACol>
      <ACol :span="12">
        <FormItem :style="{ 'text-align': 'right' }">
          <a-image
            :width="120"
            :height="35"
            :src="formData.captchaImg"
            fallback="./resource/img/checkcode.png"
            :preview="false"
            @click="refreshCaptcha"
          />
        </FormItem>
      </ACol>
    </ARow>
    <ARow class="enter-x">
      <ACol :span="12">
<!--        <FormItem>-->
<!--          &lt;!&ndash; No logic, you need to deal with it yourself &ndash;&gt;-->
<!--          <Checkbox v-model:checked="rememberMe" size="small">-->
<!--            {{ t('sys.login.rememberMe') }}-->
<!--          </Checkbox>-->
<!--        </FormItem>-->
      </ACol>
      <ACol :span="12">
        <!--        <FormItem :style="{ 'text-align': 'right' }">-->
        <!--          &lt;!&ndash; No logic, you need to deal with it yourself &ndash;&gt;-->
        <!--          <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">-->
        <!--            {{ t('sys.login.forgetPassword') }}-->
        <!--          </Button>-->
        <!--        </FormItem>-->
      </ACol>
    </ARow>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        {{ t('sys.login.loginButton') }}
      </Button>
      <!-- <Button size="large" class="mt-4 enter-x" block @click="handleRegister">
        {{ t('sys.login.registerButton') }}
      </Button> -->
    </FormItem>
    <!--    <ARow class="enter-x">-->
    <!--      <ACol :md="8" :xs="24">-->
    <!--        <Button block @click="setLoginState(LoginStateEnum.MOBILE)">-->
    <!--          {{ t('sys.login.mobileSignInFormTitle') }}-->
    <!--        </Button>-->
    <!--      </ACol>-->
    <!--      <ACol :md="8" :xs="24" class="!my-2 !md:my-0 xs:mx-0 md:mx-2">-->
    <!--        <Button block @click="setLoginState(LoginStateEnum.QR_CODE)">-->
    <!--          {{ t('sys.login.qrSignInFormTitle') }}-->
    <!--        </Button>-->
    <!--      </ACol>-->
    <!--      <ACol :md="7" :xs="24">-->
    <!--        <Button block @click="setLoginState(LoginStateEnum.REGISTER)">-->
    <!--          {{ t('sys.login.registerButton') }}-->
    <!--        </Button>-->
    <!--      </ACol>-->
    <!--    </ARow>-->

    <!--    <Divider class="enter-x">{{ t('sys.login.otherSignIn') }}</Divider>-->

    <!--    <div class="flex justify-evenly enter-x" :class="`${prefixCls}-sign-in-way`">-->
    <!--      <GithubFilled />-->
    <!--      <WechatFilled />-->
    <!--      <AlipayCircleFilled />-->
    <!--      <GoogleCircleFilled />-->
    <!--      <TwitterCircleFilled />-->
    <!--    </div>-->
  </Form>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed, onMounted } from 'vue';

  import { Checkbox, Form, Input, Row, Col, Button, Divider, Image } from 'ant-design-vue';
  import {
    GithubFilled,
    WechatFilled,
    AlipayCircleFilled,
    GoogleCircleFilled,
    TwitterCircleFilled,
  } from '@ant-design/icons-vue';
  import LoginFormTitle from './LoginFormTitle.vue';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { useUserStore } from '/@/store/modules/user';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getCaptcha } from '/@/api/sys/user';
  import { ResultEnum } from '/@/enums/httpEnum';
  import { PageEnum } from '/@/enums/pageEnum';
  import { router } from '/@/router';
  import { getStockDis } from "/@/api/system";
  //import { onKeyStroke } from '@vueuse/core';

  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const AImage = Image;
  const { t } = useI18n();
  const { notification, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();

  const { setLoginState, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);
  const rememberMe = ref(false);

  const formData = reactive({
    account: '',
    password: '',
    captcha: '',
    captchaImg: '',
    timestamp: 0,
    checkKey: 0,
  });

  const { validForm } = useFormValid(formRef);

  const refreshCaptcha = async (): Promise<any> => {
    formData.checkKey = Date.now();
    const { code, message, result, success, timestamp } = await getCaptcha(formData.checkKey);
    if (code === ResultEnum.SPE_CODE) {
      formData.captchaImg = result;
      formData.timestamp = timestamp;
    }
  };
  onMounted(() => {
    refreshCaptcha();
  });
  const emits = defineEmits<{
    (e: 'changeTenantEvent'): void;
  }>();
  // onKeyStroke('Enter', handleLogin);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login({
        password: data.password,
        username: data.account,
        captcha: formData.captcha,
        checkKey: formData.checkKey,
        mode: 'none', //不要默认的错误提示
      });
      if (userInfo) {
        if (userInfo.tenantList?.length === 1) {
          const uInfo = userStore.getUserInfo;
          userStore.setTenant(userInfo.tenantList[0].id);
          await router.replace(uInfo?.homePath || PageEnum.BASE_HOME);
          const stockDis: any = await getStockDis({});
          localStorage.setItem('stockDis', stockDis);
          notification.success({
            message: t('sys.login.loginSuccessTitle'),
            description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.realName}`,
            duration: 3,
          });
        } else {
          emits('changeTenantEvent');
        }
      }
    } catch (error) {
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
    } finally {
      loading.value = false;
    }
  }
</script>
