<template>
  <MainLayout />
</template>

<script setup lang="ts">
import MainLayout from './layouts/MainLayout.vue'
import { onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@company/auth'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.checkAuth()
  window.addEventListener('auth:logout', handleLogout)
  window.addEventListener('api:error', handleApiError)

  // فقط در توسعه برای اسموک‌تست ریموت
})

onUnmounted(() => {
  window.removeEventListener('auth:logout', handleLogout)
  window.removeEventListener('api:error', handleApiError)
})

function handleLogout() {
  authStore.logout()
}

function handleApiError(e: Event) {
  const { detail } = e as CustomEvent<{ message?: string; code?: string }>
  console.error('API Error:', detail)
}
</script>
