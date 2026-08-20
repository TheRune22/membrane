import { For } from 'solid-js'
import { Fader } from './Fader'
import type { OsmoseParameter } from '../osmose/parameters'

interface OsmoseControlBankProps {
  parameters: readonly OsmoseParameter[]
  values: Readonly<Record<string, number>>
  disabled: boolean
  onValueChange: (channel: number, controlChange: number, value: number) => void
}

export function OsmoseControlBank(props: OsmoseControlBankProps) {
  const groups = [
    { id: 'macro', label: 'Macros' },
    { id: 'gain', label: 'Gain' },
    { id: 'compressor', label: 'Compressor' },
    { id: 'effects', label: 'Effects' },
    { id: 'performance', label: 'Performance' },
    { id: 'equalizer', label: 'Equalizer' },
  ] as const

  return (
    <section class="control-bank" aria-label="Osmose controls">
      <For each={groups}>{(group) => <section class={`control-section control-section-${group.id}`} aria-labelledby={`${group.id}-heading`}>
        <h2 id={`${group.id}-heading`}>{group.label}</h2>
        <div class="section-fader-grid">
          <For each={props.parameters.filter((parameter) => parameter.group === group.id)}>{(parameter) => {
            const id = `channel-${parameter.channel}-cc-${parameter.controlChange}`
            return <Fader
              parameter={parameter}
              value={props.values[id] ?? 0}
              disabled={props.disabled}
              onValueChange={(value) => props.onValueChange(parameter.channel, parameter.controlChange, value)}
            />
          }}</For>
        </div>
      </section>}</For>
    </section>
  )
}
