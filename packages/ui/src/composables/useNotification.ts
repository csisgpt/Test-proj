import { ref } from 'vue'

interface Notification { message: string }

const notifications = ref<Notification[]>([])

export function useNotification() {
  function notify(message: string) {
    notifications.value.push({ message })
    setTimeout(() => notifications.value.shift(), 3000)
  }
  return { notifications, notify }
}
