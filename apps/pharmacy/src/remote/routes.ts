import type { RouteRecordRaw } from 'vue-router'
import PharmacyHome from '../views/Home.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/pharmacy',
    component: PharmacyHome,
    children: [
      // keep/add child routes as needed
      // { path: 'orders', component: () => import('../views/Orders.vue') },
    ]
  }
]

export default routes
