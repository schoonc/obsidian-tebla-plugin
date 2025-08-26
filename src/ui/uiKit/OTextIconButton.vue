<template>
  <div class="text-icon-button" tabindex="0">
    <div class="text-button-icon" ref="icon"></div>
    <div class="text-button-label"><slot/></div>
  </div>
</template>

<script setup lang="ts">
import { getIcon } from 'obsidian'
import { onMounted, shallowRef, watch } from 'vue';
const props = defineProps({
  icon: {
    type: String,
    required: true,
  }
})
const icon = shallowRef()

const updateIcon = () => {
  if (icon.value) {
    icon.value.empty()
    icon.value.appendChild(getIcon(props.icon))
  }
}

onMounted(() => {
  updateIcon()
})

watch(() => {
  return props.icon
}, updateIcon)
</script>
