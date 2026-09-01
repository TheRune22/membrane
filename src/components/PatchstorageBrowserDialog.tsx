import { For, Show, createMemo, createSignal } from 'solid-js'
import type { PatchstoragePatch } from '../osmose/patchstorage'

interface PatchstorageBrowserDialogProps {
  patches: readonly PatchstoragePatch[]
  loading: boolean
  error: string | undefined
  patchLoading: boolean
  onClose: () => void
  onRefresh: () => void
  onSelect: (patch: PatchstoragePatch) => void
}

export function PatchstorageBrowserDialog(props: PatchstorageBrowserDialogProps) {
  const [query, setQuery] = createSignal('')
  const matchingPatches = createMemo(() => {
    const normalizedQuery = query().trim().toLowerCase()
    if (!normalizedQuery) return props.patches
    return props.patches.filter((patch) => [patch.title, patch.authorName, patch.excerpt].some((value) => value.toLowerCase().includes(normalizedQuery)))
  })

  return <div class="dialog-backdrop" role="presentation" onClick={(event) => {
    if (event.target === event.currentTarget) props.onClose()
  }}>
    <section class="preset-dialog patchstorage-dialog" role="dialog" aria-modal="true" aria-labelledby="patchstorage-browser-title">
      <div class="dialog-header">
        <div><p class="eyebrow">Patchstorage</p><h2 id="patchstorage-browser-title">EaganMatrix patches</h2></div>
        <div class="dialog-actions">
          <button class="secondary-button" type="button" onClick={props.onRefresh} disabled={props.loading || props.patchLoading}>{props.loading ? 'Refreshing…' : 'Refresh'}</button>
          <button class="icon-button" type="button" onClick={props.onClose} aria-label="Close Patchstorage browser">×</button>
        </div>
      </div>
      <input class="patchstorage-search" type="search" value={query()} onInput={(event) => setQuery(event.currentTarget.value)} placeholder="Search patches or authors" aria-label="Search Patchstorage patches" autofocus />
      <p class="preset-count">{props.loading ? 'Loading patches…' : `${matchingPatches().length} patches`}</p>
      <div class="preset-list" role="list">
        <For each={matchingPatches()}>{(patch) => <button class="preset-option" type="button" onClick={() => props.onSelect(patch)} disabled={props.patchLoading} role="listitem">
          <span class="preset-name">{patch.title}</span>
          <span class="patchstorage-author">by {patch.authorName}</span>
          <Show when={patch.excerpt}><span class="patchstorage-excerpt">{patch.excerpt}</span></Show>
        </button>}</For>
        <Show when={props.error}><p class="empty-results">{props.error}</p></Show>
        <Show when={!props.loading && !props.error && matchingPatches().length === 0}><p class="empty-results">No Patchstorage patches match that search.</p></Show>
      </div>
    </section>
  </div>
}
