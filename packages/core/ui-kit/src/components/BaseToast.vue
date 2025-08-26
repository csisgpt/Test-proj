<template>
  <div v-if="visible" class="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(true)
</script>
