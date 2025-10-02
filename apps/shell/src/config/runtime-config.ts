// apps/shell/src/config/runtime-config.ts
import { registerRemotes } from '@module-federation/enhanced/runtime' // ⬅️ جدید

export type AppConfig = {
  env: string
  apiBaseUrl?: string
  auth?: { authority?: string; clientId?: string; redirectUri?: string }
  mfes?: Record<
    string,
    {
      remoteEntry?: string
      basePath?: string
      requiresAuth?: boolean
      expectedRange?: string
      expose?: string
      preload?: boolean
      title?: string
    }
  >
}

let _cfgPromise: Promise<AppConfig> | null = null

function nocache(u: string) {
  const sep = u.includes('?') ? '&' : '?'
  return `${u}${sep}t=${Date.now()}`
}

async function fetchFirstOk(urls: string[]): Promise<AppConfig> {
  for (const u of urls) {
    try {
      const r = await fetch(nocache(u), { cache: 'no-store' })
      if (r.ok) return (await r.json()) as AppConfig
    } catch {}
  }
  throw new Error('No config source found')
}

export function loadRuntimeConfig(): Promise<AppConfig> {
  if (_cfgPromise) return _cfgPromise

  const base = import.meta.env.BASE_URL || '/'
  const mode = import.meta.env.MODE
  const override = import.meta.env.VITE_APP_CONFIG_URL as string | undefined

  const candidates: string[] = []
  if (override) candidates.push(override)
  if (import.meta.env.DEV) {
    candidates.push(`${base}config/app-config.local.json`)
    candidates.push(`${base}config/app-config.dev.json`)
  }
  candidates.push(`${base}config/app-config.json`)

  console.log('candidates', candidates)
  _cfgPromise = fetchFirstOk(candidates)
    .then((cfg) => {
      cfg.env ||= mode
      ;(window as any).__APP_CONFIG = cfg
      console.log('cfg', cfg)

      // ✅ رن‌تایم: ریموت‌ها را از کانفیگ رجیستر کن (می‌تونیم force هم بزنیم)
      const remotes = Object.entries(cfg.mfes ?? {})
        .filter(([, m]) => !!m?.remoteEntry)
        .map(([name, m]) => {
          const entry = m!.remoteEntry!
          const isManifest = entry.endsWith('mf-manifest.json')
          const isRemoteEntry = entry.endsWith('remoteEntry.js')
          // 👇 نوع را صریح مشخص کن
          const type = isManifest ? 'manifest' : isRemoteEntry ? 'module' : undefined
          return type ? { name, entry, type } : { name, entry }
        })

      console.log('remotes', remotes)
      if (import.meta.env.DEV) console.info('[MF] registering remotes:', remotes)

      if (remotes.length) {
        registerRemotes(remotes, { force: true })
        ;(window as any).__MF_REMOTES__ = remotes
      }

      return cfg
    })
    .catch((e) => {
      console.warn('[config] failed to load app-config:', candidates, e)
      const empty = { env: mode } as AppConfig
      ;(window as any).__APP_CONFIG = empty
      return empty
    })

  return _cfgPromise
}

export function getRuntimeConfig(): AppConfig {
  return (window as any).__APP_CONFIG ?? {}
}
