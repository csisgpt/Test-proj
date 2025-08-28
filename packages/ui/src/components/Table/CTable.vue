<template>
  <table class="c-table">
    <thead>
      <tr>
        <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
        <th v-if="hasActions"><slot name="actions-header" /></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in data" :key="row.id">
        <td v-for="col in columns" :key="col.key">{{ row[col.key] }}</td>
        <td v-if="hasActions"><slot name="actions" :row="row" /></td>
      </tr>
    </tbody>
  </table>
</template>
<script setup lang="ts">
interface Column { key: string; label: string }
const props = defineProps<{ columns: Column[]; data: any[] }>()
const hasActions = !!useSlots().actions
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
