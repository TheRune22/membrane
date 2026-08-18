import { For } from 'solid-js'
import type { OsmoseParameter } from '../osmose/parameters'

interface OsmoseControlBankProps {
  parameters: readonly OsmoseParameter[]
  values: Readonly<Record<number, number>>
  onValueChange: (controlChange: number, value: number) => void
}

export function OsmoseControlBank(props: OsmoseControlBankProps) {
  return (
    <section class="control-bank" aria-label="Osmose controls">
      <div class="fader-grid">
        <For each={props.parameters}>{(parameter) => {
          const id = `cc-${parameter.controlChange}`
          return <label classList={{ fader: true, [`fader-${parameter.group}`]: true }} for={id}>
            <span class="fader-value">{props.values[parameter.controlChange] ?? 0}</span>
            <span class="fader-track">
              <input id={id} type="range" min="0" max="127" value={props.values[parameter.controlChange] ?? 0}
                aria-label={`${parameter.name}, CC ${parameter.controlChange}`}
                onInput={(event) => props.onValueChange(parameter.controlChange, Number(event.currentTarget.value))} />
            </span>
            <span class="fader-name">{parameter.name}</span>
          </label>
        }}</For>
      </div>
    </section>
  )
}
