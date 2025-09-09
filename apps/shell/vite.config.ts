import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')

  return {
    plugins: [
      vue(),
      federation({
        name: 'shell',
        remotes: {
          pharmacy: env.VITE_PHARMACY_REMOTE || 'http://localhost:5174/assets/remoteEntry.js'
        },
        shared: {
          vue: { singleton: true, strictVersion: false },
          'vue-router': { singleton: true, strictVersion: false },
          pinia: { singleton: true, strictVersion: false }
        }
      })
    ],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
    },
    server: { port: 5173 },
    build: { target: 'esnext' }
  }
})
