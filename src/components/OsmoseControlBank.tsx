import { For } from 'solid-js'
import type { OsmoseParameter } from '../osmose/parameters'

interface OsmoseControlBankProps {
  parameters: readonly OsmoseParameter[]
  values: Readonly<Record<string, number>>
  onValueChange: (channel: number, controlChange: number, value: number) => void
}

export function OsmoseControlBank(props: OsmoseControlBankProps) {
  return (
    <section class="control-bank" aria-label="Osmose controls">
      <div class="fader-grid">
        <For each={props.parameters}>{(parameter) => {
          const id = `channel-${parameter.channel}-cc-${parameter.controlChange}`
          const value = () => props.values[id] ?? 0
          return <label classList={{ fader: true, [`fader-${parameter.group}`]: true }} for={id}>
            <span class="fader-value">{value()}</span>
            <span class="fader-track" style={{ '--fader-position': `${(value() / 127) * 100}%` }}>
              <span class="fader-ticks" aria-hidden="true"><i /><i /><i /><i /><i /></span>
              <span class="fader-cap" aria-hidden="true"><i /></span>
              <input id={id} type="range" min="0" max="127" value={value()}
                aria-label={`${parameter.name}, channel ${parameter.channel}, CC ${parameter.controlChange}`}
                onInput={(event) => props.onValueChange(parameter.channel, parameter.controlChange, Number(event.currentTarget.value))} />
            </span>
            <span class="fader-name">{parameter.name}</span>
          </label>
        }}</For>
      </div>
    </section>
  )
}
