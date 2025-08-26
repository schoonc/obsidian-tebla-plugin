import { describe, expect, test, vi } from 'vitest'
import { getTestState } from '../../../tests/testData'
import type { DataSource } from '../interfaces'
import { StateRepositoryImpl } from '../stateRepository'

describe('StateRepository', () => {
  test('should pass state to data source when giveState is called', async () => {
    const dataSource: DataSource = {
        giveState: vi.fn(),
        giveData: vi.fn(),
    }
    const repo = new StateRepositoryImpl(dataSource)
    const state = getTestState()
    repo.giveState(state)
    expect(dataSource.giveState).toHaveBeenCalledWith(state)
  })
})
