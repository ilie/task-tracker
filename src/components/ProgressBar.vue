<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  showLabel: {
    type: Boolean,
    default: true
  }
})

const percentage = computed(() => {
  return props.total > 0 ? Math.round((props.current / props.total) * 100) : 0
})

const isComplete = computed(() => {
  return props.current === props.total && props.total > 0
})
</script>

<template>
  <div class="p-6 border-b border-gray-200 dark:border-slate-800">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-base font-semibold text-gray-900 dark:text-white">Progress</h2>
      <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ percentage }}%</span>
    </div>

    <div class="relative w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <div
        class="h-full bg-red-600 dark:bg-red-600 transition-all duration-700 ease-out"
        :style="{ width: percentage + '%' }"
      ></div>
    </div>

    <div v-if="showLabel" class="mt-4 flex items-center justify-between">
      <span class="text-sm text-gray-600 dark:text-gray-400">
        {{ current }} of {{ total }} tasks
      </span>
      <span
        v-if="isComplete"
        class="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-3 py-1 rounded-full"
      >
        Complete!
      </span>
    </div>
  </div>
</template>
