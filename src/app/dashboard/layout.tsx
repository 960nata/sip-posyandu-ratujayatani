'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, Bell, User, LogOut, BookOpen, Building,
  Home, Shield, Users, Sun, Moon, ChevronDown,
  UserCheck, Activity, FileText, HardDrive
} from 'lucide-react'

// Global ApexCharts defaults — calm minimal look for every dashboard chart.
// Runs at module load (before any chart mounts); per-chart options still win.
if (typeof window !== 'undefined') {
  ;(window as any).Apex = {
    chart: {
      fontFamily: 'inherit',
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: 'rgba(120, 120, 130, 0.85)',
    },
    grid: {
      borderColor: 'rgba(120, 120, 130, 0.15)',
      strokeDashArray: 4,
    },
    stroke: { curve: 'smooth', width: 2.5 },
    dataLabels: { enabled: false },
    legend: { fontSize: '12px', markers: { size: 5 } },
    tooltip: { theme: 'dark' },
  }
}

const menuGroups = [
  {
    title: 'Menu Utama',
    items: [
      { name: 'Beranda', icon: Home, href: '/dashboard' },
      { name: 'Pengaturan Petugas', icon: UserCheck, href: '/dashboard/petugas', roles: ['OPERATOR_POSYANDU', 'OPERATOR_DESA'] },
      { name: 'SK Kepengurusan', icon: FileText, href: '/dashboard/sk-kepengurusan', roles: ['OPERATOR_POSYANDU', 'OPERATOR_DESA'] },
      { name: 'Analisa Data', icon: Activity, href: '/dashboard/posyandu' },
      { name: 'Manajemen Posyandu', icon: Building, href: '/dashboard/manage-posyandu', roles: ['OPERATOR_DESA'] },
      { name: 'Manajemen User', icon: Users, href: '/dashboard/users', roles: ['SUPERADMIN'] },
      { name: 'Push Notifikasi', icon: Bell, href: '/dashboard/push-notification', roles: ['SUPERADMIN'] },
      { name: 'Galeri Media', icon: HardDrive, href: '/dashboard/data-dukung', roles: ['SUPERADMIN'] },
    ]
  },
  {
    title: 'Bidang Kesehatan',
    items: [
      { name: 'Data Pengunjung (SIP 6)', icon: Users, href: '/dashboard/sip6', roles: ['SUPERADMIN', 'ADMIN_KECAMATAN', 'OPERATOR_POSYANDU', 'OPERATOR_DESA'] },
      { name: 'Hasil Kegiatan (SIP 7)', icon: BookOpen, href: '/dashboard/sip7', roles: ['SUPERADMIN', 'ADMIN_KECAMATAN', 'OPERATOR_POSYANDU', 'OPERATOR_DESA'] },
    ]
  },
  {
    title: 'Bidang Layanan',
    items: [
      { name: 'Pendidikan', icon: BookOpen, href: '/dashboard/pendidikan', roles: ['SUPERADMIN', 'ADMIN_KECAMATAN', 'OPERATOR_POSYANDU', 'OPERATOR_DESA'] },
      { name: 'Pekerjaan Umum', icon: Building, href: '/dashboard/pekerjaan-umum', roles: ['SUPERADMIN', 'ADMIN_KECAMATAN', 'OPERATOR_POSYANDU', 'OPERATOR_DESA'] },
      { name: 'Perumahan', icon: Home, href: '/dashboard/perumahan', roles: ['SUPERADMIN', 'ADMIN_KECAMATAN', 'OPERATOR_POSYANDU', 'OPERATOR_DESA'] },
      { name: 'Trantib & Linmas', icon: Shield, href: '/dashboard/trantib', roles: ['SUPERADMIN', 'ADMIN_KECAMATAN', 'OPERATOR_POSYANDU', 'OPERATOR_DESA'] },
      { name: 'Sosial', icon: Users, href: '/dashboard/sosial', roles: ['SUPERADMIN', 'ADMIN_KECAMATAN', 'OPERATOR_POSYANDU', 'OPERATOR_DESA'] },
    ]
  }
]

const CRUMBS: Record<string, string> = {
  '/dashboard': 'Beranda',
  '/dashboard/petugas': 'Pengaturan Petugas',
  '/dashboard/sk-kepengurusan': 'SK Kepengurusan',
  '/dashboard/posyandu': 'Analisa Data',
  '/dashboard/manage-posyandu': 'Manajemen Posyandu',
  '/dashboard/users': 'Manajemen User',
  '/dashboard/push-notification': 'Push Notifikasi',
  '/dashboard/data-dukung': 'Galeri Media',
  '/dashboard/sip6': 'Data Pengunjung (SIP 6)',
  '/dashboard/sip6/sasaran': 'Sasaran Individu (SIP 6)',
  '/dashboard/sip7': 'Hasil Kegiatan (SIP 7)',
  '/dashboard/pendidikan': 'Bidang Pendidikan',
  '/dashboard/pekerjaan-umum': 'Bidang Pekerjaan Umum',
  '/dashboard/perumahan': 'Bidang Perumahan',
  '/dashboard/trantib': 'Trantib & Linmas',
  '/dashboard/sosial': 'Bidang Sosial',
  '/dashboard/laporan': 'Laporan',
  '/dashboard/profile': 'Profil',
  '/dashboard/setting': 'Pengaturan Akun',
}

const ROLE_LABELS: Record<string, string> = {
  SUPERADMIN: 'Super Admin',
  ADMIN_KABUPATEN: 'Admin Kabupaten',
  ADMIN_KECAMATAN: 'Admin Kecamatan',
  OPERATOR_DESA: 'Operator Desa',
  OPERATOR_POSYANDU: 'Operator Posyandu',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  const notificationRef = useRef<HTMLDivElement>(null)
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  const pathname = usePathname()
  const { data: session } = useSession()
  const role = (session?.user as any)?.role

  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    if (session?.user) {
      fetch('/api/notifications')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setNotifications(data)
          }
        })
        .catch(err => console.error(err))
    }
  }, [session])

  // Dark mode persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setDarkMode(true)
    } else if (savedTheme === 'light') {
      setDarkMode(false)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(prefersDark)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false)
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const crumb = CRUMBS[pathname ?? ''] ?? 'Dashboard'
  const roleLabel = ROLE_LABELS[role] ?? role ?? '—'

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark' : ''} bg-[var(--dash-bg)] text-[var(--dash-text)]`}>
      {/* Sidebar Backdrop (mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ══ SIDEBAR ══ */}
      <aside
        className={`fixed inset-y-0 left-0 w-[264px] bg-[var(--dash-sidebar)] border-r border-[var(--dash-border)] z-30 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-4 pt-5 pb-4">
          <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[var(--dash-primary)] flex items-center justify-center shrink-0">
              <Image src="/images/logo/logo.png" alt="Logo" width={22} height={22} className="object-contain brightness-0 invert" />
            </div>
            <div className="leading-tight min-w-0">
              <p className="text-sm font-extrabold tracking-tight text-[var(--dash-text)] truncate">SIPANDU</p>
              <p className="text-[10px] font-semibold tracking-widest text-[var(--dash-primary)] uppercase">Panel Admin</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-[var(--dash-text-muted)] hover:bg-[var(--dash-surface-hover)] hover:text-[var(--dash-text)] transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 pb-3">
          {menuGroups.map((group) => {
            const filteredItems = group.items.filter(item => {
              if (item.roles) return item.roles.includes(role)
              return true
            })
            if (filteredItems.length === 0) return null

            return (
              <div key={group.title}>
                <p className="px-3 pt-4 pb-1.5 text-[10.5px] font-bold text-[var(--dash-text-muted)] uppercase tracking-[0.08em]">
                  {group.title}
                </p>
                <div className="space-y-px">
                  {filteredItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-[7px] rounded-md text-[13.5px] transition-colors duration-100 ${
                          isActive
                            ? 'bg-[var(--dash-primary-bg)] text-[var(--dash-primary)] font-semibold'
                            : 'text-[var(--dash-text-soft)] font-medium hover:bg-[var(--dash-surface-hover)] hover:text-[var(--dash-text)]'
                        }`}
                      >
                        <item.icon className={`w-[17px] h-[17px] shrink-0 ${isActive ? 'text-[var(--dash-primary)]' : 'text-[var(--dash-text-muted)]'}`} />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>

        {/* Profile card */}
        <div className="p-3 border-t border-[var(--dash-border)]">
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[var(--dash-surface)] border border-[var(--dash-border)]">
            <div className="w-9 h-9 rounded-lg bg-[var(--dash-primary)] flex items-center justify-center text-white font-bold text-sm shrink-0">
              {session?.user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0 leading-tight">
              <p className="text-[13px] font-semibold text-[var(--dash-text)] truncate">{session?.user?.name || 'User'}</p>
              <p className="text-[11px] font-medium text-[var(--dash-primary)] truncate">{roleLabel}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              title="Keluar"
              className="p-1.5 rounded-md border border-[var(--dash-border)] text-[var(--dash-text-muted)] hover:text-[var(--dash-danger)] hover:bg-[var(--dash-danger-bg)] transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ══ MAIN AREA ══ */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-[264px]">
        {/* Header */}
        <header className="h-14 bg-[var(--dash-surface)]/90 backdrop-blur-md border-b border-[var(--dash-border)] flex items-center justify-between gap-3 px-4 lg:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md border border-[var(--dash-border)] text-[var(--dash-text-soft)] hover:bg-[var(--dash-surface-hover)] transition-colors"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[var(--dash-text)] truncate leading-tight">{crumb}</p>
              <p className="hidden sm:block text-[11px] text-[var(--dash-text-muted)] leading-tight">
                SIPANDU · Kabupaten Lampung Timur
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-md border border-[var(--dash-border)] flex items-center justify-center text-[var(--dash-text-soft)] hover:bg-[var(--dash-surface-hover)] transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-[var(--dash-warning)]" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative w-9 h-9 rounded-md border border-[var(--dash-border)] flex items-center justify-center text-[var(--dash-text-soft)] hover:bg-[var(--dash-surface-hover)] transition-colors"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[var(--dash-danger)] rounded-full"></span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.12, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-[var(--dash-card)] rounded-xl border border-[var(--dash-border)] shadow-[0_24px_48px_-24px_rgba(0,0,0,0.35)] p-2 z-50"
                  >
                    <div className="px-3 py-2">
                      <p className="text-[13px] font-bold text-[var(--dash-text)]">Notifikasi</p>
                      <p className="text-[11px] text-[var(--dash-text-muted)]">Update terbaru untuk akun Anda.</p>
                    </div>
                    <div className="border-t border-[var(--dash-border)] my-1" />
                    <div className="max-h-72 overflow-y-auto space-y-1 p-1">
                      {notifications.length > 0 ? (
                        notifications.map((notif: any) => (
                          <div key={notif.id} className="p-2.5 rounded-lg hover:bg-[var(--dash-surface-hover)] transition-colors cursor-pointer">
                            <p className="text-xs font-semibold text-[var(--dash-text)]">{notif.title}</p>
                            <p className="text-xs text-[var(--dash-text-soft)] line-clamp-2 mt-0.5">{notif.message}</p>
                            <p className="text-[10px] text-[var(--dash-text-muted)] mt-1">
                              {new Date(notif.createdAt).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs text-[var(--dash-text-muted)]">
                          Tidak ada notifikasi baru
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 h-9 pl-1.5 pr-2 rounded-md border border-[var(--dash-border)] hover:bg-[var(--dash-surface-hover)] transition-colors focus:outline-none"
              >
                <div className="w-[26px] h-[26px] bg-[var(--dash-primary)] rounded-md flex items-center justify-center text-white font-bold text-xs">
                  {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden md:inline text-[13px] font-semibold text-[var(--dash-text)] max-w-[140px] truncate">
                  {session?.user?.name || 'User'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-[var(--dash-text-muted)] transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.12, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-56 bg-[var(--dash-card)] rounded-xl border border-[var(--dash-border)] shadow-[0_24px_48px_-24px_rgba(0,0,0,0.35)] p-1.5 z-50"
                  >
                    <div className="px-3 py-2">
                      <p className="text-[13px] font-bold text-[var(--dash-text)] truncate">{session?.user?.name || 'User'}</p>
                      <p className="text-[11px] text-[var(--dash-text-muted)] truncate">{session?.user?.email || ''}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--dash-primary-bg)] text-[var(--dash-primary)]">
                        {roleLabel}
                      </span>
                    </div>
                    <div className="border-t border-[var(--dash-border)] my-1" />
                    <Link
                      href="/dashboard/setting"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-[var(--dash-text-soft)] hover:bg-[var(--dash-surface-hover)] hover:text-[var(--dash-text)] rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4 text-[var(--dash-text-muted)]" />
                      Profil Saya
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-[var(--dash-danger)] hover:bg-[var(--dash-danger-bg)] rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 px-[10px] py-5 lg:p-6 pb-20 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Bottom tab bar — mobile only, quick access for kader di lapangan */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-20 bg-[var(--dash-surface)]/95 backdrop-blur-md border-t border-[var(--dash-border)] pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-4">
          {[
            { name: 'Beranda', icon: Home, href: '/dashboard' },
            { name: 'SIP 6', icon: Users, href: '/dashboard/sip6' },
            { name: 'SIP 7', icon: BookOpen, href: '/dashboard/sip7' },
            { name: 'Profil', icon: User, href: '/dashboard/setting' },
          ].map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors ${
                  isActive ? 'text-[var(--dash-primary)]' : 'text-[var(--dash-text-muted)] active:text-[var(--dash-text)]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-semibold">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
