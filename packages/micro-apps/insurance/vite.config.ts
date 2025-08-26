import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'insurance',
      filename: 'remoteEntry.js',
      exposes: { './App': './src/App.vue' },
      shared: ['vue', 'pinia', 'vue-router']
    })
  ],
  server: { port: 5175 },
  build: { target: 'esnext' }
})
