'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Plus, Trash2, Edit2, Check, X, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function PetugasPage() {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role

  // Fetch Posyandus
  const [posyandus, setPosyandus] = useState<any[]>([])
  const [loadingPosyandu, setLoadingPosyandu] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('ALL')

  useEffect(() => {
    if (role && role !== 'SUPERADMIN') {
      fetch('/api/posyandu')
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) {
            setPosyandus(data)
          }
        })
        .catch(err => console.error('Error fetching posyandus:', err))
        .finally(() => setLoadingPosyandu(false))
    } else {
      setLoadingPosyandu(false)
    }
  }, [role])

  const isPosyandu = role === 'OPERATOR_POSYANDU'

  const theme = {
    bgGradient: 'from-[var(--dash-primary)] to-[var(--dash-primary)]',
    hoverGradient: 'hover:opacity-90',
    shadow: 'shadow-none',
    focusBorder: 'focus:border-purple-500',
    focusRing: 'focus:ring-purple-500/25 focus:border-purple-400/10',
    text: 'text-purple-600',
    bgLight: 'bg-purple-50',
    textLight: 'text-purple-700',
    activeRing: 'focus:ring-purple-500/25 focus:border-purple-400',
    bgSolid: 'bg-purple-500',
    hoverSolid: 'hover:bg-purple-600',
    borderLight: 'border-purple-200',
    hoverLight: 'hover:bg-purple-50',
    shadowSolid: 'shadow-purple-500/20',
    textDark: 'dark:text-purple-400',
    bgDarkLight: 'dark:bg-purple-900/30',
    focusRingSolid: 'focus:ring-purple-500/25 focus:border-purple-400',
  }

  // Load petugas from localStorage or default mock
  const [petugas, setPetugas] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sip_petugas')
      if (saved) return JSON.parse(saved)
    }
    return [
      { id: '1', nama: 'Siti', role: 'KADER', posyanduId: 'default-1', unit: 'Posyandu Mawar 1' },
      { id: '2', nama: 'Ani', role: 'KADER', posyanduId: 'default-1', unit: 'Posyandu Mawar 1' },
      { id: '3', nama: 'Budi', role: 'PLKB', posyanduId: 'DESA', unit: 'Desa' },
    ]
  })

  // Mock attendance data: { petugasId: { monthIndex: boolean } }
  const [attendance, setAttendance] = useState<{ [key: string]: { [key: number]: boolean } }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sip_attendance')
      if (saved) return JSON.parse(saved)
    }
    return {
      '1': { 0: true, 1: true, 2: true, 3: false, 4: true },
      '2': { 0: true, 1: false, 2: true, 3: true, 4: false },
      '3': { 0: false, 1: true, 2: true, 3: false, 4: true },
    }
  })

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('sip_petugas', JSON.stringify(petugas))
  }, [petugas])

  useEffect(() => {
    localStorage.setItem('sip_attendance', JSON.stringify(attendance))
  }, [attendance])

  // Map mock data unit and posyanduId to first fetched posyandu if it matches "default-1"
  useEffect(() => {
    if (posyandus.length > 0) {
      setPetugas(prev => prev.map(p => {
        if (p.posyanduId === 'default-1') {
          return { ...p, posyanduId: posyandus[0].id, unit: posyandus[0].nama }
        }
        if (p.id === '3' && p.posyanduId === 'DESA') {
          return { ...p, unit: (session?.user as any)?.kecamatanNama ? `Desa ${(session?.user as any)?.kecamatanNama}` : 'Desa' }
        }
        return p
      }))
    }
  }, [posyandus, session])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedPetugas, setSelectedPetugas] = useState<any>(null)
  const [formData, setFormData] = useState({ nama: '', role: 'KADER', posyanduId: 'DESA', unit: '' })

  const handleOpenAdd = () => {
    setModalMode('add')
    const initialPosyanduId = activeTab === 'ALL' ? (posyandus[0]?.id || 'DESA') : activeTab
    const initialUnit = initialPosyanduId === 'DESA'
      ? ((session?.user as any)?.kecamatanNama ? `Desa ${(session?.user as any)?.kecamatanNama}` : 'Desa')
      : (posyandus.find(p => p.id === initialPosyanduId)?.nama || 'Posyandu')

    setFormData({ nama: '', role: 'KADER', posyanduId: initialPosyanduId, unit: initialUnit })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (p: any) => {
    setModalMode('edit')
    setSelectedPetugas(p)
    setFormData({ nama: p.nama, role: p.role, posyanduId: p.posyanduId || 'DESA', unit: p.unit })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus petugas ini?')) {
      setPetugas(prev => prev.filter(p => p.id !== id))
      setAttendance(prev => {
        const { [id]: _, ...rest } = prev
        return rest
      })
    }
  }

  const handleSave = () => {
    if (!formData.nama || !formData.unit) {
      alert('Nama dan Unit harus diisi!')
      return
    }

    if (modalMode === 'add') {
      const newId = String(Date.now())
      setPetugas(prev => [...prev, { id: newId, ...formData }])
    } else {
      setPetugas(prev => prev.map(p => p.id === selectedPetugas.id ? { ...p, ...formData } : p))
    }
    setIsModalOpen(false)
  }

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 
    'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
  ]

  const toggleAttendance = (petugasId: string, monthIndex: number) => {
    setAttendance(prev => {
      const currentPetugas = prev[petugasId] || {}
      return {
        ...prev,
        [petugasId]: {
          ...currentPetugas,
          [monthIndex]: !currentPetugas[monthIndex]
        }
      }
    })
  }

  if (role === 'SUPERADMIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm max-w-xl mx-auto my-12">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Akses Ditolak</h1>
        <p className="text-[var(--dash-text-soft)] mt-2 max-w-md">
          Halaman Pengaturan Petugas hanya ditujukan untuk operator Desa atau Posyandu.
        </p>
      </div>
    )
  }

  // Filter petugas based on selected activeTab
  const filteredPetugas = petugas.filter(p => {
    if (activeTab === 'ALL') return true
    return p.posyanduId === activeTab
  })

  return (
    <div className="p-6 space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--dash-text)]">
            Pengaturan Petugas & Absensi
          </h1>
          <p className="text-sm text-[var(--dash-text-soft)] mt-1 font-light">
            Kelola data petugas dan rekap absensi bulanan.
          </p>
        </div>
      </div>

      {loadingPosyandu ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      ) : (
        <>
          {/* Dynamic Tabs */}
          {posyandus.length > 0 && (
            <div className="flex gap-2 p-1.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-white/5 rounded-xl overflow-x-auto">
              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'ALL'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/10'
                    : 'text-[var(--dash-text-soft)] hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}
              >
                Semua Petugas
              </button>
              {posyandus.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActiveTab(p.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                    activeTab === p.id
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/10'
                      : 'text-[var(--dash-text-soft)] hover:bg-slate-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {p.nama}
                </button>
              ))}
              <button
                onClick={() => setActiveTab('DESA')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'DESA'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/10'
                    : 'text-[var(--dash-text-soft)] hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}
              >
                PLKB / Medis Desa
              </button>
            </div>
          )}

          {/* Section 1: Daftar Petugas */}
          <div className="dash-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[var(--dash-text)]">Daftar Petugas</h2>
              <button 
                onClick={handleOpenAdd}
                className={`${theme.bgSolid} ${theme.hoverSolid} text-white font-medium py-2 px-4 rounded-md transition-all flex items-center gap-2 text-sm`}
              >
                <Plus className="w-4 h-4" />
                Tambah Petugas
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-[var(--dash-text-soft)]">
                <thead className="text-[11px] uppercase tracking-wider bg-transparent text-slate-500 dark:text-white/50 border-b border-slate-200/70 dark:border-white/10">
                  <tr>
                    <th className="px-4 py-3 font-medium">No</th>
                    <th className="px-4 py-3 font-medium">Nama</th>
                    <th className="px-4 py-3 font-medium">Peran</th>
                    <th className="px-4 py-3 font-medium">Unit/Wilayah</th>
                    <th className="px-4 py-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {filteredPetugas.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                        Belum ada petugas di kriteria ini. Silakan tambahkan.
                      </td>
                    </tr>
                  ) : (
                    filteredPetugas.map((p, index) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-[#2f2f2f]/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-[var(--dash-text)]">{index + 1}</td>
                        <td className="px-4 py-3 font-medium text-[var(--dash-text)]">{p.nama}</td>
                        <td className="px-4 py-3">{p.role}</td>
                        <td className="px-4 py-3">{p.unit}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleOpenEdit(p)}
                              className={`text-slate-400 hover:${theme.text} transition-colors`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(p.id)}
                              className="text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Absensi Bulanan */}
          <div className="dash-card">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-[var(--dash-text)]">Absensi Bulanan</h2>
              <p className="text-sm text-[var(--dash-text-soft)] mt-0.5">
                Klik pada kotak untuk menandai kehadiran petugas setiap bulan.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-[var(--dash-text-soft)]">
                <thead className="text-[11px] uppercase tracking-wider bg-transparent text-slate-500 dark:text-white/50 border-b border-slate-200/70 dark:border-white/10">
                  <tr>
                    <th className="px-4 py-3 font-medium sticky left-0 bg-slate-50 dark:bg-[#202020] z-10">Nama Petugas</th>
                    {months.map((month) => (
                      <th key={month} className="px-3 py-3 text-center font-medium min-w-[60px]">{month}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {filteredPetugas.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="px-4 py-8 text-center text-slate-400">
                        Tidak ada petugas absensi.
                      </td>
                    </tr>
                  ) : (
                    filteredPetugas.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-[#2f2f2f]/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-[var(--dash-text)] sticky left-0 bg-white dark:bg-[#202020] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                          {p.nama}
                        </td>
                        {months.map((_, monthIndex) => {
                          const isPresent = attendance[p.id]?.[monthIndex]
                          return (
                            <td key={monthIndex} className="px-3 py-3 text-center min-w-[60px]">
                              <button
                                onClick={() => toggleAttendance(p.id, monthIndex)}
                                className={`w-6 h-6 rounded-md flex items-center justify-center transition-all border mx-auto ${
                                  isPresent
                                    ? `${theme.bgLight} border-purple-200 ${theme.text} dark:${theme.textDark} dark:border-purple-800`
                                    : 'bg-slate-50 border-slate-200 text-slate-300 dark:bg-[#202020] dark:border-white/10 dark:text-zinc-600 hover:border-purple-300 dark:hover:border-purple-700'
                                }`}
                              >
                                {isPresent && <Check className="w-4 h-4" />}
                              </button>
                            </td>
                          )
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal Tambah/Edit Petugas */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative bg-white dark:bg-[#252525] rounded-t-2xl rounded-b-none sm:rounded-lg shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto border border-slate-200/70 dark:border-white/10"
            >
              <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${theme.bgGradient}`}></div>
              
              <div className="p-6 border-b border-slate-200/70 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[var(--dash-text)]">
                    {modalMode === 'add' ? 'Tambah Petugas' : 'Edit Petugas'}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-md bg-slate-50 dark:bg-[#202020] text-slate-400 hover:text-slate-500 dark:hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--dash-text)] dark:text-zinc-300 mb-1">Nama</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#202020] text-[var(--dash-text)] focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 focus:border-purple-500 transition-colors"
                    placeholder="Nama Petugas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--dash-text)] dark:text-zinc-300 mb-1">Peran</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#202020] text-[var(--dash-text)] focus:ring-2 ${theme.activeRing} focus:border-purple-500 transition-colors`}
                  >
                    <option value="KADER">KADER</option>
                    <option value="PLKB">PLKB</option>
                    <option value="MEDIS">MEDIS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--dash-text)] dark:text-zinc-300 mb-1">Unit/Wilayah</label>
                  <select
                    value={formData.posyanduId}
                    onChange={(e) => {
                      const id = e.target.value
                      const unitName = id === 'DESA'
                        ? ((session?.user as any)?.kecamatanNama ? `Desa ${(session?.user as any)?.kecamatanNama}` : 'Desa')
                        : (posyandus.find(p => p.id === id)?.nama || 'Posyandu')
                      setFormData({ ...formData, posyanduId: id, unit: unitName })
                    }}
                    className={`w-full p-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#202020] text-[var(--dash-text)] focus:ring-2 ${theme.activeRing} focus:border-purple-500 transition-colors`}
                  >
                    {posyandus.map(p => (
                      <option key={p.id} value={p.id}>{p.nama}</option>
                    ))}
                    <option value="DESA">PLKB / Medis (Tingkat Desa)</option>
                  </select>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200/70 dark:border-white/10 flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-md text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-[#2f2f2f] transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white ${theme.bgSolid} ${theme.hoverSolid} transition-colors flex items-center gap-2`}
                >
                  <Save className="w-4 h-4" />
                  Simpan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
