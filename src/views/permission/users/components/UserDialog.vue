<template>
  <el-dialog v-model="dialogShow" :title="title" :close-on-click-modal="false">
    <el-form ref="formRef" :model="userForm" :rules="rules" label-width="150px">
      <el-form-item label="UserName" prop="userName">
        <el-input v-model="userForm.userName" :disabled="isEdit" placeholder="UserName" />
      </el-form-item>
      <el-form-item label="RealName" prop="realName">
        <el-input v-model="userForm.realName" placeholder="RealName" />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input
          v-model="userForm.password"
          type="password"
          show-password
          placeholder="Password"
        />
      </el-form-item>
      <el-form-item label="Confirm password" prop="confirmPassword">
        <el-input
          v-model="userForm.confirmPassword"
          type="password"
          show-password
          placeholder="Confirm password"
        />
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="userForm.email" />
      </el-form-item>
      <el-form-item label="State" prop="state">
        <el-radio-group v-model="userForm.state">
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
    name: 'UserDialog',
  };
</script>

<script setup>
  import { ref, reactive, computed } from 'vue';
  import { createUserAPI, updateUserAPI } from '@/api/user';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

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
      return 'Create User';
    }
    return 'Update User';
  });
  const isEdit = computed(() => {
    return props.action && props.action.type === 'update';
  });

  const formRef = ref();
  const userForm = reactive({
    id: null,
    userName: '',
    realName: '',
    password: '',
    confirmPassword: '',
    email: '',
    state: null,
  });

  const validatedConfirmPassword = (rule, value, callback) => {
    if (userForm.password !== '' && value === '') {
      callback(new Error('Please input the password again'));
    } else if (value !== userForm.password) {
      callback(new Error("Those passwords didn't match. Try again"));
    } else {
      callback();
    }
  };
  const rules = reactive({
    userName: [{ required: true, message: 'Please input UserName', trigger: 'blur' }],
    realName: [{ required: true, message: 'Please input RealName', trigger: 'blur' }],
    password: [
      isEdit.value ? {} : { required: true, message: 'Please input Password', trigger: 'blur' },
    ],
    email: [{ required: true, message: 'Please input Email', trigger: 'blur' }],
    state: [{ required: true, message: 'Please select State', trigger: 'blur' }],
    confirmPassword: [
      { validator: validatedConfirmPassword, trigger: 'blur' },
      isEdit.value
        ? {}
        : { required: true, message: 'Please input Confirm password', trigger: 'blur' },
    ],
  });

  const handleSubmit = async (formInstance) => {
    if (!formInstance) return;

    await formInstance.validate((valid, fields) => {
      if (valid) {
        const request = isEdit.value ? updateUserAPI : createUserAPI;
        request(userForm).then(() => {
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
      Object.assign(userForm, { ...props.action.data, password: '' });
    }
  });
</script>

<style lang="scss" scoped></style>
