<template>
  <section>
    <h2>Insurance Widget (Remote)</h2>
    <button @click="load" :disabled="loading">{{ loading ? 'Loading...' : 'Load Policies' }}</button>
    <ul v-if="!loading && items.length">
      <li v-for="p in items" :key="p.id">{{ p.id }} — {{ p.holder }} — {{ p.status }}</li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { insuranceService, type Policy } from '../services/insurance.service'
const items = ref<Policy[]>([])
const loading = ref(false)
async function load() {
  loading.value = true
  try {
    items.value = await insuranceService.list()
  } finally {
    loading.value = false
  }
}
</script>
