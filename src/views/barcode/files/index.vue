<template>
<<<<<<< HEAD
  <a-card>
    <a-row :gutter="[8, 0]" style="margin-bottom: 10px">
      <a-col :span="4">
        <!-- 模板选择 -->
        <a-select
          v-model="mode"
=======
  <div class="scrollbox">
    <a-card>
      <a-space style="margin-bottom: 10px">
        <!-- 模板选择 -->
        <a-select
          v-model="content.data.mode"
>>>>>>> dev_lkf_230201_条码模块
          showSearch
          @change="changeMode"
          :defaultValue="0"
          option-label-prop="label"
          style="width: 100%"
        >
<<<<<<< HEAD
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
=======
          <a-select-option
            v-for="(opt, idx) in content.data.modeList"
            :key="idx"
            :label="opt.name"
            :value="idx"
          >
            {{ opt.name }}
          </a-select-option>
        </a-select>
        <a-button-group>
          <a-button
            v-for="(value, type) in content.data.paperTypes"
            :type="curPaperType === type ? 'primary' : 'default'"
            @click="setPaper(type, value)"
            :key="type"
          >
            {{ type }}
          </a-button>
          <a-popover
            v-model="content.data.paperPopVisible"
            title="设置纸张宽高(mm)"
            trigger="click"
          >
            <template #content>
              <a-input-group compact style="margin: 10px 10px">
                <a-input
                  type="number"
                  v-model:value="content.data.paperWidth"
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
                  v-model:value="content.data.paperHeight"
                  style="width: 100px; text-align: center; border-left: 0"
                  placeholder="高(mm)"
                />
              </a-input-group>
              <a-button type="primary" style="width: 100%" @click="otherPaper">确定</a-button>
            </template>
            <a-button :type="'other' == curPaperType ? 'primary' : 'default'">自定义纸张</a-button>
          </a-popover>
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
        <a-button type="primary" @click="saveJson">
          <template #icon>
            <SaveOutlined />
          </template>
          保存
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
                        <font-size-outlined />
                        <span class="glyphicon glyphicon-text-width" aria-hidden="true"></span>
                        <p class="glyphicon-class">文本</p>
                      </a>
                    </div>
                  </a-col>
                  <a-col :span="12" class="drag_item_box" tid="defaultModule.text">
                    <div>
                      <a class="ep-draggable-item" tid="defaultModule.image" style>
                        <FileImageOutlined />
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
                        <ProfileOutlined />
                        <span class="glyphicon glyphicon-subscript" aria-hidden="true"></span>
                        <p class="glyphicon-class">长文</p>
                      </a>
                    </div>
                  </a-col>
                  <a-col :span="12" class="drag_item_box" tid="defaultModule.text">
                    <div>
                      <a class="ep-draggable-item" tid="defaultModule.table" style>
                        <TableOutlined />
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
                        <MinusOutlined />
                        <span
                          class="glyphicon glyphicon-resize-horizontal"
                          aria-hidden="true"
                        ></span>
                        <p class="glyphicon-class">横线</p>
                      </a>
                    </div>
                  </a-col>
                  <a-col :span="12" class="drag_item_box" tid="defaultModule.text">
                    <div>
                      <a class="ep-draggable-item" tid="defaultModule.vline" style>
                        <PauseOutlined />
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
                        <BorderOutlined />
                        <span class="glyphicon glyphicon-unchecked" aria-hidden="true"></span>
                        <p class="glyphicon-class">矩形</p>
                      </a>
                    </div>
                  </a-col>
                  <a-col :span="12" class="drag_item_box" tid="defaultModule.text">
                    <div>
                      <a class="ep-draggable-item" tid="defaultModule.oval">
                        <RightCircleOutlined />
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
  </div>
</template>
<script setup>
  import { disAutoConnect, hiprint, defaultElementTypeProvider } from 'vue-plugin-hiprint';
  // disAutoConnect();
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  let hiprintTemplate;
  import printPreview from './preview.vue';
  import {
    CloseOutlined,
    EyeOutlined,
    PrinterOutlined,
    QuestionCircleOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
    ProfileOutlined,
    MinusOutlined,
    PauseOutlined,
    FontSizeOutlined,
    TableOutlined,
    FileImageOutlined,
    BorderOutlined,
    RightCircleOutlined,
    SaveOutlined,
  } from '@ant-design/icons-vue';
  import panel from './panel.js';
  import printData from './print-data.js';
  import {
    message,
    Input,
    InputNumber,
    InputGroup,
    ButtonGroup,
    Popconfirm,
    Card,
    Space,
    Button,
    Row,
    Col,
    Select,
    SelectOption,
    Popover,
  } from 'ant-design-vue';
  import { computed, onMounted, reactive, ref } from 'vue';
  const ARow = Row;
  const AInput = Input;
  const ACard = Card;
  const AInputGroup = InputGroup;
  const ACol = Col;
  const AButtonGroup = ButtonGroup;
  const APopconfirm = Popconfirm;
  const ASpace = Space;
  const AButton = Button;
  const ASelect = Select;
  const ASelectOption = SelectOption;
  const APopover = Popover;
  let preViewRef = ref('');
  let content = reactive({
    data: {
      // 模板选择
      mode: 0,
      modeList: [
        {
          name: 'A设计',
          value: 'aProviderModule',
          type: 1,
          template: '',
        },
        {
          name: 'B设计',
          value: 'bProviderModule',
          type: 2,
          template: '',
        },
      ],
      currentTemplate: {
        panels: [
          {
            index: 0,
            height: 297,
            width: 210,
            paperHeader: 49.5,
            paperFooter: 780,
            printElements: [
              {
                options: {
                  left: 175.5,
                  top: 10.5,
                  height: 27,
                  width: 259,
                  title: 'HiPrint自定义模块打印插件',
                  fontSize: 19,
                  fontWeight: '600',
                  textAlign: 'center',
                  lineHeight: 26,
                },
                printElementType: { title: '自定义文本', type: 'text' },
              },
              {
                options: {
                  left: 60,
                  top: 27,
                  height: 13,
                  width: 52,
                  title: '页眉线',
                  textAlign: 'center',
                },
                printElementType: { title: '自定义文本', type: 'text' },
              },
              {
                options: {
                  left: 25.5,
                  top: 57,
                  height: 705,
                  width: 9,
                  fixed: true,
                  borderStyle: 'dotted',
                },
                printElementType: { type: 'vline' },
              },
              {
                options: { left: 60, top: 61.5, height: 48, width: 87, src: '' },
                printElementType: { title: '图片', type: 'image' },
              },
              {
                options: {
                  left: 153,
                  top: 64.5,
                  height: 39,
                  width: 276,
                  title:
                    '二维码以及条形码均采用svg格式打印。不同打印机打印不会造成失真。图片打印：不同DPI打印可能会导致失真，',
                  fontFamily: '微软雅黑',
                  textAlign: 'center',
                  lineHeight: 18,
                },
                printElementType: { title: '自定义文本', type: 'text' },
              },
              {
                options: {
                  left: 457.5,
                  top: 79.5,
                  height: 13,
                  width: 120,
                  title: '姓名',
                  field: 'name',
                  testData: '古力娜扎',
                  color: '#f00808',
                  textDecoration: 'underline',
                  textAlign: 'center',
                },
                printElementType: { title: '文本', type: 'text' },
              },
              {
                options: {
                  left: 483,
                  top: 124.5,
                  height: 43,
                  width: 51,
                  title: '123456789',
                  textType: 'qrcode',
                },
                printElementType: { title: '自定义文本', type: 'text' },
              },
              {
                options: {
                  left: 285,
                  top: 130.5,
                  height: 34,
                  width: 175,
                  title: '123456789',
                  fontFamily: '微软雅黑',
                  textAlign: 'center',
                  textType: 'barcode',
                },
                printElementType: { title: '自定义文本', type: 'text' },
              },
              {
                options: {
                  left: 60,
                  top: 132,
                  height: 19,
                  width: 213,
                  title: '所有打印元素都可已拖拽的方式来改变元素大小',
                  fontFamily: '微软雅黑',
                  textAlign: 'center',
                  lineHeight: 18,
                },
                printElementType: { title: '自定义文本', type: 'text' },
              },
              {
                options: {
                  left: 153,
                  top: 189,
                  height: 13,
                  width: 238,
                  title: '单击元素，右侧可自定义元素属性',
                  textAlign: 'center',
                  fontFamily: '微软雅黑',
                },
                printElementType: { title: '自定义文本', type: 'text' },
              },
              {
                options: {
                  left: 60,
                  top: 190.5,
                  height: 13,
                  width: 51,
                  title: '横线',
                  textAlign: 'center',
                },
                printElementType: { title: '自定义文本', type: 'text' },
              },
              {
                options: {
                  left: 415.5,
                  top: 190.5,
                  height: 13,
                  width: 164,
                  title: '可以配置各属性的默认值',
                  textAlign: 'center',
                  fontFamily: '微软雅黑',
                },
                printElementType: { title: '自定义文本', type: 'text' },
              },
              {
                options: { left: 60, top: 214.5, height: 10, width: 475.5 },
                printElementType: { title: '横线', type: 'hline' },
              },
              {
                options: {
                  left: 235.5,
                  top: 220.5,
                  height: 32,
                  width: 342,
                  title:
                    '自定义表格：用户可左键选中表头，右键查看可操作项，操作类似Excel，双击表头单元格可进行编辑。内容：title#field',
                  fontFamily: '微软雅黑',
                  textAlign: 'center',
                  lineHeight: 15,
                },
                printElementType: { title: '自定义文本', type: 'text' },
              },
              {
                options: {
                  left: 156,
                  top: 265.5,
                  height: 13,
                  width: 94,
                  title: '表头列大小可拖动',
                  fontFamily: '微软雅黑',
                  textAlign: 'center',
                },
                printElementType: { title: '自定义文本', type: 'text' },
              },
              {
                options: {
                  left: 60,
                  top: 265.5,
                  height: 13,
                  width: 90,
                  title: '红色区域可拖动',
                  fontFamily: '微软雅黑',
                  textAlign: 'center',
                },
                printElementType: { title: '自定义文本', type: 'text' },
              },
              {
                options: {
                  left: 60,
                  top: 285,
                  height: 44,
                  width: 511.5,
                  field: 'table',
                  fields: [
                    { text: 'id', field: 'id' },
                    { text: '姓名', field: 'name' },
                    { text: '性别', field: 'gender' },
                    { text: '数量', field: 'count' },
                  ],
                  columns: [
                    [
                      { width: 85.25, colspan: 1, rowspan: 1, checked: true },
                      {
                        width: 85.25,
                        colspan: 1,
                        rowspan: 1,
                        checked: true,
                      },
                      {
                        title: '姓名',
                        field: 'name',
                        width: 85.25,
                        align: 'center',
                        colspan: 1,
                        rowspan: 1,
                        checked: true,
                      },
                      { width: 85.25, colspan: 1, rowspan: 1, checked: true },
                      {
                        width: 85.25,
                        colspan: 1,
                        rowspan: 1,
                        checked: true,
                      },
                      { width: 85.25, colspan: 1, rowspan: 1, checked: true },
                    ],
                  ],
                },
                printElementType: {
                  title: '表格',
                  type: 'table',
                  editable: true,
                  columnDisplayEditable: true, //列显示是否能编辑
                  columnDisplayIndexEditable: true, //列顺序显示是否能编辑
                  columnTitleEditable: true, //列标题是否能编辑
                  columnResizable: true, //列宽是否能调整
                  columnAlignEditable: true, //列对齐是否调整
                },
              },
              {
                options: {
                  left: 21,
                  top: 346.5,
                  height: 61.5,
                  width: 15,
                  title: '装订线',
                  lineHeight: 18,
                  fixed: true,
                  contentPaddingTop: 3.75,
                  backgroundColor: '#ffffff',
                },
                printElementType: { type: 'text' },
              },
              {
                options: {
                  left: 225,
                  top: 349.5,
                  height: 13,
                  width: 346.5,
                  title: '自定义模块：主要为开发人员设计，能够快速，简单，实现自己功能',
                  textAlign: 'center',
                },
                printElementType: { title: '自定义文本', type: 'text' },
              },
              {
                options: {
                  left: 60,
                  top: 370.5,
                  height: 18,
                  width: 79,
                  title: '配置项表格',
                  textAlign: 'center',
                },
                printElementType: { title: '自定义文本', type: 'text' },
              },
              {
                options: {
                  left: 225,
                  top: 385.5,
                  height: 38,
                  width: 346.5,
                  title:
                    '配置模块：主要为客户使用，开发人员可以配置属性，字段，标题等，客户直接使用，配置模块请参考实例2',
                  fontFamily: '微软雅黑',
                  lineHeight: 15,
                  textAlign: 'center',
                  color: '#d93838',
                },
                printElementType: { title: '自定义文本', type: 'text' },
              },
              {
                options: {
                  left: 60,
                  top: 487.5,
                  height: 13,
                  width: 123,
                  title: '长文本会自动分页',
                  textAlign: 'center',
                },
                printElementType: { title: '自定义文本', type: 'text' },
              },
              {
                options: { left: 60, top: 507, height: 40, width: 511.5, field: 'longText' },
                printElementType: { title: '长文', type: 'longText' },
              },
              {
                options: { left: 475.5, top: 565.5, height: 100, width: 100 },
                printElementType: { title: '矩形', type: 'rect' },
              },
              {
                options: {
                  left: 174,
                  top: 568.5,
                  height: 13,
                  width: 90,
                  title: '竖线',
                  textAlign: 'center',
                },
                printElementType: { title: '自定义文本', type: 'text' },
              },
              {
                options: { left: 60, top: 574.5, height: 100, width: 10 },
                printElementType: { title: '竖线', type: 'vline' },
              },
              {
                options: {
                  left: 210,
                  top: 604.5,
                  height: 13,
                  width: 120,
                  title: '横线',
                  textAlign: 'center',
                },
                printElementType: { title: '自定义文本', type: 'text' },
              },
              {
                options: { left: 130.5, top: 625.5, height: 10, width: 277 },
                printElementType: { title: '横线', type: 'hline' },
              },
              {
                options: {
                  left: 364.5,
                  top: 649.5,
                  height: 13,
                  width: 101,
                  title: '矩形',
                  textAlign: 'center',
                },
                printElementType: { title: '自定义文本', type: 'text' },
              },
              {
                options: {
                  left: 525,
                  top: 784.5,
                  height: 13,
                  width: 63,
                  title: '页尾线',
                  textAlign: 'center',
                },
                printElementType: { title: '自定义文本', type: 'text' },
              },
              {
                options: { left: 12, top: 786, height: 49, width: 49 },
                printElementType: { title: 'html', type: 'html' },
              },
              {
                options: {
                  left: 75,
                  top: 790.5,
                  height: 13,
                  width: 137,
                  title: '红色原型是自动定义的Html',
                  textAlign: 'center',
                },
                printElementType: { title: '自定义文本', type: 'text' },
              },
              {
                options: {
                  left: 334.5,
                  top: 810,
                  height: 13,
                  width: 205,
                  title: '页眉线已上。页尾下以下每页都会重复打印',
                  textAlign: 'center',
                },
                printElementType: { title: '自定义文本', type: 'text' },
              },
            ],
            paperNumberLeft: 565.5,
            paperNumberTop: 819,
          },
        ],
      },
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
      // 自定义纸张
      paperPopVisible: false,
      paperWidth: '',
      paperHeight: '',
    },
  });

  let curPaperType = computed(() => {
    let type = 'other';
    let types = content.data.paperTypes;
    for (const key in types) {
      let item = types[key];
      let { width, height } = content.data.curPaper;
>>>>>>> dev_lkf_230201_条码模块
      if (item.width === width && item.height === height) {
        type = key;
      }
    }
    return type;
  });
  onMounted(() => {
<<<<<<< HEAD
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
=======
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
      template: content.data.currentTemplate,
>>>>>>> dev_lkf_230201_条码模块
      settingContainer: '#PrintElementOptionSetting',
      paginationContainer: '.hiprint-printPagination',
    });
    hiprintTemplate.design('#hiprint-printTemplate');
    console.log(hiprintTemplate);
    // 获取当前放大比例, 当zoom时传true 才会有
<<<<<<< HEAD
    scaleValue.value = hiprintTemplate.editingPanel.scale || 1;
  };
=======
    content.data.scaleValue = hiprintTemplate.editingPanel.scale || 1;
  });
>>>>>>> dev_lkf_230201_条码模块
  /**
   * 设置纸张大小
   * @param type [A3, A4, A5, B3, B4, B5, other]
   * @param value {width,height} mm
   */
<<<<<<< HEAD
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
=======

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
      createMessage.error(`操作失败: ${error}`);
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
    let { width } = content.data.curPaper;
    preViewRef.value.show(hiprintTemplate, printData, width);
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
>>>>>>> dev_lkf_230201_条码模块
  const print = () => {
    if (window.hiwebSocket.opened) {
      const printerList = hiprintTemplate.getPrinterList();
      console.log(printerList);
      hiprintTemplate.print2(printData, { printer: '', title: 'hiprint测试打印' });
      return;
    }
    message.error('客户端未连接,无法直接打印');
  };
<<<<<<< HEAD
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
=======
>>>>>>> dev_lkf_230201_条码模块
  const clearPaper = () => {
    try {
      hiprintTemplate.clear();
    } catch (error) {
      message.error(`操作失败: ${error}`);
    }
  };
<<<<<<< HEAD
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
=======
  //保存格式
  const saveJson = () => {
    content.data.modeList[content.data.mode].template = hiprintTemplate.getJson();
    console.log(hiprintTemplate.getJson(), 'hiprintTemplate.getJson()');
    createMessage.success('操作成功');
  };
  //改变样式
  const changeMode = (value) => {
    content.data.mode = value;
    let provider = content.data.modeList[value];
    // hiprintTemplate.clear();
    // $('.hiprintEpContainer').empty();
    // hiprint.PrintElementTypeManager.build('.hiprintEpContainer', provider.value);
    $('#hiprint-printTemplate').empty();
    hiprintTemplate = new hiprint.PrintTemplate({
      template: provider.template,
      settingContainer: '#PrintElementOptionSetting',
      paginationContainer: '.hiprint-printPagination',
    });
    hiprintTemplate.design('#hiprint-printTemplate');
    console.log(hiprintTemplate);
    // 获取当前放大比例, 当zoom时传true 才会有
    content.data.scaleValue = hiprintTemplate.editingPanel.scale || 1;
  };
  //自定义纸张
  const otherPaper = () => {
    let value = {};
    value.width = content.data.paperWidth;
    value.height = content.data.paperHeight;
    content.data.paperPopVisible = false;
    setPaper('other', value);
  };
</script>

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
>>>>>>> dev_lkf_230201_条码模块
  }

  // 默认图片
  :deep(.hiprint-printElement-image-content) {
    img {
<<<<<<< HEAD
      content: url('~@/assets/logo.png');
=======
      //content: url('~@/assets/logo.png');
>>>>>>> dev_lkf_230201_条码模块
    }
  }

  // 设计容器
  .card-design {
    overflow: hidden;
    overflow-x: auto;
    overflow-y: auto;
  }
<<<<<<< HEAD
=======

  .scrollbox {
    height: 100%;
    width: 100%;
    overflow: auto;
    // 滚动条整体部分
    &::-webkit-scrollbar {
      width: 6px; //对垂直方向滚动条
      height: 6px; //对水平方向滚动条
    }
    //滚动的滑块
    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-color: #ccc//滚动条的颜色;
    }
    //内层滚动槽
    &::-webkit-scrollbar-track-piece {
      background-color: #ccc;
    }
  }
>>>>>>> dev_lkf_230201_条码模块
</style>
