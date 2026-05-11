'use client'

import { useState, useEffect, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Save, Heart, Activity,
  Baby, Shield, Syringe, ClipboardList,
  ArrowLeft, Edit2, Trash2, Plus, X, Users, ChevronDown, Download
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import * as XLSX from 'xlsx'

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

export default function Sip7Page() {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role
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
    bgSolid: isPosyandu ? 'bg-purple-500' : 'bg-emerald-500',
    hoverSolid: isPosyandu ? 'hover:bg-purple-600' : 'hover:bg-emerald-600',
    borderLight: isPosyandu ? 'border-purple-200' : 'border-emerald-200',
    hoverLight: isPosyandu ? 'hover:bg-purple-50' : 'hover:bg-emerald-50',
    shadowSolid: isPosyandu ? 'shadow-purple-500/20' : 'shadow-emerald-500/20',
    textDark: isPosyandu ? 'dark:text-purple-400' : 'dark:text-emerald-400',
    bgDarkLight: isPosyandu ? 'dark:bg-purple-900/30' : 'dark:bg-emerald-900/30',
    focusRingSolid: isPosyandu ? 'focus:ring-purple-500' : 'focus:ring-emerald-500',
  }

  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('hasil_kegiatan')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedReportForDetail, setSelectedReportForDetail] = useState<any>(null)

  // Level Selection States
  const [selectedKecamatan, setSelectedKecamatan] = useState('')
  const [selectedDesa, setSelectedDesa] = useState('')
  const [selectedPosyandu, setSelectedPosyandu] = useState('')

  const userKecamatanNama = (session?.user as any)?.kecamatanNama
  const currentKecName = role === 'SUPERADMIN' ? selectedKecamatan : (userKecamatanNama || 'Batanghari')
  const myKec = regionData.find(k => k.name === currentKecName)

  // Form States
  const [formBulan, setFormBulan] = useState(5)
  const [formTahun, setFormTahun] = useState(2026)

  useEffect(() => {
    setMounted(true)
    if (isPosyandu) {
      setSelectedDesa('Adirejo')
      setSelectedPosyandu('Posyandu Adirejo I')
    }
    if (role === 'OPERATOR_DESA') {
      const userName = session?.user?.name || ''
      const desaName = userName.replace('Admin Desa ', '')
      if (desaName) setSelectedDesa(desaName)
    }
  }, [isPosyandu, role, session])

  const exportToExcel = () => {
    const headers = [
      ['DATA HASIL KEGIATAN'],
      [''],
      ['NO', 'BULAN', 'IBU HAMIL', '', '', 'JUMLAH IBU MENYUSUI', 'JUMLAH AKSEPTOR', '', '', '', '', '', '', '', 'PENIMBANGAN BALITA', '', '', '', '', '', '', '', '', '', '', '', 'IMUNISASI TT IBU HAMIL', '', 'JUMLAH BAYI YANG DIIMUNISASI'],
      ['', '', 'JUMLAH', 'DIPERIKSA', 'FE TAB', '', 'KONDOM', 'PIL', 'IMPLANT', 'MOP', 'MOW', 'IUD', 'SUNTIK', 'LAIN-LAIN', 'JML BALITA (S)', '', 'JML BALITA YANG MEMILIKI KMS (K)', '', 'JML BALITA YANG DITIMBANG (D)', '', 'JML BALTA YANG NAIK (N)', '', 'JML BALITA YG MENDAPAT VIT. A', '', 'JML BALITA YG MENDAPATKAN PMT', '', 'I', 'II', 'BCG', '', 'DPT', '', '', '', '', '', 'POLIO', '', '', '', '', '', '', '', 'CAMPAK', '', 'HEPATITIS B'],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', 'L', 'P', 'L', 'P', 'L', 'P', 'L', 'P', 'L', 'P', 'L', 'P', '', '', 'L', 'P', 'I', 'II', 'III', 'I', 'II', 'III', 'I', 'II', 'III', 'IV', 'I', 'II', 'III', 'I', 'II', 'III'],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51]
    ]

    const data = dummyHasilKegiatan.map((row, idx) => [
      idx + 1,
      row.bulan === 1 ? 'JANUARI' : row.bulan === 2 ? 'FEBRUARI' : row.bulan === 3 ? 'MARET' : 'APRIL',
      row.bumil.jml, row.bumil.diperiksa, row.bumil.fe,
      row.busui,
      row.kb.kondom, row.kb.pil, row.kb.implant, row.kb.mop, row.kb.mow, row.kb.iud, row.kb.suntik, row.kb.lainnya,
      row.timbang.s_l, row.timbang.s_p, row.timbang.k_l, row.timbang.k_p, row.timbang.d_l, row.timbang.d_p, row.timbang.n_l, row.timbang.n_p, row.timbang.vitA_l, row.timbang.vitA_p, row.timbang.pmt_l, row.timbang.pmt_p,
      row.imTT.i, row.imTT.ii,
      row.imBayi.bcg_l, row.imBayi.bcg_p, row.imBayi.dpt1_l, row.imBayi.dpt1_p, row.imBayi.dpt2_l, row.imBayi.dpt2_p, row.imBayi.dpt3_l, row.imBayi.dpt3_p,
      row.imBayi.polio1_l, row.imBayi.polio1_p, row.imBayi.polio2_l, row.imBayi.polio2_p, row.imBayi.polio3_l, row.imBayi.polio3_p, row.imBayi.polio4_l, row.imBayi.polio4_p,
      row.imBayi.campak_l, row.imBayi.campak_p, row.imBayi.hepb1_l, row.imBayi.hepb1_p, row.imBayi.hepb2_l, row.imBayi.hepb2_p, row.imBayi.hepb3_l, row.imBayi.hepb3_p
    ])

    const ws = XLSX.utils.aoa_to_sheet([...headers, ...data])

    // Add merges
    ws['!merges'] = [
      { s: { r: 2, c: 2 }, e: { r: 2, c: 4 } }, // Ibu Hamil
      { s: { r: 2, c: 6 }, e: { r: 2, c: 13 } }, // KB
      { s: { r: 2, c: 14 }, e: { r: 2, c: 25 } }, // Timbang
      { s: { r: 2, c: 26 }, e: { r: 2, c: 27 } }, // TT
      { s: { r: 2, c: 28 }, e: { r: 2, c: 50 } }, // Imunisasi Bayi
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Hasil Kegiatan')
    XLSX.writeFile(wb, 'SIP7_Hasil_Kegiatan.xlsx')
  }

  // Dummy Data for SIP 7 (Hasil Kegiatan)
  const [dummyHasilKegiatan, setDummyHasilKegiatan] = useState([
    {
      id: '1', bulan: 1, tahun: 2026,
      bumil: { jml: 15, diperiksa: 15, fe: 15 },
      busui: 89,
      kb: { kondom: 5, pil: 40, implant: 30, mop: 0, mow: 1, iud: 2, suntik: 98, lainnya: 0 },
      timbang: { s_l: 108, s_p: 108, k_l: 108, k_p: 108, d_l: 80, d_p: 92, n_l: 76, n_p: 60, vitA_l: 0, vitA_p: 0, pmt_l: 108, pmt_p: 108 },
      imTT: { i: 1, ii: 1 },
      imBayi: {
        bcg_l: 0, bcg_p: 2, dpt1_l: 2, dpt1_p: 3, dpt2_l: 3, dpt2_p: 1, dpt3_l: 2, dpt3_p: 1,
        polio1_l: 0, polio1_p: 2, polio2_l: 2, polio2_p: 3, polio3_l: 3, polio3_p: 1, polio4_l: 2, polio4_p: 2,
        campak_l: 3, campak_p: 0, hepb1_l: 0, hepb1_p: 0, hepb2_l: 0, hepb2_p: 0, hepb3_l: 0, hepb3_p: 0
      }
    },
    {
      id: '2', bulan: 2, tahun: 2026,
      bumil: { jml: 18, diperiksa: 18, fe: 18 },
      busui: 86,
      kb: { kondom: 20, pil: 29, implant: 10, mop: 0, mow: 1, iud: 2, suntik: 91, lainnya: 0 },
      timbang: { s_l: 98, s_p: 117, k_l: 98, k_p: 117, d_l: 88, d_p: 80, n_l: 69, n_p: 69, vitA_l: 95, vitA_p: 95, pmt_l: 105, pmt_p: 105 },
      imTT: { i: 3, ii: 0 },
      imBayi: {
        bcg_l: 0, bcg_p: 1, dpt1_l: 1, dpt1_p: 2, dpt2_l: 2, dpt2_p: 1, dpt3_l: 2, dpt3_p: 0,
        polio1_l: 0, polio1_p: 1, polio2_l: 1, polio2_p: 2, polio3_l: 2, polio3_p: 1, polio4_l: 2, polio4_p: 1,
        campak_l: 2, campak_p: 0, hepb1_l: 0, hepb1_p: 0, hepb2_l: 0, hepb2_p: 0, hepb3_l: 0, hepb3_p: 0
      }
    },
    {
      id: '3', bulan: 3, tahun: 2026,
      bumil: { jml: 20, diperiksa: 20, fe: 20 },
      busui: 90,
      kb: { kondom: 28, pil: 30, implant: 30, mop: 0, mow: 1, iud: 1, suntik: 68, lainnya: 0 },
      timbang: { s_l: 105, s_p: 115, k_l: 105, k_p: 115, d_l: 81, d_p: 97, n_l: 78, n_p: 60, vitA_l: 0, vitA_p: 0, pmt_l: 103, pmt_p: 104 },
      imTT: { i: 4, ii: 0 },
      imBayi: {
        bcg_l: 1, bcg_p: 1, dpt1_l: 0, dpt1_p: 1, dpt2_l: 0, dpt2_p: 0, dpt3_l: 1, dpt3_p: 1,
        polio1_l: 0, polio1_p: 0, polio2_l: 1, polio2_p: 1, polio3_l: 0, polio3_p: 0, polio4_l: 1, polio4_p: 2,
        campak_l: 2, campak_p: 0, hepb1_l: 0, hepb1_p: 0, hepb2_l: 0, hepb2_p: 0, hepb3_l: 0, hepb3_p: 0
      }
    },
    {
      id: '4', bulan: 4, tahun: 2026,
      bumil: { jml: 25, diperiksa: 25, fe: 25 },
      busui: 88,
      kb: { kondom: 18, pil: 20, implant: 49, mop: 0, mow: 0, iud: 1, suntik: 83, lainnya: 0 },
      timbang: { s_l: 97, s_p: 115, k_l: 97, k_p: 115, d_l: 75, d_p: 87, n_l: 70, n_p: 60, vitA_l: 0, vitA_p: 0, pmt_l: 105, pmt_p: 106 },
      imTT: { i: 5, ii: 0 },
      imBayi: {
        bcg_l: 2, bcg_p: 0, dpt1_l: 1, dpt1_p: 0, dpt2_l: 1, dpt2_p: 1, dpt3_l: 0, dpt3_p: 2,
        polio1_l: 0, polio1_p: 0, polio2_l: 1, polio2_p: 0, polio3_l: 1, polio3_p: 1, polio4_l: 0, polio4_p: 2,
        campak_l: 1, campak_p: 0, hepb1_l: 0, hepb1_p: 0, hepb2_l: 0, hepb2_p: 0, hepb3_l: 0, hepb3_p: 0
      }
    }
  ])

  // Dummy Data for Rekapitulasi Bumil
  const [dummyRekapBumil, setDummyRekapBumil] = useState([
    { id: '1', bulan: 1, tahun: 2026, bumil: 15, busui: 89, datang: { bumil: 12, busui: 80 }, tidakDatang: { bumil: 3, busui: 9 }, bb: { hijau: 10, merah: 5 }, lila: { hijau: 12, merah: 3 }, td: { hijau: 14, merah: 1 }, tbc: 0, ttd: { dpt: 15, tiapHari: 10, tidak: 5 }, pmt: { dpt: 5, tiapHari: 5, tidak: 0 }, kelas: 12, vitA: 80, kb: 5, edukasi: 15, rujuk: { bumil: 1, busui: 0 } }
  ])

  // Dummy Data for Rekapitulasi Bayi
  const [dummyRekapBayi, setDummyRekapBayi] = useState([
    { id: '1', bulan: 1, tahun: 2026, bayi: 20, balita: 88, datang: { bayi: 18, balita: 80 }, tidakDatang: { bayi: 2, balita: 8 }, checklist: { lengkap: 15, tidak: 5 }, bb: { naik: 12, tidak: 8 }, tb: { normal: 18, tidak: 2 }, lila: { normal: 19, tidak: 1 }, tbc: 0, asi: 10, mpasi: 8, imunisasi: 18, vitA: 20, cacing: 20, pmt: 10, edukasi: 20, rujuk: { bayi: 0, balita: 1 } }
  ])

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Data Hasil Kegiatan Bulanan Posyandu</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">Sistem Informasi Posyandu (SIP 7)</p>
        </div>
      </div>
      {(isPosyandu || (selectedDesa && selectedPosyandu)) ? (
        // Level 3: Detail Posyandu (Data SIP 7)
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              {!isPosyandu && (
                <button
                  onClick={() => setSelectedPosyandu('')}
                  className={`p-2 ${theme.bgLight} ${theme.bgDarkLight} ${theme.text} dark:${theme.textDark} rounded-full ${theme.hoverLight} dark:hover:bg-emerald-900/50 transition-colors mb-2`}
                  title="Kembali ke Daftar Posyandu"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                {isPosyandu ? '' : `Detail data untuk Posyandu ${selectedPosyandu}`}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              <button
                onClick={() => { setActiveTab('hasil_kegiatan'); setShowForm(false); }}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${activeTab === 'hasil_kegiatan'
                    ? `${theme.bgSolid} text-white shadow-sm ${theme.shadow}`
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                  }`}
              >
                Data Hasil Kegiatan
              </button>
              <button
                onClick={() => { setActiveTab('rekap_bumil'); setShowForm(false); }}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${activeTab === 'rekap_bumil'
                    ? `${theme.bgSolid} text-white shadow-sm ${theme.shadow}`
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                  }`}
              >
                Rekapitulasi Bumil
              </button>
              <button
                onClick={() => { setActiveTab('rekap_bayi'); setShowForm(false); }}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${activeTab === 'rekap_bayi'
                    ? `${theme.bgSolid} text-white shadow-sm ${theme.shadow}`
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                  }`}
              >
                Rekapitulasi Bayi/Balita
              </button>
              <button
                onClick={() => { setActiveTab('rekap_remaja'); setShowForm(false); }}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${activeTab === 'rekap_remaja'
                    ? `${theme.bgSolid} text-white shadow-sm ${theme.shadow}`
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                  }`}
              >
                Rekapitulasi Remaja
              </button>
              <button
                onClick={() => { setActiveTab('rekap_lansia'); setShowForm(false); }}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${activeTab === 'rekap_lansia'
                    ? `${theme.bgSolid} text-white shadow-sm ${theme.shadow}`
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                  }`}
              >
                Rekapitulasi Lansia
              </button>
            </div>

            {/* Action Button & Title based on Tab */}


            {/* FORM INPUT (Dynamic based on Tab) */}
            {showForm && (
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Data berhasil disimpan!'); setShowForm(false); }}>
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Entry Data Baru</h3>
                    <button type="button" onClick={() => setShowForm(false)} className={`text-sm font-medium ${theme.text} hover:${theme.textLight} flex items-center gap-1 transition-colors`}>
                      <ArrowLeft className="w-4 h-4" /> Kembali
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Bulan</label>
                      <select value={formBulan} onChange={e => setFormBulan(parseInt(e.target.value))} className="block w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>Bulan {i + 1}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Tahun</label>
                      <input type="number" value={formTahun} onChange={e => setFormTahun(parseInt(e.target.value))} className="block w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                    </div>
                  </div>

                  {/* Form Fields based on Active Tab */}
                  {activeTab === 'hasil_kegiatan' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Ibu Hamil & Menyusui */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2"><Heart className="w-4 h-4 text-rose-500" /> Ibu Hamil & Menyusui</h4>
                        <div>
                          <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">Jumlah Ibu Hamil</label>
                          <input type="number" className="block w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">Diperiksa</label>
                          <input type="number" className="block w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">Mendapat FE Tab</label>
                          <input type="number" className="block w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">Jumlah Ibu Menyusui</label>
                          <input type="number" className="block w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                        </div>
                      </div>

                      {/* Akseptor KB */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2"><ClipboardList className="w-4 h-4 text-emerald-500" /> Akseptor KB</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div><label className="text-xs">Kondom</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm" /></div>
                          <div><label className="text-xs">Pil</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm" /></div>
                          <div><label className="text-xs">Implant</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm" /></div>
                          <div><label className="text-xs">Suntik</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm" /></div>
                        </div>
                      </div>

                      {/* Penimbangan */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2"><Baby className="w-4 h-4 text-blue-500" /> Penimbangan Balita</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div><label className="text-xs">Jml Balita (S)</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm" /></div>
                          <div><label className="text-xs">Ditimbang (D)</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm" /></div>
                          <div><label className="text-xs">Naik (N)</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm" /></div>
                          <div><label className="text-xs">Vit A</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm" /></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'rekap_bumil' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Kehadiran */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-800 dark:text-white">Kehadiran</h4>
                        <div><label className="text-xs">Bumil Datang</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                        <div><label className="text-xs">Busui Datang</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                      </div>
                      {/* Pemeriksaan */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-800 dark:text-white">Pemeriksaan (BB & LILA)</h4>
                        <div><label className="text-xs">BB Normal (Hijau)</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                        <div><label className="text-xs">BB Kurang (Merah)</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                        <div><label className="text-xs">LILA Normal</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                        <div><label className="text-xs">LILA KEK (Merah)</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                      </div>
                      {/* Intervensi */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-800 dark:text-white">Intervensi</h4>
                        <div><label className="text-xs">Konsumsi TTD</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                        <div><label className="text-xs">Konsumsi PMT</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'rekap_bayi' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-800 dark:text-white">Kehadiran</h4>
                        <div><label className="text-xs">Bayi Datang</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                        <div><label className="text-xs">Balita Datang</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-800 dark:text-white">Penimbangan (N/T)</h4>
                        <div><label className="text-xs">BB Naik (N)</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                        <div><label className="text-xs">BB Tidak Naik (T)</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-800 dark:text-white">Intervensi</h4>
                        <div><label className="text-xs">ASI Eksklusif</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                        <div><label className="text-xs">Dapat Vit A</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'rekap_remaja' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-800 dark:text-white">Kehadiran</h4>
                        <div><label className="text-xs">Usia 6-14 Th Datang</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                        <div><label className="text-xs">Usia 15-18 Th Datang</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-800 dark:text-white">Status Gizi (IMT)</h4>
                        <div><label className="text-xs">Normal</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                        <div><label className="text-xs">Kurus/Sangat Kurus</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                        <div><label className="text-xs">Gemuk/Obesitas</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-800 dark:text-white">Pemeriksaan</h4>
                        <div><label className="text-xs">Anemia (Remaja Putri)</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'rekap_lansia' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-800 dark:text-white">Pemeriksaan Fisik</h4>
                        <div><label className="text-xs">Tensi Tinggi</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                        <div><label className="text-xs">Gula Darah Tinggi</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-800 dark:text-white">Kemandirian (AKS)</h4>
                        <div><label className="text-xs">Mandiri (A)</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                        <div><label className="text-xs">Ketergantungan (B/C)</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-800 dark:text-white">Skrining SKILAS</h4>
                        <div><label className="text-xs">Penurunan Kognitif</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                        <div><label className="text-xs">Gangguan Gerak</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
                      </div>
                    </div>
                  )}

                  {/* Form buttons */}
                  <div className="flex items-center justify-end gap-3 mt-6">
                    <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-xl transition-all">Batal</button>
                    <button type="submit" className={`${theme.bgSolid} ${theme.hoverSolid} text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg ${theme.shadow} flex items-center gap-2`}>
                      <Save className="w-5 h-5" /> Simpan Data
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* DATA TABLE (Dynamic based on Tab) */}
            {!showForm && activeTab === 'hasil_kegiatan' && (
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Data Hasil Kegiatan</h2>
                    <p className="text-sm text-slate-500">Laporan Bulanan Posyandu</p>
                  </div>
                  <button
                    onClick={exportToExcel}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm w-full md:w-auto"
                  >
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
                    <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-700 dark:text-slate-200">
                      <tr>
                        <th className="px-4 py-3">No</th>
                        <th className="px-4 py-3">Bulan/Tahun</th>
                        <th className="px-4 py-3">Ibu Hamil</th>
                        <th className="px-4 py-3">Ibu Menyusui</th>
                        <th className="px-4 py-3">Akseptor KB (Total)</th>
                        <th className="px-4 py-3">Balita (S/D)</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dummyHasilKegiatan.map((row, index) => {
                        const totalKB = row.kb.kondom + row.kb.pil + row.kb.implant + row.kb.mop + row.kb.mow + row.kb.iud + row.kb.suntik + row.kb.lainnya;
                        const totalS = row.timbang.s_l + row.timbang.s_p;
                        const totalD = row.timbang.d_l + row.timbang.d_p;

                        return (
                          <Fragment key={row.id}>
                            <tr
                              onClick={() => { setSelectedReportForDetail(row); setIsDetailModalOpen(true); }}
                              className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-700/20 transition-colors cursor-pointer"
                            >
                              <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{index + 1}</td>
                              <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{row.bulan}/{row.tahun}</td>
                              <td className="px-4 py-3">{row.bumil.jml}</td>
                              <td className="px-4 py-3">{row.busui}</td>
                              <td className="px-4 py-3">{totalKB}</td>
                              <td className="px-4 py-3">{totalS}/{totalD}</td>
                              <td className="px-4 py-3"><span className={`${theme.text} text-xs font-medium ${theme.bgLight} px-2.5 py-1 rounded-full`}>Tersimpan</span></td>
                            </tr>

                          </Fragment>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}



            {/* TABLE FOR REKAP BUMIL */}
            {!showForm && activeTab === 'rekap_bumil' && (
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Rekapitulasi Ibu Hamil/Nifas/Menyusui</h2>
                    <p className="text-sm text-slate-500">Laporan Bulanan Posyandu</p>
                  </div>
                  {isPosyandu && !showForm && (
                    <button
                      onClick={() => setShowForm(true)}
                      className={`${theme.bgSolid} ${theme.hoverSolid} text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-lg ${theme.shadow} flex items-center justify-center gap-2 text-sm w-full md:w-auto`}
                    >
                      <Plus className="w-4 h-4" /> Tambah Data
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
                    <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-700 dark:text-slate-200">
                      <tr>
                        <th className="px-4 py-3">No</th>
                        <th className="px-4 py-3">Bulan/Tahun</th>
                        <th className="px-4 py-3">Bumil Datang</th>
                        <th className="px-4 py-3">Busui Datang</th>
                        <th className="px-4 py-3">BB Kurang (Merah)</th>
                        <th className="px-4 py-3">LILA KEK (Merah)</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dummyRekapBumil.map((row, index) => (
                        <Fragment key={row.id}>
                          <tr
                            onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                            className={`border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-700/20 transition-colors cursor-pointer ${expandedRow === row.id ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}
                          >
                            <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{index + 1}</td>
                            <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{row.bulan}/{row.tahun}</td>
                            <td className="px-4 py-3">{row.datang.bumil}</td>
                            <td className="px-4 py-3">{row.datang.busui}</td>
                            <td className="px-4 py-3 text-rose-600 font-medium">{row.bb.merah}</td>
                            <td className="px-4 py-3 text-rose-600 font-medium">{row.lila.merah}</td>
                            <td className="px-4 py-3"><span className="text-emerald-600 text-xs font-medium bg-emerald-50 px-2.5 py-1 rounded-full">Tersimpan</span></td>
                          </tr>
                          {expandedRow === row.id && (
                            <tr className="bg-slate-50 dark:bg-zinc-900/50">
                              <td colSpan={7} className="px-4 py-4">
                                <div className="space-y-4">
                                  <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <ClipboardList className="w-4 h-4 text-emerald-500" />
                                    Detail Rekapitulasi Bumil (Bulan {row.bulan})
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-slate-200 shadow-sm">
                                      <h5 className="font-semibold mb-2">Kehadiran</h5>
                                      <div className="text-sm space-y-1">
                                        <div className="flex justify-between"><span>Bumil Datang:</span><span>{row.datang.bumil}</span></div>
                                        <div className="flex justify-between"><span>Bumil Tidak Datang:</span><span>{row.tidakDatang.bumil}</span></div>
                                      </div>
                                    </div>
                                    <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-slate-200 shadow-sm">
                                      <h5 className="font-semibold mb-2">Pemeriksaan</h5>
                                      <div className="text-sm space-y-1">
                                        <div className="flex justify-between"><span>BB Normal:</span><span>{row.bb.hijau}</span></div>
                                        <div className="flex justify-between"><span>BB Merah:</span><span className="text-rose-600 font-medium">{row.bb.merah}</span></div>
                                      </div>
                                    </div>
                                    <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-slate-200 shadow-sm">
                                      <h5 className="font-semibold mb-2">Intervensi</h5>
                                      <div className="text-sm space-y-1">
                                        <div className="flex justify-between"><span>Konsumsi TTD:</span><span>{row.ttd.tiapHari}</span></div>
                                        <div className="flex justify-between"><span>Konsumsi PMT:</span><span>{row.pmt.tiapHari}</span></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TABLE FOR REKAP BAYI */}
            {!showForm && activeTab === 'rekap_bayi' && (
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Rekapitulasi Bayi, Balita dan Apras</h2>
                    <p className="text-sm text-slate-500">Laporan Bulanan Posyandu</p>
                  </div>
                  {isPosyandu && !showForm && (
                    <button
                      onClick={() => setShowForm(true)}
                      className={`${theme.bgSolid} ${theme.hoverSolid} text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-lg ${theme.shadow} flex items-center justify-center gap-2 text-sm w-full md:w-auto`}
                    >
                      <Plus className="w-4 h-4" /> Tambah Data
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
                    <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-700 dark:text-slate-200">
                      <tr>
                        <th className="px-4 py-3">No</th>
                        <th className="px-4 py-3">Bulan/Tahun</th>
                        <th className="px-4 py-3">Bayi Datang</th>
                        <th className="px-4 py-3">Balita Datang</th>
                        <th className="px-4 py-3">BB Naik</th>
                        <th className="px-4 py-3">ASI Eksklusif</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dummyRekapBayi.map((row, index) => (
                        <Fragment key={row.id}>
                          <tr
                            onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                            className={`border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-700/20 transition-colors cursor-pointer ${expandedRow === row.id ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}
                          >
                            <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{index + 1}</td>
                            <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{row.bulan}/{row.tahun}</td>
                            <td className="px-4 py-3">{row.datang.bayi}</td>
                            <td className="px-4 py-3">{row.datang.balita}</td>
                            <td className="px-4 py-3">{row.bb.naik}</td>
                            <td className="px-4 py-3">{row.asi}</td>
                            <td className="px-4 py-3"><span className="text-emerald-600 text-xs font-medium bg-emerald-50 px-2.5 py-1 rounded-full">Tersimpan</span></td>
                          </tr>
                          {expandedRow === row.id && (
                            <tr className="bg-slate-50 dark:bg-zinc-900/50">
                              <td colSpan={7} className="px-4 py-4">
                                <div className="space-y-4">
                                  <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <ClipboardList className="w-4 h-4 text-emerald-500" />
                                    Detail Rekapitulasi Bayi (Bulan {row.bulan})
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-slate-200 shadow-sm">
                                      <h5 className="font-semibold mb-2">Kehadiran</h5>
                                      <div className="text-sm space-y-1">
                                        <div className="flex justify-between"><span>Bayi Datang:</span><span>{row.datang.bayi}</span></div>
                                        <div className="flex justify-between"><span>Balita Datang:</span><span>{row.datang.balita}</span></div>
                                      </div>
                                    </div>
                                    <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-slate-200 shadow-sm">
                                      <h5 className="font-semibold mb-2">Penimbangan</h5>
                                      <div className="text-sm space-y-1">
                                        <div className="flex justify-between"><span>BB Naik:</span><span>{row.bb.naik}</span></div>
                                        <div className="flex justify-between"><span>BB Tidak Naik:</span><span>{row.bb.tidak}</span></div>
                                      </div>
                                    </div>
                                    <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-slate-200 shadow-sm">
                                      <h5 className="font-semibold mb-2">Intervensi</h5>
                                      <div className="text-sm space-y-1">
                                        <div className="flex justify-between"><span>ASI Eksklusif:</span><span>{row.asi}</span></div>
                                        <div className="flex justify-between"><span>Vit A:</span><span>{row.vitA}</span></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TABLE FOR REKAP REMAJA */}
            {!showForm && activeTab === 'rekap_remaja' && (
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Rekapitulasi Usia Sekolah dan Remaja</h2>
                    <p className="text-sm text-slate-500">Laporan Bulanan Posyandu</p>
                  </div>
                  {isPosyandu && !showForm && (
                    <button
                      onClick={() => setShowForm(true)}
                      className={`${theme.bgSolid} ${theme.hoverSolid} text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-lg ${theme.shadow} flex items-center justify-center gap-2 text-sm w-full md:w-auto`}
                    >
                      <Plus className="w-4 h-4" /> Tambah Data
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
                    <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-700 dark:text-slate-200">
                      <tr>
                        <th className="px-4 py-3">No</th>
                        <th className="px-4 py-3">Bulan/Tahun</th>
                        <th className="px-4 py-3">6-14 Th Datang</th>
                        <th className="px-4 py-3">15-18 Th Datang</th>
                        <th className="px-4 py-3">IMT Normal</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-sm text-slate-500">Belum ada data untuk Rekapitulasi Remaja</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TABLE FOR REKAP LANSIA */}
            {!showForm && activeTab === 'rekap_lansia' && (
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Rekapitulasi Dewasa dan Lansia</h2>
                    <p className="text-sm text-slate-500">Laporan Bulanan Posyandu</p>
                  </div>
                  {isPosyandu && !showForm && (
                    <button
                      onClick={() => setShowForm(true)}
                      className={`${theme.bgSolid} ${theme.hoverSolid} text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-lg ${theme.shadow} flex items-center justify-center gap-2 text-sm w-full md:w-auto`}
                    >
                      <Plus className="w-4 h-4" /> Tambah Data
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
                    <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-700 dark:text-slate-200">
                      <tr>
                        <th className="px-4 py-3">No</th>
                        <th className="px-4 py-3">Bulan/Tahun</th>
                        <th className="px-4 py-3">Tensi Tinggi</th>
                        <th className="px-4 py-3">Gula Darah Tinggi</th>
                        <th className="px-4 py-3">Mandiri</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-sm text-slate-500">Belum ada data untuk Rekapitulasi Lansia</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (role === 'SUPERADMIN' && !selectedKecamatan) ? (
        // Level 1: Pilih Kecamatan (Khusus Superadmin)
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Pilih Kecamatan</h2>
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
                    <tr key={kec.name} className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-700/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{kec.name}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setSelectedKecamatan(kec.name)} className={`${theme.text} hover:${theme.textLight} font-medium text-xs`}>Pilih</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : !selectedDesa ? (
        // Level 2: Pilih Desa
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
            {role === 'SUPERADMIN' && (
              <button
                onClick={() => setSelectedKecamatan('')}
                className={`p-2 ${theme.bgLight} ${theme.bgDarkLight} ${theme.text} dark:${theme.textDark} rounded-full ${theme.hoverLight} dark:hover:bg-emerald-900/50 transition-colors mb-2`}
                title="Kembali ke Daftar Kecamatan"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Pilih Desa {role === 'SUPERADMIN' ? `di Kec. ${currentKecName}` : ''}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
                <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-700 dark:text-slate-200">
                  <tr>
                    <th className="px-6 py-4">Nama Desa</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {myKec?.desas.map((desa) => (
                    <tr key={desa} className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-700/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{desa}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setSelectedDesa(desa)} className={`${theme.text} hover:${theme.textLight} font-medium text-xs`}>Pilih</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        // Level 3: List Posyandu
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              {role !== 'OPERATOR_DESA' && (
                <button
                  onClick={() => setSelectedDesa('')}
                  className={`p-2 ${theme.bgLight} ${theme.bgDarkLight} ${theme.text} dark:${theme.textDark} rounded-full ${theme.hoverLight} dark:hover:bg-emerald-900/50 transition-colors`}
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
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {[`Posyandu ${selectedDesa} I`, `Posyandu ${selectedDesa} II`, `Posyandu ${selectedDesa} III`].map((pos) => (
                  <tr key={pos} className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{pos}</td>
                    <td className="px-6 py-4"><span className={`${theme.text} text-xs font-medium ${theme.bgLight} px-2.5 py-1 rounded-full`}>Aktif</span></td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setSelectedPosyandu(pos)} className={`${theme.text} hover:${theme.textLight} font-medium text-xs`}>Buka Data</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Detail Hasil Kegiatan */}
      <AnimatePresence>
        {isDetailModalOpen && selectedReportForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-100 dark:border-zinc-800"
            >
              <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${theme.bgGradient}`}></div>
              
              <div className="p-6 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <ClipboardList className={`w-5 h-5 ${theme.text}`} />
                      Detail Hasil Kegiatan
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                      Bulan {selectedReportForDetail.bulan} / Tahun {selectedReportForDetail.tahun}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 dark:bg-zinc-800 text-slate-400 hover:text-slate-500 dark:hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Ibu Hamil */}
                  <div className="bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
                    <h5 className="font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500" /> Ibu Hamil
                    </h5>
                    <div className="text-sm text-slate-600 dark:text-zinc-400 space-y-1">
                      <div className="flex justify-between"><span>Jumlah:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.bumil.jml}</span></div>
                      <div className="flex justify-between"><span>Diperiksa:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.bumil.diperiksa}</span></div>
                      <div className="flex justify-between"><span>FE Tab:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.bumil.fe}</span></div>
                    </div>
                  </div>

                  {/* KB */}
                  <div className="bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
                    <h5 className="font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-emerald-500" /> Akseptor KB
                    </h5>
                    <div className="text-sm text-slate-600 dark:text-zinc-400 space-y-1">
                      <div className="flex justify-between"><span>Kondom:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.kb.kondom}</span></div>
                      <div className="flex justify-between"><span>Pil:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.kb.pil}</span></div>
                      <div className="flex justify-between"><span>Implant:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.kb.implant}</span></div>
                      <div className="flex justify-between"><span>Suntik:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.kb.suntik}</span></div>
                    </div>
                  </div>

                  {/* Penimbangan */}
                  <div className="bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
                    <h5 className="font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                      <Baby className="w-4 h-4 text-blue-500" /> Penimbangan
                    </h5>
                    <div className="text-sm text-slate-600 dark:text-zinc-400 space-y-1">
                      <div className="flex justify-between"><span>Sasaran (S):</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.timbang.s_l + selectedReportForDetail.timbang.s_p}</span></div>
                      <div className="flex justify-between"><span>Ditimbang (D):</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.timbang.d_l + selectedReportForDetail.timbang.d_p}</span></div>
                      <div className="flex justify-between"><span>Naik (N):</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.timbang.n_l + selectedReportForDetail.timbang.n_p}</span></div>
                      <div className="flex justify-between"><span>Vit A:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.timbang.vitA_l + selectedReportForDetail.timbang.vitA_p}</span></div>
                    </div>
                  </div>

                  {/* Imunisasi */}
                  <div className="bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
                    <h5 className="font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                      <Syringe className="w-4 h-4 text-violet-500" /> Imunisasi
                    </h5>
                    <div className="text-sm text-slate-600 dark:text-zinc-400 space-y-1">
                      <div className="flex justify-between"><span>TT I:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.imTT.i}</span></div>
                      <div className="flex justify-between"><span>BCG:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.imBayi.bcg_l + selectedReportForDetail.imBayi.bcg_p}</span></div>
                      <div className="flex justify-between"><span>Campak:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.imBayi.campak_l + selectedReportForDetail.imBayi.campak_p}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
