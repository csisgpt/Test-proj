<template>
  <div class="main-layout">
    <header class="app-header" role="banner">
      {{ userTest.profile ?? 'asdasdassa' }}
      <div class="header-container">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 2rem">
          <button
            class="menu-toggle"
            :aria-expanded="sidebarOpen"
            aria-controls="app-sidebar"
            @click="sidebarOpen = !sidebarOpen"
            title="Toggle sidebar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div class="logo"><h1>Company Platform</h1></div>
        </div>

        <nav class="nav-menu" aria-label="Primary">
          <RouterLink
            v-for="item in mainSidebar"
            :key="item.path"
            :to="item.path"
            custom
            v-slot="{ href, navigate, isActive }"
          >
            <a
              :href="href"
              @click.prevent="navigate"
              class="nav-link"
              :class="{ 'nav-link--active': isActive }"
              :aria-current="isActive ? 'page' : undefined"
            >
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.label }}</span>
            </a>
          </RouterLink>
        </nav>

        <div class="header-end">
          <CDropdown>
            <template #trigger>
              <button class="user-menu-trigger">
                <CAvatar :name="user?.name" :src="user?.avatar" />
                <span class="user-name">{{ user?.name }}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
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

    <aside
      class="sidebar"
      :class="{ 'sidebar--open': sidebarOpen }"
      role="navigation"
      aria-label="Sidebar"
    >
      <nav class="sidebar-nav">
        <!-- گروه اصلی -->
        <div class="sidebar-group-title">Main</div>
        <RouterLink
          v-for="item in mainSidebar"
          :key="item.path"
          :to="item.path"
          custom
          v-slot="{ href, navigate, isActive }"
        >
          <a
            :href="href"
            @click.prevent="
              () => {
                navigate()
                sidebarOpen = false
              }
            "
            class="sidebar-link"
            :class="{ 'sidebar-link--active': isActive }"
            :aria-current="isActive ? 'page' : undefined"
          >
            <component :is="item.icon" v-if="item.icon" />
            <span>{{ item.label }}</span>
          </a>
        </RouterLink>

        <!-- گروه Pharmacy (فقط اگر آیتم دارد) -->
        <template v-if="pharmacySidebar.length">
          <div class="sidebar-group-title">Pharmacy</div>
          <RouterLink
            v-for="item in pharmacySidebar"
            :key="item.path"
            :to="item.path"
            custom
            v-slot="{ href, navigate, isActive }"
          >
            <a
              :href="href"
              @click.prevent="
                () => {
                  navigate()
                  sidebarOpen = false
                }
              "
              class="sidebar-link"
              :class="{ 'sidebar-link--active': isActive }"
              :aria-current="isActive ? 'page' : undefined"
            >
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.label }}</span>
            </a>
          </RouterLink>
        </template>
      </nav>
    </aside>

    <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false" />

    <main class="main-content" role="main">
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, type Router } from 'vue-router'
import { useAuthStore } from '@company/auth'
import { useUserStore } from '@company/state'

// اختیاری: آیکون‌ها را از کیت خودتان ایمپورت کنید
const IconDashboard = undefined as any
const IconReports = undefined as any
const IconUsers = undefined as any
const IconSettings = undefined as any
const userTest = useUserStore()
type SidebarItem = {
  path: string
  label: string
  icon?: any
  order?: number
  permission?: string
}

const router = useRouter()
const authStore = useAuthStore()
const sidebarOpen = ref(false)
const user = computed(() => authStore.user)

/** آیتم‌های ثابت (Main) */
const mainSidebar = computed<SidebarItem[]>(() => {
  const items: SidebarItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: IconDashboard },
    { path: '/reports', label: 'Reports', icon: IconReports },
    { path: '/users', label: 'Users', icon: IconUsers, permission: 'users.manage' },
    { path: '/settings', label: 'Settings', icon: IconSettings },
  ]
  return items.filter((i) => !i.permission || authStore.hasPermission(i.permission))
})

/** آیتم‌های داینامیک Pharmacy */
const pharmacySidebar = ref<SidebarItem[]>([])

/** جمع‌آوری روت‌های فرزندِ مستقیم /pharmacy از Router */
function collectPharmacyFromRouter(r: Router, base = '/pharmacy'): SidebarItem[] {
  const routes = r.getRoutes()
  const prefix = base.replace(/\/$/, '')
  const items: SidebarItem[] = []

  for (const rr of routes) {
    if (!rr.path.startsWith(prefix)) continue

    // فقط بچه‌ی مستقیم: /pharmacy  یا /pharmacy/xxx  (نه /pharmacy/a/b)
    const rest = rr.path.slice(prefix.length) // '' یا '/orders' یا '/a/b'
    if (rest && rest.split('/').filter(Boolean).length > 1) continue

    // پنهان‌کردن روت‌هایی که برای سایدبار نیستند
    if (rr.meta?.sidebar === false) continue

    // برچسب
    const label =
      (rr.meta as any)?.label ??
      (rr.meta as any)?.title ??
      humanize(rr.name?.toString() || rr.path.split('/').pop() || 'Item')

    const order = (rr.meta as any)?.order ?? 100
    const permission = (rr.meta as any)?.permission

    items.push({ path: rr.path, label, order, permission })
  }

  // فقط آیتم‌هایی که کاربر اجازه دارد
  const allowed = items.filter((i) => !i.permission || authStore.hasPermission(i.permission))

  // سورت بر اساس order
  allowed.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  return allowed
}

function humanize(s: string) {
  return s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/** همگام‌سازی Pharmacy بعد از mount ریموت یا روی بارگذاری اولیه */
function syncPharmacySidebar() {
  pharmacySidebar.value = collectPharmacyFromRouter(router, '/pharmacy')
}

// رویداد از Router: وقتی ریموت mount شد
function onPharmacyReady(_e: Event) {
  syncPharmacySidebar()
}

onMounted(() => {
  // بار اول هم اگر ریموت قبلاً mount شده بود، منو را بساز
  syncPharmacySidebar()
  // و به رویداد آماده‌شدن گوش بده
  window.addEventListener('mfe:pharmacy:ready', onPharmacyReady)
})

onBeforeUnmount(() => {
  window.removeEventListener('mfe:pharmacy:ready', onPharmacyReady)
})

async function logout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f9fafb;
}
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}
.header-container {
  max-width: 1920px;
  margin: 0 auto;
  padding: 0 1rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-menu {
  display: flex;
  gap: 0.5rem;
  flex: 1;
  justify-content: center;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: #4b5563;
  text-decoration: none;
  border-radius: 0.375rem;
  transition: all 0.2s;
}
.nav-link:hover {
  background: #f3f4f6;
  color: #111827;
}
.nav-link--active {
  background: #3b82f6;
  color: white;
}
.user-menu-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #4b5563;
  border-radius: 0.375rem;
}

.sidebar {
  position: fixed;
  left: -280px;
  top: 64px;
  bottom: 0;
  width: 280px;
  background: white;
  border-right: 1px solid #e5e7eb;
  transition: left 0.3s;
  z-index: 90;
  overflow-y: auto;
}
.sidebar--open {
  left: 0;
}
.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: #4b5563;
  text-decoration: none;
  transition: all 0.2s;
}
.sidebar-link:hover {
  background: #f3f4f6;
  color: #111827;
}
.sidebar-link--active {
  background: #eff6ff;
  color: #3b82f6;
  border-right: 3px solid #3b82f6;
}
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 80;
}

.main-content {
  flex: 1;
  max-width: 1920px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.sidebar-group-title {
  padding: 0.75rem 1.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
</style>
