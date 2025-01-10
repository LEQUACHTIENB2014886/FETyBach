import { defineConfig } from 'vite';
const path = require('path');
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import { setting } from './src/config/setting';
import { svgBuilder } from './src/plugin/svgBuilder';

import vueI18n from '@intlify/unplugin-vue-i18n/vite';

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import ElementPlus from 'unplugin-element-plus/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';

const {
  base,
  publicDir,
  outDir,
  assetsDir,
  sourcemap,
  cssCodeSplit,
  host,
  port,
  strictPort,
  open,
  cors,
  brotliSize,
  logLevel,
  clearScreen,
  chunkSizeWarningLimit,
} = setting;

const isDev = process.env.NODE_ENV === 'development';

// https://vitejs.dev/config/
export default defineConfig({
  root: process.cwd(),
  base,
  publicDir,
  logLevel,
  clearScreen,
  plugins: [
    vue(),
    vueI18n({ include: path.resolve(__dirname, './src/locales/**') }),
    ElementPlus({
      importStyle: 'sass',
    }),
    legacy({
      polyfills: ['es.promise.finally', 'es/map', 'es/set'],
      modernPolyfills: ['es.promise.finally'],
    }),
    AutoImport({
      imports: ['vue'],
      resolvers: [
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          enabledCollections: ['ep'],
        }),
      ],
    }),
    Icons({
      autoInstall: true,
    }),
    svgBuilder('./src/icons/svg/'),
  ],

  server: {
    host,
    port,
    cors,
    strictPort,
    open,
    fs: {
      strict: false,
    },
  },

  resolve: {
    alias: {
      views: path.resolve(__dirname, 'src/views'),
      styles: path.resolve(__dirname, 'src/styles'),
      '@': path.resolve(__dirname, 'src'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/index.scss" as *; @use "@/styles/element/index.scss" as *;`,
        charset: false,
      },
    },
  },

  corePlugins: {
    preflight: false,
  },

  build: {
    outDir,
    assetsDir,
    sourcemap,
    cssCodeSplit,
    brotliSize,
    chunkSizeWarningLimit,
  },

  optimizeDeps: {
    include: [],
  },
});
