import { For, Show, createMemo, createSignal, onMount } from 'solid-js'
import type { OsmosePreset, OsmosePresetAddress } from '../osmose/presets'

interface PresetBrowserDialogProps {
  presets: readonly OsmosePreset[]
  selectedPreset: OsmosePresetAddress | undefined
  patchLoading: boolean
  onClose: () => void
  onSelect: (preset: OsmosePreset) => void
  onPatchFileSelected: (file: File) => void
  onOpenPatchstorage: () => void
}

export function PresetBrowserDialog(props: PresetBrowserDialogProps) {
  const [query, setQuery] = createSignal('')
  const [type, setType] = createSignal('all')
  const [character, setCharacter] = createSignal('all')
  let selectedPresetOption: HTMLButtonElement | undefined
  let patchFileInput: HTMLInputElement | undefined
  const types = createMemo(() => [...new Set(props.presets.map((preset) => preset.type))].sort())
  const characters = createMemo(() => [...new Set(props.presets.flatMap((preset) => preset.tags))].sort())
  const matchingPresets = createMemo(() => {
    const normalizedQuery = query().trim().toLowerCase()
    return props.presets.filter((preset) =>
      (type() === 'all' || preset.type === type()) &&
      (character() === 'all' || preset.tags.includes(character())) &&
      (!normalizedQuery || [preset.name, preset.type, ...preset.tags].some((value) => value.toLowerCase().includes(normalizedQuery))),
    )
  })

  onMount(() => selectedPresetOption?.scrollIntoView({ block: 'center' }))

  function selectPatchFile(event: Event) {
    const input = event.currentTarget as HTMLInputElement
    const file = input.files?.[0]
    input.value = ''
    if (file) {
      props.onPatchFileSelected(file)
      props.onClose()
    }
  }

  return (
    <div class="dialog-backdrop" role="presentation" onClick={(event) => {
      if (event.target === event.currentTarget) props.onClose()
    }}>
      <section class="preset-dialog" role="dialog" aria-modal="true" aria-labelledby="preset-browser-title">
        <div class="dialog-header">
          <div><p class="eyebrow">Osmose library</p><h2 id="preset-browser-title">Select a preset</h2></div>
          <div class="dialog-actions">
            <input ref={patchFileInput} class="visually-hidden" type="file" accept=".mid,.midi,audio/midi" onChange={selectPatchFile} />
            <button class="secondary-button patch-load-button" type="button" onClick={() => patchFileInput?.click()} disabled={props.patchLoading}>
              {props.patchLoading ? 'Loading patch…' : 'Load from file'}
            </button>
            <button class="secondary-button patch-load-button" type="button" onClick={props.onOpenPatchstorage} disabled={props.patchLoading}>Browse Patchstorage</button>
            <button class="icon-button" type="button" onClick={props.onClose} aria-label="Close preset browser">×</button>
          </div>
        </div>
        <div class="preset-filters">
          <input type="search" value={query()} onInput={(event) => setQuery(event.currentTarget.value)} placeholder="Search names, types, or characters" aria-label="Search preset names, types, or characters" autofocus />
          <select value={type()} onChange={(event) => setType(event.currentTarget.value)} aria-label="Filter presets by type">
            <option value="all">All types</option>
            <For each={types()}>{(presetType) => <option value={presetType}>{presetType}</option>}</For>
          </select>
          <select value={character()} onChange={(event) => setCharacter(event.currentTarget.value)} aria-label="Filter presets by character">
            <option value="all">All characters</option>
            <For each={characters()}>{(presetCharacter) => <option value={presetCharacter}>{presetCharacter}</option>}</For>
          </select>
        </div>
        <p class="preset-count">{matchingPresets().length} presets</p>
        <div class="preset-list" role="list">
          <For each={matchingPresets()}>{(preset) =>
            <button ref={(element) => {
              if (props.selectedPreset?.bank === preset.bank && props.selectedPreset?.program === preset.program) {
                selectedPresetOption = element
              }
            }} classList={{ 'preset-option': true, selected: props.selectedPreset?.bank === preset.bank && props.selectedPreset?.program === preset.program }} type="button" onClick={() => props.onSelect(preset)} role="listitem">
              <span class="preset-name">{preset.name}</span>
              <span class="preset-meta">
                <span class="preset-type">{preset.type}</span>
                <For each={preset.tags}>{(tag) => <span class="preset-character">{tag}</span>}</For>
              </span>
            </button>
          }</For>
          <Show when={matchingPresets().length === 0}><p class="empty-results">No presets match those filters.</p></Show>
        </div>
      </section>
    </div>
  )
}
