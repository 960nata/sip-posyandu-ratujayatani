'use client'

import { useEffect, useRef, useState } from 'react'
import { signOut } from 'next-auth/react'
import { ShieldAlert, LogOut } from 'lucide-react'

// Auto-logout bila tidak ada aktivitas selama TIMEOUT_MS.
// Peringatan hitung mundur muncul WARN_MS sebelum keluar.
const TIMEOUT_MS = 30 * 60 * 1000 // 30 menit
const WARN_MS = 2 * 60 * 1000 // peringatan 2 menit sebelum keluar

export default function InactivityGuard() {
  const [warn, setWarn] = useState(false)
  const [left, setLeft] = useState(Math.floor(WARN_MS / 1000))
  const warnRef = useRef(false)
  const timers = useRef<{ warn?: ReturnType<typeof setTimeout>; logout?: ReturnType<typeof setTimeout>; tick?: ReturnType<typeof setInterval> }>({})

  const clearAll = () => {
    if (timers.current.warn) clearTimeout(timers.current.warn)
    if (timers.current.logout) clearTimeout(timers.current.logout)
    if (timers.current.tick) clearInterval(timers.current.tick)
  }

  const start = () => {
    clearAll()
    warnRef.current = false
    setWarn(false)
    timers.current.warn = setTimeout(() => {
      warnRef.current = true
      setLeft(Math.floor(WARN_MS / 1000))
      setWarn(true)
      timers.current.tick = setInterval(() => setLeft(s => (s > 0 ? s - 1 : 0)), 1000)
    }, TIMEOUT_MS - WARN_MS)
    timers.current.logout = setTimeout(() => {
      signOut({ callbackUrl: '/login' })
    }, TIMEOUT_MS)
  }

  useEffect(() => {
    // Aktivitas mereset timer — kecuali saat peringatan sudah tampil
    // (agar pengguna sadar & menekan tombol secara sengaja).
    const onActivity = () => { if (!warnRef.current) start() }
    const events: (keyof WindowEventMap)[] = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach(e => window.addEventListener(e, onActivity, { passive: true }))
    start()
    return () => {
      events.forEach(e => window.removeEventListener(e, onActivity))
      clearAll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!warn) return null

  const mm = String(Math.floor(left / 60)).padStart(2, '0')
  const ss = String(left % 60).padStart(2, '0')

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#161618] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-amber-400 to-rose-500" />
        <div className="p-6 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 dark:bg-amber-900/25 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7 text-amber-500" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-[var(--dash-text)]">Sesi Akan Berakhir</h2>
          <p className="mt-1 text-sm text-[var(--dash-text-soft)]">
            Tidak ada aktivitas terdeteksi. Demi keamanan, Anda akan keluar otomatis dalam:
          </p>
          <div className="mt-4 text-4xl font-bold tabular-nums text-rose-500">{mm}:{ss}</div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/10 text-sm font-semibold text-[var(--dash-text-soft)] hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Keluar
            </button>
            <button
              onClick={start}
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors"
            >
              Tetap Masuk
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
