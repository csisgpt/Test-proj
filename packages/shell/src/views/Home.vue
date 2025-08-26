<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Enterprise Portal</h1>
    <BaseButton @click="increment">Clicked {{ count }} times</BaseButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton } from '@enterprise/ui-kit'

const count = ref(0)
const increment = () => count.value++
</script>
