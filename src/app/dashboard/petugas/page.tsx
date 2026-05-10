'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Plus, Trash2, Edit2, ArrowLeft, Check, X } from 'lucide-react'

export default function PetugasPage() {
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
    setFormData({ nama: '', role: 'KADER', unit: '' })
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
      <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Daftar Petugas</h2>
          <button 
            onClick={handleOpenAdd}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-xl transition-all shadow-sm flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Petugas
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-800/50 text-slate-700 dark:text-slate-200">
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
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{p.nama}</td>
                  <td className="px-4 py-3">{p.role}</td>
                  <td className="px-4 py-3">{p.unit}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenEdit(p)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
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
      <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Absensi Bulanan</h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
            Klik pada kotak untuk menandai kehadiran petugas setiap bulan.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-800/50 text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-4 py-3 font-medium sticky left-0 bg-slate-50 dark:bg-zinc-800 z-10">Nama Petugas</th>
                {months.map((month) => (
                  <th key={month} className="px-3 py-3 text-center font-medium min-w-[60px]">{month}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {petugas.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white sticky left-0 bg-white dark:bg-[#111827] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
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
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400'
                              : 'bg-slate-50 border-slate-200 text-slate-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-600 hover:border-emerald-300 dark:hover:border-emerald-700'
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
              className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-zinc-800"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              
              <div className="p-6 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {modalMode === 'add' ? 'Tambah Petugas' : 'Edit Petugas'}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 dark:bg-zinc-800 text-slate-400 hover:text-slate-500 dark:hover:text-white transition-colors"
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
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Nama Petugas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Peran</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
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
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Contoh: Posyandu Mawar 1"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center gap-2"
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
