<template>
  <a-modal
    :visible="content.data.visible"
    :maskClosable="false"
    :bodyStyle="{ padding: 0 }"
    @cancel="hideModal"
    :width="content.data.width + 'mm'"
  >
    <a-spin :spinning="content.data.spinning" style="min-height: 100px">
      <div id="preview_content"></div>
    </a-spin>
    <template #title>
      <a-space>
        <div style="margin-right: 20px">打印预览</div>
        <a-button :loading="content.data.waitShowPrinter" type="primary" @click.stop="print">
          <template #icon>
            <PrinterOutlined />
          </template>
          打印
        </a-button>
        <a-button type="primary" @click.stop="toPdf">
          <template #icon>
            <PrinterOutlined />
          </template>
          pdf
        </a-button>
      </a-space>
    </template>
    <template #footer>
      <a-button type="default" @click="hideModal">
        <template #icon>
          <CloseOutlined />
        </template>
        关闭
      </a-button>
    </template>
  </a-modal>
</template>

<script setup>
  import { PrinterOutlined, CloseOutlined } from '@ant-design/icons-vue';
  import { Spin, Modal, Space, Button } from 'ant-design-vue';
  import { reactive } from 'vue';
  const ASpin = Spin;
  const AModal = Modal;
  const ASpace = Space;
  const AButton = Button;
  let content = reactive({
    data: {
      visible: false,
      spinning: true,
      waitShowPrinter: false,
      // 纸张宽 mm
      width: 0,
      // 模板
      hiprintTemplate: {},
      // 数据
      printData: {},
    },
  });
  const hideModal = () => {
    content.data.visible = false;
  };
  const show = (hiprintTemplate, printData, width = '210') => {
    content.data.visible = true;
    content.data.spinning = true;
    content.data.width = width;
    content.data.hiprintTemplate = hiprintTemplate;
    content.data.printData = printData;
    setTimeout(() => {
      // eslint-disable-next-line no-undef
      $('#preview_content').html(hiprintTemplate.getHtml(printData));
      content.data.spinning = false;
    }, 500);
  };
  const print = () => {
    content.data.waitShowPrinter = true;
    this.hiprintTemplate.print(
      content.data.printData,
      {},
      {
        callback: () => {
          console.log('callback');
          content.data.waitShowPrinter = false;
        },
      },
    );
  };
  const toPdf = () => {
    data.hiprintTemplate.toPdf({}, '打印预览');
  };
  defineExpose({
    show,
  });
</script>
