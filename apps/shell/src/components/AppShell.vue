<template>
  <div>
    <header><strong>{{ title }}</strong></header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/loan">Loan</RouterLink>
      <RouterLink to="/ins">Insurance</RouterLink>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { getConfig } from '@portal/config'
const { APP_NAME } = getConfig()
const title = APP_NAME + ' (Shell)'
</script>
