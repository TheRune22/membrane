import { describe, expect, it } from 'vitest'
import { controlChangeAction, loadPatchFile, macro14BitAction, requestCurrentPreset, set14BitMacro, setPreset } from './protocol'

describe('Osmose MIDI protocol', () => {
  it('creates a channel-one control-change message', () => {
    expect(controlChangeAction(12)(64)).toEqual([[0xb0, 12, 64]])
  })

  it('sets a 14-bit macro with its fractional byte before its main control', () => {
    expect(set14BitMacro(7, 0x2000)).toEqual([
      [0xb0, 86, 0],
      [0xb0, 40, 64],
    ])
  })

  it('maps the documented bipolar macro ranges', () => {
    expect(set14BitMacro(30, 0)).toEqual([[0xb0, 86, 0], [0xb0, 63, 0]])
    expect(set14BitMacro(31, 0)).toEqual([[0xb0, 86, 0], [0xb0, 102, 0]])
    expect(set14BitMacro(48, 0x3fff)).toEqual([[0xb0, 86, 127], [0xb0, 119, 127]])
    expect(set14BitMacro(49, 0x1234)).toEqual([[0xb0, 97, 52], [0xb0, 40, 36]])
    expect(set14BitMacro(72, 0)).toEqual([[0xb0, 97, 0], [0xb0, 63, 0]])
    expect(set14BitMacro(73, 0)).toEqual([[0xb0, 97, 0], [0xb0, 102, 0]])
    expect(set14BitMacro(90, 0x3fff)).toEqual([[0xb0, 97, 127], [0xb0, 119, 127]])
  })

  it('provides an action for use by future controls', () => {
    expect(macro14BitAction(7)(128)).toEqual([[0xb0, 86, 0], [0xb0, 40, 1]])
  })

  it('rejects unsupported macros and invalid 14-bit values', () => {
    expect(() => set14BitMacro(6, 0)).toThrow('between 7 and 90')
    expect(() => set14BitMacro(91, 0)).toThrow('between 7 and 90')
    expect(() => set14BitMacro(7, 0x4000)).toThrow('between 0 and 16,383')
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
