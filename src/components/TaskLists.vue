<script setup lang="ts">
import type { TaskList } from '../types/tasktypes.d.ts'

// get list options to add task to
const taskLists = ref<TaskList[]>([])
// @ts-expect-error missing type for chrome
taskLists.value = await chrome.runtime.sendMessage({
  type: 'getTaskLists',
}).then((response: any) => {
  return response.taskLists
})
</script>

<template>
  <div>
    <h1>Task Lists</h1>
    <div class="taskListsContainer">
      <div v-for="taskList in taskLists" :key="taskList.id">
        <div>{{ taskList.title }}</div>
      </div>
    </div>
  </div>
</template>
