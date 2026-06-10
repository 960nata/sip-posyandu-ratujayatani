'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email atau password salah')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#eaf7f0] flex items-center justify-center p-4 md:p-8 font-sans selection:bg-emerald-500/30">
      {/* Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md md:max-w-5xl bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[550px] md:min-h-[600px] border border-emerald-900/5"
      >
        {/* Left Panel: 3D Illustration (Desktop Only) */}
        <div className="hidden md:flex md:w-1/2 bg-[#e6f4ed] relative overflow-hidden select-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/30 to-transparent pointer-events-none z-10" />
          <Image
            src="/images/posyandu_login.png"
            alt="Posyandu Officer Illustration"
            fill
            priority
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>

        {/* Right Panel: Login Form */}
        <div className="w-full md:w-1/2 bg-white px-6 py-10 md:px-16 md:py-14 flex flex-col justify-between">
          {/* Logo / Header */}
          <div className="flex items-center gap-3 mb-8 md:mb-0">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 p-1.5">
              <Image src="/images/logo/logo.png" alt="Logo" width={28} height={28} className="object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-slate-800 leading-none">SIP Posyandu</span>
              <span className="text-[10px] text-slate-400 font-light mt-0.5">Kab. Lampung Timur</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="my-auto py-6 md:py-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
              Masuk Akun
            </h2>
            <p className="text-sm text-slate-400 font-light mb-8">
              Masukkan kredensial Anda untuk mengakses sistem informasi.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm font-light"
                  placeholder="Masukkan email Anda"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 pr-10 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm font-light"
                    placeholder="Masukkan password Anda"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 stroke-[1.8]" />
                    ) : (
                      <Eye className="h-5 w-5 stroke-[1.8]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Notice */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-100 text-red-600 text-sm p-3.5 rounded-2xl text-center font-light"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3.5 px-4 rounded-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-emerald-500/20 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-sm mt-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  'Masuk ke Akun'
                )}
              </button>
            </form>
          </div>

          {/* Footer Rights & Agreement */}
          <div className="text-center space-y-4">
            <p className="text-[11px] text-slate-400 font-light leading-relaxed max-w-xs mx-auto">
              Dengan masuk, Anda menyetujui{' '}
              <span className="text-slate-600 font-medium hover:underline cursor-pointer">Ketentuan Layanan</span> dan{' '}
              <span className="text-slate-600 font-medium hover:underline cursor-pointer">Kebijakan Privasi</span> SIP Posyandu.
            </p>
            <div className="pt-1">
              <Link href="/" className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold transition-colors hover:underline">
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

