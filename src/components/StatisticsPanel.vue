<script setup>
import { computed } from 'vue'
import { TrendingUp, CheckCircle2, Circle, Target } from 'lucide-vue-next'
import Badge from './Badge.vue'

const props = defineProps({
  tasks: Array
})

const stats = computed(() => {
  const total = props.tasks.length
  const completed = props.tasks.filter(t => t.checked).length
  const incomplete = total - completed
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  // Group by section
  const bySectionMap = {}
  props.tasks.forEach(task => {
    if (!bySectionMap[task.section]) {
      bySectionMap[task.section] = { total: 0, completed: 0 }
    }
    bySectionMap[task.section].total++
    if (task.checked) {
      bySectionMap[task.section].completed++
    }
  })

  const bySection = Object.entries(bySectionMap).map(([section, data]) => ({
    section,
    ...data,
    percentage: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
  }))

  return {
    total,
    completed,
    incomplete,
    percentage,
    bySection
  }
})
</script>

<template>
  <div v-if="tasks.length > 0" class="p-6 space-y-6">
    <!-- Overall Stats -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <CheckCircle2 class="w-4 h-4 text-green-600 dark:text-green-500" />
          <span class="text-xs text-gray-600 dark:text-slate-400 font-medium">Completed</span>
        </div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.completed }}</div>
      </div>

      <div class="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <Circle class="w-4 h-4 text-gray-400 dark:text-slate-500" />
          <span class="text-xs text-gray-600 dark:text-slate-400 font-medium">Remaining</span>
        </div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.incomplete }}</div>
      </div>
    </div>

    <!-- Completion Rate -->
    <div class="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/10 rounded-lg p-4">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <Target class="w-4 h-4 text-red-600 dark:text-red-400" />
          <span class="text-sm text-red-900 dark:text-red-300 font-semibold">Completion Rate</span>
        </div>
        <span class="text-2xl font-bold text-red-600 dark:text-red-400">{{ stats.percentage }}%</span>
      </div>
      <div class="h-2 bg-red-200 dark:bg-red-900/30 rounded-full overflow-hidden">
        <div
          class="h-full bg-red-600 dark:bg-red-500 transition-all duration-500"
          :style="{ width: stats.percentage + '%' }"
        ></div>
      </div>
    </div>

    <!-- By Section -->
    <div v-if="stats.bySection.length > 1" class="space-y-3">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <TrendingUp class="w-4 h-4" />
        By Section
      </h3>
      <div class="space-y-2">
        <div
          v-for="section in stats.bySection"
          :key="section.section"
          class="flex items-center justify-between text-sm"
        >
          <span class="text-gray-700 dark:text-slate-300 truncate flex-1">{{ section.section }}</span>
          <div class="flex items-center gap-2">
            <Badge>{{ section.completed }}/{{ section.total }}</Badge>
            <span class="text-xs text-gray-500 dark:text-slate-400 w-10 text-right">{{ section.percentage }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
