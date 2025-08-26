import { ref, computed } from 'vue'
export function useLoanCalculator() {
  const amount = ref(1000)
  const duration = ref(12)
  const rate = ref(0.18)
  const monthlyPayment = computed(() => {
    const i = rate.value / 12
    const n = duration.value
    return Math.round(((amount.value * i) / (1 - Math.pow(1 + i, -n))) * 100) / 100
  })
  return { amount, duration, rate, monthlyPayment }
}
