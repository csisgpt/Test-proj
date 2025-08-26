# My Portal (Vue 3 + Vite + Module Federation, PNPM Monorepo)
## Dev
1) Install pnpm: https://pnpm.io/installation
2) pnpm i
3) pnpm dev
- Shell: http://localhost:5173
- Loan MFE: http://localhost:5174
- Insurance MFE: http://localhost:5175

## Build
pnpm build

## Structure
- apps/shell: Host application
- apps/loan-mfe: Remote (Loan domain)
- apps/insurance-mfe: Remote (Insurance domain)
- packages/ui-kit: Design System
- packages/shared-utils: Events & utils
- packages/api-clients: HTTP client (axios)
- packages/config: Typed config from env
