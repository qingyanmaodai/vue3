<template>
  <div class="scrollbox">
    <a-card>
      <a-form ref="formRef" :model="content.data" :rules="formRules">
        <a-row>
          <a-col :span="8">
            <a-form-item label="模板名称：" ref="srcBill" name="srcBill" class="item">
              <Input class="input" v-model:value="content.data.name" />
            </a-form-item>
          </a-col>
          <!--          <a-col :span="8">-->
          <!--            <a-form-item label="业务日期：" ref="bsDate" name="bsDate" class="item">-->
          <!--              <a-date-picker-->
          <!--                :showToday="false"-->
          <!--                class="select"-->
          <!--                valueFormat="YYYY-MM-DD HH:mm:ss"-->
          <!--                format="YYYY-MM-DD"-->
          <!--                v-model:value="content.data.bsDate"-->
          <!--              />-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->
        </a-row>
      </a-form>
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
          :parser="(value) => value.replace('%', '')" />
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
        <!--        <a-button type="primary" @click="print">-->
        <!--          <template #icon>-->
        <!--            <PrinterOutlined />-->
        <!--          </template>-->
        <!--          直接打印-->
        <!--        </a-button>-->
        <a-button type="primary" @click="saveJson">
          <template #icon>
            <SaveOutlined />
          </template>
          保存
        </a-button>
        <a-button type="primary" @click="onlyPrint"> Api单独打印 </a-button>
        <!--        <a-button type="primary" @click="onlyPrint2"> Api单独直接打印 </a-button>-->
        <a-popconfirm title="是否确认清空?" okType="danger" okText="确定清空" @confirm="clearPaper">
          <template #icon>
            <QuestionCircleOutlined style="color: red" />
          </template>
          <a-button type="primary" danger>
            清空
            <template #icon>
              <CloseOutlined />
            </template>
          </a-button> </a-popconfirm
      ></a-space>
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
    Popover,
    Form,
    FormItem,
    DatePicker,
  } from 'ant-design-vue';
  import { computed, onMounted, reactive, ref } from 'vue';
  import { add, getOneById } from '/@/api/barcode/barcodeTemplate';
  import { useRoute, useRouter } from 'vue-router';
  const router = useRouter();
  import { cloneDeep } from 'lodash-es';
  const ADatePicker = DatePicker;
  const AForm = Form;
  const AFormItem = FormItem;
  const ARow = Row;
  const AInput = Input;
  const ACard = Card;
  const AInputGroup = InputGroup;
  const ACol = Col;
  const AButtonGroup = ButtonGroup;
  const APopconfirm = Popconfirm;
  const ASpace = Space;
  const AButton = Button;
  const APopover = Popover;
  let preViewRef = ref('');
  let content = reactive({
    data: {
      // 模板选择
      mode: 0,
      // modeList: [
      //   {
      //     name: 'A设计',
      //     value: 'aProviderModule',
      //     type: 1,
      //     template: '',
      //   },
      //   {
      //     name: 'B设计',
      //     value: 'bProviderModule',
      //     type: 2,
      //     template: '',
      //   },
      // ],
      name: '',
      // templateData: {
      //   panels: [
      //     {
      //       index: 0,
      //       height: 297,
      //       width: 210,
      //       paperHeader: 49.5,
      //       paperFooter: 780,
      //       printElements: [
      //         {
      //           options: {
      //             left: 175.5,
      //             top: 10.5,
      //             height: 27,
      //             width: 259,
      //             title: 'HiPrint自定义模块打印插件',
      //             fontSize: 19,
      //             fontWeight: '600',
      //             textAlign: 'center',
      //             lineHeight: 26,
      //           },
      //           printElementType: { title: '自定义文本', type: 'text' },
      //         },
      //         {
      //           options: {
      //             left: 60,
      //             top: 27,
      //             height: 13,
      //             width: 52,
      //             title: '页眉线',
      //             textAlign: 'center',
      //           },
      //           printElementType: { title: '自定义文本', type: 'text' },
      //         },
      //         {
      //           options: {
      //             left: 25.5,
      //             top: 57,
      //             height: 705,
      //             width: 9,
      //             fixed: true,
      //             borderStyle: 'dotted',
      //           },
      //           printElementType: { type: 'vline' },
      //         },
      //         {
      //           options: { left: 60, top: 61.5, height: 48, width: 87, src: '' },
      //           printElementType: { title: '图片', type: 'image' },
      //         },
      //         {
      //           options: {
      //             left: 153,
      //             top: 64.5,
      //             height: 39,
      //             width: 276,
      //             title:
      //               '二维码以及条形码均采用svg格式打印。不同打印机打印不会造成失真。图片打印：不同DPI打印可能会导致失真，',
      //             fontFamily: '微软雅黑',
      //             textAlign: 'center',
      //             lineHeight: 18,
      //           },
      //           printElementType: { title: '自定义文本', type: 'text' },
      //         },
      //         {
      //           options: {
      //             left: 457.5,
      //             top: 79.5,
      //             height: 13,
      //             width: 120,
      //             title: '姓名',
      //             field: 'name',
      //             testData: '古力娜扎',
      //             color: '#f00808',
      //             textDecoration: 'underline',
      //             textAlign: 'center',
      //           },
      //           printElementType: { title: '文本', type: 'text' },
      //         },
      //         {
      //           options: {
      //             left: 483,
      //             top: 124.5,
      //             height: 43,
      //             width: 51,
      //             title: '123456789',
      //             textType: 'qrcode',
      //           },
      //           printElementType: { title: '自定义文本', type: 'text' },
      //         },
      //         {
      //           options: {
      //             left: 285,
      //             top: 130.5,
      //             height: 34,
      //             width: 175,
      //             title: '123456789',
      //             fontFamily: '微软雅黑',
      //             textAlign: 'center',
      //             textType: 'barcode',
      //           },
      //           printElementType: { title: '自定义文本', type: 'text' },
      //         },
      //         {
      //           options: {
      //             left: 60,
      //             top: 132,
      //             height: 19,
      //             width: 213,
      //             title: '所有打印元素都可已拖拽的方式来改变元素大小',
      //             fontFamily: '微软雅黑',
      //             textAlign: 'center',
      //             lineHeight: 18,
      //           },
      //           printElementType: { title: '自定义文本', type: 'text' },
      //         },
      //         {
      //           options: {
      //             left: 153,
      //             top: 189,
      //             height: 13,
      //             width: 238,
      //             title: '单击元素，右侧可自定义元素属性',
      //             textAlign: 'center',
      //             fontFamily: '微软雅黑',
      //           },
      //           printElementType: { title: '自定义文本', type: 'text' },
      //         },
      //         {
      //           options: {
      //             left: 60,
      //             top: 190.5,
      //             height: 13,
      //             width: 51,
      //             title: '横线',
      //             textAlign: 'center',
      //           },
      //           printElementType: { title: '自定义文本', type: 'text' },
      //         },
      //         {
      //           options: {
      //             left: 415.5,
      //             top: 190.5,
      //             height: 13,
      //             width: 164,
      //             title: '可以配置各属性的默认值',
      //             textAlign: 'center',
      //             fontFamily: '微软雅黑',
      //           },
      //           printElementType: { title: '自定义文本', type: 'text' },
      //         },
      //         {
      //           options: { left: 60, top: 214.5, height: 10, width: 475.5 },
      //           printElementType: { title: '横线', type: 'hline' },
      //         },
      //         {
      //           options: {
      //             left: 235.5,
      //             top: 220.5,
      //             height: 32,
      //             width: 342,
      //             title:
      //               '自定义表格：用户可左键选中表头，右键查看可操作项，操作类似Excel，双击表头单元格可进行编辑。内容：title#field',
      //             fontFamily: '微软雅黑',
      //             textAlign: 'center',
      //             lineHeight: 15,
      //           },
      //           printElementType: { title: '自定义文本', type: 'text' },
      //         },
      //         {
      //           options: {
      //             left: 156,
      //             top: 265.5,
      //             height: 13,
      //             width: 94,
      //             title: '表头列大小可拖动',
      //             fontFamily: '微软雅黑',
      //             textAlign: 'center',
      //           },
      //           printElementType: { title: '自定义文本', type: 'text' },
      //         },
      //         {
      //           options: {
      //             left: 60,
      //             top: 265.5,
      //             height: 13,
      //             width: 90,
      //             title: '红色区域可拖动',
      //             fontFamily: '微软雅黑',
      //             textAlign: 'center',
      //           },
      //           printElementType: { title: '自定义文本', type: 'text' },
      //         },
      //         {
      //           options: {
      //             left: 60,
      //             top: 285,
      //             height: 44,
      //             width: 511.5,
      //             field: 'table',
      //             fields: [
      //               { text: 'id', field: 'id' },
      //               { text: '姓名', field: 'name' },
      //               { text: '性别', field: 'gender' },
      //               { text: '数量', field: 'count' },
      //             ],
      //             columns: [
      //               [
      //                 { width: 85.25, colspan: 1, rowspan: 1, checked: true },
      //                 {
      //                   width: 85.25,
      //                   colspan: 1,
      //                   rowspan: 1,
      //                   checked: true,
      //                 },
      //                 {
      //                   title: '姓名',
      //                   field: 'name',
      //                   width: 85.25,
      //                   align: 'center',
      //                   colspan: 1,
      //                   rowspan: 1,
      //                   checked: true,
      //                 },
      //                 { width: 85.25, colspan: 1, rowspan: 1, checked: true },
      //                 {
      //                   width: 85.25,
      //                   colspan: 1,
      //                   rowspan: 1,
      //                   checked: true,
      //                 },
      //                 { width: 85.25, colspan: 1, rowspan: 1, checked: true },
      //               ],
      //             ],
      //           },
      //           printElementType: {
      //             title: '表格',
      //             type: 'table',
      //             editable: true,
      //             columnDisplayEditable: true, //列显示是否能编辑
      //             columnDisplayIndexEditable: true, //列顺序显示是否能编辑
      //             columnTitleEditable: true, //列标题是否能编辑
      //             columnResizable: true, //列宽是否能调整
      //             columnAlignEditable: true, //列对齐是否调整
      //           },
      //         },
      //         {
      //           options: {
      //             left: 21,
      //             top: 346.5,
      //             height: 61.5,
      //             width: 15,
      //             title: '装订线',
      //             lineHeight: 18,
      //             fixed: true,
      //             contentPaddingTop: 3.75,
      //             backgroundColor: '#ffffff',
      //           },
      //           printElementType: { type: 'text' },
      //         },
      //         {
      //           options: {
      //             left: 225,
      //             top: 349.5,
      //             height: 13,
      //             width: 346.5,
      //             title: '自定义模块：主要为开发人员设计，能够快速，简单，实现自己功能',
      //             textAlign: 'center',
      //           },
      //           printElementType: { title: '自定义文本', type: 'text' },
      //         },
      //         {
      //           options: {
      //             left: 60,
      //             top: 370.5,
      //             height: 18,
      //             width: 79,
      //             title: '配置项表格',
      //             textAlign: 'center',
      //           },
      //           printElementType: { title: '自定义文本', type: 'text' },
      //         },
      //         {
      //           options: {
      //             left: 225,
      //             top: 385.5,
      //             height: 38,
      //             width: 346.5,
      //             title:
      //               '配置模块：主要为客户使用，开发人员可以配置属性，字段，标题等，客户直接使用，配置模块请参考实例2',
      //             fontFamily: '微软雅黑',
      //             lineHeight: 15,
      //             textAlign: 'center',
      //             color: '#d93838',
      //           },
      //           printElementType: { title: '自定义文本', type: 'text' },
      //         },
      //         {
      //           options: {
      //             left: 60,
      //             top: 487.5,
      //             height: 13,
      //             width: 123,
      //             title: '长文本会自动分页',
      //             textAlign: 'center',
      //           },
      //           printElementType: { title: '自定义文本', type: 'text' },
      //         },
      //         {
      //           options: { left: 60, top: 507, height: 40, width: 511.5, field: 'longText' },
      //           printElementType: { title: '长文', type: 'longText' },
      //         },
      //         {
      //           options: { left: 475.5, top: 565.5, height: 100, width: 100 },
      //           printElementType: { title: '矩形', type: 'rect' },
      //         },
      //         {
      //           options: {
      //             left: 174,
      //             top: 568.5,
      //             height: 13,
      //             width: 90,
      //             title: '竖线',
      //             textAlign: 'center',
      //           },
      //           printElementType: { title: '自定义文本', type: 'text' },
      //         },
      //         {
      //           options: { left: 60, top: 574.5, height: 100, width: 10 },
      //           printElementType: { title: '竖线', type: 'vline' },
      //         },
      //         {
      //           options: {
      //             left: 210,
      //             top: 604.5,
      //             height: 13,
      //             width: 120,
      //             title: '横线',
      //             textAlign: 'center',
      //           },
      //           printElementType: { title: '自定义文本', type: 'text' },
      //         },
      //         {
      //           options: { left: 130.5, top: 625.5, height: 10, width: 277 },
      //           printElementType: { title: '横线', type: 'hline' },
      //         },
      //         {
      //           options: {
      //             left: 364.5,
      //             top: 649.5,
      //             height: 13,
      //             width: 101,
      //             title: '矩形',
      //             textAlign: 'center',
      //           },
      //           printElementType: { title: '自定义文本', type: 'text' },
      //         },
      //         {
      //           options: {
      //             left: 525,
      //             top: 784.5,
      //             height: 13,
      //             width: 63,
      //             title: '页尾线',
      //             textAlign: 'center',
      //           },
      //           printElementType: { title: '自定义文本', type: 'text' },
      //         },
      //         {
      //           options: { left: 12, top: 786, height: 49, width: 49 },
      //           printElementType: { title: 'html', type: 'html' },
      //         },
      //         {
      //           options: {
      //             left: 75,
      //             top: 790.5,
      //             height: 13,
      //             width: 137,
      //             title: '红色原型是自动定义的Html',
      //             textAlign: 'center',
      //           },
      //           printElementType: { title: '自定义文本', type: 'text' },
      //         },
      //         {
      //           options: {
      //             left: 334.5,
      //             top: 810,
      //             height: 13,
      //             width: 205,
      //             title: '页眉线已上。页尾下以下每页都会重复打印',
      //             textAlign: 'center',
      //           },
      //           printElementType: { title: '自定义文本', type: 'text' },
      //         },
      //       ],
      //       paperNumberLeft: 565.5,
      //       paperNumberTop: 819,
      //     },
      //   ],
      // },
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
      if (item.width === width && item.height === height) {
        type = key;
      }
    }
    return type;
  });
  onMounted(async () => {
    await getListById();
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
      template: content.data.templateData,
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
  // const onlyPrint2 = () => {
  //   if (window.hiwebSocket.opened) {
  //     let hiprintTemplate1 = hiprintTemplate.print2(undefined, panel, printData, {
  //       printer: '',
  //       title: 'Api单独打印',
  //       styleHandler: () => {
  //         let css =
  //           '<link href="http://hiprint.io/Content/hiprint/css/print-lock.css" media="print" rel="stylesheet">';
  //         return css;
  //       },
  //     });
  //     let key = 'Api单独直接打印';
  //     hiprintTemplate1.on('printSuccess', function () {
  //       hiprintTemplate.notification.success({
  //         key: key,
  //         placement: 'topRight',
  //         message: key + ' 打印成功',
  //         description: 'Api单独直接打印回调',
  //       });
  //     });
  //     return;
  //   }
  //   message.error('客户端未连接,无法直接打印');
  // };
  // const print = () => {
  //   if (window.hiwebSocket.opened) {
  //     const printerList = hiprintTemplate.getPrinterList();
  //     console.log(printerList);
  //     hiprintTemplate.print2(printData, { printer: '', title: 'hiprint测试打印' });
  //     return;
  //   }
  //   message.error('客户端未连接,无法直接打印');
  // };
  const clearPaper = () => {
    try {
      hiprintTemplate.clear();
      content.data.templateData = hiprintTemplate.getJson();
    } catch (error) {
      message.error(`操作失败: ${error}`);
    }
  };
  //保存格式
  const saveJson = async () => {
    content.data.templateData = hiprintTemplate.getJson();
    let hiprintTemplateData = await add({ params: content.data });
    console.log(hiprintTemplateData, 'getJson()');
    createMessage.success('操作成功');
  };
  // //改变样式
  // const changeMode = (value) => {
  //   content.data.mode = value;
  //   let provider = content.data.modeList[value];
  //   // hiprintTemplate.clear();
  //   // $('.hiprintEpContainer').empty();
  //   // hiprint.PrintElementTypeManager.build('.hiprintEpContainer', provider.value);
  //   $('#hiprint-printTemplate').empty();
  //   hiprintTemplate = new hiprint.PrintTemplate({
  //     template: provider.template,
  //     settingContainer: '#PrintElementOptionSetting',
  //     paginationContainer: '.hiprint-printPagination',
  //   });
  //   hiprintTemplate.design('#hiprint-printTemplate');
  //   console.log(hiprintTemplate);
  //   // 获取当前放大比例, 当zoom时传true 才会有
  //   content.data.scaleValue = hiprintTemplate.editingPanel.scale || 1;
  // };
  //自定义纸张
  const otherPaper = () => {
    let value = {};
    value.width = content.data.paperWidth;
    value.height = content.data.paperHeight;
    content.data.paperPopVisible = false;
    setPaper('other', value);
  };

  //获取初始值
  const getListById = async () => {
    if (useRoute().query.row) {
      let dataId = useRoute().query.row?.toString() || '';
      const res = await getOneById({ params: dataId });
      res.templateData = JSON.parse(res.templateData);
      content.data = Object.assign({}, content.data, res);
    }
  };
  //返回上一页
  const back = () => {
    router.go(-1);
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
  .input {
    width: 16rem;
    height: 2rem;
    margin: 0 60px 0 2px;
  }
  .item {
    flex-flow: nowrap;
  }
  .select {
    width: 16rem;
    margin: 0 60px 0 2px;
  }
</style>
