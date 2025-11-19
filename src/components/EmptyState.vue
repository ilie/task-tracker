<script setup>
defineProps({
  icon: {
    type: [Object, Function],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: null
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-24 px-8 text-center">
    <div
      class="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6"
    >
      <component :is="icon" class="w-8 h-8 text-gray-400 dark:text-slate-500" />
    </div>
    <h3 class="text-gray-900 dark:text-white text-lg font-semibold mb-2">{{ title }}</h3>
    <p v-if="description" class="text-gray-600 dark:text-gray-400 text-sm max-w-md leading-relaxed">
      {{ description }}
    </p>
  </div>
</template>
