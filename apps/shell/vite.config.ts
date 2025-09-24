// apps/shell/vite.config.ts
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
          pharmacy: {
            // فقط URL — بدون name@
            external: env.VITE_PHARMACY_REMOTE || 'http://localhost:5174/assets/remoteEntry.js',
            format: 'esm',   // چون ریموتت هم با Vite ساخته میشه
            from: 'vite',    // مهم: منبع ریموت Vite است، نه Webpack
          },
        },
        shared: {
          vue: { singleton: true, strictVersion: true, version: '3.4.15' },
          'vue-router': { singleton: true, strictVersion: true, version: '4.2.5' },
          pinia: { singleton: true, strictVersion: true, version: '2.1.7' },
        },
      }),
    ],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: { port: 5173 },
    build: { target: 'esnext' },
  }
})
