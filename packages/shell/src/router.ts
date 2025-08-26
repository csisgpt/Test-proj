import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from './views/Home.vue'
import MicroHost from './views/MicroHost.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home },
  { path: '/customer', component: MicroHost, props: { remoteSpec: 'customer/App' } },
  { path: '/insurance', component: MicroHost, props: { remoteSpec: 'insurance/App' } },
  { path: '/loan', component: MicroHost, props: { remoteSpec: 'loan/App' } },
]

export const router = createRouter({ history: createWebHistory(), routes })
