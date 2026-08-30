import { For, Show } from 'solid-js'
import { MidiOutputSelector } from './MidiOutputSelector'
import { StatusMessage, type StatusKind } from './StatusMessage'
import type { MidiInput, MidiOutput } from '../midi/types'

interface MidiSetupDialogProps {
  connected: boolean
  connecting: boolean
  outputs: readonly MidiOutput[]
  inputs: readonly MidiInput[]
  selectedOutputId: string
  selectedInputId: string
  status: { kind: StatusKind; message: string }
  onRefresh: () => void
  onClose: () => void
  onSelectionChange: (outputId: string) => void
  onInputSelectionChange: (inputId: string) => void
}

export function MidiSetupDialog(props: MidiSetupDialogProps) {
  return (
    <div class="dialog-backdrop" role="presentation" onClick={(event) => {
      if (event.target === event.currentTarget) props.onClose()
    }}>
      <section class="midi-dialog" role="dialog" aria-modal="true" aria-labelledby="midi-setup-title">
        <div class="dialog-header">
          <div>
            <h2 id="midi-setup-title">MIDI setup</h2>
          </div>
          <button class="icon-button" type="button" onClick={props.onClose} aria-label="Close MIDI setup">×</button>
        </div>
        <MidiOutputSelector
          connected={props.connected}
          connecting={props.connecting}
          outputs={props.outputs}
          selectedOutputId={props.selectedOutputId}
          onRefresh={props.onRefresh}
          onSelectionChange={props.onSelectionChange}
        />
        <section class="control-group" aria-labelledby="input-heading">
          <div class="section-heading"><h2 id="input-heading">MIDI input</h2></div>
          <label class="field-label" for="midi-input">Receive Osmose state from</label>
          <select id="midi-input" value={props.selectedInputId} onChange={(event) => props.onInputSelectionChange(event.currentTarget.value)} disabled={!props.connected || props.inputs.length === 0}>
            <option value="">{props.connected ? 'Select a MIDI input' : 'MIDI access unavailable'}</option>
            <For each={props.inputs}>{(input) => <option value={input.id}>{input.label}</option>}</For>
          </select>
          <Show when={props.connected && props.inputs.length === 0}><p class="field-note">Connect the Osmose MIDI input, then refresh MIDI access.</p></Show>
        </section>
        <StatusMessage kind={props.status.kind} message={props.status.message} />
      </section>
    </div>
  )
}
