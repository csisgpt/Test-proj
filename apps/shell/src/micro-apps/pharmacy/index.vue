<template>
  <div class="pharmacy-app">
    <div class="app-header">
      <h2>Pharmacy Management System</h2>
      <div class="header-actions">
        <CButton @click="showAddDrug = true">Add New Drug</CButton>
      </div>
    </div>
    <div class="app-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['tab', { 'tab--active': activeTab === tab.id }]"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="app-content">
      <component :is="activeComponent" />
    </div>
    <CModal v-model="showAddDrug" title="Add New Drug">
      <form @submit.prevent="handleAddDrug">
        <CInput v-model="newDrug.name" label="Drug Name" required />
        <CInput v-model="newDrug.code" label="Drug Code" required />
        <CInput v-model="newDrug.price" label="Price" type="number" required />
        <CInput v-model="newDrug.stock" label="Stock" type="number" required />
        <div class="modal-actions">
          <CButton type="submit">Add Drug</CButton>
          <CButton variant="secondary" @click="showAddDrug = false">Cancel</CButton>
        </div>
      </form>
    </CModal>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, shallowRef } from 'vue'
import { CButton, CModal, CInput } from '@company/ui'
import DrugsList from './components/DrugsList.vue'
import Prescriptions from './components/Prescriptions.vue'
import Orders from './components/Orders.vue'
import Reports from './components/Reports.vue'

const tabs = [
  { id: 'drugs', label: 'Drugs Management', component: DrugsList },
  { id: 'prescriptions', label: 'Prescriptions', component: Prescriptions },
  { id: 'orders', label: 'Orders', component: Orders },
  { id: 'reports', label: 'Reports', component: Reports }
]

const activeTab = ref('drugs')
const showAddDrug = ref(false)
const newDrug = ref({ name: '', code: '', price: 0, stock: 0 })

const activeComponent = computed(() => {
  const tab = tabs.find(t => t.id === activeTab.value)
  return tab ? shallowRef(tab.component) : null
})

async function handleAddDrug() {
  console.log('Adding drug:', newDrug.value)
  showAddDrug.value = false
  newDrug.value = { name: '', code: '', price: 0, stock: 0 }
}
</script>
<style scoped>
.pharmacy-app { display: flex; flex-direction: column; gap: 1.5rem; }
.app-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem; border-bottom: 1px solid #e5e7eb; }
.app-tabs { display: flex; gap: 0.5rem; border-bottom: 2px solid #e5e7eb; }
.tab { padding: 0.75rem 1.5rem; background: none; border: none; color: #6b7280; font-weight: 500; cursor: pointer; position: relative; }
.tab--active { color: #3b82f6; }
.tab--active::after { content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 2px; background: #3b82f6; }
.modal-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }
</style>
