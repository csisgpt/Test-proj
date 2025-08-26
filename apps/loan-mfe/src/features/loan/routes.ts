import type { RouteRecordRaw } from 'vue-router'
export default [
  {
    path: '/loan',
    component: () => import('./components/LoanWidget.vue'),
    children: [
      { path: '', name: 'loan-list', component: () => import('./pages/LoanListPage.vue') },
      { path: ':id', name: 'loan-detail', component: () => import('./pages/LoanDetailPage.vue') }
    ]
  }
] as RouteRecordRaw[]
