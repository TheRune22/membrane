import { For, Show } from 'solid-js'
import type { MidiOutput } from '../midi/types'

interface MidiOutputSelectorProps {
  connected: boolean
  connecting: boolean
  outputs: readonly MidiOutput[]
  selectedOutputId: string
  onConnect: () => void
  onSelectionChange: (outputId: string) => void
}

export function MidiOutputSelector(props: MidiOutputSelectorProps) {
  const buttonLabel = () => {
    if (props.connecting) return 'Connecting...'
    return props.connected ? 'Refresh outputs' : 'Connect MIDI'
  }

  return (
    <section class="control-group" aria-labelledby="output-heading">
      <div class="section-heading">
        <div>
          <p class="step">01</p>
          <h2 id="output-heading">MIDI output</h2>
        </div>
        <button class="secondary-button" type="button" onClick={props.onConnect} disabled={props.connecting}>
          {buttonLabel()}
        </button>
      </div>

      <label class="field-label" for="midi-output">Send messages to</label>
      <select
        id="midi-output"
        value={props.selectedOutputId}
        onChange={(event) => props.onSelectionChange(event.currentTarget.value)}
        disabled={!props.connected || props.outputs.length === 0}
      >
        <option value="">{props.connected ? 'Select a MIDI output' : 'Connect MIDI first'}</option>
        <For each={props.outputs}>{(output) => <option value={output.id}>{output.label}</option>}</For>
      </select>
      <Show when={props.connected && props.outputs.length === 0}>
        <p class="field-note">Connect a MIDI device, then refresh outputs.</p>
      </Show>
    </section>
  )
}
