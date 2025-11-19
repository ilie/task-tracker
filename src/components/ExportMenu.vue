<script setup>
import { ref } from 'vue'
import { Download, FileDown, FileJson, Copy, Check } from 'lucide-vue-next'
import { useExport } from '../composables/useExport'

const props = defineProps({
  tasks: Array
})

const { exportTasks, exportAsMarkdown, exportAsJSON, copyToClipboard } = useExport()

const isOpen = ref(false)
const copied = ref(false)

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function handleExportMarkdown() {
  exportTasks(props.tasks, 'markdown')
  isOpen.value = false
}

function handleExportJSON() {
  exportTasks(props.tasks, 'json')
  isOpen.value = false
}

async function handleCopyMarkdown() {
  const content = exportAsMarkdown(props.tasks)
  const success = await copyToClipboard(content)
  if (success) {
    copied.value = true
    setTimeout(() => {
      copied.value = false
      isOpen.value = false
    }, 1500)
  }
}

// Close menu when clicking outside
function handleClickOutside(event) {
  if (!event.target.closest('.export-menu')) {
    isOpen.value = false
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('click', handleClickOutside)
}
</script>

<template>
  <div class="relative export-menu">
    <button
      @click="toggleMenu"
      :disabled="!tasks || tasks.length === 0"
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download class="w-4 h-4" />
      <span class="hidden sm:inline">Export</span>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden z-50"
    >
      <button
        @click="handleExportMarkdown"
        class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-left"
      >
        <FileDown class="w-4 h-4" />
        <div class="flex-1">
          <div>Export as Markdown</div>
          <div class="text-xs text-gray-500 dark:text-slate-400">Download .md file</div>
        </div>
      </button>

      <button
        @click="handleExportJSON"
        class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-left border-t border-gray-100 dark:border-slate-700"
      >
        <FileJson class="w-4 h-4" />
        <div class="flex-1">
          <div>Export as JSON</div>
          <div class="text-xs text-gray-500 dark:text-slate-400">Download .json file</div>
        </div>
      </button>

      <button
        @click="handleCopyMarkdown"
        class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-left border-t border-gray-100 dark:border-slate-700"
      >
        <component :is="copied ? Check : Copy" class="w-4 h-4" :class="copied ? 'text-green-600' : ''" />
        <div class="flex-1">
          <div>{{ copied ? 'Copied!' : 'Copy to Clipboard' }}</div>
          <div class="text-xs text-gray-500 dark:text-slate-400">Copy as markdown</div>
        </div>
      </button>
    </div>
  </div>
</template>
