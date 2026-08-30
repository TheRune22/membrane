import { describe, expect, it } from 'vitest'
import type { MidiMessage } from '../midi/types'
import { OsmoseSnapshotParser } from './snapshot'

const header: MidiMessage[] = [[0xbf, 104, 24], [0xbf, 105, 0], [0xbf, 106, 0]]
const context: MidiMessage[] = [
  [0xbf, 56, 1], [0xaf, 105, 61], [0xaf, 99, 117], [0xaf, 116, 111], [0xaf, 102, 102], [0xaf, 95, 99], [0xaf, 117, 116], [0xaf, 111, 102], [0xaf, 102, 32],
  [0xaf, 105, 105], [0xaf, 61, 114], [0xaf, 101, 115], [0xaf, 111, 110], [0xaf, 97, 110], [0xaf, 99, 101], [0xaf, 95, 102], [0xaf, 105, 108], [0xaf, 116, 101], [0xaf, 114, 82], [0xaf, 101, 115], [0xaf, 111, 0], [0xbf, 56, 127],
]
const finish: MidiMessage[] = [[0xbf, 56, 0], [0xaf, 116, 104], [0xaf, 101, 32], [0xaf, 97, 110], [0xaf, 97, 108], [0xaf, 111, 103], [0xbf, 56, 127], [0xbf, 0, 126], [0xbf, 32, 0], [0xcf, 1]]

function parse(messages: readonly MidiMessage[]) {
  const parser = new OsmoseSnapshotParser()
  return messages.map((message) => parser.push(message)).find((snapshot) => snapshot !== undefined)
}

describe('Osmose snapshot parser', () => {
  it('parses the documented current-preset stream fields used by the controller', () => {
    const snapshot = parse([...header, ...context, [0xb0, 12, 48], [0xb0, 26, 45], [0xb0, 90, 65], [0xb0, 24, 50], [0xb0, 64, 0], [0xb0, 83, 64], ...finish])

    expect(snapshot).toEqual({
      name: 'the analog', bank: 126, program: 1,
      macroNames: { i: 'cutoff_cutoff', ii: 'resonance_filterReso' },
      controlValues: { 'macro-1': 48, pregain: 45, 'compressor-threshold': 65, 'effects-mix': 50, sustain: 0, 'eq-tilt': 64 },
    })
  })

  it('ignores the preset-load preamble and waits for the full snapshot header', () => {
    const preamble: MidiMessage[] = [[0xbf, 56, 0], [0xaf, 116, 104], [0xaf, 101, 32], [0xbf, 56, 127], [0xbf, 0, 0], [0xbf, 32, 0], [0xcf, 0], [0xbf, 45, 125], [0xbf, 109, 26]]

    const snapshot = parse([...preamble, ...header, ...context, [0xb0, 17, 54], ...finish])

    expect(snapshot).toMatchObject({ name: 'the analog', bank: 126, program: 1, controlValues: { 'macro-6': 54 } })
  })
})
