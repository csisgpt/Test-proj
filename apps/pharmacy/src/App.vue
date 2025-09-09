<template>
  <div class="pharmacy-app">
    <div class="debug">
      <p>
        <RouterLink to="/">Home</RouterLink> |
        <RouterLink to="/orders">Orders</RouterLink>
      </p>
    </div>

    <!-- اول بدون Suspense تست کن -->
    <RouterView class="animate__animated animate__fadeIn animate__faster" />
  </div>
</template>
<script setup lang="ts"></script>
