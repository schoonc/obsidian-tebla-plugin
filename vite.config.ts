import {resolve} from "path";
import vue from '@vitejs/plugin-vue'
import stringHash from 'string-hash'
import { defineConfig } from 'vite'
import {builtinModules} from 'node:module'

const fileNameToCssClassName = (fileName: string) => {
  /* example: <absolute-path>/src/plugins/readMate/app.vue?used&vue&type=style&index=0&lang.module.css */
  fileName = fileName.split('/').pop()! /* app.vue?used&vue&type=style&index=0&lang.module.css */
  fileName = fileName.replace(/\?.*$/, '') /* app.vue */
  fileName = fileName.replace(/\.[^.]*$/, '') /* app */
  fileName = fileName.replace(/[^a-z0-9]/gi, '-')
  fileName = fileName.toLowerCase()

  return fileName
}

const buildWatch = process.argv.includes('--watch') ? 
{
  allowInputInsideOutputPath: true
} : 
null

export default defineConfig({
  plugins: [
    vue(),
  ],
	css: {
      modules: {
        generateScopedName: (name, filename, css) => {
        /* https://github.com/madyankin/postcss-modules/blob/325f0b33f1b746eae7aa827504a5efd0949022ef/src/scoping.js#L36C5-L36C5 */
          const componentName = fileNameToCssClassName(filename)
          const i = css.indexOf(`.${name}`)
          const lineNumber = css.substr(0, i).split(/[\r\n]/).length
          const hash = stringHash(css).toString(36).substr(0, 5)

          return `tebla__${componentName}__${name}_${hash}_${lineNumber}`
        },
      },
    },
  build: {
		watch: buildWatch,
	  lib: {
		  entry: resolve(__dirname, './main.ts'),
      formats: ['cjs'], /* obsidian requires the plugin to be in cjs format. */
    },
	  rollupOptions: {
      output: {
        entryFileNames: 'main.js', /* obsidian requires a main.js file in the root of the plugin. */
        assetFileNames: 'styles.css', /* obsidian requires a styles.css file in the root of the plugin. */
      },
      external: [
        'obsidian', /* obsidian provides a dependency named obsidian in runtime, so you don't need to add it to the bundle. */
        "@codemirror/autocomplete",
        "@codemirror/collab",
        "@codemirror/commands",
        "@codemirror/language",
        "@codemirror/lint",
        "@codemirror/search",
        "@codemirror/state",
        "@codemirror/text",
        "@codemirror/view",
        "@lezer/common",
        "@lezer/lr",
        "@lezer/highlight",
        ...builtinModules
        /* see also https://github.com/obsidianmd/obsidian-sample-plugin/blob/7112f01bc6e20f4d6884c71aa2ecf8f6f1f8e3c7/esbuild.config.mjs#L20
            and app.js in the inspector */
      ],
    },
	  emptyOutDir: false,
    outDir: '.', /* obsidian requires styles.css and main.js files in the root of the plugin. */
  }
})