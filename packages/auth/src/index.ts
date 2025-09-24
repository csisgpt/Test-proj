import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useApi, type AuthTokens } from '@company/api'

export interface User {
  id: string
  username: string
  email: string
  name: string
  avatar?: string
  roles: string[]
  permissions: string[]
  metadata?: Record<string, any>
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface SSOConfig {
  provider: 'keycloak' | 'auth0' | 'azure' | 'custom'
  clientId: string
  realm?: string
  baseUrl: string
  redirectUri: string
  scope?: string
}

export const useAuthStore = defineStore('auth', () => {
  const api = useApi()
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const permissions = computed(() => user.value?.permissions || [])
  const roles = computed(() => user.value?.roles || [])

  const hasPermission = (permission: string): boolean => {
    return permissions.value.includes(permission)
  }

  const hasRole = (role: string): boolean => {
    return roles.value.includes(role)
  }

  const hasAnyPermission = (perms: string[]): boolean => {
    return perms.some((p) => hasPermission(p))
  }

  const hasAllPermissions = (perms: string[]): boolean => {
    return perms.every((p) => hasPermission(p))
  }

  async function login(credentials: LoginCredentials): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.post<{ user: User; tokens: AuthTokens }>(
        '/auth/login',
        credentials
      )
      user.value = response.user
      api.setTokens(response.tokens)
      localStorage.setItem('user', JSON.stringify(response.user))
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Login failed'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch (e) {
      console.error('Logout error:', e)
    } finally {
      user.value = null
      api.clearTokens()
      localStorage.removeItem('user')
    }
  }

  async function checkAuth(): Promise<void> {
    const tokens = api.getTokens()
    const storedUser = localStorage.getItem('user')

    if (tokens && storedUser) {
      try {
        user.value = JSON.parse(storedUser)
        await fetchUser()
      } catch (e) {
        await logout()
      }
    }
  }

  async function fetchUser(): Promise<void> {
    try {
      const response = await api.get<User>('/auth/me')
      user.value = response
      localStorage.setItem('user', JSON.stringify(response))
    } catch (e) {
      throw e
    }
  }

  async function updateProfile(data: Partial<User>): Promise<void> {
    try {
      const response = await api.put<User>('/auth/profile', data)
      user.value = response
      localStorage.setItem('user', JSON.stringify(response))
    } catch (e) {
      throw e
    }
  }

  function initSSO(config: SSOConfig): void {
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: config.scope || 'openid profile email',
    })

    if (config.realm) {
      params.append('realm', config.realm)
    }

    window.location.href = `${config.baseUrl}/auth?${params.toString()}`
  }

  async function handleSSOCallback(code: string): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.post<{ user: User; tokens: AuthTokens }>('/auth/sso/callback', {
        code,
      })
      user.value = response.user
      api.setTokens(response.tokens)
      localStorage.setItem('user', JSON.stringify(response.user))
    } catch (e: any) {
      error.value = e.response?.data?.message || 'SSO authentication failed'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    user: computed(() => user.value),
    isAuthenticated,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    permissions,
    roles,
    login,
    logout,
    checkAuth,
    fetchUser,
    updateProfile,
    initSSO,
    handleSSOCallback,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
  }
})

export function createAuthGuard(router: any) {
  router.beforeEach(async (to: any, _from: any, next: any) => {
    const authStore = useAuthStore()

    if (!authStore.user && !to.meta.public) {
      await authStore.checkAuth()
    }

    if (to.meta.public) {
      next()
      return
    }

    if (!authStore.isAuthenticated) {
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }

    if (to.meta.permissions) {
      const hasPermission = authStore.hasAnyPermission(to.meta.permissions)
      if (!hasPermission) {
        next({ name: 'forbidden' })
        return
      }
    }

    if (to.meta.roles) {
      const hasRole = to.meta.roles.some((role: string) => authStore.hasRole(role))
      if (!hasRole) {
        next({ name: 'forbidden' })
        return
      }
    }

    next()
  })
}

export * from './oidcClient'
