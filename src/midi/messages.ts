import type { MidiMessage } from './types'

function validateChannel(channel: number) {
  if (!Number.isInteger(channel) || channel < 1 || channel > 16) throw new Error('The MIDI channel must be between 1 and 16.')
}

function validateByte(value: number, name: string) {
  if (!Number.isInteger(value) || value < 0 || value > 127) throw new Error(`The MIDI ${name} must be between 0 and 127.`)
}

export function controlChange(channel: number, controlChange: number, value: number): MidiMessage {
  validateChannel(channel)
  validateByte(controlChange, 'control change')
  validateByte(value, 'control value')
  return [0xb0 + channel - 1, controlChange, value]
}

export function programChange(channel: number, program: number): MidiMessage {
  validateChannel(channel)
  validateByte(program, 'program')
  return [0xc0 + channel - 1, program]
}
