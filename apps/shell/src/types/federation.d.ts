declare module 'pharmacy/routes' {
  import type { RouteRecordRaw, Router } from 'vue-router'
  const routes: RouteRecordRaw[]
  export default routes
  export function registerRoutes(router: Router, base?: string): void
}
