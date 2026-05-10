'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, Send, Search, Trash2, Filter, 
  ChevronDown, X, Check, Target, Users,
  MapPin, Building, Clock, AlertTriangle
} from 'lucide-react'
import { useSession } from 'next-auth/react'

// Dummy data for Notifications History
const dummyHistory = [
  { id: '1', title: 'Jadwal Imunisasi Serentak', message: 'Diberitahukan kepada seluruh posyandu untuk melaksanakan imunisasi serentak pada tanggal 15 Mei 2026.', target: 'Semua Posyandu', date: '2026-05-01 08:00', status: 'TERKIRIM' },
  { id: '2', title: 'Pengisian SIP 7', message: 'Mohon segera melengkapi data SIP 7 untuk bulan April.', target: 'Kecamatan Batanghari', date: '2026-05-03 10:30', status: 'TERKIRIM' },
]

export default function PushNotificationPage() {
  const { data: session } = useSession()
  const [history, setHistory] = useState(dummyHistory)
  const [search, setSearch] = useState('')
  const [mounted, setMounted] = useState(false)
  
  const initialForm = { title: '', message: '', target: 'SEMUA', kecamatan: '', desa: '', posyandu: '' }
  const [formData, setFormData] = useState(initialForm)
  const [isSending, setIsSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    
    // Simulate sending
    setTimeout(() => {
      const newNotif = {
        id: Date.now().toString(),
        title: formData.title,
        message: formData.message,
        target: formData.target === 'SEMUA' ? 'Semua Pengguna' : 
                formData.target === 'KECAMATAN' ? `Kec. ${formData.kecamatan}` :
                formData.target === 'DESA' ? `Desa ${formData.desa}` : `Posyandu ${formData.posyandu}`,
        date: new Date().toLocaleString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        status: 'TERKIRIM'
      }
      
      setHistory([newNotif, ...history])
      setIsSending(false)
      setSendSuccess(true)
      setFormData(initialForm)
      
      setTimeout(() => setSendSuccess(false), 3000)
    }, 1500)
  }

  const handleDelete = (id: string) => {
    if(confirm('Apakah Anda yakin ingin menghapus riwayat notifikasi ini?')) {
      setHistory(history.filter(h => h.id !== id))
    }
  }

  const filteredHistory = history.filter(h => 
    h.title.toLowerCase().includes(search.toLowerCase()) ||
    h.message.toLowerCase().includes(search.toLowerCase())
  )

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Push Notifikasi</h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">Kirim notifikasi langsung ke aplikasi pengguna</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Area */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-500" />
              Kirim Notifikasi
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Judul Notifikasi</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="block w-full bg-slate-50 dark:bg-zinc-700/50 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  placeholder="Contoh: Jadwal Posyandu"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Isi Pesan</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="block w-full bg-slate-50 dark:bg-zinc-700/50 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  rows={4}
                  placeholder="Tulis pesan notifikasi di sini..."
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Target Penerima</label>
                <select 
                  value={formData.target}
                  onChange={(e) => setFormData({...formData, target: e.target.value})}
                  className="block w-full bg-slate-50 dark:bg-zinc-700/50 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                >
                  <option value="SEMUA">Semua Pengguna</option>
                  <option value="KECAMATAN">Per Kecamatan</option>
                  <option value="DESA">Per Desa</option>
                  <option value="POSYANDU">Per Posyandu</option>
                </select>
              </div>

              {formData.target === 'KECAMATAN' && (
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Pilih Kecamatan</label>
                  <input
                    type="text"
                    value={formData.kecamatan}
                    onChange={(e) => setFormData({...formData, kecamatan: e.target.value})}
                    className="block w-full bg-slate-50 dark:bg-zinc-700/50 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    placeholder="Nama Kecamatan"
                    required
                  />
                </div>
              )}

              {formData.target === 'DESA' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Pilih Kecamatan</label>
                    <input
                      type="text"
                      value={formData.kecamatan}
                      onChange={(e) => setFormData({...formData, kecamatan: e.target.value})}
                      className="block w-full bg-slate-50 dark:bg-zinc-700/50 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      placeholder="Nama Kecamatan"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Pilih Desa</label>
                    <input
                      type="text"
                      value={formData.desa}
                      onChange={(e) => setFormData({...formData, desa: e.target.value})}
                      className="block w-full bg-slate-50 dark:bg-zinc-700/50 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      placeholder="Nama Desa"
                      required
                    />
                  </div>
                </div>
              )}

              {formData.target === 'POSYANDU' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Pilih Desa</label>
                    <input
                      type="text"
                      value={formData.desa}
                      onChange={(e) => setFormData({...formData, desa: e.target.value})}
                      className="block w-full bg-slate-50 dark:bg-zinc-700/50 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      placeholder="Nama Desa"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Pilih Posyandu</label>
                    <input
                      type="text"
                      value={formData.posyandu}
                      onChange={(e) => setFormData({...formData, posyandu: e.target.value})}
                      className="block w-full bg-slate-50 dark:bg-zinc-700/50 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      placeholder="Nama Posyandu"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSending}
                className={`w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-2.5 px-4 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 ${isSending ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Kirim Notifikasi
                  </>
                )}
              </button>

              <AnimatePresence>
                {sendSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-medium flex items-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Notifikasi berhasil dikirim!
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        {/* History Area */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-500" />
                Riwayat Notifikasi
              </h2>
              
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full bg-slate-50 dark:bg-zinc-700/50 border border-slate-200 dark:border-zinc-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Cari notifikasi..."
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredHistory.map((notif) => (
                <div key={notif.id} className="p-4 bg-slate-50 dark:bg-zinc-700/30 rounded-xl border border-slate-100 dark:border-zinc-700 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors group">
                  <div className="flex justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                        {notif.title}
                        <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                          {notif.status}
                        </span>
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-zinc-400">{notif.message}</p>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 mt-2">
                        <div className="flex items-center gap-1">
                          <Target className="w-3.5 h-3.5" />
                          Target: {notif.target}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {notif.date}
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDelete(notif.id)}
                      className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                      title="Hapus Riwayat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredHistory.length === 0 && (
                <div className="text-center py-12 text-slate-500 dark:text-zinc-400">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-zinc-600" />
                  <p>Tidak ada riwayat notifikasi</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
