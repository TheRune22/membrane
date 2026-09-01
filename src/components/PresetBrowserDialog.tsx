import { For, Show, createMemo, createSignal, onMount } from 'solid-js'
import type { OsmosePreset, OsmosePresetAddress } from '../osmose/presets'
import type { PatchstoragePatch } from '../osmose/patchstorage'

interface PresetBrowserDialogProps {
  presets: readonly OsmosePreset[]
  selectedPreset: OsmosePresetAddress | undefined
  patchLoading: boolean
  patchstorageLoading: boolean
  patchstoragePatches: readonly PatchstoragePatch[]
  patchstorageError: string | undefined
  onClose: () => void
  onSelect: (preset: OsmosePreset) => void
  onPatchFileSelected: (file: File) => void
  onPatchstorageTabOpen: () => void
  onRefreshPatchstorage: () => void
  onSelectPatchstoragePatch: (patch: PatchstoragePatch) => void
}

export function PresetBrowserDialog(props: PresetBrowserDialogProps) {
  const [query, setQuery] = createSignal('')
  const [source, setSource] = createSignal<'osmose' | 'patchstorage'>('osmose')
  const [patchstorageQuery, setPatchstorageQuery] = createSignal('')
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
  const matchingPatchstoragePatches = createMemo(() => {
    const normalizedQuery = patchstorageQuery().trim().toLowerCase()
    if (!normalizedQuery) return props.patchstoragePatches
    return props.patchstoragePatches.filter((patch) => [patch.title, patch.authorName, patch.excerpt].some((value) => value.toLowerCase().includes(normalizedQuery)))
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

  function selectSource(nextSource: 'osmose' | 'patchstorage') {
    if (nextSource === source()) return
    setSource(nextSource)
    if (nextSource === 'patchstorage') props.onPatchstorageTabOpen()
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
            <button class="icon-button" type="button" onClick={props.onClose} aria-label="Close preset browser">×</button>
          </div>
        </div>
        <div class="preset-source-tabs">
          <div role="tablist" aria-label="Preset source">
            <button classList={{ 'preset-source-tab': true, selected: source() === 'osmose' }} type="button" role="tab" aria-selected={source() === 'osmose'} onClick={() => selectSource('osmose')}>System presets</button>
            <button classList={{ 'preset-source-tab': true, selected: source() === 'patchstorage' }} type="button" role="tab" aria-selected={source() === 'patchstorage'} onClick={() => selectSource('patchstorage')} disabled={props.patchLoading}>Patchstorage presets</button>
          </div>
          <button class="secondary-button patch-load-button" type="button" onClick={() => patchFileInput?.click()} disabled={props.patchLoading}>
            {props.patchLoading ? 'Loading patch…' : 'Load from file'}
          </button>
        </div>
        <Show when={source() === 'osmose'}>
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
                if (props.selectedPreset?.bank === preset.bank && props.selectedPreset?.program === preset.program) selectedPresetOption = element
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
        </Show>
        <Show when={source() === 'patchstorage'}>
          <div class="patchstorage-toolbar">
            <input class="patchstorage-search" type="search" value={patchstorageQuery()} onInput={(event) => setPatchstorageQuery(event.currentTarget.value)} placeholder="Search patches or authors" aria-label="Search Patchstorage patches" autofocus />
            <button class="secondary-button" type="button" onClick={props.onRefreshPatchstorage} disabled={props.patchstorageLoading || props.patchLoading}>{props.patchstorageLoading ? 'Refreshing…' : 'Refresh'}</button>
          </div>
          <p class="preset-count">{props.patchstorageLoading ? 'Loading patches…' : `${matchingPatchstoragePatches().length} patches`}</p>
          <div class="preset-list" role="list">
            <For each={matchingPatchstoragePatches()}>{(patch) => <button class="preset-option" type="button" onClick={() => props.onSelectPatchstoragePatch(patch)} disabled={props.patchLoading} role="listitem">
              <span class="preset-name">{patch.title}</span>
              <span class="patchstorage-author">by {patch.authorName}</span>
              <Show when={patch.excerpt}><span class="patchstorage-excerpt">{patch.excerpt}</span></Show>
            </button>}</For>
            <Show when={props.patchstorageError}><p class="empty-results">{props.patchstorageError}</p></Show>
            <Show when={!props.patchstorageLoading && !props.patchstorageError && matchingPatchstoragePatches().length === 0}><p class="empty-results">No Patchstorage patches match that search.</p></Show>
          </div>
        </Show>
      </section>
    </div>
  )
}
