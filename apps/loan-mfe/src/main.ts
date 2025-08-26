import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import routes from './features/loan/routes'
import { pinia } from './app/plugins/pinia'

const router = createRouter({ history: createWebHistory(), routes })
createApp(App).use(router).use(pinia).mount('#app')
