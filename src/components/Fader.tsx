import type { OsmoseParameter } from '../osmose/parameters'

interface FaderProps {
  parameter: OsmoseParameter
  value: number
  disabled: boolean
  onValueChange: (value: number) => void
}

export function Fader(props: FaderProps) {
  const id = `channel-${props.parameter.channel}-cc-${props.parameter.controlChange}`
  const position = () => `${(props.value / 127) * 100}%`
  const label = () => props.parameter.name
    .replace(/^Macro /, 'M')
    .replace(/^Global FX parameter /, 'FX ')
    .replace(/^Global FX mix$/, 'FX mix')
    .replace(/^Compressor /, '')
    .replace(/^EQ tilt value$/i, 'Tilt')
    .replace(/^EQ frequency$/i, 'Freq')
    .replace(/^EQ /, '')
    .replace(/^Sostenuto /, 'Sost. ')

  return <label classList={{ fader: true, [`fader-${props.parameter.group}`]: true }} for={id}>
    <span class="fader-value">{props.value.toString().padStart(3, '0')}</span>
    <span class="fader-track" style={{ '--fader-position': position() }}>
      <span class="fader-ticks" aria-hidden="true"><i /><i /><i /><i /><i /></span>
      <span class="fader-cap" aria-hidden="true"><i /></span>
      <input
        id={id}
        type="range"
        min="0"
        max="127"
        value={props.value}
        disabled={props.disabled}
        aria-label={`${props.parameter.name}, channel ${props.parameter.channel}, CC ${props.parameter.controlChange}`}
        onInput={(event) => props.onValueChange(Number(event.currentTarget.value))}
      />
    </span>
    <span class="fader-name">{label()}</span>
  </label>
}
