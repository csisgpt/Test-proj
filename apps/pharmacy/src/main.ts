import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { installCompanyUI } from '@company/ui'
import '@company/ui/style'

createApp(App).use(createPinia()).use(router).use(installCompanyUI).mount('#app')
