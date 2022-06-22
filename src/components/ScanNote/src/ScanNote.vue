<template>
  <div style="margin: auto; width: 80%; font-weight: bold; font-size: 14px">
    <a-collapse v-model:activeKey="activeKey" :expand-icon-position="expandIconPosition">
      <a-collapse-panel
        v-for="(item, i) in props.data"
        :key="i"
        :class="item.ftype === 'LNX' ? 'LNX_COLOR' : item.ftype === 'LN' ? 'LN_COLOR' : 'SN_COLOR'"
      >
        <template #header>
          <div>
            <Row>
              <Col :span="12"> 条形码: {{ item.sn }} </Col>
              <Col :span="12" :class="Number(item.FSnType) === 6 ? 'redClass' : ''">
                <span @click="qtyClick(i, -1, item)"> 数量: {{ Number(item.sl).toFixed(2) }} </span>
              </Col>
            </Row>
            <Row>
              <Col :span="12"> 物料编码: {{ item.wlbm }} </Col>
              <Col :span="12"> 物料名称: {{ item.wlmc }} </Col>
            </Row>
            <CloseOutlined
              @click="deleteNote(i)"
              style="position: absolute; top: 40%; right: 30px"
            />
          </div>
        </template>
<!--        <template #extra>-->
<!--          -->
<!--        </template>-->
        <a-card
          :class="
            child.ftype === 'LNX' ? 'LNX_COLOR' : child.ftype === 'LN' ? 'LN_COLOR' : 'SN_COLOR'
          "
          style="margin-bottom: 5px"
          v-for="(child, j) in item.childs"
          :key="j + 10000"
        >
          <Row>
            <Col :span="12"> 条形码: {{ child.sn }} </Col>
            <Col :span="12" :class="Number(item.FSnType) === 6 ? 'redClass' : ''">
              <span @click="qtyClick(i, j, child)"> 数量: {{ Number(child.sl).toFixed(2) }} </span>
            </Col>
          </Row>
          <Row>
            <Col :span="12"> 物料编码: {{ child.wlbm }} </Col>
            <Col :span="12"> 物料名称: {{ child.wlmc }} </Col>
          </Row>
        </a-card>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import {
    List,
    ListItem,
    Card,
    Descriptions,
    Collapse,
    CollapsePanel,
    Row,
    Col,
  } from 'ant-design-vue';
  import { CloseOutlined } from '@ant-design/icons-vue';
  const background_class_type = 'LNX_COLOR';
  const AList = List;
  const AListItem = ListItem;
  const ACard = Card;
  const ADescriptions = Descriptions;
  const ACollapse = Collapse;
  const ACollapsePanel = CollapsePanel;
  const text = `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`;
  const activeKey = ref(['0']);
  const expandIconPosition = ref('right');
  interface DataItem {
    sn: string;
    sl: string;
    wlmc: string;
    wlbm: string;
    childs: this[];
    className: string;
    ftype: string;
    FSnType: string | number;
  }
  interface PropType {
    data: DataItem[];
  }
  const emits = defineEmits<{
    (e: 'qtyClickEvent', index: number, childrenIndex: number, data: any): void;
    (e: 'deleteEvent', index: number): void;
  }>();
  const props = withDefaults(defineProps<PropType>(), {
    data: () => {
      return [];
    },
  });
  const qtyClick = (index: number, childrenIndex: number, data: any) => {
    if (Number(data.FSnType) === 6) {
      emits('qtyClickEvent', index, childrenIndex, data);
    }
  };
  const deleteNote = (index: number) => {
    emits('deleteEvent', index);
  };
</script>

<style scoped>
  .LNX_COLOR {
    background-color: #ffffcc;
  }
  .LN_COLOR {
    background-color: #cccccc;
  }
  .SN_COLOR {
    background-color: #ccffcc;
  }
  .redClass {
    color: red;
  }
</style>
