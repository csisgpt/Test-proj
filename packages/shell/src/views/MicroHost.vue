<template>
  <div>
    <component v-if="Remote" :is="Remote" />
    <div v-else class="p-4">Loading remote...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const props = defineProps<{ remoteSpec: string }>()
const Remote = ref<any>(null)
onMounted(async () => {
  try {
    const mod = await import(/* @vite-ignore */ props.remoteSpec)
    // support default or named exports
    Remote.value = (mod as any).default || (mod as any).App || mod
  } catch (e) { console.error('Failed to load remote', props.remoteSpec, e) }
})
</script>
