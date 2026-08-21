import { Show, createSignal, onCleanup, onMount } from 'solid-js'
import { ControllerHeader } from './components/ControllerHeader'
import { MidiSetupDialog } from './components/MidiSetupDialog'
import { OsmoseControlBank } from './components/OsmoseControlBank'
import { PresetBrowserDialog } from './components/PresetBrowserDialog'
import type { StatusKind } from './components/StatusMessage'
import { WebMidiService } from './midi/web-midi'
import type { MidiOutput } from './midi/types'
import { osmosePresets, type OsmosePreset } from './osmose/presets'

type Status = { kind: StatusKind; message: string }
type FaderAction = (output: MidiOutput, value: number) => void

const midi = new WebMidiService()
const osmoseFaderActions: Readonly<Record<string, FaderAction>> = {
  'macro-1': (output, value) => output.sendControlChange(1, 12, value),
  'macro-2': (output, value) => output.sendControlChange(1, 13, value),
  'macro-3': (output, value) => output.sendControlChange(1, 14, value),
  'macro-4': (output, value) => output.sendControlChange(1, 15, value),
  'macro-5': (output, value) => output.sendControlChange(1, 16, value),
  'macro-6': (output, value) => output.sendControlChange(1, 17, value),
  pregain: (output, value) => output.sendControlChange(1, 26, value),
  postgain: (output, value) => output.sendControlChange(1, 18, value),
  'compressor-threshold': (output, value) => output.sendControlChange(1, 90, value),
  'compressor-attack': (output, value) => output.sendControlChange(1, 91, value),
  'compressor-ratio': (output, value) => output.sendControlChange(1, 92, value),
  'compressor-mix': (output, value) => output.sendControlChange(1, 93, value),
  'effects-parameter-1': (output, value) => output.sendControlChange(1, 20, value),
  'effects-parameter-2': (output, value) => output.sendControlChange(1, 21, value),
  'effects-parameter-3': (output, value) => output.sendControlChange(1, 22, value),
  'effects-parameter-4': (output, value) => output.sendControlChange(1, 23, value),
  'effects-parameter-5': (output, value) => output.sendControlChange(1, 95, value),
  'effects-parameter-6': (output, value) => output.sendControlChange(1, 96, value),
  'effects-mix': (output, value) => output.sendControlChange(1, 24, value),
  'sostenuto-1': (output, value) => output.sendControlChange(1, 66, value),
  'sostenuto-2': (output, value) => output.sendControlChange(1, 69, value),
  sustain: (output, value) => output.sendControlChange(1, 64, value),
  'eq-tilt': (output, value) => output.sendControlChange(1, 83, value),
  'eq-frequency': (output, value) => output.sendControlChange(1, 84, value),
  'eq-mix': (output, value) => output.sendControlChange(1, 85, value),
}

export default function App() {
  const [outputs, setOutputs] = createSignal<readonly MidiOutput[]>([])
  const [selectedOutputId, setSelectedOutputId] = createSignal('')
  const [selectedPreset, setSelectedPreset] = createSignal<OsmosePreset>()
  const [isConnecting, setIsConnecting] = createSignal(false)
  const [isConnected, setIsConnected] = createSignal(false)
  const [isMidiSetupOpen, setIsMidiSetupOpen] = createSignal(true)
  const [isPresetBrowserOpen, setIsPresetBrowserOpen] = createSignal(false)
  const [controlValues, setControlValues] = createSignal<Readonly<Record<string, number>>>({})
  const [status, setStatus] = createSignal<Status>({ kind: 'neutral', message: 'Looking for available MIDI outputs.' })

  const unsubscribe = midi.onOutputsChanged((nextOutputs) => {
    setOutputs(nextOutputs)
    if (selectedOutputId() && !nextOutputs.some((output) => output.id === selectedOutputId())) {
      setSelectedOutputId('')
      setStatus({ kind: 'error', message: 'The selected MIDI output was disconnected.' })
      setIsMidiSetupOpen(true)
    }
  })
  onCleanup(unsubscribe)

  async function refreshMidiOutputs() {
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

  onMount(() => { void refreshMidiOutputs() })

  function selectOutput(outputId: string) {
    setSelectedOutputId(outputId)
    if (outputId) setIsMidiSetupOpen(false)
  }

  function selectedOutput() {
    return outputs().find((candidate) => candidate.id === selectedOutputId())
  }

  function handleFaderValueChange(id: string, value: number) {
    const output = selectedOutput()
    if (!output) {
      setStatus({ kind: 'error', message: 'Select an available MIDI output before using controls.' })
      setIsMidiSetupOpen(true)
      return
    }

    const action = osmoseFaderActions[id]
    if (!action) {
      setStatus({ kind: 'error', message: `No MIDI action is configured for ${id}.` })
      return
    }

    try {
      action(output, value)
      setControlValues((currentValues) => ({ ...currentValues, [id]: value }))
    } catch (error) {
      setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Unable to send the MIDI control change.' })
    }
  }

  function selectPreset(preset: OsmosePreset) {
    const output = selectedOutput()
    if (!output) return

    try {
      output.sendProgramChange(preset.bank, preset.program)
      setControlValues({})
      setSelectedPreset(preset)
      setIsPresetBrowserOpen(false)
    } catch (error) {
      setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Unable to select the preset.' })
      setIsMidiSetupOpen(true)
    }
  }

  return <main class="page-shell"><section class="controller" aria-labelledby="page-title">
    <ControllerHeader connected={isConnected()} presetSelectionEnabled={Boolean(selectedOutput())} selectedPreset={selectedPreset()} selectedMidiDevice={selectedOutput()?.label} onOpenMidiSetup={() => setIsMidiSetupOpen(true)} onOpenPresetBrowser={() => setIsPresetBrowserOpen(true)} />
    <div class="workspace">
      <OsmoseControlBank
        values={controlValues()}
        disabled={!selectedOutputId()}
        onFaderValueChange={handleFaderValueChange}
      />
    </div>
  </section>
  <Show when={isMidiSetupOpen()}><MidiSetupDialog connected={isConnected()} connecting={isConnecting()} outputs={outputs()} selectedOutputId={selectedOutputId()} status={status()} onRefresh={refreshMidiOutputs} onClose={() => setIsMidiSetupOpen(false)} onSelectionChange={selectOutput} /></Show>
  <Show when={isPresetBrowserOpen()}><PresetBrowserDialog presets={osmosePresets} selectedPreset={selectedPreset()} onClose={() => setIsPresetBrowserOpen(false)} onSelect={selectPreset} /></Show>
  </main>
}
