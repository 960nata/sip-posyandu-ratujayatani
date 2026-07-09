'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Plus, Search, Edit2, Trash2, Filter, 
  ChevronDown, X, Check, Shield, UserCheck,
  Mail, MapPin, Building, Lock
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import Skeleton from '@/components/Skeleton'

import { dummyUsers } from './dummyData'

const regionData = [
  {
    "name": "Bandar Sribhawono",
    "desas": ["Bandar Agung", "Mekar Jaya", "Sadar Sriwijaya", "Sribhawono", "Sri Menanti", "Sri Pendowo", "Waringin Jaya"]
  },
  {
    "name": "Batanghari",
    "desas": ["Adi Warno", "Balai Kencono", "Bale Rejo", "Banarjoyo", "Banjarrejo", "Batangharjo", "Buana Sakti", "Bumiharjo", "Bumi Mas", "Nampi Rejo", "Purwodadi Mekar", "Rejoagung", "Selorejo", "Sri Basuki", "Sumber Agung", "Sumber Rejo", "Telogorejo"]
  },
  {
    "name": "Batanghari Nuban",
    "desas": ["Bumi Jawa", "Cempaka Nuban", "Gedung Dalem", "Gunung Tiga", "Kedaton", "Kedaton I", "Kedaton II", "Purwosari", "Negara Ratu", "Sukacari", "Sukaraja Nuban", "Trisnomulyo", "Tulung Balak"]
  },
  {
    "name": "Braja Slebah",
    "desas": ["Braja Gemilang", "Braja Harjosari", "Braja Indah", "Braja Kencana", "Braja Luhur", "Braja Mulya", "Braja Yekti"]
  },
  {
    "name": "Bumi Agung",
    "desas": ["Bumi Tinggi", "Catur Swako", "Donomulyo", "Lehan", "Marga Mulya", "Mulyo Asri", "Nyampir"]
  },
  {
    "name": "Gunung Pelindung",
    "desas": ["Nibung", "Negeri Agung", "Pelindung Jaya", "Pempen", "Way Mili"]
  },
  {
    "name": "Jabung",
    "desas": ["Adiluhur", "Adirejo", "Asahan", "Belimbing Sari", "Benteng Sari", "Gunung Mekar", "Gunung Sugih Kecil", "Jabung", "Mekarjaya", "Mumbang Jaya", "Negara Batin", "Negara Saka", "Pematang Tahalo", "Sambirejo", "Tanjungsari"]
  },
  {
    "name": "Labuhan Maringgai",
    "desas": ["Bandar Negeri", "Karang Anyar", "Karya Makmur", "Karya Tani", "Labuhan Maringgai", "Margasari", "Maringgai", "Muara Gading Mas", "Srigading", "Sri Minosari", "Sukorahayu"]
  },
  {
    "name": "Labuhan Ratu",
    "desas": ["Labuhan Ratu", "Labuhan Ratu III", "Labuhan Ratu IV", "Labuhan Ratu V", "Labuhan Ratu VI", "Labuhan Ratu VII", "Labuhan Ratu VIII", "Labuhan Ratu IX", "Rajabasa Lama", "Rajabasa Lama I", "Rajabasa Lama II"]
  },
  {
    "name": "Marga Sekampung",
    "desas": ["Peniangan", "Gunung Raya", "Batu Badak", "Giri Mulyo", "Bungkuk", "Gunung Mas", "Purwosari", "Bukit Raya"]
  },
  {
    "name": "Marga Tiga",
    "desas": ["Gedung Wani", "Gedungwani Timur", "Jaya Guna", "Nabang Baru", "Negeri Jemanten", "Negeri Katon", "Negeri Agung", "Negeri Tua", "Sukadana Baru", "Sukaraja Tiga", "Surya Mataram", "Tanjung Harapan", "Trisinar"]
  },
  {
    "name": "Mataram Baru",
    "desas": ["Kebon Damar", "Mataram Baru", "Mandala Sari", "Rajabasa Baru", "Teluk Dalem", "Tulung Pasik", "Way Areng"]
  },
  {
    "name": "Melinting",
    "desas": ["Itik Renday", "Sido Makmur", "Sumber Hadi", "Tanjung Aji", "Tebing", "Wana"]
  },
  {
    "name": "Metro Kibang",
    "desas": ["Kibang", "Jaya Asri", "Marga Jaya", "Margasari", "Margototo", "Purbosembodo", "Sumber Agung"]
  },
  {
    "name": "Pasir Sakti",
    "desas": ["Kedung Ringin", "Labuhan Ratu", "Mekar Sari", "Mulyo Sari", "Pasir Sakti", "Purworejo", "Rejo Mulyo", "Sumur Kucing"]
  },
  {
    "name": "Pekalongan",
    "desas": ["Adijaya", "Adirejo", "Ganti Warno", "Gantimulyo", "Gondangrejo", "Jojog", "Kalibening", "Pekalongan", "Sidodadi", "Siraman", "Tulusrejo", "Wonosari"]
  },
  {
    "name": "Purbolinggo",
    "desas": ["Taman Asri", "Taman Bogo", "Taman Cari", "Taman Dadi", "Taman Endah", "Taman Fajar", "Tegal Gondo", "Toto Harjo", "Tanjung Inten", "Tegal Yoso", "Tanjung Kesuma", "Tambah Luhur"]
  },
  {
    "name": "Raman Utara",
    "desas": ["Kota Raman", "Rama Puja", "Raman Aji", "Raman Endra", "Raman Fajar", "Rantau Fajar", "Ratna Daya", "Rejo Binangun", "Rejo Katon", "Restu Rahayu", "Rukti Sedyo"]
  },
  {
    "name": "Sekampung",
    "desas": ["Girikarto", "Giriklopomulyo", "Hargomulyo", "Jadimulyo", "Karyamukti", "Mekarmukti", "Mekar Mulyo", "Mekar Sari", "Sambikarto", "Sidodadi", "Sidomukti", "Sidomulyo", "Sukoharjo", "Sumbergede", "Sumbersari", "Trimulyo", "Wonokarto"]
  },
  {
    "name": "Sekampung Udik",
    "desas": ["Banjar Agung", "Bauh Gunung Sari", "Bojong", "Brawijaya", "Bumi Mulyo", "Gunung Agung", "Gunung Mulyo", "Gunung Pasir Jaya", "Gunung Sugih Besar", "Mengandung Sari", "Pugung Raharjo", "Purwokencono", "Sidorejo", "Sindang Anom", "Toba"]
  },
  {
    "name": "Sukadana",
    "desas": ["Bumi Ayu", "Bumi Nabung Udik", "Mataram Marga", "Muara Jaya", "Negara Nabung", "Pakuan Aji", "Pasar Sukadana", "Putra Aji I", "Putra Aji II", "Rajabasa Batanghari", "Rantau Jaya Udik", "Rantau Jaya Udik II", "Sukadana", "Sukadana Ilir", "Sukadana Jaya", "Sukadana Selatan", "Sukadana Tengah", "Sukadana Timur", "Sukadana Udik", "Terbangi Marga"]
  },
  {
    "name": "Way Bungur",
    "desas": ["Kali Pasir", "Taman Negeri", "Tambah Subur", "Tanjung Qencono", "Tanjung Tirto", "Tegal Ombo", "Toto Mulyo", "Toto Projo"]
  },
  {
    "name": "Waway Karya",
    "desas": ["Jembrana", "Karang Anom", "Karya Basuki", "Marga Batin", "Mekar Karya", "Ngesti Karya", "Sido Rahayu", "Sumber Jaya", "Sumber Rejo", "Tanjung Wangi", "Tri Tunggal"]
  },
  {
    "name": "Way Jepara",
    "desas": ["Braja Asri", "Braja Caka", "Braja Dewa", "Braja Emas", "Braja Fajar", "Braja Sakti", "Jepara", "Labuhan Ratu I", "Labuhan Ratu II", "Labuhan Ratu Baru", "Labuhan Ratu Danau", "Sri Rejosari", "Sri Wangi", "Sumberejo", "Sumber Marga", "Sumur Bandung"]
  }
]

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [mounted, setMounted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  
  const initialForm = { name: '', email: '', role: 'OPERATOR_POSYANDU', kecamatan: '', desa: '', posyandu: '', password: '' }
  const [formData, setFormData] = useState(initialForm)
  const [desas, setDesas] = useState<string[]>([])

  useEffect(() => {
    setMounted(true)
    setLoading(true)
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const selectedKec = regionData.find(k => k.name === formData.kecamatan);
    setDesas(selectedKec ? selectedKec.desas : []);
  }, [formData.kecamatan])

  const handleEdit = (user: any) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      kecamatan: user.kecamatan || '',
      desa: user.desa || '',
      posyandu: user.posyandu || '',
      password: '' // Don't show password
    })
    setEditId(user.id)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if(confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      setUsers(users.filter(u => u.id !== id))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const url = editId ? `/api/users/${editId}` : '/api/users'
    const method = editId ? 'PUT' : 'POST'
    
    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    
    if (res.ok) {
      // Reload users
      fetch('/api/users')
        .then(res => res.json())
        .then(data => setUsers(data))
        
      setIsModalOpen(false)
      setFormData(initialForm)
      setEditId(null)
    } else {
      const err = await res.json()
      alert(err.error || 'Gagal menyimpan user')
    }
  }

  const handleAdd = () => {
    setFormData(initialForm)
    setEditId(null)
    setIsModalOpen(true)
  }

  const filteredUsers = users.filter(u => 
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  )

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Manajemen User</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">Kelola data pengguna sistem dan hak aksesnya</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-2.5 px-4 rounded-[10px] hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Tambah User
        </button>
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
            placeholder="Cari nama atau email..."
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Wilayah</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-zinc-700">
                    <td className="px-6 py-4 flex items-center gap-2">
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton variant="text" width={96} />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton variant="text" width={128} />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton variant="rectangular" width={72} height={22} className="rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton variant="text" width={96} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Skeleton variant="rectangular" width={64} height={32} className="rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    Tidak ada data user.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      {user.name}
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'SUPERADMIN' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400' :
                        user.role === 'ADMIN_KECAMATAN' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                        user.role === 'OPERATOR_DESA' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-0.5">
                        {user.kecamatan !== '-' && <div><span className="text-slate-400">Kec:</span> {user.kecamatan}</div>}
                        {user.desa !== '-' && <div><span className="text-slate-400">Desa:</span> {user.desa}</div>}
                        {user.posyandu !== '-' && <div><span className="text-slate-400">Pos:</span> {user.posyandu}</div>}
                        {user.kecamatan === '-' && <span className="text-slate-400">Semua Wilayah</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(user)} className="text-blue-500 hover:text-blue-600 transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="text-rose-500 hover:text-rose-600 transition-colors" title="Hapus">
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

      {/* Modal Tambah/Edit */}
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
              className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 dark:border-zinc-800"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              
              <div className="p-6 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {editId ? 'Edit User' : 'Tambah User Baru'}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                      Lengkapi data user di bawah ini
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-slate-50 dark:bg-zinc-800 text-slate-400 hover:text-slate-500 dark:hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Nama Lengkap</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      placeholder="Nama Lengkap"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      placeholder="email@sip.com"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      placeholder={editId ? "Kosongkan jika tidak diubah" : "Password minimal 6 karakter"}
                      required={!editId}
                    />
                  </div>
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Role</label>
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  >
                    <option value="SUPERADMIN">Super Admin (Kabupaten)</option>
                    <option value="ADMIN_KECAMATAN">Admin Kecamatan</option>
                    <option value="OPERATOR_DESA">Operator Desa</option>
                    <option value="OPERATOR_POSYANDU">Operator Posyandu</option>
                  </select>
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Kecamatan</label>
                  <select 
                    value={formData.kecamatan}
                    onChange={(e) => setFormData({...formData, kecamatan: e.target.value, desa: ''})}
                    className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    disabled={formData.role === 'SUPERADMIN'}
                  >
                    <option value="">Pilih Kecamatan</option>
                    {regionData.map((kec) => (
                      <option key={kec.name} value={kec.name}>{kec.name}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Desa</label>
                  <select 
                    value={formData.desa}
                    onChange={(e) => setFormData({...formData, desa: e.target.value})}
                    className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    disabled={formData.role === 'SUPERADMIN' || formData.role === 'ADMIN_KECAMATAN' || !formData.kecamatan}
                  >
                    <option value="">Pilih Desa</option>
                    {desas.map((desa) => (
                      <option key={desa} value={desa}>{desa}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Posyandu</label>
                  <input
                    type="text"
                    value={formData.posyandu}
                    onChange={(e) => setFormData({...formData, posyandu: e.target.value})}
                    className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    placeholder="Nama Posyandu"
                    disabled={formData.role !== 'OPERATOR_POSYANDU'}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 md:col-span-2 border-t border-slate-100 dark:border-zinc-800 pt-5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-[10px] transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-2.5 px-6 rounded-[10px] hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    {editId ? 'Simpan Perubahan' : 'Simpan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
