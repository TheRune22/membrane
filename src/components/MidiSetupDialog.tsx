import { MidiOutputSelector } from './MidiOutputSelector'
import { StatusMessage, type StatusKind } from './StatusMessage'
import type { MidiOutput } from '../midi/types'

interface MidiSetupDialogProps {
  connected: boolean
  connecting: boolean
  outputs: readonly MidiOutput[]
  selectedOutputId: string
  status: { kind: StatusKind; message: string }
  onRefresh: () => void
  onClose: () => void
  onSelectionChange: (outputId: string) => void
}

export function MidiSetupDialog(props: MidiSetupDialogProps) {
  return (
    <section class="midi-dialog" role="dialog" aria-labelledby="midi-setup-title">
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
      <StatusMessage kind={props.status.kind} message={props.status.message} />
    </section>
  )
}
