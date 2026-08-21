import { controlChange as midiControlChange, programChange } from '../midi/messages'
import type { MidiMessage } from '../midi/types'
import type { OsmosePreset } from './presets'

export const osmoseControlChannel = 1

export type MidiAction = (value: number) => readonly MidiMessage[]

export function controlChange(controlChange: number): MidiAction {
  return (value) => [midiControlChange(osmoseControlChannel, controlChange, value)]
}

export function setPreset(preset: OsmosePreset): readonly MidiMessage[] {
  return [
    midiControlChange(osmoseControlChannel, 0, preset.bank),
    programChange(osmoseControlChannel, preset.program),
  ]
}
