export type MidiMessage = readonly number[]

export interface MidiOutput {
  readonly id: string
  readonly label: string
  send(messages: readonly MidiMessage[]): void
}

export interface MidiService {
  connect(): Promise<void>
  getOutputs(): readonly MidiOutput[]
  onOutputsChanged(listener: (outputs: readonly MidiOutput[]) => void): () => void
}
