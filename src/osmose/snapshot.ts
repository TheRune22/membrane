import type { MidiMessage } from '../midi/types'
import type { OsmosePresetAddress } from './presets'

export interface OsmoseSnapshot extends OsmosePresetAddress {
  readonly macroNames: Readonly<Record<string, string>>
  readonly controlValues: Readonly<Record<string, number>>
}

const controlIds: Readonly<Record<number, string>> = {
  12: 'macro-1', 13: 'macro-2', 14: 'macro-3', 15: 'macro-4', 16: 'macro-5', 17: 'macro-6',
  18: 'postgain', 20: 'effects-parameter-1', 21: 'effects-parameter-2', 22: 'effects-parameter-3', 23: 'effects-parameter-4', 24: 'effects-mix', 26: 'pregain',
  64: 'sustain', 66: 'sostenuto-1', 69: 'sostenuto-2',
  83: 'eq-tilt', 84: 'eq-frequency', 85: 'eq-mix',
  90: 'compressor-threshold', 91: 'compressor-attack', 92: 'compressor-ratio', 93: 'compressor-mix', 95: 'effects-parameter-5', 96: 'effects-parameter-6',
}

export function macroLabelsFromSnapshot(snapshot: OsmoseSnapshot): Readonly<Partial<Record<string, string>>> {
  const names = snapshot.macroNames
  return {
    'macro-1': displayMacroLabel(names.i), 'macro-2': displayMacroLabel(names.ii), 'macro-3': displayMacroLabel(names.iii),
    'macro-4': displayMacroLabel(names.iv), 'macro-5': displayMacroLabel(names.v), 'macro-6': displayMacroLabel(names.vi),
  }
}

function displayMacroLabel(name: string | undefined) {
  if (!name) return undefined
  return name.split('_', 1)[0].trim() || name.trim()
}

function decodeText(bytes: readonly number[]) {
  return String.fromCharCode(...bytes).replace(/\0+$/, '')
}

function parseMacroNames(context: string) {
  const names: Record<string, string> = {}
  for (const match of context.matchAll(/(?:^|\s)(vi|iv|iii|ii|i|v)=([^\s\n]+)/g)) names[match[1]] = match[2]
  return names
}

type ActiveSnapshot = {
  controlValues: Record<string, number>
  macroNames: Record<string, string>
  name: string | undefined
  stream: { id: number; bytes: number[] } | undefined
  completion: 'waiting' | 'bank-high' | 'bank-low'
  bank: number | undefined
  program: number | undefined
}

export class OsmoseSnapshotParser {
  private headerStep = 0
  private active: ActiveSnapshot | undefined

  push(message: MidiMessage): OsmoseSnapshot | undefined {
    if (!this.active) return this.consumeHeader(message)
    return this.consumeSnapshot(message)
  }

  reset() {
    this.headerStep = 0
    this.active = undefined
  }

  private consumeHeader(message: MidiMessage) {
    const expectedControls = [104, 105, 106]
    const expected = expectedControls[this.headerStep]
    this.headerStep = message[0] === 0xbf && message[1] === expected ? this.headerStep + 1 : message[0] === 0xbf && message[1] === 104 ? 1 : 0
    if (this.headerStep !== expectedControls.length) return undefined

    this.headerStep = 0
    this.active = { controlValues: {}, macroNames: {}, name: undefined, stream: undefined, completion: 'waiting', bank: undefined, program: undefined }
    return undefined
  }

  private consumeSnapshot(message: MidiMessage): OsmoseSnapshot | undefined {
    const active = this.active!
    if (message[0] === 0xb0) {
      const id = controlIds[message[1]]
      if (id) active.controlValues[id] = message[2]
    }

    if (message[0] === 0xbf && message[1] === 56) {
      if (message[2] === 127 && active.stream) {
        const text = decodeText(active.stream.bytes)
        if (active.stream.id === 0) active.name = text
        if (active.stream.id === 1) Object.assign(active.macroNames, parseMacroNames(text))
        active.stream = undefined
        if (active.name) active.completion = 'waiting'
      } else if (message[2] !== 127) {
        active.stream = { id: message[2], bytes: [] }
      }
      return undefined
    }

    if (message[0] === 0xaf && active.stream && (active.stream.id === 0 || active.stream.id === 1)) {
      active.stream.bytes.push(message[1], message[2])
      return undefined
    }

    if (!active.name) return undefined
    if (active.completion === 'waiting' && message[0] === 0xbf && message[1] === 0) {
      active.bank = message[2]
      active.completion = 'bank-high'
      return undefined
    }
    if (active.completion === 'bank-high' && message[0] === 0xbf && message[1] === 32) {
      active.completion = 'bank-low'
      return undefined
    }
    if (active.completion === 'bank-low' && message[0] === 0xcf) {
      active.program = message[1]
      const snapshot: OsmoseSnapshot = { name: active.name, bank: active.bank!, program: active.program, macroNames: active.macroNames, controlValues: active.controlValues }
      this.active = undefined
      return snapshot
    }
    active.completion = 'waiting'
    return undefined
  }
}
