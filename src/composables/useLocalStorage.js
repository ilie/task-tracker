import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue = null) {
  const data = ref(defaultValue)
  const error = ref(null)

  // Load from localStorage on initialization
  function load() {
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        data.value = JSON.parse(stored)
        return true
      }
      return false
    } catch (e) {
      console.error(`Error loading from localStorage (${key}):`, e)
      error.value = e
      return false
    }
  }

  // Save to localStorage
  function save(value = data.value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      error.value = null
      return true
    } catch (e) {
      console.error(`Error saving to localStorage (${key}):`, e)
      error.value = e
      return false
    }
  }

  // Remove from localStorage
  function remove() {
    try {
      localStorage.removeItem(key)
      data.value = defaultValue
      error.value = null
      return true
    } catch (e) {
      console.error(`Error removing from localStorage (${key}):`, e)
      error.value = e
      return false
    }
  }

  // Auto-save on data change (optional)
  function enableAutoSave() {
    watch(data, (newValue) => {
      save(newValue)
    }, { deep: true })
  }

  // Load initial data
  load()

  return {
    data,
    error,
    load,
    save,
    remove,
    enableAutoSave
  }
}
