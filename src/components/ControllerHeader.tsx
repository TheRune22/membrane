interface ControllerHeaderProps {
  connected: boolean
  onOpenMidiSetup: () => void
}

export function ControllerHeader(props: ControllerHeaderProps) {
  return (
    <header class="controller-header">
      <div>
        <p class="eyebrow">MIDI utility</p>
        <h1 id="page-title">MIDI Controller</h1>
      </div>
      <button classList={{ 'connection-button': true, connected: props.connected }} type="button" onClick={props.onOpenMidiSetup}>
        <span aria-hidden="true" />
        {props.connected ? 'MIDI connected' : 'Set up MIDI'}
      </button>
    </header>
  )
}
