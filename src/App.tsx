import { Show, createSignal, onCleanup } from 'solid-js'
import { ControllerHeader } from './components/ControllerHeader'
import { EmptyWorkspace } from './components/EmptyWorkspace'
import { MidiSetupDialog } from './components/MidiSetupDialog'
import { OsmoseControlBank } from './components/OsmoseControlBank'
import { PresetBrowserDialog } from './components/PresetBrowserDialog'
import type { StatusKind } from './components/StatusMessage'
import { WebMidiService } from './midi/web-midi'
import type { MidiOutput } from './midi/types'
import { osmoseParameters } from './osmose/parameters'
import { osmosePresets, type OsmosePreset } from './osmose/presets'

type Status = { kind: StatusKind; message: string }
const midi = new WebMidiService()

export default function App() {
  const [outputs, setOutputs] = createSignal<readonly MidiOutput[]>([])
  const [selectedOutputId, setSelectedOutputId] = createSignal('')
  const [selectedPreset, setSelectedPreset] = createSignal<OsmosePreset>()
  const [isConnecting, setIsConnecting] = createSignal(false)
  const [isConnected, setIsConnected] = createSignal(false)
  const [isMidiSetupOpen, setIsMidiSetupOpen] = createSignal(true)
  const [isPresetBrowserOpen, setIsPresetBrowserOpen] = createSignal(false)
  const [controlValues, setControlValues] = createSignal<Readonly<Record<number, number>>>({})
  const [status, setStatus] = createSignal<Status>({ kind: 'neutral', message: 'Connect MIDI to discover available outputs.' })

  const unsubscribe = midi.onOutputsChanged((nextOutputs) => {
    setOutputs(nextOutputs)
    if (selectedOutputId() && !nextOutputs.some((output) => output.id === selectedOutputId())) {
      setSelectedOutputId('')
      setStatus({ kind: 'error', message: 'The selected MIDI output was disconnected.' })
      setIsMidiSetupOpen(true)
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

  function selectOutput(outputId: string) {
    setSelectedOutputId(outputId)
    if (outputId) setIsMidiSetupOpen(false)
  }

  function selectedOutput() {
    return outputs().find((candidate) => candidate.id === selectedOutputId())
  }

  function sendControlChange(controlChange: number, value: number) {
    const output = selectedOutput()
    if (!output) {
      setStatus({ kind: 'error', message: 'Select an available MIDI output before using controls.' })
      setIsMidiSetupOpen(true)
      return
    }

    try {
      output.sendControlChange(controlChange, value)
      setControlValues((currentValues) => ({ ...currentValues, [controlChange]: value }))
    } catch (error) {
      setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Unable to send the MIDI control change.' })
    }
  }

  function selectPreset(preset: OsmosePreset) {
    const output = selectedOutput()
    if (!output) return

    try {
      output.sendProgramChange(preset.bank, preset.program)
      setSelectedPreset(preset)
      setIsPresetBrowserOpen(false)
    } catch (error) {
      setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Unable to select the preset.' })
      setIsMidiSetupOpen(true)
    }
  }

  return <main class="page-shell"><section class="controller" aria-labelledby="page-title">
    <ControllerHeader connected={isConnected()} presetSelectionEnabled={Boolean(selectedOutput())} onOpenMidiSetup={() => setIsMidiSetupOpen(true)} onOpenPresetBrowser={() => setIsPresetBrowserOpen(true)} />
    <div class="workspace">
      <Show when={selectedOutputId()} fallback={<EmptyWorkspace onOpenMidiSetup={() => setIsMidiSetupOpen(true)} />}>
        <OsmoseControlBank parameters={osmoseParameters} values={controlValues()} onValueChange={sendControlChange} />
      </Show>
    </div>
  </section>
  <Show when={isMidiSetupOpen()}><MidiSetupDialog connected={isConnected()} connecting={isConnecting()} outputs={outputs()} selectedOutputId={selectedOutputId()} status={status()} onConnect={connectMidi} onClose={() => setIsMidiSetupOpen(false)} onSelectionChange={selectOutput} /></Show>
  <Show when={isPresetBrowserOpen()}><PresetBrowserDialog presets={osmosePresets} selectedPreset={selectedPreset()} onClose={() => setIsPresetBrowserOpen(false)} onSelect={selectPreset} /></Show>
  </main>
}
