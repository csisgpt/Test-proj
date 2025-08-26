import { createApp } from 'vue'
import App from '@/App.vue'
import { pinia } from './plugins/pinia'
import router from '@/router'

export function bootstrap() {
  const app = createApp(App)
  app.use(pinia)
  app.use(router)
  app.config.errorHandler = (err) => console.error('Global Error:', err)
  return app
}
