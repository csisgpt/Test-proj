import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { installCompanyUI } from '@company/ui'
import '@company/ui/style'

const app = createApp(App)
app.use(createPinia())
app.use(installCompanyUI)
app.mount('#app')
