<template>
  <div ref="root" :class="$style['button']" />
</template>

<script setup lang="ts">
import { ButtonComponent } from 'obsidian'
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  buttonText: {
    required: false,
    type: String,
  },
  cta: {
    required: false,
    type: Boolean,
  },
  icon: {
    required: false,
    type: String,
  },
  tooltip: {
    required: false,
    type: String,
  }
})

const root = ref()
let oc: ButtonComponent | null = null

const updateButtonText = () => {
  if (props.buttonText) {
    oc?.setButtonText(props.buttonText)
  }
}
const updateCta = () => {
  props.cta ? oc?.setCta() : oc?.removeCta()
}
const updateIcon = () => {
  if (props.icon) {
    oc?.setIcon(props.icon)
  }
}
const updateTooltip = () => {
  if (props.tooltip) {
    oc?.setTooltip(props.tooltip)
  }
}

onMounted(() => {
  oc = new ButtonComponent(root.value)
  updateButtonText()
  updateCta()
  updateIcon()
  updateTooltip()
})
watch(() => {
  return props.buttonText
}, updateButtonText)
watch(() => {
  return props.cta
}, updateCta)
watch(() => {
  return props.icon
}, updateCta)
watch(() => {
  return props.tooltip
}, updateTooltip)
</script>

<style lang="scss" module>
.button {
  display: contents;
}
</style>
