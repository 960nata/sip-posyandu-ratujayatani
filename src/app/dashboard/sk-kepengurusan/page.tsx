'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import {
  FileText, Plus, Trash2, Edit2, X, Save, ChevronDown, ChevronUp,
  Users, Calendar, Hash, User, Shield, Award, Phone, MapPin, Eye,
  CheckCircle, XCircle, Briefcase, AlertCircle, Search
} from 'lucide-react'

type AnggotaForm = {
  nama: string
  jabatan: string
  bidang: string
  nikNip: string
  alamat: string
  noHP: string
}

type SKData = {
  id: string
  posyanduId: string
  nomorSK: string
  tanggalPenetapan: string
  pejabatPenetap: string
  periodeAwal: string
  periodeAkhir: string
  keterangan: string | null
  isActive: boolean
  tipe: string
  posyandu: { nama: string, id: string }
  anggota: {
    id: string
    nama: string
    jabatan: string
    bidang: string | null
    nikNip: string | null
    alamat: string | null
    noHP: string | null
  }[]
  createdAt: string
}

const JABATAN_OPTIONS = [
  { value: 'KETUA', label: 'Ketua' },
  { value: 'SEKRETARIS', label: 'Sekretaris' },
  { value: 'BENDAHARA', label: 'Bendahara' },
  { value: 'KETUA_BIDANG', label: 'Ketua Bidang' },
  { value: 'KADER', label: 'Kader' },
]

const BIDANG_OPTIONS = [
  'Kesehatan',
  'Pendidikan',
  'Pekerjaan Umum',
  'Perumahan Rakyat',
  'Trantibum & Linmas',
  'Sosial',
]

const jabatanLabel = (val: string) => JABATAN_OPTIONS.find(j => j.value === val)?.label || val

const jabatanColor = (val: string) => {
  switch (val) {
    case 'KETUA': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    case 'SEKRETARIS': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'BENDAHARA': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'KETUA_BIDANG': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    case 'KADER': return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
    default: return 'bg-slate-100 text-slate-600'
  }
}

const emptyAnggota: AnggotaForm = {
  nama: '', jabatan: 'KADER', bidang: '', nikNip: '', alamat: '', noHP: ''
}

export default function SKKepengurusanPage() {
  const { data: session } = useSession()
  const isPosyandu = (session?.user as any)?.role === 'OPERATOR_POSYANDU'
  const userRole = (session?.user as any)?.role

  const theme = {
    bgGradient: isPosyandu ? 'from-purple-500 to-indigo-600' : 'from-emerald-500 to-teal-600',
    hoverGradient: isPosyandu ? 'hover:from-purple-600 hover:to-indigo-700' : 'hover:from-emerald-600 hover:to-teal-700',
    shadow: isPosyandu ? 'shadow-purple-500/20' : 'shadow-emerald-500/20',
    focusBorder: isPosyandu ? 'focus:border-purple-500' : 'focus:border-emerald-500',
    focusRing: isPosyandu ? 'focus:ring-purple-500/10' : 'focus:ring-emerald-500/10',
    text: isPosyandu ? 'text-purple-600' : 'text-emerald-600',
    textDark: isPosyandu ? 'dark:text-purple-400' : 'dark:text-emerald-400',
    bgLight: isPosyandu ? 'bg-purple-50' : 'bg-emerald-50',
    bgDarkLight: isPosyandu ? 'dark:bg-purple-900/30' : 'dark:bg-emerald-900/30',
    bgSolid: isPosyandu ? 'bg-purple-500' : 'bg-emerald-500',
    hoverSolid: isPosyandu ? 'hover:bg-purple-600' : 'hover:bg-emerald-600',
    borderLight: isPosyandu ? 'border-purple-200' : 'border-emerald-200',
    iconBg: isPosyandu ? 'bg-purple-100' : 'bg-emerald-100',
    iconBgDark: isPosyandu ? 'dark:bg-purple-900/50' : 'dark:bg-emerald-900/50',
    activeRing: isPosyandu ? 'focus:ring-purple-500' : 'focus:ring-emerald-500',
    borderT: isPosyandu ? 'border-t-purple-500' : 'border-t-emerald-500',
  }

  const [skList, setSkList] = useState<SKData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [editingSK, setEditingSK] = useState<SKData | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Filter state for SK types
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'SK_DESA' | 'SK_PENGELOLA'>('ALL')
  const [posyandus, setPosyandus] = useState<{ id: string; nama: string }[]>([])

  // Form state
  const [formSK, setFormSK] = useState({
    nomorSK: '',
    tanggalPenetapan: '',
    pejabatPenetap: '',
    periodeAwal: '',
    periodeAkhir: '',
    keterangan: '',
    isActive: true,
    posyanduId: '',
  })
  const [formAnggota, setFormAnggota] = useState<AnggotaForm[]>([{ ...emptyAnggota }])

  // Fetch SK list
  const fetchSKList = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/sk-kepengurusan')
      if (res.ok) {
        const data = await res.json()
        setSkList(data)
      }
    } catch (error) {
      console.error('Failed to fetch SK:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPosyandus = async () => {
    try {
      const res = await fetch('/api/posyandu')
      if (res.ok) {
        const data = await res.json()
        setPosyandus(data)
      }
    } catch (error) {
      console.error('Failed to fetch posyandus:', error)
    }
  }

  useEffect(() => {
    fetchSKList()
  }, [])

  useEffect(() => {
    if (session?.user && (session.user as any).role === 'OPERATOR_DESA') {
      fetchPosyandus()
    }
  }, [session])

  const canModifySK = (sk: SKData) => {
    if (userRole === 'OPERATOR_DESA') {
      return sk.tipe === 'SK_DESA'
    }
    if (userRole === 'OPERATOR_POSYANDU') {
      return sk.tipe === 'SK_PENGELOLA'
    }
    return false
  }

  const filteredSkList = skList.filter(sk => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = (
      sk.nomorSK.toLowerCase().includes(searchLower) ||
      sk.pejabatPenetap.toLowerCase().includes(searchLower) ||
      (sk.posyandu?.nama || '').toLowerCase().includes(searchLower) ||
      sk.anggota.some(a => a.nama.toLowerCase().includes(searchLower))
    )
    const matchesType = typeFilter === 'ALL' || sk.tipe === typeFilter
    return matchesSearch && matchesType
  })

  const handleOpenAdd = () => {
    setModalMode('add')
    setEditingSK(null)
    setFormSK({
      nomorSK: '',
      tanggalPenetapan: '',
      pejabatPenetap: '',
      periodeAwal: '',
      periodeAkhir: '',
      keterangan: '',
      isActive: true,
      posyanduId: '',
    })
    setFormAnggota([
      { nama: '', jabatan: 'KETUA', bidang: '', nikNip: '', alamat: '', noHP: '' },
      { nama: '', jabatan: 'SEKRETARIS', bidang: '', nikNip: '', alamat: '', noHP: '' },
      { nama: '', jabatan: 'BENDAHARA', bidang: '', nikNip: '', alamat: '', noHP: '' },
    ])
    setIsModalOpen(true)
  }

  const handleOpenEdit = (sk: SKData) => {
    setModalMode('edit')
    setEditingSK(sk)
    setFormSK({
      nomorSK: sk.nomorSK,
      tanggalPenetapan: sk.tanggalPenetapan.split('T')[0],
      pejabatPenetap: sk.pejabatPenetap,
      periodeAwal: sk.periodeAwal.split('T')[0],
      periodeAkhir: sk.periodeAkhir.split('T')[0],
      keterangan: sk.keterangan || '',
      isActive: sk.isActive,
      posyanduId: sk.posyanduId || '',
    })
    setFormAnggota(
      sk.anggota.map(a => ({
        nama: a.nama,
        jabatan: a.jabatan,
        bidang: a.bidang || '',
        nikNip: a.nikNip || '',
        alamat: a.alamat || '',
        noHP: a.noHP || '',
      }))
    )
    setIsModalOpen(true)
  }

  const handleAddAnggota = () => {
    setFormAnggota(prev => [...prev, { ...emptyAnggota }])
  }

  const handleRemoveAnggota = (index: number) => {
    setFormAnggota(prev => prev.filter((_, i) => i !== index))
  }

  const handleAnggotaChange = (index: number, field: keyof AnggotaForm, value: string) => {
    setFormAnggota(prev => prev.map((a, i) => i === index ? { ...a, [field]: value } : a))
  }

  const handleSave = async () => {
    if (!formSK.nomorSK || !formSK.tanggalPenetapan || !formSK.pejabatPenetap || !formSK.periodeAwal || !formSK.periodeAkhir) {
      alert('Lengkapi semua field SK yang wajib diisi!')
      return
    }

    if (!isPosyandu && !formSK.posyanduId) {
      alert('Pilih posyandu terlebih dahulu!')
      return
    }

    const validAnggota = formAnggota.filter(a => a.nama.trim() !== '')
    if (validAnggota.length === 0) {
      alert('Minimal harus ada 1 anggota pengurus!')
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...formSK,
        anggota: validAnggota,
      }

      let res: Response
      if (modalMode === 'add') {
        res = await fetch('/api/sk-kepengurusan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch(`/api/sk-kepengurusan/${editingSK!.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      if (res.ok) {
        setIsModalOpen(false)
        fetchSKList()
      } else {
        const err = await res.json()
        alert(err.error || 'Gagal menyimpan SK')
      }
    } catch (error) {
      alert('Terjadi kesalahan saat menyimpan')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/sk-kepengurusan/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setDeleteConfirm(null)
        fetchSKList()
      }
    } catch (error) {
      alert('Gagal menghapus SK')
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
  }

  return (
    <div className="p-4 md:p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className={`w-10 h-10 ${theme.iconBg} ${theme.iconBgDark} rounded-xl flex items-center justify-center`}>
              <FileText className={`w-5 h-5 ${theme.text} ${theme.textDark}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                SK Kepengurusan
              </h1>
              <p className="text-sm text-slate-500 dark:text-zinc-400 font-light">
                {isPosyandu
                  ? 'Kelola Surat Keputusan Kepengurusan Posyandu Anda'
                  : 'Daftar Surat Keputusan Kepengurusan Posyandu di Wilayah Desa'}
              </p>
            </div>
          </div>
        </div>
        {((session?.user as any)?.role === 'OPERATOR_POSYANDU' || (session?.user as any)?.role === 'OPERATOR_DESA') && (
          <button
            onClick={handleOpenAdd}
            className={`bg-gradient-to-r ${theme.bgGradient} ${theme.hoverGradient} text-white font-medium py-2.5 px-5 rounded-xl transition-all shadow-lg ${theme.shadow} flex items-center gap-2 text-sm`}
          >
            <Plus className="w-4 h-4" />
            Tambah SK Baru
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className={`w-10 h-10 border-4 border-slate-200 dark:border-slate-700 ${theme.borderT} rounded-full animate-spin`}></div>
          <p className="text-sm text-slate-500 dark:text-zinc-400">Memuat data SK...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && skList.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-100 dark:border-slate-800 p-12 text-center"
        >
          <div className={`w-16 h-16 ${theme.iconBg} ${theme.iconBgDark} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
            <FileText className={`w-8 h-8 ${theme.text} ${theme.textDark}`} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Belum Ada SK Kepengurusan
          </h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6 max-w-md mx-auto">
            {isPosyandu
              ? 'Buat Surat Keputusan untuk menetapkan susunan pengurus posyandu Anda.'
              : 'Belum ada Surat Keputusan kepengurusan posyandu yang terdaftar di wilayah Anda.'}
          </p>
          {(isPosyandu || userRole === 'OPERATOR_DESA') && (
            <button
              onClick={handleOpenAdd}
              className={`bg-gradient-to-r ${theme.bgGradient} text-white font-medium py-2.5 px-6 rounded-xl transition-all shadow-lg ${theme.shadow} inline-flex items-center gap-2 text-sm`}
            >
              <Plus className="w-4 h-4" />
              Buat SK Pertama
            </button>
          )}
        </motion.div>
      )}

      {/* Search and Filters */}
      {!loading && skList.length > 0 && (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-4 h-4 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Cari berdasarkan nomor SK, nama posyandu, pengurus..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={`w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 ${theme.focusRing} focus:border-transparent dark:text-white transition-all`}
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto flex-shrink-0">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as any)}
              className={`h-10 px-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 ${theme.focusRing} transition-all`}
            >
              <option value="ALL">Semua Jenis SK</option>
              <option value="SK_DESA">SK Desa</option>
              <option value="SK_PENGELOLA">SK Pengelola</option>
            </select>
          </div>
        </div>
      )}

      {/* Empty Search Results */}
      {!loading && skList.length > 0 && filteredSkList.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-100 dark:border-slate-800 p-12 text-center"
        >
          <div className={`w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
            <Search className={`w-8 h-8 text-slate-400 dark:text-slate-500`} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Pencarian Tidak Ditemukan
          </h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
            Tidak ada SK Kepengurusan yang cocok dengan kata kunci &ldquo;{searchTerm}&rdquo;. Coba gunakan kata kunci lain.
          </p>
        </motion.div>
      )}

      {/* SK List */}
      {!loading && filteredSkList.length > 0 && (
        <div className="space-y-4">
          {filteredSkList.map((sk, index) => (
            <motion.div
              key={sk.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              {/* SK Card Header */}
              <div className="p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      sk.isActive
                        ? `${theme.iconBg} ${theme.iconBgDark}`
                        : 'bg-slate-100 dark:bg-slate-800'
                    }`}>
                      <FileText className={`w-6 h-6 ${
                        sk.isActive
                          ? `${theme.text} ${theme.textDark}`
                          : 'text-slate-400 dark:text-slate-500'
                      }`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {sk.nomorSK}
                        </h3>
                        {sk.posyandu?.nama && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
                            {sk.posyandu.nama}
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          sk.tipe === 'SK_DESA'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30'
                            : 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border-purple-100 dark:border-purple-900/30'
                        }`}>
                          {sk.tipe === 'SK_DESA' ? 'SK Desa' : 'SK Pengelola'}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          sk.isActive
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {sk.isActive ? (
                            <><CheckCircle className="w-3 h-3" /> Aktif</>
                          ) : (
                            <><XCircle className="w-3 h-3" /> Tidak Aktif</>
                          )}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {sk.pejabatPenetap}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(sk.tanggalPenetapan)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {sk.anggota.length} pengurus
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                        Periode: {formatDate(sk.periodeAwal)} — {formatDate(sk.periodeAkhir)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setExpandedId(expandedId === sk.id ? null : sk.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        expandedId === sk.id
                          ? `${theme.bgLight} ${theme.bgDarkLight} ${theme.text} ${theme.textDark}`
                          : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-zinc-400'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {expandedId === sk.id ? 'Tutup' : 'Lihat'}
                      {expandedId === sk.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    {canModifySK(sk) && (
                      <>
                        <button
                          onClick={() => handleOpenEdit(sk)}
                          className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(sk.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded: Anggota Table */}
              <AnimatePresence>
                {expandedId === sk.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-slate-100 dark:border-slate-800">
                      <div className="px-5 md:px-6 py-4">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                          <Users className={`w-4 h-4 ${theme.text} ${theme.textDark}`} />
                          Susunan Pengurus
                        </h4>
                        <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                          <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-800/50 text-slate-600 dark:text-slate-300">
                              <tr>
                                <th className="px-4 py-3 font-medium">No</th>
                                <th className="px-4 py-3 font-medium">Nama</th>
                                <th className="px-4 py-3 font-medium">Jabatan</th>
                                <th className="px-4 py-3 font-medium">Bidang</th>
                                <th className="px-4 py-3 font-medium">NIK/NIP</th>
                                <th className="px-4 py-3 font-medium">No. HP</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                              {sk.anggota.map((anggota, idx) => (
                                <tr key={anggota.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                  <td className="px-4 py-3 text-slate-500 dark:text-zinc-400">{idx + 1}</td>
                                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{anggota.nama}</td>
                                  <td className="px-4 py-3">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${jabatanColor(anggota.jabatan)}`}>
                                      {jabatanLabel(anggota.jabatan)}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-slate-500 dark:text-zinc-400">{anggota.bidang || '—'}</td>
                                  <td className="px-4 py-3 text-slate-500 dark:text-zinc-400 font-mono text-xs">{anggota.nikNip || '—'}</td>
                                  <td className="px-4 py-3 text-slate-500 dark:text-zinc-400">{anggota.noHP || '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {sk.keterangan && (
                          <div className="mt-4 p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl">
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                              <span className="font-semibold text-slate-700 dark:text-zinc-300">Keterangan:</span>{' '}
                              {sk.keterangan}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-slate-100 dark:border-zinc-800"
            >
              <div className="text-center">
                <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-7 h-7 text-rose-600 dark:text-rose-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Hapus SK?</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
                  SK beserta semua data pengurus di dalamnya akan dihapus permanen.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors border border-slate-200 dark:border-zinc-700"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 transition-colors"
                  >
                    Ya, Hapus
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-100 dark:border-zinc-800 my-8"
            >
              {/* Gradient Top Bar */}
              <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${theme.bgGradient}`}></div>

              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${theme.iconBg} ${theme.iconBgDark} rounded-xl flex items-center justify-center`}>
                      <FileText className={`w-5 h-5 ${theme.text} ${theme.textDark}`} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {modalMode === 'add' ? 'Tambah SK Kepengurusan' : 'Edit SK Kepengurusan'}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                        {modalMode === 'add' ? 'Buat surat keputusan baru' : 'Perbarui data surat keputusan'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 dark:bg-zinc-800 text-slate-400 hover:text-slate-500 dark:hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
                {/* SK Info Section */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Hash className={`w-4 h-4 ${theme.text} ${theme.textDark}`} />
                    Informasi SK
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {!isPosyandu && (
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-300 mb-1.5">
                          Pilih Posyandu <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={formSK.posyanduId}
                          onChange={e => setFormSK({ ...formSK, posyanduId: e.target.value })}
                          className={`w-full p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-800 dark:text-white focus:ring-2 ${theme.activeRing} ${theme.focusBorder} transition-all`}
                        >
                          <option value="">— Pilih Posyandu —</option>
                          {posyandus.map(p => (
                            <option key={p.id} value={p.id}>{p.nama}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-300 mb-1.5">
                        Nomor SK <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formSK.nomorSK}
                        onChange={e => setFormSK({ ...formSK, nomorSK: e.target.value })}
                        className={`w-full p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-800 dark:text-white focus:ring-2 ${theme.activeRing} ${theme.focusBorder} transition-all`}
                        placeholder="001/SK-POS/2025"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-300 mb-1.5">
                        Tanggal Penetapan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formSK.tanggalPenetapan}
                        onChange={e => setFormSK({ ...formSK, tanggalPenetapan: e.target.value })}
                        className={`w-full p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-800 dark:text-white focus:ring-2 ${theme.activeRing} ${theme.focusBorder} transition-all`}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-300 mb-1.5">
                        Pejabat yang Menetapkan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formSK.pejabatPenetap}
                        onChange={e => setFormSK({ ...formSK, pejabatPenetap: e.target.value })}
                        className={`w-full p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-800 dark:text-white focus:ring-2 ${theme.activeRing} ${theme.focusBorder} transition-all`}
                        placeholder="Nama Kepala Desa / Lurah"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-300 mb-1.5">
                        Periode Awal <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formSK.periodeAwal}
                        onChange={e => setFormSK({ ...formSK, periodeAwal: e.target.value })}
                        className={`w-full p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-800 dark:text-white focus:ring-2 ${theme.activeRing} ${theme.focusBorder} transition-all`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-300 mb-1.5">
                        Periode Akhir <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formSK.periodeAkhir}
                        onChange={e => setFormSK({ ...formSK, periodeAkhir: e.target.value })}
                        className={`w-full p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-800 dark:text-white focus:ring-2 ${theme.activeRing} ${theme.focusBorder} transition-all`}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-300 mb-1.5">
                        Keterangan
                      </label>
                      <textarea
                        value={formSK.keterangan}
                        onChange={e => setFormSK({ ...formSK, keterangan: e.target.value })}
                        rows={2}
                        className={`w-full p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-800 dark:text-white focus:ring-2 ${theme.activeRing} ${theme.focusBorder} transition-all resize-none`}
                        placeholder="Catatan tambahan (opsional)"
                      />
                    </div>
                    {modalMode === 'edit' && (
                      <div className="md:col-span-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={formSK.isActive}
                              onChange={e => setFormSK({ ...formSK, isActive: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-6 bg-slate-200 dark:bg-zinc-700 peer-checked:bg-emerald-500 rounded-full transition-colors"></div>
                            <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-sm transition-transform peer-checked:translate-x-4"></div>
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                            SK Aktif
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100 dark:border-zinc-800"></div>

                {/* Anggota Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Users className={`w-4 h-4 ${theme.text} ${theme.textDark}`} />
                      Susunan Pengurus ({formAnggota.length})
                    </h3>
                    <button
                      onClick={handleAddAnggota}
                      className={`text-xs font-medium ${theme.text} ${theme.textDark} hover:underline flex items-center gap-1`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Tambah Anggota
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formAnggota.map((anggota, index) => (
                      <div
                        key={index}
                        className="p-4 bg-slate-50/50 dark:bg-zinc-800/30 rounded-xl border border-slate-100 dark:border-zinc-800"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                            Anggota #{index + 1}
                          </span>
                          {formAnggota.length > 1 && (
                            <button
                              onClick={() => handleRemoveAnggota(index)}
                              className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 font-medium"
                            >
                              <Trash2 className="w-3 h-3" />
                              Hapus
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
                              Nama <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={anggota.nama}
                              onChange={e => handleAnggotaChange(index, 'nama', e.target.value)}
                              className={`w-full p-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-800 dark:text-white focus:ring-2 ${theme.activeRing} ${theme.focusBorder} transition-all`}
                              placeholder="Nama lengkap"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
                              Jabatan
                            </label>
                            <select
                              value={anggota.jabatan}
                              onChange={e => handleAnggotaChange(index, 'jabatan', e.target.value)}
                              className={`w-full p-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-800 dark:text-white focus:ring-2 ${theme.activeRing} ${theme.focusBorder} transition-all`}
                            >
                              {JABATAN_OPTIONS.map(j => (
                                <option key={j.value} value={j.value}>{j.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
                              Bidang
                            </label>
                            <select
                              value={anggota.bidang}
                              onChange={e => handleAnggotaChange(index, 'bidang', e.target.value)}
                              className={`w-full p-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-800 dark:text-white focus:ring-2 ${theme.activeRing} ${theme.focusBorder} transition-all`}
                            >
                              <option value="">— Pilih Bidang —</option>
                              {BIDANG_OPTIONS.map(b => (
                                <option key={b} value={b}>{b}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
                              NIK/NIP
                            </label>
                            <input
                              type="text"
                              value={anggota.nikNip}
                              onChange={e => handleAnggotaChange(index, 'nikNip', e.target.value)}
                              className={`w-full p-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-800 dark:text-white focus:ring-2 ${theme.activeRing} ${theme.focusBorder} transition-all`}
                              placeholder="NIK/NIP"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
                              No. HP
                            </label>
                            <input
                              type="text"
                              value={anggota.noHP}
                              onChange={e => handleAnggotaChange(index, 'noHP', e.target.value)}
                              className={`w-full p-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-800 dark:text-white focus:ring-2 ${theme.activeRing} ${theme.focusBorder} transition-all`}
                              placeholder="08xxxxxxxxxx"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
                              Alamat
                            </label>
                            <input
                              type="text"
                              value={anggota.alamat}
                              onChange={e => handleAnggotaChange(index, 'alamat', e.target.value)}
                              className={`w-full p-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-slate-800 dark:text-white focus:ring-2 ${theme.activeRing} ${theme.focusBorder} transition-all`}
                              placeholder="Alamat"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors border border-slate-200 dark:border-zinc-700"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r ${theme.bgGradient} ${theme.hoverGradient} transition-all shadow-lg ${theme.shadow} flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {modalMode === 'add' ? 'Simpan SK' : 'Perbarui SK'}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
