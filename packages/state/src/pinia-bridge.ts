// پل کوچک برای دسترسی به Pinia خارج از setup()، مثلاً در سرویس‌ها/اینترسپتورها

import type { Pinia } from 'pinia'
import { setActivePinia } from 'pinia'

let _pinia: Pinia | null = null

export const setPinia = (p: Pinia) => {
  _pinia = p
}

export const getPinia = (): Pinia => {
  if (!_pinia) {
    throw new Error('[@company/state] Pinia instance is not set. Call setPinia(pinia) in Shell after createPinia().')
  }
  return _pinia
}

export const activatePinia = () => {
  if (!_pinia) {
    throw new Error('[@company/state] Pinia instance is not set. Call setPinia(pinia) first.')
  }
  setActivePinia(_pinia)
}
