export interface MidiOutput {
  readonly id: string
  readonly label: string
  sendControlChange(channel: number, controlChange: number, value: number): void
  sendProgramChange(bank: number, program: number): void
}

export interface MidiService {
  connect(): Promise<void>
  getOutputs(): readonly MidiOutput[]
  onOutputsChanged(listener: (outputs: readonly MidiOutput[]) => void): () => void
}
