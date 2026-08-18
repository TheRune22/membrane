import type { MidiOutput, MidiService } from './types'

class BrowserMidiOutput implements MidiOutput {
  constructor(private readonly port: MIDIOutput) {}

  get id() { return this.port.id }
  get label() {
    const name = this.port.name ?? 'Unnamed MIDI output'
    return this.port.manufacturer ? `${this.port.manufacturer} — ${name}` : name
  }

  sendControlChange(controlChange: number, value: number) {
    if (this.port.state === 'disconnected') throw new Error('The selected MIDI output is no longer connected.')
    if (!Number.isInteger(controlChange) || controlChange < 0 || controlChange > 127) throw new Error('The MIDI control change must be between 0 and 127.')
    if (!Number.isInteger(value) || value < 0 || value > 127) throw new Error('The MIDI control value must be between 0 and 127.')

    this.port.send([0xb0, controlChange, value])
  }
}

export class WebMidiService implements MidiService {
  private access: MIDIAccess | undefined
  private readonly listeners = new Set<(outputs: readonly MidiOutput[]) => void>()

  async connect() {
    if (!navigator.requestMIDIAccess) throw new Error('Web MIDI is unavailable in this browser. Please use a Chromium-based browser.')

    this.access ??= await navigator.requestMIDIAccess()
    this.access.onstatechange = () => this.notifyListeners()
    this.notifyListeners()
  }

  getOutputs(): readonly MidiOutput[] {
    if (!this.access) return []
    return [...this.access.outputs.values()].filter((output) => output.state === 'connected').map((output) => new BrowserMidiOutput(output))
  }

  onOutputsChanged(listener: (outputs: readonly MidiOutput[]) => void) {
    this.listeners.add(listener)
    listener(this.getOutputs())
    return () => this.listeners.delete(listener)
  }

  private notifyListeners() {
    const outputs = this.getOutputs()
    this.listeners.forEach((listener) => listener(outputs))
  }
}
