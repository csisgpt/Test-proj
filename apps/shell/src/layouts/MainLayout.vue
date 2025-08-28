<template>
  <div class="main-layout">
    <header class="app-header">
      <div class="header-container">
        <div class="header-start">
          <button class="menu-toggle" @click="sidebarOpen = !sidebarOpen">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div class="logo"><h1>Company Platform</h1></div>
        </div>
        <nav class="nav-menu">
          <RouterLink
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            active-class="nav-link--active"
          >
            <component :is="item.icon" v-if="item.icon" />
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>
        <div class="header-end">
          <CDropdown>
            <template #trigger>
              <button class="user-menu-trigger">
                <CAvatar :name="user?.name" :src="user?.avatar" />
                <span class="user-name">{{ user?.name }}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </template>
            <template #content>
              <div class="dropdown-menu">
                <RouterLink to="/profile" class="dropdown-item">Profile</RouterLink>
                <RouterLink to="/settings" class="dropdown-item">Settings</RouterLink>
                <hr class="dropdown-divider" />
                <button @click="logout" class="dropdown-item dropdown-item--danger">Logout</button>
              </div>
            </template>
          </CDropdown>
        </div>
      </div>
    </header>
    <aside class="sidebar" :class="{ 'sidebar--open': sidebarOpen }">
      <nav class="sidebar-nav">
        <RouterLink
          v-for="item in sidebarItems"
          :key="item.path"
          :to="item.path"
          class="sidebar-link"
          active-class="sidebar-link--active"
          @click="sidebarOpen = false"
        >
          <component :is="item.icon" v-if="item.icon" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
    </aside>
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false" />
    <main class="main-content">
      <RouterView v-slot="{ Component, route }">
        <Transition name="fade" mode="out-in">
          <Suspense>
            <component :is="Component" :key="route.path" />
            <template #fallback>
              <div class="loading-container"><CLoading /></div>
            </template>
          </Suspense>
        </Transition>
      </RouterView>
    </main>
    <CNotification />
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@company/auth'
import { CDropdown, CAvatar, CLoading, CNotification } from '@company/ui'

const router = useRouter()
const authStore = useAuthStore()
const sidebarOpen = ref(false)
const user = computed(() => authStore.user)

const navigationItems = computed(() => {
  const items = [
    { path: '/dashboard', label: 'Dashboard', icon: 'IconDashboard' },
    { path: '/pharmacy', label: 'Pharmacy', icon: 'IconPharmacy', permission: 'pharmacy.access' },
    { path: '/insurance', label: 'Insurance', icon: 'IconInsurance', permission: 'insurance.access' },
    { path: '/housing', label: 'Housing', icon: 'IconHousing', permission: 'housing.access' },
    { path: '/loan', label: 'Loan', icon: 'IconLoan', permission: 'loan.access' },
  ]
  return items.filter(item => !item.permission || authStore.hasPermission(item.permission))
})

const sidebarItems = computed(() => {
  return [
    ...navigationItems.value,
    { path: '/reports', label: 'Reports', icon: 'IconReports' },
    { path: '/users', label: 'Users', icon: 'IconUsers', permission: 'users.manage' },
    { path: '/settings', label: 'Settings', icon: 'IconSettings' },
  ].filter(item => !item.permission || authStore.hasPermission(item.permission))
})

async function logout() {
  await authStore.logout()
  router.push('/login')
}
</script>
<style scoped>
.main-layout { display: flex; flex-direction: column; min-height: 100vh; background: #f9fafb; }
.app-header { position: sticky; top: 0; z-index: 100; background: white; border-bottom: 1px solid #e5e7eb; }
.header-container { max-width: 1920px; margin: 0 auto; padding: 0 1rem; height: 64px; display: flex; align-items: center; justify-content: space-between; }
.nav-menu { display: flex; gap: 0.5rem; flex: 1; justify-content: center; }
.nav-link { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; color: #4b5563; text-decoration: none; border-radius: 0.375rem; transition: all 0.2s; }
.nav-link:hover { background: #f3f4f6; color: #111827; }
.nav-link--active { background: #3b82f6; color: white; }
.user-menu-trigger { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: none; border: none; cursor: pointer; color: #4b5563; border-radius: 0.375rem; }
.sidebar { position: fixed; left: -280px; top: 64px; bottom: 0; width: 280px; background: white; border-right: 1px solid #e5e7eb; transition: left 0.3s; z-index: 90; overflow-y: auto; }
.sidebar--open { left: 0; }
.sidebar-link { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.5rem; color: #4b5563; text-decoration: none; transition: all 0.2s; }
.sidebar-link--active { background: #eff6ff; color: #3b82f6; border-right: 3px solid #3b82f6; }
.sidebar-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); z-index: 80; }
.main-content { flex: 1; max-width: 1920px; width: 100%; margin: 0 auto; padding: 2rem; }
.loading-container { display: flex; align-items: center; justify-content: center; min-height: 400px; }
.fade-enter-active,.fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from,.fade-leave-to { opacity: 0; }
</style>
