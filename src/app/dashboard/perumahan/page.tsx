'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, Plus, Search, Edit2, Trash2, Filter, 
  ChevronDown, X, Check, Clock, AlertTriangle,
  ArrowLeft, Download, FileText, CheckCircle
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import ExcelJS from 'exceljs'

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

const defaultPRSeeds = [
  { id: 'pr-1', tanggal: '2026-01-09', posyandu: 'Segar', nama: 'Fajar Yanuri', nik: '1807040101800007', alamat: 'RT 014/005', fcKK: true, fcKTP: true, sp: false, suketPenghasilan: false, fotoRumah: true, status: 'TL' },
  { id: 'pr-2', tanggal: '2026-01-13', posyandu: 'Mulia', nama: 'Agus Yulianto', nik: '1807040907760005', alamat: 'RT 002/001', fcKK: true, fcKTP: true, sp: false, suketPenghasilan: false, fotoRumah: true, status: 'TL' },
  { id: 'pr-3', tanggal: '2026-03-17', posyandu: 'Lestari', nama: 'Amirul Mukminin', nik: '1807042102720004', alamat: 'RT 018/007', fcKK: true, fcKTP: true, sp: false, suketPenghasilan: false, fotoRumah: true, status: 'TL' },
  { id: 'pr-4', tanggal: '2025-03-09', posyandu: 'Segar', nama: 'Ari Widodo', nik: '1807041409780004', alamat: 'RT 012/005', fcKK: true, fcKTP: true, sp: false, suketPenghasilan: false, fotoRumah: true, status: 'TL' },
  { id: 'pr-5', tanggal: '2025-03-11', posyandu: 'Utama', nama: 'Slamet Riadi', nik: '1807042107540004', alamat: 'RT 009/005', fcKK: true, fcKTP: true, sp: false, suketPenghasilan: false, fotoRumah: true, status: 'BTL' },
  { id: 'pr-6', tanggal: '2025-03-13', posyandu: 'Mulia', nama: 'Sukartinah', nik: '1807045606660009', alamat: 'RT 004/001', fcKK: true, fcKTP: true, sp: false, suketPenghasilan: false, fotoRumah: true, status: 'BTL' },
  { id: 'pr-7', tanggal: '2025-03-15', posyandu: 'Giat', nama: 'Suratno', nik: '1807040112600002', alamat: 'RT 017/006', fcKK: true, fcKTP: true, sp: false, suketPenghasilan: false, fotoRumah: true, status: 'BTL' }
]

export default function PerumahanPage() {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role
  const isPosyandu = role === 'OPERATOR_POSYANDU'
  const canEdit = role === 'OPERATOR_DESA' || role === 'SUPERADMIN'

  const theme = {
    bgGradient: isPosyandu ? 'from-[var(--dash-primary)] to-[var(--dash-primary)]' : 'from-[var(--dash-primary)] to-[var(--dash-primary)]',
    hoverGradient: 'hover:opacity-90',
    shadow: 'shadow-none',
    focusBorder: isPosyandu ? 'focus:border-purple-500' : 'focus:border-purple-500',
    focusRing: isPosyandu ? 'focus:ring-purple-500/25 focus:border-purple-400/10' : 'focus:ring-purple-500/25 focus:border-purple-400/10',
    text: isPosyandu ? 'text-purple-600' : 'text-purple-600',
    bgLight: isPosyandu ? 'bg-purple-50' : 'bg-purple-50',
    textLight: isPosyandu ? 'text-purple-700' : 'text-purple-700',
    activeRing: isPosyandu ? 'focus:ring-purple-500/25 focus:border-purple-400' : 'focus:ring-purple-500/25 focus:border-purple-400',
  }

  const [kecamatans, setKecamatans] = useState<any[]>([])
  const [desas, setDesas] = useState<any[]>([])
  const [posyandus, setPosyandus] = useState<any[]>([])

  const [selectedKecamatanId, setSelectedKecamatanId] = useState('')
  const [selectedDesaId, setSelectedDesaId] = useState('')
  const [selectedPosyanduId, setSelectedPosyanduId] = useState('')

  const [selectedKecamatan, setSelectedKecamatan] = useState('')
  const [selectedDesa, setSelectedDesa] = useState('')
  const [selectedPosyandu, setSelectedPosyandu] = useState('')

  const [selectedTahun, setSelectedTahun] = useState(2026)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [reports, setReports] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [namaDesa, setNamaDesa] = useState('Tulusrejo')
  const [uploadedFile, setUploadedFile] = useState<{ id: string; fileName: string; filePath: string } | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTahun = localStorage.getItem('sip_tahun_aktif') || '2026'
    setSelectedTahun(parseInt(savedTahun))

    const fetchKecamatans = async () => {
      try {
        const res = await fetch('/api/kecamatan')
        if (res.ok) {
          const data = await res.json()
          setKecamatans(data)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchKecamatans()
  }, [])

  useEffect(() => {
    if (!mounted || !session?.user) return

    const userKecamatanId = (session.user as any).kecamatanId
    const userKecamatanNama = (session.user as any).kecamatanNama
    const userDesaId = (session.user as any).desaId
    const userDesaNama = (session.user as any).desaNama || (session.user?.name || '').replace('Admin Desa ', '')
    const userPosyanduId = (session.user as any).posyanduId
    const userPosyanduNama = (session.user as any).posyanduNama

    if (role === 'SUPERADMIN') {
      // Level 0
    } else if (role === 'ADMIN_KECAMATAN') {
      if (userKecamatanId) {
        setSelectedKecamatanId(userKecamatanId)
        setSelectedKecamatan(userKecamatanNama || '')
      }
    } else if (role === 'OPERATOR_DESA') {
      if (userKecamatanId) {
        setSelectedKecamatanId(userKecamatanId)
        setSelectedKecamatan(userKecamatanNama || '')
      }
      if (userDesaId) {
        setSelectedDesaId(userDesaId)
        setSelectedDesa(userDesaNama || '')
        setNamaDesa(userDesaNama || '')
      }
    } else if (role === 'OPERATOR_POSYANDU') {
      if (userKecamatanId) {
        setSelectedKecamatanId(userKecamatanId)
        setSelectedKecamatan(userKecamatanNama || '')
      }
      if (userDesaId) {
        setSelectedDesaId(userDesaId)
        setSelectedDesa(userDesaNama || '')
        setNamaDesa(userDesaNama || '')
      }
      if (userPosyanduId) {
        setSelectedPosyanduId(userPosyanduId)
        setSelectedPosyandu(userPosyanduNama || '')
      }
    }
  }, [mounted, session, role])

  useEffect(() => {
    if (!selectedKecamatanId) {
      setDesas([])
      return
    }
    const fetchDesas = async () => {
      try {
        const res = await fetch(`/api/desa?kecamatanId=${selectedKecamatanId}`)
        if (res.ok) {
          const data = await res.json()
          setDesas(data)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchDesas()
  }, [selectedKecamatanId])

  useEffect(() => {
    if (!selectedDesaId) {
      setPosyandus([])
      return
    }
    const fetchPosyandus = async () => {
      try {
        const res = await fetch(`/api/posyandu?desaId=${selectedDesaId}`)
        if (res.ok) {
          const data = await res.json()
          setPosyandus(data)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchPosyandus()
  }, [selectedDesaId])

  useEffect(() => {
    if (selectedPosyanduId) {
      fetchReports(selectedPosyanduId, selectedTahun)
    } else {
      setReports([])
    }
  }, [selectedPosyanduId, selectedTahun])

  const fetchReports = async (pId: string, yr: number) => {
    if (!pId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/dashboard/perumahan?posyanduId=${pId}&tahun=${yr}`)
      if (res.ok) {
        const data = await res.json()
        setReports(data.map((r: any) => ({
          id: r.id,
          tanggal: r.tanggal ? new Date(r.tanggal).toISOString().split('T')[0] : '',
          posyandu: selectedPosyandu,
          nama: r.nama || '',
          nik: r.nik || '',
          alamat: r.alamat || '',
          fcKK: r.fcKK || false,
          fcKTP: r.fcKTP || false,
          sp: r.suratPermohonan || false,
          suketPenghasilan: r.suketPenghasilan || false,
          fotoRumah: r.fotoKondisiRumah || false,
          keteranganTL: r.keteranganTL || '',
          keteranganBTL: r.keteranganBTL || '',
          status: r.status || 'BTL',
          dataDukungs: r.dataDukungs || []
        })))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleTahunChange = (year: number) => {
    setSelectedTahun(year)
    localStorage.setItem('sip_tahun_aktif', year.toString())
  }
  
  const initialForm = { tanggal: '', nama: '', nik: '', alamat: '', status: 'TL', fcKK: false, fcKTP: false, sp: false, suketPenghasilan: false, fotoRumah: false, posyandu: 'Segar', keteranganTL: '', keteranganBTL: '' }
  const [formData, setFormData] = useState(initialForm)
  const [editId, setEditId] = useState<string | null>(null)

  const handleEdit = (report: any) => {
    setFormData({
      tanggal: report.tanggal,
      nama: report.nama,
      nik: report.nik || '',
      alamat: report.alamat || '',
      status: report.status || 'TL',
      fcKK: report.fcKK || false,
      fcKTP: report.fcKTP || false,
      sp: report.sp || false,
      suketPenghasilan: report.suketPenghasilan || false,
      fotoRumah: report.fotoRumah || false,
      posyandu: report.posyandu || 'Segar',
      keteranganTL: report.keteranganTL || '',
      keteranganBTL: report.keteranganBTL || ''
    })
    if (report.dataDukungs && report.dataDukungs.length > 0) {
      setUploadedFile(report.dataDukungs[0])
    } else {
      setUploadedFile(null)
    }
    setEditId(report.id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const res = await fetch(`/api/dashboard/perumahan?id=${id}`, {
          method: 'DELETE'
        })
        if (res.ok) {
          const currentPosyanduId = isPosyandu ? (session?.user as any)?.posyanduId : selectedPosyanduId
          fetchReports(currentPosyanduId, selectedTahun)
        } else {
          alert('Gagal menghapus data')
        }
      } catch (err) {
        console.error(err)
        alert('Gagal menghubungi server')
      }
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const file = files[0]

    setUploading(true)
    const fData = new FormData()
    fData.append('file', file)
    fData.append('bidang', 'PR')
    if (selectedPosyanduId) {
      fData.append('posyanduId', selectedPosyanduId)
    }

    try {
      const res = await fetch('/api/data-dukung', {
        method: 'POST',
        body: fData,
      })

      if (res.ok) {
        const result = await res.json()
        setUploadedFile(result.dataDukung)
      } else {
        const err = await res.json()
        alert('Gagal mengunggah berkas: ' + (err.error || 'Terjadi kesalahan'))
      }
    } catch (err) {
      console.error(err)
      alert('Gagal mengunggah berkas ke server')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.nik && (!/^\d{16}$/.test(formData.nik))) {
      alert('NIK harus berupa 16 digit angka cuy!')
      return
    }

    const targetPos = posyandus.find(p => p.nama === formData.posyandu) || posyandus[0]
    const currentPosyanduId = isPosyandu ? (session?.user as any)?.posyanduId : (targetPos?.id || selectedPosyanduId)

    try {
      const res = await fetch('/api/dashboard/perumahan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editId,
          posyanduId: currentPosyanduId,
          tanggal: formData.tanggal,
          nama: formData.nama,
          nik: formData.nik,
          alamat: formData.alamat,
          fcKK: formData.fcKK,
          fcKTP: formData.fcKTP,
          sp: formData.sp,
          suketPenghasilan: formData.suketPenghasilan,
          fotoRumah: formData.fotoRumah,
          status: formData.status,
          keteranganTL: formData.keteranganTL,
          keteranganBTL: formData.keteranganBTL,
          dataDukungId: uploadedFile?.id || null
        })
      })

      if (res.ok) {
        setIsModalOpen(false)
        setFormData(initialForm)
        setUploadedFile(null)
        setEditId(null)
        fetchReports(currentPosyanduId, selectedTahun)
      } else {
        const errData = await res.json()
        alert('Gagal menyimpan data: ' + (errData.error || 'Terjadi kesalahan'))
      }
    } catch (err) {
      console.error(err)
      alert('Gagal menghubungi server')
    }
  }

  const handleAdd = () => {
    const defaultPName = isPosyandu ? (selectedPosyandu || 'Segar') : (posyandus[0]?.nama || 'Segar')
    setFormData({ ...initialForm, posyandu: defaultPName })
    setUploadedFile(null)
    setEditId(null)
    setIsModalOpen(true)
  }

  // Export Excel bertingkat
  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('PR')

    worksheet.columns = [
      { key: 'no', width: 6 },
      { key: 'tanggal', width: 14 },
      { key: 'posyandu', width: 14 },
      { key: 'nama', width: 22 },
      { key: 'nik', width: 25 },
      { key: 'alamat', width: 20 },
      { key: 'fcKK', width: 8 },
      { key: 'fcKTP', width: 8 },
      { key: 'sp', width: 8 },
      { key: 'suketPenghasilan', width: 15 },
      { key: 'fotoRumah', width: 15 },
      { key: 'tl', width: 10 },
      { key: 'btl', width: 10 }
    ]

    // Row 1: Title
    worksheet.mergeCells('A1:M1')
    const r1 = worksheet.getCell('A1')
    r1.value = 'BIDANG PERUMAHAN RAKYAT'
    r1.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } }
    r1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } } as any
    r1.alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getRow(1).height = 35

    // Row 2: Subtitle
    worksheet.mergeCells('A2:M2')
    const r2 = worksheet.getCell('A2')
    r2.value = `DESA : ${namaDesa.toUpperCase()}`
    r2.font = { name: 'Arial', size: 11, bold: true }
    r2.alignment = { vertical: 'middle', horizontal: 'left' }
    worksheet.getRow(2).height = 25

    // Row 3: Empty
    worksheet.getRow(3).height = 15

    // Row 4-5: Header
    worksheet.getRow(4).values = ['No', 'Tanggal', 'Posyandu', 'Nama', 'NIK', 'Alamat', 'Persyaratan', '', '', '', '', 'Tindaklanjut', '']
    worksheet.getRow(5).values = ['', '', '', '', '', '', 'FC KK', 'FC KTP', 'SP*', 'Suket Penghasilan', 'Foto Kondisi Rumah', 'TL', 'BTL']

    worksheet.mergeCells('A4:A5')
    worksheet.mergeCells('B4:B5')
    worksheet.mergeCells('C4:C5')
    worksheet.mergeCells('D4:D5')
    worksheet.mergeCells('E4:E5')
    worksheet.mergeCells('F4:F5')
    worksheet.mergeCells('G4:K4') // Persyaratan spans 5 columns
    worksheet.mergeCells('L4:M4') // Tindaklanjut spans 2 columns

    const yellowFill: any = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFC4' } }
    const borderAll: any = {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } }
    }

    const headerRows = [4, 5]
    headerRows.forEach(rowNum => {
      const r = worksheet.getRow(rowNum)
      r.height = 20
      r.eachCell(c => {
        c.font = { name: 'Arial', size: 10, bold: true }
        c.fill = yellowFill
        c.border = borderAll
        c.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
      })
    })

    // Row 6: Column numbers (1-13)
    worksheet.getRow(6).values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    worksheet.getRow(6).height = 18
    const greyFill: any = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } }
    worksheet.getRow(6).eachCell(c => {
      c.font = { name: 'Arial', size: 9, bold: true }
      c.fill = greyFill
      c.border = borderAll
      c.alignment = { vertical: 'middle', horizontal: 'center' }
    })

    // Filter
    const filtered = reports.filter(r => {
      const matchSearch = r.nama.toLowerCase().includes(search.toLowerCase())
      if (isPosyandu) return r.posyandu === selectedPosyandu && matchSearch
      if (selectedPosyandu) return r.posyandu === selectedPosyandu && matchSearch
      return matchSearch
    })

    // Row 7+: Data rows
    filtered.forEach((r, idx) => {
      const rowIdx = 7 + idx
      const row = worksheet.getRow(rowIdx)
      row.values = [
        idx + 1,
        r.tanggal,
        r.posyandu,
        r.nama,
        r.nik,
        r.alamat,
        r.fcKK ? 'v' : '',
        r.fcKTP ? 'v' : '',
        r.sp ? 'v' : '',
        r.suketPenghasilan ? 'v' : '',
        r.fotoRumah ? 'v' : '',
        r.status === 'TL' ? 'TL' : '',
        r.status === 'BTL' ? 'BTL' : ''
      ]
      row.height = 20
      row.eachCell((c, colNum) => {
        c.font = { name: 'Arial', size: 10 }
        c.border = borderAll
        if (colNum === 5) { // NIK rata kiri, paksa format teks
          c.numFmt = '@'
          c.alignment = { vertical: 'middle', horizontal: 'left' }
        } else if (colNum >= 7 && colNum <= 13) {
          c.alignment = { vertical: 'middle', horizontal: 'center' }
        } else if (typeof c.value === 'number') {
          c.alignment = { vertical: 'middle', horizontal: 'right' }
        } else {
          c.alignment = { vertical: 'middle', horizontal: 'left' }
        }
      })
    })

    // Baris TOTAL di paling bawah
    const totalRowIdx = 7 + filtered.length
    worksheet.mergeCells(`A${totalRowIdx}:L${totalRowIdx}`)
    const totalRow = worksheet.getRow(totalRowIdx)
    totalRow.height = 22
    totalRow.getCell(1).value = 'TOTAL LAPORAN'
    totalRow.getCell(1).font = { name: 'Arial', size: 10, bold: true }
    totalRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' }
    totalRow.getCell(13).value = filtered.length
    totalRow.getCell(13).font = { name: 'Arial', size: 10, bold: true }
    totalRow.getCell(13).alignment = { vertical: 'middle', horizontal: 'center' }
    for (let col = 1; col <= 13; col++) {
      totalRow.getCell(col).border = borderAll
      totalRow.getCell(col).fill = greyFill
    }

    // Auto fit
    worksheet.columns.forEach(col => {
      let maxLen = 0
      col.eachCell?.({ includeEmpty: true }, c => {
        const valStr = c.value ? c.value.toString() : ''
        if (valStr.length > maxLen) maxLen = valStr.length
      })
      col.width = Math.max(maxLen + 4, 10)
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `PR_${namaDesa.toUpperCase()}.xlsx`
    link.click()
  }

  // Export CSV flat
  const handleExportCSV = () => {
    const csvHeaders = ['NO', 'TANGGAL', 'POSYANDU', 'NAMA', 'NIK', 'ALAMAT', 'FC_KK', 'FC_KTP', 'SP', 'SUKET_PENGHASILAN', 'FOTO_KONDISI_RUMAH', 'KET_TL', 'KET_BTL']
    const filtered = reports.filter(r => {
      const matchSearch = r.nama.toLowerCase().includes(search.toLowerCase())
      if (isPosyandu) return r.posyandu === selectedPosyandu && matchSearch
      if (selectedPosyandu) return r.posyandu === selectedPosyandu && matchSearch
      return matchSearch
    })

    const rows = filtered.map((r, idx) => {
      return [
        idx + 1,
        `"${r.tanggal}"`,
        `"${r.posyandu}"`,
        `"${r.nama.replace(/"/g, '""')}"`,
        `"${r.nik}"`,
        `"${(r.alamat || '').replace(/"/g, '""')}"`,
        `"${r.fcKK ? 'v' : ''}"`,
        `"${r.fcKTP ? 'v' : ''}"`,
        `"${r.sp ? 'v' : ''}"`,
        `"${r.suketPenghasilan ? 'v' : ''}"`,
        `"${r.fotoRumah ? 'v' : ''}"`,
        `"${r.status === 'TL' ? 'TL' : ''}"`,
        `"${r.status === 'BTL' ? 'BTL' : ''}"`
      ].join(',')
    })

    const csvContent = [csvHeaders.join(','), ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `PR_${namaDesa.toUpperCase()}.csv`
    link.click()
  }

  const filteredReports = reports.filter(r => {
    const matchSearch = r.nama.toLowerCase().includes(search.toLowerCase())
    if (isPosyandu) return r.posyandu === selectedPosyandu && matchSearch
    if (selectedPosyandu) return r.posyandu === selectedPosyandu && matchSearch
    return matchSearch
  })

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        {!isPosyandu && (
          <div>
            <h1 className="text-2xl font-bold text-[var(--dash-text)]">Data Hasil Kegiatan Perumahan Rakyat</h1>
            <p className="text-[var(--dash-text-soft)] text-sm">Sistem Informasi Posyandu (Perumahan Rakyat) - Desa {namaDesa}</p>
          </div>
        )}
      </div>

      {(isPosyandu || (selectedDesa && selectedPosyandu)) ? (
        // Level 3: Detail Posyandu (Laporan)
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              {!isPosyandu && (
                <button 
                  onClick={() => {
                    setSelectedPosyandu('')
                    setSelectedPosyanduId('')
                  }}
                  className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors mb-2"
                  title="Kembali ke Daftar Posyandu"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h1 className="text-2xl font-bold text-[var(--dash-text)]">Laporan Perumahan Rakyat</h1>
              <p className="text-[var(--dash-text-soft)] text-sm">
                {isPosyandu ? 'Permohonan & Aspirasi Bidang Perumahan Rakyat' : `Permohonan & Aspirasi Bidang Perumahan Rakyat - ${selectedPosyandu}`}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Year tabs */}
              <div className="flex bg-slate-100 dark:bg-[#202020] p-1 rounded-lg border border-slate-200 dark:border-white/10">
                <button
                  onClick={() => handleTahunChange(2025)}
                  className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                    selectedTahun === 2025
                      ? 'bg-white dark:bg-[#2f2f2f] text-[var(--dash-text)]'
                      : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white'
                  }`}
                >
                  2025
                </button>
                <button
                  onClick={() => handleTahunChange(2026)}
                  className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                    selectedTahun === 2026
                      ? 'bg-white dark:bg-[#2f2f2f] text-[var(--dash-text)]'
                      : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white'
                  }`}
                >
                  2026
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleExportCSV}
                  className="bg-white dark:bg-[#202020] text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-white/10 font-semibold py-2.5 px-4 rounded-md hover:bg-slate-50 dark:hover:bg-zinc-900/20 transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Export CSV
                </button>
                <button
                  onClick={handleExportExcel}
                  className="bg-white dark:bg-[#202020] text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 font-semibold py-2.5 px-4 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Export Excel
                </button>
                {canEdit && (
                  <button
                    onClick={handleAdd}
                    className={`bg-gradient-to-r ${theme.bgGradient} text-white font-semibold py-2.5 px-4 rounded-md ${theme.hoverGradient} transition-all ${theme.shadow} flex items-center justify-center gap-2`}
                  >
                    <Plus className="w-5 h-5" />
                    Tambah Laporan
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-[#202020] p-4 rounded-lg border border-slate-200 dark:border-white/10">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full bg-slate-50 dark:bg-[#2f2f2f]/50 border border-slate-200 dark:border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-[var(--dash-text)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 transition-all"
                placeholder="Cari nama pemohon..."
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-[#202020] rounded-lg border border-slate-200 dark:border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-[var(--dash-text-soft)]">
                <thead className="text-[11px] uppercase tracking-wider bg-transparent text-slate-500 dark:text-white/50 border-b border-slate-200/70 dark:border-white/10">
                  <tr className="border-b border-slate-200 dark:border-white/10">
                    <th rowSpan={2} className="px-4 py-3 border-r border-slate-200 dark:border-white/10 text-center">No</th>
                    <th rowSpan={2} className="px-4 py-3 border-r border-slate-200 dark:border-white/10 text-center">Tanggal</th>
                    <th rowSpan={2} className="px-4 py-3 border-r border-slate-200 dark:border-white/10 text-center">Posyandu</th>
                    <th rowSpan={2} className="px-4 py-3 border-r border-slate-200 dark:border-white/10 text-center">Nama</th>
                    <th rowSpan={2} className="px-4 py-3 border-r border-slate-200 dark:border-white/10 text-center">NIK</th>
                    <th rowSpan={2} className="px-4 py-3 border-r border-slate-200 dark:border-white/10 text-center">Alamat</th>
                    <th colSpan={5} className="px-4 py-2 border-r border-slate-200 dark:border-white/10 text-center bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-200">Persyaratan</th>
                    <th rowSpan={2} className="px-4 py-3 border-r border-slate-200 dark:border-white/10 text-center">Data Dukung</th>
                    <th colSpan={2} className="px-4 py-2 text-center bg-slate-100 dark:bg-[#2f2f2f] text-slate-800 dark:text-slate-200">Tindak Lanjut</th>
                    {canEdit && <th rowSpan={2} className="px-4 py-3 text-right">Aksi</th>}
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-white/10">
                    <th className="px-2 py-2 border-r border-slate-200 dark:border-white/10 text-center text-[10px]">FC KK</th>
                    <th className="px-2 py-2 border-r border-slate-200 dark:border-white/10 text-center text-[10px]">FC KTP</th>
                    <th className="px-2 py-2 border-r border-slate-200 dark:border-white/10 text-center text-[10px]">SP*</th>
                    <th className="px-2 py-2 border-r border-slate-200 dark:border-white/10 text-center text-[10px]">Suket Penghasilan</th>
                    <th className="px-2 py-2 border-r border-slate-200 dark:border-white/10 text-center text-[10px]">Foto Kondisi Rumah</th>
                    <th className="px-3 py-2 border-r border-slate-200 dark:border-white/10 text-center">TL</th>
                    <th className="px-3 py-2 text-center">BTL</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={15} className="px-6 py-8 text-center text-slate-500">
                        Memuat data...
                      </td>
                    </tr>
                  ) : filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan={15} className="px-6 py-8 text-center text-slate-500">
                        Tidak ada data laporan.
                      </td>
                    </tr>
                  ) : filteredReports.map((report, idx) => (
                    <tr key={report.id} className="border-b border-slate-200/70 dark:border-white/10 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                      <td className="px-4 py-3 text-center font-medium text-[var(--dash-text)]">{idx + 1}</td>
                      <td className="px-4 py-3 text-center">{report.tanggal}</td>
                      <td className="px-4 py-3 text-center">{report.posyandu}</td>
                      <td className="px-4 py-3 text-[var(--dash-text)] font-medium">{report.nama}</td>
                      <td className="px-4 py-3 font-mono">{report.nik}</td>
                      <td className="px-4 py-3">{report.alamat}</td>
                      <td className="px-2 py-3 text-center font-bold text-purple-600">{report.fcKK ? '✓' : '-'}</td>
                      <td className="px-2 py-3 text-center font-bold text-purple-600">{report.fcKTP ? '✓' : '-'}</td>
                      <td className="px-2 py-3 text-center font-bold text-purple-600">{report.sp ? '✓' : '-'}</td>
                      <td className="px-2 py-3 text-center font-bold text-purple-600">{report.suketPenghasilan ? '✓' : '-'}</td>
                      <td className="px-2 py-3 text-center font-bold text-purple-600">{report.fotoRumah ? '✓' : '-'}</td>
                      <td className="px-4 py-3 text-center">
                        {report.dataDukungs && report.dataDukungs.length > 0 ? (
                          <a
                            href={report.dataDukungs[0].filePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 hover:bg-indigo-100 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            PDF/Berkas
                          </a>
                        ) : (
                          <span className="text-slate-400 dark:text-zinc-650">-</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {report.status === 'TL' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-955 dark:text-purple-300">
                            <CheckCircle className="w-3.5 h-3.5" />
                            {report.keteranganTL || 'Sudah diproses'}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {report.status === 'BTL' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 dark:bg-[#2f2f2f] dark:text-zinc-300">
                            <Clock className="w-3.5 h-3.5" />
                            {report.keteranganBTL || 'Menunggu proses'}
                          </span>
                        ) : '-'}
                      </td>
                      {canEdit && (
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEdit(report)} className="text-blue-500 hover:text-blue-600 transition-colors" title="Edit">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(report.id)} className="text-rose-500 hover:text-rose-600 transition-colors" title="Hapus">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (role === 'SUPERADMIN' && !selectedKecamatanId) ? (
        // Level 0: List Kecamatan
        <div className="bg-white dark:bg-[#202020] p-6 rounded-lg border border-slate-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-[var(--dash-text)] mt-2">Daftar Kecamatan</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-[var(--dash-text-soft)]">
              <thead className="text-[11px] uppercase tracking-wider bg-transparent text-slate-500 dark:text-white/50 border-b border-slate-200/70 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4">Nama Kecamatan</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kecamatans.map((kec) => (
                  <tr key={kec.id} className="border-b border-slate-200/70 dark:border-white/10 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-[var(--dash-text)]">{kec.nama}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => {
                        setSelectedKecamatanId(kec.id)
                        setSelectedKecamatan(kec.nama)
                      }} className="text-purple-600 hover:text-purple-700 font-medium text-xs">Detail</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : selectedDesaId && !selectedPosyanduId ? (
        // Level 2: List Posyandu
        <div className="bg-white dark:bg-[#202020] p-6 rounded-lg border border-slate-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              {role !== 'OPERATOR_DESA' && (
                <button 
                  onClick={() => {
                    setSelectedDesa('')
                    setSelectedDesaId('')
                  }}
                  className="p-2 bg-purple-50 dark:bg-purple-955/30 text-purple-600 dark:text-purple-400 rounded-md hover:bg-purple-100 dark:hover:bg-purple-955/50 transition-colors"
                  title="Kembali ke Daftar Desa"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h2 className="text-lg font-bold text-[var(--dash-text)] mt-2">Daftar Posyandu di Desa {selectedDesa}</h2>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-[var(--dash-text-soft)]">
              <thead className="text-[11px] uppercase tracking-wider bg-transparent text-slate-500 dark:text-white/50 border-b border-slate-200/70 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4">Nama Posyandu</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {posyandus.map(p => (
                  <tr key={p.id} className="border-b border-slate-200/70 dark:border-white/10 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-[var(--dash-text)]">{p.nama}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => {
                        setSelectedPosyanduId(p.id)
                        setSelectedPosyandu(p.nama)
                      }} className="text-purple-600 hover:text-purple-700 font-medium text-xs">Buka Laporan</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Level 1: List Desa
        <div className="bg-white dark:bg-[#202020] p-6 rounded-lg border border-slate-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              {role === 'SUPERADMIN' && (
                <button 
                  onClick={() => {
                    setSelectedKecamatan('')
                    setSelectedKecamatanId('')
                  }}
                  className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                  title="Kembali ke Daftar Kecamatan"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h2 className="text-lg font-bold text-[var(--dash-text)] mt-2">Daftar Desa {role === 'SUPERADMIN' ? `di Kec. ${selectedKecamatan}` : ''}</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-[var(--dash-text-soft)]">
              <thead className="text-[11px] uppercase tracking-wider bg-transparent text-slate-500 dark:text-white/50 border-b border-slate-200/70 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4">Nama Desa</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {desas.map((desa) => (
                  <tr key={desa.id} className="border-b border-slate-200/70 dark:border-white/10 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-[var(--dash-text)]">{desa.nama}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => {
                        setSelectedDesaId(desa.id)
                        setSelectedDesa(desa.nama)
                        setNamaDesa(desa.nama)
                      }} className="text-purple-600 hover:text-purple-700 font-medium text-xs">Detail</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tambah/Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
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
              className="relative bg-white dark:bg-[#252525] rounded-t-2xl rounded-b-none sm:rounded-lg shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-slate-200/70 dark:border-white/10"
            >
              <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${theme.bgGradient}`}></div>
              
              <div className="p-6 border-b border-slate-200/70 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--dash-text)]">
                      {editId ? 'Edit Laporan' : 'Tambah Laporan'}
                    </h2>
                    <p className="text-sm text-[var(--dash-text-soft)] mt-0.5">
                      Lengkapi data permohonan di bawah ini
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-md bg-slate-50 dark:bg-[#202020] text-slate-400 hover:text-slate-500 dark:hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-[var(--dash-text)] dark:text-slate-200 block mb-1.5">Tanggal</label>
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                    className={`block w-full bg-slate-50 dark:bg-[#202020] border border-transparent ${theme.focusBorder} dark:${theme.focusBorder} rounded-lg px-4 py-2.5 text-[var(--dash-text)] focus:outline-none focus:ring-2 ${theme.focusRing} transition-all`}
                    required
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-[var(--dash-text)] dark:text-slate-200 block mb-1.5">Posyandu</label>
                  {isPosyandu ? (
                    <input
                      type="text"
                      value={formData.posyandu}
                      disabled
                      className="block w-full bg-slate-100 dark:bg-[#202020] border border-transparent rounded-lg px-4 py-2.5 text-[var(--dash-text)] focus:outline-none"
                    />
                  ) : (
                    <select
                      value={formData.posyandu}
                      onChange={(e) => setFormData({...formData, posyandu: e.target.value})}
                      className={`block w-full bg-slate-50 dark:bg-[#202020] border border-transparent ${theme.focusBorder} dark:${theme.focusBorder} rounded-lg px-4 py-2.5 text-[var(--dash-text)] focus:outline-none focus:ring-2 ${theme.focusRing} transition-all`}
                    >
                      {posyandus.map(p => (
                        <option key={p.id} value={p.nama}>{p.nama}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-[var(--dash-text)] dark:text-slate-200 block mb-1.5">Nama Pemohon</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({...formData, nama: e.target.value})}
                    className={`block w-full bg-slate-50 dark:bg-[#202020] border border-transparent ${theme.focusBorder} dark:${theme.focusBorder} rounded-lg px-4 py-2.5 text-[var(--dash-text)] placeholder-slate-400 focus:outline-none focus:ring-2 ${theme.focusRing} transition-all`}
                    placeholder="Nama Lengkap"
                    required
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-[var(--dash-text)] dark:text-slate-200 block mb-1.5">NIK (16 digit)</label>
                  <input
                    type="text"
                    maxLength={16}
                    value={formData.nik}
                    onChange={(e) => setFormData({...formData, nik: e.target.value})}
                    className={`block w-full bg-slate-50 dark:bg-[#202020] border border-transparent ${theme.focusBorder} dark:${theme.focusBorder} rounded-lg px-4 py-2.5 text-[var(--dash-text)] placeholder-slate-400 focus:outline-none focus:ring-2 ${theme.focusRing} transition-all`}
                    placeholder="NIK Pemohon"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-[var(--dash-text)] dark:text-slate-200 block mb-1.5">Alamat</label>
                  <input
                    type="text"
                    value={formData.alamat}
                    onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                    className={`block w-full bg-slate-50 dark:bg-[#202020] border border-transparent ${theme.focusBorder} dark:${theme.focusBorder} rounded-lg px-4 py-2.5 text-[var(--dash-text)] placeholder-slate-400 focus:outline-none focus:ring-2 ${theme.focusRing} transition-all`}
                    placeholder="Alamat Lengkap (RT/RW/Dusun)"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-[var(--dash-text)] dark:text-slate-200 block mb-1.5">Persyaratan (Checklist)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-slate-50 dark:bg-[#202020] p-4 rounded-lg">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.fcKK} onChange={e => setFormData({...formData, fcKK: e.target.checked})} className="rounded text-purple-600 focus:ring-purple-500/25 focus:border-purple-400 w-4 h-4" />
                      <span className="text-sm text-[var(--dash-text)] dark:text-slate-200">FC KK</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.fcKTP} onChange={e => setFormData({...formData, fcKTP: e.target.checked})} className="rounded text-purple-600 focus:ring-purple-500/25 focus:border-purple-400 w-4 h-4" />
                      <span className="text-sm text-[var(--dash-text)] dark:text-slate-200">FC KTP</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.sp} onChange={e => setFormData({...formData, sp: e.target.checked})} className="rounded text-purple-600 focus:ring-purple-500/25 focus:border-purple-400 w-4 h-4" />
                      <span className="text-sm text-[var(--dash-text)] dark:text-slate-200">SP* (Surat Permohonan)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.suketPenghasilan} onChange={e => setFormData({...formData, suketPenghasilan: e.target.checked})} className="rounded text-purple-600 focus:ring-purple-500/25 focus:border-purple-400 w-4 h-4" />
                      <span className="text-sm text-[var(--dash-text)] dark:text-slate-200">Suket Penghasilan</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer col-span-2">
                      <input type="checkbox" checked={formData.fotoRumah} onChange={e => setFormData({...formData, fotoRumah: e.target.checked})} className="rounded text-purple-600 focus:ring-purple-500/25 focus:border-purple-400 w-4 h-4" />
                      <span className="text-sm text-[var(--dash-text)] dark:text-slate-200">Foto Kondisi Rumah</span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2 border-t border-slate-200/70 dark:border-white/10 pt-4">
                  <label className="text-sm font-medium text-[var(--dash-text)] dark:text-slate-200 block mb-1.5">Tindak Lanjut</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        value="TL" 
                        checked={formData.status === 'TL'} 
                        onChange={() => setFormData({...formData, status: 'TL'})}
                        className="text-purple-600 focus:ring-purple-500/25 focus:border-purple-400"
                      />
                      <span className="text-sm font-medium text-[var(--dash-text)]">Tindak Lanjut (TL)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        value="BTL" 
                        checked={formData.status === 'BTL'} 
                        onChange={() => setFormData({...formData, status: 'BTL'})}
                        className="text-purple-600 focus:ring-purple-500/25 focus:border-purple-400"
                      />
                      <span className="text-sm font-medium text-[var(--dash-text)]">Belum Tindak Lanjut (BTL)</span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2 border-t border-slate-200/70 dark:border-white/10 pt-4">
                  <label className="text-sm font-medium text-[var(--dash-text)] dark:text-slate-200 block mb-1.5">Data Dukung (PDF / Gambar)</label>
                  
                  {uploadedFile ? (
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-[#202020]/50 border border-slate-200/70 dark:border-white/10 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-8 h-8 text-purple-600 dark:text-purple-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[var(--dash-text)] truncate">{uploadedFile.fileName}</p>
                          <a 
                            href={uploadedFile.filePath} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            Lihat Berkas
                          </a>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadedFile(null)}
                        className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-850 transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-purple-500 dark:hover:border-purple-500 rounded-lg p-4 transition-colors">
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center text-center">
                        {uploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm font-medium text-slate-600 dark:text-zinc-400">Mengunggah...</p>
                          </div>
                        ) : (
                          <>
                            <FileText className="w-8 h-8 text-[var(--dash-text-muted)] mb-2" />
                            <p className="text-sm font-medium text-slate-600 dark:text-zinc-400">
                              Klik atau seret berkas ke sini untuk upload PDF/Gambar
                            </p>
                            <p className="text-xs text-[var(--dash-text-muted)] mt-1">
                              Maksimal ukuran berkas 5MB
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 md:col-span-2 border-t border-slate-200/70 dark:border-white/10 pt-5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 text-sm font-medium text-[var(--dash-text)] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#2f2f2f] rounded-md transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className={`bg-gradient-to-r ${theme.bgGradient} text-white font-semibold py-2 px-4 rounded-md ${theme.hoverGradient} transition-all ${theme.shadow}`}
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
