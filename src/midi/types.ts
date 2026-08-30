export type MidiMessage = readonly number[]

export interface MidiOutput {
  readonly id: string
  readonly label: string
  send(messages: readonly MidiMessage[]): void
}

export interface MidiInput {
  readonly id: string
  readonly label: string
  onMessage(listener: (message: MidiMessage) => void): () => void
}

export interface MidiService {
  connect(): Promise<void>
  getOutputs(): readonly MidiOutput[]
  getInputs(): readonly MidiInput[]
  onOutputsChanged(listener: (outputs: readonly MidiOutput[]) => void): () => void
  onInputsChanged(listener: (inputs: readonly MidiInput[]) => void): () => void
}
