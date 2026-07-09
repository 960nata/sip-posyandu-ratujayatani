'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, BarChart3, Folder, Menu, X, Bell, User, 
  Settings, LogOut, ChevronRight, BookOpen, Building, 
  Home, Shield, Users, Sun, Moon, Search, ChevronDown,
  Sparkles, UserCheck, Handshake, Newspaper, Briefcase, Activity,
  FileText
} from 'lucide-react'

const menuGroups = [
  {
    title: 'Menu Utama',
    items: [
      { name: 'Beranda', icon: Home, href: '/dashboard' },
      { name: 'Pengaturan Petugas', icon: UserCheck, href: '/dashboard/petugas', roles: ['OPERATOR_POSYANDU', 'OPERATOR_DESA', 'SUPERADMIN'] },
      { name: 'SK Kepengurusan', icon: FileText, href: '/dashboard/sk-kepengurusan', roles: ['OPERATOR_POSYANDU', 'OPERATOR_DESA', 'SUPERADMIN'] },
      { name: 'Analisa Data', icon: Activity, href: '/dashboard/posyandu' },
      { name: 'Manajemen Posyandu', icon: Building, href: '/dashboard/manage-posyandu', roles: ['OPERATOR_DESA'] },
      { name: 'Manajemen User', icon: Users, href: '/dashboard/users', roles: ['SUPERADMIN'] },
      { name: 'Push Notifikasi', icon: Bell, href: '/dashboard/push-notification', roles: ['SUPERADMIN'] },
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

  const isPosyandu = role === 'OPERATOR_POSYANDU'
  const theme = {
    text: isPosyandu ? 'text-purple-600' : 'text-emerald-600',
    textDark: isPosyandu ? 'dark:text-purple-400' : 'dark:text-emerald-400',
    bgLight: isPosyandu ? 'bg-purple-50' : 'bg-emerald-50',
    bgDark: isPosyandu ? 'dark:bg-purple-900/20' : 'dark:bg-emerald-900/20',
    focusRing: isPosyandu ? 'focus:ring-purple-500' : 'focus:ring-emerald-500',
    gradient: isPosyandu ? 'from-purple-400 to-indigo-500' : 'from-emerald-400 to-teal-500',
    shadow: isPosyandu ? 'shadow-purple-500/20' : 'shadow-emerald-500/20',
    iconBg: isPosyandu ? 'bg-purple-100' : 'bg-emerald-100',
    iconBgDark: isPosyandu ? 'dark:bg-purple-900/50' : 'dark:bg-emerald-900/50',
  }

  // Effect to handle dark mode persistence
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
    if (darkMode) {
      localStorage.setItem('theme', 'dark')
    } else {
      localStorage.setItem('theme', 'light')
    }
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'dark bg-[#0B0F19] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Sidebar Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>


      {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 bg-white dark:bg-[#111827] border-r border-slate-100 dark:border-slate-800 z-30 flex flex-col shadow-sm w-[280px] transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
            {/* Sidebar Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-50 dark:border-slate-800">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <Image src="/images/logo/logo.png" alt="Logo" width={36} height={36} className="object-contain" />
                <div className="flex flex-col">
                  <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-white">SIPANDU</span>
                  <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Sistem Informasi Posyandu</span>
                </div>
              </Link>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-slate-500 hover:text-slate-700 dark:hover:text-white p-2 rounded-[10px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar Menu */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-0.5">
              {menuGroups.map((group, groupIndex) => {
                const filteredItems = group.items.filter(item => {
                  if (item.roles) {
                    return item.roles.includes(role)
                  }
                  return true
                })

                if (filteredItems.length === 0) return null

                return (
                  <div key={group.title} className={groupIndex > 0 ? 'mt-4 pt-4 border-t border-slate-100 dark:border-slate-800' : ''}>
                    <p className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                      {group.title}
                    </p>
                    <div className="space-y-0.5">
                      {filteredItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center justify-between px-4 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-200 ${
                              isActive 
                                ? `${theme.bgLight} ${theme.bgDark} ${theme.text} ${theme.textDark}`
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <item.icon className={`w-5 h-5 ${isActive ? `${theme.text} ${theme.textDark}` : 'text-slate-500 dark:text-slate-500'}`} />
                              <span>{item.name}</span>
                            </div>
                            {isActive && <ChevronRight className={`w-4 h-4 ${theme.text} ${theme.textDark}`} />}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-slate-50 dark:border-slate-800">
              <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl">
                <div className={`w-9 h-9 ${theme.iconBg} ${theme.iconBgDark} rounded-lg flex items-center justify-center`}>
                  <User className={`w-5 h-5 ${theme.text} ${theme.textDark}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{session?.user?.name || 'User'}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{session?.user?.email || 'No Email'}</p>
                </div>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-[10px] hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
        </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 lg:pl-[280px]`}>
        {/* Header */}
        <header className="h-16 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm shadow-slate-100/50 dark:shadow-none">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-slate-500 hover:text-slate-700 dark:hover:text-white p-2 rounded-[10px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-500 dark:text-zinc-400">
              <span className="font-medium">Lampung Timur</span>
              <span>/</span>
              <span className="text-slate-800 dark:text-white font-semibold">Dashboard</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Cari sesuatu..."
                className={`w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/50 text-sm focus:outline-none focus:ring-2 ${theme.focusRing} focus:border-transparent dark:text-white transition-all`}
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 text-slate-500 hover:text-slate-700 dark:hover:text-white rounded-[10px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notification */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2.5 text-slate-500 hover:text-slate-700 dark:hover:text-white rounded-[10px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
              </button>
              

              
              <AnimatePresence>
                {isNotificationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-[-44px] xs:right-[-50px] md:right-[-100px] mt-4 w-72 bg-white dark:bg-[#111827] rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-800">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">Notifikasi</p>
                    </div>
                    <div className="p-2 space-y-1">
                      {notifications.length > 0 ? (
                        notifications.map((notif: any) => (
                          <div key={notif.id} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-800 last:border-0">
                            <p className="text-xs font-semibold text-slate-800 dark:text-white">{notif.title}</p>
                            <p className="text-xs text-slate-600 dark:text-zinc-300 line-clamp-2">{notif.message}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{new Date(notif.createdAt).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs text-slate-500 dark:text-zinc-400">
                          Tidak ada notifikasi baru
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-zinc-900 mx-1"></div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-[10px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              >
                <div className={`w-8 h-8 bg-gradient-to-br ${theme.gradient} rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md ${theme.shadow}`}>
                  {session?.user?.name?.[0] || 'U'}
                </div>
                <span className="hidden md:inline text-sm font-semibold text-slate-800 dark:text-white">{session?.user?.name || 'User'}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}

              
              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#111827] rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 py-1.5 z-50"
                  >
                    <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-800">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{session?.user?.name || 'User'}</p>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{session?.user?.email || ''}</p>
                    </div>
                    <div className="p-1.5">
                      <Link href="/dashboard/setting" className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-[10px] transition-colors">
                        <User className="w-4 h-4 text-slate-500" />
                        <span>Profil Saya</span>
                      </Link>
                      <div className="my-1 border-t border-slate-50 dark:border-slate-800"></div>
                      <button 
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[10px] transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 px-[10px] py-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
