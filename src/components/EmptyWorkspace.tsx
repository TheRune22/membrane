interface EmptyWorkspaceProps {
  onOpenMidiSetup: () => void
}

export function EmptyWorkspace(props: EmptyWorkspaceProps) {
  return (
    <section class="empty-workspace" aria-labelledby="workspace-heading">
      <p class="step">Osmose controller</p>
      <h2 id="workspace-heading">Choose a MIDI output to begin</h2>
      <p>Your Osmose parameter faders will fill this workspace once a device is selected.</p>
      <button class="secondary-button" type="button" onClick={props.onOpenMidiSetup}>Open MIDI setup</button>
    </section>
  )
}
