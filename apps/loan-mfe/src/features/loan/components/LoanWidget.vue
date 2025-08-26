<template>
  <section>
    <h2>Loan Widget (Remote)</h2>
    <button @click="store.fetchAll" :disabled="store.loading">
      {{ store.loading ? 'Loading...' : 'Load Loans' }}
    </button>
    <ul v-if="!store.loading && store.items.length">
      <li v-for="l in store.items" :key="l.id">
        <RouterLink :to="`/loan/${l.id}`">{{ l.id }}</RouterLink> — {{ l.amount }} — {{ l.status }}
      </li>
    </ul>

    <div style="margin-top:16px">
      <h3>Calculator</h3>
      <label>Amount <input type="number" v-model.number="amount" /></label>
      <label>Months <input type="number" v-model.number="duration" /></label>
      <p>Monthly Payment ≈ {{ monthlyPayment }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useLoanStore } from '../store/loan.store'
import { useLoanCalculator } from '../composables/useLoanCalculator'
const store = useLoanStore()
const { amount, duration, monthlyPayment } = useLoanCalculator()
</script>
