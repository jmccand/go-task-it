<script setup lang="ts">
import type { TaskList } from '../types/tasktypes.js'

// get list options to add task to
const taskLists = ref<TaskList[]>([])
// @ts-expect-error missing type for chrome
taskLists.value = await chrome.runtime.sendMessage({
  type: 'getTaskLists',
}).then((response: any) => {
  return response.taskLists
})
if (Array.isArray(taskLists.value) && taskLists.value.length !== 0 && !taskLists.value[0]?.id) {
  console.error(taskLists.value)
}
</script>

<template>
  <div>
    <h1>Task Lists</h1>
    <div class="flex flex-row w-full flex-justify-center gap-col-sm">
      <div v-for="taskList in taskLists" :key="taskList.id">
        <div>{{ taskList.title }}</div>
      </div>
    </div>
  </div>
</template>
