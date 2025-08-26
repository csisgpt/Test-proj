import type { RouteRecordRaw } from 'vue-router'
export default [
  { path: '/', name: 'home', component: () => import('./pages/HomePage.vue') }
] as RouteRecordRaw[]
