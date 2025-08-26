import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'shell',
      remotes: {
        loanMfe: 'http://localhost:5174/assets/remoteEntry.js',
        insuranceMfe: 'http://localhost:5175/assets/remoteEntry.js'
      },
      shared: {
        vue: { singleton: true, strictVersion: true, requiredVersion: '^3.4.0' },
        pinia: { singleton: true, requiredVersion: '^2.1.0' },
        'vue-router': { singleton: true, requiredVersion: '^4.4.0' }
      }
    })
  ],
  build: {
    target: 'esnext',
    cssCodeSplit: true
  }
})
