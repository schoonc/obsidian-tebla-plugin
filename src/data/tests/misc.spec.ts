import { test, expect, describe } from 'vitest'
import { isIsoDateString } from '../misc'

describe('Data utility functions', () => {
  test('validates ISO date string format with milliseconds', () => {
    expect(isIsoDateString('2020-01-01T00:00:00.000Z')).toBe(true)
    expect(isIsoDateString('2020-01-01T00:00:00Z')).toBe(false)
    expect(isIsoDateString('abracadabra')).toBe(false)
  })
})


