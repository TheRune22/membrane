import type { OsmosePresetAddress } from '../osmose/presets'

interface ControllerHeaderProps {
  midiReady: boolean
  presetSelectionEnabled: boolean
  selectedPreset: OsmosePresetAddress | undefined
  onOpenMidiSetup: () => void
  onOpenPresetBrowser: () => void
}

export function ControllerHeader(props: ControllerHeaderProps) {
  return (
    <header class="controller-header">
      <h1 id="page-title">Osmose Controller</h1>
      <div class="header-actions">
        <button
          classList={{ 'midi-device-button': true, ready: props.midiReady }}
          type="button"
          onClick={props.onOpenMidiSetup}
          aria-label={`${props.midiReady ? 'MIDI connected' : 'MIDI setup needed'}. Open MIDI setup.`}
        >
          <span class="midi-device-label">
            <span aria-hidden="true" />
            {props.midiReady ? 'MIDI connected' : 'MIDI setup needed'}
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
