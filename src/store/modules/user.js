import { getUserInfo, login } from '@/api/user';
import { getAccessToken, removeAccessToken, setAccessToken } from '@/utils/accessToken';

import { setting } from '@/config/setting';
const { title, tokenName } = setting;
import { resetRouter } from '@/router';

import i18n from '@/locales';
const { global } = i18n;

import { ElMessage, ElNotification } from 'element-plus';

const state = {
  accessToken: getAccessToken(),
  username: '',
  realname: '',
  email: '',
  avatar: '',
  permissions: [],
};

const getters = {
  accessToken: (state) => state.accessToken,
  username: (state) => state.username,
  realname: (state) => state.realname,
  email: (state) => state.email,
  avatar: (state) => state.avatar,
  permissions: (state) => state.permissions,
};
const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken;
    setAccessToken(accessToken);
  },
  setUsername(state, username) {
    state.username = username;
  },
  setRealname(state, realname) {
    state.realname = realname;
  },
  setEmail(state, email) {
    state.email = email;
  },
  setAvatar(state, avatar) {
    state.avatar = avatar;
  },
  setPermissions(state, permissions) {
    state.permissions = permissions;
  },
};
const actions = {
  setPermissions({ commit }, permissions) {
    commit('setPermissions', permissions);
  },
  async login({ commit }, userInfo) {
    const { data } = await login(userInfo);
    const accessToken = data[tokenName];
    if (accessToken) {
      commit('setAccessToken', accessToken);
      const hour = new Date().getHours();
      const thisTime =
        hour < 8
          ? global.t('sayHi.early')
          : hour <= 11
          ? global.t('sayHi.morning')
          : hour <= 13
          ? global.t('sayHi.noon')
          : hour < 18
          ? global.t('sayHi.afternoon')
          : global.t('sayHi.evening');
      ElNotification({
        title: `${thisTime}！`,
        message: `${global.t('notice.message')}${title}!`,
        type: 'success',
      });
    } else {
      ElMessage.error(global.t('request.tokenError', { tokenName }));
    }
  },
  async getUserInfo({ commit, state }) {
    const { data } = await getUserInfo();
    if (!data) {
      ElMessage.error(global.t('request.loginFailed'));
      return false;
    }
    let { permissions, username, realname, email, avatar } = data;
    if (permissions && username && Array.isArray(permissions)) {
      commit('setPermissions', permissions);
      commit('setUsername', username);
      commit('setRealname', realname);
      commit('setEmail', email);
      commit('setAvatar', avatar);
      return permissions;
    } else {
      ElMessage.error(global.t('request.userInterfaceError'));
      return false;
    }
  },
  async logout({ dispatch }) {
    await dispatch('resetAccessToken');
    await resetRouter();
  },
  resetAccessToken({ commit }) {
    commit('setPermissions', []);
    commit('setAccessToken', '');
    removeAccessToken();
  },
};
export default { state, getters, mutations, actions };
