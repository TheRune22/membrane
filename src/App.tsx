import { Show, createSignal, onCleanup } from 'solid-js'
import { ControllerHeader } from './components/ControllerHeader'
import { MidiOutputSelector } from './components/MidiOutputSelector'
import { OsmoseControlBank } from './components/OsmoseControlBank'
import { StatusMessage, type StatusKind } from './components/StatusMessage'
import { WebMidiService } from './midi/web-midi'
import type { MidiOutput } from './midi/types'
import { osmoseParameters } from './osmose/parameters'

type Status = { kind: StatusKind; message: string }
const midi = new WebMidiService()

export default function App() {
  const [outputs, setOutputs] = createSignal<readonly MidiOutput[]>([])
  const [selectedOutputId, setSelectedOutputId] = createSignal('')
  const [isConnecting, setIsConnecting] = createSignal(false)
  const [isConnected, setIsConnected] = createSignal(false)
  const [controlValues, setControlValues] = createSignal<Readonly<Record<number, number>>>({})
  const [status, setStatus] = createSignal<Status>({ kind: 'neutral', message: 'Connect MIDI to discover available outputs.' })

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
      setStatus(availableOutputs.length === 0
        ? { kind: 'neutral', message: 'Connected, but no MIDI outputs are available.' }
        : { kind: 'success', message: `${availableOutputs.length} MIDI output${availableOutputs.length === 1 ? '' : 's'} found.` })
    } catch (error) {
      setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Unable to access MIDI.' })
    } finally {
      setIsConnecting(false)
    }
  }

  function sendControlChange(controlChange: number, value: number) {
    const output = outputs().find((candidate) => candidate.id === selectedOutputId())
    if (!output) {
      setStatus({ kind: 'error', message: 'Select an available MIDI output before using controls.' })
      return
    }

    try {
      output.sendControlChange(controlChange, value)
      setControlValues((currentValues) => ({ ...currentValues, [controlChange]: value }))
    } catch (error) {
      setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Unable to send the MIDI control change.' })
    }
  }

  return <main class="page-shell"><section class="controller" aria-labelledby="page-title">
    <ControllerHeader connected={isConnected()} />
    <div class="divider" />
    <MidiOutputSelector connected={isConnected()} connecting={isConnecting()} outputs={outputs()} selectedOutputId={selectedOutputId()} onConnect={connectMidi} onSelectionChange={setSelectedOutputId} />
    <Show when={selectedOutputId()}><div class="divider" /><OsmoseControlBank parameters={osmoseParameters} values={controlValues()} onValueChange={sendControlChange} /></Show>
    <StatusMessage kind={status().kind} message={status().message} />
  </section></main>
}
