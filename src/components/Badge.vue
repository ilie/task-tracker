<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'success', 'error', 'warning'].includes(value)
  }
})

const variantClasses = {
  default: 'text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800',
  success: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30',
  error: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30',
  warning: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30'
}
</script>

<template>
  <span
    :class="[
      'text-xs font-medium px-2.5 py-1 rounded-full',
      variantClasses[variant]
    ]"
  >
    <slot />
  </span>
</template>
