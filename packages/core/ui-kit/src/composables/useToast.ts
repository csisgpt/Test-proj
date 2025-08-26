import { ref } from 'vue'

export function useToast() {
  const message = ref<string | null>(null)

  function show(msg: string, timeout = 3000) {
    message.value = msg
    setTimeout(() => (message.value = null), timeout)
  }

  return { message, show }
}
