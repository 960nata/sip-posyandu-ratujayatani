'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Users, Building, X, Check, Trash2, Edit2, UserPlus, MapPin } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function ManagePosyanduPage() {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role
  const isOperatorDesa = role === 'OPERATOR_DESA' || role === 'SUPERADMIN'

  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'posyandu' | 'users'>('posyandu')
  const [posyandus, setPosyandus] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState('')

  const [isPosyanduModalOpen, setIsPosyanduModalOpen] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  
  const [selectedPosyandu, setSelectedPosyandu] = useState<any>(null)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const [posyanduForm, setPosyanduForm] = useState({ nama: '', hariBuka: '', strata: 'PRATAMA' })
  const [userForm, setUserForm] = useState({ nama: '', email: '', password: '', role: 'OPERATOR_POSYANDU' })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const resPos = await fetch('/api/posyandu')
      const dataPos = await resPos.json()
      setPosyandus(dataPos)

      const resUsers = await fetch('/api/users')
      const dataUsers = await resUsers.json()
      setUsers(dataUsers)
    } catch (error) {
      console.error("Failed to fetch data", error)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  const handleCreatePosyandu = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/posyandu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(posyanduForm)
      })
      const newPos = await res.json()
      setPosyandus([...posyandus, newPos])
      setIsPosyanduModalOpen(false)
      setPosyanduForm({ nama: '', hariBuka: '', strata: 'PRATAMA' })
      
      // Open Assign Modal
      setSelectedPosyandu(newPos)
      setSelectedUsers([])
      setIsAssignModalOpen(true)
    } catch (error) {
      console.error("Failed to create posyandu", error)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      })
      const newUser = await res.json()
      setUsers([...users, newUser])
      setIsUserModalOpen(false)
      setUserForm({ nama: '', email: '', password: '', role: 'OPERATOR_POSYANDU' })
    } catch (error) {
      console.error("Failed to create user", error)
    }
  }

  const handleAssignUsers = async () => {
    if (!selectedPosyandu) return
    try {
      await fetch('/api/posyandu/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          posyanduId: selectedPosyandu.id,
          userIds: selectedUsers
        })
      })
      
      // Refresh data
      fetchData()
      
      setIsAssignModalOpen(false)
      setSelectedPosyandu(null)
      setSelectedUsers([])
    } catch (error) {
      console.error("Failed to assign users", error)
    }
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    )
  }

  const filteredPosyandus = posyandus.filter(p => (p.nama || '').toLowerCase().includes(search.toLowerCase()))
  const filteredUsers = users.filter(u => (u.nama || '').toLowerCase().includes(search.toLowerCase()) || (u.email || '').toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Building className="w-6 h-6 text-emerald-500" />
            Manajemen Posyandu & User
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">
            Kelola Posyandu dan akun operator di wilayah Anda.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsUserModalOpen(true)}
            className="bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold py-2.5 px-4 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Buat Akun
          </button>
          <button 
            onClick={() => setIsPosyanduModalOpen(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-2.5 px-4 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Tambah Posyandu
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-zinc-700">
        <button
          onClick={() => setActiveTab('posyandu')}
          className={`pb-3 text-sm font-semibold transition-all ${activeTab === 'posyandu' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white'}`}
        >
          Daftar Posyandu
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-semibold transition-all ${activeTab === 'users' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white'}`}
        >
          Daftar User / Operator
        </button>
      </div>

      {/* Toolbar */}
      <div className="relative w-full md:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          placeholder={activeTab === 'posyandu' ? "Cari nama posyandu..." : "Cari nama atau email..."}
        />
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-slate-500">Memuat data...</div>
          ) : activeTab === 'posyandu' ? (
            <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
              <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-700 dark:text-slate-200">
                <tr>
                  <th className="px-6 py-4">Nama Posyandu</th>
                  <th className="px-6 py-4">Hari Buka</th>
                  <th className="px-6 py-4">Strata</th>
                  <th className="px-6 py-4">Operator</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosyandus.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{p.nama}</td>
                    <td className="px-6 py-4">{p.hariBuka}</td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full text-xs font-medium">
                        {p.strata}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {p.users?.map((u: any) => (
                          <div key={u.id} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-600 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-white border-2 border-white dark:border-zinc-800" title={u.nama}>
                            {u.nama.charAt(0)}
                          </div>
                        ))}
                        {(!p.users || p.users.length === 0) && <span className="text-slate-400">Belum ada</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { 
                          setSelectedPosyandu(p); 
                          setSelectedUsers(p.users?.map((u: any) => u.id) || []); 
                          setIsAssignModalOpen(true); 
                        }} className="text-emerald-500 hover:text-emerald-600 transition-colors text-xs font-medium">
                          Kelola User
                        </button>
                        <button className="text-blue-500 hover:text-blue-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-rose-500 hover:text-rose-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
              <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-700 dark:text-slate-200">
                <tr>
                  <th className="px-6 py-4">Nama</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Posyandu</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{u.nama}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300 px-2 py-0.5 rounded-full text-xs font-medium">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">{u.posyandu?.nama || <span className="text-slate-400">-</span>}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-blue-500 hover:text-blue-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-rose-500 hover:text-rose-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Tambah Posyandu */}
      <AnimatePresence>
        {isPosyanduModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPosyanduModalOpen(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.3 }} className="relative bg-white dark:bg-zinc-800 rounded-xl shadow-xl w-full max-w-lg p-6 border border-slate-200 dark:border-zinc-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Tambah Posyandu</h2>
                <button onClick={() => setIsPosyanduModalOpen(false)} className="text-slate-400 hover:text-slate-500"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleCreatePosyandu} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Nama Posyandu</label>
                  <input type="text" value={posyanduForm.nama} onChange={e => setPosyanduForm({...posyanduForm, nama: e.target.value})} className="block w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="Contoh: Posyandu Adirejo IV" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Hari Buka</label>
                  <input type="text" value={posyanduForm.hariBuka} onChange={e => setPosyanduForm({...posyanduForm, hariBuka: e.target.value})} className="block w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="Contoh: Senin" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Strata</label>
                  <select value={posyanduForm.strata} onChange={e => setPosyanduForm({...posyanduForm, strata: e.target.value})} className="block w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all">
                    <option value="PRATAMA">PRATAMA</option>
                    <option value="MADYA">MADYA</option>
                    <option value="PURNAMA">PURNAMA</option>
                    <option value="MANDIRI">MANDIRI</option>
                  </select>
                </div>
                <div className="flex items-center justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsPosyanduModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all">Batal</button>
                  <button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-2.5 px-6 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20">Simpan & Kelola User</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Tambah User */}
      <AnimatePresence>
        {isUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsUserModalOpen(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.3 }} className="relative bg-white dark:bg-zinc-800 rounded-xl shadow-xl w-full max-w-lg p-6 border border-slate-200 dark:border-zinc-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Buat Akun Operator</h2>
                <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 hover:text-slate-500"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Nama Lengkap</label>
                  <input type="text" value={userForm.nama} onChange={e => setUserForm({...userForm, nama: e.target.value})} className="block w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="Nama Lengkap" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Email</label>
                  <input type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="block w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="email@contoh.com" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Password</label>
                  <input type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} className="block w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="Minimal 6 karakter" required />
                </div>
                <div className="flex items-center justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all">Batal</button>
                  <button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-2.5 px-6 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20">Buat Akun</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Assign Users (Checklist) */}
      <AnimatePresence>
        {isAssignModalOpen && selectedPosyandu && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAssignModalOpen(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.3 }} className="relative bg-white dark:bg-zinc-800 rounded-xl shadow-xl w-full max-w-lg p-6 border border-slate-200 dark:border-zinc-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">Pilih Operator</h2>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">Pilih user untuk mengelola <b>{selectedPosyandu.nama}</b></p>
                </div>
                <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-slate-500"><X className="w-6 h-6" /></button>
              </div>

              <div className="max-h-[300px] overflow-y-auto space-y-2 my-4">
                {users.map(user => (
                  <label key={user.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={selectedUsers.includes(user.id)} 
                        onChange={() => toggleUserSelection(user.id)}
                        className="rounded text-emerald-500 focus:ring-emerald-500 w-5 h-5" 
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">{user.nama}</p>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">{user.email}</p>
                      </div>
                    </div>
                    {user.posyandu && (
                      <span className="text-xs text-slate-400">Sudah di: {user.posyandu.nama}</span>
                    )}
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsAssignModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all">Batal</button>
                <button onClick={handleAssignUsers} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-2.5 px-6 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20">Simpan Perubahan</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
