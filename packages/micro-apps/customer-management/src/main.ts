import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import '@enterprise/ui-kit/styles'

createApp(App).use(createPinia()).mount('#app')
