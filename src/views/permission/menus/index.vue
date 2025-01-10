<template>
  <div class="menus-container">
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
      <el-table-column type="selection" width="100" />
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

    <MenuDialog
      v-if="state.menuDialogShow"
      v-model:dialog-visible="state.menuDialogShow"
      :action="state.action"
      @change="getMenuList"
    />
  </div>
</template>

<script>
  export default {
    name: 'Menus',
  };
</script>

<script setup>
  import { onBeforeMount, reactive } from 'vue';
  import { getMenuListAPI, deleteMenuAPI } from '@/api/menu';
  import { ElMessageBox } from 'element-plus';
  import { useI18n } from 'vue-i18n';
  import { useLoading, usePagination } from '@/hooks';
  import MenuDialog from './components/MenuDialog.vue';

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
        prop: 'menuName',
        label: 'MenuName',
      },
      {
        prop: 'menuPid',
        label: 'MenuPid',
      },
      {
        prop: 'url',
        label: 'Url',
      },
      {
        prop: 'sort',
        label: 'Sort',
      },
    ],
    multipleSelection: [],
    menuDialogShow: false,
    action: {
      type: null,
      data: {},
    },
  });

  const getMenuList = () => {
    showLoading();
    getMenuListAPI({ pageNumber: currentPage.value, pageSize: pageSize.value })
      .then((res) => {
        state.list = res.data.list;
        setPagination(res.data.totalRow, getMenuList);
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
    state.menuDialogShow = true;
  };

  const handleEdit = (row) => {
    state.action.type = 'update';
    state.action.data = row;
    state.menuDialogShow = true;
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
        deleteMenuAPI({ id: state.multipleSelection.map((item) => item.id) }).then(() => {
          getMenuList();
        });
      })
      .catch(() => {});
  };

  onBeforeMount(() => {
    getMenuList();
  });
</script>

<style lang="scss" scoped>
  .menus-container {
    padding: $base-main-padding;
    background-color: $base-color-white;
  }
</style>
