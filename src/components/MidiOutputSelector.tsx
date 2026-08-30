import { For, Show } from 'solid-js'
import type { MidiOutput } from '../midi/types'

interface MidiOutputSelectorProps {
  connected: boolean
  outputs: readonly MidiOutput[]
  selectedOutputId: string
  onSelectionChange: (outputId: string) => void
}

export function MidiOutputSelector(props: MidiOutputSelectorProps) {
  return (
    <section class="control-group" aria-labelledby="output-heading">
      <div class="section-heading"><h2 id="output-heading">MIDI output</h2></div>
      <label class="field-label" for="midi-output">Send messages to</label>
      <select
        id="midi-output"
        value={props.selectedOutputId}
        onChange={(event) => props.onSelectionChange(event.currentTarget.value)}
        disabled={!props.connected || props.outputs.length === 0}
      >
        <option value="">{props.connected ? 'Select a MIDI output' : 'MIDI access unavailable'}</option>
        <For each={props.outputs}>{(output) => <option value={output.id}>{output.label}</option>}</For>
      </select>
      <Show when={props.connected && props.outputs.length === 0}>
        <p class="field-note">Connect an Osmose MIDI output, then refresh MIDI access.</p>
      </Show>
    </section>
  )
}
