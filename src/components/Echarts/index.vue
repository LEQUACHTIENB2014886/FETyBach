<template>
  <el-card class="echart-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <div class="card-header-title">
          <component
            class="icon"
            :is="headerIcon"
            theme="filled"
            size="16"
            :strokeWidth="3"
            fill="#333"
          />
          <span class="title">{{ title }}</span>
        </div>
        <div class="card-header-right">
          <slot name="header-right"></slot>
        </div>
      </div>
    </template>
    <div class="echarts" :id="`echarts${index}`" :style="style"> </div>
  </el-card>
</template>

<script>
  export default {
    name: 'Echarts',
  };
</script>

<script setup>
  import debounce from 'lodash/debounce';
  import { onMounted, ref, reactive, computed, watch, onBeforeUnmount } from 'vue';
  import { useStore } from 'vuex';
  import * as echarts from 'echarts/core';
  import theme from './theme.json';
  import {
    BarChart,
    CandlestickChart,
    FunnelChart,
    GaugeChart,
    LineChart,
    PieChart,
    RadarChart,
    ScatterChart,
  } from 'echarts/charts';
  import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    ToolboxComponent,
    MarkPointComponent,
    MarkLineComponent,
  } from 'echarts/components';
  import { CanvasRenderer } from 'echarts/renderers';

  echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    BarChart,
    LineChart,
    PieChart,
    RadarChart,
    GaugeChart,
    CandlestickChart,
    ScatterChart,
    CanvasRenderer,
    LegendComponent,
    ToolboxComponent,
    MarkPointComponent,
    MarkLineComponent,
    FunnelChart,
  ]);

  const props = defineProps({
    index: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: 'Title',
    },
    headerIcon: {
      type: String,
      default: 'icon-full-screen',
    },
    style: {
      type: Object,
      default: () => {
        return {
          width: '100%',
          height: '380px',
        };
      },
    },
    options: {
      type: Object,
      default: () => {
        return {};
      },
    },
    grid: {
      type: Object,
      default: () => {
        return {
          top: '10px',
          left: 0,
          right: '1px',
          bottom: 0,
          containLabel: true,
        };
      },
    },
  });
  const emit = defineEmits(['click']);

  const store = useStore();

  const isCollapse = computed(() => {
    return store.getters.collapse;
  });

  let chart = reactive({});
  let timer = ref(null);

  watch(
    () => props.options,
    () => {
      chart.setOption({
        ...props.options,
      });
    },
    {
      deep: true,
    }
  );

  watch(
    () => isCollapse,
    () => {
      timer = setTimeout(() => {
        chart.resize();
        clearTimeout(timer);
        timer = null;
      }, 300);
    },
    {
      deep: true,
    }
  );

  onMounted(() => {
    initChart();
    window.addEventListener(
      'resize',
      debounce(() => {
        chart.resize();
      }, 200)
    );
  });

  onBeforeUnmount(() => {
    clearTimeout(timer);
    timer = null;
  });

  const initChart = () => {
    echarts.registerTheme('wonderland', theme);
    chart = echarts.init(document.getElementById('echarts' + props.index), theme);
    chart.setOption({
      grid: props.grid,
      ...props.options,
    });

    chart.on('click', (params) => {
      emit('click', params);
    });
  };
</script>

<style lang="scss" scoped>
  .echart-card {
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      &-title {
        display: flex;
        align-content: center;
        align-items: center;
        color: $base-font-color;
        .icon {
          display: flex;
          padding-right: 5px;
        }
      }
    }
    .echarts {
      margin: 0 auto;
      background-color: $base-color-white;
    }
  }
</style>
