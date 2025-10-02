// packages/state/src/user.store.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export type UserProfile = {
  id: string
  name: string
  email?: string
  avatarUrl?: string
  roles: string[]
}

export type UserPrefs = {
  theme: 'light' | 'dark' | 'system'
  locale: string
}

export const useUserStore = defineStore(
  'user',
  () => {
    // state
    const test = ref<String>('mohammad')
    const profile = ref<UserProfile | null>(null)
    const prefs = ref<UserPrefs>({ theme: 'system', locale: 'fa-IR' })

    // getters
    const displayName = computed(() => profile.value?.name ?? 'Guest')
    const hasRole = (role: string) => !!profile.value?.roles?.includes(role)

    const testGetter = computed(() => test.value)

    // actions
    function setProfile(p: UserProfile | null) {
      console.log(p)
      console.log('here why local storage')
      profile.value = p
    }

    function updatePrefs(partial: Partial<UserPrefs>) {
      prefs.value = { ...prefs.value, ...partial }
    }

    function clear() {
      profile.value = null
      prefs.value = { theme: 'system', locale: 'fa-IR' }
    }

    // اکشن تستی برای فچ کردن پروفایل (fake)
    async function fetchProfileDemo() {
      await new Promise((r) => setTimeout(r, 300))
      setProfile({
        id: 'u-42',
        name: 'Test User',
        email: 'test@example.com',
        avatarUrl: 'https://i.pravatar.cc/100?img=42',
        roles: ['admin', 'editor'],
      })
    }

    return {
      // state
      test,
      profile,
      prefs,
      // getters
      testGetter,
      displayName,
      hasRole,
      // actions
      setProfile,
      updatePrefs,
      clear,
      fetchProfileDemo,
    }
  }
  //   {
  //     // اگر میخوای فقط تنظیمات کاربر پابرجا بمونه (و نه پروفایل)
  //     persist: { key: 'user', paths: ['prefs'] },
  //   }
)
