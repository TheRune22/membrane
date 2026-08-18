import type { OsmosePreset } from '../osmose/presets'

interface ControllerHeaderProps {
  connected: boolean
  presetSelectionEnabled: boolean
  selectedPreset: OsmosePreset | undefined
  selectedMidiDevice: string | undefined
  onOpenMidiSetup: () => void
  onOpenPresetBrowser: () => void
}

export function ControllerHeader(props: ControllerHeaderProps) {
  return (
    <header class="controller-header">
      <div>
        <h1 id="page-title">Osmose Controller</h1>
      </div>
      <div class="header-actions">
        <button
          class="preset-button"
          type="button"
          onClick={props.onOpenPresetBrowser}
          disabled={!props.presetSelectionEnabled}
          aria-label={props.selectedPreset ? `Change preset, currently ${props.selectedPreset.name}` : 'Choose a preset'}
        >
          <span class="preset-label">Current preset</span>
          <span class="preset-current-name">{props.selectedPreset?.name ?? 'No preset selected'}</span>
          <span class="preset-change">Change</span>
        </button>
        <button
          classList={{ 'midi-device-button': true, connected: props.connected }}
          type="button"
          onClick={props.onOpenMidiSetup}
          aria-label={props.selectedMidiDevice ? `Change MIDI device, currently ${props.selectedMidiDevice}` : 'Set up MIDI device'}
        >
          <span class="midi-device-label"><span aria-hidden="true" />MIDI device</span>
          <span class="midi-device-name">{props.selectedMidiDevice ?? 'No device selected'}</span>
          <span class="midi-device-change">Change</span>
        </button>
      </div>
    </header>
  )
}
