export interface MidiOutput {
  readonly id: string
  readonly label: string
  send(data: Uint8Array): void
}

export interface MidiService {
  connect(): Promise<void>
  getOutputs(): readonly MidiOutput[]
  onOutputsChanged(listener: (outputs: readonly MidiOutput[]) => void): () => void
}
