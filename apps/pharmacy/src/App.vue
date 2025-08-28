<template>
  <div class="pharmacy-app">
    <h1>Welcome to Pharmacy App</h1>
    <CButton @click="count++">Count: {{ count }}</CButton>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { CButton } from '@company/ui'
const count = ref(0)
</script>
<style scoped>
.pharmacy-app { padding: 2rem; text-align: center; }
</style>
