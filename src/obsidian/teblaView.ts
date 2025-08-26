import {
	Notice,
	TextFileView,
	WorkspaceLeaf
} from 'obsidian';
import { createApp, h, type App as VueApp } from 'vue';
import { StateRepositoryImpl } from '../data/stateRepository';
import { TEBLA_VIEW_TYPE } from '../domain/constants';
import { Store } from '../domain/store';
import App from "../ui/App.vue";
import type { StateRepository } from '../domain/interfaces';
import { FileDataSource } from '../data/fileDataSource';
import type { StoreRawState } from '../domain/schemaTypes';

class TeblaViewCore {
	teblaView: TeblaView
	fileDataSource: FileDataSource | null
	stateRepository: StateRepository | null
	store: Store | null
	vueApp: VueApp | null
	constructor (teblaView: TeblaView) {
		this.teblaView = teblaView
		this.fileDataSource = null
		this.stateRepository = null
		this.store = null
		this.vueApp = null
	}
	getViewData(): string {
		return this.teblaView.data
	}
	setViewData(data: string, clear: boolean): void {
		this.teblaView.data = data

		if (clear) {
			this.destroy()
		}

		if (this.fileDataSource) {
			try {
				this.fileDataSource.giveData(data)
			} catch(e) {
				this.destroy()
				console.error(e)
				const div = document.createElement('div')
				div.innerText = 'Could not load data from file'
				this.teblaView.contentEl.empty()
				this.teblaView.contentEl.appendChild(div)
				return
			}
		} else {
			this.fileDataSource = new FileDataSource()
			this.stateRepository = new StateRepositoryImpl(this.fileDataSource)
			this.store = new Store(FileDataSource.dataToState(data), this.stateRepository)
			this.store.on('noItem', () =>{
				new Notice('Card not found.');
			})
			this.fileDataSource.on('state', (state: StoreRawState) => {
				this.store?.setState(state)
			})
			this.fileDataSource.on('data', (data: string) => {
				this.teblaView.data = data
        		this.teblaView.requestSave()
			})
			this.store.init()
			this.vueApp = createApp({
				setup: () => {
					return () => {
						return h(App)
					}
				},
			})
			this.vueApp.provide('store', this.store)
			this.vueApp.provide('obsidianApp', this.teblaView.app)
			this.vueApp.mount(this.teblaView.contentEl)
		}
	}

	/* Called if data !== lastSavedData when saving data to file */
	clear(): void {
		/* In theory, this method is intended to clean up resources from the previous file. But it's called when saving view.data to file
		before closing the view or opening a new file in the view and ONLY if data !== lastSavedData. And this condition (data !== lastSavedData) 
		makes the method useless. Because conceptually there can be changes in store.state that aren't yet serialized 
		to view.data (while current view.data has already been saved to file) and then clear simply won't be called
		and consequently store.destroy and vueApp.unmount won't be called, which can lead to memory leaks and unpredictable behavior.  */
	}
	onunload() {
		this.destroy()
	}
	destroy () {
		this.vueApp?.unmount()
		this.store?.destroy()
		this.vueApp = null
		this.store = null
		this.stateRepository = null
		this.fileDataSource = null
	}
}

export class TeblaView extends TextFileView {
	teblaViewCore: TeblaViewCore
	constructor (...args: [WorkspaceLeaf]) {
		super(...args)
		this.teblaViewCore = new TeblaViewCore(this)
	}
	getViewData(...args: []): string {
		return this.teblaViewCore.getViewData(...args)
	}
	setViewData(...args: [string, boolean]): void {
		return this.teblaViewCore.setViewData(...args)
	}
	clear(...args: []): void {
		return this.teblaViewCore.clear(...args)
	}
	getViewType(): string {
		return TEBLA_VIEW_TYPE
	}
	onunload(...args: []): void {
		this.teblaViewCore.onunload(...args)
		return super.onunload(...args)
	}
}