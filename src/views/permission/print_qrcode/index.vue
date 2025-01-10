<template>
  <div class="purchaseorder-container">
    <el-space :fill="fill" wrap>
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>Query</span>
            <el-button class="button_right" @click="handelPurListPrint">
              <el-icon style="vertical-align: middle">
                <Search />
              </el-icon>
              <span style="vertical-align: middle"> {{ t('btn.query') }} </span>
            </el-button>
          </div>
        </template>
        <div class="demo-date-picker">
          <p class="lbl" style="margin-right: 15px">Register</p>
          <div class="block">
            <el-date-picker
              v-model="value_time"
              type="daterange"
              style="width: 80%"
              start-placeholder="Start date"
              end-placeholder="End date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </div>

          <div class="size">
            <p class="lbl">Size</p>
            <el-input style="width: 70%" class="input" v-model="state.XXCC"></el-input>
          </div>

          <div class="ry">
            <p class="lbl">RY</p>
            <el-input style="width: 70%" class="input" v-model="state.ZLBH"></el-input>
          </div>
          <div class="purno">
            <p class="lbl">PO</p>
            <el-input class="input" v-model="state.CGNO"></el-input>
          </div>
          <div class="material">
            <p class="lbl">Material</p>
            <el-input
              style="width: 40%"
              class="input"
              v-model="state.CLBH"
              v-if="userName != 'VA05'"
            ></el-input>

            <el-input style="width: 70%" class="input" v-model="state.YWPM"></el-input>
          </div>
          <div class="supp">
            <p class="lbl">Supplier</p>
            <el-input style="width: 30%" class="input_supp" v-model="userName"></el-input>
            <el-input style="width: 60%" class="input_supp" v-model="realName"></el-input>
          </div>
        </div>
      </el-card>

      <el-card class="box-card-purlist">
        <div class="card-header-pr">
          <span>Pur List</span>
        </div>
        <el-table
          v-loading="loading"
          :data="state.list"
          selection
          stripe
          highlight-current-row
          style="width: 99%"
          max-height="45vh"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" />
          <el-table-column
            v-if="userName != 'VA05'"
            :prop="state.purlist[0].prop"
            :label="state.purlist[0].label"
          />
          <el-table-column
            v-if="userName != 'VA05'"
            :prop="state.purlist[1].prop"
            :label="state.purlist[1].label"
          />

          <el-table-column
            v-if="userName === 'VA05'"
            :prop="state.purlist[10].prop"
            :label="state.purlist[10].label"
          />
          <el-table-column
            v-if="userName === 'VA05'"
            :prop="state.purlist[11].prop"
            :label="state.purlist[11].label"
          />

          <el-table-column :prop="state.purlist[2].prop" :label="state.purlist[2].label" />
          <el-table-column :prop="state.purlist[3].prop" :label="state.purlist[3].label" />
          <el-table-column :prop="state.purlist[4].prop" :label="state.purlist[4].label" />
          <el-table-column :prop="state.purlist[5].prop" :label="state.purlist[5].label" />
          <el-table-column :prop="state.purlist[6].prop" :label="state.purlist[6].label" />
          <el-table-column :prop="state.purlist[7].prop" :label="state.purlist[7].label" />
          <el-table-column :prop="state.purlist[8].prop" :label="state.purlist[8].label" />
          <el-table-column :prop="state.purlist[9].prop" :label="state.purlist[9].label" />
        </el-table>
      </el-card>
      <el-card class="box-card-detail">
        <div class="card-header-dt">
          <span class="tbl-detail">Detail List</span>
          <el-button class="button_right-dt" type="primary" @click="handlePrintAll">
            <el-icon>
              <Printer />
            </el-icon>
            <span> {{ t('btn.printall') }} </span>
          </el-button>
        </div>
        <div class="option-detail">
          <div class="search-detail">
            <span>Search</span>
            <el-input @input="searchData" v-model="searchValue" style="width: 50%"></el-input>
          </div>
        </div>
        <el-table
          v-loading="loading"
          :data="filteredData"
          selection
          stripe
          highlight-current-row
          style="width: 99%"
          max-height="45vh"
          @selection-change="handleSelectionDetail"
        >
          <el-table-column type="selection" width="50" />
          <el-table-column
            v-for="(item, index) in stateDetail.detaillist"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width || null"
            :formatter="item.formatter || null"
          />
        </el-table>
      </el-card>
    </el-space>
    <PrintQRCode_DialogVue
      v-if="stateDetail.printDialogShow"
      v-model:dialog-visible="stateDetail.printDialogShow"
      :action="stateDetail.action"
      @dialogClosed="loadDataAgain"
    />
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue';
  import { Search, Printer } from '@element-plus/icons';
  import { useLoading } from '@/hooks';
  import PrintQRCode_DialogVue from './components/PrintQRCode_Dialog.vue';

  import { useStore } from 'vuex';

  import { getPurListPrintAPI, getDetailListPrintAPI } from '@/api/print';
  import { useI18n } from 'vue-i18n';
  import dayjs from 'dayjs';
  const { t } = useI18n();
  const { loading, showLoading, hideLoading } = useLoading();

  const store = useStore();
  const userName = computed(() => {
    return store.getters['user/username'];
  });
  const realName = computed(() => {
    return store.getters['user/realname'];
  });

  const fill = ref(true);
  const searchValue = ref('');
  const filteredData = ref([]);

  const state = reactive({
    list: [],
    ZLBH: '',
    CGNO: '',
    CLBH: '',
    YWPM: '',
    XXCC: '',
    purlist: [
      {
        prop: 'CGNO',
        label: 'Purchase NO',
      },
      {
        prop: 'CLBH',
        label: 'Material No',
      },
      {
        prop: 'YWPM',
        label: 'Material Name',
      },
      {
        prop: 'Qty',
        label: 'Quantity',
      },
      {
        prop: 'DelQty',
        label: 'DeliveryQuantity',
      },
      {
        prop: 'PackQty',
        label: 'LoadingQuantity',
      },
      {
        prop: 'ZSYWJC',
        label: 'Supplier Name',
      },
      {
        prop: 'YQDate',
        label: 'Register Date',
      },
      {
        prop: 'ZLBH',
        label: 'RY',
      },
      {
        prop: 'XXCC',
        label: 'Size',
      },
      {
        prop: 'KHPO',
        label: 'PO',
      },
      {
        prop: 'ARTICLE',
        label: 'ARTICLE',
      },
    ],
    multipleSelection: [],
  });

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
    multipleSelection: [],
    printDialogShow: false,
    action: {
      data: [],
    },
  });
  //select

  const today = dayjs();
  const fromDate = ref(today);
  const pickerOptions = {
    disabledDate: disabledDate,
  };

  function disabledDate(date) {
    if (fromDate.value) {
      return fromDate.value < date;
    }
    return false;
  }
  const value_time = ref([
    today.subtract(30, 'days').format('YYYY-MM-DD'),
    today.add(60, 'days').format('YYYY-MM-DD'),
  ]);

  const handelPurListPrint = () => {
    state.purlist[0].width = 115;
    state.purlist[1].width = 110;
    state.purlist[2].width = 300;
    getPurListPrint();
  };

  const getPurListPrint = () => {
    showLoading();
    getPurListPrintAPI({
      ZSDH: userName.value,
      YQDate1: value_time.value[0],
      YQDate2: value_time.value[1],
      CGNO: state.CGNO,
      CLBH: state.CLBH,
      YWPM: state.YWPM,
      ZLBH: state.ZLBH,
      XXCC: state.XXCC,
    })
      .then((res) => {
        state.list = res.data;
        hideLoading();
      })
      .catch(() => {
        hideLoading();
      });
  };

  const searchData = () => {
    filteredData.value = stateDetail.list.filter((row) =>
      row.PrintS.toString().includes(searchValue.value)
    );
  };

  const handleClearInput = () => {
    searchValue.value = '';
    searchData();
  };

  const handleSelectionChange = (selectedRows = [], deselectedRows = []) => {
    var list = [];

    if (selectedRows.length === 0) {
      filteredData.value = [];
    } else {
      selectedRows.forEach((row) => {
        list.push({ SCNO: row.SCNO, CLBH: row.CLBH });
      });

      getDetailListPrintAPI({
        Data: list,
      })
        .then((res) => {
          stateDetail.list = res.data;
          filteredData.value = stateDetail.list;
          hideLoading();
        })
        .catch(() => {
          hideLoading();
        });
    }

    if (deselectedRows.length > 0) {
      // Loại bỏ các hàng bị bỏ chọn khỏi filteredData
      deselectedRows.forEach((row) => {
        filteredData.value = filteredData.value.filter(
          (item) => item.SCNO !== row.SCNO && item.CLBH !== row.CLBH
        );
        handleClearInput();
      });
    }
  };
  const handleSelectionDetail = (val) => {
    stateDetail.multipleSelection = val;
  };

  const handlePrintAll = () => {
    if (stateDetail.multipleSelection.length != 0) {
      stateDetail.action.data = stateDetail.multipleSelection;
      stateDetail.printDialogShow = true;
    }
  };

  const loadDataAgain = () => {
    const oldList = [...stateDetail.list];
    var list = [];
    stateDetail.action.data.forEach((row) => {
      list.push({ SCNO: row.SCNO, CLBH: row.CLBH });
    });
    getDetailListPrintAPI({
      Data: list,
    })
      .then((res) => {
        const newData = oldList.map((oldItem) => {
          const matchingItem = res.data.find(
            (newItem) => newItem.SCNO === oldItem.SCNO && newItem.Pack === oldItem.Pack
          );
          if (matchingItem) {
            return matchingItem;
          } else {
            return oldItem;
          }
        });
        stateDetail.list = newData;
        filteredData.value = stateDetail.list;
        hideLoading();
      })
      .catch(() => {
        hideLoading();
      });
  };
</script>

<style lang="scss" scoped>
  .el-space.el-space--horizontal {
    min-width: 100%;

    .el-card.is-always-shadow.box-card,
    .el-card.is-always-shadow.box-card-purlist,
    .el-card.is-always-shadow.box-card-detail {
      border-top-color: rgb(203, 175, 132);
      border-top-width: 3px;
    }
  }

  .demo-date-picker {
    display: flex;
    align-items: center;

    .size,
    .purno,
    .material,
    .ry,
    .supp {
      margin-left: 1.5vw;
      display: flex;
      align-items: center;
    }
  }

  .lbl {
    font-weight: bolder;
    margin-right: 0px;
  }

  .el-input {
    margin-left: 2vh;
  }

  .card-header,
  .card-header-dt,
  .option-detail,
  .option-pur {
    display: flex;
    align-items: center;
  }

  .button_right {
    background-color: #e7e7e7;
    margin-left: auto;
  }

  .button_right-dt,
  .search-detail,
  .search-pur {
    margin-left: auto;
  }

  .option-detail,
  .option-pur {
    margin-top: 1vw;
    margin-bottom: 1vw;
  }

  span {
    font-size: 16px;
  }
</style>
