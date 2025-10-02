// apps/shell/src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { createApiClient } from '@company/api'
import { installCompanyUI } from '@company/ui'
import { createPinia } from 'pinia'
import { setPinia } from '@company/state/pinia-bridge'
import { loadRuntimeConfig } from '@/config/runtime-config'

import './styles/main.css'
import '@company/ui/style'
import '@company/ui/style.css'

// ⬅️ 1) اول ریموت‌ها را از app-config رجیستر کن
await loadRuntimeConfig()

// ⬅️ 2) حالا روتر را بعد از رجیستر شدن remotes ایمپورت کن
const { default: router } = await import('./router')

const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  timeout: 30000,
})

const app = createApp(App)
const pinia = createPinia()
setPinia(pinia)

app.use(pinia)
app.use(router)
app.use(installCompanyUI)

app.config.errorHandler = (err, _instance, info) => {
  console.error('Global error:', err, info)
}

app.config.globalProperties.$api = apiClient
app.mount('#app')

document.getElementById('app-loader')?.remove()
if (import.meta.env.DEV) (window as any).__PINIA__ = pinia
