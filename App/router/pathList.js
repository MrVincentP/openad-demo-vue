
import { AppEnv } from '@utils/AppEnv';

const pathList = [{
  path: '/',
  name: 'LayOut',
  meta: { title: AppEnv.title, keepAlive: false },
  component: () => import(/* webpackChunkName: "LayOut" */'@/pages/Layout.vue'),
  // eslint-disable-next-line array-bracket-newline
  children: [
    {
      path: '/home/index',
      name: 'HomeIndex',
      meta: { title: 'home', keepAlive: false },
      component: () => import(/* webpackChunkName: "HomeIndex" */'@/pages/home/index.vue'),
    },
    {
      path: '/SinglePage/async',
      name: 'SinglePageAsync',
      meta: { title: '', keepAlive: false },
      component: () => import(/* webpackChunkName: "SinglePageAsync" */'@/pages/SinglePage/async.vue'),
    },
    {
      path: '/SinglePage/single',
      name: 'SinglePageSingle',
      meta: { title: '', keepAlive: false },
      component: () => import(/* webpackChunkName: "SinglePageSingle" */'@/pages/SinglePage/single.vue'),
    },
    {
      path: '/SinglePage/native',
      name: 'SinglePageNative',
      meta: { title: '', keepAlive: false },
      component: () => import(/* webpackChunkName: "SinglePageNative" */'@/pages/SinglePage/native.vue'),
    },
    {
      path: '/SinglePage/multi',
      name: 'SinglePageMulti',
      meta: { title: '', keepAlive: false },
      component: () => import(/* webpackChunkName: "SinglePageMulti" */'@/pages/SinglePage/multi.vue'),
    },
    {
      path: '/SinglePage/ajax',
      name: 'SinglePageAjax',
      meta: { title: '', keepAlive: false },
      component: () => import(/* webpackChunkName: "SinglePageMulti" */'@/pages/SinglePage/ajax.vue'),
    }],
}];
export default pathList;
