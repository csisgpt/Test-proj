import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'pharmacy',
      filename: 'remoteEntry.js', // مسیر صریح
      exposes: { './routes': './src/remote/routes.ts' },
      shared: {
        vue: { singleton: true, strictVersion: false },
        'vue-router': { singleton: true, strictVersion: false },
        pinia: { singleton: true, strictVersion: false },
      },
    }),
  ],
  server: { port: 5174, cors: true },
  build: { target: 'esnext' },
})
