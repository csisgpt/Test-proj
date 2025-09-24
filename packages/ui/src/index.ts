export { default as CButton } from './components/Button/CButton.vue'
export { default as CCard } from './components/Card/CCard.vue'
export { default as CInput } from './components/Input/CInput.vue'
export { default as CModal } from './components/Modal/CModal.vue'
export { default as CTable } from './components/Table/CTable.vue'
export { default as CLoading } from './components/Loading/CLoading.vue'
export { default as CDropdown } from './components/Dropdown/CDropdown.vue'
export { default as CAvatar } from './components/Avatar/CAvatar.vue'
export { default as CNotification } from './components/Notification/CNotification.vue'

export { useNotification } from './composables/useNotification'
export { useModal } from './composables/useModal'
export { useTheme } from './composables/useTheme'

export type * from './types'
import './style/index.css'    // ⬅️ این باعث میشه dist/style.css تولید بشه

import type { App } from 'vue'
import * as components from './components'

export function installCompanyUI(app: App) {
  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component as any)
  })
}

export default { install: installCompanyUI }
