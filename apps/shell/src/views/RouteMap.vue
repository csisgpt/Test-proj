<template>
  <div style="padding:1rem">
    <h2>Registered Routes</h2>
    <ul>
      <li v-for="r in flatRoutes" :key="r.name || r.path">
        <code>{{ r.path }}</code>
        <span v-if="r.name"> — {{ r.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const flatRoutes = computed(() => router.getRoutes().map(r => ({ name: r.name, path: r.path })))
</script>