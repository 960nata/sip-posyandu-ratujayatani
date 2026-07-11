'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Folder, File, Image as ImageIcon, Trash2, Download, 
  Search, Filter, HardDrive, MapPin, User, Calendar, 
  ExternalLink, Eye, AlertCircle, RefreshCw, X
} from 'lucide-react'

interface FileItem {
  id: string
  posyanduId: string | null
  laporanId: string | null
  laporanPRId: string | null
  bidang: string
  kategori: string
  fileName: string
  filePath: string
  fileSize: number
  mimeType: string
  uploadedBy: string
  uploadedAt: string
  posyandu?: {
    nama: string
    desa: {
      nama: string
      kecamatan: {
        nama: string
      }
    }
  }
  laporan?: {
    nama: string
    nik: string | null
    halPengaduan: string
    bidang: string
  }
  laporanPR?: {
    nama: string
    nik: string | null
    keteranganPermohonan: string | null
  }
}

export default function DataDukungPage() {
  const { data: session, status } = useSession()
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'GAMBAR' | 'DOKUMEN'>('GAMBAR')
  const [selectedBidang, setSelectedBidang] = useState<string>('ALL')
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchFiles = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/data-dukung')
      const data = await res.json()
      if (data.success) {
        setFiles(data.data)
      }
    } catch (error) {
      console.error("Gagal memuat berkas:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user && (session.user as any).role === 'SUPERADMIN') {
      fetchFiles()
    }
  }, [session])

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mb-2" />
        <p className="text-slate-500 dark:text-zinc-400 text-sm">Memuat halaman...</p>
      </div>
    )
  }

  const role = (session?.user as any)?.role
  if (role !== 'SUPERADMIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white dark:bg-[#252525] rounded-lg border border-slate-200/70 dark:border-white/10 max-w-xl mx-auto my-12">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Akses Ditolak</h1>
        <p className="text-slate-500 dark:text-zinc-400 mt-2 max-w-md">
          Hanya pengguna dengan peran **Superadmin** yang diizinkan untuk melihat galeri data dukung dan media di sistem ini.
        </p>
      </div>
    )
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/data-dukung?id=${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) {
        setFiles(files.filter(f => f.id !== id))
        setDeleteConfirmId(null)
      } else {
        alert(`Gagal menghapus file: ${data.error}`)
      }
    } catch (error) {
      console.error("Gagal menghapus file:", error)
      alert("Terjadi kesalahan koneksi saat menghapus file.")
    } finally {
      setIsDeleting(false)
    }
  }

  // Format File Size
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  // Derive Friendly Name and Source Info
  const getFileDetails = (file: FileItem) => {
    let friendlyName = file.fileName
    let sourceText = 'Umum / Upload Langsung'
    let info = ''

    if (file.laporan) {
      const applicantName = file.laporan.nama
      const bidang = file.laporan.bidang
      friendlyName = `Berkas Laporan ${bidang} (${applicantName})`
      sourceText = `Pengaduan Bidang ${bidang}`
      info = file.laporan.halPengaduan
    } else if (file.laporanPR) {
      const applicantName = file.laporanPR.nama
      friendlyName = `Berkas Laporan Perumahan (PR) - ${applicantName}`
      sourceText = `Pengaduan Bidang Perumahan (PR)`
      info = file.laporanPR.keteranganPermohonan || ''
    }

    const isImage = file.mimeType.startsWith('image/') || 
      ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.heic'].some(ext => file.fileName.toLowerCase().endsWith(ext))

    return { friendlyName, sourceText, info, isImage }
  }

  // Filter Files
  const filteredFiles = files.filter(file => {
    const { friendlyName, sourceText, info } = getFileDetails(file)
    const isImageFile = file.mimeType.startsWith('image/') || 
      ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.heic'].some(ext => file.fileName.toLowerCase().endsWith(ext))

    // Filter by Tab
    if (activeTab === 'GAMBAR' && !isImageFile) return false
    if (activeTab === 'DOKUMEN' && isImageFile) return false

    // Filter by Bidang
    if (selectedBidang !== 'ALL' && file.bidang !== selectedBidang) return false

    // Filter by Search
    const searchLower = search.toLowerCase()
    const matchSearch = 
      file.fileName.toLowerCase().includes(searchLower) ||
      friendlyName.toLowerCase().includes(searchLower) ||
      file.kategori.toLowerCase().includes(searchLower) ||
      sourceText.toLowerCase().includes(searchLower) ||
      info.toLowerCase().includes(searchLower) ||
      (file.posyandu?.nama || '').toLowerCase().includes(searchLower) ||
      (file.posyandu?.desa.nama || '').toLowerCase().includes(searchLower) ||
      (file.posyandu?.desa.kecamatan.nama || '').toLowerCase().includes(searchLower)

    return matchSearch
  })

  // Total Storage Size Calculation
  const totalStorageSize = files.reduce((acc, curr) => acc + curr.fileSize, 0)

  // Get distinct list of bidang for filter
  const distinctBidang = Array.from(new Set(files.map(f => f.bidang)))

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <HardDrive className="w-7 h-7 text-purple-600" />
            Galeri Media & Berkas (Superadmin)
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">
            Manajemen berkas, gambar, dan data dukung yang diunggah dari kegiatan posyandu dan laporan bidang.
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm font-medium text-slate-700 dark:text-zinc-300">
            Total Storage Terpakai: <span className="text-purple-600 font-bold">{formatBytes(totalStorageSize)}</span>
          </div>
          <div className="w-48 h-2 bg-slate-100 dark:bg-[#202020] rounded-full mt-1.5 overflow-hidden">
            <div 
              className="h-full bg-[var(--dash-primary)] rounded-full" 
              style={{ width: `${Math.min((totalStorageSize / (100 * 1024 * 1024)) * 100, 100)}%` }} // Percent of 100MB
            />
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Estimasi kuota server (Soft Limit 100MB)</span>
        </div>
      </div>

      {/* Tabs Selection */}
      <div className="flex border-b border-slate-200 dark:border-white/10 gap-4">
        <button
          onClick={() => setActiveTab('GAMBAR')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'GAMBAR' 
              ? 'border-purple-600 text-purple-600' 
              : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Tab Gambar
        </button>
        <button
          onClick={() => setActiveTab('DOKUMEN')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'DOKUMEN' 
              ? 'border-purple-600 text-purple-600' 
              : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300'
          }`}
        >
          <File className="w-4 h-4" />
          Tab Dokumen & PDF
        </button>
      </div>

      {/* Toolbar Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-[#202020] p-4 rounded-lg border border-slate-200 dark:border-white/10">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full bg-slate-50 dark:bg-[#2f2f2f]/50 border border-slate-200 dark:border-white/10 rounded-lg pl-10 pr-4 py-2 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
            placeholder="Cari berdasarkan nama, pemohon, NIK, wilayah..."
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedBidang}
            onChange={(e) => setSelectedBidang(e.target.value)}
            className="bg-slate-50 dark:bg-[#2f2f2f]/50 border border-slate-200 dark:border-white/10 rounded-[10px] px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none transition-all w-full md:w-auto"
          >
            <option value="ALL">Semua Bidang</option>
            {distinctBidang.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Files Grid/List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-[#202020] rounded-lg border border-slate-200 dark:border-white/10">
          <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mb-2" />
          <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">Mengambil berkas...</p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#202020] rounded-lg border border-slate-200 dark:border-white/10 text-center px-4">
          <div className="w-16 h-16 bg-slate-50 dark:bg-[#2f2f2f]/50 rounded-full flex items-center justify-center text-slate-400 mb-4">
            <Folder className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Tidak Ada File Ditemukan</h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-sm">
            Tidak ada data dukung yang cocok dengan kriteria pencarian atau tab saat ini.
          </p>
        </div>
      ) : activeTab === 'GAMBAR' ? (
        /* Image Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredFiles.map((file) => {
            const { friendlyName, sourceText, info } = getFileDetails(file)
            return (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#202020] rounded-lg border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative aspect-video bg-slate-100 dark:bg-[#252525] overflow-hidden flex items-center justify-center group-hover:opacity-95 transition-opacity">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={file.filePath} 
                    alt={friendlyName} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      onClick={() => setPreviewImage(file.filePath)}
                      className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-sm transition-all"
                      title="Lihat Gambar"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <a 
                      href={file.filePath} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-sm transition-all"
                      title="Buka Tab Baru"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                  <span className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    {file.bidang}
                  </span>
                </div>

                {/* Body Info */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white line-clamp-2 leading-tight" title={friendlyName}>
                      {friendlyName}
                    </h3>
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono truncate" title={file.fileName}>
                      {file.fileName}
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      {sourceText}
                    </p>
                    {info && (
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 italic line-clamp-2 leading-normal">
                        "{info}"
                      </p>
                    )}
                  </div>

                  {/* Metadata & Origin */}
                  <div className="pt-3 border-t border-slate-200/70 dark:border-white/10/50 space-y-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
                    {file.posyandu && (
                      <div className="flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-tight">
                          {file.posyandu.nama}, Desa {file.posyandu.desa.nama}, Kec. {file.posyandu.desa.kecamatan.nama}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">Oleh: {file.uploadedBy}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(file.uploadedAt).toLocaleDateString('id-ID')}
                      </span>
                      <span>{formatBytes(file.fileSize)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#202020]/80 border-t border-slate-200/70 dark:border-white/10/50 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    {file.kategori}
                  </span>
                  <div className="flex items-center gap-2">
                    <a 
                      href={file.filePath}
                      download={file.fileName}
                      className="p-1.5 text-slate-500 hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400 transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button 
                      onClick={() => setDeleteConfirmId(file.id)}
                      className="p-1.5 text-slate-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        /* Document List View */
        <div className="bg-white dark:bg-[#202020] rounded-lg border border-slate-200 dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
              <thead className="text-xs uppercase bg-slate-50 dark:bg-[#2f2f2f]/50 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4">Nama & Asal Dokumen</th>
                  <th className="px-6 py-4">Sumber Laporan</th>
                  <th className="px-6 py-4">Posyandu & Wilayah</th>
                  <th className="px-6 py-4">Pengunggah</th>
                  <th className="px-6 py-4">Ukuran & Tanggal</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-700">
                {filteredFiles.map((file) => {
                  const { friendlyName, sourceText, info } = getFileDetails(file)
                  return (
                    <tr key={file.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-700/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                            <File className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-800 dark:text-white leading-tight">
                              {friendlyName}
                            </h4>
                            <p className="text-xs font-mono text-slate-400 dark:text-zinc-500 truncate max-w-xs mt-0.5" title={file.fileName}>
                              {file.fileName}
                            </p>
                            <span className="inline-block bg-slate-100 dark:bg-[#252525] px-2 py-0.5 rounded text-[10px] font-semibold text-slate-600 dark:text-slate-300 mt-1 uppercase">
                              {file.kategori}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                            {sourceText}
                          </span>
                          {info && (
                            <p className="text-xs text-slate-400 dark:text-zinc-500 line-clamp-1 italic max-w-xs">
                              "{info}"
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {file.posyandu ? (
                          <div className="text-xs space-y-0.5 text-slate-700 dark:text-zinc-300">
                            <p className="font-semibold">{file.posyandu.nama}</p>
                            <p className="text-slate-400 dark:text-zinc-500">Desa {file.posyandu.desa.nama}, Kec. {file.posyandu.desa.kecamatan.nama}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 dark:text-zinc-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-700 dark:text-zinc-300">
                        {file.uploadedBy}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="text-slate-700 dark:text-zinc-300">
                          <p className="font-medium">{formatBytes(file.fileSize)}</p>
                          <p className="text-slate-400 dark:text-zinc-500 mt-0.5">
                            {new Date(file.uploadedAt).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a 
                            href={file.filePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            title="Buka Berkas"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <a 
                            href={file.filePath}
                            download={file.fileName}
                            className="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            title="Unduh Berkas"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <button 
                            onClick={() => setDeleteConfirmId(file.id)}
                            className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[85vh] overflow-hidden bg-zinc-900 rounded-lg p-2 flex flex-col items-center shadow-2xl"
            >
              <button 
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 bg-zinc-800/80 hover:bg-zinc-700 text-white rounded-full p-2.5 backdrop-blur-sm transition-all z-10"
              >
                <X className="w-5 h-5" />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={previewImage} 
                alt="Preview" 
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#202020] rounded-lg max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-white/10 space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-950/40 rounded-full flex items-center justify-center text-red-600 shrink-0">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                    Hapus Berkas Permanen?
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">
                    Tindakan ini tidak dapat dibatalkan. Berkas akan terhapus secara permanen dari server penyimpanan cloud/lokal dan database.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 rounded-[10px] text-sm font-semibold hover:bg-slate-50 dark:hover:bg-[#2f2f2f]/50 transition-all disabled:opacity-55"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-[10px] text-sm font-semibold transition-all disabled:opacity-55 flex items-center gap-1.5"
                >
                  {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
