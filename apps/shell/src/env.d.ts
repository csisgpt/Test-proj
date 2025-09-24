/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_OIDC_AUTHORITY?: string
  readonly VITE_OIDC_CLIENT_ID?: string
  readonly VITE_OIDC_REDIRECT_URI?: string
  readonly VITE_PHARMACY_REMOTE?: string
}
interface ImportMeta { readonly env: ImportMetaEnv }
