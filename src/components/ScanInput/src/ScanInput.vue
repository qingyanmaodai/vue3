<template>
  <div>
    <a-form :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
      <a-form-item :label="formState.name">
        <a-input
          :class="keyName"
          ref="scanInput"
          size="large"
          v-model:value="formState.val"
          @focus="inputFocus"
          @blur="inputBlur"
          @input="inputEvent"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
  import { Form, FormItem, Input } from 'ant-design-vue';
  import { UnwrapRef, reactive, ref, onMounted, unref } from 'vue';
  import { ScanHook, snInfo } from '/@/api/utilApi';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  const AForm = Form;
  const AFormItem = FormItem;
  const AInput = Input;
  // const scanInput = ref<HTMLElement>(null);
  const scanInput: any = ref(null);
  const di = new Audio('./audio/di.mp3');
  const emits = defineEmits<{
    (e: 'autoChangeFocus', name?: string, isFocus?: boolean): void;
    (e: 'getInputContent', name: string, val: string): void;
    (e: 'scanEvent', info: any, callback: Function): void;
  }>();
  const props = defineProps({
    label: {
      type: String,
      default: '出库单号或快递单号',
    },
    val: {
      type: String,
      default: '',
    },
    autoFocus: {
      type: Boolean,
      default: true,
    },
    keyName: {
      type: String,
      default: '',
    },
  });
  interface FormModel {
    name: string;
    val: string;
  }
  const formState: FormModel = reactive({ name: props.label, val: props.val });
  const hasFocus = (): boolean => {
    const focusElement: Element | null = document.activeElement;
    let flag = false;
    if (focusElement) {
      focusElement.classList.forEach((className) => {
        if (className === props.keyName) {
          flag = true;
        }
      });
    }
    return flag;
  };
  //自动选取焦点组件元素
  const inputChangeFocus = (name: string, isFocus: boolean) => {
    emits('autoChangeFocus', name, isFocus);
  };
  const inputFocus = () => {
    if (props.autoFocus) {
      scanInput.value.focus();
      inputChangeFocus(props.keyName, true);
    }
  };
  const inputBlur = () => {
    if (props.autoFocus) {
      inputChangeFocus(props.keyName, false);
    }
  };
  const timerForSnSearch = async (val: string) => {
    try {
      // await di.play();
      const barcodeInfo = await snInfo(val, 'none');
      if (!Object.keys(barcodeInfo) || Object.keys(barcodeInfo).length === 0) {
        throw new Error('查询不到条码信息!');
      }
      emits('scanEvent', barcodeInfo, (res: boolean, message: string) => {
        if (res) {
          ScanHook.afterScan(true);
        } else {
          ScanHook.afterScan(false);
          createMessage.error(message);
          console.log(message);
        }
        formState.val = '';
      });
    } catch (e: any) {
      ScanHook.afterScan(false);
      createMessage.error(e.message);
      formState.val = '';
    }
  };
  let timerSnSearchId: NodeJS.Timeout;
  let diTimer: NodeJS.Timeout;
  const inputEvent = () => {
    if (diTimer) clearTimeout(diTimer);
    diTimer = setTimeout(() => {
      di.play();
    }, 300);
    if (props.keyName === 'snInput') {
      if (timerSnSearchId) clearTimeout(timerSnSearchId);
      if (formState.val) {
        formState.val = formState.val.replace(/[\r\n]/g, ''); //去掉回车换行
        timerSnSearchId = setTimeout(() => {
          timerForSnSearch(formState.val?.toUpperCase());
        }, 100);
      }
    } else {
      emits('getInputContent', props.keyName, formState.val?.toUpperCase());
    }
  };
  onMounted(() => {
    if (props.autoFocus) {
      inputFocus();
    }
  });
  defineExpose({ inputFocus, hasFocus, inputBlur, formState });
</script>

<style scoped>
  :deep(.ant-form-item-label label) {
    font-size: 16px;
  }
</style>
