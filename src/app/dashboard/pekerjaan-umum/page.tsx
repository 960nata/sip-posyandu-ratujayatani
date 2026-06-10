'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Search, Edit2, Trash2, Filter, 
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

const defaultPUSeeds = [
  { id: 'pu-1', tanggal: '2025-01-09', posyandu: 'Segar', noSuratRT: '01/SP.01/25', nama: 'Aan agung waluyo', nik: '1807041503910002', alamat: 'RT 20/RW 5', keluhan: 'pembangunan drainase', lokasi: 'wilayah RT 20', status: 'BTL', keterangan: 'BTL' },
  { id: 'pu-2', tanggal: '2025-02-09', posyandu: 'Segar', noSuratRT: '02/SP.02/25', nama: 'Yogi Arliansyah', nik: '1807040609900006', alamat: 'RT 13/RW 5', keluhan: 'pembagunan drainase', lokasi: 'wilayah RT 13', status: 'TL', keterangan: 'sudah di tindak lanjuti penggunaan Dana Desa' },
  { id: 'pu-3', tanggal: '2025-03-09', posyandu: 'Segar', noSuratRT: '03/SP.03/25', nama: 'Apri Trias D.', nik: '1807040408830009', alamat: 'RT 12/RW 5', keluhan: 'pembangunan drainase', lokasi: 'wilayah RT 12', status: 'BTL', keterangan: 'BTL' },
  { id: 'pu-4', tanggal: '2025-03-09', posyandu: 'Segar', noSuratRT: '04/SP.03/25', nama: 'Fitriyah', nik: '1807044408790002', alamat: 'RT 14/RW 5', keluhan: 'pembangunan drainase', lokasi: 'wilayah RT 14', status: 'TL', keterangan: 'sudah di tindaklanjuti penggunaan dana desa' },
  { id: 'pu-5', tanggal: '2025-04-09', posyandu: 'Segar', noSuratRT: '05/SP.04/25', nama: 'Fitriyah', nik: '1807044408790002', alamat: 'RT 14/RW 5', keluhan: 'pembangunan drainase', lokasi: 'wilayah RT 14', status: 'BTL', keterangan: 'BTL' }
]

export default function PekerjaanUmumPage() {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role
  const userKecamatanNama = (session?.user as any)?.kecamatanNama
  const [selectedKecamatan, setSelectedKecamatan] = useState('')
  
  const currentKecName = role === 'SUPERADMIN' ? selectedKecamatan : (userKecamatanNama || 'Pekalongan')
  const myKec = regionData.find(k => k.name === currentKecName)
  const desas = myKec ? myKec.desas : []
  
  const isPosyandu = role === 'OPERATOR_POSYANDU'

  const theme = {
    bgGradient: isPosyandu ? 'from-purple-500 to-indigo-600' : 'from-emerald-500 to-teal-600',
    hoverGradient: isPosyandu ? 'hover:from-purple-600 hover:to-indigo-700' : 'hover:from-emerald-600 hover:to-teal-700',
    shadow: isPosyandu ? 'shadow-purple-500/20' : 'shadow-emerald-500/20',
    focusBorder: isPosyandu ? 'focus:border-purple-500' : 'focus:border-emerald-500',
    focusRing: isPosyandu ? 'focus:ring-purple-500/10' : 'focus:ring-emerald-500/10',
    text: isPosyandu ? 'text-purple-600' : 'text-emerald-600',
    bgLight: isPosyandu ? 'bg-purple-50' : 'bg-emerald-50',
    textLight: isPosyandu ? 'text-purple-700' : 'text-emerald-700',
    activeRing: isPosyandu ? 'focus:ring-purple-500' : 'focus:ring-emerald-500',
  }

  const [selectedDesa, setSelectedDesa] = useState('')
  const [selectedPosyandu, setSelectedPosyandu] = useState('')
  const [posyandus, setPosyandus] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [reports, setReports] = useState<any[]>([])
  const [namaDesa, setNamaDesa] = useState('Tulusrejo')

  useEffect(() => {
    setMounted(true)
    const savedDesa = localStorage.getItem('sip_nama_desa')
    if (savedDesa) {
      setNamaDesa(savedDesa)
    }

    if (isPosyandu) {
      setSelectedDesa(savedDesa || 'Tulusrejo')
      const userPosyanduName = (session?.user as any)?.posyanduNama || 'Segar'
      setSelectedPosyandu(userPosyanduName)
    }
    
    if (role === 'OPERATOR_DESA') {
      const userName = session?.user?.name || ''
      const desaName = userName.replace('Admin Desa ', '')
      if (desaName) setSelectedDesa(desaName)

      fetch('/api/posyandu')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setPosyandus(data)
        })
    }

    // Load from LocalStorage
    const savedReports = localStorage.getItem('sip_pu_reports')
    if (savedReports) {
      setReports(JSON.parse(savedReports))
    } else {
      setReports(defaultPUSeeds)
      localStorage.setItem('sip_pu_reports', JSON.stringify(defaultPUSeeds))
    }
  }, [isPosyandu, role, session])

  const initialForm = { tanggal: '', nama: '', nik: '', alamat: '', keluhan: '', lokasi: '', status: 'TL', noSuratRT: '', keterangan: '', posyandu: 'Segar' }
  const [formData, setFormData] = useState(initialForm)
  const [editId, setEditId] = useState<string | null>(null)

  const handleEdit = (report: any) => {
    setFormData({
      tanggal: report.tanggal,
      nama: report.nama,
      nik: report.nik,
      alamat: report.alamat,
      keluhan: report.keluhan,
      lokasi: report.lokasi,
      status: report.status || 'TL',
      noSuratRT: report.noSuratRT || '',
      keterangan: report.keterangan || '',
      posyandu: report.posyandu || 'Segar'
    })
    setEditId(report.id)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if(confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      const updated = reports.filter(r => r.id !== id)
      setReports(updated)
      localStorage.setItem('sip_pu_reports', JSON.stringify(updated))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validasi NIK 16 digit
    if (formData.nik && (!/^\d{16}$/.test(formData.nik))) {
      alert('NIK harus berupa 16 digit angka cuy!')
      return
    }

    let updated
    if (editId) {
      updated = reports.map(r => r.id === editId ? { ...formData, id: editId } : r)
    } else {
      updated = [{ ...formData, id: Date.now().toString() }, ...reports]
    }
    setReports(updated)
    localStorage.setItem('sip_pu_reports', JSON.stringify(updated))
    setIsModalOpen(false)
    setFormData(initialForm)
    setEditId(null)
  }

  const handleAdd = () => {
    setFormData({ ...initialForm, posyandu: isPosyandu ? (selectedPosyandu || 'Segar') : 'Segar' })
    setEditId(null)
    setIsModalOpen(true)
  }

  // Export Excel
  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('PU')

    worksheet.columns = [
      { key: 'no', width: 6 },
      { key: 'tanggal', width: 14 },
      { key: 'posyandu', width: 14 },
      { key: 'noSuratRT', width: 20 },
      { key: 'nama', width: 22 },
      { key: 'nik', width: 25 },
      { key: 'alamat', width: 20 },
      { key: 'keluhan', width: 35 },
      { key: 'lokasi', width: 30 },
      { key: 'tl', width: 25 },
      { key: 'btl', width: 25 }
    ]

    // Row 1: Title
    worksheet.mergeCells('A1:K1')
    const r1 = worksheet.getCell('A1')
    r1.value = 'BIDANG PEKERJAAN UMUM'
    r1.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } }
    r1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } } as any
    r1.alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getRow(1).height = 35

    // Row 2: Subtitle
    worksheet.mergeCells('A2:K2')
    const r2 = worksheet.getCell('A2')
    r2.value = `DESA : ${namaDesa.toUpperCase()}`
    r2.font = { name: 'Arial', size: 11, bold: true }
    r2.alignment = { vertical: 'middle', horizontal: 'left' }
    worksheet.getRow(2).height = 25

    // Row 3: Empty
    worksheet.getRow(3).height = 15

    // Row 4-5: Header
    worksheet.getRow(4).values = ['No', 'Tanggal', 'Nama Posyandu', 'No Surat Permohonan RT', 'Nama', 'NIK', 'Alamat', 'Keluhan', 'Lokasi Pembangunan Sarana', 'Tindaklanjut', '']
    worksheet.getRow(5).values = ['', '', '', '', '', '', '', '', '', 'TL', 'BTL']

    worksheet.mergeCells('A4:A5')
    worksheet.mergeCells('B4:B5')
    worksheet.mergeCells('C4:C5')
    worksheet.mergeCells('D4:D5')
    worksheet.mergeCells('E4:E5')
    worksheet.mergeCells('F4:F5')
    worksheet.mergeCells('G4:G5')
    worksheet.mergeCells('H4:H5')
    worksheet.mergeCells('I4:I5')
    worksheet.mergeCells('J4:K4') // Tindaklanjut spans 2 columns

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

    // Row 6: Column numbers (1-11)
    worksheet.getRow(6).values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
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
      const matchSearch = r.nama.toLowerCase().includes(search.toLowerCase()) || r.keluhan.toLowerCase().includes(search.toLowerCase())
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
        r.noSuratRT,
        r.nama,
        r.nik,
        r.alamat,
        r.keluhan,
        r.lokasi,
        r.status === 'TL' ? (r.keterangan || 'TL') : '',
        r.status === 'BTL' ? (r.keterangan || 'BTL') : ''
      ]
      row.height = 20
      row.eachCell((c, colNum) => {
        c.font = { name: 'Arial', size: 10 }
        c.border = borderAll
        if (colNum === 6) { // NIK rata kiri, paksa format teks
          c.numFmt = '@'
          c.alignment = { vertical: 'middle', horizontal: 'left' }
        } else if (typeof c.value === 'number') {
          c.alignment = { vertical: 'middle', horizontal: 'right' }
        } else {
          c.alignment = { vertical: 'middle', horizontal: 'left' }
        }
      })
    })

    // Baris TOTAL di paling bawah
    const totalRowIdx = 7 + filtered.length
    worksheet.mergeCells(`A${totalRowIdx}:J${totalRowIdx}`)
    const totalRow = worksheet.getRow(totalRowIdx)
    totalRow.height = 22
    totalRow.getCell(1).value = 'TOTAL LAPORAN'
    totalRow.getCell(1).font = { name: 'Arial', size: 10, bold: true }
    totalRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' }
    totalRow.getCell(11).value = filtered.length
    totalRow.getCell(11).font = { name: 'Arial', size: 10, bold: true }
    totalRow.getCell(11).alignment = { vertical: 'middle', horizontal: 'right' }
    for (let col = 1; col <= 11; col++) {
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
    link.download = `PU_${namaDesa.toUpperCase()}.xlsx`
    link.click()
  }

  // Export CSV flat
  const handleExportCSV = () => {
    const csvHeaders = ['NO', 'TANGGAL', 'POSYANDU', 'NO_SURAT_PERMOHONAN_RT', 'NAMA', 'NIK', 'ALAMAT', 'KELUHAN', 'LOKASI_PEMBANGUNAN_SARANA', 'KET_TL', 'KET_BTL']
    const filtered = reports.filter(r => {
      const matchSearch = r.nama.toLowerCase().includes(search.toLowerCase()) || r.keluhan.toLowerCase().includes(search.toLowerCase())
      if (isPosyandu) return r.posyandu === selectedPosyandu && matchSearch
      if (selectedPosyandu) return r.posyandu === selectedPosyandu && matchSearch
      return matchSearch
    })

    const rows = filtered.map((r, idx) => {
      return [
        idx + 1,
        `"${r.tanggal}"`,
        `"${r.posyandu}"`,
        `"${(r.noSuratRT || '').replace(/"/g, '""')}"`,
        `"${r.nama.replace(/"/g, '""')}"`,
        `"${r.nik}"`,
        `"${(r.alamat || '').replace(/"/g, '""')}"`,
        `"${(r.keluhan || '').replace(/"/g, '""')}"`,
        `"${(r.lokasi || '').replace(/"/g, '""')}"`,
        `"${r.status === 'TL' ? (r.keterangan || 'TL').replace(/"/g, '""') : ''}"`,
        `"${r.status === 'BTL' ? (r.keterangan || 'BTL').replace(/"/g, '""') : ''}"`
      ].join(',')
    })

    const csvContent = [csvHeaders.join(','), ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `PU_${namaDesa.toUpperCase()}.csv`
    link.click()
  }

  const filteredReports = reports.filter(r => {
    const matchSearch = r.nama.toLowerCase().includes(search.toLowerCase()) || r.keluhan.toLowerCase().includes(search.toLowerCase())
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
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Data Hasil Kegiatan Pekerjaan Umum</h1>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">Sistem Informasi Posyandu (Pekerjaan Umum) - Desa {namaDesa}</p>
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
                  onClick={() => setSelectedPosyandu('')}
                  className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors mb-2"
                  title="Kembali ke Daftar Posyandu"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Laporan Pekerjaan Umum</h1>
              <p className="text-slate-500 dark:text-zinc-400 text-sm">
                {isPosyandu ? 'Permohonan & Aspirasi Bidang Pekerjaan Umum' : `Permohonan & Aspirasi Bidang Pekerjaan Umum - ${selectedPosyandu}`}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportCSV}
                className="bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 font-semibold py-2.5 px-4 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900/20 transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Export CSV
              </button>
              <button
                onClick={handleExportExcel}
                className="bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold py-2.5 px-4 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export Excel
              </button>
              {(isPosyandu || role === 'SUPERADMIN' || role === 'OPERATOR_DESA') && (
                <button
                  onClick={handleAdd}
                  className={`bg-gradient-to-r ${theme.bgGradient} text-white font-semibold py-2.5 px-4 rounded-xl ${theme.hoverGradient} transition-all shadow-lg ${theme.shadow} flex items-center justify-center gap-2`}
                >
                  <Plus className="w-5 h-5" />
                  Tambah Laporan
                </button>
              )}
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-800 p-4 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full bg-slate-50 dark:bg-zinc-700/50 border border-slate-200 dark:border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Cari nama pemohon atau keluhan..."
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
                <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-700 dark:text-slate-200">
                  <tr className="border-b border-slate-200 dark:border-zinc-700">
                    <th rowSpan={2} className="px-4 py-3 border-r border-slate-200 dark:border-zinc-700 text-center">No</th>
                    <th rowSpan={2} className="px-4 py-3 border-r border-slate-200 dark:border-zinc-700 text-center">Tanggal</th>
                    <th rowSpan={2} className="px-4 py-3 border-r border-slate-200 dark:border-zinc-700 text-center">Posyandu</th>
                    <th rowSpan={2} className="px-4 py-3 border-r border-slate-200 dark:border-zinc-700 text-center">No Surat RT</th>
                    <th rowSpan={2} className="px-4 py-3 border-r border-slate-200 dark:border-zinc-700 text-center">Pemohon</th>
                    <th rowSpan={2} className="px-4 py-3 border-r border-slate-200 dark:border-zinc-700 text-center">NIK</th>
                    <th rowSpan={2} className="px-4 py-3 border-r border-slate-200 dark:border-zinc-700 text-center">Alamat</th>
                    <th rowSpan={2} className="px-4 py-3 border-r border-slate-200 dark:border-zinc-700 text-center">Keluhan</th>
                    <th rowSpan={2} className="px-4 py-3 border-r border-slate-200 dark:border-zinc-700 text-center">Lokasi Sarana</th>
                    <th colSpan={2} className="px-4 py-2 text-center bg-slate-100 dark:bg-zinc-700 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-zinc-700">Tindak Lanjut</th>
                    {(isPosyandu || role === 'SUPERADMIN' || role === 'OPERATOR_DESA') && <th rowSpan={2} className="px-4 py-3 text-right">Aksi</th>}
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-zinc-700">
                    <th className="px-3 py-2 border-r border-slate-200 dark:border-zinc-700 text-center">TL</th>
                    <th className="px-3 py-2 text-center">BTL</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="px-6 py-8 text-center text-slate-500">
                        Tidak ada data laporan.
                      </td>
                    </tr>
                  ) : filteredReports.map((report, idx) => (
                    <tr key={report.id} className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                      <td className="px-4 py-3 text-center font-medium text-slate-800 dark:text-white">{idx + 1}</td>
                      <td className="px-4 py-3 text-center">{report.tanggal}</td>
                      <td className="px-4 py-3 text-center">{report.posyandu}</td>
                      <td className="px-4 py-3 font-mono text-center">{report.noSuratRT || '-'}</td>
                      <td className="px-4 py-3 text-slate-900 dark:text-white font-medium">{report.nama}</td>
                      <td className="px-4 py-3 font-mono">{report.nik}</td>
                      <td className="px-4 py-3">{report.alamat}</td>
                      <td className="px-4 py-3 max-w-xs truncate" title={report.keluhan}>{report.keluhan}</td>
                      <td className="px-4 py-3">{report.lokasi}</td>
                      <td className="px-3 py-3 text-center">
                        {report.status === 'TL' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-955 dark:text-emerald-300">
                            <CheckCircle className="w-3.5 h-3.5" />
                            {report.keterangan || 'Sudah ditindaklanjuti'}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {report.status === 'BTL' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 dark:bg-zinc-700 dark:text-zinc-300">
                            <Clock className="w-3.5 h-3.5" />
                            {report.keterangan || 'BTL'}
                          </span>
                        ) : '-'}
                      </td>
                      {(isPosyandu || role === 'SUPERADMIN' || role === 'OPERATOR_DESA') && (
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
      ) : (role === 'SUPERADMIN' && !selectedKecamatan) ? (
        // Level 0: List Kecamatan
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mt-2">Daftar Kecamatan</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
              <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-700 dark:text-slate-200">
                <tr>
                  <th className="px-6 py-4">Nama Kecamatan</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {regionData.map((kec) => (
                  <tr key={kec.name} className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{kec.name}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setSelectedKecamatan(kec.name)} className="text-emerald-600 hover:text-emerald-700 font-medium text-xs">Detail</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : selectedDesa ? (
        // Level 2: List Posyandu
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              {role !== 'OPERATOR_DESA' && (
                <button 
                  onClick={() => setSelectedDesa('')}
                  className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                  title="Kembali ke Daftar Desa"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mt-2">Daftar Posyandu di Desa {selectedDesa}</h2>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
              <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-700 dark:text-slate-200">
                <tr>
                  <th className="px-6 py-4">Nama Posyandu</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {['Segar', 'Utama', 'Mulia', 'Giat', 'Lestari'].map(pName => (
                  <tr key={pName} className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">Posyandu {pName}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setSelectedPosyandu(pName)} className="text-emerald-600 hover:text-emerald-700 font-medium text-xs">Buka Laporan</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Level 1: List Desa
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              {role === 'SUPERADMIN' && (
                <button 
                  onClick={() => setSelectedKecamatan('')}
                  className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                  title="Kembali ke Daftar Kecamatan"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mt-2">Daftar Desa {role === 'SUPERADMIN' ? `di Kec. ${currentKecName}` : ''}</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
              <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-700 dark:text-slate-200">
                <tr>
                  <th className="px-6 py-4">Nama Desa</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {desas.map((desa) => (
                  <tr key={desa} className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{desa}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setSelectedDesa(desa)} className="text-emerald-600 hover:text-emerald-700 font-medium text-xs">Detail</button>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
              className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 dark:border-zinc-800"
            >
              <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${theme.bgGradient}`}></div>
              
              <div className="p-6 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {editId ? 'Edit Laporan' : 'Tambah Laporan'}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                      Lengkapi data laporan di bawah ini
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 dark:bg-zinc-800 text-slate-400 hover:text-slate-500 dark:hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Tanggal</label>
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                    className={`block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent ${theme.focusBorder} dark:${theme.focusBorder} rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 ${theme.focusRing} transition-all`}
                    required
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Posyandu</label>
                  {isPosyandu ? (
                    <input
                      type="text"
                      value={formData.posyandu}
                      disabled
                      className="block w-full bg-slate-100 dark:bg-zinc-800 border border-transparent rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none"
                    />
                  ) : (
                    <select
                      value={formData.posyandu}
                      onChange={(e) => setFormData({...formData, posyandu: e.target.value})}
                      className={`block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent ${theme.focusBorder} dark:${theme.focusBorder} rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 ${theme.focusRing} transition-all`}
                    >
                      {['Segar', 'Utama', 'Mulia', 'Giat', 'Lestari'].map(pName => (
                        <option key={pName} value={pName}>Posyandu {pName}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Nama Pemohon</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({...formData, nama: e.target.value})}
                    className={`block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent ${theme.focusBorder} dark:${theme.focusBorder} rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 ${theme.focusRing} transition-all`}
                    placeholder="Nama Lengkap"
                    required
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">NIK (16 digit)</label>
                  <input
                    type="text"
                    maxLength={16}
                    value={formData.nik}
                    onChange={(e) => setFormData({...formData, nik: e.target.value})}
                    className={`block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent ${theme.focusBorder} dark:${theme.focusBorder} rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 ${theme.focusRing} transition-all`}
                    placeholder="NIK Pemohon"
                    required
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">No. Surat Permohonan RT</label>
                  <input
                    type="text"
                    value={formData.noSuratRT}
                    onChange={(e) => setFormData({...formData, noSuratRT: e.target.value})}
                    className={`block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent ${theme.focusBorder} dark:${theme.focusBorder} rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 ${theme.focusRing} transition-all`}
                    placeholder="Contoh: 01/SP.01/25"
                    required
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Lokasi Pembangunan Sarana</label>
                  <input
                    type="text"
                    value={formData.lokasi}
                    onChange={(e) => setFormData({...formData, lokasi: e.target.value})}
                    className={`block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent ${theme.focusBorder} dark:${theme.focusBorder} rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 ${theme.focusRing} transition-all`}
                    placeholder="Contoh: wilayah RT 20"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Alamat</label>
                  <input
                    type="text"
                    value={formData.alamat}
                    onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                    className={`block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent ${theme.focusBorder} dark:${theme.focusBorder} rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 ${theme.focusRing} transition-all`}
                    placeholder="Alamat Lengkap (RT/RW/Dusun)"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Keluhan (Aspirasi)</label>
                  <textarea
                    value={formData.keluhan}
                    onChange={(e) => setFormData({...formData, keluhan: e.target.value})}
                    className={`block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent ${theme.focusBorder} dark:${theme.focusBorder} rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 ${theme.focusRing} transition-all`}
                    rows={3}
                    placeholder="Isi keluhan infrastruktur..."
                    required
                  />
                </div>

                <div className="md:col-span-2 border-t border-slate-100 dark:border-zinc-800 pt-4">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Tindak Lanjut</label>
                  <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        value="TL" 
                        checked={formData.status === 'TL'} 
                        onChange={() => setFormData({...formData, status: 'TL'})}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium text-slate-800 dark:text-white">Tindak Lanjut (TL)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        value="BTL" 
                        checked={formData.status === 'BTL'} 
                        onChange={() => setFormData({...formData, status: 'BTL'})}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium text-slate-800 dark:text-white">Belum Tindak Lanjut (BTL)</span>
                    </label>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Keterangan / Keterangan Tindak Lanjut</label>
                    <input
                      type="text"
                      value={formData.keterangan}
                      onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                      className={`block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent ${theme.focusBorder} dark:${theme.focusBorder} rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 ${theme.focusRing} transition-all`}
                      placeholder="Contoh: sudah di tindak lanjuti penggunaan Dana Desa"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 md:col-span-2 border-t border-slate-100 dark:border-zinc-800 pt-5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className={`bg-gradient-to-r ${theme.bgGradient} text-white font-semibold py-2.5 px-6 rounded-xl ${theme.hoverGradient} transition-all shadow-lg ${theme.shadow}`}
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
