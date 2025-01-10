<template>
  <el-config-provider :locale="localLanguage">
    <el-scrollbar height="100vh" ref="scroll">
      <router-view></router-view>
    </el-scrollbar>
  </el-config-provider>
  <div class="time-login" v-if="minutes === 0 && seconds < 30"> Aout Logout Time : {{ formattedDate }} {{
    `${minutes || '0'}:${seconds < 10 ? '0' : ''}${seconds}` }} </div>
</template>

<script>
  export default {
    name: 'App',
  };
</script>

<script setup>
  import { onMounted, computed, ref, watch } from 'vue';
  import { useStore } from 'vuex';
  import i18n from '@/locales';
  import { useRouter } from 'vue-router';
  import { resetInactivityTimer, handleVisibilityChange, minutes, seconds } from '@/hooks/useLogout'

  const locale = i18n.global.locale;
  const store = useStore();

  const localLanguage = computed(() => {
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) return i18n.global.messages.value[locale.value];
    else return i18n.global.messages[locale];
  });

  const scroll = ref(null);
  const router = useRouter();

  const currentDate = ref(new Date());
  const formattedDate = ref(formatDate(currentDate.value));
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }
  onMounted(() => {
    changeBodyWidth();
    resetInactivityTimer(store)
    window.addEventListener('mousemove', () => resetInactivityTimer(store));
    window.addEventListener('keypress', () => resetInactivityTimer(store));
    window.addEventListener('scroll', () => resetInactivityTimer(store));
    window.addEventListener('click', () => resetInactivityTimer(store));
    document.addEventListener('visibilitychange', () => handleVisibilityChange(store));
    window.addEventListener('resize', changeResize);
  });

  watch(
    () => router.currentRoute.value,
    () => {
      scroll.value.setScrollTop(0);
    }
  );

  const changeBodyWidth = () => {
    const flag = document.body.getBoundingClientRect().width - 1 < 992;
    store.dispatch('setting/changeMobile', flag);
  };

  const changeResize = () => {
    changeBodyWidth();
  };
</script>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-size: $base-font-size-default;
    color: #2c3e50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .time-login {
    background-color: rgb(214, 214, 214);
    color: rgb(253, 107, 107);
    padding: 5px 20px;
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
</style>
