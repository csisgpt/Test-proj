import { ref, computed, watch, type Ref } from 'vue'

export function useLoading(initialState = false) {
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

export function useDebounce<T>(value: Ref<T>, delay = 300) {
  const debounced = ref<T>(value.value) as Ref<T>
  let timeout: ReturnType<typeof setTimeout>

  watch(value, (newValue) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      debounced.value = newValue
    }, delay)
  })

  return debounced
}

export function usePagination(initialPage = 1, initialSize = 10) {
  const page = ref(initialPage)
  const pageSize = ref(initialSize)
  const total = ref(0)

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
  const offset = computed(() => (page.value - 1) * pageSize.value)
  const hasNext = computed(() => page.value < totalPages.value)
  const hasPrev = computed(() => page.value > 1)

  function next() { if (hasNext.value) page.value++ }
  function prev() { if (hasPrev.value) page.value-- }
  function setPage(p: number) { page.value = Math.max(1, Math.min(p, totalPages.value)) }
  function setTotal(t: number) { total.value = t }
  function reset() { page.value = initialPage; total.value = 0 }

  return { page, pageSize, total, totalPages, offset, hasNext, hasPrev, next, prev, setPage, setTotal, reset }
}

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const storedValue = localStorage.getItem(key)
  const initial = storedValue ? JSON.parse(storedValue) : defaultValue
  const data = ref<T>(initial)

  watch(data, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, { deep: true })

  function remove() {
    localStorage.removeItem(key)
    data.value = defaultValue
  }

  return { data, remove }
}
