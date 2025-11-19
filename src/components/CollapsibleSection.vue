<script setup>
import { ChevronDown } from 'lucide-vue-next'
import Badge from './Badge.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  isCollapsed: {
    type: Boolean,
    default: false
  },
  badge: {
    type: String,
    default: null
  }
})

defineEmits(['toggle'])
</script>

<template>
  <div class="bg-white dark:bg-slate-900 border border-gray-100 hover:shadow-md dark:shadow-none dark:border dark:border-slate-800 rounded-md overflow-hidden transition-shadow">
    <button
      @click="$emit('toggle')"
      class="w-full px-6 py-4 border-b border-gray-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-colors text-left group"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <ChevronDown
            class="w-5 h-5 text-gray-400 dark:text-gray-400 transition-transform duration-300 shrink-0"
            :class="{ 'rotate-180': isCollapsed }"
          />
          <h2 class="text-gray-900 dark:text-white text-base font-medium">{{ title }}</h2>
        </div>
        <Badge v-if="badge">{{ badge }}</Badge>
      </div>
    </button>

    <div
      class="overflow-hidden transition-all duration-300 ease-in-out"
      :class="isCollapsed ? 'max-h-0' : 'max-h-[600px]'"
    >
      <div class="p-6 space-y-5">
        <slot />
      </div>
    </div>
  </div>
</template>
