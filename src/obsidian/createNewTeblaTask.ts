import { type TFile, normalizePath } from 'obsidian';
import { FileDataSource } from '../data/fileDataSource';
import { isTeblaFile } from './misc';
import { TeblaPlugin } from './teblaPlugin';
import { getDefaultState } from '../domain/misc'

export class CreateNewTeblaTask {
	teblaPlugin: TeblaPlugin;
	constructor(teblaPlugin: TeblaPlugin) {
		this.teblaPlugin = teblaPlugin;
	}

	async init() {
		const createdFile = await this.createFile();
		await this.waitCache(createdFile);
		const leaf = this.teblaPlugin.app.workspace.getLeaf(true);
		leaf.openFile(createdFile);
	}

	waitCache(createdFile: TFile) {
		return new Promise<void>((resolve) => {
			const handle = (...args: unknown[]) => {
				const file = args[0] as TFile;
				if (file.path !== createdFile.path) {
					return;
				}
				if (isTeblaFile(this.teblaPlugin.app.metadataCache, createdFile)) {
					this.teblaPlugin.app.metadataCache.off('changed', handle);
					clearTimeout(tid);
					resolve();
				}
			};
			this.teblaPlugin.registerEvent(this.teblaPlugin.app.metadataCache.on('changed', handle));
			const tid = setTimeout(() => {
				this.teblaPlugin.app.metadataCache.off('changed', handle);
				resolve();
			}, 500);
			this.teblaPlugin.register(() => {
				clearTimeout(tid);
			});
			handle(createdFile);
		});
	}

	async createFile() {
		let fname = normalizePath(`Tebla.md`);
		let file = this.teblaPlugin.app.vault.getAbstractFileByPath(fname);
		let postfix = 1;
		while (file) {
			fname = normalizePath(`Tebla ${postfix}.md`);
			file = this.teblaPlugin.app.vault.getAbstractFileByPath(fname);
			postfix++;
		}
		return await this.teblaPlugin.app.vault.create(fname, FileDataSource.stateToData(getDefaultState()));
	}

	static createAndInit (teblaPlugin: TeblaPlugin) {
		const task = new this(teblaPlugin)
		task.init()
	}
}
