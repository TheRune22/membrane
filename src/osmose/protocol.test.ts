import { describe, expect, it } from 'vitest'
import { controlChangeAction, requestCurrentPreset, setPreset } from './protocol'

describe('Osmose MIDI protocol', () => {
  it('creates a channel-one control-change message', () => {
    expect(controlChangeAction(12)(64)).toEqual([[0xb0, 12, 64]])
  })

  it('selects a preset with bank select followed by program change', () => {
    expect(setPreset({ name: 'Example', bank: 2, program: 37 })).toEqual([
      [0xb0, 0, 2],
      [0xc0, 37],
    ])
  })

  it('requests current preset information on channel 16', () => {
    expect(requestCurrentPreset()).toEqual([[0xbf, 109, 16]])
  })
})
