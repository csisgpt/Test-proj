import type { RouteRecordRaw } from 'vue-router'
export default [
  { path: '/ins', name: 'ins-home', component: () => import('./pages/InsuranceHome.vue') }
] as RouteRecordRaw[]
