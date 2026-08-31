import { controlChange, programChange } from '../midi/messages'
import type { MidiMessage, ScheduledMidiMessage } from '../midi/types'
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

function patchNameMessages(name: string, timestamp: number): ScheduledMidiMessage[] {
  const characters = Array.from(name.replace(/\.[^.]+$/, '').slice(0, 32), (character) => {
    const codePoint = character.codePointAt(0)!
    return codePoint > 0 && codePoint < 0x80 ? codePoint : 0x3f
  })
  if (characters.length % 2 !== 0) characters.push(0)
  const nameEvents: ScheduledMidiMessage[] = []
  for (let index = 0; index < characters.length; index += 2) {
    nameEvents.push({ message: [0xaf, characters[index]!, characters[index + 1]!], timestamp })
  }

  return [
    { message: controlChange(16, 56, 0), timestamp },
    ...nameEvents,
    { message: controlChange(16, 56, 127), timestamp },
  ]
}

export function loadPatchFile(messages: readonly ScheduledMidiMessage[], fileName: string): readonly ScheduledMidiMessage[] {
  const archiveStartDelay = 1
  const completionTimestamp = Math.max(250, (messages.at(-1)?.timestamp ?? 0) + archiveStartDelay)
  return [
    { message: controlChange(16, 116, 42), timestamp: 0 },
    ...messages.map(({ message, timestamp }) => ({ message, timestamp: timestamp + archiveStartDelay })),
    ...patchNameMessages(fileName, completionTimestamp),
    { message: controlChange(16, 0, 126), timestamp: completionTimestamp },
    { message: controlChange(16, 32, 0), timestamp: completionTimestamp },
    { message: controlChange(16, 112, 0), timestamp: completionTimestamp },
    { message: controlChange(16, 109, 8), timestamp: completionTimestamp },
  ]
}
