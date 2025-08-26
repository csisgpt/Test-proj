import type { Loan } from '../types/loan'
export const loanService = {
  async list(): Promise<Loan[]> {
    // Mocked data for connectivity test
    await new Promise((r) => setTimeout(r, 200))
    return [
      { id: 'L-1001', amount: 5000, duration: 12, rate: 0.18, status: 'APPROVED' },
      { id: 'L-1002', amount: 12000, duration: 24, rate: 0.2, status: 'PENDING' }
    ]
  },
  async get(id: string): Promise<Loan> {
    const all = await this.list()
    const found = all.find((x) => x.id === id)!
    return found
  }
}
