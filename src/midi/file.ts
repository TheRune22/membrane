import type { ScheduledMidiMessage } from './types'

function readUint32(bytes: Uint8Array, offset: number): number {
  return (bytes[offset]! * 0x1000000) + (bytes[offset + 1]! << 16) + (bytes[offset + 2]! << 8) + bytes[offset + 3]!
}

function readVariableLength(bytes: Uint8Array, offset: number, end: number): readonly [number, number] {
  let value = 0
  for (let index = 0; index < 4; index += 1) {
    if (offset >= end) throw new Error('The MIDI file ends in the middle of an event.')
    const byte = bytes[offset++]!
    value = (value << 7) | (byte & 0x7f)
    if ((byte & 0x80) === 0) return [value, offset]
  }
  throw new Error('The MIDI file contains an invalid variable-length value.')
}

function channelMessageLength(status: number): number {
  const kind = status & 0xf0
  if (kind === 0xc0 || kind === 0xd0) return 1
  if (kind >= 0x80 && kind <= 0xe0) return 2
  throw new Error('The MIDI file contains an unsupported MIDI event.')
}

function parseTrack(bytes: Uint8Array, start: number, end: number, ticksPerQuarterNote: number): ScheduledMidiMessage[] {
  const messages: ScheduledMidiMessage[] = []
  let offset = start
  let runningStatus: number | undefined
  let tempo = 500_000 // Standard MIDI File default: microseconds per quarter note.
  let timestamp = 0

  while (offset < end) {
    const [deltaTime, nextOffset] = readVariableLength(bytes, offset, end)
    offset = nextOffset
    timestamp += (deltaTime * tempo) / ticksPerQuarterNote / 1_000
    if (offset >= end) throw new Error('The MIDI file ends before an event status byte.')

    let status = bytes[offset++]!
    if (status < 0x80) {
      if (runningStatus === undefined) throw new Error('The MIDI file uses running status before a status byte.')
      offset -= 1
      status = runningStatus
    } else if (status < 0xf0) {
      runningStatus = status
    } else {
      runningStatus = undefined
    }

    if (status === 0xff) {
      if (offset >= end) throw new Error('The MIDI file ends in a meta event.')
      const type = bytes[offset++]!
      const [length, nextOffset] = readVariableLength(bytes, offset, end)
      const dataEnd = nextOffset + length
      if (dataEnd > end) throw new Error('The MIDI file ends in a meta event.')
      if (type === 0x51 && length === 3) tempo = (bytes[nextOffset]! << 16) | (bytes[nextOffset + 1]! << 8) | bytes[nextOffset + 2]!
      offset = dataEnd
      continue
    }

    if (status === 0xf0 || status === 0xf7) {
      throw new Error('System Exclusive events are not supported in patch MIDI files.')
    }

    const dataLength = channelMessageLength(status)
    if (offset + dataLength > end) throw new Error('The MIDI file ends in a channel message.')
    const data = Array.from(bytes.slice(offset, offset + dataLength))
    if (data.some((byte) => byte > 0x7f)) throw new Error('The MIDI file contains an invalid channel message.')
    messages.push({ message: [status, ...data], timestamp })
    offset += dataLength
  }

  return messages
}

/** Extracts and schedules channel messages from a type-0 Standard MIDI File. */
export function parseMidiFile(file: ArrayBuffer): readonly ScheduledMidiMessage[] {
  const bytes = new Uint8Array(file)
  if (bytes.length < 14 || String.fromCharCode(...bytes.slice(0, 4)) !== 'MThd') {
    throw new Error('Choose a standard MIDI file (.mid or .midi).')
  }

  const headerLength = readUint32(bytes, 4)
  if (headerLength < 6 || 8 + headerLength > bytes.length) throw new Error('The MIDI file has an invalid header.')
  const format = (bytes[8]! << 8) | bytes[9]!
  const trackCount = (bytes[10]! << 8) | bytes[11]!
  const timeDivision = (bytes[12]! << 8) | bytes[13]!
  if (format !== 0 || trackCount !== 1) throw new Error('Patch MIDI files must use the single-track MIDI format.')
  if ((timeDivision & 0x8000) !== 0 || timeDivision === 0) throw new Error('The MIDI file uses an unsupported time division.')
  let offset = 8 + headerLength
  const messages: ScheduledMidiMessage[] = []

  for (let track = 0; track < trackCount; track += 1) {
    if (offset + 8 > bytes.length || String.fromCharCode(...bytes.slice(offset, offset + 4)) !== 'MTrk') {
      throw new Error('The MIDI file has an invalid track.')
    }
    const trackLength = readUint32(bytes, offset + 4)
    const trackStart = offset + 8
    const trackEnd = trackStart + trackLength
    if (trackEnd > bytes.length) throw new Error('The MIDI file ends before its track data.')
    messages.push(...parseTrack(bytes, trackStart, trackEnd, timeDivision))
    offset = trackEnd
  }

  if (messages.length === 0) throw new Error('The MIDI file does not contain any MIDI messages.')
  return messages
}
