'use client'

import {
  Heart, Users, BookOpen, Building, Home,
  Shield, CheckCircle, Clock, AlertTriangle, ArrowUpRight,
  UserPlus, Activity, List, Lock, FileText, CheckCircle2,
  Mail, Tag, ChevronDown, MapPin, Plus, Eye, HeartPulse
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useSession } from 'next-auth/react'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

// Region Data from Seed
const regionData = [
  {
    "name": "Bandar Sribhawono",
    "kode": "18.07.15",
    "desas": ["Bandar Agung", "Mekar Jaya", "Sadar Sriwijaya", "Sribhawono", "Sri Menanti", "Sri Pendowo", "Waringin Jaya"]
  },
  {
    "name": "Batanghari",
    "kode": "18.07.06",
    "desas": ["Adi Warno", "Balai Kencono", "Bale Rejo", "Banarjoyo", "Banjarrejo", "Batangharjo", "Buana Sakti", "Bumiharjo", "Bumi Mas", "Nampi Rejo", "Purwodadi Mekar", "Rejoagung", "Selorejo", "Sri Basuki", "Sumber Agung", "Sumber Rejo", "Telogorejo"]
  },
  {
    "name": "Batanghari Nuban",
    "kode": "18.07.13",
    "desas": ["Bumi Jawa", "Cempaka Nuban", "Gedung Dalem", "Gunung Tiga", "Kedaton", "Kedaton I", "Kedaton II", "Purwosari", "Negara Ratu", "Sukacari", "Sukaraja Nuban", "Trisnomulyo", "Tulung Balak"]
  },
  {
    "name": "Braja Slebah",
    "kode": "18.07.22",
    "desas": ["Braja Gemilang", "Braja Harjosari", "Braja Indah", "Braja Kencana", "Braja Luhur", "Braja Mulya", "Braja Yekti"]
  },
  {
    "name": "Bumi Agung",
    "kode": "18.07.14",
    "desas": ["Bumi Tinggi", "Catur Swako", "Donomulyo", "Lehan", "Marga Mulya", "Mulyo Asri", "Nyampir"]
  },
  {
    "name": "Gunung Pelindung",
    "kode": "18.07.18",
    "desas": ["Nibung", "Negeri Agung", "Pelindung Jaya", "Pempen", "Way Mili"]
  },
  {
    "name": "Jabung",
    "kode": "18.07.03",
    "desas": ["Adiluhur", "Adirejo", "Asahan", "Belimbing Sari", "Benteng Sari", "Gunung Mekar", "Gunung Sugih Kecil", "Jabung", "Mekarjaya", "Mumbang Jaya", "Negara Batin", "Negara Saka", "Pematang Tahalo", "Sambirejo", "Tanjungsari"]
  },
  {
    "name": "Labuhan Maringgai",
    "kode": "18.07.02",
    "desas": ["Bandar Negeri", "Karang Anyar", "Karya Makmur", "Karya Tani", "Labuhan Maringgai", "Margasari", "Maringgai", "Muara Gading Mas", "Srigading", "Sri Minosari", "Sukorahayu"]
  },
  {
    "name": "Labuhan Ratu",
    "kode": "18.07.21",
    "desas": ["Labuhan Ratu", "Labuhan Ratu III", "Labuhan Ratu IV", "Labuhan Ratu V", "Labuhan Ratu VI", "Labuhan Ratu VII", "Labuhan Ratu VIII", "Labuhan Ratu IX", "Rajabasa Lama", "Rajabasa Lama I", "Rajabasa Lama II"]
  },
  {
    "name": "Marga Sekampung",
    "kode": "18.07.24",
    "desas": ["Peniangan", "Gunung Raya", "Batu Badak", "Giri Mulyo", "Bungkuk", "Gunung Mas", "Purwosari", "Bukit Raya"]
  },
  {
    "name": "Marga Tiga",
    "kode": "18.07.11",
    "desas": ["Gedung Wani", "Gedungwani Timur", "Jaya Guna", "Nabang Baru", "Negeri Jemanten", "Negeri Katon", "Negeri Agung", "Negeri Tua", "Sukadana Baru", "Sukaraja Tiga", "Surya Mataram", "Tanjung Harapan", "Trisinar"]
  },
  {
    "name": "Mataram Baru",
    "kode": "18.07.16",
    "desas": ["Kebon Damar", "Mataram Baru", "Mandala Sari", "Rajabasa Baru", "Teluk Dalem", "Tulung Pasik", "Way Areng"]
  },
  {
    "name": "Melinting",
    "kode": "18.07.17",
    "desas": ["Itik Renday", "Sido Makmur", "Sumber Hadi", "Tanjung Aji", "Tebing", "Wana"]
  },
  {
    "name": "Metro Kibang",
    "kode": "18.07.10",
    "desas": ["Kibang", "Jaya Asri", "Marga Jaya", "Margasari", "Margototo", "Purbosembodo", "Sumber Agung"]
  },
  {
    "name": "Pasir Sakti",
    "kode": "18.07.19",
    "desas": ["Kedung Ringin", "Labuhan Ratu", "Mekar Sari", "Mulyo Sari", "Pasir Sakti", "Purworejo", "Rejo Mulyo", "Sumur Kucing"]
  },
  {
    "name": "Pekalongan",
    "kode": "18.07.04",
    "desas": ["Adijaya", "Adirejo", "Ganti Warno", "Gantimulyo", "Gondangrejo", "Jojog", "Kalibening", "Pekalongan", "Sidodadi", "Siraman", "Tulusrejo", "Wonosari"]
  },
  {
    "name": "Purbolinggo",
    "kode": "18.07.08",
    "desas": ["Taman Asri", "Taman Bogo", "Taman Cari", "Taman Dadi", "Taman Endah", "Taman Fajar", "Tegal Gondo", "Toto Harjo", "Tanjung Inten", "Tegal Yoso", "Tanjung Kesuma", "Tambah Luhur"]
  },
  {
    "name": "Raman Utara",
    "kode": "18.07.09",
    "desas": ["Kota Raman", "Rama Puja", "Raman Aji", "Raman Endra", "Raman Fajar", "Rantau Fajar", "Ratna Daya", "Rejo Binangun", "Rejo Katon", "Restu Rahayu", "Rukti Sedyo"]
  },
  {
    "name": "Sekampung",
    "kode": "18.07.05",
    "desas": ["Girikarto", "Giriklopomulyo", "Hargomulyo", "Jadimulyo", "Karyamukti", "Mekarmukti", "Mekar Mulyo", "Mekar Sari", "Sambikarto", "Sidodadi", "Sidomukti", "Sidomulyo", "Sukoharjo", "Sumbergede", "Sumbersari", "Trimulyo", "Wonokarto"]
  },
  {
    "name": "Sekampung Udik",
    "kode": "18.07.12",
    "desas": ["Banjar Agung", "Bauh Gunung Sari", "Bojong", "Brawijaya", "Bumi Mulyo", "Gunung Agung", "Gunung Mulyo", "Gunung Pasir Jaya", "Gunung Sugih Besar", "Mengandung Sari", "Pugung Raharjo", "Purwokencono", "Sidorejo", "Sindang Anom", "Toba"]
  },
  {
    "name": "Sukadana",
    "kode": "18.07.01",
    "desas": ["Bumi Ayu", "Bumi Nabung Udik", "Mataram Marga", "Muara Jaya", "Negara Nabung", "Pakuan Aji", "Pasar Sukadana", "Putra Aji I", "Putra Aji II", "Rajabasa Batanghari", "Rantau Jaya Udik", "Rantau Jaya Udik II", "Sukadana", "Sukadana Ilir", "Sukadana Jaya", "Sukadana Selatan", "Sukadana Tengah", "Sukadana Timur", "Sukadana Udik", "Terbangi Marga"]
  },
  {
    "name": "Way Bungur",
    "kode": "18.07.23",
    "desas": ["Kali Pasir", "Taman Negeri", "Tambah Subur", "Tanjung Qencono", "Tanjung Tirto", "Tegal Ombo", "Toto Mulyo", "Toto Projo"]
  },
  {
    "name": "Waway Karya",
    "kode": "18.07.20",
    "desas": ["Jembrana", "Karang Anom", "Karya Basuki", "Marga Batin", "Mekar Karya", "Ngesti Karya", "Sido Rahayu", "Sumber Jaya", "Sumber Rejo", "Tanjung Wangi", "Tri Tunggal"]
  },
  {
    "name": "Way Jepara",
    "kode": "18.07.07",
    "desas": ["Braja Asri", "Braja Caka", "Braja Dewa", "Braja Emas", "Braja Fajar", "Braja Sakti", "Jepara", "Labuhan Ratu I", "Labuhan Ratu II", "Labuhan Ratu Baru", "Labuhan Ratu Danau", "Sri Rejosari", "Sri Wangi", "Sumberejo", "Sumber Marga", "Sumur Bandung"]
  }
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const role = (session?.user as any)?.role

  // State for Dependent Dropdowns
  const [selectedKec, setSelectedKec] = useState('')
  const [selectedDesa, setSelectedDesa] = useState('')
  const [selectedPosyandu, setSelectedPosyandu] = useState('')

  // Auto-set region based on role (Mocking coverage area)
  useEffect(() => {
    const userKecamatanNama = (session?.user as any)?.kecamatanNama
    
    if (role === 'ADMIN_KECAMATAN') {
      if (userKecamatanNama) {
        setSelectedKec(userKecamatanNama)
      } else {
        setSelectedKec('Pekalongan') // Fallback
      }
    } else if (role === 'OPERATOR_DESA') {
      if (userKecamatanNama) {
        setSelectedKec(userKecamatanNama)
      } else {
        setSelectedKec('Pekalongan')
      }
      setSelectedDesa('Adijaya') // Operator Desa Adijaya
    } else if (role === 'OPERATOR_POSYANDU') {
      if (userKecamatanNama) {
        setSelectedKec(userKecamatanNama)
      } else {
        setSelectedKec('Pekalongan')
      }
      setSelectedDesa('Adijaya')
      setSelectedPosyandu('Posyandu Adijaya 1')
    }
  }, [role, session])

  // Derived Data
  const availableDesas = useMemo(() => {
    const kec = regionData.find(k => k.name === selectedKec)
    return kec ? kec.desas : []
  }, [selectedKec])

  const availablePosyandus = useMemo(() => {
    if (!selectedDesa) return []
    return [`Posyandu ${selectedDesa} 1`, `Posyandu ${selectedDesa} 2`, `Posyandu ${selectedDesa} 3`]
  }, [selectedDesa])

  // Handlers
  const handleKecChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKec(e.target.value)
    setSelectedDesa('')
    setSelectedPosyandu('')
  }

  const handleDesaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDesa(e.target.value)
    setSelectedPosyandu('')
  }

  // Skeleton Loading State
  if (status === 'loading') {
    return (
      <div className="space-y-8 p-6 font-sans">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-10 w-56 bg-slate-100 dark:bg-zinc-800 rounded-xl animate-pulse"></div>
            <div className="h-4 w-72 bg-slate-100 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-slate-100 dark:bg-zinc-800 rounded-xl animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-10 h-10 bg-slate-100 dark:bg-zinc-800 rounded-xl animate-pulse"></div>
              <div className="h-4 w-24 bg-slate-100 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
              <div className="h-8 w-16 bg-slate-100 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 font-sans">
        <Lock className="w-10 h-10 text-slate-300" />
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Akses Ditolak</h2>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">Silakan login terlebih dahulu untuk mengakses halaman ini.</p>
      </div>
    )
  }

  // Dummy data tailored to roles
  const dummyUsers = [
    { id: 1, name: 'Budi Santoso', role: 'OPERATOR_DESA', email: 'budi@siplamtim.id', kecamatan: 'Pekalongan', desa: 'Adijaya' },
    { id: 2, name: 'Siti Aminah', role: 'OPERATOR_POSYANDU', email: 'siti@siplamtim.id', kecamatan: 'Pekalongan', desa: 'Adijaya' },
    { id: 3, name: 'dr. Andi', role: 'ADMIN_KECAMATAN', email: 'andi@siplamtim.id', kecamatan: 'Pekalongan' },
  ]

  // Render content based on role
  const renderDashboardContent = () => {
    // 1. ROLE POSYANDU (Fungsi: Mengakomodasi SEMUA Kolek Data)
    if (role === 'OPERATOR_POSYANDU') {
      const dataModules = [
        { title: 'Data KES-6', desc: 'Perkembangan anak & balita', icon: HeartPulse, color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20', slug: 'sip6' },
        { title: 'Data KES-7', desc: 'Ibu hamil & nifas', icon: Heart, color: 'text-pink-500 bg-pink-50 dark:bg-pink-900/20', slug: 'sip7' },
        { title: 'Data Pendidikan', desc: 'Sarana & prasarana', icon: BookOpen, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20', slug: 'pendidikan' },
        { title: 'Data Pekerjaan Umum', desc: 'Infrastruktur umum', icon: Building, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20', slug: 'pekerjaan-umum' },
        { title: 'Data Perumahan', desc: 'Kondisi rumah & sanitasi', icon: Home, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20', slug: 'perumahan' },
        { title: 'Data Trantib', desc: 'Keamanan & ketertiban', icon: Shield, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20', slug: 'trantib' },
        { title: 'Data Sosial', desc: 'Kesejahteraan warga', icon: Users, color: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20', slug: 'sosial' },
      ]

      return (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">Total Balita</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">150</p>
                </div>
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center text-rose-500">
                  <HeartPulse className="w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">Ibu Hamil</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">24</p>
                </div>
                <div className="w-10 h-10 bg-pink-50 dark:bg-pink-900/20 rounded-xl flex items-center justify-center text-pink-500">
                  <Heart className="w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">Lansia</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">45</p>
                </div>
                <div className="w-10 h-10 bg-violet-50 dark:bg-violet-900/20 rounded-xl flex items-center justify-center text-violet-500">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">Laporan Baru</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">5</p>
                </div>
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-500">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-1">Pusat Pengumpulan Data</h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400">Pilih modul data yang ingin Anda input hari ini.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dataModules.map((module) => (
              <div key={module.title} className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:shadow-slate-100/50 dark:hover:shadow-none transition-all group">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className={`w-12 h-12 ${module.color} rounded-xl flex items-center justify-center transition-transform group-hover:scale-105`}>
                      <module.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{module.desc}</p>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/dashboard/${module.slug}`}
                  className="mt-5 w-full py-2.5 bg-slate-50 dark:bg-zinc-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-slate-700 dark:text-white hover:text-purple-600 text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1 border border-transparent hover:border-purple-100 dark:hover:border-purple-900/50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Input Data
                </Link>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-4">Riwayat Aktivitas</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Input Data KES-6</p>
                  <p className="text-xs text-slate-400 mt-0.5">Hari ini, 10:30</p>
                </div>
                <span className="text-xs font-medium text-purple-600 bg-purple-50 dark:bg-purple-900/30 px-2.5 py-1 rounded-full">Berhasil</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Input Data Sosial</p>
                  <p className="text-xs text-slate-400 mt-0.5">Kemarin, 14:20</p>
                </div>
                <span className="text-xs font-medium text-purple-600 bg-purple-50 dark:bg-purple-900/30 px-2.5 py-1 rounded-full">Berhasil</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // 2. ROLE DESA (Fungsi: Monitoring & Verifikasi Posyandu)
    if (role === 'OPERATOR_DESA') {
      const dataModules = [
        { title: 'Data KES-6', desc: 'Perkembangan anak & balita', icon: HeartPulse, color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20', slug: 'sip6' },
        { title: 'Data KES-7', desc: 'Ibu hamil & nifas', icon: Heart, color: 'text-pink-500 bg-pink-50 dark:bg-pink-900/20', slug: 'sip7' },
        { title: 'Data Pendidikan', desc: 'Sarana & prasarana', icon: BookOpen, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20', slug: 'pendidikan' },
        { title: 'Data Pekerjaan Umum', desc: 'Infrastruktur umum', icon: Building, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20', slug: 'pekerjaan-umum' },
        { title: 'Data Perumahan', desc: 'Kondisi rumah & sanitasi', icon: Home, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20', slug: 'perumahan' },
        { title: 'Data Trantib', desc: 'Keamanan & ketertiban', icon: Shield, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20', slug: 'trantib' },
        { title: 'Data Sosial', desc: 'Kesejahteraan warga', icon: Users, color: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20', slug: 'sosial' },
      ]

      if (selectedPosyandu) {
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={() => setSelectedPosyandu('')}
                  className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors mb-2"
                  title="Kembali ke Daftar"
                >
                  <ChevronDown className="w-5 h-5 rotate-90" />
                </button>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
                  Detail {selectedPosyandu}
                </h2>
                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  Memantau data yang diinput oleh posyandu ini.
                </p>
              </div>
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 rounded-full">
                Active
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {dataModules.map((module) => (
                <div key={module.title} className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:shadow-slate-100/50 dark:hover:shadow-none transition-all group">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className={`w-12 h-12 ${module.color} rounded-xl flex items-center justify-center transition-transform group-hover:scale-105`}>
                        <module.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                          {module.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{module.desc}</p>
                      </div>
                    </div>
                  </div>
                  <Link href={`/dashboard/${module.slug}?posyandu=${selectedPosyandu}`} className="mt-5 w-full py-2.5 bg-slate-50 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-700 dark:text-white hover:text-emerald-600 text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/50">
                    <Eye className="w-3.5 h-3.5" />
                    Lihat Data
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )
      }

      // ApexCharts Options for Desa
      const desaChartOptions = {
        chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
        plotOptions: { bar: { borderRadius: 4, horizontal: true } },
        dataLabels: { enabled: false },
        xaxis: { categories: ['Posyandu Mawar', 'Posyandu Melati', 'Posyandu Kenanga', 'Posyandu Kamboja', 'Posyandu Flamboyan'], labels: { style: { colors: '#94a3b8' } } },
        yaxis: { labels: { style: { colors: '#94a3b8' } } },
        fill: { colors: ['#10b981'] },
        tooltip: { theme: 'dark' }
      }
      const desaChartSeries = [{ name: 'Laporan Selesai', data: [7, 5, 3, 6, 4] }]

      const desaDonutOptions = {
        chart: { type: 'donut', background: 'transparent' },
        labels: ['Selesai', 'Pending'],
        colors: ['#10b981', '#f59e0b'],
        legend: { position: 'bottom', labels: { colors: '#94a3b8' } },
        plotOptions: { pie: { donut: { size: '65%' } } },
        tooltip: { theme: 'dark' },
        dataLabels: { enabled: true, formatter: (val: any) => `${val.toFixed(1)}%` }
      }
      const desaDonutSeries = [60, 40]

      const trendChartOptions = {
        chart: { type: 'line', toolbar: { show: false }, background: 'transparent' },
        stroke: { curve: 'smooth', width: 3 },
        colors: ['#10b981', '#3b82f6', '#8b5cf6'], // Emerald, Blue, Violet
        xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'], labels: { style: { colors: '#94a3b8' } } },
        yaxis: { labels: { style: { colors: '#94a3b8' } } },
        tooltip: { theme: 'dark' },
        markers: { size: 4 },
        legend: { position: 'bottom', labels: { colors: '#94a3b8' } }
      }
      const trendChartSeries = [
        { name: 'Balita', data: [120, 135, 150, 140, 160, 155] },
        { name: 'Ibu Hamil', data: [30, 35, 40, 38, 45, 42] },
        { name: 'Lansia', data: [80, 85, 90, 88, 95, 92] }
      ]

      return (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-sm font-medium text-slate-400">Total Posyandu</p>
              <p className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">05</p>
              <p className="text-xs text-slate-400 mt-1">Di wilayah Desa Anda</p>
            </div>
            <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-sm font-medium text-slate-400">Sudah Input Laporan</p>
              <p className="text-4xl font-bold tracking-tight text-emerald-600 mt-2">03 <span className="text-xl text-slate-300">/ 05</span></p>
              <p className="text-xs text-slate-400 mt-1">Bulan ini</p>
            </div>
            <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-sm font-medium text-slate-400">Total Pengunjung</p>
              <p className="text-4xl font-bold tracking-tight text-blue-600 mt-2">350</p>
              <p className="text-xs text-slate-400 mt-1">Bulan ini</p>
            </div>
            <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-sm font-medium text-slate-400">Sasaran Lansia</p>
              <p className="text-4xl font-bold tracking-tight text-violet-600 mt-2">120</p>
              <p className="text-xs text-slate-400 mt-1">Jiwa terpantau</p>
            </div>
            <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-sm font-medium text-slate-400">Ibu Hamil</p>
              <p className="text-4xl font-bold tracking-tight text-pink-600 mt-2">45</p>
              <p className="text-xs text-slate-400 mt-1">Bulan ini</p>
            </div>
            <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-sm font-medium text-slate-400">Balita</p>
              <p className="text-4xl font-bold tracking-tight text-emerald-600 mt-2">350</p>
              <p className="text-xs text-slate-400 mt-1">Terdata</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-4">Laporan Selesai per Posyandu</h2>
              <div className="h-64">
                <Chart options={desaChartOptions as any} series={desaChartSeries} type="bar" height="100%" />
              </div>
            </div>
            <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-4">Status Input</h2>
              <div className="h-64 flex items-center justify-center">
                <Chart options={desaDonutOptions as any} series={desaDonutSeries} type="donut" height="240" />
              </div>
            </div>
          </div>

          {/* Trends Chart Row */}
          <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-4">Tren Sasaran Bulanan (Balita, Ibu Hamil, Lansia)</h2>
            <div className="h-80">
              <Chart options={trendChartOptions as any} series={trendChartSeries} type="line" height="100%" />
            </div>
          </div>

          {/* Monitoring Table & Last Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-4">Monitoring Input Posyandu</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                      <th className="px-4 py-3 font-medium">Nama Posyandu</th>
                      <th className="px-4 py-3 font-medium">KES-6</th>
                      <th className="px-4 py-3 font-medium">Sosial</th>
                      <th className="px-4 py-3 font-medium text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {[
                      { name: 'Posyandu Mawar', kes6: 'Selesai', sosial: 'Selesai', kes6Color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30', sosialColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
                      { name: 'Posyandu Melati', kes6: 'Pending', sosial: 'Selesai', kes6Color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30', sosialColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
                      { name: 'Posyandu Kenanga', kes6: 'Pending', sosial: 'Pending', kes6Color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30', sosialColor: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
                    ].map((pos) => (
                      <tr key={pos.name}>
                        <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white">{pos.name}</td>
                        <td className="px-4 py-3.5"><span className={`${pos.kes6Color} text-xs font-medium px-2.5 py-1 rounded-full`}>{pos.kes6}</span></td>
                        <td className="px-4 py-3.5"><span className={`${pos.sosialColor} text-xs font-medium px-2.5 py-1 rounded-full`}>{pos.sosial}</span></td>
                        <td className="px-4 py-3.5 text-right">
                          <button onClick={() => setSelectedPosyandu(pos.name)} className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium text-xs">Pantau</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-4">5 Data Input Terakhir</h2>
              <div className="space-y-4">
                {[
                  { posyandu: 'Posyandu 1', type: 'Pendidikan', date: '10 Mei 2026', time: '14:20' },
                  { posyandu: 'Posyandu 3', type: 'SIP 6', date: '10 Mei 2026', time: '12:15' },
                  { posyandu: 'Posyandu 2', type: 'Perumahan', date: '09 Mei 2026', time: '16:45' },
                  { posyandu: 'Posyandu 2', type: 'Trantib', date: '09 Mei 2026', time: '10:30' },
                  { posyandu: 'Posyandu 1', type: 'Sosial', date: '08 Mei 2026', time: '15:00' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-zinc-700 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.posyandu}</p>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Menginput data <span className="font-medium text-emerald-600">{item.type}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{item.date}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }

    // 3. ROLE KECAMATAN (Fungsi: Monitoring Desa)
    if (role === 'ADMIN_KECAMATAN') {
      const dataModules = [
        { title: 'Data KES-6', desc: 'Perkembangan anak & balita', icon: HeartPulse, color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20', slug: 'sip6' },
        { title: 'Data KES-7', desc: 'Ibu hamil & nifas', icon: Heart, color: 'text-pink-500 bg-pink-50 dark:bg-pink-900/20', slug: 'sip7' },
        { title: 'Data Pendidikan', desc: 'Sarana & prasarana', icon: BookOpen, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20', slug: 'pendidikan' },
        { title: 'Data Pekerjaan Umum', desc: 'Infrastruktur umum', icon: Building, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20', slug: 'pekerjaan-umum' },
        { title: 'Data Perumahan', desc: 'Kondisi rumah & sanitasi', icon: Home, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20', slug: 'perumahan' },
        { title: 'Data Trantib', desc: 'Keamanan & ketertiban', icon: Shield, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20', slug: 'trantib' },
        { title: 'Data Sosial', desc: 'Kesejahteraan warga', icon: Users, color: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20', slug: 'sosial' },
      ]

      // Level 3: Detail Posyandu
      if (selectedDesa && selectedPosyandu) {
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={() => setSelectedPosyandu('')}
                  className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors mb-2"
                  title="Kembali ke Daftar Posyandu"
                >
                  <ChevronDown className="w-5 h-5 rotate-90" />
                </button>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
                  Detail {selectedPosyandu}
                </h2>
                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  Desa {selectedDesa} • Wilayah Kecamatan Pekalongan
                </p>
              </div>
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 rounded-full">
                Active
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {dataModules.map((module) => (
                <div key={module.title} className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:shadow-slate-100/50 dark:hover:shadow-none transition-all group">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className={`w-12 h-12 ${module.color} rounded-xl flex items-center justify-center transition-transform group-hover:scale-105`}>
                        <module.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                          {module.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{module.desc}</p>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/${module.slug}`}
                    className="mt-5 w-full py-2.5 bg-slate-50 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-700 dark:text-white hover:text-emerald-600 text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/50"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Lihat Data
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )
      }

      // Level 2: List Posyandu di Desa Terpilih
      if (selectedDesa) {
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={() => setSelectedDesa('')}
                  className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors mb-2"
                  title="Kembali ke Daftar Desa"
                >
                  <ChevronDown className="w-5 h-5 rotate-90" />
                </button>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
                  Daftar Posyandu di Desa {selectedDesa}
                </h2>
                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  Memantau progress input data posyandu.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                      <th className="px-4 py-3 font-medium">Nama Posyandu</th>
                      <th className="px-4 py-3 font-medium">Desa</th>
                      <th className="px-4 py-3 font-medium">Status KES-6</th>
                      <th className="px-4 py-3 font-medium">Status Sosial</th>
                      <th className="px-4 py-3 font-medium text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    <tr>
                      <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">Posyandu Mawar</td>
                      <td className="px-4 py-4 text-slate-500 dark:text-zinc-400">{selectedDesa}</td>
                      <td className="px-4 py-4"><span className="text-emerald-600 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">Selesai</span></td>
                      <td className="px-4 py-4"><span className="text-emerald-600 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">Selesai</span></td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => setSelectedPosyandu('Posyandu Mawar')}
                          className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium text-xs"
                        >
                          Pantau
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">Posyandu Melati</td>
                      <td className="px-4 py-4 text-slate-500 dark:text-zinc-400">{selectedDesa}</td>
                      <td className="px-4 py-4"><span className="text-amber-600 text-xs font-medium bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-full">Pending</span></td>
                      <td className="px-4 py-4"><span className="text-emerald-600 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">Selesai</span></td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => setSelectedPosyandu('Posyandu Melati')}
                          className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium text-xs"
                        >
                          Pantau
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      }

      // ApexCharts Options
      const categoryChartOptions = {
        chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
        plotOptions: { bar: { borderRadius: 4, horizontal: false, columnWidth: '55%' } },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: { categories: ['Pendidikan', 'Pekerjaan Umum', 'Perumahan', 'Trantib', 'Sosial'], labels: { style: { colors: '#94a3b8' } } },
        yaxis: { title: { text: 'Jumlah Laporan', style: { color: '#94a3b8' } }, labels: { style: { colors: '#94a3b8' } } },
        fill: { opacity: 1, colors: ['#10b981'] },
        tooltip: { theme: 'dark', y: { formatter: (val: any) => `${val} Laporan` } },
        theme: { mode: 'light' }
      }
      const categoryChartSeries = [{ name: 'Laporan', data: [44, 55, 41, 67, 22] }]

      const donutChartOptions = {
        chart: { type: 'donut', background: 'transparent' },
        labels: ['Selesai', 'Proses', 'Belum'],
        colors: ['#10b981', '#f59e0b', '#ef4444'],
        legend: { position: 'bottom', labels: { colors: '#94a3b8' } },
        plotOptions: { pie: { donut: { size: '65%' } } },
        tooltip: { theme: 'dark' },
        dataLabels: { enabled: true, formatter: (val: any) => `${val.toFixed(1)}%` }
      }
      const donutChartSeries = [60, 25, 15]

      const trendChartOptions = {
        chart: { type: 'line', toolbar: { show: false }, background: 'transparent' },
        stroke: { curve: 'smooth', width: 3 },
        colors: ['#10b981', '#3b82f6', '#8b5cf6'], // Emerald, Blue, Violet
        xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'], labels: { style: { colors: '#94a3b8' } } },
        yaxis: { labels: { style: { colors: '#94a3b8' } } },
        tooltip: { theme: 'dark' },
        markers: { size: 4 },
        legend: { position: 'bottom', labels: { colors: '#94a3b8' } }
      }
      const trendChartSeries = [
        { name: 'Balita', data: [120, 135, 150, 140, 160, 155] },
        { name: 'Ibu Hamil', data: [30, 35, 40, 38, 45, 42] },
        { name: 'Lansia', data: [80, 85, 90, 88, 95, 92] }
      ]

      return (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-sm font-medium text-slate-400">Total Desa</p>
              <p className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">12</p>
              <p className="text-xs text-slate-400 mt-1">Di wilayah Kecamatan Anda</p>
            </div>
            <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-sm font-medium text-slate-400">Total Posyandu</p>
              <p className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">60</p>
              <p className="text-xs text-slate-400 mt-1">Tersebar di semua desa</p>
            </div>
            <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-sm font-medium text-slate-400">Sasaran Lansia</p>
              <p className="text-4xl font-bold tracking-tight text-emerald-600 mt-2">1,240</p>
              <p className="text-xs text-slate-400 mt-1">Jiwa terpantau</p>
            </div>
            <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-sm font-medium text-slate-400">Desa Selesai Laporan</p>
              <p className="text-4xl font-bold tracking-tight text-emerald-600 mt-2">08 <span className="text-xl text-slate-300">/ 12</span></p>
              <p className="text-xs text-slate-400 mt-1">Bulan ini</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-4">Laporan Per Kategori</h2>
              <div className="h-80">
                <Chart options={categoryChartOptions as any} series={categoryChartSeries} type="bar" height="100%" />
              </div>
            </div>

            {/* Donut Chart */}
            <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-4">Persentase Penyelesaian</h2>
              <div className="h-80 flex items-center justify-center">
                <Chart options={donutChartOptions as any} series={donutChartSeries} type="donut" height="320" />
              </div>
            </div>
          </div>

          {/* Trends Chart Row */}
          <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-4">Tren Sasaran Bulanan (Balita, Ibu Hamil, Lansia)</h2>
            <div className="h-80">
              <Chart options={trendChartOptions as any} series={trendChartSeries} type="line" height="100%" />
            </div>
          </div>

          {/* Two Columns: List Desa & Last 5 Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* List Desa */}
            <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-4">Daftar Desa & Progress</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                      <th className="px-4 py-3 font-medium">Nama Desa</th>
                      <th className="px-4 py-3 font-medium">Progress</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {[
                      { name: 'Desa Adijaya', progress: '5/5 Posyandu', status: 'Selesai', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
                      { name: 'Desa Adirejo', progress: '3/5 Posyandu', status: 'Proses', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
                      { name: 'Desa Ganti Warno', progress: '0/4 Posyandu', status: 'Belum', color: 'text-slate-600 bg-slate-50 dark:bg-zinc-700/50' },
                      { name: 'Desa Gantimulyo', progress: '4/4 Posyandu', status: 'Selesai', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
                      { name: 'Desa Gondangrejo', progress: '2/5 Posyandu', status: 'Proses', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
                      { name: 'Desa Jojog', progress: '1/4 Posyandu', status: 'Proses', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
                      { name: 'Desa Kalibening', progress: '3/3 Posyandu', status: 'Selesai', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
                      { name: 'Desa Sidodadi', progress: '0/5 Posyandu', status: 'Belum', color: 'text-slate-600 bg-slate-50 dark:bg-zinc-700/50' },
                    ].map((desa) => (
                      <tr key={desa.name}>
                        <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white">{desa.name}</td>
                        <td className="px-4 py-3.5 text-slate-500 dark:text-zinc-400">{desa.progress}</td>
                        <td className="px-4 py-3.5"><span className={`${desa.color} text-xs font-medium px-2.5 py-1 rounded-full`}>{desa.status}</span></td>
                        <td className="px-4 py-3.5 text-right">
                          <button onClick={() => setSelectedDesa(desa.name)} className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium text-xs">Pantau</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Last 5 Data */}
            <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-4">5 Data Input Terakhir</h2>
              <div className="space-y-4">
                {[
                  { desa: 'Desa Adijaya', posyandu: 'Posyandu 1', type: 'Pendidikan', date: '10 Mei 2026', time: '14:20' },
                  { desa: 'Desa Adirejo', posyandu: 'Posyandu 3', type: 'SIP 6', date: '10 Mei 2026', time: '12:15' },
                  { desa: 'Desa Gantimulyo', posyandu: 'Posyandu 2', type: 'Perumahan', date: '09 Mei 2026', time: '16:45' },
                  { desa: 'Desa Adijaya', posyandu: 'Posyandu 2', type: 'Trantib', date: '09 Mei 2026', time: '10:30' },
                  { desa: 'Desa Siraman', posyandu: 'Posyandu 1', type: 'Sosial', date: '08 Mei 2026', time: '15:00' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-zinc-700 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.desa} <span className="text-xs font-normal text-slate-400">({item.posyandu})</span></p>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Menginput data <span className="font-medium text-emerald-600">{item.type}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{item.date}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }

    // 4. ROLE KABUPATEN & SUPERADMIN (Fungsi: Statistik Global)
    // ApexCharts Options for Kabupaten
    const kabKecChartOptions = {
      chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
      plotOptions: { bar: { borderRadius: 4, horizontal: false, columnWidth: '55%' } },
      dataLabels: { enabled: false },
      xaxis: { categories: ['Pekalongan', 'Batanghari', 'Metro Kibang', 'Sekampung', 'Jabung'], labels: { style: { colors: '#94a3b8' } } },
      yaxis: { labels: { style: { colors: '#94a3b8' } } },
      fill: { opacity: 1, colors: ['#10b981'] },
      tooltip: { theme: 'dark' }
    }
    const kabKecChartSeries = [{ name: 'Laporan Selesai', data: [130, 110, 90, 115, 70] }]

    const kabTrendOptions = {
      chart: { type: 'line', toolbar: { show: false }, background: 'transparent' },
      stroke: { curve: 'smooth', width: 3 },
      colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
      xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei'], labels: { style: { colors: '#94a3b8' } } },
      yaxis: { labels: { style: { colors: '#94a3b8' } } },
      tooltip: { theme: 'dark' },
      markers: { size: 4 },
      legend: { position: 'bottom', labels: { colors: '#94a3b8' } }
    }
    const kabTrendSeries = [
      { name: 'Total Pengunjung', data: [10000, 11000, 10500, 12000, 12400] },
      { name: 'Balita', data: [2000, 2200, 2100, 2300, 2400] },
      { name: 'Ibu Hamil', data: [500, 550, 520, 580, 600] },
      { name: 'Lansia', data: [1200, 1300, 1250, 1350, 1400] }
    ]

    const kabDonutOptions = {
      chart: { type: 'donut', background: 'transparent' },
      labels: ['Selesai', 'Proses', 'Belum'],
      colors: ['#10b981', '#f59e0b', '#ef4444'],
      legend: { position: 'bottom', labels: { colors: '#94a3b8' } },
      plotOptions: { pie: { donut: { size: '65%' } } },
      tooltip: { theme: 'dark' },
      dataLabels: { enabled: true, formatter: (val: any) => `${val.toFixed(1)}%` }
    }
    const kabDonutSeries = [55, 30, 15]

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Posyandu', value: '240', desc: 'Di 24 Kecamatan', color: 'text-emerald-600' },
            { label: 'Total Pengunjung', value: '12.400', desc: 'Bulan ini', color: 'text-blue-600' },
            { label: 'Laporan Selesai', value: '1.450', desc: 'Bulan ini', color: 'text-teal-600' },
            { label: 'Total User', value: '350', desc: 'Semua level', color: 'text-violet-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-sm font-medium text-slate-400">{stat.label}</p>
              <p className={`text-4xl font-bold tracking-tight ${stat.color} mt-2`}>{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-4">Aktivitas Laporan per Kecamatan</h2>
            <div className="h-80">
              <Chart options={kabKecChartOptions as any} series={kabKecChartSeries} type="bar" height="100%" />
            </div>
          </div>
          <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-4">Status Laporan Global</h2>
            <div className="h-80 flex items-center justify-center">
              <Chart options={kabDonutOptions as any} series={kabDonutSeries} type="donut" height="320" />
            </div>
          </div>
        </div>

        {/* Charts Row 2 & Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-4">Tren Pengunjung Bulanan</h2>
            <div className="h-64">
              <Chart options={kabTrendOptions as any} series={kabTrendSeries} type="line" height="100%" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-4">Progress Kecamatan</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <th className="px-4 py-3 font-medium">Kecamatan</th>
                    <th className="px-4 py-3 font-medium">Desa Selesai</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {[
                    { name: 'Pekalongan', progress: '10/12 Desa', status: 'Hampir Selesai', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
                    { name: 'Batanghari', progress: '8/15 Desa', status: 'Proses', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
                    { name: 'Metro Kibang', progress: '5/7 Desa', status: 'Proses', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
                  ].map((kec) => (
                    <tr key={kec.name}>
                      <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white">{kec.name}</td>
                      <td className="px-4 py-3.5 text-slate-500 dark:text-zinc-400">{kec.progress}</td>
                      <td className="px-4 py-3.5"><span className={`${kec.color} text-xs font-medium px-2.5 py-1 rounded-full`}>{kec.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 font-sans antialiased">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Dashboard
            </h1>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 rounded-full">
              {role}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 font-light">
            Selamat datang kembali. Berikut adalah ringkasan data wilayah Anda.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Periode</span>
          <select className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer shadow-sm">
            <option>Mei 2026</option>
            <option>April 2026</option>
          </select>
        </div>
      </div>

      {/* DEPENDENT DROPDOWNS (WILAYAH) - Ultra Minimalist */}
      {(role === 'SUPERADMIN' || role === 'ADMIN_KABUPATEN' || role === 'ADMIN_KECAMATAN') && (
        <div className="bg-white dark:bg-[#111827] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-700 dark:text-white uppercase tracking-wider">Filter Wilayah</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Dropdown Kecamatan */}
            {(role === 'SUPERADMIN' || role === 'ADMIN_KABUPATEN') && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">Kecamatan</label>
                <div className="relative">
                  <select
                    value={selectedKec}
                    onChange={handleKecChange}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl text-sm font-medium text-slate-700 dark:text-white focus:outline-none appearance-none transition-all cursor-pointer"
                  >
                    <option value="">Pilih Kecamatan...</option>
                    {regionData.map(k => (
                      <option key={k.kode} value={k.name}>{k.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Dropdown Desa */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Desa/Kelurahan</label>
              <div className="relative">
                <select
                  value={selectedDesa}
                  onChange={handleDesaChange}
                  disabled={role !== 'ADMIN_KECAMATAN' && !selectedKec}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl text-sm font-medium text-slate-700 dark:text-white focus:outline-none appearance-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Pilih Desa...</option>
                  {availableDesas.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Dropdown Posyandu */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Posyandu</label>
              <div className="relative">
                <select
                  value={selectedPosyandu}
                  onChange={(e) => setSelectedPosyandu(e.target.value)}
                  disabled={!selectedDesa}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl text-sm font-medium text-slate-700 dark:text-white focus:outline-none appearance-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Pilih Posyandu...</option>
                  {availablePosyandus.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Based on Role */}
      {renderDashboardContent()}
    </div>
  )
}
