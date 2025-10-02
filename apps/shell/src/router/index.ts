// apps/shell/src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw, RouterView } from 'vue-router'
import { h } from 'vue'
import Home from '@/views/Home.vue'
import AuthError from '@/views/AuthError.vue'
import { getAccessToken, silentRefresh, signIn } from '@company/auth'
import { loadRuntimeConfig, type AppConfig } from '@/config/runtime-config'
import { loadRemote } from '@module-federation/enhanced/runtime' // ⬅️ جدید

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
  // @ts-expect-error
  window.__router = router
}

// ---------------- Helpers ----------------
const Layout = { render: () => h(RouterView) }
const parentName = (name: string) => `mfe-${name}-root`
const sentinelName = (name: string) => `__mfe_${name}_registered__`

type MFEEntry = NonNullable<AppConfig['mfes']>[string] & { expose?: string }
const registry = new Map<string, { mounted: boolean; base: string; requiresAuth: boolean }>()

async function getConfig(): Promise<AppConfig> {
  return await loadRuntimeConfig()
}

function findMatchMfe(mfes: Record<string, MFEEntry>, path: string) {
  const entries = Object.entries(mfes)
  for (const [name, m] of entries) {
    const base = m.basePath || `/${name}`
    if (path === base || path.startsWith(base + '/') || path === base + '/') {
      return { name, cfg: m, base }
    }
  }
  return null
}

async function ensureMfeMounted(name: string, m: MFEEntry, base: string) {

  if (router.hasRoute(sentinelName(name)) || router.hasRoute(parentName(name))) {
    registry.set(name, { mounted: true, base, requiresAuth: !!m.requiresAuth })
    return
  }

  const exposeKey = (m.expose || './routes').replace(/^\.\//, '') // './routes' -> 'routes'


  try {
    // MF v2 runtime: load exposed module at runtime
    

    const mod: any = await loadRemote(`${name}/${exposeKey}`)
    const unwrapped = mod?.default ?? mod

    if (Array.isArray(unwrapped)) {
      const children = unwrapped as RouteRecordRaw[]
      router.addRoute({
        name: parentName(name),
        path: base,
        component: Layout,
        ...(m.requiresAuth ? { meta: { requiresAuth: true } } : {}),
        children,
      })
      router.addRoute({
        name: sentinelName(name),
        path: `/.mfes/${name}-registered`,
        component: { render: () => null },
        meta: { internal: true },
      })
      registry.set(name, { mounted: true, base, requiresAuth: !!m.requiresAuth })
      window.dispatchEvent(new CustomEvent(`mfe:${name}:ready`, { detail: { base } }))
      return
    }

    if (typeof unwrapped?.registerRoutes === 'function') {
      await unwrapped.registerRoutes(router, base)
      router.addRoute({
        name: sentinelName(name),
        path: `/.mfes/${name}-registered`,
        component: { render: () => null },
        meta: { internal: true },
      })
      registry.set(name, { mounted: true, base, requiresAuth: !!m.requiresAuth })
      window.dispatchEvent(new CustomEvent(`mfe:${name}:ready`, { detail: { base } }))
      return
    }

    console.warn(`[MFE] ${name} expose '${exposeKey}' نه آرایه routes داد و نه registerRoutes().`)
    router.addRoute({
      name: parentName(name),
      path: `${base}/:pathMatch(.*)*`,
      component: { template: `<div style="padding:2rem">${name} is unavailable.</div>` },
    })
  } catch (e) {
    console.warn(`[MFE] Failed to load remote ${name}:`, e)
    if (!router.hasRoute(parentName(name))) {
      router.addRoute({
        name: parentName(name),
        path: `${base}/:pathMatch(.*)*`,
        component: { template: `<div style="padding:2rem">${name} is unavailable.</div>` },
      })
    }
  }
}

// ---------------- Eager preload (اختیاری از روی کانفیگ) ----------------
;(async () => {
  const cfg = await getConfig()
  const mfes = cfg.mfes ?? {}
  console.log(mfes)
  for (const [name, m] of Object.entries(mfes)) {
    console.log(m)
    const base = m.basePath || `/${name}`
    console.log(m)

    registry.set(name, { mounted: false, base, requiresAuth: !!m.requiresAuth })
    console.log(registry)
    if (m.preload) {
      console.log(m)
      ensureMfeMounted(name, m, base)
    }
  }
})()

// ---------------- Lazy mount هنگام ورود به مسیر ----------------
router.beforeEach(async (to) => {
  const cfg = await getConfig()
  const mfes = cfg.mfes ?? {}
  const match = findMatchMfe(mfes, to.path)
  if (match) {
    const { name, cfg: m, base } = match
    if (!router.hasRoute(sentinelName(name)) && !router.hasRoute(parentName(name))) {
      if (import.meta.env.DEV) console.info('[MFE] Lazy mounting', name, 'for', to.fullPath)
      await ensureMfeMounted(name, m, base)
      return to // re-resolve
    }
  }
  return true
})

// ---------------- Auth guard ----------------
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
  } catch {
    // ignore
  }
  await signIn()
  return false
})

export default router
