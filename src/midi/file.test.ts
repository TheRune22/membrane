import { describe, expect, it } from 'vitest'
import { parseMidiFile } from './file'

function midiFile(track: number[]): ArrayBuffer {
  return new Uint8Array([
    ...[0x4d, 0x54, 0x68, 0x64], 0, 0, 0, 6, 0, 0, 0, 1, 0, 96,
    ...[0x4d, 0x54, 0x72, 0x6b], 0, 0, 0, track.length,
    ...track,
  ]).buffer
}

describe('parseMidiFile', () => {
  it('extracts channel messages and ignores timing and meta events', () => {
    expect(parseMidiFile(midiFile([
      0, 0xbf, 109, 24,
      0x20, 0xb0, 12, 64,
      0, 0xff, 0x2f, 0,
    ]))).toEqual([
      { message: [0xbf, 109, 24], timestamp: 0 },
      { message: [0xb0, 12, 64], timestamp: 500 / 3 },
    ])
  })

  it('supports running status', () => {
    expect(parseMidiFile(midiFile([0, 0xb0, 12, 1, 0, 13, 2]))).toEqual([
      { message: [0xb0, 12, 1], timestamp: 0 },
      { message: [0xb0, 13, 2], timestamp: 0 },
    ])
  })

  it('rejects files without MIDI messages', () => {
    expect(() => parseMidiFile(midiFile([0, 0xff, 0x2f, 0]))).toThrow('does not contain any MIDI messages')
  })

})
