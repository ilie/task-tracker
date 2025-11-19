import { onMounted, onUnmounted } from 'vue'

export function useKeyboardShortcuts(shortcuts) {
  function handleKeyDown(event) {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    const modifierKey = isMac ? event.metaKey : event.ctrlKey

    // Check for each registered shortcut
    Object.entries(shortcuts).forEach(([key, handler]) => {
      const parts = key.toLowerCase().split('+')
      const needsModifier = parts.includes('ctrl') || parts.includes('cmd')
      const needsShift = parts.includes('shift')
      const needsAlt = parts.includes('alt')
      const mainKey = parts[parts.length - 1]

      const modifierMatch = needsModifier ? modifierKey : true
      const shiftMatch = needsShift ? event.shiftKey : !event.shiftKey
      const altMatch = needsAlt ? event.altKey : !event.altKey
      const keyMatch = event.key.toLowerCase() === mainKey

      if (modifierMatch && shiftMatch && altMatch && keyMatch) {
        event.preventDefault()
        handler(event)
      }
    })
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })

  return {
    handleKeyDown
  }
}

export const SHORTCUTS = {
  SEARCH: 'Ctrl+K',
  EXPORT: 'Ctrl+E',
  HELP: 'Ctrl+/',
  UNDO: 'Ctrl+Z',
  REDO: 'Ctrl+Shift+Z'
}
