interface FaderProps {
  id: string
  name: string
  label: string
  group: 'macro' | 'gain' | 'compressor' | 'effects' | 'performance' | 'equalizer'
  values: Readonly<Record<string, number>>
  disabled: boolean
  onValueChange: (value: number) => void
}

export function Fader(props: FaderProps) {
  const value = () => props.values[props.id] ?? 0
  const position = () => `${(value() / 127) * 100}%`
  return <label classList={{ fader: true, [`fader-${props.group}`]: true }} for={props.id}>
    <span class="fader-value">{value().toString().padStart(3, '0')}</span>
    <span class="fader-track" style={{ '--fader-position': position() }}>
      <span class="fader-ticks" aria-hidden="true"><i /><i /><i /><i /><i /></span>
      <span class="fader-cap" aria-hidden="true"><i /></span>
      <input
        id={props.id}
        type="range"
        min="0"
        max="127"
        value={value()}
        disabled={props.disabled}
        aria-label={props.name}
        onInput={(event) => props.onValueChange(Number(event.currentTarget.value))}
      />
    </span>
    <span class="fader-name">{props.label}</span>
  </label>
}
