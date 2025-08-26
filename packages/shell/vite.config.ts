import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'shell',
      remotes: {
        customer: 'http://localhost:5174/assets/remoteEntry.js',
        insurance: 'http://localhost:5175/assets/remoteEntry.js',
        loan: 'http://localhost:5176/assets/remoteEntry.js',
      },
      shared: ['vue', 'pinia', 'vue-router']
    })
  ],
  server: { port: 5173 },
  build: { target: 'esnext' }
})
