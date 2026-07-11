'use client'

import { MapPin, ChevronDown } from 'lucide-react'

function SelectWilayah({
  label,
  value,
  placeholder,
  options,
  disabled = false,
  onChange,
}: {
  label: string
  value: string
  placeholder: string
  options: { value: string; label: string }[]
  disabled?: boolean
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-400">{label}</label>
      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3.5 py-2 bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-md text-sm font-medium text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 appearance-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  )
}

/**
 * Filter wilayah berjenjang Kecamatan → Desa → Posyandu.
 * Sembunyikan dropdown Kecamatan via `showKecamatan` untuk role kecamatan.
 */
export default function FilterWilayah({
  showKecamatan = true,
  kecamatanList,
  desaList,
  posyanduList,
  selectedKec,
  selectedDesa,
  selectedPosyandu,
  onKecChange,
  onDesaChange,
  onPosyanduChange,
}: {
  showKecamatan?: boolean
  kecamatanList: { value: string; label: string }[]
  desaList: string[]
  posyanduList: string[]
  selectedKec: string
  selectedDesa: string
  selectedPosyandu: string
  onKecChange: (value: string) => void
  onDesaChange: (value: string) => void
  onPosyanduChange: (value: string) => void
}) {
  return (
    <div className="bg-white dark:bg-[#202020] p-4 sm:p-6 rounded-lg border border-slate-200/70 dark:border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4 text-slate-400" />
        <h2 className="text-sm font-semibold text-slate-700 dark:text-white uppercase tracking-wider">Filter Wilayah</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {showKecamatan && (
          <SelectWilayah
            label="Kecamatan"
            value={selectedKec}
            placeholder="Pilih Kecamatan..."
            options={kecamatanList}
            onChange={onKecChange}
          />
        )}
        <SelectWilayah
          label="Desa/Kelurahan"
          value={selectedDesa}
          placeholder="Pilih Desa..."
          options={desaList.map((d) => ({ value: d, label: d }))}
          disabled={showKecamatan && !selectedKec}
          onChange={onDesaChange}
        />
        <SelectWilayah
          label="Posyandu"
          value={selectedPosyandu}
          placeholder="Pilih Posyandu..."
          options={posyanduList.map((p) => ({ value: p, label: p }))}
          disabled={!selectedDesa}
          onChange={onPosyanduChange}
        />
      </div>
    </div>
  )
}
