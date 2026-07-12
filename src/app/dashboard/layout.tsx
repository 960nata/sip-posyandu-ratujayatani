'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  Menu, X, Bell, User, LogOut, BookOpen, Building,
  Home, Shield, Users, Sun, Moon, ChevronDown,
  UserCheck, Activity, FileText, HardDrive, MapPin
} from 'lucide-react'

// Global ApexCharts defaults
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
    title: 'MENU UTAMA',
    items: [
      { name: 'Beranda', icon: Home, href: '/dashboard' },
      { name: 'Pengaturan Petugas', icon: UserCheck, href: '/dashboard/petugas', roles: ['OPERATOR_POSYANDU', 'OPERATOR_DESA'] },
      { name: 'SK Kepengurusan', icon: FileText, href: '/dashboard/sk-kepengurusan', roles: ['OPERATOR_POSYANDU', 'OPERATOR_DESA'] },
      { name: 'Analisa Data', icon: Activity, href: '/dashboard/posyandu' },
      { name: 'Manajemen Posyandu', icon: Building, href: '/dashboard/manage-posyandu', roles: ['SUPERADMIN', 'OPERATOR_DESA'] },
      { name: 'Manajemen User', icon: Users, href: '/dashboard/users', roles: ['SUPERADMIN'] },
      { name: 'Analisis & Peta', icon: MapPin, href: '/dashboard/analytics', roles: ['SUPERADMIN', 'ADMIN_KECAMATAN'] },
      { name: 'Push Notifikasi', icon: Bell, href: '/dashboard/push-notification', roles: ['SUPERADMIN'] },
      { name: 'Galeri Media', icon: HardDrive, href: '/dashboard/data-dukung', roles: ['SUPERADMIN'] },
    ]
  },
  {
    title: 'BIDANG KESEHATAN',
    items: [
      { name: 'Data Pengunjung (SIP 6)', icon: Users, href: '/dashboard/sip6', roles: ['SUPERADMIN', 'ADMIN_KECAMATAN', 'OPERATOR_POSYANDU', 'OPERATOR_DESA'] },
      { name: 'Hasil Kegiatan (SIP 7)', icon: BookOpen, href: '/dashboard/sip7', roles: ['SUPERADMIN', 'ADMIN_KECAMATAN', 'OPERATOR_POSYANDU', 'OPERATOR_DESA'] },
    ]
  },
  {
    title: 'BIDANG LAYANAN',
    items: [
      { name: 'Pendidikan', icon: BookOpen, href: '/dashboard/pendidikan', roles: ['SUPERADMIN', 'ADMIN_KECAMATAN', 'OPERATOR_POSYANDU', 'OPERATOR_DESA'] },
      { name: 'Pekerjaan Umum', icon: Building, href: '/dashboard/pekerjaan-umum', roles: ['SUPERADMIN', 'ADMIN_KECAMATAN', 'OPERATOR_POSYANDU', 'OPERATOR_DESA'] },
      { name: 'Perumahan', icon: Home, href: '/dashboard/perumahan', roles: ['SUPERADMIN', 'ADMIN_KECAMATAN', 'OPERATOR_POSYANDU', 'OPERATOR_DESA'] },
      { name: 'Trantib & Linmas', icon: Shield, href: '/dashboard/trantib', roles: ['SUPERADMIN', 'ADMIN_KECAMATAN', 'OPERATOR_POSYANDU', 'OPERATOR_DESA'] },
      { name: 'Sosial', icon: Users, href: '/dashboard/sosial', roles: ['SUPERADMIN', 'ADMIN_KECAMATAN', 'OPERATOR_POSYANDU', 'OPERATOR_DESA'] },
    ]
  },
  {
    title: 'REKAP & EKSPOR',
    items: [
      { name: 'Rekap & Ekspor Excel', icon: FileText, href: '/dashboard/laporan', roles: ['SUPERADMIN', 'VIEWER', 'ADMIN_KECAMATAN', 'OPERATOR_DESA', 'OPERATOR_POSYANDU'] },
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
  const [sideOpen, setSideOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const headerRef = useRef<HTMLDivElement>(null)

  const pathname = usePathname() ?? ""
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
      document.documentElement.setAttribute("data-theme", "dark")
    } else if (savedTheme === 'light') {
      setDarkMode(false)
      document.documentElement.removeAttribute("data-theme")
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(prefersDark)
      if (prefersDark) document.documentElement.setAttribute("data-theme", "dark")
    }
  }, [])

  const toggleTheme = () => {
    const newDark = !darkMode;
    setDarkMode(newDark)
    localStorage.setItem('theme', newDark ? 'dark' : 'light')
    if (newDark) {
      document.documentElement.setAttribute("data-theme", "dark")
    } else {
      document.documentElement.removeAttribute("data-theme")
    }
  }

  useEffect(() => {
    const closePopups = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setNotificationOpen(false)
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", closePopups)
    return () => document.removeEventListener("mousedown", closePopups)
  }, [])

  const crumb = CRUMBS[pathname] ?? 'Dashboard'
  const roleLabel = ROLE_LABELS[role] ?? role ?? '—'
  const userName = session?.user?.name || 'User'
  const userInitials = userName.charAt(0).toUpperCase()
  const userImage = (session?.user as any)?.image as string | undefined
  
  const navItemBase: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: "13px",
    padding: "11px 13px", borderRadius: "13px", textDecoration: "none",
    fontSize: "0.875rem", fontWeight: 600,
  };

  return (
    <div style={{ height: "100vh", overflow: "hidden", backgroundColor: "var(--dash-bg)", color: "var(--dash-text)", display: "flex", fontFamily: "var(--font-main)", WebkitFontSmoothing: "antialiased" }}>
      
      {/* ══ SIDEBAR ══ */}
      <aside className={`dash-sidebar${sideOpen ? " open" : ""}`} style={{
        width: "288px", backgroundColor: "var(--dash-sidebar)", flexShrink: 0,
        borderRight: "1px solid var(--dash-border)", display: "flex", flexDirection: "column",
        gap: "4px", padding: "22px 18px",
        overflowY: "auto", height: "100vh",
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "4px 6px 18px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "13px", background: "linear-gradient(135deg, var(--dash-primary), var(--dash-success))", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 8px 20px -8px var(--dash-primary)" }}>
             <img src="/images/logo/logo.png" alt="Logo" width={24} height={24} style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }} />
          </div>
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--dash-text)", letterSpacing: "-0.01em" }}>SIPANDU</div>
            <div style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--dash-primary)", letterSpacing: "0.04em" }}>PANEL ADMIN</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
          {menuGroups.map((group) => {
            const visible = group.items.filter(item => {
              if (item.roles) return item.roles.includes(role)
              return true
            })
            if (!visible.length) return null

            return (
              <div key={group.title}>
                <div style={{ fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.09em", color: "var(--dash-text-muted)", padding: "14px 8px 6px" }}>{group.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  {visible.map((item) => {
                    const Icon = item.icon
                    const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setSideOpen(false)}
                        className={active ? "" : "dash-nav-soft"}
                        style={active ? {
                          ...navItemBase,
                          background: "var(--dash-primary)", color: "#fff",
                          boxShadow: "0 10px 22px -12px var(--dash-primary)",
                        } : {
                          ...navItemBase,
                          background: "transparent", color: "var(--dash-text-soft)",
                        }}>
                        <Icon size={19} style={{ flexShrink: 0 }} />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>

        {/* Profile card */}
        <div style={{ marginTop: "8px", borderTop: "1px solid var(--dash-border)", paddingTop: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "11px", padding: "12px", borderRadius: "14px", background: "var(--dash-surface-hover)", border: "1px solid var(--dash-border)" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", background: "linear-gradient(135deg, var(--dash-primary), var(--dash-success))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "1rem", flexShrink: 0, boxShadow: "0 6px 14px -6px var(--dash-primary)" }}>
              {userImage ? <img src={userImage} alt={userName} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : userInitials}
            </div>
            <div style={{ lineHeight: 1.25, minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--dash-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</div>
              <div style={{ fontSize: "0.69rem", fontWeight: 600, color: "var(--dash-primary)", textTransform: "capitalize", marginTop: "1px" }}>{roleLabel}</div>
            </div>
            <button onClick={() => signOut({ callbackUrl: '/' })} title="Keluar" style={{ background: "none", border: "1px solid var(--dash-border)", color: "var(--dash-text-muted)", cursor: "pointer", padding: "6px", borderRadius: "8px", display: "flex", flexShrink: 0 }}>
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* ══ MAIN AREA ══ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        
        {/* ══ TOP HEADER ══ */}
        <header ref={headerRef} style={{
          position: "sticky", top: 0, zIndex: 40,
          borderBottom: "1px solid var(--dash-border)",
          backgroundColor: "var(--dash-surface)",
          backdropFilter: "saturate(1.4) blur(8px)",
          padding: "12px 20px",
          display: "flex", alignItems: "center", gap: "10px",
          flexShrink: 0,
        }}>
          {/* Hamburger — mobile only */}
          <button onClick={() => setSideOpen(v => !v)} className="dash-mob-toggle" style={{ background: "var(--dash-surface-hover)", border: "1px solid var(--dash-border)", color: "var(--dash-text)", cursor: "pointer", display: "none", padding: "8px", borderRadius: "10px", flexShrink: 0 }}>
            {sideOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Page title breadcrumb */}
          <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--dash-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>{crumb}</span>

          {/* Theme toggle — icon only */}
          <button onClick={toggleTheme} title={darkMode ? "Mode Terang" : "Mode Gelap"} className="dash-header-btn" style={{ width: "40px", height: "40px", borderRadius: "10px", border: "1px solid var(--dash-border)", background: "var(--dash-surface-hover)", color: "var(--dash-text-soft)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {darkMode ? <Sun size={17} style={{ color: "var(--dash-warning)" }} /> : <Moon size={17} />}
          </button>

          {/* Bell notification */}
          <button onClick={() => { setNotificationOpen(v => !v); setProfileOpen(false); }} style={{ position: "relative", width: "40px", height: "40px", borderRadius: "10px", border: "1px solid var(--dash-border)", background: "var(--dash-surface-hover)", color: "var(--dash-text-soft)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} title="Notifikasi">
            <Bell size={17} />
            {notifications.length > 0 && (
              <span style={{ position: "absolute", top: "7px", right: "8px", width: "7px", height: "7px", borderRadius: "50%", background: "var(--dash-danger)", border: "2px solid var(--dash-surface)" }} />
            )}
          </button>

          {/* Profile avatar — foto bulat, fallback inisial */}
          <button onClick={() => { setProfileOpen(v => !v); setNotificationOpen(false); }} title={userName} aria-haspopup="true" aria-expanded={profileOpen} style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", padding: 0, background: userImage ? "var(--dash-surface-hover)" : "linear-gradient(135deg, var(--dash-primary), var(--dash-success))", border: "1px solid var(--dash-border)", color: "#fff", fontWeight: 800, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {userImage ? <img src={userImage} alt={userName} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : userInitials}
          </button>

          {/* Profile popup */}
          {profileOpen && (
            <div className="dash-popup-panel" style={{ position: "absolute", right: "20px", top: "66px", zIndex: 210, width: "220px", background: "var(--dash-card)", border: "1px solid var(--dash-border)", borderRadius: "16px", padding: "8px", boxShadow: "0 24px 48px -24px rgba(0,0,0,0.4)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 10px 12px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", overflow: "hidden", background: "linear-gradient(135deg, var(--dash-primary), var(--dash-success))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "0.82rem", flexShrink: 0 }}>
                  {userImage ? <img src={userImage} alt={userName} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : userInitials}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--dash-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</div>
                  <div style={{ fontSize: "0.68rem", color: "var(--dash-text-muted)", textTransform: "capitalize" }}>{roleLabel}</div>
                </div>
              </div>
              <div style={{ borderTop: "1px solid var(--dash-border)", margin: "0 2px 6px" }} />
              <Link href="/dashboard/setting" onClick={() => setProfileOpen(false)} className="dash-menu-item" style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "9px 10px", borderRadius: "10px", textDecoration: "none", color: "var(--dash-text)", fontWeight: 600, fontSize: "0.84rem" }}>
                <User size={15} style={{ color: "var(--dash-text-muted)" }} /> Profil Saya
              </Link>
              <button onClick={() => { setProfileOpen(false); signOut({ callbackUrl: '/' }); }} className="dash-menu-item" style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "9px 10px", borderRadius: "10px", border: "none", background: "transparent", color: "var(--dash-danger)", fontWeight: 600, fontSize: "0.84rem", cursor: "pointer" }}>
                <LogOut size={15} /> Keluar
              </button>
            </div>
          )}

          {/* Notification popup */}
          {notificationOpen && (
            <div className="dash-popup-panel" style={{ position: "absolute", right: "68px", top: "66px", zIndex: 210, width: "320px", background: "var(--dash-card)", border: "1px solid var(--dash-border)", borderRadius: "16px", padding: "16px", boxShadow: "0 24px 48px -24px rgba(0,0,0,0.4)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div>
                  <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "var(--dash-text)" }}>Notifikasi</p>
                  <p style={{ margin: "2px 0 0", fontSize: "0.74rem", color: "var(--dash-text-muted)" }}>Update terbaru untuk akun Anda.</p>
                </div>
                <button onClick={() => setNotificationOpen(false)} style={{ background: "none", border: "none", color: "var(--dash-text-muted)", cursor: "pointer" }}><X size={15} /></button>
              </div>
              <div style={{ display: "grid", gap: "8px", maxHeight: "280px", overflowY: "auto" }}>
                {notifications.length > 0 ? (
                  notifications.map((notif: any) => (
                    <div key={notif.id} style={{ padding: "11px", borderRadius: "11px", background: "var(--dash-surface-hover)", border: "1px solid var(--dash-border)", display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "0.83rem", fontWeight: 700, color: "var(--dash-text)" }}>{notif.title}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--dash-text-muted)" }}>{notif.message}</span>
                      <span style={{ fontSize: "0.65rem", color: "var(--dash-text-muted)", marginTop: "2px" }}>
                        {new Date(notif.createdAt).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "16px", textAlign: "center", fontSize: "0.8rem", color: "var(--dash-text-muted)" }}>
                    Tidak ada notifikasi baru
                  </div>
                )}
              </div>
            </div>
          )}
        </header>

        {/* ══ MAIN CONTENT ══ */}
        <main style={{ flex: 1, overflowY: "auto", padding: "26px", minHeight: 0, overflowX: "hidden" }} className="dash-main">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sideOpen && (
        <div onClick={() => setSideOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 290, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }} />
      )}

      {/* Responsive Styles (similar to globals.css but scoped if needed, we rely on globals.css for dash-sidebar etc) */}
      <style jsx global>{`
        .dash-sidebar { transition: transform 0.25s cubic-bezier(.4,0,.2,1); }
        .dash-nav-soft:hover { background: var(--dash-surface-hover); color: var(--dash-text) !important; }
        .dash-header-btn:hover { background: var(--dash-card-hover); }
        .dash-menu-item:hover { background: var(--dash-surface-hover); }
      `}</style>
    </div>
  )
}
