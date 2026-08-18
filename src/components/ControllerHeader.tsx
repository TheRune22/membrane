interface ControllerHeaderProps {
  connected: boolean
}

export function ControllerHeader(props: ControllerHeaderProps) {
  return (
    <header class="controller-header">
      <div>
        <p class="eyebrow">MIDI utility</p>
        <h1 id="page-title">MIDI Controller</h1>
      </div>
      <div classList={{ 'connection-indicator': true, connected: props.connected }}>
        <span aria-hidden="true" />
        {props.connected ? 'MIDI connected' : 'Not connected'}
      </div>
    </header>
  )
}
