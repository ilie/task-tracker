<script setup>
import { ref } from 'vue'
import { Upload } from 'lucide-vue-next'

const props = defineProps({
  modelValue: String,
  placeholder: String,
  accept: {
    type: Array,
    default: () => ['.md', '.txt']
  }
})

const emit = defineEmits(['update:modelValue', 'file-loaded'])

const isDragging = ref(false)

function handleDragOver(event) {
  event.preventDefault()
  event.stopPropagation()
  isDragging.value = true
}

function handleDragLeave(event) {
  event.preventDefault()
  event.stopPropagation()
  isDragging.value = false
}

function handleDrop(event) {
  event.preventDefault()
  event.stopPropagation()
  isDragging.value = false

  const file = event.dataTransfer.files[0]
  if (file && isValidFile(file)) {
    processFile(file)
  } else {
    const extensions = props.accept.join(', ')
    alert(`Please drop a valid file (${extensions})`)
  }
}

function isValidFile(file) {
  const validTypes = ['text/markdown', 'text/plain']
  const hasValidType = validTypes.includes(file.type)
  const hasValidExtension = props.accept.some(ext => file.name.endsWith(ext))

  return hasValidType || hasValidExtension
}

function processFile(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    emit('update:modelValue', e.target.result)
    emit('file-loaded', file)
  }
  reader.readAsText(file)
}
</script>

<template>
  <div class="relative">
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      :class="[
        'w-full h-56 p-6 rounded-2xl font-mono text-sm resize-y focus:outline-none transition-all duration-200 text-gray-800 dark:text-white',
        isDragging
          ? 'border border-red-500 bg-red-50 dark:bg-red-950/30 ring-2 ring-red-500/20'
          : 'bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 focus:bg-white focus:shadow-md focus:ring-2 focus:ring-red-200 dark:focus:ring-red-500/20 border border-transparent'
      ]"
      :placeholder="placeholder"
    ></textarea>

    <div
      v-if="isDragging"
      class="absolute inset-0 flex flex-col items-center justify-center bg-red-50/95 dark:bg-red-950/95 rounded-xl pointer-events-none border-2 border-red-500 border-dashed"
    >
      <Upload class="w-12 h-12 text-red-500 mb-3" />
      <div class="text-red-600 dark:text-red-400 font-semibold text-lg">
        Drop your file here
      </div>
      <div class="text-red-500 dark:text-red-500 text-sm mt-1">
        We'll load it automatically
      </div>
    </div>
  </div>
</template>
