<template>
  <a-card>
    <a-space style="margin-bottom: 10px">
      <a-button-group>
        <a-button
          v-for="(value, type) in content.data.paperTypes"
          :type="curPaperType === type ? 'primary' : 'default'"
          @click="setPaper(type, value)"
          :key="type"
        >
          {{ type }}
        </a-button>
      </a-button-group>
      <a-button type="text" @click="changeScale(false)">
        <template #icon>
          <ZoomOutOutlined />
        </template>
      </a-button>
      <InputNumber
        :value="content.data.scaleValue"
        :min="content.data.scaleMin"
        :max="content.data.scaleMax"
        :step="0.1"
        disabled
        style="width: 70px"
        :formatter="(value) => `${(value * 100).toFixed(0)}%`"
        :parser="(value) => value.replace('%', '')"
      />
      <a-button type="text" @click="changeScale(true)">
        <template #icon>
          <ZoomInOutlined />
        </template>
      </a-button>
      <a-button type="primary" @click="preView">
        <template #icon>
          <a-eye-outlined />
        </template>
        预览
      </a-button>
      <a-button type="primary" @click="print">
        <template #icon>
          <PrinterOutlined />
        </template>
        直接打印
      </a-button>
      <a-button type="primary" @click="onlyPrint"> Api单独打印 </a-button>
      <a-button type="primary" @click="onlyPrint2"> Api单独直接打印 </a-button>
      <a-popconfirm title="是否确认清空?" okType="danger" okText="确定清空" @confirm="clearPaper">
        <template #icon>
          <QuestionCircleOutlined style="color: red" />
        </template>
        <a-button type="primary" danger>
          清空
          <template #icon>
            <CloseOutlined />
          </template>
        </a-button>
      </a-popconfirm>
    </a-space>
    <a-row :gutter="[8, 0]">
      <a-col :span="4">
        <a-card style="height: 100vh">
          <a-row>
            <a-col :span="24" class="rect-printElement-types hiprintEpContainer">
              <a-row class="drag_item_title">拖拽组件列表</a-row>
              <a-row style="height: 100px">
                <a-col :span="12" class="drag_item_box">
                  <div>
                    <a class="ep-draggable-item" tid="defaultModule.text" style>
                      <span class="glyphicon glyphicon-text-width" aria-hidden="true"></span>
                      <p class="glyphicon-class">文本</p>
                    </a>
                  </div>
                </a-col>
                <a-col :span="12" class="drag_item_box" tid="defaultModule.text">
                  <div>
                    <a class="ep-draggable-item" tid="defaultModule.image" style>
                      <span class="glyphicon glyphicon-picture" aria-hidden="true"></span>
                      <p class="glyphicon-class">图片</p>
                    </a>
                  </div>
                </a-col>
              </a-row>
              <a-row style="height: 100px">
                <a-col :span="12" class="drag_item_box" tid="defaultModule.text">
                  <div>
                    <a class="ep-draggable-item" tid="defaultModule.longText">
                      <span class="glyphicon glyphicon-subscript" aria-hidden="true"></span>
                      <p class="glyphicon-class">长文</p>
                    </a>
                  </div>
                </a-col>
                <a-col :span="12" class="drag_item_box" tid="defaultModule.text">
                  <div>
                    <a class="ep-draggable-item" tid="defaultModule.tableCustom" style>
                      <span class="glyphicon glyphicon-th" aria-hidden="true"></span>
                      <p class="glyphicon-class">表格</p>
                    </a>
                  </div>
                </a-col>
              </a-row>
              <a-row class="drag_item_title">辅助</a-row>
              <a-row style="height: 100px">
                <a-col :span="12" class="drag_item_box" tid="defaultModule.text">
                  <div>
                    <a class="ep-draggable-item" tid="defaultModule.hline" style>
                      <span class="glyphicon glyphicon-resize-horizontal" aria-hidden="true"></span>
                      <p class="glyphicon-class">横线</p>
                    </a>
                  </div>
                </a-col>
                <a-col :span="12" class="drag_item_box" tid="defaultModule.text">
                  <div>
                    <a class="ep-draggable-item" tid="defaultModule.vline" style>
                      <span class="glyphicon glyphicon-resize-vertical" aria-hidden="true"></span>
                      <p class="glyphicon-class">竖线</p>
                    </a>
                  </div>
                </a-col>
              </a-row>
              <a-row style="height: 100px">
                <a-col :span="12" class="drag_item_box" tid="defaultModule.text">
                  <div>
                    <a class="ep-draggable-item" tid="defaultModule.rect">
                      <span class="glyphicon glyphicon-unchecked" aria-hidden="true"></span>
                      <p class="glyphicon-class">矩形</p>
                    </a>
                  </div>
                </a-col>
                <a-col :span="12" class="drag_item_box" tid="defaultModule.text">
                  <div>
                    <a class="ep-draggable-item" tid="defaultModule.oval">
                      <span class="glyphicon glyphicon-record" aria-hidden="true"></span>
                      <p class="glyphicon-class">椭圆</p>
                    </a>
                  </div>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :span="15">
        <a-card class="card-design">
          <div id="hiprint-printTemplate" class="hiprint-printTemplate"></div>
        </a-card>
      </a-col>
      <a-col :span="5" class="params_setting_container">
        <a-card>
          <a-row class="hinnn-layout-sider">
            <div id="PrintElementOptionSetting"></div>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
    <!-- 预览 -->
    <printPreview ref="preViewRef" />
  </a-card>
</template>
<script setup>
  import { disAutoConnect, hiprint, defaultElementTypeProvider } from 'vue-plugin-hiprint';
  disAutoConnect();
  let hiprintTemplate;
  import printPreview from '/@/views/sys/print/design/preview.vue';
  import {
    CloseOutlined,
    EyeOutlined,
    PrinterOutlined,
    QuestionCircleOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
  } from '@ant-design/icons-vue';
  const AEyeOutlined = EyeOutlined;
  import panel from './panel.js';
  import printData from './print-data.js';
  import {
    message,
    InputNumber,
    ButtonGroup,
    Popconfirm,
    Card,
    Space,
    Button,
    Row,
    Col,
  } from 'ant-design-vue';
  import { computed, onMounted, reactive, ref } from 'vue';
  const ARow = Row;
  const ACard = Card;
  const ACol = Col;
  const AButtonGroup = ButtonGroup;
  const APopconfirm = Popconfirm;
  const ASpace = Space;
  const AButton = Button;
  let preViewRef = ref('');
  let content = reactive({
    data: {
      curPaper: {
        type: 'A4',
        width: 210,
        height: 296.6,
      },
      paperTypes: {
        A3: {
          width: 420,
          height: 296.6,
        },
        A4: {
          width: 210,
          height: 296.6,
        },
        A5: {
          width: 210,
          height: 147.6,
        },
        B3: {
          width: 500,
          height: 352.6,
        },
        B4: {
          width: 250,
          height: 352.6,
        },
        B5: {
          width: 250,
          height: 175.6,
        },
      },
      scaleValue: 1,
      scaleMax: 5,
      scaleMin: 0.5,
    },
  });

  let curPaperType = computed(() => {
    let type = 'other';
    let types = content.data.paperTypes;
    for (const key in types) {
      let item = types[key];
      let { width, height } = content.data.curPaper;
      if (item.width === width && item.height === height) {
        type = key;
      }
    }
    return type;
  });
  onMounted(() => {
    hiprint.init({
      providers: [new defaultElementTypeProvider()],
    });
    // 还原配置
    hiprint.setConfig();
    // 替换配置
    hiprint.setConfig({
      movingDistance: 2.5,
      text: {
        supportOptions: [
          {
            name: 'styler',
            hidden: true,
          },
          {
            name: 'formatter',
            hidden: true,
          },
        ],
      },
    });
    // eslint-disable-next-line no-undef
    hiprint.PrintElementTypeManager.buildByHtml($('.ep-draggable-item'));
    hiprintTemplate = new hiprint.PrintTemplate({
      template: panel,
      settingContainer: '#PrintElementOptionSetting',
      paginationContainer: '.hiprint-printPagination',
    });
    hiprintTemplate.design('#hiprint-printTemplate');
    console.log(hiprintTemplate);
    // 获取当前放大比例, 当zoom时传true 才会有
    content.data.scaleValue = hiprintTemplate.editingPanel.scale || 1;
  });
  /**
   * 设置纸张大小
   * @param type [A3, A4, A5, B3, B4, B5, other]
   * @param value {width,height} mm
   */

  const setPaper = (type, value) => {
    try {
      if (Object.keys(content.data.paperTypes).includes(type)) {
        content.data.curPaper = { type: type, width: value.width, height: value.height };
        hiprintTemplate.setPaper(value.width, value.height);
      } else {
        content.data.curPaper = { type: 'other', width: value.width, height: value.height };
        hiprintTemplate.setPaper(value.width, value.height);
      }
    } catch (error) {
      message.error(`操作失败: ${error}`);
    }
  };
  const changeScale = (big) => {
    let scaleValue = content.data.scaleValue;
    if (big) {
      scaleValue += 0.1;
      if (scaleValue > content.data.scaleMax) scaleValue = 5;
    } else {
      scaleValue -= 0.1;
      if (scaleValue < content.data.scaleMin) scaleValue = 0.5;
    }
    if (hiprintTemplate) {
      // scaleValue: 放大缩小值, false: 不保存(不传也一样), 如果传 true, 打印时也会放大
      hiprintTemplate.zoom(scaleValue);
      content.data.scaleValue = scaleValue;
    }
  };
  const preView = () => {
    preViewRef.value.show(hiprintTemplate, printData);
  };
  const onlyPrint = () => {
    let hiprintTemplate1 = hiprintTemplate.print(
      undefined,
      panel,
      printData,
      {},
      {
        styleHandler: () => {
          let css =
            '<link href="http://hiprint.io/Content/hiprint/css/print-lock.css" media="print" rel="stylesheet">';
          return css;
        },
      },
    );
    console.log(hiprintTemplate1);
  };
  const onlyPrint2 = () => {
    if (window.hiwebSocket.opened) {
      let hiprintTemplate1 = hiprintTemplate.print2(undefined, panel, printData, {
        printer: '',
        title: 'Api单独打印',
        styleHandler: () => {
          let css =
            '<link href="http://hiprint.io/Content/hiprint/css/print-lock.css" media="print" rel="stylesheet">';
          return css;
        },
      });
      let key = 'Api单独直接打印';
      hiprintTemplate1.on('printSuccess', function () {
        hiprintTemplate.notification.success({
          key: key,
          placement: 'topRight',
          message: key + ' 打印成功',
          description: 'Api单独直接打印回调',
        });
      });
      return;
    }
    message.error('客户端未连接,无法直接打印');
  };
  const print = () => {
    if (window.hiwebSocket.opened) {
      const printerList = hiprintTemplate.getPrinterList();
      console.log(printerList);
      hiprintTemplate.print2(printData, { printer: '', title: 'hiprint测试打印' });
      return;
    }
    message.error('客户端未连接,无法直接打印');
  };
  const clearPaper = () => {
    try {
      hiprintTemplate.clear();
    } catch (error) {
      message.error(`操作失败: ${error}`);
    }
  };
</script>
<!--<style src="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" scoped></style>-->
<style lang="less" scoped>
  // 拖拽
  .drag_item_box {
    height: 100%;
    padding: 6px;
  }

  .drag_item_box > div {
    height: 100%;
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .drag_item_box > div > a {
    text-align: center;
    text-decoration-line: none;
  }

  .drag_item_box > div > a > span {
    font-size: 28px;
  }

  .drag_item_box > div > a > p {
    margin: 0;
  }

  .drag_item_title {
    font-size: 16px;
    padding: 12px 6px 0 6px;
    font-weight: bold;
  }

  // 默认图片
  :deep(.hiprint-printElement-image-content) {
    img {
      //content: url('~@/assets/logo.png');
    }
  }

  // 设计容器
  .card-design {
    overflow: hidden;
    overflow-x: auto;
    overflow-y: auto;
  }
</style>
