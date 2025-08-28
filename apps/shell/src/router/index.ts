import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const loadMicroApp = (appName: string) => {
  return () => import(`../micro-apps/${appName}/index.vue`)
}

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'login', component: () => import('../views/Login.vue'), meta: { public: true } },
  { path: '/sso-callback', name: 'sso-callback', component: () => import('../views/SSOCallback.vue'), meta: { public: true } },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'dashboard', component: () => import('../views/Dashboard.vue') },
      { path: 'pharmacy', name: 'pharmacy', component: loadMicroApp('pharmacy'), meta: { permissions: ['pharmacy.access'] } },
      { path: 'insurance', name: 'insurance', component: loadMicroApp('insurance'), meta: { permissions: ['insurance.access'] } },
      { path: 'housing', name: 'housing', component: loadMicroApp('housing'), meta: { permissions: ['housing.access'] } },
      { path: 'loan', name: 'loan', component: loadMicroApp('loan'), meta: { permissions: ['loan.access'] } },
      { path: 'profile', name: 'profile', component: () => import('../views/Profile.vue') },
      { path: 'settings', name: 'settings', component: () => import('../views/Settings.vue') }
    ]
  },
  { path: '/forbidden', name: 'forbidden', component: () => import('../views/Forbidden.vue'), meta: { public: true } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFound.vue'), meta: { public: true } }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

export default router
