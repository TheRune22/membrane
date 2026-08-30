import { For, Show } from 'solid-js'
import type { MidiInput } from '../midi/types'

interface MidiInputSelectorProps {
  connected: boolean
  inputs: readonly MidiInput[]
  selectedInputId: string
  onSelectionChange: (inputId: string) => void
}

export function MidiInputSelector(props: MidiInputSelectorProps) {
  return (
    <section class="control-group" aria-labelledby="input-heading">
      <div class="section-heading"><h2 id="input-heading">MIDI input</h2></div>
      <label class="field-label" for="midi-input">Receive Osmose state from</label>
      <select
        id="midi-input"
        value={props.selectedInputId}
        onChange={(event) => props.onSelectionChange(event.currentTarget.value)}
        disabled={!props.connected || props.inputs.length === 0}
      >
        <option value="">{props.connected ? 'Select a MIDI input' : 'MIDI access unavailable'}</option>
        <For each={props.inputs}>{(input) => <option value={input.id}>{input.label}</option>}</For>
      </select>
      <Show when={props.connected && props.inputs.length === 0}>
        <p class="field-note">Connect the Osmose MIDI input, then refresh MIDI access.</p>
      </Show>
    </section>
  )
}
