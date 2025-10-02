<script setup>
import { useAuthStore, useUserStore } from '@company/state'
import { onMounted } from 'vue'

const user = useUserStore()


async function testConnection() {
  await user.fetchProfileDemo()
}
</script>

<template>
  <div style="padding: 16px">
    <CButton @click="testConnection"> asdsadsa </CButton>

    <div style="margin-top: 12px">Pharmacy Home</div>
  </div>
</template>
