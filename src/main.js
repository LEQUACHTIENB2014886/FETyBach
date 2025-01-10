import { createApp } from 'vue';

import './config/permission';

import App from './App.vue';
const app = createApp(App);

import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/display.css';
app.use(ElementPlus);

import layoutComp from './layouts/components/export';
layoutComp(app);

import router from './router/index';
app.use(router);

import store from '@/store';
app.use(store);

import iconPark from './plugin/icon-park';
iconPark(app);

import loadI18n from './plugin/i18n';
loadI18n(app);

import buttonAntiShake from './directives/buttonAntiShake';
app.use(buttonAntiShake);

import Print  from "vue3-print-nb";
app.use(Print)

app.mount('#app');
