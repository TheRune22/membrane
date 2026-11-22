import { MidiInputSelector } from './MidiInputSelector'
import { MidiOutputSelector } from './MidiOutputSelector'
import { StatusMessage, type StatusKind } from './StatusMessage'
import type { MidiInput, MidiOutput } from '../midi/types'

interface MidiSetupDialogProps {
  connected: boolean
  connecting: boolean
  outputs: readonly MidiOutput[]
  inputs: readonly MidiInput[]
  hakenOutputId: string
  soundEngineOutputId: string
  hakenInputId: string
  status: { kind: StatusKind; message: string }
  onRefresh: () => void
  onClose: () => void
  onHakenOutputSelectionChange: (outputId: string) => void
  onSoundEngineOutputSelectionChange: (outputId: string) => void
  onHakenInputSelectionChange: (inputId: string) => void
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
          title="Haken output"
          id="haken-output"
          connected={props.connected}
          outputs={props.outputs}
          selectedOutputId={props.hakenOutputId}
          onSelectionChange={props.onHakenOutputSelectionChange}
        />
        <MidiOutputSelector
          title="Sound engine output"
          id="sound-engine-output"
          connected={props.connected}
          outputs={props.outputs}
          selectedOutputId={props.soundEngineOutputId}
          onSelectionChange={props.onSoundEngineOutputSelectionChange}
        />
        <MidiInputSelector
          connected={props.connected}
          inputs={props.inputs}
          selectedInputId={props.hakenInputId}
          onSelectionChange={props.onHakenInputSelectionChange}
        />
        <StatusMessage kind={props.status.kind} message={props.status.message} />
      </section>
    </div>
  )
}
