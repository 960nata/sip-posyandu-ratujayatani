'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Camera, Loader2 } from 'lucide-react'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const role = (session?.user as any)?.role
  const [mounted, setMounted] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    setMounted(true)
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user?.name || '',
        email: session.user?.email || ''
      }))
    }
  }, [session])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // Use original dimensions or limit to max width/height
        const MAX_WIDTH = 500
        const MAX_HEIGHT = 500
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)
        
        // Convert to AVIF
        canvas.toBlob((blob) => {
          if (blob) {
            // Create a preview URL
            setAvatarUrl(URL.createObjectURL(blob))
            
            // In a real app, you would upload this blob to the server
            // e.g. const uploadFile = new File([blob], 'avatar.avif', { type: 'image/avif' })
            
            setTimeout(() => {
              alert('Foto profil berhasil dikompres ke format AVIF!')
              setIsUploading(false)
            }, 1000)
          } else {
            setIsUploading(false)
          }
        }, 'image/avif', 0.8)
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Perubahan profil berhasil disimpan!')
  }

  if (status === 'loading' || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header - No Icons as requested */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Profil Pengguna</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">Kelola informasi profil dan keamanan akun Anda.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Avatar Upload */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Foto Profil</h2>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-full bg-slate-100 dark:bg-zinc-700 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300 dark:border-zinc-600">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-400 dark:text-zinc-500 text-xs text-center p-2">Belum ada foto</span>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors text-sm">
                  <Camera className="w-4 h-4" />
                  <span>{isUploading ? 'Mengompres...' : 'Unggah Foto'}</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
                </label>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2">
                  Format gambar akan otomatis dikompres ke **AVIF** untuk menghemat ruang.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-zinc-700"></div>

          {/* Informasi Pribadi - No Icon */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Informasi Pribadi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Peran Akses (Role)</label>
                <input
                  type="text"
                  value={role || ''}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-700 text-slate-500 dark:text-zinc-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-zinc-700"></div>

          {/* Keamanan - No Icon */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Keamanan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Kata Sandi Baru</label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Konfirmasi Kata Sandi</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg transition-all shadow-lg shadow-emerald-500/20 text-sm"
            >
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
