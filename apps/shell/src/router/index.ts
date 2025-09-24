// apps/shell/src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw, RouterView } from 'vue-router'
import { h } from 'vue'
import Home from '@/views/Home.vue'
import AuthError from '@/views/AuthError.vue'
import { getAccessToken, silentRefresh, signIn } from '@company/auth'
import { loadRuntimeConfig, getRuntimeConfig } from '@/config/runtime-config'

// ---------------- Base routes ----------------
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

const router = createRouter({ history: createWebHistory(), routes })

if (import.meta.env.DEV) {
  router.addRoute({ path: '/_routes', component: () => import('@/views/RouteMap.vue') })
  // دسترسی دیباگ در کنسول
  // @ts-expect-error
  window.__router = router
}

// ---------------- OIDC env ----------------
const hasOidcEnv =
  !!import.meta.env.VITE_OIDC_AUTHORITY &&
  !!import.meta.env.VITE_OIDC_CLIENT_ID &&
  !!import.meta.env.VITE_OIDC_REDIRECT_URI

// ---------------- Pharmacy MFE ----------------
const PHARMACY_BASE = '/pharmacy'
const PHARMACY_PARENT = 'pharmacy-root'
const PHARMACY_SENTINEL = '__pharmacy_registered__'
const PHARMACY_REQUIRES_AUTH = true

const PharmacyLayout = { render: () => h(RouterView) } // ✅ به‌جای 'router-view' رشته‌ای

async function ensurePharmacyMounted() {
  if (router.hasRoute(PHARMACY_SENTINEL) || router.hasRoute(PHARMACY_PARENT)) return

  // 1) کانفیگ رو لود کن تا remoteEntry ست بشه
  const cfg = await loadRuntimeConfig()
  const baseFromCfg = cfg.mfes?.pharmacy?.basePath
  const requiresAuthFromCfg = cfg.mfes?.pharmacy?.requiresAuth
  const base = baseFromCfg || PHARMACY_BASE

  try {
    const mod: any = await import('pharmacy/routes') // حالا با URL جدید لود می‌شود
    const maybeChildren = (mod?.default ?? mod) as unknown

    if (Array.isArray(maybeChildren)) {
      const children = maybeChildren as RouteRecordRaw[]
      router.addRoute({
        name: PHARMACY_PARENT,
        path: base,
        component: PharmacyLayout,
        ...((requiresAuthFromCfg ?? PHARMACY_REQUIRES_AUTH)
          ? { meta: { requiresAuth: true } }
          : {}),
        children,
      })
      router.addRoute({
        name: PHARMACY_SENTINEL,
        path: '/.mfes/pharmacy-registered',
        component: { render: () => null },
        meta: { internal: true },
      })
      window.dispatchEvent(new CustomEvent('mfe:pharmacy:ready', { detail: { base } }))
      return
    }

    if (typeof (mod as any).registerRoutes === 'function') {
      ;(mod as any).registerRoutes(router, base)
      router.addRoute({
        name: PHARMACY_SENTINEL,
        path: '/.mfes/pharmacy-registered',
        component: { render: () => null },
        meta: { internal: true },
      })
      return
    }

    console.warn('[MFE] pharmacy/routes exposed neither array nor registerRoutes().')
  } catch (e) {
    console.warn('[MFE] Failed to load pharmacy remote routes:', e)
    if (!router.hasRoute(PHARMACY_PARENT)) {
      router.addRoute({
        name: PHARMACY_PARENT,
        path: `${base}/:pathMatch(.*)*`,
        component: { template: `<div style="padding:2rem">Pharmacy is unavailable.</div>` },
      })
    }
  }
}

// ✅ 1) Eager mount در DEV (برای اینکه «الان» ببینی کار می‌کند)
//    اگر دوست داشتی کنترلش کن با env: VITE_MFE_EAGER=1
const EAGER_MFE = import.meta.env.DEV || getRuntimeConfig()?.env === 'production' // نمونه شرط
if (EAGER_MFE) ensurePharmacyMounted()

// ✅ 2) Lazy mount: فقط وقتی کاربر به /pharmacy می‌رود
router.beforeEach(async (to) => {
  if (
    to.path.startsWith(PHARMACY_BASE) &&
    !router.hasRoute(PHARMACY_SENTINEL) &&
    !router.hasRoute(PHARMACY_PARENT)
  ) {
    if (import.meta.env.DEV) console.info('[MFE] Lazy mounting Pharmacy on demand for', to.fullPath)
    await ensurePharmacyMounted()
    return to // re-resolve routes
  }
  return true
})

// ---------------- Auth guard ----------------
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
  } catch {
    // ignore
  }
  await signIn()
  return false
})

export default router
