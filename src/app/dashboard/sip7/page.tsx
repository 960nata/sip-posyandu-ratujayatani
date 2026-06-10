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
  const canEdit = isPosyandu || role === 'OPERATOR_DESA' || role === 'SUPERADMIN'

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

  const [tahunAktif, setTahunAktif] = useState(2026)
  const [namaDesa, setNamaDesa] = useState('Adijaya')

  const userKecamatanNama = (session?.user as any)?.kecamatanNama
  const currentKecName = role === 'SUPERADMIN' ? selectedKecamatan : (userKecamatanNama || 'Batanghari')
  const myKec = regionData.find(k => k.name === currentKecName)

  // Form States & ID
  const initialForm = {
    bulan: 5,
    tahun: 2026,
    posyanduId: '',
    // Ibu Hamil
    bumilJml: 0,
    bumilDiperiksa: 0,
    bumilFeTab: 0,
    // Ibu Menyusui
    busuiJml: 0,
    // KB
    kbKondom: 0,
    kbPil: 0,
    kbImplant: 0,
    kbMop: 0,
    kbMow: 0,
    kbIud: 0,
    kbSuntik: 0,
    kbLainnya: 0,
    // Penimbangan
    timbangS_L: 0, timbangS_P: 0,
    timbangK_L: 0, timbangK_P: 0,
    timbangD_L: 0, timbangD_P: 0,
    timbangN_L: 0, timbangN_P: 0,
    timbangVitA_L: 0, timbangVitA_P: 0,
    timbangPmt_L: 0, timbangPmt_P: 0,
    // Imunisasi bumil
    imTT: 0,
    // Imunisasi bayi
    imBCG_L: 0, imBCG_P: 0,
    imDPT1_L: 0, imDPT1_P: 0,
    imDPT2_L: 0, imDPT2_P: 0,
    imDPT3_L: 0, imDPT3_P: 0,
    imPolio1_L: 0, imPolio1_P: 0,
    imPolio2_L: 0, imPolio2_P: 0,
    imPolio3_L: 0, imPolio3_P: 0,
    imPolio4_L: 0, imPolio4_P: 0,
    imCampak_L: 0, imCampak_P: 0,
    imHepB1_L: 0, imHepB1_P: 0,
    imHepB2_L: 0, imHepB2_P: 0,
    imHepB3_L: 0, imHepB3_P: 0,
    // Diare balita
    diareJml_L: 0, diareJml_P: 0,
    diareOralit_L: 0, diareOralit_P: 0,
  }

  const [formData7, setFormData7] = useState(initialForm)
  const [editId7, setEditId7] = useState<string | null>(null)
  const [sip6Reports, setSip6Reports] = useState<any[]>([])

  const mapFlatToNested = (r: any) => {
    return {
      id: r.id || Date.now().toString() + Math.random().toString(),
      bulan: parseInt(r.bulan),
      tahun: parseInt(r.tahun),
      posyanduId: r.posyanduId || '',
      bumil: {
        jml: r.jmlBumil || 0,
        diperiksa: r.bumilDiperiksa || 0,
        fe: r.bumilFeTab || 0,
      },
      busui: r.jmlBusui || 0,
      kb: {
        kondom: r.kbKondom || 0,
        pil: r.kbPil || 0,
        implant: r.kbImplant || 0,
        mop: r.kbMOP || 0,
        mow: r.kbMOW || 0,
        iud: r.kbIUD || 0,
        suntik: r.kbSuntik || 0,
        lainnya: r.kbLainnya || 0,
      },
      timbang: {
        s_l: r.balitaS_L || 0,
        s_p: r.balitaS_P || 0,
        k_l: r.balitaK_L || 0,
        k_p: r.balitaK_P || 0,
        d_l: r.balitaD_L || 0,
        d_p: r.balitaD_P || 0,
        n_l: r.balitaN_L || 0,
        n_p: r.balitaN_P || 0,
        vitA_l: r.vitA_L || 0,
        vitA_p: r.vitA_P || 0,
        pmt_l: r.pmt_L || 0,
        pmt_p: r.pmt_P || 0,
      },
      imTT: {
        i: r.imTT || 0,
        ii: 0,
      },
      imBayi: {
        bcg_l: r.imBCG_L || 0,
        bcg_p: r.imBCG_P || 0,
        dpt1_l: r.imDPT1_L || 0,
        dpt1_p: r.imDPT1_P || 0,
        dpt2_l: r.imDPT2_L || 0,
        dpt2_p: r.imDPT2_P || 0,
        dpt3_l: r.imDPT3_L || 0,
        dpt3_p: r.imDPT3_P || 0,
        polio1_l: r.imPolio1_L || 0,
        polio1_p: r.imPolio1_P || 0,
        polio2_l: r.imPolio2_L || 0,
        polio2_p: r.imPolio2_P || 0,
        polio3_l: r.imPolio3_L || 0,
        polio3_p: r.imPolio3_P || 0,
        polio4_l: r.imPolio4_L || 0,
        polio4_p: r.imPolio4_P || 0,
        campak_l: r.imCampak_L || 0,
        campak_p: r.imCampak_P || 0,
        hepb1_l: r.imHepB1_L || 0,
        hepb1_p: r.imHepB1_P || 0,
        hepb2_l: r.imHepB2_L || 0,
        hepb2_p: r.imHepB2_P || 0,
        hepb3_l: r.imHepB3_L || 0,
        hepb3_p: r.imHepB3_P || 0,
      },
      diare: {
        jml_l: r.diareJml_L || 0,
        jml_p: r.diareJml_P || 0,
        oralit_l: r.diareOralit_L || 0,
        oralit_p: r.diareOralit_P || 0,
      },
      status: 'Tersimpan'
    }
  }

  const mapNestedToFlatForm = (r: any) => {
    return {
      bulan: r.bulan,
      tahun: r.tahun,
      posyanduId: r.posyanduId || '',
      bumilJml: r.bumil?.jml || 0,
      bumilDiperiksa: r.bumil?.diperiksa || 0,
      bumilFeTab: r.bumil?.fe || 0,
      busuiJml: r.busui || 0,
      kbKondom: r.kb?.kondom || 0,
      kbPil: r.kb?.pil || 0,
      kbImplant: r.kb?.implant || 0,
      kbMop: r.kb?.mop || 0,
      kbMow: r.kb?.mow || 0,
      kbIud: r.kb?.iud || 0,
      kbSuntik: r.kb?.suntik || 0,
      kbLainnya: r.kb?.lainnya || 0,
      timbangS_L: r.timbang?.s_l || 0,
      timbangS_P: r.timbang?.s_p || 0,
      timbangK_L: r.timbang?.k_l || 0,
      timbangK_P: r.timbang?.k_p || 0,
      timbangD_L: r.timbang?.d_l || 0,
      timbangD_P: r.timbang?.d_p || 0,
      timbangN_L: r.timbang?.n_l || 0,
      timbangN_P: r.timbang?.n_p || 0,
      timbangVitA_L: r.timbang?.vitA_l || 0,
      timbangVitA_P: r.timbang?.vitA_p || 0,
      timbangPmt_L: r.timbang?.pmt_l || 0,
      timbangPmt_P: r.timbang?.pmt_p || 0,
      imTT: r.imTT?.i || 0,
      imBCG_L: r.imBayi?.bcg_l || 0,
      imBCG_P: r.imBayi?.bcg_p || 0,
      imDPT1_L: r.imBayi?.dpt1_l || 0,
      imDPT1_P: r.imBayi?.dpt1_p || 0,
      imDPT2_L: r.imBayi?.dpt2_l || 0,
      imDPT2_P: r.imBayi?.dpt2_p || 0,
      imDPT3_L: r.imBayi?.dpt3_l || 0,
      imDPT3_P: r.imBayi?.dpt3_p || 0,
      imPolio1_L: r.imBayi?.polio1_l || 0,
      imPolio1_P: r.imBayi?.polio1_p || 0,
      imPolio2_L: r.imBayi?.polio2_l || 0,
      imPolio2_P: r.imBayi?.polio2_p || 0,
      imPolio3_L: r.imBayi?.polio3_l || 0,
      imPolio3_P: r.imBayi?.polio3_p || 0,
      imPolio4_L: r.imBayi?.polio4_l || 0,
      imPolio4_P: r.imBayi?.polio4_p || 0,
      imCampak_L: r.imBayi?.campak_l || 0,
      imCampak_P: r.imBayi?.campak_p || 0,
      imHepB1_L: r.imBayi?.hepb1_l || 0,
      imHepB1_P: r.imBayi?.hepb1_p || 0,
      imHepB2_L: r.imBayi?.hepb2_l || 0,
      imHepB2_P: r.imBayi?.hepb2_p || 0,
      imHepB3_L: r.imBayi?.hepb3_l || 0,
      imHepB3_P: r.imBayi?.hepb3_p || 0,
      diareJml_L: r.diare?.jml_l || 0,
      diareJml_P: r.diare?.jml_p || 0,
      diareOralit_L: r.diare?.oralit_l || 0,
      diareOralit_P: r.diare?.oralit_p || 0,
    }
  }

  const mapFlatFormToNested = (f: typeof initialForm, id: string) => {
    return {
      id,
      bulan: f.bulan,
      tahun: f.tahun,
      posyanduId: f.posyanduId,
      bumil: {
        jml: f.bumilJml,
        diperiksa: f.bumilDiperiksa,
        fe: f.bumilFeTab,
      },
      busui: f.busuiJml,
      kb: {
        kondom: f.kbKondom,
        pil: f.kbPil,
        implant: f.kbImplant,
        mop: f.kbMop,
        mow: f.kbMow,
        iud: f.kbIud,
        suntik: f.kbSuntik,
        lainnya: f.kbLainnya,
      },
      timbang: {
        s_l: f.timbangS_L,
        s_p: f.timbangS_P,
        k_l: f.timbangK_L,
        k_p: f.timbangK_P,
        d_l: f.timbangD_L,
        d_p: f.timbangD_P,
        n_l: f.timbangN_L,
        n_p: f.timbangN_P,
        vitA_l: f.timbangVitA_L,
        vitA_p: f.timbangVitA_P,
        pmt_l: f.timbangPmt_L,
        pmt_p: f.timbangPmt_P,
      },
      imTT: {
        i: f.imTT,
        ii: 0,
      },
      imBayi: {
        bcg_l: f.imBCG_L,
        bcg_p: f.imBCG_P,
        dpt1_l: f.imDPT1_L,
        dpt1_p: f.imDPT1_P,
        dpt2_l: f.imDPT2_L,
        dpt2_p: f.imDPT2_P,
        dpt3_l: f.imDPT3_L,
        dpt3_p: f.imDPT3_P,
        polio1_l: f.imPolio1_L,
        polio1_p: f.imPolio1_P,
        polio2_l: f.imPolio2_L,
        polio2_p: f.imPolio2_P,
        polio3_l: f.imPolio3_L,
        polio3_p: f.imPolio3_P,
        polio4_l: f.imPolio4_L,
        polio4_p: f.imPolio4_P,
        campak_l: f.imCampak_L,
        campak_p: f.imCampak_P,
        hepb1_l: f.imHepB1_L,
        hepb1_p: f.imHepB1_P,
        hepb2_l: f.imHepB2_L,
        hepb2_p: f.imHepB2_P,
        hepb3_l: f.imHepB3_L,
        hepb3_p: f.imHepB3_P,
      },
      diare: {
        jml_l: f.diareJml_L,
        jml_p: f.diareJml_P,
        oralit_l: f.diareOralit_L,
        oralit_p: f.diareOralit_P,
      },
      status: 'Tersimpan'
    }
  }

  // Dummy Data for SIP 7 (Hasil Kegiatan)
  const [dummyHasilKegiatan, setDummyHasilKegiatan] = useState<any[]>([
    {
      id: '1', bulan: 1, tahun: 2026, posyanduId: '1',
      bumil: { jml: 15, diperiksa: 15, fe: 15 },
      busui: 89,
      kb: { kondom: 5, pil: 40, implant: 30, mop: 0, mow: 1, iud: 2, suntik: 98, lainnya: 0 },
      timbang: { s_l: 108, s_p: 108, k_l: 108, k_p: 108, d_l: 80, d_p: 92, n_l: 76, n_p: 60, vitA_l: 0, vitA_p: 0, pmt_l: 108, pmt_p: 108 },
      imTT: { i: 1, ii: 1 },
      imBayi: {
        bcg_l: 0, bcg_p: 2, dpt1_l: 2, dpt1_p: 3, dpt2_l: 3, dpt2_p: 1, dpt3_l: 2, dpt3_p: 1,
        polio1_l: 0, polio1_p: 2, polio2_l: 2, polio2_p: 3, polio3_l: 3, polio3_p: 1, polio4_l: 2, polio4_p: 2,
        campak_l: 3, campak_p: 0, hepb1_l: 0, hepb1_p: 0, hepb2_l: 0, hepb2_p: 0, hepb3_l: 0, hepb3_p: 0
      },
      diare: { jml_l: 0, jml_p: 0, oralit_l: 0, oralit_p: 0 },
      status: 'Tersimpan'
    },
    {
      id: '2', bulan: 2, tahun: 2026, posyanduId: '1',
      bumil: { jml: 18, diperiksa: 18, fe: 18 },
      busui: 86,
      kb: { kondom: 20, pil: 29, implant: 10, mop: 0, mow: 1, iud: 2, suntik: 91, lainnya: 0 },
      timbang: { s_l: 98, s_p: 117, k_l: 98, k_p: 117, d_l: 88, d_p: 80, n_l: 69, n_p: 69, vitA_l: 95, vitA_p: 95, pmt_l: 105, pmt_p: 105 },
      imTT: { i: 3, ii: 0 },
      imBayi: {
        bcg_l: 0, bcg_p: 1, dpt1_l: 1, dpt1_p: 2, dpt2_l: 2, dpt2_p: 1, dpt3_l: 2, dpt3_p: 0,
        polio1_l: 0, polio1_p: 1, polio2_l: 1, polio2_p: 2, polio3_l: 2, polio3_p: 1, polio4_l: 2, polio4_p: 1,
        campak_l: 2, campak_p: 0, hepb1_l: 0, hepb1_p: 0, hepb2_l: 0, hepb2_p: 0, hepb3_l: 0, hepb3_p: 0
      },
      diare: { jml_l: 0, jml_p: 0, oralit_l: 0, oralit_p: 0 },
      status: 'Tersimpan'
    },
    {
      id: '3', bulan: 3, tahun: 2026, posyanduId: '1',
      bumil: { jml: 20, diperiksa: 20, fe: 20 },
      busui: 90,
      kb: { kondom: 28, pil: 30, implant: 30, mop: 0, mow: 1, iud: 1, suntik: 68, lainnya: 0 },
      timbang: { s_l: 105, s_p: 115, k_l: 105, k_p: 115, d_l: 81, d_p: 97, n_l: 78, n_p: 60, vitA_l: 0, vitA_p: 0, pmt_l: 103, pmt_p: 104 },
      imTT: { i: 4, ii: 0 },
      imBayi: {
        bcg_l: 1, bcg_p: 1, dpt1_l: 0, dpt1_p: 1, dpt2_l: 0, dpt2_p: 0, dpt3_l: 1, dpt3_p: 1,
        polio1_l: 0, polio1_p: 0, polio2_l: 1, polio2_p: 1, polio3_l: 0, polio3_p: 0, polio4_l: 1, polio4_p: 2,
        campak_l: 2, campak_p: 0, hepb1_l: 0, hepb1_p: 0, hepb2_l: 0, hepb2_p: 0, hepb3_l: 0, hepb3_p: 0
      },
      diare: { jml_l: 0, jml_p: 0, oralit_l: 0, oralit_p: 0 },
      status: 'Tersimpan'
    },
    {
      id: '4', bulan: 4, tahun: 2026, posyanduId: '1',
      bumil: { jml: 25, diperiksa: 25, fe: 25 },
      busui: 88,
      kb: { kondom: 18, py: 20, pil: 20, implant: 49, mop: 0, mow: 0, iud: 1, suntik: 83, lainnya: 0 },
      timbang: { s_l: 97, s_p: 115, k_l: 97, k_p: 115, d_l: 75, d_p: 87, n_l: 70, n_p: 60, vitA_l: 0, vitA_p: 0, pmt_l: 105, pmt_p: 106 },
      imTT: { i: 5, ii: 0 },
      imBayi: {
        bcg_l: 2, bcg_p: 0, dpt1_l: 1, dpt1_p: 0, dpt2_l: 1, dpt2_p: 1, dpt3_l: 0, dpt3_p: 2,
        polio1_l: 0, polio1_p: 0, polio2_l: 1, polio2_p: 0, polio3_l: 1, polio3_p: 1, polio4_l: 0, polio4_p: 2,
        campak_l: 1, campak_p: 0, hepb1_l: 0, hepb1_p: 0, hepb2_l: 0, hepb2_p: 0, hepb3_l: 0, hepb3_p: 0
      },
      diare: { jml_l: 0, jml_p: 0, oralit_l: 0, oralit_p: 0 },
      status: 'Tersimpan'
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

  useEffect(() => {
    setMounted(true)
    
    // Load config from settings
    const savedDesa = localStorage.getItem('sip_nama_desa') || 'Adijaya'
    const savedTahun = localStorage.getItem('sip_tahun_aktif') || '2026'
    setNamaDesa(savedDesa)
    setTahunAktif(parseInt(savedTahun))
    setFormData7(prev => ({ ...prev, tahun: parseInt(savedTahun) }))

    if (isPosyandu) {
      setSelectedDesa(savedDesa)
      setSelectedPosyandu(`Posyandu ${savedDesa} I`)
    }
    if (role === 'OPERATOR_DESA') {
      const userName = session?.user?.name || ''
      const desaName = userName.replace('Admin Desa ', '')
      if (desaName) setSelectedDesa(desaName)
    }

    // Load SIP 6 reports for reference/sync
    const savedSip6 = localStorage.getItem('sip6_reports')
    if (savedSip6) {
      setSip6Reports(JSON.parse(savedSip6))
    }

    // Load SIP 7 reports
    const savedSip7 = localStorage.getItem('sip7_reports')
    if (savedSip7) {
      setDummyHasilKegiatan(JSON.parse(savedSip7))
    } else {
      fetch('/api/sip7')
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data) && data.length > 0) {
            const mapped = data.map(r => mapFlatToNested(r))
            setDummyHasilKegiatan(mapped)
            localStorage.setItem('sip7_reports', JSON.stringify(mapped))
          } else {
            localStorage.setItem('sip7_reports', JSON.stringify(dummyHasilKegiatan))
          }
        })
        .catch(err => {
          console.error(err)
          localStorage.setItem('sip7_reports', JSON.stringify(dummyHasilKegiatan))
        })
    }
  }, [isPosyandu, role, session])

  const handleEdit = (report: any) => {
    const flat = mapNestedToFlatForm(report)
    setFormData7(flat)
    setEditId7(report.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      const updated = dummyHasilKegiatan.filter(r => r.id !== id)
      setDummyHasilKegiatan(updated)
      localStorage.setItem('sip7_reports', JSON.stringify(updated))
    }
  }

  const handleAdd = () => {
    const activePosyanduId = isPosyandu ? (session?.user as any)?.posyanduId : selectedPosyandu;
    setFormData7({ 
      ...initialForm, 
      tahun: tahunAktif,
      posyanduId: activePosyanduId 
    })
    setEditId7(null)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validasi angka negatif
    const numericKeys = Object.keys(formData7).filter(key => typeof (formData7 as any)[key] === 'number' && key !== 'bulan' && key !== 'tahun');
    for (const key of numericKeys) {
      if ((formData7 as any)[key] < 0) {
        alert('Nilai input tidak boleh negatif!');
        return;
      }
    }

    const activePosyanduId = isPosyandu ? (session?.user as any)?.posyanduId : selectedPosyandu;

    // Validasi bulan ganda dalam setahun
    const isDuplicate = dummyHasilKegiatan.some(r => 
      r.bulan === formData7.bulan && 
      r.tahun === formData7.tahun && 
      r.posyanduId === activePosyanduId &&
      r.id !== editId7
    );
    if (isDuplicate) {
      alert('Laporan untuk bulan dan tahun ini sudah ada di posyandu terpilih!');
      return;
    }

    // Sync validation with SIP 6
    const matchingSip6 = sip6Reports.find(r => 
      r.bulan === formData7.bulan && 
      r.tahun === formData7.tahun && 
      r.posyanduId === activePosyanduId
    );

    const sip6Hamil = matchingSip6 ? ((matchingSip6.hamilBaru || 0) + (matchingSip6.hamilLama || 0)) : 0;
    const sip6Busui = matchingSip6 ? ((matchingSip6.busuiBaru || 0) + (matchingSip6.busuiLama || 0)) : 0;

    if (formData7.bumilJml !== sip6Hamil || formData7.busuiJml !== sip6Busui) {
      const confirmSync = confirm(
        `Peringatan: Jumlah Ibu Hamil (${formData7.bumilJml}) atau Ibu Menyusui (${formData7.busuiJml}) berbeda dengan data SIP 6 (${sip6Hamil} Hamil, ${sip6Busui} Menyusui). Apakah Anda yakin ingin menyimpan dengan data yang berbeda?`
      );
      if (!confirmSync) return;
    }

    const newReport = mapFlatFormToNested(formData7, editId7 || Date.now().toString());
    const updated = editId7
      ? dummyHasilKegiatan.map(r => r.id === editId7 ? newReport : r)
      : [newReport, ...dummyHasilKegiatan];

    setDummyHasilKegiatan(updated)
    localStorage.setItem('sip7_reports', JSON.stringify(updated))

    alert('Data SIP 7 berhasil disimpan!')
    setShowForm(false)
    setFormData7(initialForm)
    setEditId7(null)
  }

  const getTotals7 = (months: number[]) => {
    const activePosyanduId = isPosyandu ? (session?.user as any)?.posyanduId : selectedPosyandu;
    const filtered = dummyHasilKegiatan.filter(r => 
      r.tahun === tahunAktif && 
      (isPosyandu || r.posyanduId === activePosyanduId || !activePosyanduId) &&
      months.includes(r.bulan)
    );
    
    return {
      bumil: filtered.reduce((sum, r) => sum + (r.bumil?.jml || 0), 0),
      bumilDiperiksa: filtered.reduce((sum, r) => sum + (r.bumil?.diperiksa || 0), 0),
      feTab: filtered.reduce((sum, r) => sum + (r.bumil?.fe || 0), 0),
      busui: filtered.reduce((sum, r) => sum + (r.busui || 0), 0),
      kb: filtered.reduce((sum, r) => {
        const kb = r.kb || {};
        return sum + (kb.kondom || 0) + (kb.pil || 0) + (kb.implant || 0) + (kb.mop || 0) + (kb.mow || 0) + (kb.iud || 0) + (kb.suntik || 0) + (kb.lainnya || 0);
      }, 0),
      timbangS: filtered.reduce((sum, r) => sum + (r.timbang?.s_l || 0) + (r.timbang?.s_p || 0), 0),
      timbangD: filtered.reduce((sum, r) => sum + (r.timbang?.d_l || 0) + (r.timbang?.d_p || 0), 0),
      timbangN: filtered.reduce((sum, r) => sum + (r.timbang?.n_l || 0) + (r.timbang?.n_p || 0), 0),
    }
  }

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n');
        if (lines.length < 2) {
          alert('CSV kosong atau tidak valid!');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const newReports: any[] = [];
        const activePosyanduId = isPosyandu ? (session?.user as any)?.posyanduId : selectedPosyandu;

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          if (values.length < headers.length) continue;

          const rowData: any = {};
          headers.forEach((header, index) => {
            rowData[header] = values[index];
          });

          const bulanTahun = rowData["Bulan"] || rowData["Bulan/Tahun"] || "";
          let bulan = 5;
          let tahun = 2026;
          if (bulanTahun.includes('/')) {
            const parts = bulanTahun.split('/');
            bulan = parseInt(parts[0]) || 5;
            tahun = parseInt(parts[1]) || 2026;
          } else if (rowData["Bulan"] && rowData["Tahun"]) {
            bulan = parseInt(rowData["Bulan"]) || 5;
            tahun = parseInt(rowData["Tahun"]) || 2026;
          }

          const report = {
            id: 'import-' + Date.now() + '-' + i,
            posyanduId: activePosyanduId,
            bulan,
            tahun,
            bumil: {
              jml: parseInt(rowData["Ibu Hamil"] || rowData["Bumil Jml"]) || 0,
              diperiksa: parseInt(rowData["Ibu Hamil Diperiksa"] || rowData["Bumil Diperiksa"]) || 0,
              fe: parseInt(rowData["Ibu Hamil FE"] || rowData["Bumil FE"]) || 0,
            },
            busui: parseInt(rowData["Ibu Menyusui"] || rowData["Busui Jml"]) || 0,
            kb: {
              kondom: parseInt(rowData["KB Kondom"] || rowData["Kondom"]) || 0,
              pil: parseInt(rowData["KB Pil"] || rowData["Pil"]) || 0,
              implant: parseInt(rowData["KB Implant"] || rowData["Implant"]) || 0,
              mop: parseInt(rowData["KB MOP"] || rowData["MOP"]) || 0,
              mow: parseInt(rowData["KB MOW"] || rowData["MOW"]) || 0,
              iud: parseInt(rowData["KB IUD"] || rowData["IUD"]) || 0,
              suntik: parseInt(rowData["KB Suntik"] || rowData["Suntik"]) || 0,
              lainnya: parseInt(rowData["KB Lainnya"] || rowData["KB Lain-lain"] || rowData["Lain-lain"]) || 0,
            },
            timbang: {
              s_l: parseInt(rowData["Timbang S L"] || rowData["S L"]) || 0,
              s_p: parseInt(rowData["Timbang S P"] || rowData["S P"]) || 0,
              k_l: parseInt(rowData["Timbang K L"] || rowData["K L"]) || 0,
              k_p: parseInt(rowData["Timbang K P"] || rowData["K P"]) || 0,
              d_l: parseInt(rowData["Timbang D L"] || rowData["D L"]) || 0,
              d_p: parseInt(rowData["Timbang D P"] || rowData["D P"]) || 0,
              n_l: parseInt(rowData["Timbang N L"] || rowData["N L"]) || 0,
              n_p: parseInt(rowData["Timbang N P"] || rowData["N P"]) || 0,
              vitA_l: parseInt(rowData["Vit A L"]) || 0,
              vitA_p: parseInt(rowData["Vit A P"]) || 0,
              pmt_l: parseInt(rowData["PMT L"]) || 0,
              pmt_p: parseInt(rowData["PMT P"]) || 0,
            },
            imTT: {
              i: parseInt(rowData["Imunisasi TT"] || rowData["TT"]) || 0,
              ii: parseInt(rowData["TT II"]) || 0,
            },
            imBayi: {
              bcg_l: parseInt(rowData["BCG L"]) || 0,
              bcg_p: parseInt(rowData["BCG P"]) || 0,
              dpt1_l: parseInt(rowData["DPT1 L"]) || 0,
              dpt1_p: parseInt(rowData["DPT1 P"]) || 0,
              dpt2_l: parseInt(rowData["DPT2 L"]) || 0,
              dpt2_p: parseInt(rowData["DPT2 P"]) || 0,
              dpt3_l: parseInt(rowData["DPT3 L"]) || 0,
              dpt3_p: parseInt(rowData["DPT3 P"]) || 0,
              polio1_l: parseInt(rowData["Polio1 L"]) || 0,
              polio1_p: parseInt(rowData["Polio1 P"]) || 0,
              polio2_l: parseInt(rowData["Polio2 L"]) || 0,
              polio2_p: parseInt(rowData["Polio2 P"]) || 0,
              polio3_l: parseInt(rowData["Polio3 L"]) || 0,
              polio3_p: parseInt(rowData["Polio3 P"]) || 0,
              polio4_l: parseInt(rowData["Polio4 L"]) || 0,
              polio4_p: parseInt(rowData["Polio4 P"]) || 0,
              campak_l: parseInt(rowData["Campak L"]) || 0,
              campak_p: parseInt(rowData["Campak P"]) || 0,
              hepb1_l: parseInt(rowData["HepB1 L"]) || 0,
              hepb1_p: parseInt(rowData["HepB1 P"]) || 0,
              hepb2_l: parseInt(rowData["HepB2 L"]) || 0,
              hepb2_p: parseInt(rowData["HepB2 P"]) || 0,
              hepb3_l: parseInt(rowData["HepB3 L"]) || 0,
              hepb3_p: parseInt(rowData["HepB3 P"]) || 0,
            },
            diare: {
              jml_l: parseInt(rowData["Diare Jml L"]) || 0,
              jml_p: parseInt(rowData["Diare Jml P"]) || 0,
              oralit_l: parseInt(rowData["Diare Oralit L"]) || 0,
              oralit_p: parseInt(rowData["Diare Oralit P"]) || 0,
            },
            status: 'Tersimpan'
          };
          newReports.push(report);
        }

        if (newReports.length > 0) {
          const merged = [...dummyHasilKegiatan];
          newReports.forEach(nr => {
            const dupIdx = merged.findIndex(r => r.bulan === nr.bulan && r.tahun === nr.tahun && r.posyanduId === nr.posyanduId);
            if (dupIdx !== -1) {
              merged[dupIdx] = nr;
            } else {
              merged.unshift(nr);
            }
          });

          setDummyHasilKegiatan(merged);
          localStorage.setItem('sip7_reports', JSON.stringify(merged));
          alert(`Sukses mengimpor ${newReports.length} data SIP 7!`);
        } else {
          alert('Tidak ada baris data valid yang ditemukan untuk diimpor.');
        }
      } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan saat mem-parsing berkas CSV.');
      }
    };
    reader.readAsText(file);
  };

  const exportUnifiedExcel = () => {
    // 1. Load SIP 6 reports
    const savedSip6 = localStorage.getItem('sip6_reports')
    const localSip6 = savedSip6 ? JSON.parse(savedSip6) : []

    // 2. Build Sheet 1: SIP 6
    const headersSip6 = [
      ['DATA PENGUNJUNG BULAN BULANAN (SIP 6)'],
      [''],
      [
        'NO', 'BULAN', 'TAHUN', 'BAYI BARU L', 'BAYI BARU P', 'BAYI LAMA L', 'BAYI LAMA P',
        'BALITA BARU L', 'BALITA BARU P', 'BALITA LAMA L', 'BALITA LAMA P',
        'ANAK BARU L', 'ANAK BARU P', 'ANAK LAMA L', 'ANAK LAMA P',
        'PROD BARU L', 'PROD BARU P', 'PROD LAMA L', 'PROD LAMA P',
        'IBU HAMIL BARU', 'IBU HAMIL LAMA', 'IBU MENYUSUI BARU', 'IBU MENYUSUI LAMA',
        'LANSIA L', 'LANSIA P', 'WUS', 'IBU', 'KADER', 'PLKB', 'MEDIS',
        'LAHIR L', 'LAHIR P', 'MATI L', 'MATI P', 'KADER NAMA', 'TANGGAL INPUT', 'STATUS'
      ]
    ]

    const activePosyanduId = isPosyandu ? (session?.user as any)?.posyanduId : selectedPosyandu;
    const filteredSip6 = localSip6.filter((r: any) => 
      r.tahun === tahunAktif && 
      (isPosyandu || r.posyanduId === activePosyanduId || !activePosyanduId)
    );

    const dataSip6 = filteredSip6.map((row: any, idx: number) => [
      idx + 1,
      row.bulan,
      row.tahun,
      row.bayiBaruL || 0,
      row.bayiBaruP || 0,
      row.bayiLamaL || 0,
      row.bayiLamaP || 0,
      row.balitaBaruL || 0,
      row.balitaBaruP || 0,
      row.balitaLamaL || 0,
      row.balitaLamaP || 0,
      row.anakBaruL || 0,
      row.anakBaruP || 0,
      row.anakLamaL || 0,
      row.anakLamaP || 0,
      row.prodBaruL || 0,
      row.prodBaruP || 0,
      row.prodLamaL || 0,
      row.prodLamaP || 0,
      row.hamilBaru || 0,
      row.hamilLama || 0,
      row.busuiBaru || 0,
      row.busuiLama || 0,
      row.lansiaL || 0,
      row.lansiaP || 0,
      row.wus || 0,
      row.ibu || 0,
      row.kader || 0,
      row.plkb || 0,
      row.medis || 0,
      row.lahirL || 0,
      row.lahirP || 0,
      row.meninggalL || 0,
      row.meninggalP || 0,
      row.namaKader || '',
      row.tanggalInput || '',
      row.status || 'Tersimpan'
    ])

    const wsSip6 = XLSX.utils.aoa_to_sheet([...headersSip6, ...dataSip6])

    // 3. Build Sheet 2: SIP 7
    const headersSip7 = [
      ['DATA HASIL KEGIATAN KESEHATAN (SIP 7)'],
      [''],
      ['NO', 'BULAN', 'TAHUN', 'IBU HAMIL JML', 'IBU HAMIL DIPERIKSA', 'IBU HAMIL FE TAB', 'IBU MENYUSUI JML', 'KB KONDOM', 'KB PIL', 'KB IMPLANT', 'KB MOP', 'KB MOW', 'KB IUD', 'KB SUNTIK', 'KB LAIN-LAIN', 'TIMBANG S L', 'TIMBANG S P', 'TIMBANG K L', 'TIMBANG K P', 'TIMBANG D L', 'TIMBANG D P', 'TIMBANG N L', 'TIMBANG N P', 'VIT A L', 'VIT A P', 'PMT L', 'PMT P', 'IMUNISASI TT', 'BCG L', 'BCG P', 'DPT1 L', 'DPT1 P', 'DPT2 L', 'DPT2 P', 'DPT3 L', 'DPT3 P', 'POLIO1 L', 'POLIO1 P', 'POLIO2 L', 'POLIO2 P', 'POLIO3 L', 'POLIO3 P', 'POLIO4 L', 'POLIO4 P', 'CAMPAK L', 'CAMPAK P', 'HEPB1 L', 'HEPB1 P', 'HEPB2 L', 'HEPB2 P', 'HEPB3 L', 'HEPB3 P', 'DIARE JML L', 'DIARE JML P', 'DIARE ORALIT L', 'DIARE ORALIT P'],
    ]

    const filteredSip7 = dummyHasilKegiatan.filter((r: any) => 
      r.tahun === tahunAktif && 
      (isPosyandu || r.posyanduId === activePosyanduId || !activePosyanduId)
    );

    const dataSip7 = filteredSip7.map((row: any, idx: number) => {
      const bumil = row.bumil || {};
      const kb = row.kb || {};
      const timbang = row.timbang || {};
      const imBayi = row.imBayi || {};
      const diare = row.diare || {};

      return [
        idx + 1,
        row.bulan,
        row.tahun,
        bumil.jml || 0,
        bumil.diperiksa || 0,
        bumil.fe || 0,
        row.busui || 0,
        kb.kondom || 0,
        kb.pil || 0,
        kb.implant || 0,
        kb.mop || 0,
        kb.mow || 0,
        kb.iud || 0,
        kb.suntik || 0,
        kb.lainnya || 0,
        timbang.s_l || 0,
        timbang.s_p || 0,
        timbang.k_l || 0,
        timbang.k_p || 0,
        timbang.d_l || 0,
        timbang.d_p || 0,
        timbang.n_l || 0,
        timbang.n_p || 0,
        timbang.vitA_l || 0,
        timbang.vitA_p || 0,
        timbang.pmt_l || 0,
        timbang.pmt_p || 0,
        row.imTT?.i || 0,
        imBayi.bcg_l || 0,
        imBayi.bcg_p || 0,
        imBayi.dpt1_l || 0,
        imBayi.dpt1_p || 0,
        imBayi.dpt2_l || 0,
        imBayi.dpt2_p || 0,
        imBayi.dpt3_l || 0,
        imBayi.dpt3_p || 0,
        imBayi.polio1_l || 0,
        imBayi.polio1_p || 0,
        imBayi.polio2_l || 0,
        imBayi.polio2_p || 0,
        imBayi.polio3_l || 0,
        imBayi.polio3_p || 0,
        imBayi.polio4_l || 0,
        imBayi.polio4_p || 0,
        imBayi.campak_l || 0,
        imBayi.campak_p || 0,
        imBayi.hepb1_l || 0,
        imBayi.hepb1_p || 0,
        imBayi.hepb2_l || 0,
        imBayi.hepb2_p || 0,
        imBayi.hepb3_l || 0,
        imBayi.hepb3_p || 0,
        diare.jml_l || 0,
        diare.jml_p || 0,
        diare.oralit_l || 0,
        diare.oralit_p || 0
      ]
    })

    const wsSip7 = XLSX.utils.aoa_to_sheet([...headersSip7, ...dataSip7])

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, wsSip6, 'SIP 6 — Pengunjung')
    XLSX.utils.book_append_sheet(wb, wsSip7, 'SIP 7 — Hasil Kegiatan')

    XLSX.writeFile(wb, `Rekap_Posyandu_${namaDesa}_${tahunAktif}.xlsx`)
  }

  const activePosyanduId = isPosyandu ? (session?.user as any)?.posyanduId : selectedPosyandu;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Data Hasil Kegiatan Bulanan Posyandu</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">Sistem Informasi Posyandu (SIP 7) Desa {namaDesa}</p>
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

            {/* FORM INPUT */}
            {showForm && activeTab === 'hasil_kegiatan' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                          {editId7 ? 'Edit Data Hasil Kegiatan' : 'Entry Data Hasil Kegiatan Baru'}
                        </h3>
                        <button type="button" onClick={() => setShowForm(false)} className={`text-sm font-medium ${theme.text} hover:${theme.textLight} flex items-center gap-1 transition-colors`}>
                          <ArrowLeft className="w-4 h-4" /> Kembali
                        </button>
                      </div>

                      {/* Periode */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-100 dark:border-zinc-700">
                        <div>
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Bulan</label>
                          <select 
                            value={formData7.bulan} 
                            onChange={e => setFormData7(prev => ({ ...prev, bulan: parseInt(e.target.value) }))} 
                            className="block w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                          >
                            {[...Array(12)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>Bulan {i + 1}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Tahun</label>
                          <input 
                            type="number" 
                            value={formData7.tahun} 
                            onChange={e => setFormData7(prev => ({ ...prev, tahun: parseInt(e.target.value) }))} 
                            className="block w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm" 
                            required 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 1. Ibu Hamil & Menyusui */}
                        <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-900/30 space-y-4">
                          <h4 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-200/50 dark:border-zinc-700 pb-2">
                            <Heart className="w-4 h-4 text-rose-500" /> 1. Ibu Hamil & Menyusui
                          </h4>
                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">Jumlah Ibu Hamil</label>
                              <input 
                                type="number" 
                                min="0"
                                value={formData7.bumilJml} 
                                onChange={e => setFormData7(prev => ({ ...prev, bumilJml: parseInt(e.target.value) || 0 }))} 
                                className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">Ibu Hamil Diperiksa</label>
                              <input 
                                type="number" 
                                min="0"
                                value={formData7.bumilDiperiksa} 
                                onChange={e => setFormData7(prev => ({ ...prev, bumilDiperiksa: parseInt(e.target.value) || 0 }))} 
                                className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">Ibu Hamil FE Tab (Besi)</label>
                              <input 
                                type="number" 
                                min="0"
                                value={formData7.bumilFeTab} 
                                onChange={e => setFormData7(prev => ({ ...prev, bumilFeTab: parseInt(e.target.value) || 0 }))} 
                                className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">Jumlah Ibu Menyusui</label>
                              <input 
                                type="number" 
                                min="0"
                                value={formData7.busuiJml} 
                                onChange={e => setFormData7(prev => ({ ...prev, busuiJml: parseInt(e.target.value) || 0 }))} 
                                className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                              />
                            </div>
                          </div>
                        </div>

                        {/* 2. Akseptor KB */}
                        <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-900/30 space-y-4">
                          <h4 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-200/50 dark:border-zinc-700 pb-2">
                            <ClipboardList className="w-4 h-4 text-emerald-500" /> 2. Akseptor KB
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">Kondom</label>
                              <input 
                                type="number" 
                                min="0"
                                value={formData7.kbKondom} 
                                onChange={e => setFormData7(prev => ({ ...prev, kbKondom: parseInt(e.target.value) || 0 }))} 
                                className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">Pil</label>
                              <input 
                                type="number" 
                                min="0"
                                value={formData7.kbPil} 
                                onChange={e => setFormData7(prev => ({ ...prev, kbPil: parseInt(e.target.value) || 0 }))} 
                                className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">Implant</label>
                              <input 
                                type="number" 
                                min="0"
                                value={formData7.kbImplant} 
                                onChange={e => setFormData7(prev => ({ ...prev, kbImplant: parseInt(e.target.value) || 0 }))} 
                                className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">MOP</label>
                              <input 
                                type="number" 
                                min="0"
                                value={formData7.kbMop} 
                                onChange={e => setFormData7(prev => ({ ...prev, kbMop: parseInt(e.target.value) || 0 }))} 
                                className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">MOW</label>
                              <input 
                                type="number" 
                                min="0"
                                value={formData7.kbMow} 
                                onChange={e => setFormData7(prev => ({ ...prev, kbMow: parseInt(e.target.value) || 0 }))} 
                                className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">IUD</label>
                              <input 
                                type="number" 
                                min="0"
                                value={formData7.kbIud} 
                                onChange={e => setFormData7(prev => ({ ...prev, kbIud: parseInt(e.target.value) || 0 }))} 
                                className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">Suntik</label>
                              <input 
                                type="number" 
                                min="0"
                                value={formData7.kbSuntik} 
                                onChange={e => setFormData7(prev => ({ ...prev, kbSuntik: parseInt(e.target.value) || 0 }))} 
                                className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">Lain-lain</label>
                              <input 
                                type="number" 
                                min="0"
                                value={formData7.kbLainnya} 
                                onChange={e => setFormData7(prev => ({ ...prev, kbLainnya: parseInt(e.target.value) || 0 }))} 
                                className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 3. Penimbangan Balita */}
                      <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-900/30 space-y-4">
                        <h4 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-200/50 dark:border-zinc-700 pb-2">
                          <Baby className="w-4 h-4 text-blue-500" /> 3. Penimbangan Balita
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                          <div>
                            <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">Sasaran (S) L</label>
                            <input 
                              type="number" 
                              min="0"
                              value={formData7.timbangS_L} 
                              onChange={e => setFormData7(prev => ({ ...prev, timbangS_L: parseInt(e.target.value) || 0 }))} 
                              className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">Sasaran (S) P</label>
                            <input 
                              type="number" 
                              min="0"
                              value={formData7.timbangS_P} 
                              onChange={e => setFormData7(prev => ({ ...prev, timbangS_P: parseInt(e.target.value) || 0 }))} 
                              className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                            />
                          </div>
                          
                          <div>
                            <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">KMS (K) L</label>
                            <input 
                              type="number" 
                              min="0"
                              value={formData7.timbangK_L} 
                              onChange={e => setFormData7(prev => ({ ...prev, timbangK_L: parseInt(e.target.value) || 0 }))} 
                              className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">KMS (K) P</label>
                            <input 
                              type="number" 
                              min="0"
                              value={formData7.timbangK_P} 
                              onChange={e => setFormData7(prev => ({ ...prev, timbangK_P: parseInt(e.target.value) || 0 }))} 
                              className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                            />
                          </div>

                          <div>
                            <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">Ditimbang (D) L</label>
                            <input 
                              type="number" 
                              min="0"
                              value={formData7.timbangD_L} 
                              onChange={e => setFormData7(prev => ({ ...prev, timbangD_L: parseInt(e.target.value) || 0 }))} 
                              className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">Ditimbang (D) P</label>
                            <input 
                              type="number" 
                              min="0"
                              value={formData7.timbangD_P} 
                              onChange={e => setFormData7(prev => ({ ...prev, timbangD_P: parseInt(e.target.value) || 0 }))} 
                              className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                            />
                          </div>

                          <div>
                            <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">Naik (N) L</label>
                            <input 
                              type="number" 
                              min="0"
                              value={formData7.timbangN_L} 
                              onChange={e => setFormData7(prev => ({ ...prev, timbangN_L: parseInt(e.target.value) || 0 }))} 
                              className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">Naik (N) P</label>
                            <input 
                              type="number" 
                              min="0"
                              value={formData7.timbangN_P} 
                              onChange={e => setFormData7(prev => ({ ...prev, timbangN_P: parseInt(e.target.value) || 0 }))} 
                              className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                            />
                          </div>

                          <div>
                            <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">Vit A L</label>
                            <input 
                              type="number" 
                              min="0"
                              value={formData7.timbangVitA_L} 
                              onChange={e => setFormData7(prev => ({ ...prev, timbangVitA_L: parseInt(e.target.value) || 0 }))} 
                              className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">Vit A P</label>
                            <input 
                              type="number" 
                              min="0"
                              value={formData7.timbangVitA_P} 
                              onChange={e => setFormData7(prev => ({ ...prev, timbangVitA_P: parseInt(e.target.value) || 0 }))} 
                              className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                            />
                          </div>

                          <div>
                            <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">PMT L</label>
                            <input 
                              type="number" 
                              min="0"
                              value={formData7.timbangPmt_L} 
                              onChange={e => setFormData7(prev => ({ ...prev, timbangPmt_L: parseInt(e.target.value) || 0 }))} 
                              className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">PMT P</label>
                            <input 
                              type="number" 
                              min="0"
                              value={formData7.timbangPmt_P} 
                              onChange={e => setFormData7(prev => ({ ...prev, timbangPmt_P: parseInt(e.target.value) || 0 }))} 
                              className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 4. Imunisasi Ibu Hamil & Bayi */}
                        <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-900/30 space-y-4">
                          <h4 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-200/50 dark:border-zinc-700 pb-2">
                            <Syringe className="w-4 h-4 text-violet-500" /> 4. Imunisasi
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">Imunisasi TT Ibu Hamil (Total)</label>
                              <input 
                                type="number" 
                                min="0"
                                value={formData7.imTT} 
                                onChange={e => setFormData7(prev => ({ ...prev, imTT: parseInt(e.target.value) || 0 }))} 
                                className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                              />
                            </div>
                            <div className="border-t border-slate-200/50 dark:border-zinc-700/50 pt-2 mt-2 space-y-2">
                              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">Imunisasi Bayi (L/P)</span>
                              <div className="grid grid-cols-2 gap-2 h-60 overflow-y-auto pr-1">
                                <div>
                                  <label className="text-[10px] text-slate-500">BCG L</label>
                                  <input type="number" min="0" value={formData7.imBCG_L} onChange={e => setFormData7(prev => ({ ...prev, imBCG_L: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-500">BCG P</label>
                                  <input type="number" min="0" value={formData7.imBCG_P} onChange={e => setFormData7(prev => ({ ...prev, imBCG_P: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>
                                
                                <div>
                                  <label className="text-[10px] text-slate-500">DPT I L</label>
                                  <input type="number" min="0" value={formData7.imDPT1_L} onChange={e => setFormData7(prev => ({ ...prev, imDPT1_L: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-500">DPT I P</label>
                                  <input type="number" min="0" value={formData7.imDPT1_P} onChange={e => setFormData7(prev => ({ ...prev, imDPT1_P: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-500">DPT II L</label>
                                  <input type="number" min="0" value={formData7.imDPT2_L} onChange={e => setFormData7(prev => ({ ...prev, imDPT2_L: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-500">DPT II P</label>
                                  <input type="number" min="0" value={formData7.imDPT2_P} onChange={e => setFormData7(prev => ({ ...prev, imDPT2_P: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-500">DPT III L</label>
                                  <input type="number" min="0" value={formData7.imDPT3_L} onChange={e => setFormData7(prev => ({ ...prev, imDPT3_L: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-500">DPT III P</label>
                                  <input type="number" min="0" value={formData7.imDPT3_P} onChange={e => setFormData7(prev => ({ ...prev, imDPT3_P: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-500">Polio I L</label>
                                  <input type="number" min="0" value={formData7.imPolio1_L} onChange={e => setFormData7(prev => ({ ...prev, imPolio1_L: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-500">Polio I P</label>
                                  <input type="number" min="0" value={formData7.imPolio1_P} onChange={e => setFormData7(prev => ({ ...prev, imPolio1_P: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-500">Polio II L</label>
                                  <input type="number" min="0" value={formData7.imPolio2_L} onChange={e => setFormData7(prev => ({ ...prev, imPolio2_L: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-500">Polio II P</label>
                                  <input type="number" min="0" value={formData7.imPolio2_P} onChange={e => setFormData7(prev => ({ ...prev, imPolio2_P: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-500">Polio III L</label>
                                  <input type="number" min="0" value={formData7.imPolio3_L} onChange={e => setFormData7(prev => ({ ...prev, imPolio3_L: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-500">Polio III P</label>
                                  <input type="number" min="0" value={formData7.imPolio3_P} onChange={e => setFormData7(prev => ({ ...prev, imPolio3_P: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-500">Polio IV L</label>
                                  <input type="number" min="0" value={formData7.imPolio4_L} onChange={e => setFormData7(prev => ({ ...prev, imPolio4_L: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-500">Polio IV P</label>
                                  <input type="number" min="0" value={formData7.imPolio4_P} onChange={e => setFormData7(prev => ({ ...prev, imPolio4_P: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-500">Campak L</label>
                                  <input type="number" min="0" value={formData7.imCampak_L} onChange={e => setFormData7(prev => ({ ...prev, imCampak_L: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-500">Campak P</label>
                                  <input type="number" min="0" value={formData7.imCampak_P} onChange={e => setFormData7(prev => ({ ...prev, imCampak_P: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-500">Hep B I L</label>
                                  <input type="number" min="0" value={formData7.imHepB1_L} onChange={e => setFormData7(prev => ({ ...prev, imHepB1_L: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-500">Hep B I P</label>
                                  <input type="number" min="0" value={formData7.imHepB1_P} onChange={e => setFormData7(prev => ({ ...prev, imHepB1_P: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-500">Hep B II L</label>
                                  <input type="number" min="0" value={formData7.imHepB2_L} onChange={e => setFormData7(prev => ({ ...prev, imHepB2_L: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-500">Hep B II P</label>
                                  <input type="number" min="0" value={formData7.imHepB2_P} onChange={e => setFormData7(prev => ({ ...prev, imHepB2_P: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-500">Hep B III L</label>
                                  <input type="number" min="0" value={formData7.imHepB3_L} onChange={e => setFormData7(prev => ({ ...prev, imHepB3_L: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-500">Hep B III P</label>
                                  <input type="number" min="0" value={formData7.imHepB3_P} onChange={e => setFormData7(prev => ({ ...prev, imHepB3_P: parseInt(e.target.value) || 0 }))} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 5. Balita Diare */}
                        <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-900/30 space-y-4">
                          <h4 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-200/50 dark:border-zinc-700 pb-2">
                            <Activity className="w-4 h-4 text-amber-500" /> 5. Balita Diare
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">Jumlah Kasus L</label>
                              <input 
                                type="number" 
                                min="0"
                                value={formData7.diareJml_L} 
                                onChange={e => setFormData7(prev => ({ ...prev, diareJml_L: parseInt(e.target.value) || 0 }))} 
                                className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">Jumlah Kasus P</label>
                              <input 
                                type="number" 
                                min="0"
                                value={formData7.diareJml_P} 
                                onChange={e => setFormData7(prev => ({ ...prev, diareJml_P: parseInt(e.target.value) || 0 }))} 
                                className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">Mendapat Oralit L</label>
                              <input 
                                type="number" 
                                min="0"
                                value={formData7.diareOralit_L} 
                                onChange={e => setFormData7(prev => ({ ...prev, diareOralit_L: parseInt(e.target.value) || 0 }))} 
                                className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block mb-1">Mendapat Oralit P</label>
                              <input 
                                type="number" 
                                min="0"
                                value={formData7.diareOralit_P} 
                                onChange={e => setFormData7(prev => ({ ...prev, diareOralit_P: parseInt(e.target.value) || 0 }))} 
                                className="block w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Form buttons */}
                      <div className="flex items-center justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-xl transition-all">Batal</button>
                        <button type="submit" className={`${theme.bgSolid} ${theme.hoverSolid} text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg ${theme.shadow} flex items-center gap-2`}>
                          <Save className="w-5 h-5" /> Simpan Data
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="lg:col-span-1">
                  {/* Sidebar Referensi */}
                  {(() => {
                    const matchingSip6 = sip6Reports.find(r => 
                      r.bulan === formData7.bulan && 
                      r.tahun === formData7.tahun && 
                      r.posyanduId === activePosyanduId
                    );
                    return (
                      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm space-y-4 sticky top-6">
                        <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-emerald-500" />
                          Referensi SIP 6
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                          Data Pengunjung untuk Bulan {formData7.bulan} / {formData7.tahun}
                        </p>
                        {matchingSip6 ? (
                          <div className="space-y-3 pt-2">
                            <div className="p-3 bg-slate-50 dark:bg-zinc-900 rounded-lg">
                              <span className="text-xs text-slate-400 block font-medium">Ibu Hamil (SIP 6)</span>
                              <span className="text-lg font-bold text-slate-800 dark:text-white">
                                {(matchingSip6.hamilBaru || 0) + (matchingSip6.hamilLama || 0)} <span className="text-xs font-normal text-slate-500">Orang</span>
                              </span>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-zinc-900 rounded-lg">
                              <span className="text-xs text-slate-400 block font-medium">Ibu Menyusui (SIP 6)</span>
                              <span className="text-lg font-bold text-slate-800 dark:text-white">
                                {(matchingSip6.busuiBaru || 0) + (matchingSip6.busuiLama || 0)} <span className="text-xs font-normal text-slate-500">Orang</span>
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData7(prev => ({
                                  ...prev,
                                  bumilJml: (matchingSip6.hamilBaru || 0) + (matchingSip6.hamilLama || 0),
                                  busuiJml: (matchingSip6.busuiBaru || 0) + (matchingSip6.busuiLama || 0)
                                }));
                                alert("Data referensi SIP 6 diterapkan!");
                              }}
                              className={`w-full py-2 px-4 rounded-xl text-xs font-semibold text-white ${theme.bgSolid} ${theme.hoverSolid} transition-all`}
                            >
                              Terapkan Referensi
                            </button>
                          </div>
                        ) : (
                          <div className="text-center py-6 bg-slate-50 dark:bg-zinc-900 rounded-lg text-xs text-slate-400">
                            Tidak ada data SIP 6 untuk bulan & tahun ini.
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* DATA TABLE (Dynamic based on Tab) */}
            {!showForm && activeTab === 'hasil_kegiatan' && (
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Data Hasil Kegiatan</h2>
                    <p className="text-sm text-slate-500">Laporan Bulanan Posyandu</p>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <button
                      onClick={exportUnifiedExcel}
                      className="bg-white dark:bg-zinc-850 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-zinc-700 font-semibold py-2.5 px-4 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all text-sm flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Ekspor Excel (SIP 6 & 7)
                    </button>
                    {canEdit && (
                      <label className="cursor-pointer bg-white dark:bg-zinc-850 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-zinc-700 font-semibold py-2.5 px-4 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all text-sm flex items-center justify-center gap-2">
                        <span>Impor CSV</span>
                        <input type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />
                      </label>
                    )}
                    {canEdit && (
                      <button
                        onClick={handleAdd}
                        className={`${theme.bgSolid} ${theme.hoverSolid} text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-lg ${theme.shadow} flex items-center justify-center gap-2 text-sm`}
                      >
                        <Plus className="w-4 h-4" /> Tambah Data
                      </button>
                    )}
                  </div>
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
                        {canEdit && <th className="px-4 py-3 text-right">Aksi</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {dummyHasilKegiatan.filter(r => r.tahun === tahunAktif && (isPosyandu || r.posyanduId === activePosyanduId || !activePosyanduId)).map((row, index) => {
                        const kb = row.kb || {};
                        const totalKB = (kb.kondom || 0) + (kb.pil || 0) + (kb.implant || 0) + (kb.mop || 0) + (kb.mow || 0) + (kb.iud || 0) + (kb.suntik || 0) + (kb.lainnya || 0);
                        const timbang = row.timbang || {};
                        const totalS = (timbang.s_l || 0) + (timbang.s_p || 0);
                        const totalD = (timbang.d_l || 0) + (timbang.d_p || 0);

                        return (
                          <Fragment key={row.id}>
                            <tr
                              className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-700/20 transition-colors cursor-pointer"
                            >
                              <td onClick={() => { setSelectedReportForDetail(row); setIsDetailModalOpen(true); }} className="px-4 py-3 font-medium text-slate-800 dark:text-white">{index + 1}</td>
                              <td onClick={() => { setSelectedReportForDetail(row); setIsDetailModalOpen(true); }} className="px-4 py-3 font-medium text-slate-800 dark:text-white">{row.bulan}/{row.tahun}</td>
                              <td onClick={() => { setSelectedReportForDetail(row); setIsDetailModalOpen(true); }} className="px-4 py-3">{row.bumil?.jml || 0}</td>
                              <td onClick={() => { setSelectedReportForDetail(row); setIsDetailModalOpen(true); }} className="px-4 py-3">{row.busui || 0}</td>
                              <td onClick={() => { setSelectedReportForDetail(row); setIsDetailModalOpen(true); }} className="px-4 py-3">{totalKB}</td>
                              <td onClick={() => { setSelectedReportForDetail(row); setIsDetailModalOpen(true); }} className="px-4 py-3">{totalS}/{totalD}</td>
                              <td onClick={() => { setSelectedReportForDetail(row); setIsDetailModalOpen(true); }} className="px-4 py-3"><span className={`${theme.text} text-xs font-medium ${theme.bgLight} px-2.5 py-1 rounded-full`}>{row.status || 'Tersimpan'}</span></td>
                              {canEdit && (
                                <td className="px-4 py-3 text-right">
                                  <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                    <button 
                                      onClick={() => handleEdit(row)}
                                      className="text-blue-500 hover:text-blue-600 transition-colors"
                                      title="Edit Laporan"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => handleDelete(row.id)}
                                      className="text-rose-500 hover:text-rose-600 transition-colors"
                                      title="Hapus Laporan"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          </Fragment>
                        )
                      })}
                      {dummyHasilKegiatan.filter(r => r.tahun === tahunAktif && (isPosyandu || r.posyanduId === activePosyanduId || !activePosyanduId)).length === 0 && (
                        <tr>
                          <td colSpan={canEdit ? 8 : 7} className="text-center py-6 text-sm text-slate-500 dark:text-zinc-400">
                            Belum ada data hasil kegiatan untuk tahun {tahunAktif}.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Perhitungan Semester & Tahunan */}
                <div className="mt-8 border-t border-slate-100 dark:border-zinc-700 pt-6">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">Ringkasan Hasil Kegiatan ({tahunAktif})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Semester 1 */}
                    <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/50">
                      <h4 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 mb-2">Semester 1 (Jan - Jun)</h4>
                      <div className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-300">
                        <div className="flex justify-between"><span>Ibu Hamil & Menyusui:</span><span className="font-semibold text-slate-800 dark:text-white">{(getTotals7([1,2,3,4,5,6]).bumil + getTotals7([1,2,3,4,5,6]).busui).toLocaleString('id-ID')}</span></div>
                        <div className="flex justify-between"><span>Akseptor KB (Total):</span><span className="font-semibold text-slate-800 dark:text-white">{getTotals7([1,2,3,4,5,6]).kb.toLocaleString('id-ID')}</span></div>
                        <div className="flex justify-between"><span>Balita Ditimbang (D):</span><span className="font-semibold text-slate-800 dark:text-white">{getTotals7([1,2,3,4,5,6]).timbangD.toLocaleString('id-ID')}</span></div>
                      </div>
                    </div>
                    {/* Semester 2 */}
                    <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/50">
                      <h4 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 mb-2">Semester 2 (Jul - Des)</h4>
                      <div className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-300">
                        <div className="flex justify-between"><span>Ibu Hamil & Menyusui:</span><span className="font-semibold text-slate-800 dark:text-white">{(getTotals7([7,8,9,10,11,12]).bumil + getTotals7([7,8,9,10,11,12]).busui).toLocaleString('id-ID')}</span></div>
                        <div className="flex justify-between"><span>Akseptor KB (Total):</span><span className="font-semibold text-slate-800 dark:text-white">{getTotals7([7,8,9,10,11,12]).kb.toLocaleString('id-ID')}</span></div>
                        <div className="flex justify-between"><span>Balita Ditimbang (D):</span><span className="font-semibold text-slate-800 dark:text-white">{getTotals7([7,8,9,10,11,12]).timbangD.toLocaleString('id-ID')}</span></div>
                      </div>
                    </div>
                    {/* Tahunan */}
                    <div className={`p-4 rounded-xl border ${theme.borderLight} bg-emerald-50/20 dark:bg-emerald-950/10`}>
                      <h4 className={`text-sm font-semibold ${theme.text} dark:${theme.textDark} mb-2`}>Total Tahunan</h4>
                      <div className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-300 font-medium">
                        <div className="flex justify-between"><span>Ibu Hamil & Menyusui:</span><span className="font-bold text-slate-800 dark:text-white">{(getTotals7([1,2,3,4,5,6,7,8,9,10,11,12]).bumil + getTotals7([1,2,3,4,5,6,7,8,9,10,11,12]).busui).toLocaleString('id-ID')}</span></div>
                        <div className="flex justify-between"><span>Akseptor KB (Total):</span><span className="font-bold text-slate-800 dark:text-white">{getTotals7([1,2,3,4,5,6,7,8,9,10,11,12]).kb.toLocaleString('id-ID')}</span></div>
                        <div className="flex justify-between"><span>Balita Ditimbang (D):</span><span className="font-bold text-slate-800 dark:text-white">{getTotals7([1,2,3,4,5,6,7,8,9,10,11,12]).timbangD.toLocaleString('id-ID')}</span></div>
                      </div>
                    </div>
                  </div>
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
                      <Heart className="w-4 h-4 text-rose-500" /> Ibu Hamil & Menyusui
                    </h5>
                    <div className="text-sm text-slate-600 dark:text-zinc-400 space-y-1">
                      <div className="flex justify-between"><span>Jumlah Hamil:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.bumil?.jml || 0}</span></div>
                      <div className="flex justify-between"><span>Diperiksa:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.bumil?.diperiksa || 0}</span></div>
                      <div className="flex justify-between"><span>FE Tab:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.bumil?.fe || 0}</span></div>
                      <div className="flex justify-between"><span>Jumlah Menyusui:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.busui || 0}</span></div>
                    </div>
                  </div>

                  {/* KB */}
                  <div className="bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
                    <h5 className="font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-emerald-500" /> Akseptor KB
                    </h5>
                    <div className="text-sm text-slate-600 dark:text-zinc-400 space-y-1">
                      <div className="flex justify-between"><span>Kondom:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.kb?.kondom || 0}</span></div>
                      <div className="flex justify-between"><span>Pil:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.kb?.pil || 0}</span></div>
                      <div className="flex justify-between"><span>Implant:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.kb?.implant || 0}</span></div>
                      <div className="flex justify-between"><span>MOP:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.kb?.mop || 0}</span></div>
                      <div className="flex justify-between"><span>MOW:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.kb?.mow || 0}</span></div>
                      <div className="flex justify-between"><span>IUD:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.kb?.iud || 0}</span></div>
                      <div className="flex justify-between"><span>Suntik:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.kb?.suntik || 0}</span></div>
                      <div className="flex justify-between"><span>Lain-lain:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.kb?.lainnya || 0}</span></div>
                    </div>
                  </div>

                  {/* Penimbangan */}
                  <div className="bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
                    <h5 className="font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                      <Baby className="w-4 h-4 text-blue-500" /> Penimbangan Balita
                    </h5>
                    <div className="text-sm text-slate-600 dark:text-zinc-400 space-y-1">
                      <div className="flex justify-between"><span>S L/P:</span><span className="font-medium text-slate-800 dark:text-white">{(selectedReportForDetail.timbang?.s_l || 0)} / {(selectedReportForDetail.timbang?.s_p || 0)}</span></div>
                      <div className="flex justify-between"><span>K L/P:</span><span className="font-medium text-slate-800 dark:text-white">{(selectedReportForDetail.timbang?.k_l || 0)} / {(selectedReportForDetail.timbang?.k_p || 0)}</span></div>
                      <div className="flex justify-between"><span>D L/P:</span><span className="font-medium text-slate-800 dark:text-white">{(selectedReportForDetail.timbang?.d_l || 0)} / {(selectedReportForDetail.timbang?.d_p || 0)}</span></div>
                      <div className="flex justify-between"><span>N L/P:</span><span className="font-medium text-slate-800 dark:text-white">{(selectedReportForDetail.timbang?.n_l || 0)} / {(selectedReportForDetail.timbang?.n_p || 0)}</span></div>
                      <div className="flex justify-between"><span>Vit A L/P:</span><span className="font-medium text-slate-800 dark:text-white">{(selectedReportForDetail.timbang?.vitA_l || 0)} / {(selectedReportForDetail.timbang?.vitA_p || 0)}</span></div>
                      <div className="flex justify-between"><span>PMT L/P:</span><span className="font-medium text-slate-800 dark:text-white">{(selectedReportForDetail.timbang?.pmt_l || 0)} / {(selectedReportForDetail.timbang?.pmt_p || 0)}</span></div>
                    </div>
                  </div>

                  {/* Imunisasi & Diare */}
                  <div className="bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-slate-200 dark:border-zinc-700">
                    <h5 className="font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                      <Syringe className="w-4 h-4 text-violet-500" /> Imunisasi & Diare
                    </h5>
                    <div className="text-sm text-slate-600 dark:text-zinc-400 space-y-1">
                      <div className="flex justify-between"><span>TT Bumil:</span><span className="font-medium text-slate-800 dark:text-white">{selectedReportForDetail.imTT?.i || 0}</span></div>
                      <div className="flex justify-between"><span>BCG L/P:</span><span className="font-medium text-slate-800 dark:text-white">{(selectedReportForDetail.imBayi?.bcg_l || 0)}/{(selectedReportForDetail.imBayi?.bcg_p || 0)}</span></div>
                      <div className="flex justify-between"><span>Campak L/P:</span><span className="font-medium text-slate-800 dark:text-white">{(selectedReportForDetail.imBayi?.campak_l || 0)}/{(selectedReportForDetail.imBayi?.campak_p || 0)}</span></div>
                      <div className="flex justify-between"><span>Diare Jml L/P:</span><span className="font-medium text-slate-800 dark:text-white">{(selectedReportForDetail.diare?.jml_l || 0)}/{(selectedReportForDetail.diare?.jml_p || 0)}</span></div>
                      <div className="flex justify-between"><span>Diare Oralit L/P:</span><span className="font-medium text-slate-800 dark:text-white">{(selectedReportForDetail.diare?.oralit_l || 0)}/{(selectedReportForDetail.diare?.oralit_p || 0)}</span></div>
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
