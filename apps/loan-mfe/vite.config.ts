import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'loanMfe',
      filename: 'remoteEntry.js',
      exposes: {
        './routes': './src/features/loan/routes.ts',
        './LoanWidget': './src/features/loan/components/LoanWidget.vue'
      },
      shared: {
        vue: { singleton: true, strictVersion: true, requiredVersion: '^3.4.0' },
        pinia: { singleton: true, requiredVersion: '^2.1.0' },
        'vue-router': { singleton: true, requiredVersion: '^4.4.0' }
      }
    })
  ],
  build: { target: 'esnext', cssCodeSplit: true }
})
