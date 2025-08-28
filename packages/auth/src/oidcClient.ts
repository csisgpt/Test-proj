import { UserManager, WebStorageStateStore } from 'oidc-client-ts'

const cfg = {
  authority: import.meta.env.VITE_OIDC_AUTHORITY as string,
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID as string,
  redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI as string,
  silent_redirect_uri: import.meta.env.VITE_OIDC_SILENT_REDIRECT_URI as string,
  response_type: 'code',
  scope: import.meta.env.VITE_OIDC_SCOPES as string,
  automaticSilentRenew: true,
  loadUserInfo: true,
  userStore: new WebStorageStateStore({ store: window.sessionStorage })
}

export const userManager = new UserManager(cfg)

export async function signIn() {
  return userManager.signinRedirect()
}

export async function completeSignIn() {
  return userManager.signinRedirectCallback()
}

export async function signOut() {
  return userManager.signoutRedirect()
}

export async function getAccessToken(): Promise<string | null> {
  const user = await userManager.getUser()
  return user?.access_token ?? null
}

export async function silentRefresh() {
  return userManager.signinSilent()
}
