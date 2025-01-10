<template>
  <el-dialog v-model="dialogShow" :title="title" :close-on-click-modal="false">
    <el-form
      v-loading="loading"
      ref="formRef"
      :model="casbinForm"
      :rules="rules"
      label-width="150px"
    >
      <el-form-item label="PType" prop="ptype">
        <el-input v-model="casbinForm.ptype" disabled placeholder="PType" />
      </el-form-item>
      <el-form-item label="V0(RoleID)" prop="v0">
        <el-select v-model="casbinForm.v0" style="width: 100%">
          <el-option
            v-for="item in roleOptions"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="V1(Url)" prop="v1">
        <el-input v-model="casbinForm.v1" placeholder="V1" />
      </el-form-item>
      <el-form-item label="V2(Method)" prop="v2">
        <el-select v-model="casbinForm.v2" multiple style="width: 100%">
          <el-option
            v-for="item in methodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="V3" prop="v3">
        <el-input v-model="casbinForm.v3" disabled placeholder="V3" />
      </el-form-item>
      <el-form-item label="V4" prop="v4">
        <el-input v-model="casbinForm.v4" disabled placeholder="V4" />
      </el-form-item>
      <el-form-item label="V5" prop="v5">
        <el-input v-model="casbinForm.v5" disabled placeholder="V5" />
      </el-form-item>
      <el-form-item label="V6" prop="v6">
        <el-input v-model="casbinForm.v6" disabled placeholder="V6" />
      </el-form-item>
      <el-form-item label="V7" prop="v7">
        <el-input v-model="casbinForm.v7" disabled placeholder="V7" />
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
    name: 'CasbinDialog',
  };
</script>

<script setup>
  import { ref, reactive, computed } from 'vue';
  import { createCasbinAPI, updateCasbinAPI } from '@/api/casbin';
  import { getRoleListAPI } from '@/api/role';
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
      return 'Create Casbin API';
    }
    return 'Update Casbin API';
  });
  const isEdit = computed(() => {
    return props.action && props.action.type === 'update';
  });

  const formRef = ref();
  const casbinForm = reactive({
    id: null,
    ptype: 'p',
    v0: '',
    v1: '',
    v2: '',
    v3: '',
    v4: '',
    v5: '',
    v6: '',
    v7: '',
  });

  const rules = reactive({
    v0: [{ required: true, message: 'Please input V0(RoleID)', trigger: 'blur' }],
    v1: [{ required: true, message: 'Please input V1(Url)', trigger: 'blur' }],
    v2: [{ required: true, message: 'Please input V2(Method)', trigger: 'blur' }],
  });

  const roleOptions = reactive([]);

  const methodOptions = [
    {
      value: 'GET',
      label: 'GET',
    },
    {
      value: 'POST',
      label: 'POST',
    },
    {
      value: 'PUT',
      label: 'PUT',
    },
    {
      value: 'DELETE',
      label: 'DELETE',
    },
    {
      value: 'PATCH',
      label: 'PATCH',
    },
  ];

  const getRoleList = () => {
    showLoading();
    getRoleListAPI({ pageNumber: 1, pageSize: 9999 })
      .then((res) => {
        Object.assign(roleOptions, { ...res.data.list });
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
        const request = isEdit.value ? updateCasbinAPI : createCasbinAPI;
        const formData = {
          id: casbinForm.id,
          roleId: casbinForm.v0,
          url: casbinForm.v1,
          method: casbinForm.v2.join(','),
        };
        request(formData).then(() => {
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
      Object.assign(casbinForm, {
        ...props.action.data,
        v0: parseInt(props.action.data.v0),
        v2: props.action.data.v2.split(','),
      });
    }
    getRoleList();
  });
</script>

<style lang="scss" scoped></style>
