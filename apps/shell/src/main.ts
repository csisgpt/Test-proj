import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { createApiClient } from '@company/api'
import { installCompanyUI } from '@company/ui'

import './styles/main.css'
import '@company/ui/style'

const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  timeout: 30000
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(installCompanyUI)

app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err, info)
}

app.config.globalProperties.$api = apiClient

app.mount('#app')

document.getElementById('app-loader')?.remove()
