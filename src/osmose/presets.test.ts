import { describe, expect, it } from 'vitest'
import { parseOsmosePresets } from './presets'

describe('parseOsmosePresets', () => {
  it('parses preset fields and character tags', () => {
    expect(parseOsmosePresets('Name,Bank,Program,Type,Characters\nAnalog Pad,1,42,Pad,Warm + Evolving')).toEqual([
      { name: 'Analog Pad', bank: 1, program: 42, type: 'Pad', tags: ['Warm', 'Evolving'] },
    ])
  })

  it('uses an uncategorized type and no tags for empty optional fields', () => {
    expect(parseOsmosePresets('Name,Bank,Program,Type,Characters\nInit,0,0,,')).toEqual([
      { name: 'Init', bank: 0, program: 0, type: 'Uncategorized', tags: [] },
    ])
  })

  it('rejects rows with missing required data', () => {
    expect(() => parseOsmosePresets('Name,Bank,Program,Type,Characters\nBroken,,3,Pad,Warm')).toThrow('Invalid preset data on row 2.')
  })
})
