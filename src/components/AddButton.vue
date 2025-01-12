<script setup lang="ts">
import { ref } from 'vue'
import addicon from '~/assets/google-mui/add.svg'

const isClicked = ref(false)

function handleClick() {
  isClicked.value = !isClicked.value
}
</script>

<template>
  <div>
    <button @click="handleClick">
      <img :src="addicon">
      Create
    </button>
    <ul v-if="isClicked" class="menu">
      <li>New Task</li>
      <li>New List</li>
    </ul>
  </div>
</template>
