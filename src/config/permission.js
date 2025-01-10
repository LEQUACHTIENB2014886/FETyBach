import router from '@/router';
import store from '@/store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getPageTitle } from '@/utils/index';
import { setting } from '@/config/setting';
const { loginInterception, progressBar, routesWhiteList, recordRoute } = setting;

NProgress.configure({
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false,
});
router.beforeEach(async (to, from, next) => {
  if (progressBar) NProgress.start();

  let hasToken = store.getters['user/accessToken'];
  if (!loginInterception) hasToken = true;

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' });
      if (progressBar) NProgress.done();
    } else {
      const hasPermissions =
        store.getters['user/permissions'] && store.getters['user/permissions'].length > 0;
      if (hasPermissions) {
        next();
      } else {
        try {
          let permissions;
          if (!loginInterception) {
            await store.dispatch('user/setPermissions', ['administrator']);
            permissions = ['administrator'];
          } else {
            permissions = await store.dispatch('user/getUserInfo');
          }

          let accessRoutes = [];
          accessRoutes = await store.dispatch('routes/setRoutes', permissions);
          accessRoutes.forEach((item) => {
            router.addRoute(item);
          });
          next({ ...to, replace: true });
        } catch {
          await store.dispatch('user/resetAccessToken');
          if (progressBar) NProgress.done();
        }
      }
    }
  } else {
    if (routesWhiteList.indexOf(to.path) !== -1 || to.meta.public) {
      next();
    } else {
      if (recordRoute) {
        next(`/login?redirect=${to.path}`);
      } else {
        next('/login');
      }
      if (progressBar) NProgress.done();
    }
  }
  document.title = getPageTitle(to.meta.title);
});
router.afterEach(() => {
  if (progressBar) NProgress.done();
});
