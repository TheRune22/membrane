import { Show, createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { ControllerHeader } from './components/ControllerHeader'
import { MidiSetupDialog } from './components/MidiSetupDialog'
import { OsmoseControlBank } from './components/OsmoseControlBank'
import { PresetBrowserDialog } from './components/PresetBrowserDialog'
import type { StatusKind } from './components/StatusMessage'
import { WebMidiService } from './midi/web-midi'
import { parseMidiFile } from './midi/file'
import type { MidiInput, MidiMessage, MidiOutput } from './midi/types'
import { findOsmosePresetByName, osmosePresets, type OsmosePreset, type OsmosePresetAddress } from './osmose/presets'
import { loadPatchFile, requestCurrentPreset, setPreset } from './osmose/protocol'
import { macroLabelsFromSnapshot, OsmoseSnapshotParser } from './osmose/snapshot'
import { downloadPatchstorageMidiFile, listEaganMatrixPatches, type PatchstoragePatch } from './osmose/patchstorage'

type Status = { kind: StatusKind; message: string }
const midi = new WebMidiService()
const preferredOsmoseOutputLabel = 'MIDIOUT2 (Osmose)'
const preferredOsmoseInputLabel = 'MIDIIN2 (Osmose)'
export default function App() {
  const [outputs, setOutputs] = createSignal<readonly MidiOutput[]>([])
  const [inputs, setInputs] = createSignal<readonly MidiInput[]>([])
  const [selectedOutputId, setSelectedOutputId] = createSignal('')
  const [selectedInputId, setSelectedInputId] = createSignal('')
  const [selectedPreset, setSelectedPreset] = createSignal<OsmosePresetAddress>()
  const [macroLabels, setMacroLabels] = createSignal<Readonly<Partial<Record<string, string>>>>({})
  const [isConnecting, setIsConnecting] = createSignal(false)
  const [isConnected, setIsConnected] = createSignal(false)
  const [isMidiSetupOpen, setIsMidiSetupOpen] = createSignal(true)
  const [isPresetBrowserOpen, setIsPresetBrowserOpen] = createSignal(false)
  const [isPatchLoading, setIsPatchLoading] = createSignal(false)
  const [isPatchstorageLoading, setIsPatchstorageLoading] = createSignal(false)
  const [patchstoragePatches, setPatchstoragePatches] = createSignal<readonly PatchstoragePatch[]>([])
  const [patchstorageError, setPatchstorageError] = createSignal<string>()
  const [controlValues, setControlValues] = createSignal<Readonly<Record<string, number>>>({})
  const [status, setStatus] = createSignal<Status>({ kind: 'neutral', message: 'Looking for available MIDI outputs.' })
  const snapshotParser = new OsmoseSnapshotParser()
  let stopReceiving: (() => void) | undefined
  let patchLoadTimeout: number | undefined

  createEffect(() => {
    if (selectedOutputId() && selectedInputId()) requestCurrentPresetState()
  })

  const unsubscribe = midi.onOutputsChanged((nextOutputs) => {
    setOutputs(nextOutputs)
    if (selectedOutputId() && !nextOutputs.some((output) => output.id === selectedOutputId())) {
      setSelectedOutputId('')
      setStatus({ kind: 'error', message: 'The selected MIDI output was disconnected.' })
      setIsMidiSetupOpen(true)
    }

    if (!selectedOutputId()) {
      const osmoseOutput = nextOutputs.find((output) => output.label === preferredOsmoseOutputLabel)
      if (osmoseOutput) {
        setSelectedOutputId(osmoseOutput.id)
        setIsMidiSetupOpen(false)
      }
    }
  })
  const unsubscribeInputs = midi.onInputsChanged((nextInputs) => {
    setInputs(nextInputs)
    if (selectedInputId() && !nextInputs.some((input) => input.id === selectedInputId())) {
      selectInput('')
      setStatus({ kind: 'error', message: 'The selected MIDI input was disconnected.' })
    }
    if (!selectedInputId()) {
      const osmoseInput = nextInputs.find((input) => input.label === preferredOsmoseInputLabel)
      if (osmoseInput) selectInput(osmoseInput.id)
    }
  })
  onCleanup(() => {
    unsubscribe()
    unsubscribeInputs()
    stopReceiving?.()
    if (patchLoadTimeout !== undefined) window.clearTimeout(patchLoadTimeout)
  })

  async function refreshMidiOutputs() {
    setIsConnecting(true)
    try {
      await midi.connect()
      setIsConnected(true)
      const availableOutputs = midi.getOutputs()
      setOutputs(availableOutputs)
      setInputs(midi.getInputs())
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

  function selectInput(inputId: string) {
    stopReceiving?.()
    stopReceiving = undefined
    snapshotParser.reset()
    const input = inputs().find((candidate) => candidate.id === inputId)
    if (!input) {
      setSelectedInputId('')
      return
    }
    stopReceiving = input.onMessage(handleIncomingMessage)
    setSelectedInputId(inputId)
  }

  function selectedOutput() {
    return outputs().find((candidate) => candidate.id === selectedOutputId())
  }

  function handleIncomingMessage(message: MidiMessage) {
    const snapshot = snapshotParser.push(message)
    if (!snapshot) return
    setSelectedPreset(findOsmosePresetByName(osmosePresets, snapshot.name) ?? snapshot)
    setMacroLabels(macroLabelsFromSnapshot(snapshot))
    setControlValues(snapshot.controlValues)
    setStatus({ kind: 'success', message: `Loaded current Osmose preset: ${snapshot.name}.` })
  }

  function requestCurrentPresetState() {
    const output = selectedOutput()
    if (!output || !selectedInputId()) return
    try {
      output.send(requestCurrentPreset())
    } catch (error) {
      setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Unable to read the current Osmose preset.' })
    }
  }

  function handleFaderValueChange(id: string, value: number, messages: readonly MidiMessage[]) {
    const output = selectedOutput()
    if (!output) {
      setStatus({ kind: 'error', message: 'Select an available MIDI output before using controls.' })
      setIsMidiSetupOpen(true)
      return
    }

    try {
      output.send(messages)
      setControlValues((currentValues) => ({ ...currentValues, [id]: value }))
    } catch (error) {
      setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Unable to send the MIDI control change.' })
    }
  }

  function selectPreset(preset: OsmosePreset) {
    const output = selectedOutput()
    if (!output) return

    try {
      output.send(setPreset(preset))
      setSelectedPreset(preset)
      setIsPresetBrowserOpen(false)
    } catch (error) {
      setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Unable to select the preset.' })
      setIsMidiSetupOpen(true)
    }
  }

  async function loadPatch(fileName: string, contents: ArrayBuffer): Promise<boolean> {
    const output = selectedOutput()
    if (!output) {
      setStatus({ kind: 'error', message: 'Select an available MIDI output before loading a patch.' })
      setIsMidiSetupOpen(true)
      return false
    }

    setIsPatchLoading(true)
    try {
      const messages = parseMidiFile(contents)
      const scheduledMessages = loadPatchFile(messages, fileName)
      output.sendScheduled(scheduledMessages)
      const completionDelay = Math.max(...scheduledMessages.map(({ timestamp }) => timestamp)) + 1
      patchLoadTimeout = window.setTimeout(() => {
        setIsPatchLoading(false)
        setStatus({ kind: 'success', message: `Loaded patch from ${fileName}.` })
        patchLoadTimeout = undefined
      }, completionDelay)
      return true
    } catch (error) {
      setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Unable to load the patch MIDI file.' })
      setIsPatchLoading(false)
      return false
    }
  }

  async function loadPatchFromFile(file: File) {
    await loadPatch(file.name, await file.arrayBuffer())
  }

  async function refreshPatchstoragePatches() {
    setIsPatchstorageLoading(true)
    setPatchstorageError(undefined)
    try {
      setPatchstoragePatches(await listEaganMatrixPatches())
    } catch (error) {
      setPatchstorageError(error instanceof Error ? error.message : 'Unable to load Patchstorage patches.')
    } finally {
      setIsPatchstorageLoading(false)
    }
  }

  function openPatchstorageTab() {
    if (patchstoragePatches().length === 0) void refreshPatchstoragePatches()
  }

  async function loadPatchFromPatchstorage(patch: PatchstoragePatch) {
    setIsPatchLoading(true)
    try {
      const file = await downloadPatchstorageMidiFile(patch)
      if (await loadPatch(file.fileName, file.contents)) setIsPresetBrowserOpen(false)
    } catch (error) {
      setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Unable to load the Patchstorage MIDI file.' })
      setIsPatchLoading(false)
      return false
    }
  }

  return <main class="page-shell"><section class="controller" aria-labelledby="page-title">
    <ControllerHeader connected={isConnected()} presetSelectionEnabled={Boolean(selectedOutput())} selectedPreset={selectedPreset()} selectedMidiOutput={selectedOutput()?.label} selectedMidiInput={inputs().find((input) => input.id === selectedInputId())?.label} onOpenMidiSetup={() => setIsMidiSetupOpen(true)} onOpenPresetBrowser={() => setIsPresetBrowserOpen(true)} />
    <div class="workspace">
      <OsmoseControlBank
        values={controlValues()}
        macroLabels={macroLabels()}
        disabled={!selectedOutputId()}
        onFaderValueChange={handleFaderValueChange}
      />
    </div>
  </section>
  <Show when={isMidiSetupOpen()}><MidiSetupDialog connected={isConnected()} connecting={isConnecting()} outputs={outputs()} inputs={inputs()} selectedOutputId={selectedOutputId()} selectedInputId={selectedInputId()} status={status()} onRefresh={refreshMidiOutputs} onClose={() => setIsMidiSetupOpen(false)} onOutputSelectionChange={selectOutput} onInputSelectionChange={selectInput} /></Show>
  <Show when={isPresetBrowserOpen()}><PresetBrowserDialog presets={osmosePresets} selectedPreset={selectedPreset()} patchLoading={isPatchLoading()} patchstorageLoading={isPatchstorageLoading()} patchstoragePatches={patchstoragePatches()} patchstorageError={patchstorageError()} onClose={() => setIsPresetBrowserOpen(false)} onSelect={selectPreset} onPatchFileSelected={loadPatchFromFile} onPatchstorageTabOpen={openPatchstorageTab} onRefreshPatchstorage={refreshPatchstoragePatches} onSelectPatchstoragePatch={loadPatchFromPatchstorage} /></Show>
  </main>
}
