import type { OsmosePresetAddress } from '../osmose/presets'

interface ControllerHeaderProps {
  connected: boolean
  presetSelectionEnabled: boolean
  selectedPreset: OsmosePresetAddress | undefined
  selectedMidiOutput: string | undefined
  selectedMidiInput: string | undefined
  onOpenMidiSetup: () => void
  onOpenPresetBrowser: () => void
}

export function ControllerHeader(props: ControllerHeaderProps) {
  const midiOutputLabel = () => props.selectedMidiOutput ?? (props.connected ? 'Select MIDI output' : 'Set up MIDI access')
  const midiInputLabel = () => props.selectedMidiInput ?? (props.connected ? 'Select MIDI input' : 'Set up MIDI access')

  return (
    <header class="controller-header">
      <h1 id="page-title">Osmose Controller</h1>
      <div class="header-actions">
        <button
          classList={{ 'midi-device-button': true, ready: Boolean(props.selectedMidiOutput) }}
          type="button"
          onClick={props.onOpenMidiSetup}
          aria-label={`Change MIDI devices. Input: ${midiInputLabel()}. Output: ${midiOutputLabel()}.`}
        >
          <span class="midi-device-label">
            <span aria-hidden="true" />
            <span class="midi-device-details">
              <span class="midi-device-name" title={props.selectedMidiOutput}>{midiOutputLabel()}</span>
              <span class="midi-device-name" title={props.selectedMidiInput}>{midiInputLabel()}</span>
            </span>
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
