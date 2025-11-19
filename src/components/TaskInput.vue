<script setup>
import { ref } from 'vue'
import { Sparkles, Upload, RotateCcw, Trash2 } from 'lucide-vue-next'
import Button from './Button.vue'
import CollapsibleSection from './CollapsibleSection.vue'
import DragDropTextarea from './DragDropTextarea.vue'
import { ACCEPTED_FILE_TYPES } from '../constants'

const props = defineProps({
  modelValue: String,
})

const emit = defineEmits(['update:modelValue', 'load', 'clearProgress', 'clearAll'])

const fileInputRef = ref(null)
const isCollapsed = ref(false)

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      emit('update:modelValue', e.target.result)
      emit('load')
      // Reset file input so the same file can be selected again
      event.target.value = ''
    }
    reader.readAsText(file)
  }
}

function handleFileLoaded(file) {
  emit('load')
}

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}

const placeholder = `Paste your markdown here or drag & drop a .md file...

Example:
## Step 1: Setup Environment
- [ ] Install dependencies
- [ ] Configure environment variables

## Step 2: Implement Features
- [ ] Create API endpoints
- [ ] Build user interface

## Testing Checklist
- [ ] Run unit tests
- [ ] Verify integration tests`
</script>

<template>
  <CollapsibleSection
    title="Input"
    :is-collapsed="isCollapsed"
    @toggle="toggleCollapse"
    class="mb-8"
  >
        <DragDropTextarea
          :model-value="modelValue"
          :placeholder="placeholder"
          :accept="ACCEPTED_FILE_TYPES"
          @update:model-value="$emit('update:modelValue', $event)"
          @file-loaded="handleFileLoaded"
        />

        <div class="flex gap-3 items-center justify-between flex-wrap">
          <div class="flex gap-3 items-center flex-wrap">
            <Button
              variant="primary"
              size="lg"
              :icon="Sparkles"
              @click="$emit('load')"
            >
              Load Tasks
            </Button>

            <Button
              as="label"
              variant="secondary"
              html-for="fileInput"
              :icon="Upload"
            >
              Upload File
            </Button>
            <input
              ref="fileInputRef"
              type="file"
              id="fileInput"
              accept=".md,.txt"
              @change="handleFileUpload"
              class="hidden"
            />
          </div>

          <div class="flex gap-2 items-center flex-wrap">
            <Button
              variant="secondary"
              :icon="RotateCcw"
              @click="$emit('clearProgress')"
            >
              Reset
            </Button>

            <Button
              variant="secondary"
              :icon="Trash2"
              @click="$emit('clearAll')"
            >
              Clear
            </Button>
          </div>
        </div>
  </CollapsibleSection>
</template>
