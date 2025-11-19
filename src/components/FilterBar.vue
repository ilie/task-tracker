<script setup>
import { Filter, X } from 'lucide-vue-next'

const props = defineProps({
  statusFilter: String,
  sectionFilter: String,
  sections: Array
})

const emit = defineEmits(['update:statusFilter', 'update:sectionFilter', 'clear'])

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'incomplete', label: 'Incomplete' },
  { value: 'completed', label: 'Completed' }
]
</script>

<template>
  <div class="flex gap-2">
    <!-- Status Filter -->
    <div class="relative">
      <Filter class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 pointer-events-none" />
      <select
        :value="statusFilter"
        @change="$emit('update:statusFilter', $event.target.value)"
        class="w-full pl-10 pr-9 py-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent text-gray-900 dark:text-white appearance-none cursor-pointer"
      >
        <option
          v-for="option in statusOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <button
        v-if="statusFilter !== 'all'"
        @click="$emit('update:statusFilter', 'all')"
        class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors"
        title="Clear status filter"
      >
        <X class="w-3.5 h-3.5 text-gray-500 dark:text-slate-400" />
      </button>
    </div>

    <!-- Section Filter -->
    <div class="relative">
      <select
        :value="sectionFilter"
        @change="$emit('update:sectionFilter', $event.target.value)"
        class="w-full pl-3 pr-9 py-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent text-gray-900 dark:text-white appearance-none cursor-pointer"
      >
        <option value="all">All Sections</option>
        <option
          v-for="section in sections"
          :key="section"
          :value="section"
        >
          {{ section }}
        </option>
      </select>
      <button
        v-if="sectionFilter !== 'all'"
        @click="$emit('update:sectionFilter', 'all')"
        class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors"
        title="Clear section filter"
      >
        <X class="w-3.5 h-3.5 text-gray-500 dark:text-slate-400" />
      </button>
    </div>
  </div>
</template>
