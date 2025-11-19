<script setup>
import { computed } from 'vue'

const props = defineProps({
  as: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'label'].includes(value)
  },
  variant: {
    type: String,
    default: 'secondary',
    validator: (value) => ['primary', 'secondary'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  icon: {
    type: [Object, Function],
    default: null
  },
  iconPosition: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  },
  htmlFor: {
    type: String,
    default: null
  }
})

const buttonClasses = computed(() => {
  const baseClasses = 'group inline-flex items-center font-medium rounded-lg focus:outline-none transition-all'

  const variantClasses = {
    primary: 'bg-red-600 dark:bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-500 focus:ring-2 focus:ring-red-500/50 shadow-sm hover:shadow',
    secondary: 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
  }

  const sizeClasses = {
    sm: 'gap-2 px-3 py-1.5 text-xs',
    md: 'gap-2 px-4 py-2 text-sm',
    lg: 'gap-2 px-5 py-2.5 text-sm'
  }

  const disabledClasses = props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  const labelClasses = props.as === 'label' ? 'cursor-pointer' : ''

  return [
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
    disabledClasses,
    labelClasses
  ].join(' ')
})

const iconClasses = computed(() => {
  const sizeMap = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }
  return sizeMap[props.size]
})
</script>

<template>
  <component
    :is="as"
    :type="as === 'button' ? type : undefined"
    :for="as === 'label' ? htmlFor : undefined"
    :class="buttonClasses"
    :disabled="as === 'button' ? disabled : undefined"
  >
    <component v-if="icon && iconPosition === 'left'" :is="icon" :class="iconClasses" />
    <slot />
    <component v-if="icon && iconPosition === 'right'" :is="icon" :class="iconClasses" />
  </component>
</template>
