<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import TaskInput from './components/TaskInput.vue'
import MarkdownDisplay from './components/MarkdownDisplay.vue'
import TaskSidebar from './components/TaskSidebar.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import SearchBar from './components/SearchBar.vue'
import { useTheme } from './composables/useTheme'
import { useLocalStorage } from './composables/useLocalStorage'
import { useMarkdownParser } from './composables/useMarkdownParser'
import { useKeyboardShortcuts } from './composables/useKeyboardShortcuts'
import { useTaskFilter } from './composables/useTaskFilter'
import { STORAGE_KEYS } from './constants'

const { initTheme } = useTheme()
const { parseTasksFromMarkdown, renderMarkdown } = useMarkdownParser()

const markdownInput = ref('')
const tasks = ref([])
const collapsedSections = ref({})
const markdownHtml = ref('')
const isSidebarOpen = ref(false)
const searchBarRef = ref(null)
const sidebarWidth = ref(320) // Default width in pixels
const isResizing = ref(false)

// Use filter composable at App level
const {
  searchQuery,
  filterStatus,
  filterSection,
  sections,
  filteredTasks,
  clearFilters
} = useTaskFilter(tasks)

// Setup localStorage with auto-save
const storage = useLocalStorage(STORAGE_KEYS.TASK_TRACKER, {
  markdown: '',
  tasks: [],
  collapsedSections: {}
})

// Keyboard shortcuts
useKeyboardShortcuts({
  'ctrl+k': () => {
    searchBarRef.value?.focus()
  },
  'ctrl+e': () => {
    // Export menu is already accessible in sidebar
    if (window.innerWidth < 1024) {
      isSidebarOpen.value = true
    }
  }
})

function loadMarkdown() {
  if (!markdownInput.value.trim()) {
    alert('Please enter some markdown content')
    return
  }

  tasks.value = parseTasksFromMarkdown(markdownInput.value)
  markdownHtml.value = renderMarkdown(markdownInput.value)
  saveToStorage()
}

function clearProgress() {
  if (confirm('Clear all task progress? The markdown content will be kept.')) {
    tasks.value.forEach((task) => {
      task.checked = false
    })
    saveToStorage()
  }
}

function clearAll() {
  if (confirm('Clear everything including markdown content and progress?')) {
    markdownInput.value = ''
    tasks.value = []
    collapsedSections.value = {}
    markdownHtml.value = ''
    storage.remove()
  }
}

function toggleSection(sectionName) {
  collapsedSections.value[sectionName] = !collapsedSections.value[sectionName]
  saveToStorage()
}

function onTaskToggle() {
  saveToStorage()
}

function saveToStorage() {
  storage.save({
    markdown: markdownInput.value,
    tasks: tasks.value,
    collapsedSections: collapsedSections.value,
  })
}

function loadFromStorage() {
  if (storage.data.value) {
    const data = storage.data.value
    if (data.markdown && data.tasks && data.tasks.length > 0) {
      markdownInput.value = data.markdown
      tasks.value = data.tasks
      collapsedSections.value = data.collapsedSections || {}
      markdownHtml.value = renderMarkdown(data.markdown)
    }
  }
}

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function closeSidebarOnMobile() {
  if (window.innerWidth < 1024) {
    isSidebarOpen.value = false
  }
}

// Sidebar resize handlers
function startResize(event) {
  isResizing.value = true
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}

function handleResize(event) {
  if (!isResizing.value) return

  const newWidth = window.innerWidth - event.clientX
  // Min width: 280px, Max width: 600px
  if (newWidth >= 280 && newWidth <= 600) {
    sidebarWidth.value = newWidth
  }
}

function stopResize() {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

function resetSidebarWidth() {
  sidebarWidth.value = 320 // Reset to default
}

onMounted(() => {
  initTheme()
  loadFromStorage()
})

// Watch for changes to auto-save
watch([tasks, collapsedSections], () => {
  saveToStorage()
}, { deep: true })
</script>

<template>
  <div class="h-full flex flex-col bg-white dark:bg-black transition-colors overflow-x-hidden">
    <!-- Top App Bar -->
    <header
      class="flex-none h-14 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 px-4 sm:px-6 flex items-center gap-4 z-20 overflow-visible"
    >
      <div class="flex items-center gap-2 sm:gap-3 shrink-0">
        <!-- Mobile Menu Button -->
        <button
          @click="toggleSidebar"
          class="lg:hidden p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <component :is="isSidebarOpen ? X : Menu" class="w-5 h-5" />
        </button>

        <h1 class="text-sm font-semibold text-gray-900 dark:text-slate-100 whitespace-nowrap">Task Tracker</h1>
      </div>

      <!-- Search Bar (centered, like Laravel docs) -->
      <div class="flex-1 max-w-md mx-auto">
        <SearchBar ref="searchBarRef" v-model="searchQuery" />
      </div>

      <div class="shrink-0 relative overflow-visible">
        <ThemeToggle />
      </div>
    </header>

    <!-- Main Content Area -->
    <div class="flex-1 flex min-h-0 relative">
      <!-- Left Content Area -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 bg-white dark:bg-black">
        <TaskInput
          v-model="markdownInput"
          @load="loadMarkdown"
          @clear-progress="clearProgress"
          @clear-all="clearAll"
        />

        <MarkdownDisplay
          :html="markdownHtml"
          :search-query="searchQuery"
          :filtered-tasks="filteredTasks"
          :all-tasks="tasks"
        />
      </main>

      <!-- Mobile Overlay -->
      <div
        v-if="isSidebarOpen"
        @click="closeSidebarOnMobile"
        class="fixed inset-0 bg-black/50 z-30 lg:hidden"
      ></div>

      <!-- Right Sidebar -->
      <aside
        :style="{ width: `${sidebarWidth}px` }"
        :class="[
          'flex-none bg-white dark:bg-slate-950 border-l border-gray-200 dark:border-slate-800 overflow-y-auto z-40 relative',
          'fixed lg:relative inset-y-14 right-0 lg:inset-y-0',
          'transition-transform duration-300 ease-in-out',
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        ]"
      >
        <!-- Resize Handle -->
        <div
          @mousedown="startResize"
          @dblclick="resetSidebarWidth"
          class="absolute left-0 top-0 bottom-0 w-0.5 hover:w-0.5 bg-transparent hover:bg-red-500 cursor-col-resize transition-all z-50 group"
          title="Double-click to reset width"
        >
          <div class="absolute left-0 top-0 bottom-0 w-4 -translate-x-1.5"></div>
        </div>

        <TaskSidebar
          :tasks="filteredTasks"
          :all-tasks="tasks"
          :collapsed-sections="collapsedSections"
          :filter-status="filterStatus"
          :filter-section="filterSection"
          :sections="sections"
          @toggle-task="onTaskToggle"
          @toggle-section="toggleSection"
          @update:filter-status="filterStatus = $event"
          @update:filter-section="filterSection = $event"
          @clear-filters="clearFilters"
        />
      </aside>
    </div>
  </div>
</template>
