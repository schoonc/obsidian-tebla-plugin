import { describe, test, expect, vi, beforeEach } from 'vitest'
import { isTeblaFile } from '../misc'
import type { MetadataCache, TFile, CachedMetadata } from 'obsidian'

describe('isTeblaFile', () => {
  let mockMetadataCache: Partial<MetadataCache>
  let mockTFile: Partial<TFile>

  beforeEach(() => {
    mockMetadataCache = {
      getCache: vi.fn(),
      getFileCache: vi.fn()
    }

    mockTFile = {
      path: 'test.md',
      name: 'test.md'
    }
  })

  test('returns false when fileOrPath is null', () => {
    expect(isTeblaFile(mockMetadataCache as MetadataCache, null as any)).toBe(false)
  })

  test('returns false when fileOrPath is undefined', () => {
    expect(isTeblaFile(mockMetadataCache as MetadataCache, undefined as any)).toBe(false)
  })

  test('returns false when cache is null', () => {
    vi.mocked(mockMetadataCache.getCache!).mockReturnValue(null)
    expect(isTeblaFile(mockMetadataCache as MetadataCache, 'test.md')).toBe(false)
  })

  test('returns false when frontmatter doesn\'t have isTebla', () => {
    const cacheWithoutTebla: Partial<CachedMetadata> = {
      frontmatter: {
        title: 'Test'
      }
    }
    vi.mocked(mockMetadataCache.getCache!).mockReturnValue(cacheWithoutTebla as CachedMetadata)
    expect(isTeblaFile(mockMetadataCache as MetadataCache, 'test.md')).toBe(false)
  })

  test('returns true when frontmatter has isTebla', () => {
    const cacheWithTebla: Partial<CachedMetadata> = {
      frontmatter: {
        isTebla: true
      }
    }
    vi.mocked(mockMetadataCache.getCache!).mockReturnValue(cacheWithTebla as CachedMetadata)
    expect(isTeblaFile(mockMetadataCache as MetadataCache, 'test.md')).toBe(true)
  })

  test('works with TFile object', () => {
    const cacheWithTebla: Partial<CachedMetadata> = {
      frontmatter: {
        isTebla: true
      }
    }
    vi.mocked(mockMetadataCache.getFileCache!).mockReturnValue(cacheWithTebla as CachedMetadata)
    expect(isTeblaFile(mockMetadataCache as MetadataCache, mockTFile as TFile)).toBe(true)
  })

  test('returns false when frontmatter is undefined', () => {
    const cacheWithUndefinedFrontmatter: Partial<CachedMetadata> = {
      frontmatter: undefined
    }
    vi.mocked(mockMetadataCache.getFileCache!).mockReturnValue(cacheWithUndefinedFrontmatter as CachedMetadata)
    expect(isTeblaFile(mockMetadataCache as MetadataCache, mockTFile as TFile)).toBe(false)
  })
})
