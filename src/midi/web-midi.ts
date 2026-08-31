import type { MidiInput, MidiMessage, MidiOutput, MidiService, ScheduledMidiMessage } from './types'

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

  sendScheduled(messages: readonly ScheduledMidiMessage[]) {
    if (this.port.state === 'disconnected') throw new Error('The selected MIDI output is no longer connected.')
    const startTime = performance.now()
    messages.forEach(({ message, timestamp }) => this.port.send(message, startTime + timestamp))
  }
}

class BrowserMidiInput implements MidiInput {
  constructor(private readonly port: MIDIInput) {}

  get id() { return this.port.id }
  get label() {
    const name = this.port.name ?? 'Unnamed MIDI input'
    return this.port.manufacturer ? `${this.port.manufacturer} — ${name}` : name
  }

  onMessage(listener: (message: MidiMessage) => void) {
    const receive = (event: MIDIMessageEvent) => {
      if (event.data) listener([...event.data])
    }
    this.port.addEventListener('midimessage', receive)
    return () => this.port.removeEventListener('midimessage', receive)
  }
}

export class WebMidiService implements MidiService {
  private access: MIDIAccess | undefined
  private readonly outputListeners = new Set<(outputs: readonly MidiOutput[]) => void>()
  private readonly inputListeners = new Set<(inputs: readonly MidiInput[]) => void>()

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

  getInputs(): readonly MidiInput[] {
    if (!this.access) return []
    return [...this.access.inputs.values()].filter((input) => input.state === 'connected').map((input) => new BrowserMidiInput(input))
  }

  onOutputsChanged(listener: (outputs: readonly MidiOutput[]) => void) {
    this.outputListeners.add(listener)
    listener(this.getOutputs())
    return () => this.outputListeners.delete(listener)
  }

  onInputsChanged(listener: (inputs: readonly MidiInput[]) => void) {
    this.inputListeners.add(listener)
    listener(this.getInputs())
    return () => this.inputListeners.delete(listener)
  }

  private notifyListeners() {
    const outputs = this.getOutputs()
    const inputs = this.getInputs()
    this.outputListeners.forEach((listener) => listener(outputs))
    this.inputListeners.forEach((listener) => listener(inputs))
  }
}
