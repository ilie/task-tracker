<script setup>
import { computed } from 'vue'
import { Sun, Moon, Monitor } from 'lucide-vue-next'
import { useTheme } from '../composables/useTheme'

const { theme, setTheme } = useTheme()

const themes = [
  { value: 'light', icon: Sun, label: 'Light mode' },
  { value: 'dark', icon: Moon, label: 'Dark mode' },
  { value: 'system', icon: Monitor, label: 'System theme' }
]

const currentTheme = computed(() => {
  return themes.find(t => t.value === theme.value) || themes[2]
})

// Cycle through themes: light -> dark -> system -> light
function cycleTheme() {
  const currentIndex = themes.findIndex(t => t.value === theme.value)
  const nextIndex = (currentIndex + 1) % themes.length
  setTheme(themes[nextIndex].value)
}
</script>

<template>
  <button
    @click="cycleTheme"
    :title="currentTheme.label"
    :aria-label="currentTheme.label"
    class="p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
  >
    <component :is="currentTheme.icon" class="w-5 h-5 stroke-[1.5]" />
  </button>
</template>
