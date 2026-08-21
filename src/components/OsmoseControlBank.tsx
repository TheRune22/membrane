import { Fader } from './Fader'

interface OsmoseControlBankProps {
  values: Readonly<Record<string, number>>
  disabled: boolean
  onFaderValueChange: (id: string, value: number) => void
}

export function OsmoseControlBank(props: OsmoseControlBankProps) {
  return (
    <section class="control-bank" aria-label="Osmose controls">
      <section class="control-section control-section-macro" aria-labelledby="macro-heading">
        <h2 id="macro-heading">Macros</h2>
        <div class="section-fader-grid">
          <Fader id="macro-1" name="Macro 1" label="M1" group="macro" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('macro-1', value)} />
          <Fader id="macro-2" name="Macro 2" label="M2" group="macro" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('macro-2', value)} />
          <Fader id="macro-3" name="Macro 3" label="M3" group="macro" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('macro-3', value)} />
          <Fader id="macro-4" name="Macro 4" label="M4" group="macro" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('macro-4', value)} />
          <Fader id="macro-5" name="Macro 5" label="M5" group="macro" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('macro-5', value)} />
          <Fader id="macro-6" name="Macro 6" label="M6" group="macro" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('macro-6', value)} />
        </div>
      </section>
      <section class="control-section control-section-gain" aria-labelledby="gain-heading">
        <h2 id="gain-heading">Gain</h2>
        <div class="section-fader-grid">
          <Fader id="pregain" name="Pregain" label="Pregain" group="gain" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('pregain', value)} />
          <Fader id="postgain" name="Postgain" label="Postgain" group="gain" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('postgain', value)} />
        </div>
      </section>
      <section class="control-section control-section-compressor" aria-labelledby="compressor-heading">
        <h2 id="compressor-heading">Compressor</h2>
        <div class="section-fader-grid">
          <Fader id="compressor-threshold" name="Compressor Threshold" label="Threshold" group="compressor" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('compressor-threshold', value)} />
          <Fader id="compressor-attack" name="Compressor Attack" label="Attack" group="compressor" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('compressor-attack', value)} />
          <Fader id="compressor-ratio" name="Compressor Ratio" label="Ratio" group="compressor" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('compressor-ratio', value)} />
          <Fader id="compressor-mix" name="Compressor Mix" label="Mix" group="compressor" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('compressor-mix', value)} />
        </div>
      </section>
      <section class="control-section control-section-effects" aria-labelledby="effects-heading">
        <h2 id="effects-heading">Effects</h2>
        <div class="section-fader-grid">
          <Fader id="effects-parameter-1" name="Global FX Parameter 1" label="FX 1" group="effects" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('effects-parameter-1', value)} />
          <Fader id="effects-parameter-2" name="Global FX Parameter 2" label="FX 2" group="effects" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('effects-parameter-2', value)} />
          <Fader id="effects-parameter-3" name="Global FX Parameter 3" label="FX 3" group="effects" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('effects-parameter-3', value)} />
          <Fader id="effects-parameter-4" name="Global FX Parameter 4" label="FX 4" group="effects" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('effects-parameter-4', value)} />
          <Fader id="effects-parameter-5" name="Global FX Parameter 5" label="FX 5" group="effects" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('effects-parameter-5', value)} />
          <Fader id="effects-parameter-6" name="Global FX Parameter 6" label="FX 6" group="effects" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('effects-parameter-6', value)} />
          <Fader id="effects-mix" name="Global FX Mix" label="FX Mix" group="effects" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('effects-mix', value)} />
        </div>
      </section>
      <section class="control-section control-section-performance" aria-labelledby="performance-heading">
        <h2 id="performance-heading">Performance</h2>
        <div class="section-fader-grid">
          <Fader id="sostenuto-1" name="Sostenuto 1" label="Sost. 1" group="performance" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('sostenuto-1', value)} />
          <Fader id="sostenuto-2" name="Sostenuto 2" label="Sost. 2" group="performance" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('sostenuto-2', value)} />
          <Fader id="sustain" name="Sustain" label="Sustain" group="performance" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('sustain', value)} />
        </div>
      </section>
      <section class="control-section control-section-equalizer" aria-labelledby="equalizer-heading">
        <h2 id="equalizer-heading">Equalizer</h2>
        <div class="section-fader-grid">
          <Fader id="eq-tilt" name="EQ Tilt Value" label="Tilt" group="equalizer" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('eq-tilt', value)} />
          <Fader id="eq-frequency" name="EQ Frequency" label="Freq" group="equalizer" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('eq-frequency', value)} />
          <Fader id="eq-mix" name="EQ Mix" label="Mix" group="equalizer" values={props.values} disabled={props.disabled} onValueChange={(value) => props.onFaderValueChange('eq-mix', value)} />
        </div>
      </section>
    </section>
  )
}
