'use client'

import { useState } from 'react'
import { X, FileText, ImagePlus, Loader2 } from 'lucide-react'

export interface DataDukungItem {
  id: string
  fileName: string
  filePath: string
  mimeType?: string
}

interface Props {
  files: DataDukungItem[]
  setFiles: (files: DataDukungItem[]) => void
  bidang: string
  posyanduId?: string
  max?: number
}

const isImage = (f: DataDukungItem) =>
  (f.mimeType?.startsWith('image/')) || /\.(jpe?g|png|gif|webp|avif|bmp)$/i.test(f.filePath || f.fileName || '')

export default function DataDukungUpload({ files, setFiles, bidang, posyanduId, max = 6 }: Props) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    e.target.value = '' // reset agar file sama bisa dipilih lagi
    if (!selected.length) return

    const slots = max - files.length
    if (slots <= 0) { alert(`Maksimal ${max} foto/berkas.`); return }
    const toUpload = selected.slice(0, slots)
    if (selected.length > slots) alert(`Hanya ${slots} berkas ditambahkan (maksimal ${max}).`)

    setUploading(true)
    const added: DataDukungItem[] = []
    for (const file of toUpload) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('bidang', bidang)
      if (posyanduId) fd.append('posyanduId', posyanduId)
      try {
        const res = await fetch('/api/data-dukung', { method: 'POST', body: fd })
        const result = await res.json()
        if (res.ok && result.dataDukung) added.push(result.dataDukung)
        else alert('Gagal mengunggah: ' + (result.error || 'Terjadi kesalahan'))
      } catch {
        alert('Gagal mengunggah berkas ke server')
      }
    }
    setFiles([...files, ...added])
    setUploading(false)
  }

  const remove = (id: string) => setFiles(files.filter(f => f.id !== id))

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-[var(--dash-text)] dark:text-slate-200">Data Dukung (Foto / PDF)</label>
        <span className="text-xs text-[var(--dash-text-muted)]">{files.length}/{max}</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {files.map(f => (
          <div key={f.id} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200/70 dark:border-white/10 bg-slate-50 dark:bg-[#202020]/50">
            {isImage(f) ? (
              <a href={f.filePath} target="_blank" rel="noopener noreferrer">
                <img src={f.filePath} alt={f.fileName} className="w-full h-full object-cover" />
              </a>
            ) : (
              <a href={f.filePath} target="_blank" rel="noopener noreferrer" className="w-full h-full flex flex-col items-center justify-center gap-1 p-2 text-center">
                <FileText className="w-7 h-7 text-purple-600 dark:text-purple-500" />
                <span className="text-[10px] text-[var(--dash-text-muted)] truncate w-full">{f.fileName}</span>
              </a>
            )}
            <button
              type="button"
              onClick={() => remove(f.id)}
              className="absolute top-1 right-1 p-1 rounded-full bg-black/55 text-white opacity-0 group-hover:opacity-100 hover:bg-rose-600 transition-all"
              title="Hapus"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {files.length < max && (
          <label className={`relative aspect-square rounded-lg border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-purple-500 dark:hover:border-purple-500 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${uploading ? 'pointer-events-none opacity-70' : ''}`}>
            <input
              type="file"
              accept=".pdf,image/*"
              multiple
              onChange={handleUpload}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {uploading ? (
              <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
            ) : (
              <>
                <ImagePlus className="w-6 h-6 text-[var(--dash-text-muted)]" />
                <span className="text-[10px] text-[var(--dash-text-muted)] text-center px-1">Tambah foto</span>
              </>
            )}
          </label>
        )}
      </div>
      <p className="text-xs text-[var(--dash-text-muted)] mt-2">Maksimal {max} berkas, masing-masing ≤ 15 MB (gambar/PDF).</p>
    </div>
  )
}
