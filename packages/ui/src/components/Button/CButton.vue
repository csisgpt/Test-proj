<template>
  <button class="c-button"><slot /></button>
</template>
<script setup lang="ts"></script>
<style scoped>
.c-button {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: burlywood;
}
</style>
