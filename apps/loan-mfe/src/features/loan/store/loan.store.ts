import { defineStore } from 'pinia'
import type { Loan } from '../types/loan'
import { loanService } from '../services/loan.service'

export const useLoanStore = defineStore('loan', {
  state: () => ({ items: [] as Loan[], loading: false }),
  actions: {
    async fetchAll() {
      this.loading = true
      try {
        this.items = await loanService.list()
      } finally {
        this.loading = false
      }
    }
  }
})
