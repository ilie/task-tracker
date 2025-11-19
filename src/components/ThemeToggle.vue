<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-vue-next'
import { useTheme } from '../composables/useTheme'

const { theme, setTheme } = useTheme()
const isOpen = ref(false)
const dropdownRef = ref(null)

const themes = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' }
]

const currentTheme = computed(() => {
  return themes.find(t => t.value === theme.value) || themes[2]
})

function selectTheme(value) {
  setTheme(value)
  isOpen.value = false
}

function toggleDropdown(event) {
  event.stopPropagation()
  isOpen.value = !isOpen.value
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" class="relative theme-dropdown">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2.5 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-gray-700 dark:text-slate-200"
    >
      <component :is="currentTheme.icon" class="w-5 h-5 stroke-2" />
      <span class="text-sm font-medium">{{ currentTheme.label }}</span>
      <ChevronDown class="w-4 h-4 ml-1 transition-transform" :class="{ 'rotate-180': isOpen }" />
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden z-[100]"
    >
      <button
        v-for="{ value, icon, label } in themes"
        :key="value"
        @click="selectTheme(value)"
        :class="[
          'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left',
          theme.value === value
            ? 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-semibold'
            : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
        ]"
      >
        <component :is="icon" class="w-5 h-5 stroke-2" />
        <span>{{ label }}</span>
      </button>
    </div>
  </div>
</template>
