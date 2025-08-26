export const LOAN_APPROVED = 'app/loan/approved' as const
export type LoanApprovedEvent = { loanId: string }
export function emitLoanApproved(detail: LoanApprovedEvent) {
  window.dispatchEvent(new CustomEvent(LOAN_APPROVED, { detail }))
}
export function onLoanApproved(cb: (d: LoanApprovedEvent) => void) {
  const handler = (e: Event) => cb((e as CustomEvent<LoanApprovedEvent>).detail)
  window.addEventListener(LOAN_APPROVED, handler)
  return () => window.removeEventListener(LOAN_APPROVED, handler)
}
