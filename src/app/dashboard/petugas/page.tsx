'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Plus, Trash2, Edit2, ArrowLeft, Check, X } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function PetugasPage() {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role

  if (role === 'SUPERADMIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm max-w-xl mx-auto my-12">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Akses Ditolak</h1>
        <p className="text-slate-500 dark:text-zinc-400 mt-2 max-w-md">
          Halaman Pengaturan Petugas hanya ditujukan untuk operator Desa atau Posyandu.
        </p>
      </div>
    )
  }

  const isPosyandu = role === 'OPERATOR_POSYANDU'

  const theme = {
    bgGradient: isPosyandu ? 'from-[var(--dash-primary)] to-[var(--dash-primary)]' : 'from-[var(--dash-primary)] to-[var(--dash-primary)]',
    hoverGradient: 'hover:opacity-90',
    shadow: 'shadow-none',
    focusBorder: isPosyandu ? 'focus:border-purple-500' : 'focus:border-purple-500',
    focusRing: isPosyandu ? 'focus:ring-purple-500/25 focus:border-purple-400/10' : 'focus:ring-purple-500/25 focus:border-purple-400/10',
    text: isPosyandu ? 'text-purple-600' : 'text-purple-600',
    bgLight: isPosyandu ? 'bg-purple-50' : 'bg-purple-50',
    textLight: isPosyandu ? 'text-purple-700' : 'text-purple-700',
    activeRing: isPosyandu ? 'focus:ring-purple-500/25 focus:border-purple-400' : 'focus:ring-purple-500/25 focus:border-purple-400',
    bgSolid: isPosyandu ? 'bg-purple-500' : 'bg-purple-500',
    hoverSolid: isPosyandu ? 'hover:bg-purple-600' : 'hover:bg-purple-600',
    borderLight: isPosyandu ? 'border-purple-200' : 'border-purple-200',
    hoverLight: isPosyandu ? 'hover:bg-purple-50' : 'hover:bg-purple-50',
    shadowSolid: isPosyandu ? 'shadow-purple-500/20' : 'shadow-purple-500/20',
    textDark: isPosyandu ? 'dark:text-purple-400' : 'dark:text-purple-400',
    bgDarkLight: isPosyandu ? 'dark:bg-purple-900/30' : 'dark:bg-purple-900/30',
    focusRingSolid: isPosyandu ? 'focus:ring-purple-500/25 focus:border-purple-400' : 'focus:ring-purple-500/25 focus:border-purple-400',
  }

  const [petugas, setPetugas] = useState([
    { id: '1', nama: 'Siti', role: 'KADER', unit: 'Posyandu Mawar 1' },
    { id: '2', nama: 'Ani', role: 'KADER', unit: 'Posyandu Mawar 1' },
    { id: '3', nama: 'Budi', role: 'PLKB', unit: 'Desa Adirejo' },
  ])

  // Mock attendance data: { petugasId: { monthIndex: boolean } }
  const [attendance, setAttendance] = useState<{ [key: string]: { [key: number]: boolean } }>({
    '1': { 0: true, 1: true, 2: true, 3: false, 4: true },
    '2': { 0: true, 1: false, 2: true, 3: true, 4: false },
    '3': { 0: false, 1: true, 2: true, 3: false, 4: true },
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedPetugas, setSelectedPetugas] = useState<any>(null)
  const [formData, setFormData] = useState({ nama: '', role: 'KADER', unit: '' })

  const handleOpenAdd = () => {
    setModalMode('add')
    setFormData({ nama: '', role: 'KADER', unit: (session?.user as any)?.kecamatanNama || 'Posyandu Anda' })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (p: any) => {
    setModalMode('edit')
    setSelectedPetugas(p)
    setFormData({ nama: p.nama, role: p.role, unit: p.unit })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus petugas ini?')) {
      setPetugas(prev => prev.filter(p => p.id !== id))
      // Also clean up attendance
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

  return (
    <div className="p-6 space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Pengaturan Petugas & Absensi
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 font-light">
            Kelola data petugas dan rekap absensi bulanan.
          </p>
        </div>
      </div>

      {/* Section 1: Daftar Petugas */}
      <div className="bg-white dark:bg-[#202020] p-6 rounded-lg border border-slate-200/70 dark:border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Daftar Petugas</h2>
          <button 
            onClick={handleOpenAdd}
            className={`${theme.bgSolid} ${theme.hoverSolid} text-white font-medium py-2 px-4 rounded-md transition-all flex items-center gap-2 text-sm`}
          >
            <Plus className="w-4 h-4" />
            Tambah Petugas
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
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
              {petugas.map((p, index) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-[#2f2f2f]/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{p.nama}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Absensi Bulanan */}
      <div className="bg-white dark:bg-[#202020] p-6 rounded-lg border border-slate-200/70 dark:border-white/10">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Absensi Bulanan</h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
            Klik pada kotak untuk menandai kehadiran petugas setiap bulan.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
            <thead className="text-[11px] uppercase tracking-wider bg-transparent text-slate-500 dark:text-white/50 border-b border-slate-200/70 dark:border-white/10">
              <tr>
                <th className="px-4 py-3 font-medium sticky left-0 bg-slate-50 dark:bg-[#202020] z-10">Nama Petugas</th>
                {months.map((month) => (
                  <th key={month} className="px-3 py-3 text-center font-medium min-w-[60px]">{month}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {petugas.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-[#2f2f2f]/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white sticky left-0 bg-white dark:bg-[#202020] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
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
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Nama</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#202020] text-slate-800 dark:text-white focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 focus:border-purple-500 transition-colors"
                    placeholder="Nama Petugas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Peran</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#202020] text-slate-800 dark:text-white focus:ring-2 ${theme.activeRing} focus:border-purple-500 transition-colors`}
                  >
                    <option value="KADER">KADER</option>
                    <option value="PLKB">PLKB</option>
                    <option value="MEDIS">MEDIS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Unit/Wilayah</label>
                  <input
                    type="text"
                    value={formData.unit}
                    readOnly
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#202020]/50 text-slate-500 dark:text-zinc-400 cursor-not-allowed"
                  />
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
