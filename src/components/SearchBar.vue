<script setup>
import { ref } from 'vue'
import { Search, X } from 'lucide-vue-next'

const model = defineModel({ type: String, default: '' })
const inputRef = ref(null)

defineExpose({
  focus: () => inputRef.value?.focus()
})

function clear() {
  model.value = ''
  inputRef.value?.focus()
}
</script>

<template>
  <div class="relative">
    <div class="relative">
      <Search
        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500"
      />
      <input
        ref="inputRef"
        v-model="model"
        type="text"
        placeholder="Search tasks..."
        class="w-full pl-10 pr-10 py-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
      />
      <button
        v-if="model"
        @click="clear"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
