<template>
  <div class="index-conntainer">
    <div class="head-card">
      <div class="avatar">
        <el-avatar :size="50" :src="avatar"></el-avatar>
      </div>
      <div class="head-card-content">
        <h2 class="title">{{ sayHi }}! {{ realName }}, {{ t('indexPage.descTitle') }}</h2>
      </div>
    </div>
    <div class="content"></div>
  </div>
</template>

<script>
  export default {
    name: 'Index',
  };
</script>

<script setup>
  import { ref, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useStore } from 'vuex';

  const store = useStore();

  const { t } = useI18n();

  const hour = new Date().getHours();
  const thisTime =
    hour < 8
      ? t('sayHi.early')
      : hour <= 11
      ? t('sayHi.morning')
      : hour <= 13
      ? t('sayHi.noon')
      : hour < 18
      ? t('sayHi.afternoon')
      : t('sayHi.evening');
  const sayHi = ref(thisTime);
  const avatar = computed(() => {
    return store.getters['user/avatar'];
  });
  const realName = computed(() => {
    return store.getters['user/realname'];
  });

  const isMobile = computed(() => {
    return store.getters['setting/isMobile'];
  });
</script>

<style lang="scss" scoped>
  .index-conntainer {
    width: $base-width;
    .head-card {
      display: flex;
      align-items: center;
      padding: $base-main-padding;
      background-color: $base-color-white;
      &-content {
        padding-left: 15px;
      }
    }
    .content {
      margin: 15px 0;
    }
  }
</style>
