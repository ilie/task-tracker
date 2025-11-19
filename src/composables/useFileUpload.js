import { ref } from 'vue'
import { ACCEPTED_FILE_TYPES, ACCEPTED_MIME_TYPES } from '../constants'

export function useFileUpload(options = {}) {
  const {
    acceptedTypes = ACCEPTED_FILE_TYPES,
    acceptedMimeTypes = ACCEPTED_MIME_TYPES,
    onSuccess = () => {},
    onError = () => {}
  } = options

  const isLoading = ref(false)
  const error = ref(null)

  function isValidFile(file) {
    const hasValidType = acceptedMimeTypes.includes(file.type)
    const hasValidExtension = acceptedTypes.some(ext => file.name.endsWith(ext))
    return hasValidType || hasValidExtension
  }

  function processFile(file) {
    if (!isValidFile(file)) {
      const extensions = acceptedTypes.join(', ')
      const errorMsg = `Invalid file type. Please upload a valid file (${extensions})`
      error.value = errorMsg
      onError(errorMsg)
      return
    }

    isLoading.value = true
    error.value = null

    const reader = new FileReader()

    reader.onload = (e) => {
      isLoading.value = false
      const content = e.target.result
      onSuccess(content, file)
    }

    reader.onerror = (e) => {
      isLoading.value = false
      const errorMsg = 'Error reading file'
      error.value = errorMsg
      onError(errorMsg, e)
    }

    reader.readAsText(file)
  }

  function handleFileInput(event) {
    const file = event.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  function handleFileDrop(event) {
    event.preventDefault()
    event.stopPropagation()

    const file = event.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }

  return {
    isLoading,
    error,
    processFile,
    handleFileInput,
    handleFileDrop,
    isValidFile
  }
}
