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
      <h1 id="page-title">Osmose Controller</h1>
      <div class="header-actions">
        <button
          classList={{ 'midi-device-button': true, connected: props.connected }}
          type="button"
          onClick={props.onOpenMidiSetup}
          aria-label={props.selectedMidiDevice ? `Change MIDI device, currently ${props.selectedMidiDevice}` : 'Set up MIDI device'}
        >
          <span class="midi-device-label">
            <span aria-hidden="true" />
            <span class="midi-device-name" title={props.selectedMidiDevice}>{props.selectedMidiDevice ?? (props.connected ? 'MIDI connected' : 'MIDI setup')}</span>
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
      </div>
    </header>
  )
}
