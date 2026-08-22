import { describe, expect, it } from 'vitest'
import { controlChangeAction, setPreset } from './protocol'

describe('Osmose MIDI protocol', () => {
  it('creates a channel-one control-change message', () => {
    expect(controlChangeAction(12)(64)).toEqual([[0xb0, 12, 64]])
  })

  it('selects a preset with bank select followed by program change', () => {
    expect(setPreset({ name: 'Example', bank: 2, program: 37, type: 'Keys', tags: [] })).toEqual([
      [0xb0, 0, 2],
      [0xc0, 37],
    ])
  })
})
