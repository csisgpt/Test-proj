<template>
  <table class="c-table">
    <thead>
      <tr>
        <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
        <th v-if="hasActions"><slot name="actions-header" /></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, i) in data" :key="row?.id ?? i">
        <td v-for="col in columns" :key="col.key">
          {{ row[col.key] }}
        </td>
        <td v-if="hasActions"><slot name="actions" :row="row" /></td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { useSlots, computed } from 'vue'

// ✅ فقط برای تایپ، variable نسازیم تا TS6133 نگیریم
defineProps<{
  columns: { key: string; label: string }[]
  data: Record<string, any>[]
}>()

const slots = useSlots()
// ✅ واکنشی و type-safe
const hasActions = computed(() => Boolean(slots.actions))
</script>

<style scoped>
.c-table {
  width: 100%;
  border-collapse: collapse;
}
.c-table th,
.c-table td {
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
}
</style>
