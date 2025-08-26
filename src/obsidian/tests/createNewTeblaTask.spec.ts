import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { CreateNewTeblaTask } from '../createNewTeblaTask'
import { TeblaPlugin } from '../teblaPlugin'
import { FileDataSource } from '../../data/fileDataSource'
import { getDefaultState } from '../../domain/misc'
import type { TFile, WorkspaceLeaf, Vault, MetadataCache, App } from 'obsidian'

vi.mock('../../data/fileDataSource')
vi.mock('../../domain/misc')
vi.mock('../misc')

describe('CreateNewTeblaTask', () => {
  let mockTeblaPlugin: Partial<TeblaPlugin>
  let mockApp: Partial<App>
  let mockVault: Partial<Vault>
  let mockWorkspace: any
  let mockMetadataCache: Partial<MetadataCache>
  let createNewTeblaTask: CreateNewTeblaTask

  beforeEach(() => {
    vi.useFakeTimers()
    
    mockVault = {
      getAbstractFileByPath: vi.fn(),
      create: vi.fn()
    }

    mockMetadataCache = {
      on: vi.fn(),
      off: vi.fn(),
      getCache: vi.fn(),
      getFileCache: vi.fn()
    }

    mockWorkspace = {
      getLeaf: vi.fn()
    }

    mockApp = {
      vault: mockVault as Vault,
      metadataCache: mockMetadataCache as MetadataCache,
      workspace: mockWorkspace
    }

    mockTeblaPlugin = {
      app: mockApp as App,
      registerEvent: vi.fn(),
      register: vi.fn()
    }

    createNewTeblaTask = new CreateNewTeblaTask(mockTeblaPlugin as TeblaPlugin)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('createFile', () => {
    test('creates file with name Tebla.md when it does not exist', async () => {
      vi.mocked(mockVault.getAbstractFileByPath!).mockReturnValue(null)
      vi.mocked(mockVault.create!).mockResolvedValue({ path: 'Tebla.md' } as TFile)
      vi.mocked(getDefaultState).mockReturnValue({
        version: 1,
        mainContentItemsOrder: [],
        items: [],
        fsrsParams: {}
      } as any)
      vi.mocked(FileDataSource.stateToData).mockReturnValue('file content')

      const result = await createNewTeblaTask.createFile()

      expect(mockVault.getAbstractFileByPath).toHaveBeenCalledWith('Tebla.md')
      expect(mockVault.create).toHaveBeenCalledWith('Tebla.md', 'file content')
      expect(result).toEqual({ path: 'Tebla.md' })
    })

    test('creates file with incremented name when Tebla.md exists', async () => {
      vi.mocked(mockVault.getAbstractFileByPath!)
        .mockReturnValueOnce({ path: 'Tebla.md' } as TFile) // First call - file exists
        .mockReturnValueOnce(null) // Second call - file doesn't exist
      vi.mocked(mockVault.create!).mockResolvedValue({ path: 'Tebla 1.md' } as TFile)
      vi.mocked(getDefaultState).mockReturnValue({
        version: 1,
        mainContentItemsOrder: [],
        items: [],
        fsrsParams: {}
      } as any)
      vi.mocked(FileDataSource.stateToData).mockReturnValue('file content')

      const result = await createNewTeblaTask.createFile()

      expect(mockVault.getAbstractFileByPath).toHaveBeenCalledWith('Tebla.md')
      expect(mockVault.getAbstractFileByPath).toHaveBeenCalledWith('Tebla 1.md')
      expect(mockVault.create).toHaveBeenCalledWith('Tebla 1.md', 'file content')
      expect(result).toEqual({ path: 'Tebla 1.md' })
    })

    test('creates file with correct postfix when multiple files exist', async () => {
      vi.mocked(mockVault.getAbstractFileByPath!)
        .mockReturnValueOnce({ path: 'Tebla.md' } as TFile)
        .mockReturnValueOnce({ path: 'Tebla 1.md' } as TFile)
        .mockReturnValueOnce({ path: 'Tebla 2.md' } as TFile)
        .mockReturnValueOnce(null)
      vi.mocked(mockVault.create!).mockResolvedValue({ path: 'Tebla 3.md' } as TFile)
      vi.mocked(getDefaultState).mockReturnValue({
        version: 1,
        mainContentItemsOrder: [],
        items: [],
        fsrsParams: {}
      } as any)
      vi.mocked(FileDataSource.stateToData).mockReturnValue('file content')

      const result = await createNewTeblaTask.createFile()

      expect(mockVault.getAbstractFileByPath).toHaveBeenCalledTimes(4)
      expect(mockVault.create).toHaveBeenCalledWith('Tebla 3.md', 'file content')
      expect(result).toEqual({ path: 'Tebla 3.md' })
    })
  })

  describe('waitCache', () => {
    test('resolves immediately when file is already a Tebla file', async () => {
      const mockFile = { path: 'test.md' } as TFile
      const { isTeblaFile } = await import('../misc')
      vi.mocked(isTeblaFile).mockReturnValue(true)

      const promise = createNewTeblaTask.waitCache(mockFile)
      await promise

      expect(mockMetadataCache.on).toHaveBeenCalledWith('changed', expect.any(Function))
      expect(mockTeblaPlugin.register).toHaveBeenCalled()
    })

    test('waits for metadata change event when file is not initially a Tebla file', async () => {
      const mockFile = { path: 'test.md' } as TFile
      const { isTeblaFile } = await import('../misc')
      vi.mocked(isTeblaFile)
        .mockReturnValueOnce(false) // Initial check
        .mockReturnValueOnce(true)  // After metadata change

      let changeHandler: any = null
      vi.mocked(mockMetadataCache.on!).mockImplementation((event: string, handler: any) => {
        changeHandler = handler
        return { e: {} } as any
      })

      const promise = createNewTeblaTask.waitCache(mockFile)

      // Trigger metadata change
      if (changeHandler) {
        changeHandler(mockFile)
      }

      await promise

      expect(mockMetadataCache.off).toHaveBeenCalledWith('changed', expect.any(Function))
    })

    test('ignores metadata changes for different files', async () => {
      const mockFile = { path: 'test.md' } as TFile
      const differentFile = { path: 'different.md' } as TFile
      const { isTeblaFile } = await import('../misc')
      vi.mocked(isTeblaFile).mockReturnValue(false)

      let changeHandler: any = null
      vi.mocked(mockMetadataCache.on!).mockImplementation((event: string, handler: any) => {
        changeHandler = handler
        return { e: {} } as any
      })

      const promise = createNewTeblaTask.waitCache(mockFile)

      // Trigger metadata change for different file
      if (changeHandler) {
        changeHandler(differentFile)
      }

      // Should not resolve yet
      expect(isTeblaFile).toHaveBeenCalledTimes(1) // Only initial check

      // Now resolve with timeout
      vi.advanceTimersByTime(500)
      await promise

      expect(mockMetadataCache.off).toHaveBeenCalled()
    })

    test('times out after 500ms if file never becomes Tebla file', async () => {
      const mockFile = { path: 'test.md' } as TFile
      const { isTeblaFile } = await import('../misc')
      vi.mocked(isTeblaFile).mockReturnValue(false)

      const promise = createNewTeblaTask.waitCache(mockFile)

      vi.advanceTimersByTime(500)
      await promise

      expect(mockMetadataCache.off).toHaveBeenCalledWith('changed', expect.any(Function))
    })

    test('clears timeout when resolved before timeout', async () => {
      const mockFile = { path: 'test.md' } as TFile
      const { isTeblaFile } = await import('../misc')
      vi.mocked(isTeblaFile).mockReturnValue(true)

      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

      await createNewTeblaTask.waitCache(mockFile)

      expect(clearTimeoutSpy).toHaveBeenCalled()
    })
  })

  describe('init', () => {
    test('creates file, waits for cache, and opens it in new leaf', async () => {
      const mockFile = { path: 'Tebla.md' } as TFile
      const mockLeaf = { openFile: vi.fn() } as unknown as WorkspaceLeaf
      
      vi.spyOn(createNewTeblaTask, 'createFile').mockResolvedValue(mockFile)
      vi.spyOn(createNewTeblaTask, 'waitCache').mockResolvedValue()
      vi.mocked(mockWorkspace.getLeaf).mockReturnValue(mockLeaf)

      await createNewTeblaTask.init()

      expect(createNewTeblaTask.createFile).toHaveBeenCalled()
      expect(createNewTeblaTask.waitCache).toHaveBeenCalledWith(mockFile)
      expect(mockWorkspace.getLeaf).toHaveBeenCalledWith(true)
      expect(mockLeaf.openFile).toHaveBeenCalledWith(mockFile)
    })
  })

  describe('createAndInit', () => {
    test('creates instance and calls init', () => {
      const initSpy = vi.spyOn(CreateNewTeblaTask.prototype, 'init').mockResolvedValue()

      CreateNewTeblaTask.createAndInit(mockTeblaPlugin as TeblaPlugin)

      expect(initSpy).toHaveBeenCalled()
    })
  })
})