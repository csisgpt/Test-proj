<template>
  <div class="c-avatar">
    <img v-if="src" :src="src" alt="" />
    <span v-else>{{ initials }}</span>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ name?: string; src?: string }>()
const initials = computed(() => (props.name ? props.name.charAt(0) : '?'))
</script>
<style scoped>
.c-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.c-avatar img { width: 100%; height: 100%; object-fit: cover; }
</style>
