// apps/pharmacy/vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { federation } from '@module-federation/vite'

export default defineConfig(({ mode }) => ({
  server: {
    port: 5174,
    cors: true,
    origin: 'http://localhost:5174', // ⬅️ مهم
  },
  base: mode === 'development' ? 'http://localhost:5174/' : '/',
  plugins: [
    vue(),
    federation({
      name: 'pharmacy',
      manifest: true,
      filename: 'remoteEntry.js',
      exposes: { './routes': './src/remote/routes.ts' },
      shared: {
        vue: { singleton: true, requiredVersion: '^3.4.0' },
        'vue-router': { singleton: true, requiredVersion: '^4.2.0' },
        pinia: { singleton: true, requiredVersion: '^2.1.0' },
        '@company/ui': { singleton: true },
        '@company/auth': { singleton: true },
        '@company/api': { singleton: true },
        '@company/shared': { singleton: false },
        '@company/state': { singleton: true },
      },
    }),
  ],
  build: { target: 'chrome89' },
}))
