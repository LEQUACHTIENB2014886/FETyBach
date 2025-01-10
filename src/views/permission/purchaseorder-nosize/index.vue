<template>
  <div :class="{ clock: DisabledLoading }" v-loading="load"></div>
  <div :class="{ 'pointer-events': DisabledLoading }">
    <div class="purchaseorder-container">
      <el-space :fill="fill" wrap>
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>Query</span>
              <div class="button_right">
                <div class="card-hd">
                  <div class="btn-group">
                    <el-button>
                      <input
                        type="file"
                        @change="importExcel"
                        accept=".xls,.xlsx"
                        ref="fileInput"
                      />
                      <p v-if="fileName">Selected file: {{ fileName }}</p>
                      <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
                    </el-button>
                    <el-button @click="DownloadExcel">
                      <el-icon style="vertical-align: middle; color: red">
                        <Download />
                      </el-icon>
                      <label for="" class="import-button">Excel</label>
                    </el-button>
                    <el-button type="button_right" @click="getPurList(1)">
                      <el-icon style="vertical-align: middle">
                        <Search />
                      </el-icon>
                      <span style="vertical-align: middle"> {{ t('btn.query') }} </span>
                    </el-button>
                  </div>
                </div>
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
            <div class="purno">
              <p class="lbl">PurNo</p>
              <el-input class="input" v-model="state.cgno"></el-input>
            </div>
            <div class="material">
              <p class="lbl">Material</p>
              <el-input style="width: 40%" class="input" v-model="state.clbh"></el-input>
              <el-input style="width: 70%" class="input" v-model="state.ywpm"></el-input>
            </div>
            <div class="supp">
              <p class="lbl">Supplier</p>
              <el-input
                style="width: 30%"
                class="input_supp"
                v-model="userName"
                readonly
              ></el-input>
              <el-input
                style="width: 80%"
                class="input_supp"
                v-model="realName"
                readonly
              ></el-input>
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
              max-height="45vh"
              border
              selection
              stripe
              highlight-current-row
              style="width: 99%"
              @sort-change="handleSortChange"
              @row-click="handleRowClick"
            >
              <el-table-column :prop="state.purlist[0].prop" :label="state.purlist[0].label" />
              <el-table-column :prop="state.purlist[1].prop" :label="state.purlist[1].label" />
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
                    @click="handleSetPackQty(scope.row.CGNO, scope.row.CLBH, scope.row.PackQty)"
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
              :prop="stateDetail.detaillist[6].prop"
              :label="`${stateDetail.detaillist[6].label} (không bắt buộc)`"
            >
              <template #default="scope">
                <el-input
                  :disabled="stateDetail.list[0].CFMDel == '' && stateDetail.list[0].CFMID != ''"
                  type="text"
                  v-model="scope.row.Box"
                  style="width: fit-content"
                />
              </template>
            </el-table-column>
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
                    :disabled="stateDetail.list[0].CFMDel == '' && stateDetail.list[0].CFMID != ''"
                    size="small"
                    type="primary"
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
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue';
  import { Search, Download } from '@element-plus/icons';
  import {
    getPurListAPI,
    getDetailListAPI,
    setPackQtyAPI,
    addPackAPI,
    delPackAPI,
    loadingQtyAPI,
    CFMAPI,
    uploadFileAPI,
    ImportPackQty,
  } from '@/api/purOrder';
  import { useLoading } from '@/hooks';
  import { useStore } from 'vuex';
  import dayjs from 'dayjs';
  import { ElMessageBox, ElMessage } from 'element-plus';
  import { useI18n } from 'vue-i18n';
  import * as XLSX from 'xlsx';
  const { t } = useI18n();
  const DisabledLoading = ref(false);
  const load = ref(false);
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
    cgno: '',
    clbh: '',
    ywpm: '',
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
    ],
  });

  const getPurList = (i) => {
    showLoading();
    if (i === 1) {
      stateDetail.list = [];
      stateDetail.total = 0;
    }
    getPurListAPI({
      ZSDH: userName.value,
      YQDate1: value_time.value[0],
      YQDate2: value_time.value[1],
      CGNO: state.cgno,
      CLBH: state.clbh,
      YWPM: state.ywpm,
    })
      .then((res) => {
        state.list = res.data;
        hideLoading();
      })
      .catch(() => {
        hideLoading();
      });
  };
  //
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
        prop: 'Box',
        label: 'Box',
      },
    ],
  });

  // dowload excel
  const DownloadExcel = (event) => {
    const downloadUrl = 'Template_Excel.xlsx'; // điều chỉnh đường dẫn theo yêu cầu
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = 'Template_Excel.xlsx';
    document.body.appendChild(anchor); // thêm anchor vào body của tài liệu
    anchor.click();
    document.body.removeChild(anchor); // loại bỏ anchor sau khi click
  };

  // import excel
  const convertExcelDateToJSDate = (serial) => {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);

    const fractional_day = serial - Math.floor(serial) + 0.0000001;
    let total_seconds = Math.floor(86400 * fractional_day);

    const seconds = total_seconds % 60;
    total_seconds -= seconds;

    const hours = Math.floor(total_seconds / (60 * 60));
    const minutes = Math.floor(total_seconds / 60) % 60;

    const result_date = new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate(),
      hours,
      minutes,
      seconds
    );

    // Format thành chuỗi YYYY-MM-DD
    const year = result_date.getFullYear();
    const month = String(result_date.getMonth() + 1).padStart(2, '0');
    const day = String(result_date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };
  //
  const fileInput = ref(null);
  const importExcel = (event) => {
    ElMessageBox.confirm('Are you sure confirm?\nEnter OK or Cancel.', 'Warning', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    })
      .then(() => {
        const file = event.target.files[0];
        if (file) {
          const fileName = file.name;
          const expectedFileName = 'Template_Excel.xlsx';

          if (fileName !== expectedFileName) {
            ElMessageBox.alert(`Thông báo: Tên tệp phải là ${expectedFileName}.`, 'Lỗi', {
              confirmButtonText: 'OK',
              type: 'error',
            });
            return;
          }
          const reader = new FileReader();
          reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (jsonData.length <= 1) {
              ElMessageBox.alert('Thông báo: Tệp Excel không có dữ liệu.', 'Lỗi', {
                confirmButtonText: 'OK',
                type: 'error',
              });
              return;
            }

            var DataList = [];
            for (let i = 1; i < jsonData.length; i++) {
              DataList.push({
                CGNO: String(jsonData[i][0]),
                CLBH: String(jsonData[i][1]),
                Qty: String(jsonData[i][2]),
                MEMO: convertExcelDateToJSDate(jsonData[i][3]),
                DOCNO: String(jsonData[i][4]),
                LotNO: String(jsonData[i][5]),
                BoxNO: String(jsonData[i][6]),
              });
            }
            load.value = true;
            DisabledLoading.value = true;
            ImportPackQty({
              Data: DataList,
              USERID: userName.value,
            })
              .then((res) => {
                alert(res.data.Mes);
                DisabledLoading.value = false;
                location.reload();
                //fileInput.value = null;
                load.value = false;
              })
              .catch((error) => {
                alert(error);
                DisabledLoading.value = false;
                location.reload();
                //fileInput.value = null;
                load.value = false;
              });
          };
          reader.readAsArrayBuffer(file);
        } else {
          ElMessageBox.alert('Thông báo: Không có tệp Excel được chọn.', 'Lỗi', {
            confirmButtonText: 'OK',
            type: 'error',
          });
          hideLoading();
        }
      })
      .catch(() => {
        hideLoading();
      });
  };
  const getDetailList = (pNo, mNo) => {
    showLoading();
    stateDetail.list = [];
    qtyad.value = 1;
    stateDetail.total = 0;
    getDetailListAPI({
      CGNO: pNo,
      CLBH: mNo,
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
          // Nếu stateDetail.list[0].MEMO rỗng, trả về ngày hiện tại
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
    getDetailList(row.CGNO, row.CLBH);
  };

  const handleUpload = (file, lotNo) => {
    if (lotNo == '') {
      ElMessage.error('Please enter LotNO !!!');
    } else {
      uploadFileAPI({
        ZSDH: userName.value,
        LotNO: lotNo,
        LotFile: file.file,
      });
    }
  };

  const handleSetPackQty = (CGNO, CLBH, PackQty) => {
    isLoading.value = true;
    showLoading();
    setPackQtyAPI({
      CGNO: CGNO,
      CLBH: CLBH,
      PackQty: PackQty,
      USERID: userName.value,
    })
      .then(() => {
        getPurList();
        getDetailList(CGNO, CLBH);
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
    addPackAPI({
      SCNO: stateDetail.list[0].SCNO,
      CLBH: stateDetail.list[0].CLBH,
      USERID: userName.value,
      QTYAD: qtyad.value,
    })
      .then(() => {
        getPurList();
        getDetailList(stateDetail.list[0].CGNO, stateDetail.list[0].CLBH);
        hideLoading();
      })
      .catch(() => {
        hideLoading();
      });
  };

  const handleDelPack = () => {
    showLoading();
    delPackAPI({
      SCNO: stateDetail.list[0].SCNO,
      CLBH: stateDetail.list[0].CLBH,
      USERID: userName.value,
      QTYAD: qtyad.value,
    })
      .then(() => {
        getPurList();
        getDetailList(stateDetail.list[0].CGNO, stateDetail.list[0].CLBH);
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
        Box: stateDetail.list[i].Box,
      });
    }
    loadingQtyAPI({
      CGNO: stateDetail.list[0].CGNO,
      DOCNO: stateDetail.list[0].DOCNO,
      MEMO: dayjs(stateDetail.list[0].MEMO).format('YYYY-MM-DD'),
      DelQty: stateDetail.total,
      Data: DataList,
    })
      .then(() => {
        getPurList();
        getDetailList(stateDetail.list[0].CGNO, stateDetail.list[0].CLBH);
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
        isLoading.value = true;
        showLoading();
        CFMAPI({
          SCNO: stateDetail.list[0].SCNO,
          CLBH: stateDetail.list[0].CLBH,
          USERID: userName.value,
        })
          .then(() => {
            getPurList();
            getDetailList(stateDetail.list[0].CGNO, stateDetail.list[0].CLBH);
            hideLoading();
          })
          .catch(() => {
            hideLoading();
          })
          .finally(() => {
            hideLoading();
            isLoading.value = false; // Hoàn tất tải dữ liệu
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
    .supp {
      margin-left: 1.5vw;
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
    margin-right: 2vh;
  }

  .el-input {
    margin-left: 2vh;
  }

  .card-header {
    display: flex;
    align-items: center;
  }

  .button_right {
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
  .import-button {
    cursor: pointer;
    /* Style as needed */
  }
  .pointer-events {
    pointer-events: none;
  }
  .clock {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background-color: rgba(209, 207, 207, 0.5);
    pointer-events: all;
  }
</style>
