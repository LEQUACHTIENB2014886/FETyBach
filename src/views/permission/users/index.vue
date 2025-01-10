<template>
  <div class="users-container">
    <div class="action-container">
      <el-input
        v-model="state.searchInput"
        placeholder="Tìm kiếm theo RealName..."
        class="search-input"
        style="width: 20%; margin-right: 10px"
        @input="updateFilteredUsers"
      ></el-input>
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
      :data="state.filteredUsers"
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

    <UserDialog
      v-if="state.userDialogShow"
      v-model:dialog-visible="state.userDialogShow"
      :action="state.action"
      @change="getUserList"
    />
  </div>
</template>

<script>
  export default {
    name: 'Users',
  };
</script>

<script setup>
  import { onBeforeMount, reactive } from 'vue';
  import { getUserListAPI, deleteUserAPI } from '@/api/user';
  import { ElMessageBox } from 'element-plus';
  import { useI18n } from 'vue-i18n';
  import { useLoading, usePagination } from '@/hooks';
  import UserDialog from './components/UserDialog.vue';

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
        prop: 'userName',
        label: 'UserName',
      },
      {
        prop: 'realName',
        label: 'RealName',
      },
      {
        prop: 'email',
        label: 'Email',
      },
      {
        prop: 'state',
        label: 'State',
        formatter: (row) => (row.state === 1 ? 'Enable' : 'Disable'),
      },
      {
        prop: 'loginIp',
        label: 'Login IP',
      },
      {
        prop: 'loginTime',
        label: 'Login Time',
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
    userDialogShow: false,
    searchInput: '',
    action: {
      type: null,
      data: {},
    },
  });

  const getUserList = () => {
    showLoading();
    getUserListAPI({ pageNumber: currentPage.value, pageSize: pageSize.value })
      .then((res) => {
        state.list = res.data.list;
        state.filteredUsers = state.list.filter((user) =>
          user.realName.includes(state.searchInput)
        );
        setPagination(res.data.totalRow, getUserList);
        hideLoading();
      })
      .catch(() => {
        hideLoading();
      });
  };
  const updateFilteredUsers = () => {
    state.filteredUsers = state.list.filter((user) => user.realName.includes(state.searchInput));
  };
  const handleSelectionChange = (val) => {
    state.multipleSelection = val;
  };

  const handleCreate = () => {
    state.action.type = 'create';
    state.action.data = {};
    state.userDialogShow = true;
  };

  const handleEdit = (row) => {
    state.action.type = 'update';
    state.action.data = row;
    state.userDialogShow = true;
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
        deleteUserAPI({ id: state.multipleSelection.map((item) => item.id) }).then(() => {
          getUserList();
        });
      })
      .catch(() => {});
  };

  onBeforeMount(() => {
    getUserList();
  });
</script>

<style lang="scss" scoped>
  .users-container {
    padding: $base-main-padding;
    background-color: $base-color-white;
  }
</style>
