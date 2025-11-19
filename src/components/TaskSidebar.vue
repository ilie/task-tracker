<script setup>
import { ref, computed } from 'vue'
import { ChevronDown, BarChart3 } from 'lucide-vue-next'
import ProgressBar from './ProgressBar.vue'
import SectionHeader from './SectionHeader.vue'
import TaskItem from './TaskItem.vue'
import FilterBar from './FilterBar.vue'
import StatisticsPanel from './StatisticsPanel.vue'
import ExportMenu from './ExportMenu.vue'

const props = defineProps({
  tasks: Array,
  allTasks: Array,
  collapsedSections: Object,
  filterStatus: String,
  filterSection: String,
  sections: Array
})

const emit = defineEmits([
  'toggleTask',
  'toggleSection',
  'update:filterStatus',
  'update:filterSection',
  'clearFilters'
])

const showStats = ref(false)

const groupedTasks = computed(() => {
  const sectionsMap = {}
  props.tasks.forEach(task => {
    if (!sectionsMap[task.section]) {
      sectionsMap[task.section] = []
    }
    sectionsMap[task.section].push(task)
  })
  return sectionsMap
})

const totalCount = computed(() => props.tasks.length)
const completedCount = computed(() => props.tasks.filter(t => t.checked).length)

function getSectionBadge(section) {
  const completed = section.filter(t => t.checked).length
  const total = section.length
  return `${completed}/${total}`
}
</script>

<template>
  <div
    class="h-full flex flex-col"
  >
    <!-- Filters -->
    <div class="p-4 border-b border-gray-200 dark:border-slate-800">
      <FilterBar
        :status-filter="filterStatus"
        :section-filter="filterSection"
        :sections="sections"
        @update:status-filter="$emit('update:filterStatus', $event)"
        @update:section-filter="$emit('update:filterSection', $event)"
        @clear="$emit('clearFilters')"
      />
    </div>

    <!-- Progress -->
    <ProgressBar
      :current="completedCount"
      :total="totalCount"
    />

    <!-- Statistics Toggle & Export -->
    <div class="border-b border-gray-200 dark:border-slate-800 flex items-center">
      <button
        @click="showStats = !showStats"
        class="flex-1 px-6 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors"
      >
        <div class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
          <BarChart3 class="w-4 h-4" />
          Statistics
        </div>
        <ChevronDown
          class="w-4 h-4 text-gray-400 dark:text-slate-500 transition-transform duration-200"
          :class="{ 'rotate-180': showStats }"
        />
      </button>
      <div class="pr-4">
        <ExportMenu :tasks="allTasks" />
      </div>
    </div>

    <!-- Statistics Panel -->
    <div
      v-show="showStats"
      class="border-b border-gray-200 dark:border-slate-800"
    >
      <StatisticsPanel :tasks="allTasks" />
    </div>

    <!-- Tasks Section -->
    <div class="overflow-y-auto flex-1">
      <div v-if="tasks.length === 0" class="p-6 text-center text-gray-500 dark:text-slate-400 text-sm">
        No tasks found
      </div>

      <div
        v-for="(section, sectionName) in groupedTasks"
        :key="sectionName"
        class="border-b border-gray-100 dark:border-slate-800 last:border-b-0"
      >
        <SectionHeader
          :title="sectionName"
          :is-collapsed="collapsedSections[sectionName]"
          :badge="getSectionBadge(section)"
          @toggle="$emit('toggleSection', sectionName)"
        />

        <ul v-show="!collapsedSections[sectionName]" class="pb-2">
          <TaskItem
            v-for="task in section"
            :key="task.id"
            :task="task"
            v-model:checked="task.checked"
            @update:checked="$emit('toggleTask')"
          />
        </ul>
      </div>
    </div>
  </div>
</template>
