<template>
    <div class="markdown-reading-view">
        <div class="markdown-preview-view markdown-rendered" style="padding: 0">
            <div class="markdown-preview-section">
                <div class="mod-header mod-ui"></div>
                <div ref="container" class="el-p" style="white-space-collapse: collapse;"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Component, MarkdownRenderer, type App as ObsidianApp } from 'obsidian';
import { inject, onBeforeUnmount, shallowRef, watchEffect } from 'vue';
const props = defineProps({
    modelValue: {
        type: String,
        required: true,
    }
})

const obsidianApp = inject<ObsidianApp>('obsidianApp')!
const container = shallowRef<HTMLElement>()
let component: Component | null = null

const clean = () => {
    component?.unload()
    container.value?.empty()
}

watchEffect(() => {
    clean()
    if (container.value) {
        component = new Component()
        MarkdownRenderer.render(obsidianApp, props.modelValue, container.value, '', component)
    }
})
onBeforeUnmount(clean)
</script>