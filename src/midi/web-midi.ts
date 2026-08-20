import type { MidiOutput, MidiService } from './types'

class BrowserMidiOutput implements MidiOutput {
  constructor(private readonly port: MIDIOutput) {}

  get id() { return this.port.id }
  get label() {
    const name = this.port.name ?? 'Unnamed MIDI output'
    return this.port.manufacturer ? `${this.port.manufacturer} — ${name}` : name
  }

  sendControlChange(channel: number, controlChange: number, value: number) {
    if (this.port.state === 'disconnected') throw new Error('The selected MIDI output is no longer connected.')
    if (!Number.isInteger(channel) || channel < 1 || channel > 16) throw new Error('The MIDI channel must be between 1 and 16.')
    if (!Number.isInteger(controlChange) || controlChange < 0 || controlChange > 127) throw new Error('The MIDI control change must be between 0 and 127.')
    if (!Number.isInteger(value) || value < 0 || value > 127) throw new Error('The MIDI control value must be between 0 and 127.')

    this.port.send([0xb0 + channel - 1, controlChange, value])
  }

  sendProgramChange(bank: number, program: number) {
    if (this.port.state === 'disconnected') throw new Error('The selected MIDI output is no longer connected.')
    if (!Number.isInteger(bank) || bank < 0 || bank > 127) throw new Error('The MIDI bank must be between 0 and 127.')
    if (!Number.isInteger(program) || program < 0 || program > 127) throw new Error('The MIDI program must be between 0 and 127.')

    this.port.send([0xb0, 0, bank])
    this.port.send([0xc0, program])
  }
}

export class WebMidiService implements MidiService {
  private access: MIDIAccess | undefined
  private readonly listeners = new Set<(outputs: readonly MidiOutput[]) => void>()

  async connect() {
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
