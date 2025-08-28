import { ref } from 'vue'

const theme = ref<'light' | 'dark'>('light')

export function useTheme() {
  function toggle() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }
  return { theme, toggle }
}
