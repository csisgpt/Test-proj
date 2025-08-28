<template>
  <RouterView />
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@company/auth'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.checkAuth()
  window.addEventListener('auth:logout', handleLogout)
  window.addEventListener('api:error', handleApiError)
})

onUnmounted(() => {
  window.removeEventListener('auth:logout', handleLogout)
  window.removeEventListener('api:error', handleApiError)
})

function handleLogout() {
  authStore.logout()
}

function handleApiError(event: any) {
  console.error('API Error:', event.detail)
}
</script>
