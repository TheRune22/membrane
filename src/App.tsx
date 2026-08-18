import { Show, createSignal, onCleanup } from 'solid-js'
import { ControllerHeader } from './components/ControllerHeader'
import { ControlsPanel } from './components/ControlsPanel'
import { MidiOutputSelector } from './components/MidiOutputSelector'
import { StatusMessage, type StatusKind } from './components/StatusMessage'
import { WebMidiService } from './midi/web-midi'
import type { MidiOutput } from './midi/types'

type Status = { kind: StatusKind; message: string }

const midi = new WebMidiService()

export default function App() {
  const [outputs, setOutputs] = createSignal<readonly MidiOutput[]>([])
  const [selectedOutputId, setSelectedOutputId] = createSignal('')
  const [isConnecting, setIsConnecting] = createSignal(false)
  const [isConnected, setIsConnected] = createSignal(false)
  const [status, setStatus] = createSignal<Status>({
    kind: 'neutral',
    message: 'Connect MIDI to discover available outputs.',
  })

  const unsubscribe = midi.onOutputsChanged((nextOutputs) => {
    setOutputs(nextOutputs)

    if (selectedOutputId() && !nextOutputs.some((output) => output.id === selectedOutputId())) {
      setSelectedOutputId('')
      setStatus({ kind: 'error', message: 'The selected MIDI output was disconnected.' })
    }
  })
  onCleanup(unsubscribe)

  async function connectMidi() {
    setIsConnecting(true)
    try {
      await midi.connect()
      setIsConnected(true)
      const availableOutputs = midi.getOutputs()
      setOutputs(availableOutputs)

      if (availableOutputs.length === 0) {
        setStatus({ kind: 'neutral', message: 'Connected, but no MIDI outputs are available.' })
      } else {
        setStatus({ kind: 'success', message: `${availableOutputs.length} MIDI output${availableOutputs.length === 1 ? '' : 's'} found.` })
      }
    } catch (error) {
      setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Unable to access MIDI.' })
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <main class="page-shell">
      <section class="controller" aria-labelledby="page-title">
        <ControllerHeader connected={isConnected()} />

        <div class="divider" />

        <MidiOutputSelector
          connected={isConnected()}
          connecting={isConnecting()}
          outputs={outputs()}
          selectedOutputId={selectedOutputId()}
          onConnect={connectMidi}
          onSelectionChange={setSelectedOutputId}
        />

        <Show when={selectedOutputId()}>
          <div class="divider" />
          <ControlsPanel />
        </Show>

        <StatusMessage kind={status().kind} message={status().message} />
      </section>
    </main>
  )
}
