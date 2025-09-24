// packages/shared/src/composables/index.ts
import { ref, computed, watch, onBeforeUnmount, type Ref, type ComputedRef } from 'vue'

/* ───────────────────────── useLoading ───────────────────────── */

export interface UseLoading {
  isLoading: Ref<boolean>
  error: Ref<Error | null>
  execute<T>(promise: Promise<T>): Promise<T | undefined>
}

export function useLoading(initialState = false): UseLoading {
  const isLoading = ref(initialState)
  const error = ref<Error | null>(null)

  async function execute<T>(promise: Promise<T>): Promise<T | undefined> {
    isLoading.value = true
    error.value = null
    try {
      const result = await promise
      return result
    } catch (e) {
      error.value = e as Error
      return undefined
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, execute }
}

/* ───────────────────────── useDebounce ───────────────────────── */

export function useDebounce<T>(value: Ref<T>, delay = 300): Ref<T> {
  const debounced = ref<T>(value.value) as Ref<T>
  let timeout: ReturnType<typeof setTimeout> | undefined

  const stop = watch(
    value,
    (newValue) => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        debounced.value = newValue
      }, delay)
    },
    { immediate: false }
  )

  onBeforeUnmount(() => {
    if (timeout) clearTimeout(timeout)
    stop()
  })

  return debounced
}

/* ───────────────────────── usePagination ───────────────────────── */

export interface Pagination {
  page: Ref<number>
  pageSize: Ref<number>
  total: Ref<number>
  totalPages: ComputedRef<number>
  offset: ComputedRef<number>
  hasNext: ComputedRef<boolean>
  hasPrev: ComputedRef<boolean>
  next(): void
  prev(): void
  setPage(p: number): void
  setTotal(t: number): void
  reset(): void
}

export function usePagination(initialPage = 1, initialSize = 10): Pagination {
  const page = ref(initialPage)
  const pageSize = ref(initialSize)
  const total = ref(0)

  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
  const offset = computed(() => (page.value - 1) * pageSize.value)
  const hasNext = computed(() => page.value < totalPages.value)
  const hasPrev = computed(() => page.value > 1)

  function next() {
    if (hasNext.value) page.value++
  }
  function prev() {
    if (hasPrev.value) page.value--
  }
  function setPage(p: number) {
    page.value = Math.min(Math.max(1, Math.trunc(p)), totalPages.value)
  }
  function setTotal(t: number) {
    total.value = Math.max(0, Math.trunc(t))
    if (page.value > totalPages.value) page.value = totalPages.value
  }
  function reset() {
    page.value = 1
    total.value = 0
  }

  return { page, pageSize, total, totalPages, offset, hasNext, hasPrev, next, prev, setPage, setTotal, reset }
}

/* ───────────────────────── useLocalStorage ─────────────────────────
   مهم: برای جلوگیری از خطای TS2742 (inferred type references @vue/shared)
   باید خروجی را صریح تایپ کنیم تا فقط از تایپ‌های عمومی استفاده شود.
──────────────────────────────────────────────────────────────────── */

export interface UseLocalStorageOptions<T> {
  storage?: Storage
  serializer?: (v: T) => string
  parser?: (s: string) => T
  deep?: boolean
}

export interface UseLocalStorageReturn<T> {
  data: Ref<T>
  remove(): void
}

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options: UseLocalStorageOptions<T> = {}
): UseLocalStorageReturn<T> {
  const storage = options.storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined)
  const parse = options.parser ?? ((s: string) => JSON.parse(s) as T)
  const serialize = options.serializer ?? ((v: T) => JSON.stringify(v))
  const deep = options.deep ?? true

  let initial = defaultValue
  if (storage) {
    try {
      const raw = storage.getItem(key)
      if (raw != null) initial = parse(raw)
    } catch {
      // ignore parse errors → fallback to defaultValue
    }
  }

  const data = ref<T>(initial) as Ref<T>

  const stop = watch(
    data,
    (newValue) => {
      if (!storage) return
      try {
        storage.setItem(key, serialize(newValue))
      } catch {
        // quota exceeded / security errors → ignore
      }
    },
    { deep }
  )

  onBeforeUnmount(() => stop())

  function remove(): void {
    if (storage) {
      try {
        storage.removeItem(key)
      } catch {
        // ignore
      }
    }
    data.value = defaultValue
  }

  return { data, remove }
}
