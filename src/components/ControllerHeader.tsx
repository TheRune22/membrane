import type { OsmosePresetAddress } from '../osmose/presets'

interface ControllerHeaderProps {
  connected: boolean
  presetSelectionEnabled: boolean
  selectedPreset: OsmosePresetAddress | undefined
  selectedMidiDevice: string | undefined
  patchLoading: boolean
  onOpenMidiSetup: () => void
  onOpenPresetBrowser: () => void
  onPatchFileSelected: (file: File) => void
}

export function ControllerHeader(props: ControllerHeaderProps) {
  const midiDeviceLabel = () => props.selectedMidiDevice ?? (props.connected ? 'Select MIDI output' : 'Set up MIDI access')
  let patchFileInput: HTMLInputElement | undefined

  function choosePatchFile() {
    patchFileInput?.click()
  }

  function selectPatchFile(event: Event) {
    const input = event.currentTarget as HTMLInputElement
    const file = input.files?.[0]
    input.value = ''
    if (file) props.onPatchFileSelected(file)
  }

  return (
    <header class="controller-header">
      <h1 id="page-title">Osmose Controller</h1>
      <div class="header-actions">
        <button
          classList={{ 'midi-device-button': true, ready: Boolean(props.selectedMidiDevice) }}
          type="button"
          onClick={props.onOpenMidiSetup}
          aria-label={props.selectedMidiDevice ? `Change MIDI device, currently ${props.selectedMidiDevice}` : midiDeviceLabel()}
        >
          <span class="midi-device-label">
            <span aria-hidden="true" />
            <span class="midi-device-name" title={props.selectedMidiDevice}>{midiDeviceLabel()}</span>
          </span>
        </button>
        <button
          class="preset-button"
          type="button"
          onClick={props.onOpenPresetBrowser}
          disabled={!props.presetSelectionEnabled}
          aria-label={props.selectedPreset ? `Change preset, currently ${props.selectedPreset.name}` : 'Choose a preset'}
        >
          <span class="preset-label">Preset</span>
          <span class="preset-current-name">{props.selectedPreset?.name ?? 'Select preset'}</span>
        </button>
        <input ref={patchFileInput} class="visually-hidden" type="file" accept=".mid,.midi,audio/midi" onChange={selectPatchFile} />
        <button
          class="secondary-button patch-load-button"
          type="button"
          onClick={choosePatchFile}
          disabled={!props.presetSelectionEnabled || props.patchLoading}
        >
          {props.patchLoading ? 'Loading patch…' : 'Load patch'}
        </button>
      </div>
    </header>
  )
}
