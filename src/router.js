import Vue from 'vue';
import Router from 'vue-router';
import getStoreInstance from '@/store';
import { isWeb } from '@/helpers/utils';
import { hasAccounts } from '@/helpers/keychain';

const Import = () => import(/* webpackChunkName: "import" */ '@/views/Import.vue');
const Login = () => import(/* webpackChunkName: "login" */ '@/views/Login.vue');
const Dashboard = () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue');
const Keys = () => import(/* webpackChunkName: "keys" */ '@/views/Keys.vue');
const Sign = () => import(/* webpackChunkName: "sign" */ '@/views/Sign.vue');
const Settings = () => import(/* webpackChunkName: "settings" */ '@/views/Settings.vue');
const About = () => import(/* webpackChunkName: "about" */ '@/views/About.vue');

Vue.use(Router);

const requireAuth = (to, from, next) => {
  getStoreInstance(store => {
    if (!store.state.auth.account.name) {
      const name = hasAccounts() ? 'login' : 'import';
      const redirect = to.fullPath === '/' ? undefined : to.fullPath;
      next({ name, query: { redirect } });
    } else {
      next();
    }
  });
};

const beforeLogin = (to, from, next) => {
  if (!hasAccounts()) {
    const redirect = to.query.redirect === '/' ? undefined : to.query.redirect;
    next({ name: 'import', query: { redirect } });
  } else {
    next();
  }
};

export default new Router({
  mode: isWeb() ? 'history' : 'hash',
  routes: [
    {
      path: '/',
      name: 'dashboard',
      beforeEnter: requireAuth,
      component: Dashboard,
    },
    {
      path: '/import',
      name: 'import',
      component: Import,
      meta: {
        layout: 'light',
      },
    },
    {
      path: '/login',
      name: 'login',
      beforeEnter: beforeLogin,
      component: Login,
      meta: {
        layout: 'light',
      },
    },
    {
      path: '/keys',
      name: 'keys',
      beforeEnter: requireAuth,
      component: Keys,
    },
    {
      path: '/sign/*',
      name: 'sign',
      component: Sign,
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
  ],
});
