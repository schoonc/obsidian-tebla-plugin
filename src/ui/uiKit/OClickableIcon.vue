<template>
  <button class="clickable-icon" ref="icon"></button>
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
