'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, Download, Layers, HeartPulse, FileText, Building2, Loader2, ChevronRight, Home
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/react'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const BIDANG = [
  { key: 'pendidikan', label: 'Pendidikan' },
  { key: 'pekerjaanUmum', label: 'Pekerjaan Umum' },
  { key: 'perumahan', label: 'Perumahan' },
  { key: 'trantib', label: 'Trantib' },
  { key: 'sosial', label: 'Sosial' },
  { key: 'sip6', label: 'SIP 6' },
  { key: 'sip7', label: 'SIP 7' },
] as const

const STATUS: Record<string, { label: string; dot: string; cls: string }> = {
  AKTIF: { label: 'Aktif', dot: '🟢', cls: 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/25' },
  KURANG_AKTIF: { label: 'Kurang Aktif', dot: '🟡', cls: 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/25' },
  PASIF: { label: 'Pasif', dot: '🔴', cls: 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/25' },
}

function classify(reported: number, total: number) {
  if (total === 0 || reported === 0) return 'PASIF'
  return reported / total >= 0.6 ? 'AKTIF' : 'KURANG_AKTIF'
}

// Satu level pada jalur drill-down
interface Crumb { level: 'kecamatan' | 'desa'; id: string; nama: string }

export default function AnalisaDataPage() {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role
  const rootLabel = role === 'SUPERADMIN' || role === 'VIEWER' ? 'Kabupaten Lampung Timur'
    : role === 'ADMIN_KECAMATAN' ? 'Kecamatan Anda'
    : role === 'OPERATOR_DESA' ? 'Desa Anda' : 'Posyandu Anda'

  const [tahun, setTahun] = useState(2025)
  const [crumbs, setCrumbs] = useState<Crumb[]>([])
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    setTahun(parseInt(localStorage.getItem('sip_tahun_aktif') || '') || 2025)
  }, [])

  const fetchMonitor = useCallback(async (path: Crumb[], th: number) => {
    setLoading(true)
    const params = new URLSearchParams({ tahun: String(th) })
    const last = path[path.length - 1]
    if (last?.level === 'desa') params.set('desaId', last.id)
    else if (last?.level === 'kecamatan') params.set('kecamatanId', last.id)
    try {
      const res = await fetch(`/api/dashboard/monitor?${params.toString()}`)
      const d = await res.json()
      if (d && !d.error) setData(d)
    } catch { /* abaikan */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    if (!session?.user) return
    fetchMonitor(crumbs, tahun)
  }, [session, crumbs, tahun, fetchMonitor])

  const children: any[] = data?.children || []
  const total = data?.total || {}
  const levelLabel: string = data?.levelLabel || 'Wilayah'
  const unitLabel: string = data?.unitLabel || 'Desa'
  const drillable: boolean = data?.drillable ?? false

  const bidangTotal = (o: any) => (o.pendidikan || 0) + (o.pekerjaanUmum || 0) + (o.perumahan || 0) + (o.trantib || 0) + (o.sosial || 0)
  const kesehatanTotal = (o: any) => (o.sip6 || 0) + (o.sip7 || 0)
  const scopeStatus = classify(total.reportedUnit || 0, total.unitCount || 0)

  const kpis = [
    { label: 'Total Data', value: total.total || 0, icon: Layers },
    { label: 'Data Kesehatan', value: kesehatanTotal(total), icon: HeartPulse },
    { label: 'Laporan Bidang', value: bidangTotal(total), icon: FileText },
    { label: `${unitLabel} Melapor`, value: `${total.reportedUnit ?? 0}/${total.unitCount ?? 0}`, icon: Building2 },
  ]

  const barOptions: any = {
    chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit', foreColor: 'var(--dash-text-muted)' },
    plotOptions: { bar: { borderRadius: 6, columnWidth: '55%' } },
    colors: ['#8b5cf6'],
    dataLabels: { enabled: true, style: { fontSize: '11px', colors: ['#fff'] } },
    xaxis: { categories: BIDANG.map(b => b.label), axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { fontSize: '11px' } } },
    yaxis: { labels: { style: { colors: 'var(--dash-text-muted)' } } },
    grid: { borderColor: 'var(--dash-border)', strokeDashArray: 4 },
    tooltip: { theme: 'dark', y: { formatter: (v: number) => `${v} data` } },
  }
  const barSeries = [{ name: 'Jumlah Data', data: BIDANG.map(b => total[b.key] || 0) }]

  // Navigasi drill-down
  const drillInto = (child: any) => {
    if (!drillable) return
    const level = data.level === 'kecamatan' ? 'kecamatan' : 'desa' // level anak saat ini
    setCrumbs(prev => [...prev, { level: level as 'kecamatan' | 'desa', id: child.id, nama: child.nama }])
  }
  const goToCrumb = (index: number) => setCrumbs(prev => prev.slice(0, index))

  const handleExportExcel = async () => {
    setIsExporting(true)
    try {
      const lastDesa = [...crumbs].reverse().find(c => c.level === 'desa')
      const desaId = lastDesa?.id || (session?.user as any)?.desaId || ''
      const params = new URLSearchParams({ tahun: String(tahun) })
      if (desaId) params.set('desaId', desaId)
      const res = await fetch(`/api/export/desa?${params.toString()}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert('Gagal export: ' + (err.error || res.statusText) + '. Masuk ke salah satu desa dulu, atau pakai menu Rekap & Ekspor.')
        return
      }
      const blob = await res.blob()
      const cd = res.headers.get('Content-Disposition') || ''
      const m = cd.match(/filename="?([^";]+)"?/)
      const a = document.createElement('a')
      a.href = window.URL.createObjectURL(blob)
      a.download = m ? decodeURIComponent(m[1]) : 'Rekap_Posyandu.xlsx'
      a.click()
      window.URL.revokeObjectURL(a.href)
    } catch {
      alert('Gagal melakukan export file Excel. Silakan coba lagi.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--dash-text)] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            Analisa Data Terpadu
          </h1>
          <p className="text-[var(--dash-text-soft)] text-sm mt-1">
            Telusuri kontribusi data berjenjang — dari wilayah sampai posyandu.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={tahun}
            onChange={e => setTahun(parseInt(e.target.value))}
            className="bg-white dark:bg-[#202020] border border-[var(--dash-border)] rounded-lg px-3 py-2 text-sm font-medium text-[var(--dash-text)] focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400"
          >
            {[2024, 2025, 2026, 2027].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button
            onClick={handleExportExcel}
            disabled={isExporting}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Export Excel
          </button>
        </div>
      </div>

      {/* Breadcrumb drill-down */}
      <div className="flex items-center gap-1 flex-wrap text-sm bg-slate-100/70 dark:bg-white/5 rounded-xl px-3 py-2">
        <button
          onClick={() => setCrumbs([])}
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg font-medium transition-colors ${crumbs.length === 0 ? 'text-purple-700 dark:text-purple-400' : 'text-[var(--dash-text-soft)] hover:text-[var(--dash-text)]'}`}
        >
          <Home className="w-4 h-4" /> {rootLabel}
        </button>
        {crumbs.map((c, i) => (
          <span key={c.id} className="inline-flex items-center gap-1">
            <ChevronRight className="w-4 h-4 text-[var(--dash-text-muted)]" />
            <button
              onClick={() => goToCrumb(i + 1)}
              className={`px-2 py-1 rounded-lg font-medium transition-colors ${i === crumbs.length - 1 ? 'text-purple-700 dark:text-purple-400' : 'text-[var(--dash-text-soft)] hover:text-[var(--dash-text)]'}`}
            >
              {c.nama}
            </button>
          </span>
        ))}
        {loading && <Loader2 className="w-4 h-4 animate-spin text-purple-500 ml-1" />}
      </div>

      {/* KPI seragam (ungu) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="dash-card"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <k.icon className="w-6 h-6" />
            </div>
            <p className="text-sm text-[var(--dash-text-soft)] mt-4">{k.label}</p>
            <p className="text-3xl font-bold tracking-tight text-[var(--dash-text)] mt-1">
              {loading ? '—' : (typeof k.value === 'number' ? k.value.toLocaleString('id-ID') : k.value)}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Chart rincian bidang untuk scope saat ini */}
      <div className="dash-card">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h2 className="text-base font-bold text-[var(--dash-text)]">Rincian Data per Bidang</h2>
          <span className="text-xs text-[var(--dash-text-muted)]">· {crumbs[crumbs.length - 1]?.nama || rootLabel}</span>
          <span className={`ml-auto text-xs font-medium px-2.5 py-1 rounded-full ${STATUS[scopeStatus]?.cls || ''}`}>
            {STATUS[scopeStatus]?.dot} {STATUS[scopeStatus]?.label}
          </span>
        </div>
        <p className="text-xs text-[var(--dash-text-muted)] mb-4">Tahun {tahun}</p>
        <Chart options={barOptions} series={barSeries} type="bar" height={320} />
      </div>

      {/* Tabel pemantauan per child (drill-down) */}
      <div className="dash-card">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Layers className="w-5 h-5 text-purple-600" />
          <h2 className="text-base font-bold text-[var(--dash-text)]">Pemantauan per {levelLabel}</h2>
          {drillable && <span className="text-[11px] text-[var(--dash-text-muted)]">· klik baris untuk telusuri</span>}
          <div className="ml-auto flex items-center gap-3 text-[11px] text-[var(--dash-text-soft)]">
            <span>🟢 Aktif</span><span>🟡 Kurang Aktif</span><span>🔴 Pasif</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-xs text-[var(--dash-text-muted)] uppercase tracking-wider border-b border-[var(--dash-border)]">
                <th className="px-3 py-3 font-medium sticky left-0 bg-[var(--dash-surface)]">{levelLabel}</th>
                {BIDANG.map(b => <th key={b.key} className="px-3 py-3 font-medium text-center whitespace-nowrap">{b.label}</th>)}
                <th className="px-3 py-3 font-medium text-right">Total</th>
                <th className="px-3 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--dash-border)]">
              {loading ? (
                <tr><td colSpan={BIDANG.length + 3} className="px-3 py-8 text-center text-[var(--dash-text-muted)]"><Loader2 className="w-5 h-5 animate-spin inline" /></td></tr>
              ) : children.length === 0 ? (
                <tr><td colSpan={BIDANG.length + 3} className="px-3 py-8 text-center text-[var(--dash-text-muted)]">Belum ada data.</td></tr>
              ) : children.map(c => (
                <tr
                  key={c.id}
                  onClick={() => drillInto(c)}
                  className={`transition-colors ${drillable ? 'cursor-pointer hover:bg-purple-50/60 dark:hover:bg-purple-900/10' : ''}`}
                >
                  <td className="px-3 py-3 font-medium text-[var(--dash-text)] sticky left-0 bg-[var(--dash-surface)]">
                    <span className="inline-flex items-center gap-1.5">
                      {c.nama}
                      {drillable && <ChevronRight className="w-3.5 h-3.5 text-purple-400" />}
                    </span>
                  </td>
                  {BIDANG.map(b => (
                    <td key={b.key} className="px-3 py-3 text-center text-[var(--dash-text-soft)]">{(c[b.key] || 0).toLocaleString('id-ID')}</td>
                  ))}
                  <td className="px-3 py-3 text-right font-semibold text-[var(--dash-text)]">{(c.total || 0).toLocaleString('id-ID')}</td>
                  <td className="px-3 py-3 text-right">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${STATUS[c.status]?.cls || ''}`}>
                      {STATUS[c.status]?.dot} {STATUS[c.status]?.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
