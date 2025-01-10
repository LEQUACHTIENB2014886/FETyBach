<template>
  <el-dialog v-model="dialogShow" title="Print Label" :close-on-click-modal="false">
    <div id="printMe">
      <div v-for="item in stateDetail.list" v-bind:key="item.Barcode">
        <table>
          <tr style="height: 40px">
            <th rowspan="3" style="width: 135px; padding-left: 2px; text-align: center;">
              <!-- <img :src="'https://chart.googleapis.com/chart?chs=130x90&cht=qr&chld=M|1&chl=' + item.Barcode
                " title="Link to Google.com" /> -->
              <vue-qrcode :value="item.Barcode" width="90" margin="1" errorCorrectionLevel="Q"/>
            </th>
            <td colspan="2" style="padding-left: 2px; width: 80px">Material Code</td>
            <td style="text-align: center; font-size: 23px; width: 131px"><b>{{ item.CLBH }}</b></td>
          </tr>
          <tr style="height: 11px">
            <td colspan="2" style="padding-left: 2px; width: 80px">LOTNo</td>
            <td style="padding-left: 5px; font-size: 15px; width: 131px"><b>{{ item.LotNO }}</b></td>
          </tr>
          <tr style="height: 11px">
            <td colspan="3" style="padding-left: 5px; font-size: 11px; width: 211px"><b>{{ item.Barcode }}</b>
            </td>
          </tr>
          <tr style="height: 78px">
            <td style="padding-left: 2px">Material Name</td>
            <td colspan="3"><span style="
                  width: 210px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  line-height: 12px;
                  -webkit-line-clamp: 6;
                  height: 72px;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  font-size: 11px;
                  word-wrap: break-word;
                "><b>{{ item.YWPM }}</b></span>
            </td>
          </tr>
          <tr style="height: 11px">
            <td style="padding-left: 2px">Supplier Name</td>
            <td colspan="3"><b>{{ item.ZSYWJC }}</b></td>
          </tr>
          <tr style="height: 11px">
            <td style="padding-left: 2px">Po.NO</td>
            <td colspan="3"><b>{{ item.CGNO }}</b></td>
          </tr>
          <tr style="height: 26px">
            <td style="vertical-align: top; padding-left: 2px">RY</td>
            <td colspan="3"><span style="
                  width: 210px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  line-height: 12px;
                  -webkit-line-clamp: 2;
                  height: 24px;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  font-size: 11px;
                  word-wrap: break-word;
                "><b>{{ item.Memo_RY }}</b></span>
            </td>
          </tr>
          <tr style="height: 39px">
            <td style="padding-left: 2px">SKU#/BUY</td>
            <td colspan="3"><span style="
                  width: 210px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  line-height: 12px;
                  -webkit-line-clamp: 3;
                  height: 36px;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  font-size: 11px;
                "><b>{{ item.Memo_Article }}</b></span>
            </td>
          </tr>
          <tr style="height: 15px">
            <td style="padding-left: 2px">Quantity</td>
            <td colspan="2" style="text-align: center"><b>{{ item.Qty }}</b></td>
            <td style="text-align: center"><b>{{ item.XXCC}}</b> </td>
          </tr>
          <tr style="height: 11px">
            <td style="padding-left: 2px">Roll No</td>
            <td colspan="2" style="text-align: center;"><b>{{ item.Pack }}</b></td>
            <td style="padding-left: 30%"><b>{{ item.Box }}</b> </td>
          </tr>
          <tr style="height: 11px">
            <td style="padding-left: 2px">Date Received/Inv.No</td>
            <td colspan="3"><b>{{ item.Date_Received }}</b></td>
          </tr>
          <tr style="height: 11px">
            <td></td>
            <td style="width: 40px; text-align: center">Pass</td>
            <td style="width: 40px; text-align: center">Fail</td>
            <td style="text-align: center">FIFO</td>
          </tr>
          <tr style="height: 11px">
            <td style="padding-left: 2px">Lab Test Result</td>
            <td></td>
            <td></td>
            <td rowspan="5" style="text-align: center; font-size: 65px"><b>{{ item.FIFO }}</b></td>
          </tr>
          <tr style="height: 11px">
            <td style="padding-left: 2px">Visual Result</td>
            <td></td>
            <td></td>
          </tr>
          <tr style="height: 11px">
            <td style="padding-left: 2px">Dimensional Result</td>
            <td></td>
            <td></td>
          </tr>
          <tr style="height: 11px">
            <td style="padding-left: 2px">Defect & Grading Check</td>
            <td></td>
            <td></td>
          </tr>
          <tr style="height: 11px">
            <td style="padding-left: 2px">Checker/Signature</td>
            <td style="text-align: center" colspan="2"><b>77576</b></td>
          </tr>
          <tr style="height: 11px">
            <td colspan="4" style="text-align: right"><b>Document Number: QIP/WI/VI/01</b></td>
          </tr>
        </table>
        <div style="page-break-after: always"><br /></div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">{{ t('btn.cancel') }}</el-button>
        <el-button class="button_right-dt" type="primary" v-print="'#printMe'">
          <el-icon>
            <Printer />
          </el-icon>
          <span> {{ t('btn.printall') }} </span>
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'UserDialog',
};
</script>

<script setup>
import { reactive, computed } from 'vue';
import { getLabelPrintAPI } from '@/api/print';
import { useI18n } from 'vue-i18n';
import { Printer } from '@element-plus/icons';

import { createApp } from 'vue';
import VueQrcode from 'vue-qrcode';

const app = createApp({});

app.component(VueQrcode.name, VueQrcode);

const { t } = useI18n();

const stateDetail = reactive({
  list: [],
  detaillist: [
    {
      prop: 'PrintS',
      label: 'Print',
    },
    {
      prop: 'Pack',
      label: 'Pack',
    },
    {
      prop: 'Qty',
      label: 'Quantity',
    },
    {
      prop: 'LotNO',
      label: 'Lot No',
    },
    {
      prop: 'LotFile',
      label: 'Lot File',
    },
  ],
});

const getLabelPrint = () => {
  if (props.action.data.length === 0) return;
  var DataList = [];
  props.action.data.map((item) => {
    DataList.push({
      SCNO: item.SCNO,
      CLBH: item.CLBH,
      Pack: item.Pack,
      PrintS: Number(item.PrintS),
    });
  });

  getLabelPrintAPI({
    Data: DataList,
  })
    .then((res) => {
      stateDetail.list = res.data;
    })
    .catch(() => { });
};

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
  action: {
    default: () => {
      return {
        data: [],
      };
    },
  },
});

const dialogShow = computed({
  get: () => props.dialogVisible,
  set: (val) => emit('update:dialogVisible', val),
});

const emit = defineEmits(['update:dialogVisible', 'change']);
const handleCancel = () => {
  emit('update:dialogVisible', false);
  emit('dialogClosed');
};

onBeforeMount(() => {
  Object.assign(stateDetail, { ...props.action.data });
  getLabelPrint();
});
</script>

<style lang="scss" scoped>
table {
  border: 3px solid black;
  border-collapse: collapse;
}

table th,
td {
  border: 1px solid black;
  border-collapse: collapse;
  font-size: 13px;
  font-family: Times New Roman;
}
</style>
