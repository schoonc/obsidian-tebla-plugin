<template>
    <td dir="auto" :class="tdClass" @click="onTdClick">
        <MarkdownEditor v-if="mode === 'editor'" v-model="item[field]" :obsidianApp="obsidianApp" @blur="onEditorBlur" @escape="onEditorEscape" ref="editor"/>
        <MarkdownPreview v-else v-model="item[field]"/>
    </td>
</template>

<script lang="ts" setup>
import { type App as ObsidianApp } from 'obsidian';
import { computed, inject, nextTick, ref, shallowRef, useCssModule } from 'vue';
import MarkdownEditor from '../uiKit/editor/MarkdownEditor.vue';
import MarkdownPreview from './MarkdownPreview.vue';

const props = defineProps({
    maskable: {
        type: Boolean,
        required: false,
    },
    field: {
        type: String,
        required: true,
    },
    item: {
        type: Object,
        required: true,
    }
})

const $style = useCssModule()
const obsidianApp = inject<ObsidianApp>('obsidianApp')!
const editor = shallowRef()
const mode = ref((() => {
    if (props.maskable) {
        return props.item[props.field] ? 'masked' : 'regular'
    } else {
        return 'regular'
    }
})())

const tdClass = computed(() => {
    switch (mode.value) {
        case 'masked':
            return $style['masked']
        case 'regular':
            return $style['regular']
    }
})

const onTdClick = async () => {
    if (mode.value === 'masked') {
        mode.value = 'regular'
    } else if (mode.value === 'regular') {
        mode.value = 'editor'
        await nextTick()
        editor.value.focus()
    }
}
const onEditorBlur = () => {
    mode.value = 'regular'
}
const onEditorEscape = () => {
    editor.value.blur()
}
</script>

<style lang="scss" module>
.masked {
  filter: blur(0.5em);
  cursor: pointer;
}
.regular {
    cursor: text;
}
</style>