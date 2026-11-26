import { describe, expect, it } from 'vitest'
import { isHakenInput, isHakenOutput, isSoundEngineOutput } from './ports'

describe('Osmose port names', () => {
  it.each(['Osmose', 'Osmose 49', 'Osmose 61'])('recognizes macOS and Windows ports for %s', (model) => {
    expect(isSoundEngineOutput(`${model} sound engine`)).toBe(true)
    expect(isSoundEngineOutput(`MIDIOUT2 (${model})`)).toBe(true)
    expect(isHakenOutput(`${model} haken`)).toBe(true)
    expect(isHakenOutput(`MIDIOUT5 (${model})`)).toBe(true)
    expect(isHakenInput(`${model} haken`)).toBe(true)
    expect(isHakenInput(`MIDIIN5 (${model})`)).toBe(true)
  })

  it('does not confuse directions, port numbers, or other devices', () => {
    expect(isSoundEngineOutput('MIDIIN2 (Osmose)')).toBe(false)
    expect(isHakenOutput('MIDIIN5 (Osmose)')).toBe(false)
    expect(isHakenInput('MIDIOUT5 (Osmose)')).toBe(false)
    expect(isHakenOutput('MIDIOUT5 (Other device)')).toBe(false)
    expect(isHakenInput('Osmose haken extra')).toBe(false)
  })
})
