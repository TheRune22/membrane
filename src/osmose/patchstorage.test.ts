import { describe, expect, it, vi } from 'vitest'
import { downloadPatchstorageMidiFile, listEaganMatrixPatches, type PatchstoragePatch } from './patchstorage'

const patch: PatchstoragePatch = { id: 42, title: 'Solar Wind', excerpt: 'A bright pad.', url: 'https://patchstorage.com/solar-wind/', authorName: 'Ada' }

describe('Patchstorage integration', () => {
  it('lists every EaganMatrix patch page', async () => {
    const secondPatch = { id: 43, title: 'Moonlight', excerpt: 'A soft pad.', url: 'https://patchstorage.com/moonlight/', authorName: 'Ada' }
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: 42, title: 'Solar Wind', excerpt: 'A bright pad.', url: patch.url, author: { name: 'Ada' } }]), { headers: { 'X-WP-TotalPages': '2' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: 43, title: 'Moonlight', excerpt: 'A soft pad.', url: 'https://patchstorage.com/moonlight/', author: { name: 'Ada' } }])))
    vi.stubGlobal('fetch', fetchMock)

    await expect(listEaganMatrixPatches()).resolves.toEqual([patch, secondPatch])
    expect(fetchMock).toHaveBeenNthCalledWith(1, 'https://patchstorage.com/api/beta/patches?platforms=8421&per_page=100&page=1')
    expect(fetchMock).toHaveBeenNthCalledWith(2, 'https://patchstorage.com/api/beta/patches?platforms=8421&per_page=100&page=2')
  })

  it('downloads the MIDI attachment from a patch detail response', async () => {
    const midiContents = new Uint8Array([0x4d, 0x54, 0x68, 0x64]).buffer
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ files: [{ id: 19, filename: 'solar-wind.mid', url: 'https://download.test/solar-wind.mid' }] })))
      .mockResolvedValueOnce(new Response(midiContents))
    vi.stubGlobal('fetch', fetchMock)

    await expect(downloadPatchstorageMidiFile(patch)).resolves.toEqual({ fileName: 'solar-wind.mid', contents: midiContents })
    expect(fetchMock).toHaveBeenNthCalledWith(1, 'https://patchstorage.com/api/beta/patches/42')
    expect(fetchMock).toHaveBeenNthCalledWith(2, 'https://download.test/solar-wind.mid')
  })

  it('rejects patches without a MIDI attachment', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ files: [{ id: 19, filename: 'notes.pdf', url: 'https://download.test/notes.pdf' }] }))))

    await expect(downloadPatchstorageMidiFile(patch)).rejects.toThrow('does not include a MIDI file')
  })
})
