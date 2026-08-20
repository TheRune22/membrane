import type { OsmoseParameter } from '../osmose/parameters'

interface FaderProps {
  parameter: OsmoseParameter
  value: number
  onValueChange: (value: number) => void
}

export function Fader(props: FaderProps) {
  const id = `channel-${props.parameter.channel}-cc-${props.parameter.controlChange}`
  const position = () => `${(props.value / 127) * 100}%`

  return <label classList={{ fader: true, [`fader-${props.parameter.group}`]: true }} for={id}>
    <span class="fader-value">{props.value}</span>
    <span class="fader-track" style={{ '--fader-position': position() }}>
      <span class="fader-ticks" aria-hidden="true"><i /><i /><i /><i /><i /></span>
      <span class="fader-cap" aria-hidden="true"><i /></span>
      <input
        id={id}
        type="range"
        min="0"
        max="127"
        value={props.value}
        aria-label={`${props.parameter.name}, channel ${props.parameter.channel}, CC ${props.parameter.controlChange}`}
        onInput={(event) => props.onValueChange(Number(event.currentTarget.value))}
      />
    </span>
    <span class="fader-name">{props.parameter.name}</span>
  </label>
}
