<template>
  <div class="purchaseorder-container">
    <el-space :fill="fill" wrap>
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>Query</span>
            <el-button class="button_right" @click="getPurList(1)">
              <el-icon style="vertical-align: middle">
                <Search />
              </el-icon>
              <span style="vertical-align: middle"> {{ t('btn.query') }} </span>
            </el-button>
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

          <!-- <div class="ry">
            <p class="lbl">RY</p>
            <el-input style="width: 70%" class="input" v-model="state.zlbh"> </el-input>
          </div> -->
          <div class="purno">
            <p class="lbl">PO</p>
            <el-input class="input" v-model="state.khpo"></el-input>
          </div>
          <div class="article">
            <p class="lbl">ARTICLE </p>
            <el-input class="input" v-model="state.article"></el-input>
          </div>
          <div class="material">
            <p class="lbl">Material</p>
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
            @sort-change="handleSortChange"
            @row-click="handleRowClick"
          >
            <el-table-column
              v-if="false"
              :prop="state.purlist[0].prop"
              :label="state.purlist[0].label"
            />
            <el-table-column
              v-if="false"
              :prop="state.purlist[8].prop"
              :label="state.purlist[8].label"
            />
            <el-table-column
              v-if="false"
              :prop="state.purlist[1].prop"
              :label="state.purlist[1].label"
            />
            <el-table-column :prop="state.purlist[9].prop" :label="state.purlist[9].label" />
            <el-table-column :prop="state.purlist[10].prop" :label="state.purlist[10].label" />
            <el-table-column :prop="state.purlist[2].prop" :label="state.purlist[2].label" />
            <el-table-column :prop="state.purlist[3].prop" :label="state.purlist[3].label" />
            <el-table-column :prop="state.purlist[4].prop" :label="state.purlist[4].label" />
            <el-table-column :prop="state.purlist[5].prop" label="Load Quantity">
              <template #default="scope">
                <el-input type="number" v-model="scope.row.PackQty" style="width: fit-content" />
              </template>
            </el-table-column>
            <el-table-column :prop="state.purlist[6].prop" :label="state.purlist[6].label" />
            <el-table-column :prop="state.purlist[7].prop" :label="state.purlist[7].label" />
            <el-table-column label="Action" fixed="right">
              <template #default="scope">
                <el-button
                  v-if="!isLoading && !(scope.row.CFMDel == '-1' && scope.row.CFMID != '0')"
                  type="primary"
                  @click="
                    handleSetPackQty(
                      scope.row.CGNO,
                      scope.row.CLBH,
                      scope.row.ZLBH,
                      scope.row.PackQty
                    )
                  "
                >
                  Save
                </el-button>
                <el-button v-if="isLoading" type="primary" disabled> Loading... </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-scrollbar>

      <el-card class="box-card-detail">
        <span class="tbl-detail">Detail List</span>
        <div v-if="stateDetail.list != null && stateDetail.list.length > 0">
          <div class="card-hd">
            <div class="btn-group">
              <el-button
                v-if="!(stateDetail.list[0].CFMDel == '' && stateDetail.list[0].CFMID != '')"
                type="primary"
                @click="handleAddPack"
                >Add</el-button
              >
              <el-input-number
                v-if="!(stateDetail.list[0].CFMDel == '' && stateDetail.list[0].CFMID != '')"
                type="number"
                v-model="qtyad"
                min="1"
                :max="stateDetail.list.length"
                step="1"
                @keydown="removeDecimalPoint"
                controls-position="right"
                size="large"
                @change="handleChange"
                style="margin: 10px"
              />
              <el-button
                v-if="!(stateDetail.list[0].CFMDel == '' && stateDetail.list[0].CFMID != '')"
                type="danger"
                @click="handleDelPack"
                >Delele</el-button
              >
              <el-button
                v-if="!(stateDetail.list[0].CFMDel == '' && stateDetail.list[0].CFMID != '')"
                type="warning"
                @click="handleLoadingQty"
                >Loading Qty</el-button
              >
              <el-button type="success" @click="handleCFM">Confirm</el-button>
            </div>
          </div>
          <div class="detail-list">
            <p class="lbl">Dellvery Date</p>
            <div class="block">
              <el-date-picker
                :disabled="stateDetail.list[0].CFMDel == '' && stateDetail.list[0].CFMID != ''"
                type="date"
                v-model="stateDetail.list[0].MEMO"
                style="width: 70%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </div>
            <div class="docno">
              <p class="lbl">DOC NO</p>
              <el-input
                :disabled="stateDetail.list[0].CFMDel == '' && stateDetail.list[0].CFMID != ''"
                style="width: 60%"
                v-model="stateDetail.list[0].DOCNO"
                class="input"
              ></el-input>
            </div>
            <div class="lotno">
              <p class="lbl">Lot NO</p>
              <el-input
                :disabled="stateDetail.list[0].CFMDel == '' && stateDetail.list[0].CFMID != ''"
                style="width: 70%"
                v-model="lotnoall"
                class="input"
                @keyup.enter="onLotNoChange"
                placeholder="(enter to coppy paste on)"
              >
              </el-input>
            </div>
          </div>
        </div>
        <el-table
          v-loading="loading"
          :data="stateDetail.list"
          max-height="45vh"
          selection
          stripe
          highlight-current-row
          style="width: 99%"
          @sort-change="handleSortChange"
        >
          <el-table-column
            :prop="stateDetail.detaillist[0].prop"
            :label="stateDetail.detaillist[0].label"
          />
          <el-table-column
            :prop="stateDetail.detaillist[1].prop"
            :label="stateDetail.detaillist[1].label + ' (Total = ' + stateDetail.total + ')'"
          >
            <template #default="scope">
              <el-input
                :disabled="stateDetail.list[0].CFMDel == '' && stateDetail.list[0].CFMID != ''"
                type="number"
                v-model="scope.row.Qty"
                style="width: fit-content"
                @input="onQtyChange"
              />
            </template>
          </el-table-column>
          <el-table-column
            :prop="stateDetail.detaillist[2].prop"
            :label="stateDetail.detaillist[2].label"
          >
            <template #default="scope">
              <el-input
                :disabled="stateDetail.list[0].CFMDel == '' && stateDetail.list[0].CFMID != ''"
                type="text"
                v-model="scope.row.LotNO"
                style="width: fit-content"
              />
            </template>
          </el-table-column>

          <el-table-column
            :prop="stateDetail.detaillist[3].prop"
            :label="stateDetail.detaillist[3].label"
          >
            <template #default="scope">
              <el-upload
                :disabled="stateDetail.list[0].CFMDel == '' && stateDetail.list[0].CFMID != ''"
                :http-request="(file) => handleUpload(file, scope.row.LotNO)"
              >
                <el-button
                  size="small"
                  type="primary"
                  :disabled="stateDetail.list[0].CFMDel == '' && stateDetail.list[0].CFMID != ''"
                  >Upload</el-button
                >
              </el-upload>
            </template>
          </el-table-column>
          <el-table-column :prop="stateDetail.detaillist[3].prop" />
        </el-table>
      </el-card>
    </el-space>
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue';
  import { Search } from '@element-plus/icons';
  import {
    getPurListPOAPI,
    getDetailListSAPI,
    setPackQtySAPI,
    addPackSAPI,
    delPackSAPI,
    loadingQtySAPI,
    CFMSAPI,
    uploadFileSAPI,
  } from '@/api/purdOrder';
  import { useLoading } from '@/hooks';
  import { useStore } from 'vuex';
  import dayjs from 'dayjs';
  import { ElMessageBox, ElMessage } from 'element-plus';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();

  const fill = ref(true);
  const qtyad = ref(1);
  const isLoading = ref(false);
  const removeDecimalPoint = (event) => {
    const keyCode = event.keyCode;
    // Kiểm tra nếu người dùng nhập dấu chấm hoặc các ký tự khác ngoài số và các phím điều hướng
    if (keyCode === 190 || keyCode === 231 || keyCode === 110) {
      event.preventDefault();
    }
  };
  const today = dayjs();
  const { loading, showLoading, hideLoading } = useLoading();

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
  const lotnoall = ref('');
  const onLotNoChange = () => {
    const inputValue = lotnoall.value;
    const columnProp = stateDetail.detaillist[2].prop;
    stateDetail.list.forEach((item) => {
      item[columnProp] = inputValue;
    });
  };

  const state = reactive({
    list: [],
    khpo: '',
    article: '',
    ywpm: '',
    zlbh: '',
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
        prop: 'ZLBH',
        label: 'RY',
      },
      {
        prop: 'KHPO',
        label: 'KHPO',
      },
      {
        prop: 'ARTICLE',
        label: 'Artical',
      },
    ],
  });

  const getPurList = (i) => {
    showLoading();
    if (i === 1) {
      stateDetail.list = [];
      stateDetail.total = 0;
    }
    getPurListPOAPI({
      ZSDH: userName.value,
      YQDate1: value_time.value[0],
      YQDate2: value_time.value[1],
      KHPO: state.khpo,
      ARTICLE: state.article,
      YWPM: state.ywpm,
      ZLBH: state.zlbh,
    })
      .then((res) => {
        state.list = res.data;
        hideLoading();
      })
      .catch(() => {
        hideLoading();
      });
  };

  const stateDetail = reactive({
    list: [],
    lotno: '',
    total: 0,
    detaillist: [
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
      {
        prop: 'DOCNO',
        label: 'DOC NO',
      },
      {
        prop: 'MEMO',
        label: 'Delivery Date',
      },
      {
        prop: 'ZLBH',
        label: 'Memo_RY',
      },
    ],
  });

  const getDetailList = (pNo, mNo, zNo) => {
    showLoading();
    stateDetail.list = [];
    qtyad.value = 1;
    stateDetail.total = 0;
    getDetailListSAPI({
      CGNO: pNo,
      CLBH: mNo,
      ZLBH: zNo,
    })
      .then((res) => {
        stateDetail.list = [];
        stateDetail.list.push(...res.data);
        stateDetail.total = 0;
        for (let i = 0; i < stateDetail.list.length; i++) {
          stateDetail.total += parseFloat(stateDetail.list[i].Qty);
        }
        stateDetail.total = Number(stateDetail.total.toFixed(2));
        if (stateDetail.list[0].MEMO === '') {
          const currentDate = new Date();
          stateDetail.list[0].MEMO = currentDate.toISOString().split('T')[0];
        }
        hideLoading();
      })
      .catch(() => {
        hideLoading();
      });
  };

  const handleRowClick = (row, column, event) => {
    getDetailList(row.CGNO, row.CLBH, row.ZLBH);
    // document.querySelector('.lotno').scrollIntoView({ behavior: 'smooth' });
  };

  const handleUpload = (file, lotNo) => {
    if (lotNo == '') {
      ElMessage.error('Please enter LotNO !!!');
    } else {
      uploadFileSAPI({
        ZSDH: userName.value,
        LotNO: lotNo,
        LotFile: file.file,
      });
    }
  };

  const handleSetPackQty = (CGNO, CLBH, ZLBH, PackQty) => {
    isLoading.value = true;
    stateDetail.list = [];
    console.log(stateDetail.list);
    showLoading();
    setPackQtySAPI({
      CGNO: CGNO,
      CLBH: CLBH,
      ZLBH: ZLBH,
      PackQty: PackQty,
      USERID: userName.value,
    })
      .then(() => {
        getPurList();
        getDetailList(CGNO, CLBH, ZLBH);
        hideLoading();
      })
      .catch(() => {
        hideLoading();
      })
      .finally(() => {
        hideLoading();
        isLoading.value = false; // Hoàn tất tải dữ liệu
      });
  };

  const handleAddPack = () => {
    showLoading();
    addPackSAPI({
      SCNO: stateDetail.list[0].SCNO,
      CLBH: stateDetail.list[0].CLBH,
      ZLBH: stateDetail.list[0].ZLBH,
      USERID: userName.value,
      QTYAD: qtyad.value,
    })
      .then(() => {
        getPurList();
        getDetailList(stateDetail.list[0].CGNO, stateDetail.list[0].CLBH, stateDetail.list[0].ZLBH);
        hideLoading();
      })
      .catch(() => {
        hideLoading();
      });
  };

  const handleDelPack = () => {
    showLoading();
    delPackSAPI({
      SCNO: stateDetail.list[0].SCNO,
      CLBH: stateDetail.list[0].CLBH,
      ZLBH: stateDetail.list[0].ZLBH,
      USERID: userName.value,
      QTYAD: qtyad.value,
    })
      .then(() => {
        getPurList();
        getDetailList(stateDetail.list[0].CGNO, stateDetail.list[0].CLBH, stateDetail.list[0].ZLBH);
        hideLoading();
      })
      .catch(() => {
        hideLoading();
      });
  };

  const onQtyChange = () => {
    stateDetail.total = 0;
    for (let i = 0; i < stateDetail.list.length; i++) {
      stateDetail.total += parseFloat(stateDetail.list[i].Qty);
    }
    stateDetail.total = Number(stateDetail.total.toFixed(2));
  };

  const handleLoadingQty = () => {
    showLoading();
    var DataList = [];
    for (let i = 0; i < stateDetail.list.length; i++) {
      DataList.push({
        SCNO: stateDetail.list[i].SCNO,
        CLBH: stateDetail.list[i].CLBH,
        Pack: stateDetail.list[i].Pack,
        Qty: Number(stateDetail.list[i].Qty),
        LotNO: stateDetail.list[i].LotNO,
        USERID: userName.value,
      });
    }
    loadingQtySAPI({
      CGNO: stateDetail.list[0].CGNO,
      ZLBH: stateDetail.list[0].ZLBH,
      DOCNO: stateDetail.list[0].DOCNO,
      MEMO: dayjs(stateDetail.list[0].MEMO).format('YYYY-MM-DD'),
      DelQty: stateDetail.total,
      Data: DataList,
    })
      .then(() => {
        getPurList();
        getDetailList(stateDetail.list[0].CGNO, stateDetail.list[0].CLBH, stateDetail.list[0].ZLBH);
        hideLoading();
      })
      .catch(() => {
        hideLoading();
      });
  };

  const handleCFM = () => {
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
        handleLoadingQty();
        showLoading();
        CFMSAPI({
          SCNO: stateDetail.list[0].SCNO,
          CLBH: stateDetail.list[0].CLBH,
          USERID: userName.value,
        })
          .then(() => {
            getPurList();
            getDetailList(
              stateDetail.list[0].CGNO,
              stateDetail.list[0].CLBH,
              stateDetail.list[0].ZLBH
            );
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
  };

  const state1 = {
    lot: ref(''), // Sử dụng ref để làm cho nó có tính phản ứng
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
    .article,
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

  .button_right {
    background-color: #e7e7e7;
    margin-left: auto;
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
