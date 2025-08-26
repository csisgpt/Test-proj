<template>
  <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black/50">
    <div class="bg-white p-4 rounded shadow-lg">
      <slot />
      <button class="mt-2" @click="close">Close</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

export interface ModalProps {
  modelValue: boolean
}

const props = defineProps<ModalProps>()
const emit = defineEmits(['update:modelValue'])

const visible = ref(props.modelValue)
watch(() => props.modelValue, v => (visible.value = v))

const close = () => emit('update:modelValue', false)
</script>
