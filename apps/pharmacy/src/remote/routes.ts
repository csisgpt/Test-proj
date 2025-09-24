// apps/pharmacy/src/remote/routes.ts
import type { RouteRecordRaw, Router } from 'vue-router'
import { h } from 'vue'
import PharmacyHome from '../views/Home.vue'

export const pharmacyChildRoutes: RouteRecordRaw[] = [
  // روت ایندکس: وقتی زیر /pharmacy mount شد، می‌شود: /pharmacy
  { path: '', name: 'pharmacy-home', component: PharmacyHome, meta: { requiresAuth: false } },

  // نمونه روت فرزند: /pharmacy/orders
  { path: 'orders', name: 'pharmacy-orders', component: () => import('../views/Orders.vue'), meta: { requiresAuth: false } },
]

// تابع رجیستر برای هاست: روت‌ها را زیر base (پیش‌فرض '/pharmacy') mount می‌کند
export function registerRoutes(router: Router, base = '/pharmacy') {
  const Layout = { render: () => h('router-view') } // والد خالی برای نگه‌داشتن children
  router.addRoute({ path: base, component: Layout, children: pharmacyChildRoutes })
}

// اکسپورت پیش‌فرض: خود child routes (برای هاست‌هایی که تابع نمی‌خوانند)
export default pharmacyChildRoutes
