// apps/shell/vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { federation } from '@module-federation/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  // const env = loadEnv(mode, __dirname, '') // اگر لازم شد برای چیزهای دیگر
  return {
    plugins: [
      vue(),
      federation({
        name: 'shell',
        // ⬇️ remotes را نذار تا فقط runtime-config کنترل کند
        remotes: {},
        shared: {
          vue: { singleton: true },
          'vue-router': { singleton: true },
          pinia: { singleton: true },
          '@company/ui': { singleton: true },
          '@company/auth': { singleton: true },
          '@company/api': { singleton: true },
          '@company/shared': { singleton: false },
          '@company/state': { singleton: true },
        },
      }),
    ],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: { port: 5173 },
    build: { target: 'chrome89' },
  }
})
