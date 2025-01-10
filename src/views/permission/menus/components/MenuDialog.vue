<template>
  <el-dialog v-model="dialogShow" :title="title" :close-on-click-modal="false">
    <el-form v-loading="loading" ref="formRef" :model="menuForm" :rules="rules" label-width="150px">
      <el-form-item label="MenuName" prop="menuName">
        <el-input v-model="menuForm.menuName" placeholder="menuName" />
      </el-form-item>
      <el-form-item label="MenuPid" prop="menuPid">
        <el-select v-model="menuForm.menuPid" style="width: 100%">
          <el-option
            v-for="item in menuOptions"
            :key="item.id"
            :label="`${item.id}-${item.menuName}`"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Url" prop="url">
        <el-input v-model="menuForm.url" />
      </el-form-item>
      <el-form-item label="Sort" prop="sort">
        <el-input v-model="menuForm.sort" />
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input v-model="menuForm.description" />
      </el-form-item>
      <el-form-item label="State" prop="state">
        <el-radio-group v-model="menuForm.state">
          <el-radio :label="1">Enable</el-radio>
          <el-radio :label="2">Disable</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">{{ t('btn.cancel') }}</el-button>
        <el-button type="primary" v-button-anti-shake @click="handleSubmit(formRef)">
          {{ t('btn.submit') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
  export default {
    name: 'MenuDialog',
  };
</script>

<script setup>
  import { ref, reactive, computed } from 'vue';
  import { getMenuListAPI, createMenuAPI, updateMenuAPI } from '@/api/menu';
  import { useI18n } from 'vue-i18n';
  import { useLoading } from '@/hooks';

  const { t } = useI18n();
  const { loading, showLoading, hideLoading } = useLoading();

  const props = defineProps({
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    action: {
      type: Object,
      default: () => {
        return {
          type: 'create',
          data: {},
        };
      },
    },
  });
  const emit = defineEmits(['update:dialogVisible', 'change']);

  const dialogShow = computed({
    get: () => props.dialogVisible,
    set: (val) => emit('update:dialogVisible', val),
  });
  const title = computed(() => {
    if (props.action.type === 'create') {
      return 'Create Menu';
    }
    return 'Update Menu';
  });
  const isEdit = computed(() => {
    return props.action && props.action.type === 'update';
  });

  const formRef = ref();
  const menuForm = reactive({
    id: null,
    menuName: '',
    menuPid: '',
    url: '',
    sort: '',
    description: '',
    state: null,
  });

  const rules = reactive({
    menuName: [{ required: true, message: 'Please input MenuName', trigger: 'blur' }],
    menuPid: [{ required: true, message: 'Please input MenuPid', trigger: 'blur' }],
    state: [{ required: true, message: 'Please select State', trigger: 'blur' }],
  });

  const menuOptions = reactive([]);

  const getMenuList = () => {
    showLoading();
    getMenuListAPI({ pageNumber: 1, pageSize: 9999 })
      .then((res) => {
        Object.assign(menuOptions, { ...res.data.list, ...[{ id: 0, menuName: 'Root' }] });
        setPagination(res.data.totalRow, getMenuList);
        hideLoading();
      })
      .catch(() => {
        hideLoading();
      });
  };

  const handleSubmit = async (formInstance) => {
    if (!formInstance) return;

    await formInstance.validate((valid, fields) => {
      if (valid) {
        const request = isEdit.value ? updateMenuAPI : createMenuAPI;
        menuForm.menuPid = menuForm.menuPid.toString();
        request(menuForm).then(() => {
          emit('change');
          handleCancel();
        });
      } else {
        console.log('error submit!', fields);
      }
    });
  };

  const handleCancel = () => {
    emit('update:dialogVisible', false);
  };

  onBeforeMount(() => {
    if (isEdit.value) {
      Object.assign(menuForm, {
        ...props.action.data,
        menuPid: parseInt(props.action.data.menuPid),
      });
    }
    getMenuList();
  });
</script>

<style lang="scss" scoped></style>
