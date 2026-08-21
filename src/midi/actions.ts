import type { MidiOutput } from './types'

export type MidiAction = (output: MidiOutput, value: number) => void

export function controlChange(channel: number, controlChange: number): MidiAction {
  return (output, value) => output.sendControlChange(channel, controlChange, value)
}
