<template>
  <div class="right-panel">
    <FullScreen :color="color" v-if="settings.fullScreen" @refresh="onRefresh" />
    <LangChange :color="color" />
    <icon-refresh
      v-if="settings.refresh"
      :title="t('navbar.refresh')"
      @click="handleRefresh"
      class="icon-hover refresh"
      theme="filled"
      size="16"
      :fill="color"
      :strokeWidth="4"
    />
    <Avatar :color="color" />
  </div>
</template>

<script>
  export default {
    name: 'RightPanel',
  };
</script>

<script setup>
  import FullScreen from '@/components/FullScreen/index.vue';
  import LangChange from '@/components/LangChange/index.vue';

  import { useI18n } from 'vue-i18n';
  import { useStore } from 'vuex';

  import { computed, nextTick } from 'vue';
  import _ from 'lodash';

  defineProps({
    color: {
      type: String,
      default: '#666',
    },
  });

  const { t } = useI18n();
  const store = useStore();

  const settings = computed(() => {
    return store.getters['setting/settings'];
  });

  const onRefresh = () => {};

  const handleRefresh = _.debounce(() => {
    store.dispatch('setting/setRouterView', false);
    nextTick(() => {
      store.dispatch('setting/setRouterView', true);
    });
  }, 300);
</script>

<style lang="scss" scoped>
  .right-panel {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: flex-end;
    height: $base-nav-bar-height;
    .refresh {
      padding: $base-padding-20-10;
    }
  }
</style>
