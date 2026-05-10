'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Folder, Upload, File, Image as ImageIcon, 
  Trash2, Download, Search, Filter, HardDrive
} from 'lucide-react'

// Dummy data for uploaded files
const dummyFiles = [
  { id: '1', name: 'foto_kondisi_rumah_p_joko.jpg', type: 'image/jpeg', size: '2.4 MB', date: '2026-05-01', category: 'Perumahan' },
  { id: '2', name: 'sk_kematian_bu_asnah.pdf', type: 'application/pdf', size: '1.1 MB', date: '2026-05-03', category: 'SIP 6' },
  { id: '3', name: 'berkas_beasiswa_anak.zip', type: 'application/zip', size: '15.5 MB', date: '2026-05-05', category: 'Pendidikan' },
]

export default function DataDukungPage() {
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Data Dukung & Media</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">Penyimpanan berkas, foto, dan dokumen laporan.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-500 dark:text-zinc-400 flex items-center gap-1">
            <HardDrive className="w-4 h-4" />
            <span>Used: 19.0 MB / 5 GB</span>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border-2 border-dashed border-emerald-300 dark:border-emerald-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer group">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <p className="text-lg font-semibold text-slate-800 dark:text-white mb-1">Klik atau seret file ke sini untuk upload</p>
          <p className="text-sm text-slate-500 dark:text-zinc-400">Mendukung file Gambar, PDF, dan ZIP hingga 50MB.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-800 p-4 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full bg-slate-50 dark:bg-zinc-700/50 border border-slate-200 dark:border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="Cari nama file..."
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-700/50 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all w-full md:w-auto justify-center">
            <Filter className="w-4 h-4" />
            Semua Kategori
          </button>
        </div>
      </div>

      {/* Files List */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4">Nama File</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Ukuran</th>
                <th className="px-6 py-4">Tanggal Upload</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dummyFiles.map((file) => (
                <tr key={file.id} className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-white flex items-center gap-3">
                    {file.type.startsWith('image/') ? (
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <File className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="truncate max-w-xs">{file.name}</span>
                      <span className="text-xs text-slate-400">{file.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 dark:bg-zinc-900 px-2 py-1 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300">
                      {file.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">{file.size}</td>
                  <td className="px-6 py-4">{file.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
