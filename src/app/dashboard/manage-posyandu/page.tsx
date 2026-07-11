'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Users, Building, X, Check, Trash2, Edit2, UserPlus, MapPin, AlertTriangle } from 'lucide-react'
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

  // Modal states
  const [isPosyanduModalOpen, setIsPosyanduModalOpen] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isEditPosyanduModalOpen, setIsEditPosyanduModalOpen] = useState(false)
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false)
  const [isDeletePosyanduModalOpen, setIsDeletePosyanduModalOpen] = useState(false)
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false)

  const [selectedPosyandu, setSelectedPosyandu] = useState<any>(null)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)

  // Forms
  const [posyanduForm, setPosyanduForm] = useState({ nama: '', hariBuka: '', strata: 'PRATAMA' })
  const [editPosyanduForm, setEditPosyanduForm] = useState({ id: '', nama: '', hariBuka: '', strata: 'PRATAMA' })
  const [userForm, setUserForm] = useState({ nama: '', email: '', password: '', role: 'OPERATOR_POSYANDU' })
  const [editUserForm, setEditUserForm] = useState({ id: '', name: '', email: '', role: '', password: '' })

  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const resPos = await fetch('/api/posyandu')
      const dataPos = await resPos.json()
      setPosyandus(Array.isArray(dataPos) ? dataPos : [])

      const resUsers = await fetch('/api/users')
      const dataUsers = await resUsers.json()
      setUsers(Array.isArray(dataUsers) ? dataUsers : [])
    } catch (error) {
      console.error("Failed to fetch data", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [])

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  if (!mounted) return null

  // ---- POSYANDU HANDLERS ----

  const handleCreatePosyandu = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    try {
      const res = await fetch('/api/posyandu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(posyanduForm)
      })
      const newPos = await res.json()
      if (newPos.error) throw new Error(newPos.error)
      await fetchData()
      setIsPosyanduModalOpen(false)
      setPosyanduForm({ nama: '', hariBuka: '', strata: 'PRATAMA' })
      setSelectedPosyandu(newPos)
      setSelectedUsers([])
      setIsAssignModalOpen(true)
      showToast('Posyandu berhasil ditambahkan', 'success')
    } catch (error: any) {
      showToast(error.message || 'Gagal menambah posyandu', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleOpenEditPosyandu = (p: any) => {
    setEditPosyanduForm({ id: p.id, nama: p.nama, hariBuka: p.hariBuka, strata: p.strata })
    setIsEditPosyanduModalOpen(true)
  }

  const handleEditPosyandu = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    try {
      const res = await fetch('/api/posyandu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editPosyanduForm)
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      await fetchData()
      setIsEditPosyanduModalOpen(false)
      showToast('Posyandu berhasil diperbarui', 'success')
    } catch (error: any) {
      showToast(error.message || 'Gagal memperbarui posyandu', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeletePosyandu = async () => {
    if (!selectedPosyandu) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/posyandu?id=${selectedPosyandu.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      await fetchData()
      setIsDeletePosyanduModalOpen(false)
      setSelectedPosyandu(null)
      showToast('Posyandu berhasil dihapus', 'success')
    } catch (error: any) {
      showToast(error.message || 'Gagal menghapus posyandu', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // ---- USER HANDLERS ----

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      })
      const newUser = await res.json()
      if (newUser.error) throw new Error(newUser.error)
      await fetchData()
      setIsUserModalOpen(false)
      setUserForm({ nama: '', email: '', password: '', role: 'OPERATOR_POSYANDU' })
      showToast('Akun operator berhasil dibuat', 'success')
    } catch (error: any) {
      showToast(error.message || 'Gagal membuat akun', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleOpenEditUser = (u: any) => {
    setEditUserForm({ id: u.id, name: u.name || u.nama || '', email: u.email, role: u.role, password: '' })
    setSelectedUser(u)
    setIsEditUserModalOpen(true)
  }

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    try {
      const payload: any = {
        id: editUserForm.id,
        name: editUserForm.name,
        email: editUserForm.email,
        role: editUserForm.role,
      }
      if (editUserForm.password) payload.password = editUserForm.password
      
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      await fetchData()
      setIsEditUserModalOpen(false)
      showToast('Data user berhasil diperbarui', 'success')
    } catch (error: any) {
      showToast(error.message || 'Gagal memperbarui user', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/users?id=${selectedUser.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      await fetchData()
      setIsDeleteUserModalOpen(false)
      setSelectedUser(null)
      showToast('User berhasil dihapus', 'success')
    } catch (error: any) {
      showToast(error.message || 'Gagal menghapus user', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleAssignUsers = async () => {
    if (!selectedPosyandu) return
    setActionLoading(true)
    try {
      await fetch('/api/posyandu/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posyanduId: selectedPosyandu.id, userIds: selectedUsers })
      })
      await fetchData()
      setIsAssignModalOpen(false)
      setSelectedPosyandu(null)
      setSelectedUsers([])
      showToast('Operator berhasil ditetapkan', 'success')
    } catch (error: any) {
      showToast(error.message || 'Gagal menetapkan operator', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    )
  }

  const filteredPosyandus = posyandus.filter(p => (p.nama || '').toLowerCase().includes(search.toLowerCase()))
  const filteredUsers = users.filter(u => (u.nama || u.name || '').toLowerCase().includes(search.toLowerCase()) || (u.email || '').toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl text-white text-sm font-medium ${toast.type === 'success' ? 'bg-purple-500' : 'bg-rose-500'}`}
          >
            {toast.type === 'success' ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Building className="w-6 h-6 text-purple-500" />
            Manajemen Posyandu & User
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">
            Kelola Posyandu dan akun operator di wilayah Anda.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsUserModalOpen(true)}
            className="bg-white dark:bg-[#202020] text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 font-semibold py-2.5 px-4 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Buat Akun
          </button>
          <button
            onClick={() => setIsPosyanduModalOpen(true)}
            className="bg-[var(--dash-primary)] text-white font-semibold py-2.5 px-4 rounded-md hover:from-purple-600 hover:to-indigo-700 transition-all shadow-none flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Tambah Posyandu
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-white/10">
        <button
          onClick={() => setActiveTab('posyandu')}
          className={`pb-3 text-sm font-semibold transition-all ${activeTab === 'posyandu' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white'}`}
        >
          Daftar Posyandu
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-semibold transition-all ${activeTab === 'users' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white'}`}
        >
          Daftar User / Operator
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full md:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full bg-white dark:bg-[#202020] border border-slate-200 dark:border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 transition-all"
          placeholder={activeTab === 'posyandu' ? "Cari nama posyandu..." : "Cari nama atau email..."}
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#202020] rounded-lg border border-slate-200 dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-slate-500">Memuat data...</div>
          ) : activeTab === 'posyandu' ? (
            <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
              <thead className="text-[11px] uppercase tracking-wider bg-transparent text-slate-500 dark:text-white/50 border-b border-slate-200/70 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4">Nama Posyandu</th>
                  <th className="px-6 py-4">Hari Buka</th>
                  <th className="px-6 py-4">Strata</th>
                  <th className="px-6 py-4">Operator</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosyandus.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">Belum ada data posyandu</td></tr>
                ) : filteredPosyandus.map((p) => (
                  <tr key={p.id} className="border-b border-slate-200/70 dark:border-white/10 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{p.nama}</td>
                    <td className="px-6 py-4">{p.hariBuka}</td>
                    <td className="px-6 py-4">
                      <span className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-0.5 rounded-full text-xs font-medium">
                        {p.strata}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {p.users?.map((u: any) => (
                          <div key={u.id} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-600 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-white border-2 border-white dark:border-white/10" title={u.nama}>
                            {(u.nama || '?').charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {(!p.users || p.users.length === 0) && <span className="text-slate-400">Belum ada</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setSelectedPosyandu(p); setSelectedUsers(p.users?.map((u: any) => u.id) || []); setIsAssignModalOpen(true); }}
                          className="text-purple-500 hover:text-purple-600 transition-colors text-xs font-medium"
                        >
                          Kelola User
                        </button>
                        <button
                          onClick={() => handleOpenEditPosyandu(p)}
                          className="text-blue-500 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          title="Edit Posyandu"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setSelectedPosyandu(p); setIsDeletePosyanduModalOpen(true); }}
                          className="text-rose-500 hover:text-rose-600 transition-colors p-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/20"
                          title="Hapus Posyandu"
                        >
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
              <thead className="text-[11px] uppercase tracking-wider bg-transparent text-slate-500 dark:text-white/50 border-b border-slate-200/70 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4">Nama</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Posyandu</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">Belum ada data user</td></tr>
                ) : filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-slate-200/70 dark:border-white/10 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{u.name || u.nama}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 dark:bg-[#2f2f2f] text-slate-700 dark:text-zinc-300 px-2 py-0.5 rounded-full text-xs font-medium">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">{u.posyandu || <span className="text-slate-400">-</span>}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditUser(u)}
                          className="text-blue-500 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setSelectedUser(u); setIsDeleteUserModalOpen(true); }}
                          className="text-rose-500 hover:text-rose-600 transition-colors p-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/20"
                          title="Hapus User"
                        >
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

      {/* ===== MODAL TAMBAH POSYANDU ===== */}
      <AnimatePresence>
        {isPosyanduModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPosyanduModalOpen(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.3 }} className="relative bg-white dark:bg-[#202020] rounded-lg shadow-xl w-full max-w-lg p-6 border border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Tambah Posyandu</h2>
                <button onClick={() => setIsPosyanduModalOpen(false)} className="text-slate-400 hover:text-slate-500"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleCreatePosyandu} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Nama Posyandu</label>
                  <input type="text" value={posyanduForm.nama} onChange={e => setPosyanduForm({...posyanduForm, nama: e.target.value})} className="block w-full bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 transition-all" placeholder="Contoh: Posyandu Adirejo IV" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Hari Buka</label>
                  <input type="text" value={posyanduForm.hariBuka} onChange={e => setPosyanduForm({...posyanduForm, hariBuka: e.target.value})} className="block w-full bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 transition-all" placeholder="Contoh: Senin" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Strata</label>
                  <select value={posyanduForm.strata} onChange={e => setPosyanduForm({...posyanduForm, strata: e.target.value})} className="block w-full bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 transition-all">
                    <option value="PRATAMA">PRATAMA</option>
                    <option value="MADYA">MADYA</option>
                    <option value="PURNAMA">PURNAMA</option>
                    <option value="MANDIRI">MANDIRI</option>
                  </select>
                </div>
                <div className="flex items-center justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsPosyanduModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-all">Batal</button>
                  <button type="submit" disabled={actionLoading} className="bg-[var(--dash-primary)] text-white font-semibold py-2 px-4 rounded-md hover:from-purple-600 hover:to-indigo-700 transition-all shadow-none disabled:opacity-60">
                    {actionLoading ? 'Menyimpan...' : 'Simpan & Kelola User'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== MODAL EDIT POSYANDU ===== */}
      <AnimatePresence>
        {isEditPosyanduModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditPosyanduModalOpen(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.3 }} className="relative bg-white dark:bg-[#202020] rounded-lg shadow-xl w-full max-w-lg p-6 border border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Edit Posyandu</h2>
                <button onClick={() => setIsEditPosyanduModalOpen(false)} className="text-slate-400 hover:text-slate-500"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleEditPosyandu} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Nama Posyandu</label>
                  <input type="text" value={editPosyanduForm.nama} onChange={e => setEditPosyanduForm({...editPosyanduForm, nama: e.target.value})} className="block w-full bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 transition-all" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Hari Buka</label>
                  <input type="text" value={editPosyanduForm.hariBuka} onChange={e => setEditPosyanduForm({...editPosyanduForm, hariBuka: e.target.value})} className="block w-full bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 transition-all" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Strata</label>
                  <select value={editPosyanduForm.strata} onChange={e => setEditPosyanduForm({...editPosyanduForm, strata: e.target.value})} className="block w-full bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 transition-all">
                    <option value="PRATAMA">PRATAMA</option>
                    <option value="MADYA">MADYA</option>
                    <option value="PURNAMA">PURNAMA</option>
                    <option value="MANDIRI">MANDIRI</option>
                  </select>
                </div>
                <div className="flex items-center justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsEditPosyanduModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-all">Batal</button>
                  <button type="submit" disabled={actionLoading} className="bg-[var(--dash-primary)] text-white font-semibold py-2 px-4 rounded-md hover:from-blue-600 hover:to-indigo-700 transition-all shadow-none disabled:opacity-60">
                    {actionLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== MODAL HAPUS POSYANDU ===== */}
      <AnimatePresence>
        {isDeletePosyanduModalOpen && selectedPosyandu && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeletePosyanduModalOpen(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.3 }} className="relative bg-white dark:bg-[#202020] rounded-lg shadow-xl w-full max-w-md p-6 border border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Hapus Posyandu?</h2>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">Tindakan ini tidak dapat dibatalkan.</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-zinc-300 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-lg p-3 mb-6">
                Semua data SIP 6, SIP 7, laporan, dan relasi yang terhubung ke <b>{selectedPosyandu.nama}</b> akan ikut dihapus secara permanen.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setIsDeletePosyanduModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-all">Batal</button>
                <button onClick={handleDeletePosyandu} disabled={actionLoading} className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-md transition-all disabled:opacity-60">
                  {actionLoading ? 'Menghapus...' : 'Ya, Hapus'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== MODAL TAMBAH USER ===== */}
      <AnimatePresence>
        {isUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsUserModalOpen(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.3 }} className="relative bg-white dark:bg-[#202020] rounded-lg shadow-xl w-full max-w-lg p-6 border border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Buat Akun Operator</h2>
                <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 hover:text-slate-500"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Nama Lengkap</label>
                  <input type="text" value={userForm.nama} onChange={e => setUserForm({...userForm, nama: e.target.value})} className="block w-full bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 transition-all" placeholder="Nama Lengkap" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Email</label>
                  <input type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="block w-full bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 transition-all" placeholder="email@contoh.com" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Password</label>
                  <input type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} className="block w-full bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 transition-all" placeholder="Minimal 6 karakter" required />
                </div>
                <div className="flex items-center justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-all">Batal</button>
                  <button type="submit" disabled={actionLoading} className="bg-[var(--dash-primary)] text-white font-semibold py-2 px-4 rounded-md hover:from-purple-600 hover:to-indigo-700 transition-all shadow-none disabled:opacity-60">
                    {actionLoading ? 'Menyimpan...' : 'Buat Akun'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== MODAL EDIT USER ===== */}
      <AnimatePresence>
        {isEditUserModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditUserModalOpen(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.3 }} className="relative bg-white dark:bg-[#202020] rounded-lg shadow-xl w-full max-w-lg p-6 border border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Edit User</h2>
                <button onClick={() => setIsEditUserModalOpen(false)} className="text-slate-400 hover:text-slate-500"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleEditUser} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Nama Lengkap</label>
                  <input type="text" value={editUserForm.name} onChange={e => setEditUserForm({...editUserForm, name: e.target.value})} className="block w-full bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 transition-all" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Email</label>
                  <input type="email" value={editUserForm.email} onChange={e => setEditUserForm({...editUserForm, email: e.target.value})} className="block w-full bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 transition-all" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Role</label>
                  <select value={editUserForm.role} onChange={e => setEditUserForm({...editUserForm, role: e.target.value})} className="block w-full bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 transition-all">
                    <option value="OPERATOR_POSYANDU">OPERATOR_POSYANDU</option>
                    <option value="OPERATOR_DESA">OPERATOR_DESA</option>
                    <option value="ADMIN_KECAMATAN">ADMIN_KECAMATAN</option>
                    <option value="SUPERADMIN">SUPERADMIN</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Password Baru <span className="text-slate-400 font-normal">(kosongkan jika tidak ingin ubah)</span></label>
                  <input type="password" value={editUserForm.password} onChange={e => setEditUserForm({...editUserForm, password: e.target.value})} className="block w-full bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 transition-all" placeholder="Kosongkan jika tidak diubah" />
                </div>
                <div className="flex items-center justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsEditUserModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-all">Batal</button>
                  <button type="submit" disabled={actionLoading} className="bg-[var(--dash-primary)] text-white font-semibold py-2 px-4 rounded-md hover:from-blue-600 hover:to-indigo-700 transition-all shadow-none disabled:opacity-60">
                    {actionLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== MODAL HAPUS USER ===== */}
      <AnimatePresence>
        {isDeleteUserModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteUserModalOpen(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.3 }} className="relative bg-white dark:bg-[#202020] rounded-lg shadow-xl w-full max-w-md p-6 border border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Hapus User?</h2>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">Tindakan ini tidak dapat dibatalkan.</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-zinc-300 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-lg p-3 mb-6">
                Akun <b>{selectedUser.name || selectedUser.nama}</b> ({selectedUser.email}) akan dihapus secara permanen.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setIsDeleteUserModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-all">Batal</button>
                <button onClick={handleDeleteUser} disabled={actionLoading} className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-md transition-all disabled:opacity-60">
                  {actionLoading ? 'Menghapus...' : 'Ya, Hapus'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== MODAL ASSIGN USERS ===== */}
      <AnimatePresence>
        {isAssignModalOpen && selectedPosyandu && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAssignModalOpen(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.3 }} className="relative bg-white dark:bg-[#202020] rounded-lg shadow-xl w-full max-w-lg p-6 border border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">Pilih Operator</h2>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">Pilih user untuk mengelola <b>{selectedPosyandu.nama}</b></p>
                </div>
                <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-slate-500"><X className="w-6 h-6" /></button>
              </div>
              <div className="max-h-[300px] overflow-y-auto space-y-2 my-4">
                {users.map(user => (
                  <label key={user.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="rounded text-purple-500 focus:ring-purple-500/25 focus:border-purple-400 w-5 h-5"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">{user.name || user.nama}</p>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">{user.email}</p>
                      </div>
                    </div>
                    {user.posyandu && user.posyandu !== '-' && (
                      <span className="text-xs text-slate-400">Sudah di: {user.posyandu}</span>
                    )}
                  </label>
                ))}
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsAssignModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-all">Batal</button>
                <button onClick={handleAssignUsers} disabled={actionLoading} className="bg-[var(--dash-primary)] text-white font-semibold py-2 px-4 rounded-md hover:from-purple-600 hover:to-indigo-700 transition-all shadow-none disabled:opacity-60">
                  {actionLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
