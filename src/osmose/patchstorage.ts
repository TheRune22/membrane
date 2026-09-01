const patchstorageApiUrl = 'https://patchstorage.com/api/beta'
const eaganMatrixPlatformId = 8421

export interface PatchstoragePatch {
  id: number
  title: string
  excerpt: string
  url: string
  authorName: string
}

interface PatchstorageFile {
  id: number
  filename: string
  url: string
}

interface PatchstoragePatchResponse {
  files: readonly PatchstorageFile[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string') throw new Error(`Patchstorage returned a patch without a ${field}.`)
  return value
}

function requiredId(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) throw new Error(`Patchstorage returned a patch without a valid ${field}.`)
  return value
}

async function fetchJson(url: string): Promise<{ body: unknown; headers: Headers }> {
  let response: Response
  try {
    response = await fetch(url)
  } catch {
    throw new Error('Unable to reach Patchstorage. Check your internet connection and try again.')
  }
  if (!response.ok) throw new Error(`Patchstorage could not complete the request (${response.status}).`)
  return { body: await response.json(), headers: response.headers }
}

function patchFromResponse(value: unknown): PatchstoragePatch {
  if (!isRecord(value)) throw new Error('Patchstorage returned an invalid patch list.')
  const author = isRecord(value.author) ? value.author : undefined
  return {
    id: requiredId(value.id, 'ID'),
    title: requiredString(value.title, 'title'),
    excerpt: typeof value.excerpt === 'string' ? value.excerpt : '',
    url: requiredString(value.url, 'URL'),
    authorName: author && typeof author.name === 'string' ? author.name : 'Unknown author',
  }
}

function patchDetailFromResponse(value: unknown): PatchstoragePatchResponse {
  if (!isRecord(value) || !Array.isArray(value.files)) throw new Error('Patchstorage returned an invalid patch.')
  return {
    files: value.files.map((file) => {
      if (!isRecord(file)) throw new Error('Patchstorage returned an invalid patch file.')
      return {
        id: requiredId(file.id, 'file ID'),
        filename: requiredString(file.filename, 'file name'),
        url: requiredString(file.url, 'file download URL'),
      }
    }),
  }
}

function isMidiFile(file: PatchstorageFile): boolean {
  return /\.(mid|midi)$/i.test(file.filename)
}

/** Retrieves the Patchstorage patches published for the EaganMatrix platform. */
export async function listEaganMatrixPatches(): Promise<readonly PatchstoragePatch[]> {
  const fetchPage = async (page: number) => {
    const { body, headers } = await fetchJson(`${patchstorageApiUrl}/patches?platforms=${eaganMatrixPlatformId}&per_page=100&page=${page}`)
    if (!Array.isArray(body)) throw new Error('Patchstorage returned an invalid patch list.')
    return { patches: body.map(patchFromResponse), totalPages: Number(headers.get('X-WP-TotalPages') ?? 1) }
  }
  const firstPage = await fetchPage(1)
  const pageCount = Number.isInteger(firstPage.totalPages) && firstPage.totalPages > 0 ? firstPage.totalPages : 1
  const remainingPages = await Promise.all(Array.from({ length: pageCount - 1 }, (_, index) => fetchPage(index + 2)))
  return [...firstPage.patches, ...remainingPages.flatMap(({ patches }) => patches)]
}

/** Downloads the MIDI attachment for an EaganMatrix patch. */
export async function downloadPatchstorageMidiFile(patch: PatchstoragePatch): Promise<{ fileName: string; contents: ArrayBuffer }> {
  const { body } = await fetchJson(`${patchstorageApiUrl}/patches/${patch.id}`)
  const detail = patchDetailFromResponse(body)
  const file = detail.files.find(isMidiFile)
  if (!file) throw new Error(`“${patch.title}” does not include a MIDI file.`)

  let response: Response
  try {
    response = await fetch(file.url)
  } catch {
    throw new Error(`Unable to download “${file.filename}” from Patchstorage.`)
  }
  if (!response.ok) throw new Error(`Patchstorage could not download “${file.filename}” (${response.status}).`)
  return { fileName: file.filename, contents: await response.arrayBuffer() }
}
