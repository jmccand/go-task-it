<script setup lang="ts">
import menuicon from '~/assets/google-mui/menu.svg'
import logo from '~/assets/logo.svg'
</script>

<template>
  <!-- Left div -->
  <div>
    <div>
      <!-- needs onclick thing -->
      <img :src="menuicon" class="icon">
    </div>
    <div>
      <img :src="logo" class="icon">
    </div>
  </div>

  <!-- Middle div -->
  <div>
    space
  </div>

  <!-- Right div -->
</template>
