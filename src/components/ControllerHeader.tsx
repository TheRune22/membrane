import type { OsmosePreset } from '../osmose/presets'

interface ControllerHeaderProps {
  connected: boolean
  presetSelectionEnabled: boolean
  selectedPreset: OsmosePreset | undefined
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
        <button classList={{ 'connection-button': true, connected: props.connected }} type="button" onClick={props.onOpenMidiSetup}>
          <span aria-hidden="true" />
          {props.connected ? 'MIDI connected' : 'Set up MIDI'}
        </button>
      </div>
    </header>
  )
}
