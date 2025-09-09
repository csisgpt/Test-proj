declare module 'pharmacy/routes' {
  import type { RouteRecordRaw, Router } from 'vue-router'
  export const pharmacyChildRoutes: RouteRecordRaw[]
  export function registerRoutes(router: Router, base?: string): void
  const routes: RouteRecordRaw[]
  export default routes
}