import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import AuthError from '../views/AuthError.vue'
import { getAccessToken, silentRefresh, signIn } from '@company/auth'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home },
  { path: '/sso/callback', component: () => import('../views/SSOCallback.vue') },
  { path: '/auth/error', component: AuthError },
  { path: '/dashboard', component: () => import('../views/Dashboard.vue'), meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

let refreshing: Promise<any> | null = null
router.beforeEach(async (to) => {
  if (!to.meta?.requiresAuth) return true

  let token = await getAccessToken()
  if (token) return true

  if (!refreshing) refreshing = silentRefresh().finally(() => (refreshing = null))
  try {
    await refreshing
    token = await getAccessToken()
    if (token) return true
  } catch {
    // ignore
  }

  await signIn()
  return false
})

async function mountRemoteRoutes() {
  try {
    const mod = await import('pharmacy/routes')
    const remoteRoutes = (mod.default || mod) as RouteRecordRaw[]
    remoteRoutes.forEach((r) => router.addRoute(r))
  } catch (e) {
    console.warn('[MFE] Failed to load pharmacy remote routes:', e)
  }
}
mountRemoteRoutes()

export default router
