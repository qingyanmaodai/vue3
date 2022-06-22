<template>
  <div>
    <a-modal :visible="data.visible" :title="props.title" @ok="handleOk" @cancel="handleCancel">
      <div style="padding: 12px">
        <Row>
          <Col :span="8" style="left: 24%; padding-top: 5px"> 数量: </Col>
          <Col :span="16">
            <a-input-number
              style="width: 200px"
              id="inputNumber"
              v-model:value="data.val"
              :min="1"
              :max="data.max"
            />
          </Col>
        </Row>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { Modal, InputNumber, Row, Col } from 'ant-design-vue';
  import { reactive, toRefs, watch, computed } from 'vue';
  const AModal = Modal;
  const AInputNumber = InputNumber;
  interface dProps {
    visible?: boolean;
    title?: string;
    val?: number;
    id?: number;
    max?: number;
    keyNum?: string | number;
    currData?: any;
    // stock?: Stock[];
  }
  let props = withDefaults(defineProps<dProps>(), {
    visible: false,
    title: '',
    val: 1,
    max: 100000,
    id: -1,
    keyNum: '',
    currData: () => {},
  });
  const data: dProps = reactive({
    visible: props.visible,
    title: props.title,
    val: props.val,
    max: props.max,
    id: props.id,
    keyNum: props.keyNum,
    currData: props.currData,
  });
  const emits = defineEmits<{
    (e: 'handleCancel'): void;
    (e: 'handleOk', data: any, qty: number): void;
  }>();
  watch(props, (o, n) => {
    data.visible = n.visible;
    data.val = n.val;
    data.max = n.max;
    data.currData = n.currData;
  });
  const handleOk = () => {
    data.visible = false;
    emits('handleOk', data.currData, data.val ? data.val : 1);
  };
  const handleCancel = () => {
    data.visible = false;
    emits('handleCancel');
  };
</script>

<style scoped></style>
