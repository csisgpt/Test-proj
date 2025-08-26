import type { RouteRecordRaw } from 'vue-router'
import type { DefineComponent } from 'vue'

declare module 'loanMfe/routes' {
  const routes: RouteRecordRaw[]
  export default routes
}
declare module 'loanMfe/LoanWidget' {
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module 'insuranceMfe/routes' {
  const routes: RouteRecordRaw[]
  export default routes
}
declare module 'insuranceMfe/InsuranceWidget' {
  const component: DefineComponent<{}, {}, any>
  export default component
}
