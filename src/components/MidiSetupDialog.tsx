import { MidiInputSelector } from './MidiInputSelector'
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
  onOutputSelectionChange: (outputId: string) => void
  onInputSelectionChange: (inputId: string) => void
}

export function MidiSetupDialog(props: MidiSetupDialogProps) {
  const refreshLabel = () => props.connecting ? 'Refreshing...' : 'Refresh MIDI ports'

  return (
    <div class="dialog-backdrop" role="presentation" onClick={(event) => {
      if (event.target === event.currentTarget) props.onClose()
    }}>
      <section class="midi-dialog" role="dialog" aria-modal="true" aria-labelledby="midi-setup-title">
        <div class="dialog-header">
          <div>
            <h2 id="midi-setup-title">MIDI setup</h2>
          </div>
          <div class="dialog-actions">
            <button class="secondary-button" type="button" onClick={props.onRefresh} disabled={props.connecting}>
              {refreshLabel()}
            </button>
            <button class="icon-button" type="button" onClick={props.onClose} aria-label="Close MIDI setup">×</button>
          </div>
        </div>
        <MidiOutputSelector
          connected={props.connected}
          outputs={props.outputs}
          selectedOutputId={props.selectedOutputId}
          onSelectionChange={props.onOutputSelectionChange}
        />
        <MidiInputSelector
          connected={props.connected}
          inputs={props.inputs}
          selectedInputId={props.selectedInputId}
          onSelectionChange={props.onInputSelectionChange}
        />
        <StatusMessage kind={props.status.kind} message={props.status.message} />
      </section>
    </div>
  )
}
