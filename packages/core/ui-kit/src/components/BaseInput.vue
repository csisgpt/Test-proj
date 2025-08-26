<template>
  <input
    v-bind="attrs"
    :class="['border rounded px-3 py-2', fullWidth && 'w-full']"
    :value="modelValue"
    @input="onInput"
  />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'

export interface InputProps {
  modelValue?: string | number
  fullWidth?: boolean
}

const props = defineProps<InputProps>()
const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const fullWidth = props.fullWidth
const modelValue = props.modelValue
</script>
