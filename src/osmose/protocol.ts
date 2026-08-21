import type { MidiOutput } from '../midi/types'
import type { OsmosePreset } from './presets'

export const osmoseControlChannel = 1

export type MidiAction = (output: MidiOutput, value: number) => void

export function controlChange(controlChange: number): MidiAction {
  return (output, value) => output.sendControlChange(osmoseControlChannel, controlChange, value)
}

export function setPreset(output: MidiOutput, preset: OsmosePreset) {
  output.sendControlChange(osmoseControlChannel, 0, preset.bank)
  output.sendProgramChange(osmoseControlChannel, preset.program)
}
