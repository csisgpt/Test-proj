import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import '@company/ui/style'
import '@company/ui/style.css'
import { installCompanyUI } from '@company/ui'
createApp(App).use(createPinia()).use(router).use(installCompanyUI).mount('#app')
