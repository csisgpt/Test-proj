// packages/state/src/auth.store.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export type AuthUser = { id: string; name: string }

export const useAuthStore = defineStore(
  'auth',
  () => {
    // state
    const user = ref<AuthUser | null>(null)
    const token = ref<string>('')

    // getters
    const isAuthenticated = computed(() => !!token.value)
    const bearer = computed(() => (token.value ? `Bearer ${token.value}` : ''))

    // actions
    function setUser(u: AuthUser | null) {
      user.value = u
    }

    function setToken(t: string) {
      token.value = t
    }

    function logout() {
      user.value = null
      token.value = ''
    }

    // نمونه‌ی لاگین تستی (fake)
    async function loginDemo() {
      // اینجا به‌جای API واقعی، یه دیلی می‌ذاریم
      await new Promise((r) => setTimeout(r, 300))
      setUser({ id: '1', name: 'Demo User' })
      setToken('demo-token-123')
    }

    return {
      // state
      user,
      token,
      // getters
      isAuthenticated,
      bearer,
      // actions
      setUser,
      setToken,
      logout,
      loginDemo,
    }
  },
//   {
//     // اگر pinia-plugin-persistedstate داری
//     persist: { key: 'auth', paths: ['token'] },
//   },
)
