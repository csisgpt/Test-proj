import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'customer',
      filename: 'remoteEntry.js',
      exposes: { './App': './src/App.vue' },
      shared: ['vue', 'pinia', 'vue-router']
    })
  ],
  server: { port: 5174 },
  build: { target: 'esnext' }
})
