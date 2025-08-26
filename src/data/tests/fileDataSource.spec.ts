import { beforeEach, describe, expect, test, vi } from 'vitest'
import { getTestData, getTestState } from '../../../tests/testData'
import { FileDataSource } from '../fileDataSource'
import type { StoreRawState } from '../../domain/schemaTypes'

describe('FileDataSource', () => {
    let testData: string
    let testState: StoreRawState
    let dataSource: FileDataSource
    beforeEach(() => {
        testData = getTestData()
        testState = getTestState()
        dataSource = new FileDataSource()
    })
    test('converts markdown data to state object', () => {
        expect(FileDataSource.dataToState(testData)).toEqual(testState)
    })
    test('converts state object to markdown data', () => {
        expect(FileDataSource.stateToData(testState)).toEqual(testData)
    })
    test('emits state event when given markdown data', () => {
        const onState = vi.fn()
        dataSource.on('state', onState)
        dataSource.giveData(testData)
        expect(onState).toHaveBeenCalledWith(testState)
    })
    test('emits data event when given state object', () => {
        const onData = vi.fn()
        dataSource.on('data', onData)
        dataSource.giveState(testState)
        expect(onData).toHaveBeenCalledWith(testData)
    })
})