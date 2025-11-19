import { ref, computed } from 'vue'

export function useTaskFilter(tasks) {
  const searchQuery = ref('')
  const filterStatus = ref('all') // 'all', 'completed', 'incomplete'
  const filterSection = ref('all')

  const sections = computed(() => {
    const uniqueSections = new Set()
    tasks.value.forEach(task => {
      uniqueSections.add(task.section)
    })
    return Array.from(uniqueSections)
  })

  const filteredTasks = computed(() => {
    let filtered = tasks.value

    // Filter by search query
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(task =>
        task.text.toLowerCase().includes(query)
      )
    }

    // Filter by status
    if (filterStatus.value === 'completed') {
      filtered = filtered.filter(task => task.checked)
    } else if (filterStatus.value === 'incomplete') {
      filtered = filtered.filter(task => !task.checked)
    }

    // Filter by section
    if (filterSection.value !== 'all') {
      filtered = filtered.filter(task => task.section === filterSection.value)
    }

    return filtered
  })

  const stats = computed(() => {
    const total = tasks.value.length
    const completed = tasks.value.filter(t => t.checked).length
    const incomplete = total - completed

    return {
      total,
      completed,
      incomplete,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  })

  function clearFilters() {
    searchQuery.value = ''
    filterStatus.value = 'all'
    filterSection.value = 'all'
  }

  return {
    searchQuery,
    filterStatus,
    filterSection,
    sections,
    filteredTasks,
    stats,
    clearFilters
  }
}
