import { For, Show, createMemo, createSignal } from 'solid-js'
import type { OsmosePreset } from '../osmose/presets'

interface PresetBrowserDialogProps {
  presets: readonly OsmosePreset[]
  selectedPreset: OsmosePreset | undefined
  onClose: () => void
  onSelect: (preset: OsmosePreset) => void
}

export function PresetBrowserDialog(props: PresetBrowserDialogProps) {
  const [query, setQuery] = createSignal('')
  const [type, setType] = createSignal('all')
  const types = createMemo(() => [...new Set(props.presets.map((preset) => preset.type))].sort())
  const matchingPresets = createMemo(() => {
    const normalizedQuery = query().trim().toLowerCase()
    return props.presets.filter((preset) =>
      (type() === 'all' || preset.type === type()) &&
      (!normalizedQuery || [preset.name, preset.type, ...preset.tags].some((value) => value.toLowerCase().includes(normalizedQuery))),
    )
  })

  return (
    <div class="dialog-backdrop" role="presentation">
      <section class="preset-dialog" role="dialog" aria-modal="true" aria-labelledby="preset-browser-title">
        <div class="dialog-header">
          <div><p class="eyebrow">Osmose library</p><h2 id="preset-browser-title">Select a preset</h2></div>
          <button class="icon-button" type="button" onClick={props.onClose} aria-label="Close preset browser">×</button>
        </div>
        <div class="preset-filters">
          <input type="search" value={query()} onInput={(event) => setQuery(event.currentTarget.value)} placeholder="Search presets or tags" aria-label="Search presets" autofocus />
          <select value={type()} onChange={(event) => setType(event.currentTarget.value)} aria-label="Filter presets by type">
            <option value="all">All types</option>
            <For each={types()}>{(presetType) => <option value={presetType}>{presetType}</option>}</For>
          </select>
        </div>
        <p class="preset-count">{matchingPresets().length} presets</p>
        <div class="preset-list" role="list">
          <For each={matchingPresets()}>{(preset) =>
            <button classList={{ 'preset-option': true, selected: props.selectedPreset?.bank === preset.bank && props.selectedPreset?.program === preset.program }} type="button" onClick={() => props.onSelect(preset)} role="listitem">
              <span class="preset-name">{preset.name}</span>
              <span class="preset-meta">{preset.type}{preset.tags.length ? ` · ${preset.tags.join(' · ')}` : ''}</span>
            </button>
          }</For>
          <Show when={matchingPresets().length === 0}><p class="empty-results">No presets match those filters.</p></Show>
        </div>
      </section>
    </div>
  )
}
