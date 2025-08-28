<template>
  <div v-if="modelValue" class="c-modal">
    <div class="c-modal-content">
      <header class="c-modal-header">
        <h3>{{ title }}</h3>
        <button @click="$emit('update:modelValue', false)">&times;</button>
      </header>
      <div class="c-modal-body"><slot /></div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ modelValue: boolean; title?: string }>()
defineEmits(['update:modelValue'])
</script>
<style scoped>
.c-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.c-modal-content {
  background: white;
  padding: 1rem;
  border-radius: 0.375rem;
  width: 400px;
  max-width: 90%;
}
.c-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
</style>
