'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Camera, Save } from 'lucide-react'

export default function ProfilePage() {
  const { data: session } = useSession()
  const [name, setName] = useState(session?.user?.name || '')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6 p-6 bg-slate-50/50 dark:bg-[#0B0F19] min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-6 h-6 text-emerald-500" />
            Profil Pengguna
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 font-light">
            Kelola informasi profil dan keamanan akun Anda.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Photo & Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
            {/* Decorative background gradient */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
            
            <div className="relative flex flex-col items-center mt-8">
              <div className="relative w-28 h-28 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center text-emerald-500 text-4xl font-bold mb-4 shadow-xl border-4 border-white dark:border-zinc-900 overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  name?.[0] || 'U'
                )}
                <input
                  type="file"
                  id="avatar-input"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <button 
                  onClick={() => document.getElementById('avatar-input')?.click()}
                  className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 rounded-[10px] flex items-center justify-center text-white hover:bg-emerald-600 transition-colors shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{name}</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xs font-medium px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full">
                  {(session?.user as any)?.role || 'OPERATOR'}
                </span>
              </div>
              
              <div className="w-full border-t border-slate-100 dark:border-slate-800 my-6"></div>
              
              <div className="w-full space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-zinc-400">Status Akun</span>
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    Aktif
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-zinc-400">Email Terverifikasi</span>
                  <span className="text-emerald-600 font-medium">Ya</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Profile */}
          <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-500" />
              Informasi Pribadi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1 block">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1 block">Alamat Email</label>
                <input
                  type="email"
                  value={session?.user?.email || ''}
                  disabled
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/50 cursor-not-allowed text-slate-500 dark:text-zinc-500"
                />
                <p className="text-xs text-slate-400 mt-1.5 font-light">Email tidak dapat diubah karena terhubung dengan akun utama.</p>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-500" />
              Keamanan Akun
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1 block">Kata Sandi Saat Ini</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1 block">Kata Sandi Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button className="px-5 py-2.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors text-sm shadow-sm">
              Batal
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20 text-sm">
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
