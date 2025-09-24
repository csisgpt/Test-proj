<script setup>
import { ref } from 'vue'
import { generateConsole } from '@company/shared'
const data = ref([
  {
    id: 1,
    title: 'product 1',
    quantity: 3,
  },
  {
    id: 2,
    title: 'product 2',
    quantity: 3,
  },
  {
    id: 3,
    title: 'product 3',
    quantity: 3,
  },
  {
    id: 4,
    title: 'product 4',
    quantity: 3,
  },
])

const test = () => {
  generateConsole('dasdsadasd')
}
</script>

<template>
  <div style="display: flex; gap: 10px">
    <h4>Orders</h4>
    <div
      style="border: 1px solid royalblue; border-radius: 8px; margin-top: 40px"
      v-for="(item, i) in data"
    >
      {{ item.title }} - {{ item.quantity + 'عدد' }}
    </div>

    <div style="margin-top: 40px">
      <CButton @click="test"> کلیک کن </CButton>
    </div>
  </div>
</template>
