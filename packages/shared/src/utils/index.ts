export const validators = {
  email: (value: string): boolean => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value)
  },
  mobile: (value: string): boolean => {
    const pattern = /^09\d{9}$/
    return pattern.test(value)
  },
  nationalCode: (value: string): boolean => {
    if (!/^\d{10}$/.test(value)) return false
    const check = parseInt(value[9])
    const sum = value
      .split('')
      .slice(0, 9)
      .reduce((acc, num, i) => acc + parseInt(num) * (10 - i), 0)
    const remainder = sum % 11
    return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder)
  },
  required: (value: any): boolean => {
    if (value === null || value === undefined || value === '') return false
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'object') return Object.keys(value).length > 0
    return true
  },
  minLength:
    (min: number) =>
    (value: string): boolean =>
      value.length >= min,
  maxLength:
    (max: number) =>
    (value: string): boolean =>
      value.length <= max,
  pattern:
    (pattern: RegExp) =>
    (value: string): boolean =>
      pattern.test(value),
}

export const formatters = {
  currency: (value: number, currency = 'IRR'): string => {
    return new Intl.NumberFormat('fa-IR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(value)
  },
  number: (value: number): string => new Intl.NumberFormat('fa-IR').format(value),
  date: (value: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const date = typeof value === 'string' ? new Date(value) : value
    return new Intl.DateTimeFormat('fa-IR', options).format(date)
  },
  phoneNumber: (value: string): string => {
    const cleaned = value.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{4})(\d{3})(\d{4})$/)
    return match ? `${match[1]}-${match[2]}-${match[3]}` : value
  },
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>
  return function (...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function generateConsole(data: any): void {
  console.log('here')
  console.log(data)
}
