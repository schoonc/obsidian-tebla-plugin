<template>
  <div ref="root" :class="$style['textarea']" />
</template>

<script setup lang="ts">
import { TextAreaComponent } from 'obsidian'
import { onMounted, onUpdated, ref, useAttrs, watch } from 'vue'

defineOptions({
  inheritAttrs: false
})

const attrs = useAttrs()

const props = defineProps({
  modelValue: {
    required: false,
    type: String,
    default () {
      return ''
    }
  },
  placeholder: {
    required: false,
    type: String,
    default () {
      return ''
    }
  },
  rows: {
    required: false,
    type: [String, Number],
  }
})
const emit = defineEmits(['update:model-value'])


const root = ref()
let oc: TextAreaComponent | null = null
let prevAppliedAttrs = null

const updateAttrs = () => {
  if (!oc) {
    return
  }
  if (prevAppliedAttrs) {
    for (const [key, value] of Object.entries(prevAppliedAttrs)) {
      oc.inputEl.removeAttribute(key)
    }
  }
  for (const [key, value] of Object.entries(attrs)) {
      oc.inputEl.setAttribute(key, value)
  }
  prevAppliedAttrs = structuredClone(attrs)
}

const updatePlaceholder = () => {
  oc?.setPlaceholder(props.placeholder)
}

const updateValue = () => {
  oc?.setValue(props.modelValue)
}

onMounted(() => {
  oc = new TextAreaComponent(root.value)
  // updateAttrs()
  updatePlaceholder()
  updateValue()
  oc.onChange((value) => {
    emit('update:model-value', value)
  })
})
// onUpdated(updateAttrs)
watch(() => {
  return props.placeholder
}, updatePlaceholder)
watch(() => {
  return props.modelValue
}, updateValue)
</script>

<style lang="scss" module>
.textarea {
  display: contents;
}
</style>
