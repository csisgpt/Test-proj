import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router'
import { EventBusPlugin } from '@enterprise/event-bus'
import App from './App.vue'
import '@enterprise/ui-kit/styles'
import './assets/styles/main.css'

// Create app
const app = createApp(App)

// Install plugins
app.use(createPinia())
app.use(router)
app.use(EventBusPlugin)

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err, info)
  // Send to monitoring service
}

// Mount
app.mount('#app')
