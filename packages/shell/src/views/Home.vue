<template>
  <div class="p-4 space-y-4">
    <h1 class="text-2xl font-bold">Enterprise Portal</h1>
    <div class="flex gap-2">
      <RouterLink to="/" class="underline">Home</RouterLink>
      <RouterLink to="/customer" class="underline">Customer</RouterLink>
      <RouterLink to="/insurance" class="underline">Insurance</RouterLink>
      <RouterLink to="/loan" class="underline">Loan</RouterLink>
    </div>
    <component :is="ButtonTag" @click="count++">Clicked {{ count }} times</component>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
let ButtonTag: any = 'button'
try {
  const { BaseButton } = await import('@enterprise/ui-kit')
  ButtonTag = BaseButton ?? 'button'
} catch {}
const count = ref(0)
</script>
