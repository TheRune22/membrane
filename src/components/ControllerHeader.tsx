import type { OsmosePreset } from '../osmose/presets'

interface ControllerHeaderProps {
  connected: boolean
  presetSelectionEnabled: boolean
  selectedPreset: OsmosePreset | undefined
  currentPresetName: string | undefined
  selectedMidiDevice: string | undefined
  onOpenMidiSetup: () => void
  onOpenPresetBrowser: () => void
}

export function ControllerHeader(props: ControllerHeaderProps) {
  const midiDeviceLabel = () => props.selectedMidiDevice ?? (props.connected ? 'Select MIDI output' : 'Set up MIDI access')

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
          aria-label={props.currentPresetName || props.selectedPreset ? `Change preset, currently ${props.currentPresetName ?? props.selectedPreset?.name}` : 'Choose a preset'}
        >
          <span class="preset-label">Preset</span>
          <span class="preset-current-name">{props.currentPresetName ?? props.selectedPreset?.name ?? 'Select preset'}</span>
        </button>
      </div>
    </header>
  )
}
