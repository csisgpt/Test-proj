import { createViteConfig } from '../../configs/vite/base.config'
import { fileURLToPath } from 'node:url'

export default createViteConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  port: 3000,
  legacy: true
})
