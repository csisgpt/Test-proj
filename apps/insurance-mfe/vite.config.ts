import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'insuranceMfe',
      filename: 'remoteEntry.js',
      exposes: {
        './routes': './src/features/insurance/routes.ts',
        './InsuranceWidget': './src/features/insurance/components/InsuranceWidget.vue'
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
