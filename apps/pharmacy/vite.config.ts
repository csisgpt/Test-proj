import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'pharmacy',
      filename: 'remoteEntry.js',
      exposes: {
        './routes': './src/remote/routes.ts', // دقیقا همین کلید
      },
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
