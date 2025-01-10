<template>
  <el-dropdown @command="handleCommand">
    <span class="avatar-dropdown" :style="{ color }">
      <img class="user-avatar" :src="avatar" alt="" />
      <div class="user-name">
        {{ realName }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="changepassword" divided>{{ t('navbar.chagePassword') }}</el-dropdown-item>
        <el-dropdown-item command="logout" divided>{{ t('navbar.logOut') }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <changepassDialog v-if="state.changepassDialogShow" v-model:dialog-visible="state.changepassDialogShow"
    :action="state.action" />
</template>

<script>
  export default {
    name: 'Avatar',
  };
</script>

<script setup>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  import { ElMessageBox } from 'element-plus';
  import { setting } from '@/config/setting';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import changepassDialog from './component/changepassDialog.vue';

  const { title, recordRoute } = setting;
  const { t } = useI18n();
  const store = useStore();
  const router = useRouter();

  const state = reactive({
    multipleSelection: [],
    changepassDialogShow: false,
    action: {
      type: null,
      data: {},
    },
  });

  const avatar = computed(() => {
    return store.getters['user/avatar'];
  });
  const userName = computed(() => {
    return store.getters['user/username'];
  });

  const realName = computed(() => {
    return store.getters['user/realname'];
  });

  const email = computed(() => {
    return store.getters['user/email'];
  });

  const Token = computed(() => {
    return store.getters['user/accessToken'];
  });
  const [header, payload, signature] = Token.value.split('.');

  // Giải mã chuỗi payload từ base64
  const decodedPayload = atob(payload);

  // Chuyển đổi chuỗi payload thành đối tượng JSON
  const payloadObject = JSON.parse(decodedPayload);

  const row = reactive({
    id: payloadObject.userId,
    userName: userName.value,
    realName: realName.value,
    password: '',
    confirmPassword: '',
    email: email.value,
    state: 1,
  });

  defineProps({
    color: {
      type: String,
      default: '#666',
    },
  });

  const handleCommand = (command) => {
    switch (command) {
      case 'logout':
        handleLogout();
        break;
      case 'changepassword':
        changepassdialog();
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    ElMessageBox.confirm(`${t('confirm.exitMessage')} ${title}？`, t('confirm.title'), {
      confirmButtonText: t('btn.confirm'),
      cancelButtonText: t('btn.cancel'),
      dangerouslyUseHTMLString: true,
      type: 'warning',
    })
      .then(async () => {
        await store.dispatch('user/logout');
        console.log(recordRoute)
        if (recordRoute) {
          const { fullPath } = router.currentRoute._value;
          location.replace('/login');
        } else {
          router.push('/login');
        }
      })
      .catch(() => { });
  };

  const changepassdialog = () => {
    state.action.type = 'update';
    state.action.data = row;
    state.changepassDialogShow = true;
  }
</script>

<style lang="scss" scoped>
  .avatar-dropdown {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    justify-items: center;
    height: $base-avatar-dropdown-height;
    padding: $base-padding-10;

    .user-avatar {
      width: $base-avatar-width;
      height: $base-avatar-height;
      cursor: pointer;
      border-radius: $base-border-radius-circle;
    }

    .user-name {
      position: relative;
      margin-left: $base-margin-5;
      margin-left: $base-margin-5;
      cursor: pointer;
    }
  }
</style>
