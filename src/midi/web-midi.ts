import type { MidiMessage, MidiOutput, MidiService } from './types'

class BrowserMidiOutput implements MidiOutput {
  constructor(private readonly port: MIDIOutput) {}

  get id() { return this.port.id }
  get label() {
    const name = this.port.name ?? 'Unnamed MIDI output'
    return this.port.manufacturer ? `${this.port.manufacturer} — ${name}` : name
  }

  send(messages: readonly MidiMessage[]) {
    if (this.port.state === 'disconnected') throw new Error('The selected MIDI output is no longer connected.')
    this.port.send(messages.flat())
  }
}

export class WebMidiService implements MidiService {
  private access: MIDIAccess | undefined
  private readonly listeners = new Set<(outputs: readonly MidiOutput[]) => void>()

  async connect() {
    if (!window.isSecureContext) {
      throw new Error('Web MIDI requires a secure HTTPS connection. Open this page over HTTPS and try again.')
    }

    if (!navigator.requestMIDIAccess) throw new Error('Web MIDI is unavailable in this browser. Please use a Chromium-based browser.')

    if (this.access) this.access.onstatechange = null
    this.access = await navigator.requestMIDIAccess()
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
