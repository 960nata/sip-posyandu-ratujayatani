'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Download, Upload, FileSpreadsheet, Building2, MapPin, Home, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function LaporanPage() {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role
  const userDesaId = (session?.user as any)?.desaId
  const userKecamatanId = (session?.user as any)?.kecamatanId

  const isKabupaten = role === 'SUPERADMIN' || role === 'VIEWER'
  const isKecamatan = role === 'ADMIN_KECAMATAN'
  const isDesa = role === 'OPERATOR_DESA' || role === 'OPERATOR_POSYANDU'

  const [tahun, setTahun] = useState(2026)
  const [kecamatans, setKecamatans] = useState<any[]>([])
  const [desas, setDesas] = useState<any[]>([])
  const [selectedKecamatanId, setSelectedKecamatanId] = useState('')
  const [selectedDesaId, setSelectedDesaId] = useState('')

  const [busy, setBusy] = useState<string | null>(null)
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  useEffect(() => {
    const savedTahun = parseInt(localStorage.getItem('sip_tahun_aktif') || '2026')
    setTahun(savedTahun)
    fetch('/api/kecamatan').then(r => r.json()).then(setKecamatans).catch(() => {})
    if (isKecamatan && userKecamatanId) setSelectedKecamatanId(userKecamatanId)
    if (isDesa) {
      if (userKecamatanId) setSelectedKecamatanId(userKecamatanId)
      if (userDesaId) setSelectedDesaId(userDesaId)
    }
  }, [isKecamatan, isDesa, userKecamatanId, userDesaId])

  useEffect(() => {
    if (!selectedKecamatanId) { setDesas([]); return }
    fetch(`/api/desa?kecamatanId=${selectedKecamatanId}`).then(r => r.json()).then(setDesas).catch(() => {})
  }, [selectedKecamatanId])

  const downloadBlob = useCallback(async (url: string, fallbackName: string, key: string) => {
    setBusy(key); setNotice(null)
    try {
      const res = await fetch(url)
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setNotice({ type: 'err', text: err.error || `Gagal (${res.status})` })
        return
      }
      const blob = await res.blob()
      const cd = res.headers.get('Content-Disposition') || ''
      const m = cd.match(/filename="?([^";]+)"?/)
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = m ? decodeURIComponent(m[1]) : fallbackName
      a.click()
      URL.revokeObjectURL(a.href)
      setNotice({ type: 'ok', text: 'Berkas berhasil diunduh.' })
    } catch {
      setNotice({ type: 'err', text: 'Terjadi kesalahan jaringan.' })
    } finally {
      setBusy(null)
    }
  }, [])

  const doImport = useCallback(async (file: File, desaId: string) => {
    setBusy('import'); setNotice(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('tahun', String(tahun))
      if (desaId) fd.append('desaId', desaId)
      const res = await fetch('/api/import/desa', { method: 'POST', body: fd })
      const result = await res.json().catch(() => ({}))
      setNotice(res.ok ? { type: 'ok', text: result.message || 'Import berhasil.' } : { type: 'err', text: result.error || 'Import gagal.' })
    } catch {
      setNotice({ type: 'err', text: 'Terjadi kesalahan saat import.' })
    } finally {
      setBusy(null)
    }
  }, [tahun])

  const canImport = role !== 'VIEWER'

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--dash-text)]">Rekap &amp; Ekspor Data SIP</h1>
          <p className="text-[var(--dash-text-soft)] text-sm">
            Ekspor dan impor data posyandu dalam format Excel resmi (8 sheet: DATABASE, SIP 6, SIP 7, Pendidikan, PU, PR, Trantib, Sosial).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-[var(--dash-text-soft)]">Tahun</label>
          <select
            value={tahun}
            onChange={(e) => setTahun(parseInt(e.target.value))}
            className="bg-white dark:bg-[#202020] border border-[var(--dash-border)] rounded-lg px-3 py-2 text-sm font-medium text-[var(--dash-text)] dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400"
          >
            {[2024, 2025, 2026, 2027].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {notice && (
        <div className={`flex items-start gap-2 rounded-lg border p-4 text-sm ${notice.type === 'ok'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300'
          : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300'}`}>
          {notice.type === 'ok' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{notice.text}</span>
        </div>
      )}

      {/* Level Kabupaten */}
      {isKabupaten && (
        <section className="dash-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--dash-text)]">Kabupaten Lampung Timur</h2>
              <p className="text-sm text-[var(--dash-text-soft)]">Ekspor seluruh wilayah — folder per kecamatan, satu berkas per desa.</p>
            </div>
          </div>
          <button
            onClick={() => downloadBlob(`/api/export/kabupaten?tahun=${tahun}`, `REKAP_KABUPATEN_${tahun}.zip`, 'kab')}
            disabled={busy !== null}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-md text-sm transition-colors"
          >
            {busy === 'kab' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Ekspor Semua (ZIP)
          </button>
        </section>
      )}

      {/* Level Kecamatan */}
      {(isKabupaten || isKecamatan) && (
        <section className="dash-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--dash-text)]">Per Kecamatan</h2>
              <p className="text-sm text-[var(--dash-text-soft)]">Ekspor semua desa dalam satu kecamatan sebagai ZIP.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {isKabupaten && (
              <select
                value={selectedKecamatanId}
                onChange={(e) => { setSelectedKecamatanId(e.target.value); setSelectedDesaId('') }}
                className="flex-1 bg-slate-50 dark:bg-[#252525] border border-[var(--dash-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--dash-text)] focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400"
              >
                <option value="">— Pilih Kecamatan —</option>
                {kecamatans.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
              </select>
            )}
            <button
              onClick={() => downloadBlob(`/api/export/kecamatan?kecamatanId=${selectedKecamatanId}&tahun=${tahun}`, `REKAP_KECAMATAN_${tahun}.zip`, 'kec')}
              disabled={busy !== null || (isKabupaten && !selectedKecamatanId)}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-md text-sm transition-colors"
            >
              {busy === 'kec' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Ekspor Kecamatan (ZIP)
            </button>
          </div>
        </section>
      )}

      {/* Level Desa */}
      <section className="dash-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
            <Home className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--dash-text)]">Per Desa</h2>
            <p className="text-sm text-[var(--dash-text-soft)]">Ekspor / impor satu berkas desa (semua posyandu di dalamnya).</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {(isKabupaten || isKecamatan) && (
            <>
              {isKabupaten && (
                <select
                  value={selectedKecamatanId}
                  onChange={(e) => { setSelectedKecamatanId(e.target.value); setSelectedDesaId('') }}
                  className="flex-1 bg-slate-50 dark:bg-[#252525] border border-[var(--dash-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--dash-text)] focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400"
                >
                  <option value="">— Pilih Kecamatan —</option>
                  {kecamatans.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                </select>
              )}
              <select
                value={selectedDesaId}
                onChange={(e) => setSelectedDesaId(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-[#252525] border border-[var(--dash-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--dash-text)] focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400"
              >
                <option value="">— Pilih Desa —</option>
                {desas.map(d => <option key={d.id} value={d.id}>{d.nama}</option>)}
              </select>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => downloadBlob(`/api/export/desa?desaId=${selectedDesaId}&tahun=${tahun}`, `DESA_${tahun}.xlsx`, 'desa')}
            disabled={busy !== null || ((isKabupaten || isKecamatan) && !selectedDesaId)}
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-md text-sm transition-colors"
          >
            {busy === 'desa' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
            Ekspor Excel Desa
          </button>

          {canImport && (
            <label className={`inline-flex items-center justify-center gap-2 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-semibold py-2.5 px-4 rounded-md text-sm cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors ${busy ? 'opacity-50 pointer-events-none' : ''}`}>
              {busy === 'import' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Impor Excel Desa
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  e.target.value = ''
                  if (f) doImport(f, selectedDesaId)
                }}
              />
            </label>
          )}
        </div>
        <p className="text-xs text-[var(--dash-text-muted)] mt-3">
          Saat impor, sistem membaca nama desa dari berkas secara otomatis. Untuk kecamatan/kabupaten, pilih desa dahulu bila nama pada berkas tidak cocok.
        </p>
      </section>
    </div>
  )
}
