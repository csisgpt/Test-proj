import { createRouter, createWebHistory, type RouteRecordRaw, type Router } from 'vue-router'
import { h } from 'vue'
import Home from '@/views/Home.vue'
import AuthError from '@/views/AuthError.vue'
import { getAccessToken, silentRefresh, signIn } from '@company/auth'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home },
  { path: '/sso/callback', component: () => import('@/views/SSOCallback.vue') },
  { path: '/auth/error', component: AuthError },
  {
    path: '/dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

if (import.meta.env.DEV) {
  router.addRoute({ path: '/_routes', component: () => import('@/views/RouteMap.vue') })
}

/** Auth guard با حالت dev-safe */
const hasOidcEnv =
  !!import.meta.env.VITE_OIDC_AUTHORITY &&
  !!import.meta.env.VITE_OIDC_CLIENT_ID &&
  !!import.meta.env.VITE_OIDC_REDIRECT_URI

let refreshing: Promise<any> | null = null
router.beforeEach(async (to) => {
  if (!to.meta?.requiresAuth) return true
  if (!hasOidcEnv) return true

  let token = await getAccessToken()
  if (token) return true

  if (!refreshing) refreshing = silentRefresh().finally(() => (refreshing = null))
  try {
    await refreshing
    token = await getAccessToken()
    if (token) return true
  } catch {}
  await signIn()
  return false
})

/** Mount روت‌های Pharmacy زیر /pharmacy */
const PHARMACY_PARENT = 'pharmacy-root'
const PharmacyLayout = { render: () => h('router-view') }

async function mountPharmacy(base = '/pharmacy') {
  try {
    const mod: any = await import('pharmacy/routes')
    // جلوگیری از دوباره‌ثبت در HMR
    if (router.hasRoute(PHARMACY_PARENT)) return

    // اگر Remote تابع registerRoutes صادر کرده:
    if (typeof mod.registerRoutes === 'function') {
      mod.registerRoutes(router, base)
      return
    }

    // در غیر این صورت آرایه‌ی child routes را بگیر و زیر یک والد سوار کن
    const children = (mod.default ?? mod) as RouteRecordRaw[]
    router.addRoute({ name: PHARMACY_PARENT, path: base, component: PharmacyLayout, children })
  } catch (e) {
    console.warn('[MFE] Failed to load pharmacy remote routes:', e)
    // (اختیاری) fallback: اگر remote در دسترس نبود
    if (!router.hasRoute(PHARMACY_PARENT)) {
      router.addRoute({
        name: PHARMACY_PARENT,
        path: '/pharmacy/:pathMatch(.*)*',
        component: { template: `<div style="padding:2rem">Pharmacy is unavailable.</div>` },
      })
    }
  }
}

mountPharmacy()

export default router
