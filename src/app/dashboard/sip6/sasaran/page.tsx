'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, Search, Filter, Plus, 
  Check, X, ChevronDown, Download
} from 'lucide-react'

// Dummy data for Sasaran Individu
const dummySasaran = [
  { id: '1', nama: 'Anindiya Putri', kategori: 'BAYI_BALITA', jk: 'P', jan: true, feb: true, mar: true, apr: false, mei: true, jun: false, jul: false, agu: false, sep: false, okt: false, nov: false, des: false },
  { id: '2', nama: 'Siti Aminah', kategori: 'IBU_HAMIL', jk: 'P', jan: true, feb: true, mar: true, apr: true, mei: true, jun: false, jul: false, agu: false, sep: false, okt: false, nov: false, des: false },
  { id: '3', nama: 'Budi Santoso', kategori: 'LANSIA', jk: 'L', jan: true, feb: false, mar: true, apr: false, mei: true, jun: false, jul: false, agu: false, sep: false, okt: false, nov: false, des: false },
]

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

export default function SasaranIndividuPage() {
  const [search, setSearch] = useState('')
  const [data, setData] = useState(dummySasaran)

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Sasaran Individu SIP 6</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">Pencatatan kehadiran sasaran per individu</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-white dark:bg-[#202020] border border-slate-200 dark:border-white/10 rounded-md px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="bg-[var(--dash-primary)] text-white font-semibold py-2.5 px-4 rounded-md hover:from-purple-600 hover:to-indigo-700 transition-all shadow-none flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Tambah Sasaran
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-[#202020] p-4 rounded-lg border border-slate-200 dark:border-white/10">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full bg-slate-50 dark:bg-[#2f2f2f]/50 border border-slate-200 dark:border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 transition-all"
            placeholder="Cari nama sasaran..."
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select className="bg-slate-50 dark:bg-[#2f2f2f]/50 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 transition-all w-full md:w-auto">
            <option value="">Semua Kategori</option>
            <option value="BAYI_BALITA">Bayi/Balita</option>
            <option value="IBU_HAMIL">Ibu Hamil</option>
            <option value="LANSIA">Lansia</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#202020] rounded-lg border border-slate-200 dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
            <thead className="text-[11px] uppercase tracking-wider bg-transparent text-slate-500 dark:text-white/50 border-b border-slate-200/70 dark:border-white/10">
              <tr>
                <th className="px-6 py-4 sticky left-0 bg-slate-50 dark:bg-[#202020] z-10">Nama</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">JK</th>
                {months.map(month => (
                  <th key={month} className="px-3 py-4 text-center">{month}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b border-slate-200/70 dark:border-white/10 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-white sticky left-0 bg-white dark:bg-[#202020] z-10">{row.nama}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      row.kategori === 'BAYI_BALITA' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400' :
                      row.kategori === 'IBU_HAMIL' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400' :
                      'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400'
                    }`}>
                      {row.kategori}
                    </span>
                  </td>
                  <td className="px-6 py-4">{row.jk}</td>
                  {months.map((month, idx) => {
                    const monthKey = month.toLowerCase() as keyof typeof row
                    const attended = row[monthKey] as boolean
                    return (
                      <td key={month} className="px-3 py-4 text-center">
                        <div className="flex justify-center">
                          {attended ? (
                            <div className="w-5 h-5 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                              <Check className="w-3 h-3" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 bg-slate-100 dark:bg-[#252525] rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                              <X className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
