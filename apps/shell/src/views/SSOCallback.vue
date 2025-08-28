<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { completeSignIn } from '@company/auth'

const router = useRouter()
onMounted(async () => {
  try {
    await completeSignIn()
    router.replace('/')
  } catch (e) {
    console.error(e)
    router.replace('/auth/error')
  }
})
</script>

<template>
  <div>Completing sign-in...</div>
</template>
