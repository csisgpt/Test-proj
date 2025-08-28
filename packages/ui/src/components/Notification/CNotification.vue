<template>
  <div class="c-notifications">
    <div v-for="(n,index) in notifications" :key="index" class="c-notification">
      {{ n.message }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const notifications = ref<{ message: string }[]>([])
</script>
<style scoped>
.c-notifications {
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.c-notification {
  background: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}
</style>
