import { controlChange, programChange } from '../midi/messages'
import type { MidiMessage } from '../midi/types'
import type { OsmosePresetAddress } from './presets'

export type MidiAction = (value: number) => readonly MidiMessage[]

export function controlChangeAction(control: number): MidiAction {
  return (value) => [controlChange(1, control, value)]
}

export function setPreset(preset: OsmosePresetAddress): readonly MidiMessage[] {
  return [
    controlChange(1, 0, preset.bank),
    programChange(1, preset.program),
  ]
}

export function requestCurrentPreset(): readonly MidiMessage[] {
  return [controlChange(16, 109, 16)]
}
