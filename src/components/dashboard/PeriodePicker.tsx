'use client'

const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

/**
 * Dropdown periode bulan/tahun. Opsi di-generate otomatis dari tahun berjalan
 * mundur sampai `tahunAwal` — tidak perlu hardcode daftar bulan tiap tahun.
 */
export default function PeriodePicker({
  bulan,
  tahun,
  tahunAwal = 2025,
  onChange,
  className = '',
}: {
  bulan: number
  tahun: number
  tahunAwal?: number
  onChange: (bulan: number, tahun: number) => void
  className?: string
}) {
  const tahunSekarang = new Date().getFullYear()
  const options: { b: number; t: number }[] = []
  for (let t = Math.max(tahunSekarang, tahun); t >= tahunAwal; t--) {
    for (let b = 12; b >= 1; b--) {
      options.push({ b, t })
    }
  }

  return (
    <select
      value={`${bulan}-${tahun}`}
      onChange={(e) => {
        const [b, t] = e.target.value.split('-')
        onChange(parseInt(b), parseInt(t))
      }}
      className={`bg-white dark:bg-[#202020] border border-slate-200 dark:border-white/10 rounded-md px-4 py-2 text-sm font-medium text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 transition-all cursor-pointer ${className}`}
    >
      {options.map((o) => (
        <option key={`${o.b}-${o.t}`} value={`${o.b}-${o.t}`}>
          {NAMA_BULAN[o.b - 1]} {o.t}
        </option>
      ))}
    </select>
  )
}
