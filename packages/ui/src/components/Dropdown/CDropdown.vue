<template>
  <div class="c-dropdown" @click.outside="open = false">
    <div @click="open = !open">
      <slot name="trigger" />
    </div>
    <div v-if="open" class="c-dropdown-menu">
      <slot name="content" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>
<style scoped>
.c-dropdown {
  position: relative;
}
.c-dropdown-menu {
  position: absolute;
  right: 0;
  z-index: 50;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  margin-top: 0.5rem;
  min-width: 150px;
}
</style>
