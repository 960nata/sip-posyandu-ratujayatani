'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, X, Loader2, PlayCircle, Save, GraduationCap } from 'lucide-react'
import { getYoutubeEmbedUrl, getYoutubeThumb } from '@/lib/youtube'

interface Tutorial {
  id: string
  judul: string
  deskripsi: string | null
  youtubeUrl: string
  target: string
  urutan: number
}

const TARGET_OPTIONS = [
  { value: 'SEMUA', label: 'Semua Pengguna' },
  { value: 'SUPERADMIN', label: 'Super Admin' },
  { value: 'ADMIN_KECAMATAN', label: 'Admin Kecamatan' },
  { value: 'OPERATOR_DESA', label: 'Operator Desa' },
  { value: 'OPERATOR_POSYANDU', label: 'Operator Posyandu' },
]
const targetLabel = (v: string) => TARGET_OPTIONS.find(o => o.value === v)?.label || v

const emptyForm = { id: '', judul: '', deskripsi: '', youtubeUrl: '', target: 'SEMUA', urutan: 0 }

export default function KelolaPanduanPage() {
  const [items, setItems] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!form.id

  const load = () => {
    setLoading(true)
    fetch('/api/tutorial?manage=1')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setItems(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const resetForm = () => { setForm({ ...emptyForm }); setError('') }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.judul.trim()) { setError('Judul wajib diisi.'); return }
    if (!getYoutubeThumb(form.youtubeUrl)) { setError('URL YouTube tidak valid.'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/tutorial', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Gagal menyimpan.'); return }
      resetForm()
      load()
    } catch {
      setError('Terjadi kesalahan jaringan.')
    } finally {
      setSaving(false)
    }
  }

  const edit = (t: Tutorial) => {
    setForm({ id: t.id, judul: t.judul, deskripsi: t.deskripsi || '', youtubeUrl: t.youtubeUrl, target: t.target, urutan: t.urutan })
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const remove = async (id: string) => {
    if (!confirm('Hapus panduan ini?')) return
    await fetch(`/api/tutorial?id=${id}`, { method: 'DELETE' })
    if (form.id === id) resetForm()
    load()
  }

  const previewEmbed = getYoutubeEmbedUrl(form.youtubeUrl)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--dash-text)] flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-purple-600" />
          Kelola Panduan
        </h1>
        <p className="text-[var(--dash-text-soft)] text-sm mt-1">
          Tambah video tutorial (YouTube) dan tentukan siapa yang dapat melihatnya.
        </p>
      </div>

      {/* Form tambah/edit */}
      <form onSubmit={submit} className="dash-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[var(--dash-text)]">{isEdit ? 'Edit Panduan' : 'Tambah Panduan'}</h2>
          {isEdit && (
            <button type="button" onClick={resetForm} className="text-xs text-[var(--dash-text-muted)] hover:text-[var(--dash-text)] inline-flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Batal edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--dash-text)] mb-1">Judul</label>
              <input
                value={form.judul}
                onChange={e => setForm({ ...form, judul: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#202020] text-[var(--dash-text)] focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400"
                placeholder="Cara input data SIP 6"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--dash-text)] mb-1">URL YouTube</label>
              <input
                value={form.youtubeUrl}
                onChange={e => setForm({ ...form, youtubeUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#202020] text-[var(--dash-text)] focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400"
                placeholder="https://youtu.be/xxxxxxxxxxx"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[var(--dash-text)] mb-1">Ditujukan untuk</label>
                <select
                  value={form.target}
                  onChange={e => setForm({ ...form, target: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#202020] text-[var(--dash-text)] focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400"
                >
                  {TARGET_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--dash-text)] mb-1">Urutan</label>
                <input
                  type="number"
                  value={form.urutan}
                  onChange={e => setForm({ ...form, urutan: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#202020] text-[var(--dash-text)] focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--dash-text)] mb-1">Deskripsi (opsional)</label>
              <textarea
                value={form.deskripsi}
                onChange={e => setForm({ ...form, deskripsi: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#202020] text-[var(--dash-text)] focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400"
                placeholder="Penjelasan singkat isi video..."
              />
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-[var(--dash-text)] mb-1">Pratinjau</label>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10">
              {previewEmbed ? (
                <iframe src={previewEmbed} title="preview" className="absolute inset-0 w-full h-full" allowFullScreen />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-[var(--dash-text-muted)] gap-2">
                  <PlayCircle className="w-8 h-8" />
                  Tempel URL YouTube untuk pratinjau
                </div>
              )}
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold py-2.5 px-5 rounded-lg text-sm transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : isEdit ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isEdit ? 'Simpan Perubahan' : 'Tambah Panduan'}
          </button>
        </div>
      </form>

      {/* Daftar */}
      <div className="dash-card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--dash-border)]">
          <h2 className="font-bold text-[var(--dash-text)]">Daftar Panduan ({items.length})</h2>
        </div>
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-purple-500" /></div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-sm text-[var(--dash-text-muted)]">Belum ada panduan. Tambahkan di atas.</div>
        ) : (
          <div className="divide-y divide-[var(--dash-border)]">
            {items.map(t => (
              <div key={t.id} className="flex items-center gap-4 p-4">
                <img
                  src={getYoutubeThumb(t.youtubeUrl) || ''}
                  alt=""
                  className="w-28 h-16 object-cover rounded-md bg-slate-100 dark:bg-black/40 flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[var(--dash-text)] truncate">{t.judul}</p>
                  {t.deskripsi && <p className="text-xs text-[var(--dash-text-muted)] truncate">{t.deskripsi}</p>}
                  <span className="inline-block mt-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                    {targetLabel(t.target)}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => edit(t)} className="p-2 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => remove(t.id)} className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors" title="Hapus">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
