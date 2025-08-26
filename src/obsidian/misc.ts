import { type MetadataCache, type TFile } from "obsidian";
import { IS_TEBLA_FLAG_NAME } from '../domain/constants';

export const isTeblaFile = (metadataCache: MetadataCache, fileOrPath: TFile | string): boolean => {
    if (!fileOrPath) {
        return false
    }
    const cache = typeof fileOrPath === 'string' ? metadataCache.getCache(fileOrPath) : metadataCache.getFileCache(fileOrPath)
    return !!cache?.frontmatter?.[IS_TEBLA_FLAG_NAME]
}
