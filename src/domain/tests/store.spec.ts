import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { Store } from '../store'
import type { StoreRawState } from '../schemaTypes'
import type { StateRepository } from '../interfaces'
import { createEmptyCard, type Grade } from 'ts-fsrs'

vi.mock('vue', () => ({
  reactive: (obj: any) => obj,
  shallowReactive: (obj: any) => obj,
  toRaw: (obj: any) => obj,
  watch: vi.fn()
}))

vi.mock('uuid', () => ({
  v4: () => 'test-uuid'
}))

describe('Store', () => {
  let store: Store
  let mockStateRepository: StateRepository
  let mockState: StoreRawState

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T12:00:00Z'))
    vi.spyOn(global, 'clearInterval')

    mockStateRepository = {
      giveState: vi.fn()
    }

    mockState = {
      version: 1,
      mainContentItemsOrder: [],
      items: [],
      fsrsParams: {} as any
    } as StoreRawState

    store = new Store(mockState, mockStateRepository)
  })

  afterEach(() => {
    store.destroy()
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    test('initializes with correct state and properties', () => {
      expect(store.state).toEqual(mockState)
      expect(store.stateRepository).toBe(mockStateRepository)
      expect(store.curDate).toBeInstanceOf(Date)
      expect(store.initCalled).toBe(false)
      expect(store.destroyCalled).toBe(false)
      expect(store.fsrsInstance).toBeDefined()
    })
  })

  describe('init', () => {
    test('sets up state watcher and date updater', async () => {
      const { watch } = await import('vue')
      store.init()

      expect(store.initCalled).toBe(true)
      expect(watch).toHaveBeenCalled()
      expect(store.curDateUpdaterIntervalId).not.toBeNull()
    })

    test('does not initialize twice', async () => {
      const { watch } = await import('vue')
      store.init()
      vi.clearAllMocks()
      store.init()

      expect(watch).not.toHaveBeenCalled()
    })

    test('updates current date every second', () => {
      store.init()
      const initialDate = store.curDate

      vi.advanceTimersByTime(1000)
      expect(store.curDate).not.toBe(initialDate)
    })
  })

  describe('destroy', () => {
    test('cleans up resources', () => {
      store.init()
      const intervalId = store.curDateUpdaterIntervalId

      store.destroy()

      expect(store.destroyCalled).toBe(true)
      expect(store.curDateUpdaterIntervalId).toBeNull()
      expect(clearInterval).toHaveBeenCalledWith(intervalId)
    })

    test('does not destroy twice', () => {
      store.destroy()
      vi.clearAllMocks()
      store.destroy()

      expect(clearInterval).not.toHaveBeenCalled()
    })
  })

  describe('setState', () => {
    test('replaces state and re-watches', async () => {
      const { watch } = await import('vue')
      store.init()
      
      const newState: StoreRawState = {
        version: 1,
        mainContentItemsOrder: ['item1'],
        items: [{
          itemId: 'item1',
          question: 'Test question',
          answer: 'Test answer',
          card: createEmptyCard()
        }],
        fsrsParams: {} as any
      }

      store.setState(newState)

      expect(store.state).toEqual(newState)
      expect(watch).toHaveBeenCalledTimes(2)
    })
  })

  describe('addItem', () => {
    test('adds new item to state', () => {
      store.addItem('Question 1', 'Answer 1')

      expect(store.state.items).toHaveLength(1)
      expect(store.state.items[0]).toMatchObject({
        itemId: 'test-uuid',
        question: 'Question 1',
        answer: 'Answer 1'
      })
      expect(store.state.items[0].card).toBeDefined()
      expect(store.state.mainContentItemsOrder).toContain('test-uuid')
    })

    test('adds item at the beginning of items array', () => {
      store.state.items = [{
        itemId: 'existing',
        question: 'Existing',
        answer: 'Existing',
        card: createEmptyCard()
      }]

      store.addItem('New', 'New')

      expect(store.state.items[0].itemId).toBe('test-uuid')
      expect(store.state.items[1].itemId).toBe('existing')
    })
  })

  describe('editItem', () => {
    beforeEach(() => {
      store.state.items = [{
        itemId: 'test-id',
        question: 'Old question',
        answer: 'Old answer',
        card: createEmptyCard()
      }]
    })

    test('edits existing item', () => {
      store.editItem('test-id', 'New question', 'New answer')

      expect(store.state.items[0].question).toBe('New question')
      expect(store.state.items[0].answer).toBe('New answer')
    })

    test('emits noItem event when item not found', () => {
      const noItemHandler = vi.fn()
      store.on('noItem', noItemHandler)

      store.editItem('non-existent', 'Question', 'Answer')

      expect(noItemHandler).toHaveBeenCalled()
      expect(store.state.items[0].question).toBe('Old question')
    })
  })

  describe('getItem', () => {
    test('returns item by id', () => {
      const item = {
        itemId: 'test-id',
        question: 'Question',
        answer: 'Answer',
        card: createEmptyCard()
      }
      store.state.items = [item]

      const result = store.getItem('test-id')

      expect(result).toBe(item)
    })

    test('returns undefined when item not found', () => {
      const result = store.getItem('non-existent')
      expect(result).toBeUndefined()
    })
  })

  describe('deleteItem', () => {
    beforeEach(() => {
      store.state.items = [{
        itemId: 'test-id',
        question: 'Question',
        answer: 'Answer',
        card: createEmptyCard()
      }]
      store.state.mainContentItemsOrder = ['test-id']
    })

    test('deletes existing item', () => {
      store.deleteItem('test-id')

      expect(store.state.items).toHaveLength(0)
      expect(store.state.mainContentItemsOrder).toHaveLength(0)
    })

    test('emits noItem event when item not found', () => {
      const noItemHandler = vi.fn()
      store.on('noItem', noItemHandler)

      store.deleteItem('non-existent')

      expect(noItemHandler).toHaveBeenCalled()
      expect(store.state.items).toHaveLength(1)
    })
  })

  describe('gradeItem', () => {
    beforeEach(() => {
      const mockCard = {
        ...createEmptyCard(),
        due: new Date('2024-01-01'),
        stability: 2.5,
        difficulty: 0.3,
        elapsed_days: 0,
        scheduled_days: 1,
        reps: 0,
        lapses: 0,
        state: 0 as const,
        last_review: undefined
      }
      store.state.items = [{
        itemId: 'test-id',
        question: 'Question',
        answer: 'Answer',
        card: mockCard
      }]
    })

    test('grades existing item', () => {
      const initialCard = { ...store.state.items[0].card }
      store.gradeItem('test-id', 3 as Grade)

      expect(store.state.items[0].card).not.toEqual(initialCard)
    })

    test('emits noItem event when item not found', () => {
      const noItemHandler = vi.fn()
      store.on('noItem', noItemHandler)

      store.gradeItem('non-existent', 3 as Grade)

      expect(noItemHandler).toHaveBeenCalled()
    })
  })

  describe('sort', () => {
    test('sorts items by due date', () => {
      store.state.items = [
        {
          itemId: 'id1',
          question: 'Q1',
          answer: 'A1',
          card: { ...createEmptyCard(), due: new Date('2024-01-03') }
        },
        {
          itemId: 'id2',
          question: 'Q2',
          answer: 'A2',
          card: { ...createEmptyCard(), due: new Date('2024-01-01') }
        },
        {
          itemId: 'id3',
          question: 'Q3',
          answer: 'A3',
          card: { ...createEmptyCard(), due: new Date('2024-01-02') }
        }
      ]

      store.sort()

      expect(store.state.items[0].itemId).toBe('id2')
      expect(store.state.items[1].itemId).toBe('id3')
      expect(store.state.items[2].itemId).toBe('id1')
    })
  })

  describe('watchState', () => {
    test('notifies repository on state change', async () => {
      const { watch } = await import('vue')
      const watchCallback = vi.fn()
      vi.mocked(watch).mockImplementation((_, callback) => {
        watchCallback.mockImplementation(callback as any)
        return vi.fn() as any
      })

      store.init()
      watchCallback()

      expect(mockStateRepository.giveState).toHaveBeenCalledWith(mockState)
    })
  })

  describe('gradeNumToGradeText', () => {
    test('provides correct grade text mapping', () => {
      expect(store.gradeNumToGradeText).toEqual({
        1: 'Again',
        2: 'Hard',
        3: 'Good',
        4: 'Easy'
      })
    })
  })
})