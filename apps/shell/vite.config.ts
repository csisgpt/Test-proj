import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      remotes: {
        pharmacy: process.env.VITE_PHARMACY_REMOTE as string
      },
      shared: {
        vue: { singleton: true, strictVersion: false },
        'vue-router': { singleton: true, strictVersion: false },
        pinia: { singleton: true, strictVersion: false }
      }
    })
  ],
  build: { target: 'esnext' }
})
