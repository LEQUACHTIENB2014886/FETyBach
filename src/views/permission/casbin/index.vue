<template>
  <div class="casbin-container">
    <div class="action-container">
      <el-button type="primary" @click="handleCreate">
        {{ t('btn.create') }}
      </el-button>
      <el-button
        type="danger"
        :disabled="state.multipleSelection.length === 0"
        @click="handleDelete"
      >
        {{ t('btn.delete') }}
      </el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="state.list"
      border
      selection
      stripe
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column
        v-for="(item, index) in state.fieldList"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width || null"
        :formatter="item.formatter || null"
        show-overflow-tooltip
      />
      <el-table-column label="Action" fixed="right">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">{{ t('btn.edit') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        :total="total"
        :pager-count="5"
        background
        layout="prev, pager, next, sizes, total, jumper"
      />
    </div>

    <CasbinDialog
      v-if="state.casbinDialogShow"
      v-model:dialog-visible="state.casbinDialogShow"
      :action="state.action"
      @change="getCasbinList"
    />
  </div>
</template>

<script>
  export default {
    name: 'Casbin',
  };
</script>

<script setup>
  import { onBeforeMount, reactive } from 'vue';
  import { useLoading, usePagination } from '@/hooks';
  import { getCasbinListAPI, deleteCasbinAPI } from '@/api/casbin';
  import { ElMessageBox } from 'element-plus';
  import { useI18n } from 'vue-i18n';
  import CasbinDialog from './components/CasbinDialog.vue';

  const { t } = useI18n();
  const { loading, showLoading, hideLoading } = useLoading();
  const { currentPage, pageSize, pageSizes, total, setPagination } = usePagination();

  const state = reactive({
    list: [],
    fieldList: [
      {
        prop: 'id',
        label: 'ID',
      },
      {
        prop: 'ptype',
        label: 'PType',
      },
      {
        prop: 'v0',
        label: 'V0(RoleID)',
      },
      {
        prop: 'v1',
        label: 'V1(Url)',
      },
      {
        prop: 'v2',
        label: 'V2(Method)',
      },
      {
        prop: 'v3',
        label: 'V3',
      },
      {
        prop: 'v4',
        label: 'V4',
      },
      {
        prop: 'v5',
        label: 'V5',
      },
      {
        prop: 'v6',
        label: 'V6',
      },
      {
        prop: 'v7',
        label: 'V7',
      },
      {
        prop: 'createdAt',
        label: 'Create Time',
      },
      {
        prop: 'updatedAt',
        label: 'Update Time',
      },
    ],
    multipleSelection: [],
    casbinDialogShow: false,
    action: {
      type: null,
      data: {},
    },
  });

  const getCasbinList = () => {
    showLoading();
    getCasbinListAPI({ pageNumber: currentPage.value, pageSize: pageSize.value })
      .then((res) => {
        state.list = res.data.list;
        setPagination(res.data.totalRow, getCasbinList);
        hideLoading();
      })
      .catch(() => {
        hideLoading();
      });
  };

  const handleSelectionChange = (val) => {
    state.multipleSelection = val;
  };

  const handleCreate = () => {
    state.action.type = 'create';
    state.action.data = {};
    state.casbinDialogShow = true;
  };

  const handleEdit = (row) => {
    state.action.type = 'update';
    state.action.data = row;
    state.casbinDialogShow = true;
  };

  const handleDelete = (row) => {
    if (state.multipleSelection.length === 0) return;
    ElMessageBox.confirm(`${t('confirm.deleteMessage')}？`, t('confirm.title'), {
      confirmButtonText: t('btn.confirm'),
      cancelButtonText: t('btn.cancel'),
      dangerouslyUseHTMLString: true,
      type: 'warning',
    })
      .then(() => {
        deleteCasbinAPI({ id: state.multipleSelection.map((item) => item.id) }).then(() => {
          getCasbinList();
        });
      })
      .catch(() => {});
  };

  onBeforeMount(() => {
    getCasbinList();
  });
</script>

<style lang="scss" scoped>
  .casbin-container {
    padding: $base-main-padding;
    background-color: $base-color-white;
  }
</style>
