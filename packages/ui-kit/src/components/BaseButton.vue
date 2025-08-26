<template>
  <button class="base-button"><slot /></button>
</template>
<style scoped>
.base-button {
  border-radius: var(--radius);
  padding: var(--pad) 14px;
  border: none; cursor: pointer;
}
</style>
