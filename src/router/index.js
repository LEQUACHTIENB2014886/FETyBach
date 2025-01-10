import { createRouter, createWebHashHistory } from 'vue-router';
import AdminLayout from '@/layouts/AdminLayout.vue';
import i18n from '@/locales';
const { global } = i18n;
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: global.t('login.title'),
    },
    hidden: true,
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/errorPage/401.vue'),
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/errorPage/404.vue'),
    hidden: true,
  },
];

export const asyncRoutes = [
  {
    path: '/',
    component: AdminLayout,
    redirect: '/index',
    name: 'Root',
    children: [
      {
        path: '/index',
        name: 'Index',
        component: () => import('../views/index/index.vue'),
        meta: {
          title: global.t('route.home'),
          icon: 'icon-home',
          affix: true,
          noKeepAlive: true,
        },
      },
    ],
  },
  {
    path: '/permission',
    name: 'Permission',
    component: AdminLayout,
    meta: {
      title: global.t('route.permissionPages'),
      icon: 'icon-permissions',
      permissions: ['administrator'],
    },
    children: [
      {
        path: '/users',
        name: 'Users',
        component: () => import('@/views/permission/users/index.vue'),
        meta: {
          title: global.t('route.users'),
          icon: 'icon-user',
        },
      },
      {
        path: '/roles',
        name: 'Roles',
        component: () => import('@/views/permission/roles/index.vue'),
        meta: {
          title: global.t('route.roles'),
          icon: 'icon-id-card-v',
        },
      },
      {
        path: '/menus',
        name: 'Menus',
        component: () => import('@/views/permission/menus/index.vue'),
        meta: {
          title: global.t('route.menus'),
          icon: 'icon-application-menu',
        },
      },
      {
        path: '/casbin',
        name: 'Casbin',
        component: () => import('@/views/permission/casbin/index.vue'),
        meta: {
          title: global.t('route.casbin'),
          icon: 'icon-api',
        },
      },
    ],
  },
  {
    path: '/purchaseorder',
    name: 'Purchaseorder',
    component: AdminLayout,
    meta: {
      title: global.t('route.purchaseorder'),
      icon: 'icon-notebook',
      permissions: ['administrator', 'ncu', 'd2comm'],
    },
    children: [
      {
        path: '/size',
        name: 'Size',
        component: () => import('@/views/permission/purchaseorder-size/index.vue'),
        meta: {
          title: global.t('route.size'),
          icon: 'icon-order',
        },
      },
      {
        path: '/sizeS',
        name: 'Size (Size)',
        component: () => import('@/views/permission/purchaseorder-sizeS/index.vue'),
        meta: {
          title: global.t('route.sizeS'),
          icon: 'icon-order',
        },
      },
      {
        path: '/nosize',
        name: 'Nosize',
        component: () => import('@/views/permission/purchaseorder-nosize/index.vue'),
        meta: {
          title: global.t('route.nosize'),
          icon: 'icon-order',
        },
      },
      {
        path: '/PurchaseD2COMM',
        name: 'PurchaseD2COMM',
        component: () => import('@/views/permission/PurchaseD2COMM/index.vue'),
        meta: {
          title: global.t('route.nosizePO'),
          icon: 'icon-order',
          permissions: ['administrator', 'd2comm'],
        },
      },
    ],
  },
  {
    path: '/printlabelqr',
    name: 'PrintLabelQR',
    component: AdminLayout,
    children: [
      {
        path: '/printlabelqr',
        name: 'PrintLabelQR',
        component: () => import('@/views/permission/print_qrcode/index.vue'),
        meta: {
          title: global.t('route.printlabelqr'),
          icon: 'icon-printer',
          permissions: ['ncu', 'd2comm'],
        },
      },
    ],
  },
  {
    path: '/orderconfirm',
    name: 'OrderConfim',
    component: AdminLayout,
    children: [
      {
        path: '/orderconfirm',
        name: 'OrderConfirm',
        component: () => import('@/views/permission/order-confirm/index.vue'),
        meta: {
          title: global.t('route.orderconfirm'),
          icon: 'icon-check',
          permissions: ['ncu', 'd2comm'],
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    hidden: true,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
});

export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

export default router;
