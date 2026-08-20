import { For } from 'solid-js'
import { Fader } from './Fader'
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
          return <Fader
            parameter={parameter}
            value={props.values[id] ?? 0}
            onValueChange={(value) => props.onValueChange(parameter.channel, parameter.controlChange, value)}
          />
        }}</For>
      </div>
    </section>
  )
}
