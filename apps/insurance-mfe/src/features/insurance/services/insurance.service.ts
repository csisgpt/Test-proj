export type Policy = { id: string; holder: string; status: 'ACTIVE' | 'EXPIRED' }
export const insuranceService = {
  async list(): Promise<Policy[]> {
    await new Promise((r) => setTimeout(r, 150))
    return [
      { id: 'P-9001', holder: 'Alice', status: 'ACTIVE' },
      { id: 'P-9002', holder: 'Bob', status: 'EXPIRED' }
    ]
  }
}
