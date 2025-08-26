export interface Loan {
  id: string
  amount: number
  duration: number
  rate: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}
