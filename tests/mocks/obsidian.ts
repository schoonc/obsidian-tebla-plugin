import { vi } from 'vitest'

export class Plugin {
  app: any
  manifest: any

  constructor(app: any, manifest: any) {
    this.app = app
    this.manifest = manifest
  }

  registerEvent = vi.fn()
  register = vi.fn()
  onload() {}
  onunload() {}
}

export class TextFileView {
  app: any
  data: string = ''
  contentEl: HTMLElement
  
  constructor(leaf: WorkspaceLeaf) {
    this.app = leaf.app
    this.contentEl = document.createElement('div')
  }

  getViewData(): string {
    return this.data
  }

  setViewData(data: string, _clear: boolean): void {
    this.data = data
  }

  clear(): void {}
  
  getViewType(): string {
    return ''
  }

  onload(): void {}
  onunload(): void {}
  requestSave(): void {}
}

export class WorkspaceLeaf {
  app: any
  view: any

  constructor(app?: any) {
    this.app = app
  }

  openFile = vi.fn()
  setViewState = vi.fn()
}

export class MarkdownView extends TextFileView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf)
  }
}

export class Notice {
  constructor(_message: string, _timeout?: number) {}
}

export function normalizePath(path: string): string {
  return path.replace(/\\/g, '/')
}

export interface TFile {
  path: string
  name?: string
}

export interface Vault {
  getAbstractFileByPath: (path: string) => TFile | null
  create: (path: string, content: string) => Promise<TFile>
}

export interface MetadataCache {
  on: (event: string, callback: Function) => any
  off: (event: string, callback: Function) => void
  getCache: (fileOrPath: TFile | string) => CachedMetadata | null
  getFileCache: (file: TFile) => CachedMetadata | null
}

export interface CachedMetadata {
  frontmatter?: Record<string, any>
}

export interface App {
  vault: Vault
  metadataCache: MetadataCache
  workspace: any
}

export interface PluginManifest {
  id: string
  name: string
  version: string
  minAppVersion?: string
  description?: string
  author?: string
  authorUrl?: string
  isDesktopOnly?: boolean
}