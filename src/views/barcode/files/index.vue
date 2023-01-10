<template>
  <a-card>
    <a-row :gutter="[8, 0]" style="margin-bottom: 10px">
      <a-col :span="4">
        <!-- 模板选择 -->
        <a-select
          v-model="mode"
          showSearch
          @change="changeMode"
          :defaultValue="0"
          option-label-prop="label"
          style="width: 100%"
        >
          <a-select-option v-for="(opt, idx) in modeList" :key="idx" :label="opt.name" :value="idx">
            {{ opt.name }}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="20">
        <a-space>
          <!-- 纸张设置 -->
          <a-button-group>
            <a-button
              v-for="(value, type) in paperTypes"
              :type="curPaperType === type ? 'primary' : 'info'"
              @click="setPaper(type, value)"
              :key="type"
            >
              {{ type }}
            </a-button>
            <a-popover v-model="paperPopVisible" title="设置纸张宽高(mm)" trigger="click">
              <template #content>
                <a-input-group compact style="margin: 10px 10px">
                  <a-input
                    type="number"
                    v-model="paperWidth"
                    style="width: 100px; text-align: center"
                    placeholder="宽(mm)"
                  />
                  <a-input
                    style="width: 30px; border-left: 0; pointer-events: none; backgroundcolor: #fff"
                    placeholder="~"
                    disabled
                  />
                  <a-input
                    type="number"
                    v-model="paperHeight"
                    style="width: 100px; text-align: center; border-left: 0"
                    placeholder="高(mm)"
                  />
                </a-input-group>
                <a-button type="primary" style="width: 100%" @click="otherPaper">确定</a-button>
              </template>
              <a-button :type="'other' == curPaperType ? 'primary' : ''">自定义纸张</a-button>
            </a-popover>
          </a-button-group>
          <a-button type="text" @click="changeScale(false)">
            <template #icon>
              <ZoomOutOutlined />
            </template>
          </a-button>
          <a-input-number
            :value="scaleValue"
            :min="scaleMin"
            :max="scaleMax"
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
          <!-- 预览/打印 -->
          <a-button-group>
            <a-button type="primary" @click="preView">
              <template #icon>
                <EyeOutlined />
              </template>
              预览
            </a-button>
            <a-button type="primary" @click="print">
              <template #icon>
                <PrinterOutlined />
              </template>
              直接打印
            </a-button>
          </a-button-group>
          <!-- 保存/清空 -->
          <a-button-group>
            <a-button type="primary" @click="save">
              <template #icon>
                <SaveOutlined />
              </template>
              保存
            </a-button>
            <a-popconfirm
              title="是否确认清空?"
              okType="danger"
              okText="确定清空"
              @confirm="clearPaper"
            >
              <template #icon>
                <QuestionCircleOutlined style="color: red" />
              </template>
              <a-button type="danger">
                清空
                <template #icon>
                  <CloseOutlined />
                </template>
              </a-button>
            </a-popconfirm>
          </a-button-group>
        </a-space>
      </a-col>
    </a-row>
    <a-row :gutter="[8, 0]">
      <a-col :span="4">
        <a-card style="height: 100vh">
          <a-row>
            <a-col :span="24" class="rect-printElement-types hiprintEpContainer" />
          </a-row>
        </a-card>
      </a-col>
      <a-col :span="14">
        <a-card class="card-design">
          <div id="hiprint-printTemplate" class="hiprint-printTemplate"></div>
        </a-card>
      </a-col>
      <a-col :span="6" class="params_setting_container">
        <a-card>
          <a-row class="hinnn-layout-sider">
            <div id="PrintElementOptionSetting"></div>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
    <!-- 预览 -->
    <print-preview ref="preViewRef" />
  </a-card>
</template>

<script setup name="PrintCustom">
  import printPreview from './preview.vue';

  import { hiprint } from 'vue-plugin-hiprint';
  import providers from './providers.js';
  import printData from './print-data.js';
  import {
    ZoomOutOutlined,
    ZoomInOutlined,
    EyeOutlined,
    PrinterOutlined,
    SaveOutlined,
    QuestionCircleOutlined,
    CloseOutlined,
  } from '@ant-design/icons-vue';
  import {
    message,
    Card,
    Row,
    Col,
    Space,
    Input,
    InputGroup,
    InputNumber,
    Select,
    SelectOption,
    Popover,
    Popconfirm,
    Button,
    ButtonGroup,
  } from 'ant-design-vue';
  const ACard = Card;
  const ARow = Row;
  const ACol = Col;
  const ASpace = Space;
  const AInput = Input;
  const AInputGroup = InputGroup;
  const AInputNumber = InputNumber;
  const ASelect = Select;
  const ASelectOption = SelectOption;
  const APopover = Popover;
  const APopconfirm = Popconfirm;
  const AButton = Button;
  const AButtonGroup = ButtonGroup;
  import { computed, onMounted, reactive, ref } from 'vue';
  import { store } from '/@/utils/index';
  let hiprintTemplate;
  const preViewRef = ref('');
  // 模板选择
  const mode = ref(0);
  const modeList = ref([]);
  let curPaper = reactive({
    type: 'other',
    width: 220,
    height: 80,
  });
  // 纸张类型
  let paperTypes = reactive({
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
  });
  const scaleValue = ref(1);
  const scaleMax = ref(5);
  const scaleMin = ref(0);
  // 自定义纸张
  const paperPopVisible = ref(false);
  const paperWidth = ref(220);
  const paperHeight = ref(80);
  // const
  //   data() {
  //     return {
  //       // 模板选择
  //       mode: 0,
  //       modeList: [],
  //       // 当前纸张
  //       curPaper: {
  //         type: 'other',
  //         width: 220,
  //         height: 80,
  //       },
  //       // 纸张类型
  //       paperTypes: {
  //         A3: {
  //           width: 420,
  //           height: 296.6,
  //         },
  //         A4: {
  //           width: 210,
  //           height: 296.6,
  //         },
  //         A5: {
  //           width: 210,
  //           height: 147.6,
  //         },
  //         B3: {
  //           width: 500,
  //           height: 352.6,
  //         },
  //         B4: {
  //           width: 250,
  //           height: 352.6,
  //         },
  //         B5: {
  //           width: 250,
  //           height: 175.6,
  //         },
  //       },
  //       scaleValue: 1,
  //       scaleMax: 5,
  //       scaleMin: 0.5,
  //       // 自定义纸张
  //       paperPopVisible: false,
  //       paperWidth: '220',
  //       paperHeight: '80',
  //     };
  //   },
  const curPaperType = computed(() => {
    let type = 'other';
    let types = paperTypes;
    for (const key in types) {
      let item = types[key];
      let { width, height } = curPaper;
      if (item.width === width && item.height === height) {
        type = key;
      }
    }
    return type;
  });
  onMounted(() => {
    init();
    otherPaper();
  });
  // methods: {
  const init = () => {
    modeList.value = providers.map((e) => {
      return { type: e.type, name: e.name, value: e.value };
    });
    changeMode();
  };
  const changeMode = () => {
    let provider = providers[mode.value];
    hiprint.init({
      providers: [provider.f],
    });
    $('.hiprintEpContainer').empty();
    hiprint.PrintElementTypeManager.build('.hiprintEpContainer', provider.value);
    $('#hiprint-printTemplate').empty();
    // let templates = this.$ls.get('KEY_TEMPLATES', {});
    let templates = store.get('KEY_TEMPLATES', {});
    let template = templates[provider.value] ? templates[provider.value] : {};
    hiprintTemplate = new hiprint.PrintTemplate({
      template: template,
      settingContainer: '#PrintElementOptionSetting',
      paginationContainer: '.hiprint-printPagination',
    });
    hiprintTemplate.design('#hiprint-printTemplate');
    console.log(hiprintTemplate);
    // 获取当前放大比例, 当zoom时传true 才会有
    scaleValue.value = hiprintTemplate.editingPanel.scale || 1;
  };
  /**
   * 设置纸张大小
   * @param type [A3, A4, A5, B3, B4, B5, other]
   * @param value {width,height} mm
   */
  const setPaper = (type, value) => {
    try {
      if (Object.keys(paperTypes).includes(type)) {
        curPaper = { type: type, width: value.width, height: value.height };
        hiprintTemplate.setPaper(value.width, value.height);
      } else {
        curPaper = { type: 'other', width: value.width, height: value.height };
        hiprintTemplate.setPaper(value.width, value.height);
      }
    } catch (error) {
      message.error(`操作失败: ${error}`);
    }
  };
  const changeScale = (big) => {
    let scaleValue = scaleValue.value;
    if (big) {
      scaleValue += 0.1;
      if (scaleValue > scaleMax.value) scaleValue = 5;
    } else {
      scaleValue -= 0.1;
      if (scaleValue < scaleMin.value) scaleValue = 0.5;
    }
    if (hiprintTemplate) {
      // scaleValue: 放大缩小值, false: 不保存(不传也一样), 如果传 true, 打印时也会放大
      hiprintTemplate.zoom(scaleValue, true);
      scaleValue.value = scaleValue;
    }
  };
  const otherPaper = () => {
    let value = {};
    value.width = paperWidth.value;
    value.height = paperHeight.value;
    paperPopVisible.value = false;
    setPaper('other', value);
  };
  const preView = () => {
    let { width } = curPaper;
    preViewRef.value.show(hiprintTemplate, printData, width);
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
  const save = () => {
    let provider = providers[mode.value];
    setTemplate({
      name: provider.value,
      json: hiprintTemplate.getJson(),
    });
  };
  const setTemplate = (payload) => {
    // let templates = this.$ls.get('KEY_TEMPLATES', {});
    let templates = store.get('KEY_TEMPLATES', {});
    console.log(payload.json);
    templates[payload.name] = payload.json;
    store.set('KEY_TEMPLATES', templates);
    // this.$ls.set('KEY_TEMPLATES', templates);
    message.info('保存成功');
  };
  const clearPaper = () => {
    try {
      hiprintTemplate.clear();
    } catch (error) {
      message.error(`操作失败: ${error}`);
    }
  };
  // },
  // };
</script>

<style lang="less" scoped>
  // build 拖拽
  :deep(.hiprint-printElement-type > li > ul > li > a) {
    padding: 4px 4px;
    color: #1296db;
    line-height: 1;
    height: auto;
    text-overflow: ellipsis;
  }

  // 默认图片
  :deep(.hiprint-printElement-image-content) {
    img {
      content: url('~@/assets/logo.png');
    }
  }

  // 设计容器
  .card-design {
    overflow: hidden;
    overflow-x: auto;
    overflow-y: auto;
  }
</style>
