import { ref, computed, readonly } from 'vue'
import { defineStore } from 'pinia'
import jwt_decode from 'jwt-decode'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  nationalCode: string
  mobile: string
  roles: string[]
  permissions: string[]
  avatar?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
}

export interface LoginCredentials {
  username: string
  password: string
  captcha?: string
}

// Auth store using Pinia
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const tokens = ref<AuthTokens | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Getters
  const isAuthenticated = computed(() => !!tokens.value?.accessToken)
  const currentUser = computed(() => readonly(user.value))
  const userPermissions = computed(() => user.value?.permissions || [])
  const userRoles = computed(() => user.value?.roles || [])
  
  // Actions
  async function login(credentials: LoginCredentials): Promise<void> {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })
      
      if (!response.ok) {
        throw new Error('Authentication failed')
      }
      
      const data = await response.json()
      tokens.value = data.tokens
      user.value = data.user
      
      // Store tokens
      localStorage.setItem('access_token', data.tokens.accessToken)
      localStorage.setItem('refresh_token', data.tokens.refreshToken)
      
      // Setup token refresh
      scheduleTokenRefresh()
      
      // Emit login event
      window.dispatchEvent(new CustomEvent('auth:login', { detail: user.value }))
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  async function logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.value?.accessToken}`
        }
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear local state
      user.value = null
      tokens.value = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      
      // Emit logout event
      window.dispatchEvent(new CustomEvent('auth:logout'))
      
      // Redirect to login
      window.location.href = '/login'
    }
  }
  
  async function refreshAccessToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token')
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      })
      
      if (!response.ok) {
        throw new Error('Token refresh failed')
      }
      
      const data = await response.json()
      tokens.value = data.tokens
      localStorage.setItem('access_token', data.tokens.accessToken)
      
      scheduleTokenRefresh()
    } catch (err) {
      // Refresh failed, force re-login
      await logout()
      throw err
    }
  }
  
  async function checkAuth(): Promise<void> {
    const accessToken = localStorage.getItem('access_token')
    
    if (!accessToken) {
      return
    }
    
    try {
      // Validate token with backend
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        user.value = data.user
        tokens.value = {
          accessToken,
          refreshToken: localStorage.getItem('refresh_token') || '',
          expiresIn: 3600,
          tokenType: 'Bearer'
        }
        scheduleTokenRefresh()
      } else {
        await refreshAccessToken()
      }
    } catch (err) {
      console.error('Auth check failed:', err)
    }
  }
  
  function hasPermission(permission: string): boolean {
    return userPermissions.value.includes(permission)
  }
  
  function hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(p => userPermissions.value.includes(p))
  }
  
  function hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(p => userPermissions.value.includes(p))
  }
  
  function hasRole(role: string): boolean {
    return userRoles.value.includes(role)
  }
  
  function hasAnyRole(roles: string[]): boolean {
    return roles.some(r => userRoles.value.includes(r))
  }
  
  let refreshTimer: NodeJS.Timeout | null = null
  
  function scheduleTokenRefresh(): void {
    if (refreshTimer) {
      clearTimeout(refreshTimer)
    }
    
    if (!tokens.value?.accessToken) {
      return
    }
    
    try {
      const decoded = jwt_decode<{ exp: number }>(tokens.value.accessToken)
      const expiresIn = decoded.exp * 1000 - Date.now()
      const refreshIn = Math.max(0, expiresIn - 60000) // Refresh 1 minute before expiry
      
      refreshTimer = setTimeout(() => {
        refreshAccessToken().catch(console.error)
      }, refreshIn)
    } catch (err) {
      console.error('Failed to schedule token refresh:', err)
    }
  }
  
  // Initialize
  checkAuth()
  
  return {
    // State
    user: readonly(user),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Getters
    isAuthenticated,
    currentUser,
    userPermissions,
    userRoles,
    
    // Actions
    login,
    logout,
    refreshAccessToken,
    checkAuth,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole
  }
})

// Route guard composable
export function useAuthGuard() {
  const auth = useAuthStore()
  
  return {
    requireAuth: (to: any, from: any, next: any) => {
      if (auth.isAuthenticated) {
        next()
      } else {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      }
    },
    
    requirePermission: (permission: string) => {
      return (to: any, from: any, next: any) => {
        if (auth.hasPermission(permission)) {
          next()
        } else {
          next({ path: '/403' })
        }
      }
    },
    
    requireRole: (role: string) => {
      return (to: any, from: any, next: any) => {
        if (auth.hasRole(role)) {
          next()
        } else {
          next({ path: '/403' })
        }
      }
    }
  }
}
