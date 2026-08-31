import { describe, expect, it } from 'vitest'
import { controlChangeAction, loadPatchFile, requestCurrentPreset, setPreset } from './protocol'

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

  it('writes the filename and commits the patch to the edit buffer after the archive', () => {
    expect(loadPatchFile([{ message: [0xb0, 12, 64], timestamp: 12 }], 'the analog.mid')).toEqual([
      { message: [0xbf, 116, 42], timestamp: 0 },
      { message: [0xb0, 12, 64], timestamp: 13 },
      { message: [0xbf, 56, 0], timestamp: 250 },
      { message: [0xaf, 116, 104], timestamp: 250 },
      { message: [0xaf, 101, 32], timestamp: 250 },
      { message: [0xaf, 97, 110], timestamp: 250 },
      { message: [0xaf, 97, 108], timestamp: 250 },
      { message: [0xaf, 111, 103], timestamp: 250 },
      { message: [0xbf, 56, 127], timestamp: 250 },
      { message: [0xbf, 0, 126], timestamp: 250 },
      { message: [0xbf, 32, 0], timestamp: 250 },
      { message: [0xbf, 112, 0], timestamp: 250 },
      { message: [0xbf, 109, 8], timestamp: 250 },
    ])
  })
})
