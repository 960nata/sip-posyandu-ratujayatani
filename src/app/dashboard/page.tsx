'use client'
import { getTahunList } from '@/lib/tahun'

import {
  Heart, Users, BookOpen, Building, Home, Shield, HeartPulse,
  Lock, Plus, MapPin, Activity, CheckCircle2, Clock, AlertTriangle,
  Building2, TrendingUp, ArrowUpRight
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })
const AccessMap = dynamic(() => import('../../components/analytics/AccessMap'), { ssr: false })

const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const BULAN_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

const ROLE_SCOPE: Record<string, string> = {
  SUPERADMIN: 'Kabupaten Lampung Timur',
  VIEWER: 'Kabupaten Lampung Timur',
  ADMIN_KECAMATAN: 'Wilayah Kecamatan Anda',
  OPERATOR_DESA: 'Wilayah Desa Anda',
  OPERATOR_POSYANDU: 'Posyandu Anda',
}

// Modul input data (tautan, bukan data) — dipakai lintas role operasional
const DATA_MODULES = [
  { title: 'Data Pengunjung (SIP 6)', desc: 'Kunjungan bulanan posyandu', icon: HeartPulse, color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20', slug: 'sip6', bidangKey: 'sip6' },
  { title: 'Hasil Kegiatan (SIP 7)', desc: 'Imunisasi, gizi, KB', icon: Heart, color: 'text-pink-500 bg-pink-50 dark:bg-pink-900/20', slug: 'sip7', bidangKey: 'sip7' },
  { title: 'Pendidikan', desc: 'Laporan bidang pendidikan', icon: BookOpen, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20', slug: 'pendidikan', bidangKey: 'pendidikan' },
  { title: 'Pekerjaan Umum', desc: 'Infrastruktur & sarana', icon: Building, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20', slug: 'pekerjaan-umum', bidangKey: 'pekerjaanUmum' },
  { title: 'Perumahan', desc: 'Bantuan rumah layak', icon: Home, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20', slug: 'perumahan', bidangKey: 'perumahan' },
  { title: 'Trantib & Linmas', desc: 'Keamanan & ketertiban', icon: Shield, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20', slug: 'trantib', bidangKey: 'trantib' },
  { title: 'Sosial', desc: 'Kesejahteraan warga', icon: Users, color: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20', slug: 'sosial', bidangKey: 'sosial' },
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const role = (session?.user as any)?.role
  const isKabupaten = role === 'SUPERADMIN' || role === 'VIEWER'
  const isKecamatan = role === 'ADMIN_KECAMATAN'
  const isOperasional = role === 'OPERATOR_DESA' || role === 'OPERATOR_POSYANDU'

  const [tahun, setTahun] = useState(2025)
  const [bulan, setBulan] = useState<number | ''>('') // '' = semua bulan (tren tahunan)

  const [healthStats, setHealthStats] = useState<any>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [wilayah, setWilayah] = useState<any>(null)
  const [posyandus, setPosyandus] = useState<any[]>([])
  const [summary, setSummary] = useState<Record<string, { total: number; selesai: number }> | null>(null)

  useEffect(() => {
    const savedTahun = parseInt(localStorage.getItem('sip_tahun_aktif') || '') || 2025
    setTahun(savedTahun)
  }, [])

  // Catat akses (deteksi IP + geolokasi) sekali saat dashboard dibuka.
  // Browser mendeteksi IP publiknya sendiri agar tetap terlokasi walau di jaringan lokal.
  useEffect(() => {
    if (!session?.user) return
    ;(async () => {
      let publicIp: string | null = null
      try {
        const r = await fetch('https://api.ipify.org?format=json')
        publicIp = (await r.json())?.ip ?? null
      } catch { /* offline / diblokir — server tetap coba dari header */ }
      fetch('/api/access/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicIp }),
      }).catch(() => {})
    })()
  }, [session])

  useEffect(() => {
    if (!session?.user) return
    setStatsLoading(true)
    let url = `/api/dashboard/kesehatan?tahun=${tahun}`
    if (bulan) url += `&bulan=${bulan}`
    fetch(url)
      .then(res => res.json())
      .then(data => { if (data && !data.error) setHealthStats(data) })
      .catch(err => console.error(err))
      .finally(() => setStatsLoading(false))
  }, [session, tahun, bulan])

  useEffect(() => {
    if (!session?.user) return
    if (isKabupaten || isKecamatan) {
      fetch(`/api/dashboard/wilayah?tahun=${tahun}`).then(r => r.json()).then(d => { if (d && !d.error) setWilayah(d) }).catch(() => {})
    }
    if (isOperasional) {
      fetch('/api/posyandu').then(r => r.json()).then(d => Array.isArray(d) && setPosyandus(d)).catch(() => {})
      fetch(`/api/dashboard/summary?tahun=${tahun}`).then(r => r.json()).then(d => { if (d && !d.error) setSummary(d.bidang || {}) }).catch(() => {})
    }
  }, [session, tahun, isKabupaten, isKecamatan, isOperasional])

  if (status === 'loading') {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-9 w-64 bg-slate-100 dark:bg-white/5 rounded-lg animate-pulse" />
            <div className="h-4 w-80 bg-slate-100 dark:bg-white/5 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="dash-card space-y-4">
              <div className="w-11 h-11 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />
              <div className="h-4 w-24 bg-slate-100 dark:bg-white/5 rounded animate-pulse" />
              <div className="h-8 w-16 bg-slate-100 dark:bg-white/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Lock className="w-10 h-10 text-slate-300" />
        <h2 className="text-2xl font-bold tracking-tight text-[var(--dash-text)]">Akses Ditolak</h2>
        <p className="text-[var(--dash-text-soft)] text-sm">Silakan login terlebih dahulu untuk mengakses halaman ini.</p>
      </div>
    )
  }

  const s6 = healthStats?.sip6 || {}
  const s7 = healthStats?.sip7 || {}
  const rc = healthStats?.reportCounts || {}
  const sc = healthStats?.statusCounts || {}
  const trend: any[] = healthStats?.monthlyTrend || []
  const periodeLabel = bulan ? `${BULAN[bulan - 1]} ${tahun}` : `Tahun ${tahun}`
  const suffix = bulan ? '' : ' (rata-rata/bln)'

  const wSummary = wilayah?.summary || {}
  const wRows: any[] = wilayah?.kecamatans || []
  const desaTotal = wSummary.desaCount ?? 0
  const topKecamatan = [...wRows].sort((a, b) => b.totalRecords - a.totalRecords).slice(0, 5)

  const kpis = [
    { label: 'Posyandu Aktif', value: healthStats?.activePosyanduCount ?? 0, sub: isKabupaten ? `${wSummary.kecamatanCount ?? 0} Kecamatan · ${desaTotal} Desa` : 'Dalam wilayah Anda', icon: Building2, tint: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Kunjungan Balita', value: s6.totalBalita ?? 0, sub: `Ditimbang: ${s7.balitaD ?? 0}${suffix}`, icon: HeartPulse, tint: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    { label: 'Ibu Hamil', value: s6.totalIbuHamil ?? 0, sub: `Diperiksa: ${s7.bumilDiperiksa ?? 0}${suffix}`, icon: Heart, tint: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-900/20' },
    { label: 'Lansia', value: s6.totalLansia ?? 0, sub: `Terdata${suffix}`, icon: Users, tint: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/20' },
  ]

  const statusData = [sc.selesai ?? 0, sc.proses ?? 0, sc.belum ?? 0]
  const statusTotal = statusData.reduce((a, b) => a + b, 0)

  const donutOptions: any = {
    chart: { type: 'donut', fontFamily: 'inherit', foreColor: 'var(--dash-text-muted)' },
    labels: ['Selesai (TL)', 'Proses', 'Belum (BTL)'],
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    legend: { position: 'bottom', fontSize: '13px', labels: { colors: 'var(--dash-text-soft)' } },
    plotOptions: { pie: { donut: { size: '68%', labels: { show: true, total: { show: true, label: 'Total', color: 'var(--dash-text-soft)', formatter: () => String(statusTotal) } } } } },
    dataLabels: { enabled: statusTotal > 0 },
    stroke: { width: 0 },
    tooltip: { theme: 'dark' },
    noData: { text: 'Belum ada laporan', style: { color: 'var(--dash-text-muted)' } },
  }

  const bidangCats = ['Pendidikan', 'Pek. Umum', 'Perumahan', 'Trantib', 'Sosial', 'Kesehatan']
  const bidangSeries = [rc.pendidikan ?? 0, rc.pekerjaanUmum ?? 0, rc.perumahan ?? 0, rc.trantib ?? 0, rc.sosial ?? 0, rc.kesehatan ?? 0]
  const barOptions: any = {
    chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit', foreColor: 'var(--dash-text-muted)' },
    plotOptions: { bar: { borderRadius: 6, columnWidth: '52%', distributed: true } },
    colors: ['#3b82f6', '#f59e0b', '#a855f7', '#6366f1', '#8b5cf6', '#ec4899'],
    dataLabels: { enabled: false },
    xaxis: { categories: bidangCats, axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { fontSize: '11px' } } },
    yaxis: { labels: { style: { colors: 'var(--dash-text-muted)' } } },
    grid: { borderColor: 'var(--dash-border)', strokeDashArray: 4 },
    legend: { show: false },
    tooltip: { theme: 'dark', y: { formatter: (v: number) => `${v} laporan` } },
  }

  const trendOptions: any = {
    chart: { type: 'area', toolbar: { show: false }, fontFamily: 'inherit', foreColor: 'var(--dash-text-muted)' },
    colors: ['#8b5cf6', '#ec4899'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2.5 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02, stops: [0, 90] } },
    xaxis: { categories: BULAN_SHORT, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { colors: 'var(--dash-text-muted)' } } },
    grid: { borderColor: 'var(--dash-border)', strokeDashArray: 4 },
    legend: { position: 'top', horizontalAlign: 'right', labels: { colors: 'var(--dash-text-soft)' } },
    tooltip: { theme: 'dark' },
  }
  const trendSeries = [
    { name: 'Balita', data: trend.map(t => t.balita ?? 0) },
    { name: 'Ibu Hamil', data: trend.map(t => t.bumil ?? 0) },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--dash-text)]">
            Selamat datang{session.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''} 👋
          </h1>
          <p className="text-[var(--dash-text-soft)] text-sm mt-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> {ROLE_SCOPE[role] || 'Sistem Informasi Posyandu'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={bulan}
            onChange={e => setBulan(e.target.value ? parseInt(e.target.value) : '')}
            className="bg-white dark:bg-[#202020] border border-[var(--dash-border)] rounded-lg px-3 py-2 text-sm font-medium text-[var(--dash-text)] focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400"
          >
            <option value="">Semua Bulan</option>
            {BULAN.map((b, i) => <option key={b} value={i + 1}>{b}</option>)}
          </select>
          <select
            value={tahun}
            onChange={e => setTahun(parseInt(e.target.value))}
            className="bg-white dark:bg-[#202020] border border-[var(--dash-border)] rounded-lg px-3 py-2 text-sm font-medium text-[var(--dash-text)] focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400"
          >
            {getTahunList().map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {kpis.map(k => (
          <div key={k.label} className="dash-card group relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 ${k.bg} ${k.tint} rounded-xl flex items-center justify-center transition-transform group-hover:scale-105`}>
                <k.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm text-[var(--dash-text-soft)] mt-4">{k.label}</p>
            <p className="text-3xl font-bold tracking-tight text-[var(--dash-text)] mt-1">
              {statsLoading ? '—' : Number(k.value).toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-[var(--dash-text-muted)] mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts: status + bidang */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="dash-card">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-purple-500" />
            <h2 className="text-base font-bold text-[var(--dash-text)]">Status Laporan</h2>
          </div>
          <Chart options={donutOptions} series={statusData} type="donut" height={280} />
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <StatusPill icon={CheckCircle2} label="Selesai" value={sc.selesai ?? 0} color="text-emerald-600" />
            <StatusPill icon={Clock} label="Proses" value={sc.proses ?? 0} color="text-amber-600" />
            <StatusPill icon={AlertTriangle} label="Belum" value={sc.belum ?? 0} color="text-rose-600" />
          </div>
        </div>

        <div className="dash-card lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-purple-500" />
            <h2 className="text-base font-bold text-[var(--dash-text)]">Laporan per Bidang</h2>
            <span className="ml-auto text-xs text-[var(--dash-text-muted)]">{periodeLabel}</span>
          </div>
          <Chart options={barOptions} series={[{ name: 'Laporan', data: bidangSeries }]} type="bar" height={300} />
        </div>
      </div>

      {/* Trend */}
      <div className="dash-card">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          <h2 className="text-base font-bold text-[var(--dash-text)]">Tren Kunjungan Bulanan {tahun}</h2>
        </div>
        <Chart options={trendOptions} series={trendSeries} type="area" height={320} />
      </div>

      {/* Analitik Wilayah (data asli) — untuk admin kabupaten & kecamatan */}
      {(isKabupaten || isKecamatan) && (
        <>
          {/* Ringkasan aktivitas + ranking */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="dash-card lg:col-span-1 space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-500" />
                <h2 className="text-base font-bold text-[var(--dash-text)]">Keaktifan Wilayah</h2>
              </div>
              <p className="text-xs text-[var(--dash-text-muted)]">Berdasarkan posyandu yang melapor tahun {tahun}</p>
              <div className="space-y-2 pt-1">
                <ActivityBar label="Aktif" value={wSummary.aktif ?? 0} total={wSummary.kecamatanCount ?? 0} color="bg-emerald-500" dot="🟢" />
                <ActivityBar label="Kurang Aktif" value={wSummary.kurangAktif ?? 0} total={wSummary.kecamatanCount ?? 0} color="bg-amber-500" dot="🟡" />
                <ActivityBar label="Pasif" value={wSummary.pasif ?? 0} total={wSummary.kecamatanCount ?? 0} color="bg-rose-500" dot="🔴" />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--dash-border)]">
                <MiniStat label="Total Data Tercatat" value={wSummary.totalRecords ?? 0} />
                <MiniStat label="Posyandu Melapor" value={`${wSummary.reportedPosyandu ?? 0}/${wSummary.posyanduCount ?? 0}`} />
              </div>
            </div>

            <div className="dash-card lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <h2 className="text-base font-bold text-[var(--dash-text)]">Kecamatan Paling Aktif</h2>
                <span className="ml-auto text-xs text-[var(--dash-text-muted)]">Top 5 · {tahun}</span>
              </div>
              {topKecamatan.length === 0 ? (
                <p className="py-10 text-center text-sm text-[var(--dash-text-muted)]">Belum ada data aktivitas.</p>
              ) : (
                <div className="space-y-3">
                  {topKecamatan.map((k, i) => {
                    const max = topKecamatan[0]?.totalRecords || 1
                    return (
                      <div key={k.id} className="flex items-center gap-3">
                        <div className="w-7 h-7 shrink-0 rounded-full bg-slate-100 dark:bg-white/5 text-[var(--dash-text-soft)] flex items-center justify-center font-bold text-xs">{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-[var(--dash-text)] truncate">{k.nama}</p>
                            <p className="text-xs text-[var(--dash-text-soft)] shrink-0 ml-2">{k.totalRecords.toLocaleString('id-ID')} data</p>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500" style={{ width: `${Math.max(6, (k.totalRecords / max) * 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Peta sebaran akses berbasis IP asli — di atas tabel wilayah */}
          <AccessMap />

          {/* Tabel Sebaran Wilayah dengan status */}
          <div className="dash-card">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <MapPin className="w-5 h-5 text-purple-500" />
              <h2 className="text-base font-bold text-[var(--dash-text)]">Sebaran Wilayah</h2>
              <span className="text-xs text-[var(--dash-text-muted)]">{wSummary.kecamatanCount ?? 0} Kecamatan · {desaTotal} Desa</span>
              <div className="ml-auto flex items-center gap-3 text-[11px] text-[var(--dash-text-soft)]">
                <span className="flex items-center gap-1">🟢 Aktif</span>
                <span className="flex items-center gap-1">🟡 Kurang Aktif</span>
                <span className="flex items-center gap-1">🔴 Pasif</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-xs text-[var(--dash-text-muted)] uppercase tracking-wider border-b border-[var(--dash-border)]">
                    <th className="px-4 py-3 font-medium">Kecamatan</th>
                    <th className="px-4 py-3 font-medium text-center">Desa</th>
                    <th className="px-4 py-3 font-medium text-center">Posyandu</th>
                    <th className="px-4 py-3 font-medium text-center">Melapor</th>
                    <th className="px-4 py-3 font-medium text-right">Data</th>
                    <th className="px-4 py-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--dash-border)]">
                  {wRows.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-[var(--dash-text-muted)]">Memuat data wilayah…</td></tr>
                  ) : wRows.map(k => (
                    <tr key={k.id} className="hover:bg-[var(--dash-surface-hover)] transition-colors">
                      <td className="px-4 py-3 font-medium text-[var(--dash-text)]">{k.nama}</td>
                      <td className="px-4 py-3 text-center text-[var(--dash-text-soft)]">{k.desaCount}</td>
                      <td className="px-4 py-3 text-center text-[var(--dash-text-soft)]">{k.posyanduCount}</td>
                      <td className="px-4 py-3 text-center text-[var(--dash-text-soft)]">{k.reportedPosyandu}/{k.posyanduCount}</td>
                      <td className="px-4 py-3 text-right text-[var(--dash-text-soft)]">{k.totalRecords.toLocaleString('id-ID')}</td>
                      <td className="px-4 py-3 text-right"><StatusBadge status={k.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {isOperasional && (
        <>
          {role === 'OPERATOR_DESA' && posyandus.length > 0 && (
            <div className="dash-card">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-purple-500" />
                <h2 className="text-base font-bold text-[var(--dash-text)]">Posyandu di Desa Anda</h2>
                <span className="ml-auto text-xs text-[var(--dash-text-muted)]">{posyandus.length} Posyandu</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {posyandus.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-hover)]/40">
                    <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center">
                      <Building2 className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--dash-text)] truncate">{p.nama}</p>
                      <p className="text-xs text-[var(--dash-text-muted)]">{p.strata ? String(p.strata).charAt(0) + String(p.strata).slice(1).toLowerCase() : 'Posyandu'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-[var(--dash-text)]">Pusat Input Data</h2>
                <p className="text-sm text-[var(--dash-text-soft)]">Pilih modul untuk mulai mencatat data hari ini.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {DATA_MODULES.map(m => {
                const stat = summary?.[m.bidangKey]
                const jumlah = stat?.total ?? 0
                const sudah = jumlah > 0
                return (
                <Link key={m.slug} href={`/dashboard/${m.slug}`} className="dash-card group">
                  <div className="flex items-start justify-between gap-2">
                    <div className={`w-12 h-12 ${m.color} rounded-xl flex items-center justify-center transition-transform group-hover:scale-105`}>
                      <m.icon className="w-6 h-6" />
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${sudah ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/25' : 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/25'}`}>
                      {sudah ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {sudah ? 'Sudah input' : 'Belum'}
                    </span>
                  </div>
                  <h3 className="font-bold text-[var(--dash-text)] group-hover:text-purple-600 transition-colors mt-4">{m.title}</h3>
                  <p className="text-xs text-[var(--dash-text-muted)] mt-0.5">{m.desc}</p>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-[var(--dash-text)]">{summary ? jumlah.toLocaleString('id-ID') : '—'}</span>
                    <span className="text-xs text-[var(--dash-text-muted)]">data ({tahun})</span>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-purple-600">
                    <Plus className="w-3.5 h-3.5" /> Input Data
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </span>
                </Link>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function StatusPill({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg border border-[var(--dash-border)] py-2">
      <Icon className={`w-4 h-4 mx-auto ${color}`} />
      <p className="text-lg font-bold text-[var(--dash-text)] mt-1">{Number(value).toLocaleString('id-ID')}</p>
      <p className="text-[10px] text-[var(--dash-text-muted)] uppercase tracking-wide">{label}</p>
    </div>
  )
}

const STATUS_MAP: Record<string, { label: string; cls: string; dot: string }> = {
  AKTIF: { label: 'Aktif', dot: '🟢', cls: 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/25' },
  KURANG_AKTIF: { label: 'Kurang Aktif', dot: '🟡', cls: 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/25' },
  PASIF: { label: 'Pasif', dot: '🔴', cls: 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/25' },
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] || STATUS_MAP.PASIF
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${s.cls}`}>
      <span aria-hidden>{s.dot}</span>{s.label}
    </span>
  )
}

function ActivityBar({ label, value, total, color, dot }: { label: string; value: number; total: number; color: string; dot: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-[var(--dash-text-soft)]">{dot} {label}</span>
        <span className="font-semibold text-[var(--dash-text)]">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg bg-[var(--dash-surface-hover)]/50 p-2.5">
      <p className="text-lg font-bold text-[var(--dash-text)]">{typeof value === 'number' ? value.toLocaleString('id-ID') : value}</p>
      <p className="text-[10px] text-[var(--dash-text-muted)] uppercase tracking-wide leading-tight">{label}</p>
    </div>
  )
}
