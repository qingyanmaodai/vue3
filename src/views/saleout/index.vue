<template>
  <div style="margin: 15px 15px">
    <QtyModal
      :visible="qtyModalData.visible"
      :title="'修改数量'"
      @handleCancel="qtyModalCancel"
      @handleOk="qtyModalOk"
      :keyNum="qtyModalData.keyNum"
      :currData="qtyModalData.currPush"
    />
    <a-row style="height: 100%">
      <a-col :span="13">
        <div class="left-base-content">
          <div class="top-content">
            <a-button type="primary" @click="submit">提交</a-button>
            <a-button style="margin-left: 8px" @click="refreshPage()">重置</a-button>
            <span style="margin-left: 10px">
              <Checkbox style="margin-left: 10px" v-model:checked="autoSubmit">自动提交</Checkbox>
            </span>
            <div style="margin-top: 15px">
              <ScanInput
                ref="billInput"
                label="销售出库单号/快递单号"
                :keyName="billInputName"
                @autoChangeFocus="changeFocus"
                @getInputContent="inputContent"
                :val="pageData.billInputValue"
                :autofocus="billInputFocus"
              />
              <ScanInput
                ref="snInput"
                label="扫码输入"
                :keyName="snInputName"
                :autoFocus="snInputFocus"
                @autoChangeFocus="changeFocus"
                :val="pageData.snInputValue"
                @scanEvent="scanEvent"
              />
            </div>
          </div>
          <div class="bottom-content">
            <BillInfo
              ref="billTable"
              :billNo="billInfo.io_id"
              :billDate="billInfo.modified"
              :columns="billHeader"
              :data="tableData"
              @autoChangeFocus="changeFocus"
              @refreshTable="changeStock"
            />
          </div>
        </div>
      </a-col>
      <a-col :span="11" style="height: 100%; overflow: scroll">
        <p style="font-weight: bold; font-size: 22px">扫码记录:</p>
        <div>
          <ScanNote :data="scanList" @qtyClickEvent="showQtyModal" @deleteEvent="deleteNote" />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import { Row, Col, Button, Checkbox } from 'ant-design-vue';
  import { ScanInput } from '/@/components/ScanInput';
  import { BillInfo, TableColumns } from '/@/components/BillInfo';
  import { ref, reactive, onMounted, createVNode } from 'vue';
  import ScanNote from '/@/components/ScanNote/src/ScanNote.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import {
    isShopSpe,
    jstSaleOutBillSearch,
    PartialSaleOutBillEntry,
    SaleOutBill,
    FlagSnOpt,
    ScanHook,
    Stock,
    findStock,
    snInfoList,
    JstShopInfo,
    saveOut,
    otherOut,
  } from '/@/api/utilApi';
  import { cloneDeep, concat, map, round, unionBy } from 'lodash-es';
  import QtyModal from '/@/components/QtyModal/src/QtyModal.vue';
  import { isFunction } from '/@/utils/is';
  import { PdaUserInfo } from '/#/store';
  import { ResultEnum } from '/@/enums/httpEnum';
  const userStore = useUserStoreWithOut();
  const { createMessage } = useMessage();
  const ARow = Row;
  const ACol = Col;
  const AButton = Button;
  const billInputName = 'billInput';
  const snInputName = 'snInput';
  const pageData = reactive({
    billInputValue: '',
    snInputValue: '',
  });
  const billInput: any = ref(null);
  const snInput: any = ref(null);
  const billTable: any = ref(null);
  const autoSubmit = ref(false);
  let billInfo = ref({});
  let billHeader = ref<TableColumns[]>([
    {
      dataIndex: 'id', //id
      key: 'id', //id
      title: '序号', //标题
      fixed: 'left', //固定
      width: 8, //宽度
      align: 'center', //对齐
    },
    {
      dataIndex: 'number', //id
      key: 'number', //id
      title: '编码', //标题
      width: 18, //宽度
      align: 'center', //对齐
    },
    {
      dataIndex: 'name', //id
      key: 'name', //id
      title: '名称', //标题
      width: 30, //宽度
      align: 'center', //对齐
      ellipsis: true,
    },
    {
      dataIndex: 'qty', //id
      key: 'qty', //id
      title: '数量(已扫/待出)', //标题
      width: 23, //宽度
      align: 'center', //对齐
    },
    {
      dataIndex: 'stock', //id
      key: 'stock', //id
      title: '仓库', //标题
      width: 25, //宽度
      align: 'center', //对齐
      slots: { customRender: 'stock' },
    },
    {
      dataIndex: 'model', //id
      key: 'model', //id
      title: '规格', //标题
      width: 20, //宽度
      align: 'center', //对齐
    },
    // {
    //   dataIndex: 'amount', //id
    //   key: 'amount', //id
    //   title: '金额', //标题
    //   width: 10, //宽度
    //   align: 'center', //对齐
    // },
  ]);
  let tableData = ref<any>([]);
  let scanExpendList: any[] = []; //扫描的条码展开后合集
  let scanList = ref<any[]>([]); //扫描的条码合集
  let stock: Stock[] = [];
  let billInputFocus = ref(true);
  let snInputFocus = ref(false);
  let qtyModalData = reactive<{
    visible?: boolean;
    title?: string;
    val?: number;
    id?: number;
    max?: number;
    keyNum?: string | number;
    currPush?: any;
  }>({});
  const refreshPage = async () => {
    billInputFocus.value = true;
    snInputFocus.value = false;
    scanList.value = [];
    scanExpendList = [];
    billInfo.value = {};
    pageData.billInputValue = '';
    pageData.snInputValue = '';
    snInput.value.formState.val = '';
    billInput.value.formState.val = '';
    changeFocus();
    refreshTable();
    billInput.value?.inputFocus();
  };

  const submit = async () => {
    try {
      if (
        !Object.keys(billInfo.value) ||
        Object.keys(billInfo.value).length === 0 ||
        scanExpendList.length === 0
      ) {
        throw new Error('没有要提交的数据');
        // createMessage.error('没有要提交的数据');
        //showDialog('没有要提交的数据');
        // return;
      }
      (billInfo.value as SaleOutBill).items.forEach((item) => {
        if (Number(item.qty) !== Number(item.hasScanQty)) {
          throw new Error(item.sku_id + '还没扫满单据数量!');
          // createMessage.error(item.sku_id + '还没扫满单据数量!');
          //showDialog(item.sku_id + '还没扫满单据数量!');
          // return;
        }
      });
      const snOpt: any = {};
      scanExpendList.forEach((item) => {
        const sn = item.sn;
        const ftype = item.ftype;
        const qty = item.sl;
        let type = '03';
        if (ftype === 'SN') {
          type = '01';
        } else if (ftype === 'LN') {
          type = '02';
        }
        snOpt[sn] = { qty, type };
      });
      const jst: any[] = [];
      const jstObj: any = {
        lc_name: (billInfo.value as SaleOutBill).logistics_company,
        l_id: (billInfo.value as SaleOutBill).l_id,
        io_id: (billInfo.value as SaleOutBill).io_id,
        lc_id: (billInfo.value as SaleOutBill).lc_id,
      };
      jst.push(jstObj);
      if ((billInfo.value as SaleOutBill).is_spe) {
        if (!(billInfo.value as SaleOutBill).shop_id) {
          const shop_info: JstShopInfo = {
            FName: null,
            custNum: 'GNZY0010',
            isSpe: true, //是否其他出库
            biztype: '8',
          };
          (billInfo.value as SaleOutBill).erp_shop_info = shop_info;
        }
        await submitOtherOut(snOpt, jst);
      } else {
        await submitSaleOut(snOpt, jst);
      }
      // await refreshPage();
    } catch (e: any) {
      createMessage.error(e.message);
      // showDialog(e.message);
      console.log(e.message);
    }
  };
  // const showDialog = (content: string) => {
  //   Modal.confirm({
  //     title: () => '提示',
  //     icon: () => createVNode(ExclamationCircleOutlined),
  //     content: () => createVNode('div', { style: 'color:black;' }, content),
  //     class: 'test',
  //   });
  // };
  const submitSaleOut = async (snOpt: any, jst: any) => {
    const bill = billInfo.value as SaleOutBill;
    const pdaUserInfo: PdaUserInfo = await userStore.getPdaUserInfo;
    const postJson: any = {};
    const params: any = {};
    params.formid = 'SAL_OUTSTOCK';
    params.snOpt = snOpt;
    params.shop_id = bill.shop_id;
    const Model: any = {
      FID: 0,
      FBillNo: 'XSCK-' + bill.io_id,
      F_pay_amount: bill.pay_amount,
      F_jst_l_id: bill.l_id,
      F_jst_lc_id: bill.lc_id,
      F_o_id: bill.o_id,
      F_so_id: bill.so_id,
      F_free_amount: bill.free_amount,
      freight: bill.freight,
      SubHeadEntity: {
        FPriceListId: {
          FNumber: '',
        },
      },
    };
    Model.FEntity = [];
    let addUpDiscount = 0;
    let totalDiscount = Number(bill.free_amount);
    const totalJine = Number(bill.pay_amount) + totalDiscount;
    bill.items.forEach((item, i) => {
      let discount = 0;
      const entry: any = {};
      const jine = item.sale_amount;
      const taxprice = round(Number(jine) / Number(item.qty), 6);
      entry.FMaterialID = { FNumber: item.sku_id };
      entry.FRealQty = item.qty;
      if (Number(taxprice) > 0) entry.FTaxPrice = taxprice;
      if (Number(jine) > 0) entry.FAllAmount_LC = jine;
      entry.FIsFree = Number(jine) === 0;
      entry.FEntryTaxRate = 13;
      entry.FLot = { FNumber: '1' };
      entry.FStockId = { FNumber: item.stock?.fStock };
      if (Number(jine) > 0) {
        if (Number(item.free_amount) > 0) {
          discount = round(Number(item.free_amount), 2);
        } else {
          if (i === bill.items.length - 1) {
            discount = totalDiscount - addUpDiscount;
          } else {
            if (!totalJine || totalJine === 0) {
              discount = 0;
            } else {
              discount = round((jine / totalJine) * totalDiscount, 2);
            }
          }
        }
      }
      addUpDiscount = addUpDiscount + discount;
      if (i === bill.items.length - 1) {
        //尝试清除误差
        totalDiscount = round(totalDiscount, 2);
        addUpDiscount = round(addUpDiscount, 2);
        let dot = 0;
        if (totalDiscount > addUpDiscount) {
          dot = totalDiscount - addUpDiscount;
          discount = discount + dot;
        }
        if (totalDiscount < addUpDiscount) {
          dot = addUpDiscount - totalDiscount;
          discount = discount - dot;
        }
      }
      if (Number(jine) > 0 && discount > 0) entry.FDiscount = discount;
      entry.FSerialSubEntity = [];
      scanExpendList.forEach((snInfo) => {
        if (snInfo.wlbm === item.sku_id && snInfo.ftype !== 'LNX') {
          entry.FSerialSubEntity.push({
            FSerialNo: snInfo.sn,
          });
        }
      });
      Model.FEntity.push(entry);
    });
    params.data = { Model };
    params.org = pdaUserInfo.orgNumber;
    params.jst = jst;
    postJson.params = params;
    const res = await saveOut(postJson);
    if (res.code === ResultEnum.SUCCESS) {
      ScanHook.afterSubmit(true, '操作成功', async () => {
        await refreshPage();
      });
    } else {
      ScanHook.afterSubmit(false, '操作失败:' + res.message);
    }
  };
  const submitOtherOut = async (snOpt: any, jst: any) => {
    const bill = billInfo.value as SaleOutBill;
    const pdaUserInfo: PdaUserInfo = await userStore.getPdaUserInfo;
    const postJson: any = {};
    const params: any = {};
    params.formid = 'STK_MisDelivery';
    params.snOpt = snOpt;
    params.shop_id = bill.shop_id;
    const Model: any = {
      FID: 0,
      FBillNo: 'QTCK-' + bill.io_id,
      FCustId: { FNumber: bill.erp_shop_info?.custNum },
      FBizType: bill.erp_shop_info?.biztype,
      F_jst_jstdh: bill.io_id,
      F_o_id: bill.o_id,
      F_so_id: bill.so_id,
    };
    Model.FEntity = [];
    bill.items.forEach((item) => {
      const jine = item.sale_amount;
      const entry: any = {};
      entry.FMaterialID = { FNumber: item.sku_id };
      entry.FQty = item.qty;
      entry.FStockId = { FNumber: item.stock?.fStock };
      entry.FLot = { FNumber: '1' };
      entry.FIsFree = Number(jine) === 0;
      entry.FSerialSubEntity = [];
      scanExpendList.forEach((snInfo) => {
        if (snInfo.wlbm === item.sku_id && snInfo.ftype !== 'LNX') {
          entry.FSerialSubEntity.push({
            FSerialNo: snInfo.sn,
          });
        }
      });
      Model.FEntity.push(entry);
    });
    params.data = { Model };
    params.org = pdaUserInfo.orgNumber;
    params.jst = jst;
    postJson.params = params;
    const res = await otherOut(postJson);
    if (res.code === ResultEnum.SUCCESS) {
      ScanHook.afterSubmit(true, '操作成功', async () => {
        await refreshPage();
      });
    } else {
      ScanHook.afterSubmit(false, '操作失败:' + res.message);
    }
  };
  const qtyModalCancel = () => {
    billInputFocus.value = false;
    snInputFocus.value = true;
    changeFocus();
  };
  const deleteNote = (index: number) => {
    const expend = expendScan(scanList.value[index]);
    const expendSn = map(expend, 'sn');
    (billInfo.value as SaleOutBill).items.forEach((item) => {
      expend.forEach((e) => {
        if (e.wlbm === item.sku_id) {
          item.hasScanQty = Number(item.hasScanQty) - Number(e.sl);
        }
      });
    });
    let i = cloneDeep(scanExpendList.length);
    while (i--) {
      if (expendSn.includes(scanExpendList[i].sn)) {
        scanExpendList.splice(i, 1);
      }
    }
    scanList.value.splice(index, 1);
    refreshTable();
  };
  const qtyModalOk = (data: any, qty: number) => {
    const sl = cloneDeep(data.dataObj.sl);
    const sn = cloneDeep(data.dataObj.sn);
    try {
      if (data.childIndex !== -1) {
        (billInfo.value as SaleOutBill).items.forEach((item) => {
          if (item.sku_id === scanList.value[data.index].childs[data.childIndex].wlbm) {
            const hasScanQty = cloneDeep(item.hasScanQty);
            const bQty = cloneDeep(item.qty);
            if (Number(hasScanQty) - Number(sl) + qty > Number(bQty)) {
              throw new Error('超出单据数量!');
            }
            item.hasScanQty = Number(hasScanQty) - Number(sl) + qty;
          }
        });
        scanList.value[data.Index].childs[data.childIndex].bzsl = qty;
        scanList.value[data.Index].childs[data.childIndex].sl = qty;
      } else {
        (billInfo.value as SaleOutBill).items.forEach((item) => {
          if (item.sku_id === scanList.value[data.index].wlbm) {
            const hasScanQty = cloneDeep(item.hasScanQty);
            const bQty = cloneDeep(item.qty);
            if (Number(hasScanQty) - Number(sl) + qty > Number(bQty)) {
              throw new Error('超出单据数量!');
            }
            item.hasScanQty = Number(hasScanQty) - Number(sl) + qty;
          }
        });
        scanList.value[data.index].bzsl = qty;
        scanList.value[data.index].sl = qty;
      }
      for (let i = 0; i < scanExpendList.length; i++) {
        const obj = scanExpendList[i];
        if (obj.sn === sn) {
          obj.bzsl = qty;
          obj.sl = qty;
          break;
        }
      }
      qtyModalData.visible = false;
      refreshTable();
    } catch (e: any) {
      qtyModalData.visible = false;
      createMessage.error(e.message);
      console.log(e.message);
    }
  };
  const showQtyModal = (index: number, childIndex: number, data: any) => {
    qtyModalData.visible = true;
    qtyModalData.val = Number(data.hasScanQty);
    qtyModalData.keyNum = Date.now();
    qtyModalData.currPush = { index, childIndex, dataObj: data };
    // qtyModalData.max = Number(data.qty);
    billInputFocus.value = false;
    snInputFocus.value = false;
  };

  const changeStock = (value, option, id, newStock: Stock[]) => {
    stock = newStock;
    let changeStock;
    const copyStock = cloneDeep(newStock);
    copyStock.forEach((s) => {
      if (s.fStock === value) {
        console.log('change', s);
        changeStock = s;
      }
    });
    (billInfo.value as SaleOutBill).items[id].stock = changeStock;
    refreshTable();
  };

  let scanSum = ref<any[]>([]); //扫描的条码前置处理数组
  const refreshTable = () => {
    tableData.value = [];
    for (let i = 0; i < (billInfo.value as SaleOutBill).items?.length; i++) {
      const item: PartialSaleOutBillEntry = (billInfo.value as SaleOutBill).items[i];
      const hasItem = tableData.value.find((it) => {
        return it.number === item.sku_id;
      });
      const samePrice = tableData.value.find((it) => {
        return it.price === item.sale_price;
      });
      if (hasItem && samePrice) {
        continue;
      }
      tableData.value.push({
        rowKey: i,
        id: i + 1,
        number: item.sku_id,
        name: item.name,
        qty: item.hasScanQty + '/' + item.qty,
        stock: item.stock ? item.stock : '请选择仓库',
        model: item.properties_value,
        price: item.sale_price, // 单价
        amount: item.sale_amount,
      });
    }
  };
  const expendScan = (snInfo) => {
    return expendScanLoop([], snInfo);
  };
  const expendScanLoop = (currScanList, list) => {
    const bInfo = billInfo.value as SaleOutBill;
    if (list.ftype !== 'LNX') {
      if (Number(list.FSnType) !== 6) {
        bInfo.items.forEach((item) => {
          if (item.sku_id === list.wlbm) {
            //不是批次码的话要做判断
            if (!FlagSnOpt.HasPurIn(list.optBill) && !FlagSnOpt.HasOtherIn(list.optBill))
              throw new Error('所扫条码还没入库!');
            if (
              (FlagSnOpt.HasOtherOut(list.optBill) && !FlagSnOpt.HasOtherIn(list.optBill)) ||
              (FlagSnOpt.HasSaleOut(list.optBill) && !FlagSnOpt.HasSaleReturn(list.optBill))
            )
              throw new Error('所扫条码已出库!');
          }
        });
        // //不是批次码的话要做判断
        // if (!FlagSnOpt.HasPurIn(list.optBill) && !FlagSnOpt.HasOtherIn(list.optBill))
        //   throw new Error('所扫条码还没入库!');
        // if (
        //   (FlagSnOpt.HasOtherOut(list.optBill) && !FlagSnOpt.HasOtherIn(list.optBill)) ||
        //   (FlagSnOpt.HasSaleOut(list.optBill) && !FlagSnOpt.HasSaleReturn(list.optBill))
        // )
        //   throw new Error('所扫条码已出库!');
      }
    }
    let xList = concat(currScanList, list);
    if (list.childs && list.childs.length > 0) {
      list.childs.forEach((child) => {
        xList = expendScanLoop(xList, child);
      });
    }
    return xList;
  };
  const scanEvent = (snInfo, callback?): void => {
    try {
      scanSum.value = [];
      if (!Object.keys(billInfo.value) || Object.keys(billInfo.value).length === 0) {
        // callback(false, '请先扫描单据');
        throw new Error('请先扫描单据');
      }
      billInputFocus.value = false;
      snInputFocus.value = true;
      if (snInfo.ftype === 'LNX') {
        //外箱的情况下要判断里面是否有馅
        if (!snInfo.childs || snInfo.childs.length <= 0) {
          // callback(false, '该外箱条码没有包装彩盒/裸机');
          throw new Error('该外箱条码没有包装彩盒/裸机');
        }
        const bzsl = cloneDeep(snInfo.bzsl);
        if (Number(bzsl) !== 1) {
          //包装数量不为1一般是批次外箱
          snInfo.childs.forEach((item) => {
            item.sl = bzsl;
          });
        }
      }
      if (Number(snInfo.FSnType) === 6) {
        (billInfo.value as SaleOutBill).items.forEach((bItem) => {
          if (bItem.sku_id === snInfo.wlbm) {
            snInfo.sl = Number(bItem.qty) - Number(bItem.hasScanQty);
          }
        });
      }
      const list = expendScan(snInfo);
      let matchMat = false;
      list.forEach((item) => {
        scanExpendList.forEach((val) => {
          if (item.sn === val.sn) {
            // callback(false, '该条码已被扫描');
            throw new Error('该条码已被扫描');
          }
        });
        let flag = 0;
        (billInfo.value as SaleOutBill).items.forEach((bItem) => {
          if (item.ftype !== 'LNX' && bItem.sku_id === item.wlbm) {
            let index = scanSum.value.findIndex((i) => i.wlbm == bItem.sku_id && i.sale_price != bItem.sale_price);
            if (index != -1) return true;
            matchMat = true;
            const hasScan = cloneDeep(
              bItem.hasScanQty ? bItem.hasScanQty + Number(item.sl) : Number(item.sl),
            );
            if (hasScan > bItem.qty) {
              flag++;
              //判断是否有重复物料
              let count = 0; //记录物料编码个数
              console.log('count111', count);
              (billInfo.value as SaleOutBill).items.forEach((checkItem) => {
                if (item.ftype !== 'LNX' && item.wlbm === checkItem.sku_id) {
                  count++;
                }
              });
              console.log('flag1', flag);
              console.log('count2', count);
              if (count > 1 && flag < count) {
                console.log('flag11', flag);
                console.log('count22', count);
                return true; //继续匹配下一个相同物料
              }
              throw new Error('超出单据数量，请检查!');
            } else {
              scanSum.value.push({
                wlbm: bItem.sku_id,
                sale_price: bItem.sale_price,
              });
            }
            bItem.hasScanQty = hasScan;
          }
        });
      });
      if (!matchMat) throw new Error('没有匹配的物料，请检查!');
      refreshTable();
      scanExpendList = concat(scanExpendList, list);
      scanList.value.unshift(snInfo);
      if (callback && isFunction(callback)) {
        callback(true, '成功!');
        if (autoSubmit.value) {
          const noFullScan = (billInfo.value as SaleOutBill).items.findIndex((bItem) => {
            return Number(bItem.hasScanQty) !== Number(bItem.qty);
          });
          if (noFullScan === -1) submit();
        }
      }
    } catch (e: any) {
      if (callback && isFunction(callback)) {
        callback(false, e.message);
      }
      // ScanHook.afterScan(false);
      // createMessage.error(e.message);
      // console.log(e.message);
    }
  };
  const timerForBillSearch = async (billId): Promise<void> => {
    try {
      const res = await jstSaleOutBillSearch({
        params: billId,
      });
      if (res.code !== ResultEnum.SUCCESS) {
        billInput.value.formState.val = '';
        throw new Error('查询为空!');
      }
      billInfo.value = res.result ? res.result[0] : {};
      if (!Object.keys(billInfo.value) || Object.keys(billInfo.value).length === 0) {
        billInput.value.formState.val = '';
        throw new Error('查询为空!!');
      }
      if ((billInfo.value as SaleOutBill).status !== 'WaitConfirm') {
        billInput.value.formState.val = '';
        throw new Error('该单已被取消或已出库!');
      }
      billInfo.value = await isShopSpe(billInfo.value);
      if (billInfo.value) {
        (billInfo.value as SaleOutBill).items.reduce((sV, cV) => {
          console.log(cV);
          if (sV[cV.sku_id] && sV[cV.sale_price] == cV.sale_price) {
            sV[cV.sku_id].qty = Number(sV[cV.sku_id].qty) + Number(cV.qty);
            sV[cV.sku_id].sale_amount = Number(sV[cV.sku_id].sale_amount) + Number(cV.sale_amount);
          } else {
            sV[cV.sku_id] = cV;
          }
          return sV;
        }, {});
        // unionBy((billInfo.value as SaleOutBill).items, 'sku_id'); //去重复
        // (billInfo.value as SaleOutBill).items = unionBy(
        //   (billInfo.value as SaleOutBill).items,
        //   'sku_id',
        // ); //去重复
        stock.forEach((s) => {
          if ((billInfo.value as SaleOutBill).wms_co_id + '-1' === s.jstNumber) {
            (billInfo.value as SaleOutBill).items.forEach((item) => {
              item.stock = s;
            });
          }
        });
        const mats = map((billInfo.value as SaleOutBill).items, 'sku_id');
        const snInfos = await snInfoList(mats as string[]);
        snInfos.forEach((snInfo) => {
          scanEvent(snInfo, (res: boolean, message: string) => {
            if (!res) {
              createMessage.error(message);
              console.log(message);
            }
          });
        });
        refreshTable();
        billInputFocus.value = false;
        snInputFocus.value = true;
        changeFocus();
        ScanHook.afterScan(true);
      }
    } catch (e: any) {
      ScanHook.afterScan(false);
      console.log(e.message);
    }
  };
  let timerBillSearchId: NodeJS.Timeout;
  const inputContent = (name: string, val: string) => {
    if (!val) {
      if (timerBillSearchId) clearTimeout(timerBillSearchId);
      return;
    }
    if (name === billInputName) {
      if (timerBillSearchId) clearTimeout(timerBillSearchId);
      timerBillSearchId = setTimeout(() => {
        timerForBillSearch(val);
      }, 100);
    }
  };
  let timerChangeFocus: NodeJS.Timeout;
  const changeFocus = (name?: string) => {
    if (name === 'other') {
      if (timerChangeFocus) {
        clearTimeout(timerChangeFocus);
      }
      return;
    }
    timerChangeFocus = setTimeout(() => {
      if (name !== 'other') {
        if (!billInput.value?.hasFocus() && !snInput.value?.hasFocus()) {
          if ((billInfo.value as SaleOutBill).io_id) {
            snInput.value?.inputFocus();
          } else {
            billInput.value?.inputFocus();
          }
          // snInput.value?.inputFocus();
        } else {
          if ((billInfo.value as SaleOutBill).io_id && !snInput.value?.hasFocus()) {
            snInput.value?.inputFocus();
          }
        }
      }
    }, 200);
  };
  onMounted(async () => {
    let json = {
      pageIndex: 0,
      pageRows: 100,
      params: {
        condition: {
          'c.fnumber@like': '-1',
        },
      },
    };
    stock = await findStock(json);
    billTable.value.getStock(cloneDeep(stock));
  });
</script>
<style lang="less" scoped>
  /*.content {*/
  /*  !*display: flex;*!*/
  /*}*/
  //.left-base-content {
  //  display: flex;
  //  flex-direction: column;
  //  height: 100%;
  //}
  //.bottom-content {
  //  flex-grow: 1;
  //  flex-shrink: 1;
  //}
  // .w1 {
  //   margin: 15px 20px;
  //   font-size: 26px;
  // }
  // .w2 {
  //   margin: 15px 0px;
  //   font-size: 32px;
  // }
  // .top-content {
  //   font-size: 26px;
  // }
</style>
