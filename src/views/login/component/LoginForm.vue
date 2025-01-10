<template>
  <el-form :model="state.ruleForm" :rules="state.rules" ref="validateForm" class="login-ruleForm">
    <el-form-item prop="username">
      <el-input :placeholder="t('login.username')" v-model="state.ruleForm.username">
        <template #prefix>
          <icon-user theme="outline" size="16" fill="#999" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        @keyup.enter="handleLogin"
        :placeholder="t('login.password')"
        type="password"
        v-model="state.ruleForm.password"
      >
        <template #prefix>
          <icon-lock theme="outline" size="16" fill="#999" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <div class="login-check">
        <el-checkbox v-model="state.checkedPwd">{{ t('login.rememberPwd') }}</el-checkbox>
        <el-button text type="primary">{{ t('login.forgotPwd') }}</el-button>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        :loading="state.loading"
        class="login-btn"
        round
        @click="handleLogin"
      >
        {{ t('login.loginBtn') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'LoginForm',
  };
</script>

<script setup>
  import { reactive, ref, unref, watch } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const store = useStore();
  const router = useRouter();
  const validateForm = ref(null);
  const state = reactive({
    ruleForm: {
      username: '',
      password: '',
    },
    loading: false,
    checkedPwd: false,
    redirect: undefined,
    rules: {
      username: [{ required: true, message: t('login.rules.username'), trigger: 'blur' }],
      password: [{ required: true, message: t('login.rules.password'), trigger: 'blur' }],
    },
  });

  watch(
    () => router.currentRoute,
    ({ _value }) => {
      const route = _value;
      state.redirect = (route.query && route.query.redirect) || '/';
    },
    {
      immediate: true,
    }
  );

  const handleLogin = async () => {
    const form = unref(validateForm);
    if (!form) return;
    await form.validate((valid) => {
      if (valid) {
        state.valid = true;
        state.loading = true;
        store
          .dispatch('user/login', state.ruleForm)
          .then(() => {
            const routerPath =
              state.redirect === '/404' || state.redirect === '/401' ? '/' : state.redirect;
            router.push(routerPath).catch(() => {});
            state.loading = false;
          })
          .catch(() => {
            state.loading = false;
          });
      }
    });
  };
</script>

<style lang="scss" scoped>
  .login-ruleForm {
    margin-top: 1rem;
    :deep(.el-input__prefix) {
      top: 2px;
      padding: 0 4px;
    }
    .login-btn {
      width: 100%;
    }
    .login-check {
      width: 100%;
      display: flex;
      align-content: center;
      justify-content: space-between;
    }
  }
</style>
