<template>
  <div class="roles-container">
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

    <RoleDialog
      v-if="state.roleDialogShow"
      v-model:dialog-visible="state.roleDialogShow"
      :action="state.action"
      @change="getRoleList"
    />
  </div>
</template>

<script>
  export default {
    name: 'Roles',
  };
</script>

<script setup>
  import { onBeforeMount, reactive } from 'vue';
  import { getRoleListAPI, deleteRoleAPI } from '@/api/role';
  import { ElMessageBox } from 'element-plus';
  import { useI18n } from 'vue-i18n';
  import { useLoading, usePagination } from '@/hooks';
  import RoleDialog from './components/RoleDialog.vue';

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
        prop: 'roleName',
        label: 'RoleName',
      },
      {
        prop: 'description',
        label: 'Description',
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
    roleDialogShow: false,
    action: {
      type: null,
      data: {},
    },
  });

  const getRoleList = () => {
    showLoading();
    getRoleListAPI({ pageNumber: currentPage.value, pageSize: pageSize.value })
      .then((res) => {
        state.list = res.data.list;
        setPagination(res.data.totalRow, getRoleList);
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
    state.action.id = null;
    state.action.data = {};
    state.roleDialogShow = true;
  };

  const handleEdit = (row) => {
    state.action.type = 'update';
    state.action.id = row.id;
    state.action.data = row;
    state.roleDialogShow = true;
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
        deleteRoleAPI({ id: state.multipleSelection.map((item) => item.id) }).then(() => {
          getRoleList();
        });
      })
      .catch(() => {});
  };

  onBeforeMount(() => {
    getRoleList();
  });
</script>

<style lang="scss" scoped>
  .roles-container {
    padding: $base-main-padding;
    background-color: $base-color-white;
  }
</style>
