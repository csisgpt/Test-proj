import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { pharmacyChildRoutes } from '../remote/routes'

/** بچه‌روت‌ها رو برای dev به مسیرهای مطلق تبدیل کن */
function toDevAbsolute(children: RouteRecordRaw[]): RouteRecordRaw[] {
  return children.map((r) => ({
    ...r,
    path: r.path === '' ? '/' : `/${String(r.path).replace(/^\//, '')}`,
  }))
}

const routes = toDevAbsolute(pharmacyChildRoutes)

const router = createRouter({
  // اگر تو vite.config.ts برای pharmacy مقدار base تعریف نکردی، همین '/' امن‌ترین گزینست
  history: createWebHistory('/'),
  routes,
})

export default router
