<template>
    <div ref="el"/>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { createEmbeddableMarkdownEditor, EmbeddableMarkdownEditor } from './markdownEditor';
const props = defineProps(['modelValue', 'obsidianApp'])
const emit = defineEmits([
	'update:modelValue',
	'blur',
	'escape'
])
watch(() => {
	return props.modelValue
}, (value) => {
	editor.set(value)
})
const el = ref()
let editor: EmbeddableMarkdownEditor
onMounted(() => {
	editor = createEmbeddableMarkdownEditor(props.obsidianApp, el.value , {
        value: props.modelValue,
		onChange (update) {
			emit('update:modelValue', editor.value)
		},
		onBlur (editor) {
			emit('blur')
		},
		onEscape () {
			emit('escape')
		}
    })
})
onBeforeUnmount(() => {
    editor.destroy()
})
defineExpose({
	focus: () => {
		editor.editor.editor.focus()
	},
	blur: () => {
		editor.editor.editor.blur()
	}
})
</script>