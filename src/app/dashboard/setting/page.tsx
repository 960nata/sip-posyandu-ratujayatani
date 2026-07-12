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
  
  const [namaDesa, setNamaDesa] = useState('')
  const [tahunAktif, setTahunAktif] = useState(2025)
  const [posyandus, setPosyandus] = useState<any[]>([])
  const [selectedPosyanduId, setSelectedPosyanduId] = useState('')

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
      // Ambil avatar langsung dari database (bukan dari session JWT yang bisa basi)
      fetch('/api/users/avatar')
        .then(res => res.json())
        .then(data => {
          if (data.avatarUrl && !avatarUrl) {
            setAvatarUrl(data.avatarUrl)
          }
        })
        .catch(() => {})
    }
    const savedDesa = localStorage.getItem('sip_nama_desa') || 'Adijaya'
    const savedTahun = localStorage.getItem('sip_tahun_aktif') || '2025'
    setNamaDesa(savedDesa)
    setTahunAktif(parseInt(savedTahun))
  }, [session])

  useEffect(() => {
    if (role === 'OPERATOR_DESA') {
      fetch('/api/posyandu')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setPosyandus(data)
            const savedPosId = localStorage.getItem('sip_active_posyandu_id')
            if (savedPosId) {
              setSelectedPosyanduId(savedPosId)
            } else if (data.length > 0) {
              setSelectedPosyanduId(data[0].id)
              localStorage.setItem('sip_active_posyandu_id', data[0].id)
              localStorage.setItem('sip_active_posyandu_nama', data[0].nama)
            }
          }
        })
        .catch(err => console.error("Gagal memuat daftar posyandu:", err))
    }
  }, [role])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Langsung preview dari file asli
    const previewUrl = URL.createObjectURL(file)
    setAvatarUrl(previewUrl)

    // Upload langsung tanpa konversi AVIF (banyak browser gak support encode AVIF)
    const formData = new FormData()
    formData.append('file', file, file.name)

    try {
      const res = await fetch('/api/users/avatar', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.success && data.avatarUrl) {
        setAvatarUrl(data.avatarUrl)
        alert('Foto profil berhasil diunggah!')
      } else {
        alert('Gagal mengunggah: ' + (data.error || 'Unknown error'))
        setAvatarUrl(null)
      }
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat mengunggah!')
      setAvatarUrl(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('sip_nama_desa', namaDesa)
    localStorage.setItem('sip_tahun_aktif', tahunAktif.toString())
    
    if (role === 'OPERATOR_DESA' && selectedPosyanduId) {
      const activePos = posyandus.find(p => p.id === selectedPosyanduId)
      if (activePos) {
        localStorage.setItem('sip_active_posyandu_id', activePos.id)
        localStorage.setItem('sip_active_posyandu_nama', activePos.nama)
      }
    }
    
    alert('Pengaturan profil dan sistem berhasil disimpan!')
  }

  if (status === 'loading' || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header - No Icons as requested */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-[var(--dash-text)]">Profil Pengguna</h1>
          <p className="text-[var(--dash-text-soft)] text-sm">Kelola informasi profil dan keamanan akun Anda.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#202020] p-6 rounded-lg border border-slate-200 dark:border-white/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Avatar Upload */}
          <div>
            <h2 className="text-lg font-bold text-[var(--dash-text)] mb-4">Foto Profil</h2>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-full bg-slate-100 dark:bg-[#2f2f2f] flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300 dark:border-zinc-600">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[var(--dash-text-muted)] text-xs text-center p-2">Belum ada foto</span>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors text-sm">
                  <Camera className="w-4 h-4" />
                  <span>{isUploading ? 'Mengunggah...' : 'Unggah Foto'}</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
                </label>
                <p className="text-xs text-[var(--dash-text-soft)] mt-2">
                  Format gambar akan otomatis dikompres. Maks 10 MB (JPG/PNG/WEBP).
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/70 dark:border-white/10"></div>

          {/* Informasi Pribadi - No Icon */}
          <div>
            <h2 className="text-lg font-bold text-[var(--dash-text)] mb-4">Informasi Pribadi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--dash-text)] dark:text-zinc-300 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#202020] text-[var(--dash-text)] focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--dash-text)] dark:text-zinc-300 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#202020] text-[var(--dash-text)] focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--dash-text)] dark:text-zinc-300 mb-1">Peran Akses (Role)</label>
                <input
                  type="text"
                  value={role || ''}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#2f2f2f] text-[var(--dash-text-soft)] cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/70 dark:border-white/10"></div>

          {/* Keamanan - No Icon */}
          <div>
            <h2 className="text-lg font-bold text-[var(--dash-text)] mb-4">Keamanan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--dash-text)] dark:text-zinc-300 mb-1">Kata Sandi Baru</label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#202020] text-[var(--dash-text)] focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--dash-text)] dark:text-zinc-300 mb-1">Konfirmasi Kata Sandi</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#202020] text-[var(--dash-text)] focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/70 dark:border-white/10"></div>

          {/* Pengaturan Wilayah & Sistem */}
          <div>
            <h2 className="text-lg font-bold text-[var(--dash-text)] mb-4">Pengaturan Wilayah & Sistem</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--dash-text)] dark:text-zinc-300 mb-1">Nama Desa</label>
                <input
                  type="text"
                  value={namaDesa}
                  onChange={(e) => setNamaDesa(e.target.value)}
                  placeholder="Contoh: Adijaya"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#202020] text-[var(--dash-text)] focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--dash-text)] dark:text-zinc-300 mb-1">Tahun Aktif</label>
                <select
                  value={tahunAktif}
                  onChange={(e) => setTahunAktif(parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#202020] text-[var(--dash-text)] focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400"
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              </div>
              {role === 'OPERATOR_DESA' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--dash-text)] dark:text-zinc-300 mb-1">Posyandu Aktif</label>
                  <select
                    value={selectedPosyanduId}
                    onChange={(e) => setSelectedPosyanduId(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#202020] text-[var(--dash-text)] focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400"
                  >
                    <option value="">-- Pilih Posyandu --</option>
                    {posyandus.map(p => (
                      <option key={p.id} value={p.id}>{p.nama}</option>
                    ))}
                  </select>
                  <p className="text-xs text-[var(--dash-text-soft)] mt-1.5">
                    Pilih Posyandu default yang ingin Anda kelola datanya saat ini.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--dash-primary)] hover:bg-[var(--dash-primary-hover)] text-white font-medium rounded-md transition-all shadow-none text-sm"
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
