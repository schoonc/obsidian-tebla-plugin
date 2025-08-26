import { around } from 'monkey-around';
import {
	MarkdownView,
	type App as ObsidianApp,
	Plugin,
	type PluginManifest,
	WorkspaceLeaf
} from 'obsidian';
import { TEBLA_VIEW_TYPE } from '../domain/constants';
import { CreateNewTeblaTask } from './createNewTeblaTask';
import { isTeblaFile } from './misc';
import { TeblaView } from './teblaView';

class TeblaPluginCore {
	teblaPlugin: TeblaPlugin
	unpatchWorkspaceLeaf: (() => void) | null
	unpatchMarkdownView: (() => void) | null
	constructor (plugin: TeblaPlugin) {
		this.teblaPlugin = plugin
		this.unpatchWorkspaceLeaf = null
		this.unpatchMarkdownView = null
	}
	onload (this: TeblaPluginCore) {
		const self = this
		this.unpatchWorkspaceLeaf = around(WorkspaceLeaf.prototype, {
			setViewState(next) {
				return async function (this: WorkspaceLeaf, viewState, ...args) {
					/* I don't like that we're intervening in the file opening process. It would be good to change the type after all
					synchronous operations and promises related to file opening have completed. But then we'd need to somehow
					hide the content until the type changes, otherwise there will be a visual flicker. And we'd need to reliably determine when all
					synchronous operations and promises have completed. I haven't found a way to do this properly. */
					if (viewState.type === 'markdown') {
						/* In most cases, we'll get the cache here. There might be a problem only immediately after file creation
						and I think also when there's a long reindexing process. I cover the file creation case (see the file creation code).
						But I don't know how to handle the long indexing case. */
						const filePath = viewState.state?.file
						if (typeof filePath === 'string') {
							if (isTeblaFile(self.teblaPlugin.app.metadataCache, filePath)) {
								return next.call(this, {type: TEBLA_VIEW_TYPE, state: { file: filePath }})
							}
						}
					}
					return next.call(this, viewState, ...args)
				}
			}
		})
		this.unpatchMarkdownView = around(MarkdownView.prototype, {
			setViewData(next) {
				return function (this: MarkdownView, data, clear) {
					/* Here we handle the 'Make a copy' case. After creating a copy, there's no file data in the cache yet. So in the patched
					setViewState, the viewState won't be replaced. But at this point we seem to have file information in the cache, so we can replace the viewState.
					Though in the 'Make a copy' case there will be a small visual flicker of views. But it's a rare operation - let it be. I don't know how to do it better. */
					if (clear) {
						const viewState = this.leaf.getViewState()
						if (viewState.type === 'markdown') {
							const filePath = viewState.state?.file
							if (typeof filePath === 'string') {
								if (isTeblaFile(self.teblaPlugin.app.metadataCache, filePath)) {
									setTimeout(() => {
										/* Defer the setViewState call so that all synchronous operations complete correctly.
										In theory, there might still be unfinished promises somewhere. But this approach seems to work fine. */
										this.leaf.setViewState({type: TEBLA_VIEW_TYPE, state: { file: filePath }})
									})
								}
							}
						}
					}
					return next.call(this, data, clear)
				}
			},
		})

		this.teblaPlugin.addRibbonIcon('table-properties', 'Create new tebla', () => CreateNewTeblaTask.createAndInit(this.teblaPlugin))
		this.teblaPlugin.registerView(
			TEBLA_VIEW_TYPE,
			(leaf) => new TeblaView(leaf)
		);
	}
	onunload () {
		this.unpatchWorkspaceLeaf?.()
		this.unpatchMarkdownView?.()
		/* When unloading the plugin, if data !== lastSavedData - Obsidian will save to file itself.
		That means if we immediately serialize to view.data when store.state changes, then nothing additional
		needs to be done here.
		 */
	}
}

export class TeblaPlugin extends Plugin {
	teblaPluginCore: TeblaPluginCore

	constructor(...args: [ObsidianApp, PluginManifest]) {
		super(...args);
		this.teblaPluginCore = new TeblaPluginCore(this);
	}
	onload(): void {
		this.teblaPluginCore.onload()
	}
	onunload(): void {
		this.teblaPluginCore.onunload()
	}
}
