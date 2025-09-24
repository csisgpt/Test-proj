export type AppConfig = {
  env: string
  apiBaseUrl?: string
  auth?: { authority?: string; clientId?: string; redirectUri?: string }
  mfes?: {
    pharmacy?: {
      remoteEntry?: string
      basePath?: string
      requiresAuth?: boolean
      expectedRange?: string
    }
  }
}

let _cfgPromise: Promise<AppConfig> | null = null

export function loadRuntimeConfig(): Promise<AppConfig> {
  if (_cfgPromise) return _cfgPromise
  const url = `${import.meta.env.BASE_URL || '/'}config/app-config.json`
  _cfgPromise = fetch(url, { cache: 'no-store' })
    .then((r) => {
      if (!r.ok) throw new Error(`Config HTTP ${r.status}`)
      return r.json()
    })
    .then((cfg: AppConfig) => {
      ;(window as any).__APP_CONFIG = cfg
      // اگر فدریشن runtime setter دارد، آدرس ریموت را تزریق کن
      const setRemote = (window as any).__federation_method_setRemote
      const pharmacyUrl = cfg.mfes?.pharmacy?.remoteEntry
      if (setRemote && pharmacyUrl) {
        setRemote('pharmacy', pharmacyUrl)
      }
      return cfg
    })
    .catch((e) => {
      console.warn('[config] failed to load app-config.json:', e)
      return {} as AppConfig
    })
  return _cfgPromise
}

export function getRuntimeConfig(): AppConfig {
  return (window as any).__APP_CONFIG ?? {}
}
