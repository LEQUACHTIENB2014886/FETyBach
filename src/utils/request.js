import axios from 'axios';
import { netConfig } from '@/config/net.config';
const { baseURL, contentType, invalidCode, noPermissionCode, requestTimeout, successCode } =
  netConfig;
import store from '@/store/index.js';
import router from '@/router/index.js';
import { ElMessageBox, ElMessage } from 'element-plus';
import qs from 'qs';
import i18n from '@/locales';
const { global } = i18n;
import CancelRequest from './cancel-request.js';
let cancelRequest = new CancelRequest();

const handleCode = (code, msg) => {
  switch (code) {
    case invalidCode:
      if (msg.includes('user') || msg.includes('password')) return ElMessage.error(msg);
      ElMessageBox.alert(global.t('request.loginInvalid'), global.t('request.reLoginTitle'), {
        confirmButtonText: global.t('btn.confirm'),
        type: 'warning',
      }).then(async () => {
        store.dispatch('user/logout');
        router.push('/login');
      });
      break;
    case noPermissionCode:
      router.push({ path: '/401' }).catch(() => {});
      break;
    default:
      ElMessage.error(msg || global.t('request.apiErrorWithCode', { code }));
      break;
  }
};

const instance = axios.create({
  baseURL,
  timeout: requestTimeout,
  headers: {
    'Content-Type': contentType,
  },
});

instance.interceptors.request.use(
  (config) => {
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        t: new Date().getTime(),
      };
    }
    if (store.getters['user/accessToken']) {
      config.headers['Authorization'] = `bearer ${store.getters['user/accessToken']}`;
    }
    if (
      config.data &&
      config.headers['Content-Type'] === 'application/x-www-form-urlencoded;charset=UTF-8'
    )
      config.data = qs.stringify(config.data);

    const CancelToken = axios.CancelToken;

    cancelRequest.checkoutPendingRequest(config, CancelToken);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    const res = response.data;
    const { data } = response;
    const { code, message } = data;

    cancelRequest.removeRequestKey(response.config.requestKey);

    if (successCode.indexOf(code) !== -1) {
      return res;
    } else {
      handleCode(code, message);
      return Promise.reject();
    }
  },
  (error) => {
    const { response, message } = error;

    cancelRequest.removeRequestKey(error.config.requestKey);

    if (error.response && error.response.data) {
      const { status, data } = response;
      handleCode(status, data.message || message);
      return Promise.reject(error);
    } else {
      let { message } = error;
      if (message === 'Network Error') {
        message = global.t('request.accessFailed');
      }
      if (message.includes('timeout')) {
        message = global.t('request.accessTimeout');
      }
      if (message.includes('Request failed with status code')) {
        const code = message.substr(message.length - 3);
        message = data.message || global.t('request.apiErrorWithCode', { code });
      }
      ElMessage.error(message || global.t('request.unknownError'));
      return Promise.reject(error);
    }
  }
);

export default instance;
