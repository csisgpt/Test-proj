import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeRoutes from '@/features/home/routes'

const routes: RouteRecordRaw[] = [...HomeRoutes]
export const router = createRouter({ history: createWebHistory(), routes })

async function attachRemoteRoutes() {
  try {
    const loanRoutes = (await import('loanMfe/routes')).default
    const insRoutes = (await import('insuranceMfe/routes')).default
    loanRoutes.forEach((r) => router.addRoute(r))
    insRoutes.forEach((r) => router.addRoute(r))
  } catch (e) {
    console.warn('Remote routes not available yet:', e)
  }
}
attachRemoteRoutes()

export default router
