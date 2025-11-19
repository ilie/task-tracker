<script setup>
import { CheckCircle2, Circle } from 'lucide-vue-next'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:checked'])

const model = defineModel('checked', { type: Boolean })

function toggleTask() {
  model.value = !model.value
  emit('update:checked', model.value)
}
</script>

<template>
  <li
    class="group px-6 py-3 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer"
    @click="toggleTask"
  >
    <div class="mt-0.5 shrink-0">
      <input
        :id="'task-' + task.id"
        v-model="model"
        type="checkbox"
        class="sr-only peer"
        @click.stop
      />
      <label
        :for="'task-' + task.id"
        class="cursor-pointer block"
        @click.stop="toggleTask"
      >
        <CheckCircle2
          v-if="model"
          class="w-5 h-5 text-green-600 dark:text-green-500"
        />
        <Circle
          v-else
          class="w-5 h-5 text-gray-300 dark:text-slate-600 group-hover:text-gray-400 dark:group-hover:text-slate-500 transition-colors"
        />
      </label>
    </div>
    <span
      class="flex-1 text-sm leading-relaxed transition-all select-none"
      :class="[
        model ? 'line-through text-gray-400 dark:text-slate-500' : 'text-gray-700 dark:text-slate-300',
        task.isHeader ? 'font-semibold text-gray-900 dark:text-white' : ''
      ]"
    >
      {{ task.text }}
    </span>
  </li>
</template>
