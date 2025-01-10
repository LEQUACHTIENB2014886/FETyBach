import { themeConfig } from '@/config/theme';
import { getLanguage, setLanguage } from '@/utils/cookies';

const { mode, theme, fixedHead, fullScreen, refresh, collapse, isBreadcrumb, isLogo, tag } =
  themeConfig;

const state = {
  routerView: true,
  isMobile: false,
  isDrawer: false,
  isFullScreen: false,
  collapse,
  fullScreen,
  refresh,
  mode,
  theme,
  fixedHead,
  isBreadcrumb,
  isLogo,
  tag,
  lang: getLanguage(),
};

const getters = {
  routerView: (state) => state.routerView,
  isMobile: (state) => state.isMobile,
  isDrawer: (state) => state.isDrawer,
  isFullScreen: (state) => state.isFullScreen,
  theme: (state) => state.theme,
  fullScreen: (state) => state.fullScreen,
  refresh: (state) => state.refresh,
  fixedHead: (state) => state.fixedHead,
  isBreadcrumb: (state) => state.isBreadcrumb,
  isLogo: (state) => state.isLogo,
  tag: (state) => state.tag,
  mode: (state) => state.mode,
  settings: (state) => state,
  lang: (state) => state.lang,
};

const mutations = {
  CHANGE_COLLAPSE: (state) => {
    state.collapse = !state.collapse;
  },
  CHANGE_FULL_SCREEN: (state, flag) => {
    state.isFullScreen = flag;
  },
  SET_ROUTER_VIEW: (state) => {
    state.routerView = !state.routerView;
  },
  CHANGE_IS_MOBILE: (state, flag) => {
    state.isMobile = flag;
  },
  CHANGE_IS_DRAWER: (state, flag) => {
    state.isDrawer = flag;
  },
  CHANGE_LANGUAGE: (state, lang) => {
    setLanguage(lang);
    state.lang = lang;
  },
};

const actions = {
  changeCollapse: ({ commit }) => {
    commit('CHANGE_COLLAPSE');
  },
  changeFullScreen: ({ commit }, flag) => {
    commit('CHANGE_FULL_SCREEN', flag);
  },
  setRouterView: ({ commit }, flag) => {
    commit('SET_ROUTER_VIEW', flag);
  },
  changeMobile: ({ commit }, flag) => {
    commit('CHANGE_IS_MOBILE', flag);
  },
  changeDrawer: ({ commit }, flag) => {
    commit('CHANGE_IS_DRAWER', flag);
  },
  changeLanguage: ({ commit }, lang) => {
    commit('CHANGE_LANGUAGE', lang);
  },
};

export default {
  getters,
  state,
  mutations,
  actions,
};
