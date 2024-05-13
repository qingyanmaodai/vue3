<template>
  <a-modal
<<<<<<< HEAD
    :visible="visible"
    :maskClosable="false"
    :bodyStyle="{ padding: 0 }"
    @cancel="hideModal"
    :width="width + 'mm'"
  >
    <a-spin :spinning="spinning" style="min-height: 100px">
=======
    :visible="content.data.visible"
    :maskClosable="false"
    :bodyStyle="{ padding: 0 }"
    @cancel="hideModal"
    :width="content.data.width + 'mm'"
  >
    <a-spin :spinning="content.data.spinning" style="min-height: 100px">
>>>>>>> dev_lkf_230201_条码模块
      <div id="preview_content"></div>
    </a-spin>
    <template #title>
      <a-space>
        <div style="margin-right: 20px">打印预览</div>
<<<<<<< HEAD
        <a-button :loading="waitShowPrinter" type="primary" @click.stop="print">
=======
        <a-button :loading="content.data.waitShowPrinter" type="primary" @click.stop="print">
>>>>>>> dev_lkf_230201_条码模块
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
<<<<<<< HEAD
      <a-button type="info" @click="hideModal">
=======
      <a-button type="default" @click="hideModal">
>>>>>>> dev_lkf_230201_条码模块
        <template #icon>
          <CloseOutlined />
        </template>
        关闭
      </a-button>
    </template>
  </a-modal>
</template>

<<<<<<< HEAD
<script>
  import { PrinterOutlined, CloseOutlined } from '@ant-design/icons-vue';
  import { Space, Spin, Modal, Button } from 'ant-design-vue';
  export default {
    name: 'PrintPreview',
    components: {
      PrinterOutlined,
      CloseOutlined,
      ASpace: Space,
      ASpin: Spin,
      AModal: Modal,
      AButton: Button,
    },
    props: {},
    data() {
      return {
        visible: false,
        spinning: true,
        waitShowPrinter: false,
        // 纸张宽 mm
        width: 0,
        // 模板
        hiprintTemplate: {},
        // 数据
        printData: {},
      };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {
      hideModal() {
        this.visible = false;
      },
      show(hiprintTemplate, printData, width = '210') {
        this.visible = true;
        this.spinning = true;
        this.width = width;
        this.hiprintTemplate = hiprintTemplate;
        this.printData = printData;
        setTimeout(() => {
          // eslint-disable-next-line no-undef
          $('#preview_content').html(hiprintTemplate.getHtml(printData));
          this.spinning = false;
        }, 500);
      },
      print() {
        this.waitShowPrinter = true;
        this.hiprintTemplate.print(
          this.printData,
          {},
          {
            callback: () => {
              this.waitShowPrinter = false;
            },
          },
        );
      },
      toPdf() {
        this.hiprintTemplate.toPdf(this.printData, '打印预览pdf');
      },
    },
  };
</script>
=======
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
    content.data.hiprintTemplate.print(
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
    content.data.hiprintTemplate.toPdf({}, '打印预览');
  };
  defineExpose({
    show,
  });
</script>
<style lang="less" scoped>
  .ant-modal-body {
    padding: 0px !important;
  }
</style>
>>>>>>> dev_lkf_230201_条码模块
