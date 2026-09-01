import { Fader } from './Fader'
import { controlChangeAction, type MidiAction } from '../osmose/protocol'
import type { MidiMessage } from '../midi/types'

type Group = 'macro' | 'compressor' | 'effects' | 'performance' | 'equalizer'
interface Props { values: Readonly<Record<string, number>>; macroLabels: Readonly<Partial<Record<string, string>>>; disabled: boolean; onFaderValueChange: (id: string, value: number, messages: readonly MidiMessage[]) => void }

export function OsmoseControlBank(props: Props) {
  function FaderWrapper(p: { id: string; name: string; label: string; group: Group; action: MidiAction }) {
    return <Fader {...p} values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange(p.id, value, p.action(value))} />
  }
  return <section class="control-bank" aria-label="Osmose controls">
    <section class="control-section control-section-macro" aria-labelledby="macro-heading"><h2 id="macro-heading">Macros</h2><div class="section-fader-grid">
      <FaderWrapper id="macro-1" name="Macro 1" label={props.macroLabels['macro-1'] ?? 'M1'} group="macro" action={controlChangeAction(12)} />
      <FaderWrapper id="macro-2" name="Macro 2" label={props.macroLabels['macro-2'] ?? 'M2'} group="macro" action={controlChangeAction(13)} />
      <FaderWrapper id="macro-3" name="Macro 3" label={props.macroLabels['macro-3'] ?? 'M3'} group="macro" action={controlChangeAction(14)} />
      <FaderWrapper id="macro-4" name="Macro 4" label={props.macroLabels['macro-4'] ?? 'M4'} group="macro" action={controlChangeAction(15)} />
      <FaderWrapper id="macro-5" name="Macro 5" label={props.macroLabels['macro-5'] ?? 'M5'} group="macro" action={controlChangeAction(16)} />
      <FaderWrapper id="macro-6" name="Macro 6" label={props.macroLabels['macro-6'] ?? 'M6'} group="macro" action={controlChangeAction(17)} />
    </div></section>
    <section class="control-section control-section-compressor" aria-labelledby="compressor-heading"><h2 id="compressor-heading">Compressor</h2><div class="section-fader-grid">
      <FaderWrapper id="compressor-threshold" name="Compressor Threshold" label="Threshold" group="compressor" action={controlChangeAction(90)} />
      <FaderWrapper id="compressor-attack" name="Compressor Attack" label="Attack" group="compressor" action={controlChangeAction(91)} />
      <FaderWrapper id="compressor-ratio" name="Compressor Ratio" label="Ratio" group="compressor" action={controlChangeAction(92)} />
      <FaderWrapper id="pregain" name="Pregain" label="Pregain" group="compressor" action={controlChangeAction(26)} />
      <FaderWrapper id="postgain" name="Postgain" label="Postgain" group="compressor" action={controlChangeAction(18)} />
      <FaderWrapper id="compressor-mix" name="Compressor Mix" label="Mix" group="compressor" action={controlChangeAction(93)} />
    </div></section>
    <section class="control-section control-section-effects" aria-labelledby="effects-heading"><h2 id="effects-heading">Effects</h2><div class="section-fader-grid">
      <FaderWrapper id="effects-parameter-1" name="Global FX Parameter 1" label="FX 1" group="effects" action={controlChangeAction(20)} />
      <FaderWrapper id="effects-parameter-2" name="Global FX Parameter 2" label="FX 2" group="effects" action={controlChangeAction(21)} />
      <FaderWrapper id="effects-parameter-3" name="Global FX Parameter 3" label="FX 3" group="effects" action={controlChangeAction(22)} />
      <FaderWrapper id="effects-parameter-4" name="Global FX Parameter 4" label="FX 4" group="effects" action={controlChangeAction(23)} />
      <FaderWrapper id="effects-parameter-5" name="Global FX Parameter 5" label="FX 5" group="effects" action={controlChangeAction(95)} />
      <FaderWrapper id="effects-parameter-6" name="Global FX Parameter 6" label="FX 6" group="effects" action={controlChangeAction(96)} />
      <FaderWrapper id="effects-mix" name="Global FX Mix" label="FX Mix" group="effects" action={controlChangeAction(24)} />
    </div></section>
    <section class="control-section control-section-equalizer" aria-labelledby="equalizer-heading"><h2 id="equalizer-heading">Equalizer</h2><div class="section-fader-grid">
      <FaderWrapper id="eq-tilt" name="EQ Tilt Value" label="Tilt" group="equalizer" action={controlChangeAction(83)} />
      <FaderWrapper id="eq-frequency" name="EQ Frequency" label="Freq" group="equalizer" action={controlChangeAction(84)} />
      <FaderWrapper id="eq-mix" name="EQ Mix" label="Mix" group="equalizer" action={controlChangeAction(85)} />
    </div></section>
    <section class="control-section control-section-performance" aria-labelledby="performance-heading"><h2 id="performance-heading">Performance</h2><div class="section-fader-grid">
      <FaderWrapper id="sostenuto-1" name="Sostenuto 1" label="Sost. 1" group="performance" action={controlChangeAction(66)} />
      <FaderWrapper id="sostenuto-2" name="Sostenuto 2" label="Sost. 2" group="performance" action={controlChangeAction(69)} />
      <FaderWrapper id="sustain" name="Sustain" label="Sustain" group="performance" action={controlChangeAction(64)} />
    </div></section>
  </section>
}
