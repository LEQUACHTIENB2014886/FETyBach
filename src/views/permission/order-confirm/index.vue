<template>
  <div class="purchaseorder-container">
    <el-space :fill="fill" wrap>
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>Query</span>
            <div class="button_check">
              <el-checkbox v-model="state.cfm" class="check_right" @click="ResetList"
                >Check Confirm
              </el-checkbox>
              <el-button @click="getPurList" class="button_right">
                <el-icon style="vertical-align: middle">
                  <Search />
                </el-icon>
                <span style="vertical-align: middle"> {{ t('btn.query') }} </span>
              </el-button>
            </div>
          </div>
        </template>
        <div class="demo-date-picker">
          <p class="lbl">Register</p>
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
          <div class="ry">
            <p class="lbl">RY</p>
            <el-input style="width: 70%" class="input" v-model="state.zlbh"> </el-input>
          </div>
          <div class="purno">
            <p class="lbl">PO</p>
            <el-input class="input" v-model="state.cgno"></el-input>
          </div>
          <div class="material">
            <p class="lbl">Material</p>
            <el-input style="width: 40%" class="input" v-model="state.clbh"></el-input>
            <el-input style="width: 70%" class="input" v-model="state.ywpm"></el-input>
          </div>
          <div class="supp">
            <p class="lbl">Supplier</p>
            <el-input style="width: 30%" class="input_supp" v-model="userName" readonly></el-input>
            <el-input style="width: 60%" class="input_supp" v-model="realName" readonly></el-input>
          </div>
        </div>
      </el-card>

      <el-scrollbar>
        <el-card class="box-card-purlist">
          <div class="card-head">
            <span>Pur List</span>
            <el-button
              class="button_left"
              @click="handleCFMAll"
              style="
                float: right;
                margin: 10px 0px;
                background-color: rgb(137, 181, 199);
                color: black;
              "
              v-if="state.cfm == false && state.list?.length > 0"
            >
              <span style="vertical-align: middle"> {{ t('btn.confirm') }} </span>
            </el-button>
          </div>

          <el-table
            v-loading="loading"
            :data="state.list"
            max-height="60vh"
            border
            selection
            stripe
            highlight-current-row
            style="width: 99%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" />
            <el-table-column
              v-if="userName === 'VA05'"
              :prop="state.purlist[12].prop"
              :label="state.purlist[12].label"
            />
            <el-table-column
              v-if="userName === 'VA05'"
              :prop="state.purlist[13].prop"
              :label="state.purlist[13].label"
            />
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
            <el-table-column :prop="state.purlist[2].prop" :label="state.purlist[2].label" />
            <el-table-column :prop="state.purlist[3].prop" :label="state.purlist[3].label" />
            <el-table-column :prop="state.purlist[4].prop" :label="state.purlist[4].label" />
            <el-table-column :prop="state.purlist[5].prop" :label="state.purlist[5].label" />
            <el-table-column :prop="state.purlist[6].prop" :label="state.purlist[6].label" />
            <el-table-column :prop="state.purlist[7].prop" :label="state.purlist[7].label" />
            <el-table-column :prop="state.purlist[8].prop" :label="state.purlist[8].label" />
            <el-table-column :prop="state.purlist[9].prop" :label="state.purlist[9].label" />
            <el-table-column :prop="state.purlist[10].prop" :label="state.purlist[10].label" />
            <el-table-column :prop="state.purlist[11].prop" :label="state.purlist[11].label" />
            <el-table-column label="Action" fixed="right">
              <template #default="scope">
                <el-button type="primary" @click="handleViewDetail(scope.row.SCNO, scope.row.CLBH)"
                  >View</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-scrollbar>
    </el-space>
    <el-dialog v-model="state.detailDialogVisible" title="Details">
      <el-table
        v-loading="loading"
        :data="detailList"
        selection
        stripe
        highlight-current-row
        style="width: 99%"
        max-height="45vh"
      >
        <el-table-column
          v-for="(item, index) in state.detailList"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width || null"
          :formatter="item.formatter || null"
        />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue';
  import { Search } from '@element-plus/icons';
  import { GetPurCFMAPI, GetDetailCFMAPI, CFMALLAPI } from '@/api/cfmOrder';
  import { useLoading } from '@/hooks';
  import { useStore } from 'vuex';
  import dayjs from 'dayjs';
  import { ElMessageBox, ElMessage } from 'element-plus';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();

  const fill = ref(true);

  const today = dayjs();
  const { loading, showLoading, hideLoading } = useLoading();
  const detailList = ref([]);
  const store = useStore();
  const userName = computed(() => {
    return store.getters['user/username'];
  });

  const realName = computed(() => {
    return store.getters['user/realname'];
  });

  const value_time = ref([
    today.subtract(30, 'days').format('YYYY-MM-DD'),
    today.add(60, 'days').format('YYYY-MM-DD'),
  ]);

  const state = reactive({
    list: [],
    cgno: '',
    clbh: '',
    ywpm: '',
    zlbh: '',
    cfm: false,
    purlist: [
      {
        prop: 'CGNO',
        label: 'Purchase NO',
      },
      {
        prop: 'ZLBH',
        label: 'RY',
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
        label: 'Delivery Quantity',
      },
      {
        prop: 'PackQty',
        label: 'Load Quantity',
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
        prop: 'MEMO',
        label: 'Delivery Date',
      },
      {
        prop: 'DOCNO',
        label: 'DOC NO',
      },
      {
        prop: 'Status',
        label: 'Status',
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
    detailList: [
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
    detailDialogVisible: false,
    multipleSelection: [],
  });

  const getPurList = () => {
    showLoading();
    GetPurCFMAPI({
      ZSDH: userName.value,
      YQDate1: value_time.value[0],
      YQDate2: value_time.value[1],
      CGNO: state.cgno,
      CLBH: state.clbh,
      YWPM: state.ywpm,
      ZLBH: state.zlbh,
      CFM: state.cfm === false ? 1 : 2,
    })
      .then((res) => {
        state.list = res.data;
        hideLoading();
      })
      .catch(() => {
        hideLoading();
      });
  };
  const ResetList = () => {
    state.list = [];
  };
  const handleSelectionChange = (val) => {
    state.multipleSelection = val;
  };
  const handleViewDetail = (SCNO1, CLBH1) => {
    state.detailDialogVisible = true;
    showLoading();
    GetDetailCFMAPI({
      SCNO: SCNO1,
      CLBH: CLBH1,
    })
      .then((res) => {
        detailList.value = res.data;
        hideLoading();
      })
      .catch(() => {
        hideLoading();
      });
  };

  const handleCFMAll = () => {
    var DataList = [];
    if (state.multipleSelection.length != 0) {
      state.multipleSelection.forEach((row) => {
        DataList.push({
          SCNO: row.SCNO,
          CLBH: row.CLBH,
          USERID: userName.value,
        });
      });
      ElMessageBox.confirm('Are you sure confirm?\nEither OK or Cancel.', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      })
        .then(() => {
          ElMessage({
            type: 'success',
            message: 'Confirm completed',
          });
          showLoading();
          CFMALLAPI({
            Data: DataList,
          })
            .then(() => {
              getPurList();
              hideLoading();
            })
            .catch(() => {
              hideLoading();
            });
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: 'Confirm canceled',
          });
        });
    }
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

  .inline-label {
    display: inline-block;
    margin-right: 10px;
  }

  .lbl-lot_file {
    font-size: 0.7rem;
    font-style: italic;
    color: #666666;
    margin-left: 0.7vw;
  }

  div.el-input.tbl-txt {
    margin-left: 0;
  }

  .card-hd {
    display: flex;
    justify-content: flex-end;
  }

  .demo-date-picker {
    display: flex;
    align-items: center;

    .purno,
    .material,
    .ry,
    .supp {
      margin-left: 0.5vw;
      display: flex;
      align-items: center;
    }
  }

  .detail-list {
    margin-left: 5vw;
    margin-bottom: 3vw;
    display: flex;
    align-items: center;

    .lotno,
    .docno {
      display: flex;
      align-items: center;
    }
  }

  .lbl {
    margin-right: 1vh;
  }

  .el-input {
    margin-left: 1vh;
  }

  .card-header {
    display: flex;
    align-items: center;
  }

  .button_check {
    margin-left: auto;
  }

  .check_right {
    margin-left: auto;
    margin-right: 15px;
  }

  .button_right {
    background-color: #e7e7e7;
  }

  span {
    font-size: 16px;
  }

  .el-table td:not(:last-child) {
    border-right: 1px solid #ebeef5;
  }

  .el-table div.el-input {
    margin-left: 0;
  }

  .btn-group el-button {
    margin-left: 0;
  }

  .el-table thead {
    color: black;
  }

  .el-table div.el-input {
    margin-left: 0;
  }
</style>
