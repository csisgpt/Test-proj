<template>
  <article v-if="loan">
    <h3>Loan Detail: {{ loan.id }}</h3>
    <p>Amount: {{ loan.amount }}</p>
    <p>Duration: {{ loan.duration }} months</p>
    <p>Rate: {{ (loan.rate * 100).toFixed(1) }}%</p>
    <RouterLink to="/loan">Back</RouterLink>
  </article>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { loanService } from '../services/loan.service'
import type { Loan } from '../types/loan'
const route = useRoute()
const loan = ref<Loan | null>(null)
onMounted(async () => {
  loan.value = await loanService.get(route.params.id as string)
})
</script>
