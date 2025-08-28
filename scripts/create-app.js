#!/usr/bin/env node
const fs = require('fs').promises
const path = require('path')
const { execSync } = require('child_process')

async function createApp() {
  const appName = process.argv[2]
  if (!appName) {
    console.error('Please provide an app name')
    process.exit(1)
  }
  const appPath = path.join(__dirname, '..', 'apps', appName)
  try {
    await fs.access(appPath)
    console.error(`App ${appName} already exists`)
    process.exit(1)
  } catch {}
  console.log(`Creating new app: ${appName}`)
  const dirs = ['src/components','src/views','src/stores','src/composables','src/assets','src/styles']
  for (const dir of dirs) { await fs.mkdir(path.join(appPath, dir), { recursive: true }) }
  const packageJson = {
    name: `@company/${appName}`,
    version: '1.0.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vue-tsc --noEmit && vite build',
      preview: 'vite preview',
      'type-check': 'vue-tsc --noEmit',
      lint: 'eslint src --ext .ts,.vue'
    },
    dependencies: {
      '@company/ui': 'workspace:*',
      '@company/api': 'workspace:*',
      '@company/auth': 'workspace:*',
      '@company/shared': 'workspace:*',
      vue: '^3.4.15',
      'vue-router': '^4.2.5',
      pinia: '^2.1.7'
    },
    devDependencies: {
      '@types/node': '^20.11.0',
      '@vitejs/plugin-vue': '^5.0.3',
      typescript: '^5.3.3',
      vite: '^5.0.11',
      'vue-tsc': '^1.8.27'
    }
  }
  await fs.writeFile(path.join(appPath, 'package.json'), JSON.stringify(packageJson, null, 2))
  const tsConfig = {
    extends: '../../tsconfig.json',
    compilerOptions: { baseUrl: '.', paths: { '@/*': ['./src/*'] } },
    include: ['src/**/*.ts', 'src/**/*.d.ts', 'src/**/*.tsx', 'src/**/*.vue'],
    references: [
      { path: '../../packages/ui' },
      { path: '../../packages/api' },
      { path: '../../packages/auth' },
      { path: '../../packages/shared' }
    ]
  }
  await fs.writeFile(path.join(appPath, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2))
  const viteConfig = `
import { createViteConfig } from '../../configs/vite/base.config'
import { fileURLToPath } from 'node:url'
export default createViteConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  port: ${3000 + Math.floor(Math.random() * 1000)}
})
`
  await fs.writeFile(path.join(appPath, 'vite.config.ts'), viteConfig.trim())
  const mainTs = `
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { installCompanyUI } from '@company/ui'
import '@company/ui/style'
const app = createApp(App)
app.use(createPinia())
app.use(installCompanyUI)
app.mount('#app')
`
  await fs.writeFile(path.join(appPath, 'src', 'main.ts'), mainTs.trim())
  const appVue = `
<template>
  <div class="${appName}-app">
    <h1>Welcome to ${appName}</h1>
    <CButton @click="count++">Count: {{ count }}</CButton>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { CButton } from '@company/ui'
const count = ref(0)
</script>
<style scoped>
.${appName}-app { padding: 2rem; text-align: center; }
</style>
`
  await fs.writeFile(path.join(appPath, 'src', 'App.vue'), appVue.trim())
  const indexHtml = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${appName} - Company Platform</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`
  await fs.writeFile(path.join(appPath, 'index.html'), indexHtml.trim())
  console.log('Installing dependencies...')
  execSync('pnpm install', { cwd: appPath, stdio: 'inherit' })
  console.log(`✅ App ${appName} created successfully!`)
  console.log(`\nTo start development:`)
  console.log(`  cd apps/${appName}`)
  console.log(`  pnpm dev`)
}
createApp().catch(console.error)
