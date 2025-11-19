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
  <button
    @click="$emit('toggle')"
    class="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors text-left group"
  >
    <div class="flex items-center gap-3">
      <ChevronDown
        class="w-4 h-4 text-gray-400 dark:text-slate-500 transition-transform duration-200"
        :class="{ '-rotate-90': isCollapsed }"
      />
      <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ title }}</span>
    </div>
    <Badge v-if="badge">{{ badge }}</Badge>
  </button>
</template>
