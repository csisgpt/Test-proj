import { defineConfig, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

export interface CreateViteConfigOptions {
  root: string
  port?: number
  alias?: Record<string, string>
  legacy?: boolean
}

export function createViteConfig(options: CreateViteConfigOptions): UserConfig {
  const { root, port = 3000, alias = {}, legacy = false } = options

  return defineConfig({
    plugins: [
      vue({
        script: {
          defineModel: true,
          propsDestructure: true,
        },
      }),
    ],
    server: {
      port,
      host: true,
      fs: {
        allow: ['../..'],
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@company/ui': path.resolve(root, '../../packages/ui/src'),
        '@company/api': path.resolve(root, '../../packages/api/src'),
        '@company/auth': path.resolve(root, '../../packages/auth/src'),
        '@company/shared': path.resolve(root, '../../packages/shared/src'),
        ...alias,
      },
    },
    build: {
      target: legacy ? 'es2015' : 'es2020',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            if (id.includes('node_modules')) {
              if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
                return 'vue-vendor'
              }
              if (id.includes('@company/ui')) {
                return 'company-ui'
              }
              if (id.includes('axios')) {
                return 'api-vendor'
              }
              return 'vendor'
            }
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'axios'],
      exclude: ['@company/ui', '@company/api', '@company/auth', '@company/shared'],
    },
  })
}
