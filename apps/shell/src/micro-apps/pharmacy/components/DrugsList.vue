<template>
  <div class="drugs-list">
    <div class="filters">
      <CInput v-model="searchQuery" placeholder="Search drugs..." class="search-input" />
      <CButton variant="secondary" @click="exportData">Export to Excel</CButton>
    </div>
    <CTable :columns="columns" :data="filteredDrugs" :loading="isLoading" @sort="handleSort">
      <template #actions="{ row }">
        <div class="table-actions">
          <button class="action-btn" @click="editDrug(row)">Edit</button>
          <button class="action-btn action-btn--danger" @click="deleteDrug(row)">Delete</button>
        </div>
      </template>
    </CTable>
    <div class="pagination">
      <span>Showing {{ paginationInfo }}</span>
      <div class="pagination-controls">
        <button @click="prevPage" :disabled="!pagination.hasPrev">Previous</button>
        <span>Page {{ pagination.page }} of {{ pagination.totalPages }}</span>
        <button @click="nextPage" :disabled="!pagination.hasNext">Next</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { CInput, CButton, CTable } from '@company/ui'
import { useApi } from '@company/api'
import { usePagination, useDebounce, useLoading } from '@company/shared/composables'
import { formatters } from '@company/shared/utils'

interface Drug {
  id: string
  code: string
  name: string
  genericName: string
  brand: string
  category: string
  stock: number
  price: number
  expiryDate: string
  supplier: string
}

const api = useApi()
const { isLoading, execute } = useLoading()
const pagination = usePagination(1, 20)

const drugs = ref<Drug[]>([])
const searchQuery = ref('')
const debouncedSearch = useDebounce(searchQuery, 300)

const columns = [
  { key: 'code', label: 'Code', sortable: true },
  { key: 'name', label: 'Drug Name', sortable: true },
  { key: 'genericName', label: 'Generic Name' },
  { key: 'brand', label: 'Brand' },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'stock', label: 'Stock', sortable: true },
  { key: 'price', label: 'Price', format: (val: number) => formatters.currency(val) },
  { key: 'expiryDate', label: 'Expiry', format: (val: string) => formatters.date(val) },
  { key: 'actions', label: 'Actions', slot: true }
]

const filteredDrugs = computed(() => {
  if (!debouncedSearch.value) return drugs.value
  const query = debouncedSearch.value.toLowerCase()
  return drugs.value.filter(drug =>
    drug.name.toLowerCase().includes(query) ||
    drug.code.toLowerCase().includes(query) ||
    drug.genericName.toLowerCase().includes(query) ||
    drug.brand.toLowerCase().includes(query)
  )
})

const paginationInfo = computed(() => {
  const start = (pagination.page.value - 1) * pagination.pageSize.value + 1
  const end = Math.min(pagination.page.value * pagination.pageSize.value, pagination.total.value)
  return `${start}-${end} of ${pagination.total.value} items`
})

async function loadDrugs() {
  await execute(
    api.get('/pharmacy/drugs', { params: { page: pagination.page.value, limit: pagination.pageSize.value } }).then(response => {
      drugs.value = response.data
      pagination.setTotal(response.total)
    })
  )
}

function handleSort(column: string, direction: 'asc' | 'desc') {
  console.log('Sort by', column, direction)
}

function editDrug(drug: Drug) {
  console.log('Edit drug:', drug)
}

async function deleteDrug(drug: Drug) {
  if (confirm(`Are you sure you want to delete ${drug.name}?`)) {
    await api.delete(`/pharmacy/drugs/${drug.id}`)
    await loadDrugs()
  }
}

function exportData() {
  console.log('Exporting data...')
}

function nextPage() { pagination.next(); loadDrugs() }
function prevPage() { pagination.prev(); loadDrugs() }

onMounted(() => { loadDrugs() })

// Mock data for testing

drugs.value = [
  { id: '1', code: 'D001', name: 'Aspirin', genericName: 'Acetylsalicylic acid', brand: 'Bayer', category: 'Analgesic', stock: 150, price: 25000, expiryDate: '2025-12-31', supplier: 'PharmaCo' },
  { id: '2', code: 'D002', name: 'Amoxicillin', genericName: 'Amoxicillin', brand: 'Generic', category: 'Antibiotic', stock: 80, price: 45000, expiryDate: '2024-10-15', supplier: 'MediSupply' },
  { id: '3', code: 'D003', name: 'Paracetamol', genericName: 'Acetaminophen', brand: 'Tylenol', category: 'Analgesic', stock: 200, price: 15000, expiryDate: '2025-06-30', supplier: 'PharmaCo' }
]
pagination.setTotal(3)
</script>
<style scoped>
.drugs-list { display: flex; flex-direction: column; gap: 1.5rem; }
.filters { display: flex; gap: 1rem; align-items: center; }
.search-input { flex: 1; max-width: 400px; }
.table-actions { display: flex; gap: 0.5rem; }
.action-btn { padding: 0.25rem 0.5rem; background: none; border: 1px solid #d1d5db; border-radius: 0.25rem; font-size: 0.875rem; cursor: pointer; }
.action-btn--danger { color: #dc2626; border-color: #dc2626; }
.action-btn--danger:hover { background: #fee2e2; }
.pagination { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; }
.pagination-controls { display: flex; gap: 1rem; align-items: center; }
.pagination-controls button { padding: 0.5rem 1rem; background: white; border: 1px solid #d1d5db; border-radius: 0.375rem; cursor: pointer; }
.pagination-controls button:hover:not(:disabled) { background: #f3f4f6; }
.pagination-controls button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
