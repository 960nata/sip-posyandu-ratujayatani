'use client'

import { useState, useEffect, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Save, ArrowLeft, Heart,
  Baby, UserCircle, UserPlus, Shield, Activity, Edit2, Trash2, Plus, HardHat, X, Search
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import * as XLSX from 'xlsx'

export default function Sip6Page() {
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
    bgSolid: isPosyandu ? 'bg-purple-500' : 'bg-purple-500',
    hoverSolid: isPosyandu ? 'hover:bg-purple-600' : 'hover:bg-purple-600',
    borderLight: isPosyandu ? 'border-purple-200' : 'border-purple-200',
    hoverLight: isPosyandu ? 'hover:bg-purple-50' : 'hover:bg-purple-50',
    shadowSolid: isPosyandu ? 'shadow-purple-500/20' : 'shadow-purple-500/20',
    textDark: isPosyandu ? 'dark:text-purple-400' : 'dark:text-purple-400',
    bgDarkLight: isPosyandu ? 'dark:bg-purple-900/30' : 'dark:bg-purple-900/30',
    focusRingSolid: isPosyandu ? 'focus:ring-purple-500/25 focus:border-purple-400' : 'focus:ring-purple-500/25 focus:border-purple-400',
  }

  const [showForm, setShowForm] = useState(false)
  const [showFormSasaran, setShowFormSasaran] = useState(false)
  const [activeTab, setActiveTab] = useState('pengunjung')
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')

  const [tahunAktif, setTahunAktif] = useState(2026)
  const [namaDesa, setNamaDesa] = useState('Adijaya')

  const [selectedKecamatanId, setSelectedKecamatanId] = useState('')
  const [selectedDesaId, setSelectedDesaId] = useState('')
  const [selectedPosyanduId, setSelectedPosyanduId] = useState('')

  const [kecamatans, setKecamatans] = useState<any[]>([])
  const [desas, setDesas] = useState<any[]>([])
  const [posyandus, setPosyandus] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
    fetchKecamatans()

    const savedDesa = localStorage.getItem('sip_nama_desa') || 'Adijaya'
    const savedTahun = localStorage.getItem('sip_tahun_aktif') || '2026'
    setNamaDesa(savedDesa)
    setTahunAktif(parseInt(savedTahun))
    setFormData(prev => ({ ...prev, tahun: parseInt(savedTahun) }))
  }, [])

  const fetchKecamatans = async () => {
    const res = await fetch('/api/kecamatan')
    const data = await res.json()
    setKecamatans(data)
  }

  const fetchReports = async (posyanduId: string) => {
    if (!posyanduId) return
    try {
      const res = await fetch(`/api/sip6?posyanduId=${posyanduId}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        const mapped = data.map(r => ({
          id: r.id,
          posyanduId: r.posyanduId,
          bulan: r.bulan,
          tahun: r.tahun,
          namaKader: r.keterangan || 'Petugas',
          tanggalInput: new Date(r.createdAt).toLocaleDateString('id-ID'),
          bayiBaruL: r.bayiBaruL || 0,
          bayiBaruP: r.bayiBaruP || 0,
          bayiLamaL: r.bayiLamaL || 0,
          bayiLamaP: r.bayiLamaP || 0,
          balitaBaruL: r.balitaBaruL || 0,
          balitaBaruP: r.balitaBaruP || 0,
          balitaLamaL: r.balitaLamaL || 0,
          balitaLamaP: r.balitaLamaP || 0,
          anakBaruL: r.anakBaruL || 0,
          anakBaruP: r.anakBaruP || 0,
          anakLamaL: r.anakLamaL || 0,
          anakLamaP: r.anakLamaP || 0,
          prodBaruL: r.prodBaruL || 0,
          prodBaruP: r.prodBaruP || 0,
          prodLamaL: r.prodLamaL || 0,
          prodLamaP: r.prodLamaP || 0,
          hamilBaru: r.ibuHamil || 0,
          hamilLama: 0,
          busuiBaru: r.ibuMenyusui || 0,
          busuiLama: 0,
          lansiaL: r.lansiaBaruL || 0,
          lansiaP: r.lansiaBaruP || 0,
          wus: r.pus || 0,
          ibu: 0,
          kader: r.kaderL || 0,
          plkb: r.plkbL || 0,
          medis: r.medisL || 0,
          lahirL: r.lahirL || 0,
          lahirP: r.lahirP || 0,
          meninggalL: r.meninggalL || 0,
          meninggalP: r.meninggalP || 0,
          status: 'Tersimpan'
        }))
        setReports(mapped)
        localStorage.setItem('sip6_reports', JSON.stringify(mapped))
      }
    } catch (err) {
      console.error("Error fetching reports:", err)
    }
  }

  const fetchSasaran = async (posyanduId: string) => {
    if (!posyanduId) return
    try {
      const res = await fetch(`/api/sasaran?posyanduId=${posyanduId}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        const mapped = data.map((s: any) => {
          const type = s.kategori === 'IBU_HAMIL' ? 'sasaran_bumil' :
                       s.kategori === 'BAYI_BALITA' ? 'sasaran_bayi' :
                       s.kategori === 'REMAJA' ? 'sasaran_remaja' :
                       s.kategori === 'LANSIA' ? 'sasaran_lansia' : 'sasaran_bumil';
          
          const kunjungan: string[] = [];
          if (s.jan) kunjungan.push('JAN');
          if (s.feb) kunjungan.push('FEB');
          if (s.mar) kunjungan.push('MAR');
          if (s.apr) kunjungan.push('APR');
          if (s.mei) kunjungan.push('MEI');
          if (s.jun) kunjungan.push('JUN');
          if (s.jul) kunjungan.push('JUL');
          if (s.agu) kunjungan.push('AGU');
          if (s.sep) kunjungan.push('SEP');
          if (s.okt) kunjungan.push('OKT');
          if (s.nov) kunjungan.push('NOV');
          if (s.des) kunjungan.push('DES');

          return {
            ...s,
            type,
            kunjungan,
            detailKunjungan: s.detailKunjungan || {}
          }
        })
        setDummySasaran(mapped)
        localStorage.setItem('sip6_sasaran_individus', JSON.stringify(mapped))
      }
    } catch (err) {
      console.error("Error fetching sasaran:", err)
    }
  }

  useEffect(() => {
    const activePosyanduId = isPosyandu ? (session?.user as any)?.posyanduId : selectedPosyanduId;
    if (activePosyanduId) {
      fetchReports(activePosyanduId)
      fetchSasaran(activePosyanduId)
    } else {
      setReports([])
      setDummySasaran([])
    }
  }, [selectedPosyanduId, isPosyandu, session])

  useEffect(() => {
    if (role === 'ADMIN_KECAMATAN' && kecamatans.length > 0 && !selectedKecamatanId) {
      const userKecamatanId = (session?.user as any)?.kecamatanId
      if (userKecamatanId) {
        setSelectedKecamatanId(userKecamatanId)
      } else {
        const pekalongan = kecamatans.find((k: any) => k.nama === 'Pekalongan')
        if (pekalongan) {
          setSelectedKecamatanId(pekalongan.id)
        } else {
          setSelectedKecamatanId(kecamatans[0].id)
        }
      }
    }
  }, [role, kecamatans, selectedKecamatanId, session])

  useEffect(() => {
    if (role === 'OPERATOR_DESA') {
      const userDesaId = (session?.user as any)?.desaId
      const userKecamatanId = (session?.user as any)?.kecamatanId
      if (userKecamatanId) setSelectedKecamatanId(userKecamatanId)
      if (userDesaId) setSelectedDesaId(userDesaId)
    }
  }, [role, session])

  useEffect(() => {
    if (selectedKecamatanId) {
      fetchDesas(selectedKecamatanId)
    }
  }, [selectedKecamatanId])

  const fetchDesas = async (kecId: string) => {
    const res = await fetch(`/api/desa?kecamatanId=${kecId}`)
    const data = await res.json()
    setDesas(data)
  }

  useEffect(() => {
    if (selectedDesaId) {
      fetchPosyandus(selectedDesaId)
    }
  }, [selectedDesaId])

  const fetchPosyandus = async (desaId: string) => {
    const res = await fetch(`/api/posyandu?desaId=${desaId}`)
    const data = await res.json()
    setPosyandus(data)
  }

  const [dummySasaran, setDummySasaran] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [sasaranForm, setSasaranForm] = useState<any>({
    namaIbu: '',
    namaSuami: '',
    namaBayi: '',
    nama: '',
    jenisKelamin: 'L',
    tanggalLahir: '',
    namaIbuOrtu: '',
    namaAyah: '',
    tahun: 2026,
    kunjungan: []
  })
  const [selectedAttendanceForModal, setSelectedAttendanceForModal] = useState<{ sasaran: any, month: string } | null>(null)
  const [checklistForm, setChecklistForm] = useState<any>({
    bumilDatang: false,
    busuiDatang: false,
    bbKurang: false,
    lilaKek: false,
    balitaDatang: false,
    bbNaik: false,
    asiEksklusif: false,
    remaja614Datang: false,
    remaja1518Datang: false,
    imtNormal: false,
    tensiTinggi: false,
    gulaDarahTinggi: false,
    mandiri: false,
  })

  const handleChecklistClick = (sasaran: any, month: string) => {
    setSelectedAttendanceForModal({ sasaran, month })
  }

  // Prefill check list form when selectedAttendanceForModal opens
  useEffect(() => {
    if (selectedAttendanceForModal) {
      const { sasaran, month } = selectedAttendanceForModal
      const savedDetails = sasaran.detailKunjungan?.[month] || {}
      
      const defaultBumilDatang = sasaran.type === 'sasaran_bumil'
      const defaultBalitaDatang = sasaran.type === 'sasaran_bayi'
      
      let default614 = false
      let default1518 = false
      if (sasaran.type === 'sasaran_remaja') {
        let age = 10
        if (sasaran.tanggalLahir) {
          const birthYear = new Date(sasaran.tanggalLahir).getFullYear()
          age = 2026 - birthYear
        }
        if (age >= 6 && age <= 14) {
          default614 = true
        } else if (age >= 15 && age <= 18) {
          default1518 = true
        } else {
          default614 = true
        }
      }

      setChecklistForm({
        bumilDatang: savedDetails.bumilDatang !== undefined ? savedDetails.bumilDatang : defaultBumilDatang,
        busuiDatang: savedDetails.busuiDatang !== undefined ? savedDetails.busuiDatang : false,
        bbKurang: savedDetails.bbKurang !== undefined ? savedDetails.bbKurang : false,
        lilaKek: savedDetails.lilaKek !== undefined ? savedDetails.lilaKek : false,
        balitaDatang: savedDetails.balitaDatang !== undefined ? savedDetails.balitaDatang : defaultBalitaDatang,
        bbNaik: savedDetails.bbNaik !== undefined ? savedDetails.bbNaik : false,
        asiEksklusif: savedDetails.asiEksklusif !== undefined ? savedDetails.asiEksklusif : false,
        remaja614Datang: savedDetails.remaja614Datang !== undefined ? savedDetails.remaja614Datang : default614,
        remaja1518Datang: savedDetails.remaja1518Datang !== undefined ? savedDetails.remaja1518Datang : default1518,
        imtNormal: savedDetails.imtNormal !== undefined ? savedDetails.imtNormal : false,
        tensiTinggi: savedDetails.tensiTinggi !== undefined ? savedDetails.tensiTinggi : false,
        gulaDarahTinggi: savedDetails.gulaDarahTinggi !== undefined ? savedDetails.gulaDarahTinggi : false,
        mandiri: savedDetails.mandiri !== undefined ? savedDetails.mandiri : false,
      })
    }
  }, [selectedAttendanceForModal])

  const saveAttendanceDetails = async (sasaranId: string, month: string, details: any) => {
    const s = dummySasaran.find(item => item.id === sasaranId)
    if (!s) return

    const monthsKeys = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agu', 'sep', 'okt', 'nov', 'des']
    const monthKey = month.toLowerCase()

    const payload: any = {
      id: s.id,
      posyanduId: s.posyanduId,
      kategori: s.kategori,
      nama: s.nama,
      jenisKelamin: s.jenisKelamin,
      tanggalLahir: s.tanggalLahir,
      namaIbu: s.namaIbu,
      namaAyah: s.namaAyah,
      namaSuami: s.namaSuami,
      namaBayi: s.namaBayi,
      tahun: s.tahun,
      detailKunjungan: {
        ...(s.detailKunjungan || {}),
        [month]: details
      }
    }

    monthsKeys.forEach(m => {
      const monthNameUpper = m.toUpperCase()
      if (m === monthKey) {
        payload[m] = true
      } else {
        payload[m] = s.kunjungan.includes(monthNameUpper)
      }
    })

    try {
      const res = await fetch('/api/sasaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const activePosyanduId = isPosyandu ? (session?.user as any)?.posyanduId : selectedPosyanduId;
        await fetchSasaran(activePosyanduId)
        setSelectedAttendanceForModal(null)
      } else {
        alert('Gagal mencatat kehadiran di database.')
      }
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat menyimpan.')
    }
  }

  const deleteAttendance = async (sasaranId: string, month: string) => {
    const s = dummySasaran.find(item => item.id === sasaranId)
    if (!s) return

    const monthsKeys = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agu', 'sep', 'okt', 'nov', 'des']
    const monthKey = month.toLowerCase()

    const newDetail = { ...(s.detailKunjungan || {}) }
    delete newDetail[month]

    const payload: any = {
      id: s.id,
      posyanduId: s.posyanduId,
      kategori: s.kategori,
      nama: s.nama,
      jenisKelamin: s.jenisKelamin,
      tanggalLahir: s.tanggalLahir,
      namaIbu: s.namaIbu,
      namaAyah: s.namaAyah,
      namaSuami: s.namaSuami,
      namaBayi: s.namaBayi,
      tahun: s.tahun,
      detailKunjungan: newDetail
    }

    monthsKeys.forEach(m => {
      const monthNameUpper = m.toUpperCase()
      if (m === monthKey) {
        payload[m] = false
      } else {
        payload[m] = s.kunjungan.includes(monthNameUpper)
      }
    })

    try {
      const res = await fetch('/api/sasaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const activePosyanduId = isPosyandu ? (session?.user as any)?.posyanduId : selectedPosyanduId;
        await fetchSasaran(activePosyanduId)
        setSelectedAttendanceForModal(null)
      } else {
        alert('Gagal menghapus kehadiran dari database.')
      }
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat menghapus.')
    }
  }

  const exportUnifiedExcel = () => {
    // 1. Load SIP 7 reports
    const savedSip7 = localStorage.getItem('sip7_reports')
    const localSip7 = savedSip7 ? JSON.parse(savedSip7) : []

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

    const activePosyanduId = isPosyandu ? (session?.user as any)?.posyanduId : selectedPosyanduId;
    const filteredSip6 = reports.filter((r: any) =>
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

    const filteredSip7 = localSip7.filter((r: any) =>
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

  const initialForm = {
    bulan: 5,
    tahun: 2026,
    posyanduId: '',
    namaKader: '',
    // Bayi 0-12 bln
    bayiBaruL: 0, bayiLamaL: 0, bayiBaruP: 0, bayiLamaP: 0,
    // Balita 1-5 thn
    balitaBaruL: 0, balitaLamaL: 0, balitaBaruP: 0, balitaLamaP: 0,
    // Anak 6-18 thn
    anakBaruL: 0, anakLamaL: 0, anakBaruP: 0, anakLamaP: 0,
    // Usia Produktif
    prodBaruL: 0, prodLamaL: 0, prodBaruP: 0, prodLamaP: 0,
    // Ibu Hamil / Menyusui / Lansia / WUS / Ibu
    hamilBaru: 0, hamilLama: 0,
    busuiBaru: 0, busuiLama: 0,
    lansiaL: 0, lansiaP: 0,
    wus: 0, ibu: 0,
    // Petugas
    kader: 0, plkb: 0, medis: 0,
    // Lahir & Meninggal
    lahirL: 0, lahirP: 0, meninggalL: 0, meninggalP: 0,
    keterangan: ''
  }

  const [formData, setFormData] = useState(initialForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedReportForDetail, setSelectedReportForDetail] = useState<any>(null)
  const [reports, setReports] = useState([
    {
      id: '1', bulan: 5, tahun: 2026, posyanduId: '1', namaKader: 'Siti', tanggalInput: '10/05/2026',
      bayiBaruL: 5, bayiLamaL: 5, bayiBaruP: 5, bayiLamaP: 5,
      balitaBaruL: 0, balitaLamaL: 0, balitaBaruP: 0, balitaLamaP: 0,
      anakBaruL: 0, anakLamaL: 0, anakBaruP: 0, anakLamaP: 0,
      prodBaruL: 0, prodLamaL: 0, prodBaruP: 0, prodLamaP: 0,
      hamilBaru: 2, hamilLama: 0, busuiBaru: 0, busuiLama: 0,
      lansiaL: 0, lansiaP: 0, wus: 0, ibu: 0,
      kader: 3, plkb: 1, medis: 1,
      lahirL: 0, lahirP: 0, meninggalL: 0, meninggalP: 0,
      status: 'Tersimpan'
    },
    {
      id: '2', bulan: 5, tahun: 2026, posyanduId: '1', namaKader: 'Ani', tanggalInput: '10/05/2026',
      bayiBaruL: 2, bayiLamaL: 3, bayiBaruP: 2, bayiLamaP: 2,
      balitaBaruL: 0, balitaLamaL: 0, balitaBaruP: 0, balitaLamaP: 0,
      anakBaruL: 0, anakLamaL: 0, anakBaruP: 0, anakLamaP: 0,
      prodBaruL: 0, prodLamaL: 0, prodBaruP: 0, prodLamaP: 0,
      hamilBaru: 1, hamilLama: 0, busuiBaru: 0, busuiLama: 0,
      lansiaL: 0, lansiaP: 0, wus: 0, ibu: 0,
      kader: 2, plkb: 0, medis: 1,
      lahirL: 0, lahirP: 0, meninggalL: 0, meninggalP: 0,
      status: 'Tersimpan'
    },
  ])

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleEdit = (report: any) => {
    setFormData({
      ...initialForm,
      posyanduId: report.posyanduId || '',
      bulan: report.bulan || 5,
      tahun: report.tahun || 2026,
    })
    setEditId(report.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const res = await fetch(`/api/sip6?id=${id}`, {
          method: 'DELETE',
        })
        if (res.ok) {
          const currentPosyanduId = isPosyandu ? (session?.user as any)?.posyanduId : selectedPosyanduId;
          await fetchReports(currentPosyanduId)
        } else {
          alert('Gagal menghapus laporan dari database.')
        }
      } catch (err) {
        console.error(err)
        alert('Terjadi kesalahan saat menghapus data.')
      }
    }
  }

  const handleAdd = () => {
    setFormData({ ...initialForm, tahun: tahunAktif })
    setEditId(null)
    setShowForm(true)
  }

  const getTotals = (months: number[]) => {
    const activePosyanduId = isPosyandu ? (session?.user as any)?.posyanduId : selectedPosyanduId;
    const filtered = reports.filter(r =>
      r.tahun === tahunAktif &&
      r.posyanduId === activePosyanduId &&
      months.includes(r.bulan)
    );

    return {
      bayi: filtered.reduce((sum, r) => sum + (r.bayiBaruL || 0) + (r.bayiBaruP || 0) + (r.bayiLamaL || 0) + (r.bayiLamaP || 0), 0),
      balita: filtered.reduce((sum, r) => sum + (r.balitaBaruL || 0) + (r.balitaBaruP || 0) + (r.balitaLamaL || 0) + (r.balitaLamaP || 0), 0),
      bumil: filtered.reduce((sum, r) => sum + (r.hamilBaru || 0) + (r.hamilLama || 0), 0),
      busui: filtered.reduce((sum, r) => sum + (r.busuiBaru || 0) + (r.busuiLama || 0), 0),
      petugas: filtered.reduce((sum, r) => sum + (r.kader || 0) + (r.plkb || 0) + (r.medis || 0), 0),
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
        const activePosyanduId = isPosyandu ? (session?.user as any)?.posyanduId : selectedPosyanduId;

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          if (values.length < headers.length) continue;

          const rowData: any = {};
          headers.forEach((header, index) => {
            rowData[header] = values[index];
          });

          const bulanTahun = rowData["Bulan"] || "";
          let bulan = 5;
          let tahun = 2026;
          if (bulanTahun.includes('/')) {
            const parts = bulanTahun.split('/');
            bulan = parseInt(parts[0]) || 5;
            tahun = parseInt(parts[1]) || 2026;
          }

          const report = {
            id: 'import-' + Date.now() + '-' + i,
            posyanduId: activePosyanduId,
            bulan,
            tahun,
            namaKader: rowData["Kader / Petugas"] || "Imported",
            tanggalInput: rowData["Tanggal Input"] || new Date().toLocaleDateString('id-ID'),
            bayiBaruL: parseInt(rowData["Bayi Baru (L)"]) || 0,
            bayiBaruP: parseInt(rowData["Bayi Baru (P)"]) || 0,
            bayiLamaL: parseInt(rowData["Bayi Lama (L)"]) || 0,
            bayiLamaP: parseInt(rowData["Bayi Lama (P)"]) || 0,
            balitaBaruL: parseInt(rowData["Balita Baru (L)"]) || 0,
            balitaBaruP: parseInt(rowData["Balita Baru (P)"]) || 0,
            balitaLamaL: parseInt(rowData["Balita Lama (L)"]) || 0,
            balitaLamaP: parseInt(rowData["Balita Lama (P)"]) || 0,
            anakBaruL: parseInt(rowData["Anak Baru (L)"]) || 0,
            anakBaruP: parseInt(rowData["Anak Baru (P)"]) || 0,
            anakLamaL: parseInt(rowData["Anak Lama (L)"]) || 0,
            anakLamaP: parseInt(rowData["Anak Lama (P)"]) || 0,
            prodBaruL: parseInt(rowData["Prod Baru (L)"]) || 0,
            prodBaruP: parseInt(rowData["Prod Baru (P)"]) || 0,
            prodLamaL: parseInt(rowData["Prod Lama (L)"]) || 0,
            prodLamaP: parseInt(rowData["Prod Lama (P)"]) || 0,
            hamilBaru: parseInt(rowData["Hamil Baru"]) || 0,
            hamilLama: parseInt(rowData["Hamil Lama"]) || 0,
            busuiBaru: parseInt(rowData["Busui Baru"]) || 0,
            busuiLama: parseInt(rowData["Busui Lama"]) || 0,
            lansiaL: parseInt(rowData["Lansia (L)"]) || 0,
            lansiaP: parseInt(rowData["Lansia (P)"]) || 0,
            wus: parseInt(rowData["WUS"]) || 0,
            ibu: parseInt(rowData["Ibu"]) || 0,
            kader: parseInt(rowData["Kader"]) || 0,
            plkb: parseInt(rowData["PLKB"]) || 0,
            medis: parseInt(rowData["Medis"]) || 0,
            lahirL: parseInt(rowData["Lahir (L)"]) || 0,
            lahirP: parseInt(rowData["Lahir (P)"]) || 0,
            meninggalL: parseInt(rowData["Mati (L)"]) || 0,
            meninggalP: parseInt(rowData["Mati (P)"]) || 0,
            status: 'Tersimpan'
          };
          newReports.push(report);
        }

        if (newReports.length > 0) {
          const merged = [...reports];
          newReports.forEach(nr => {
            const dupIdx = merged.findIndex(r => r.bulan === nr.bulan && r.tahun === nr.tahun && r.posyanduId === nr.posyanduId);
            if (dupIdx !== -1) {
              merged[dupIdx] = nr;
            } else {
              merged.unshift(nr);
            }
          });

          setReports(merged);
          localStorage.setItem('sip6_reports', JSON.stringify(merged));
          alert(`Sukses mengimpor ${newReports.length} data SIP 6!`);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validasi angka negatif
    const numericKeys = Object.keys(formData).filter(key => typeof (formData as any)[key] === 'number' && key !== 'bulan' && key !== 'tahun');
    for (const key of numericKeys) {
      if ((formData as any)[key] < 0) {
        alert('Nilai input tidak boleh negatif!');
        return;
      }
    }

    const currentPosyanduId = isPosyandu ? (session?.user as any)?.posyanduId : selectedPosyanduId;
    if (!currentPosyanduId) {
      alert('Silakan pilih posyandu terlebih dahulu.');
      return;
    }

    // Validasi bulan ganda dalam setahun
    const isDuplicate = reports.some(r =>
      r.bulan === formData.bulan &&
      r.tahun === formData.tahun &&
      r.posyanduId === currentPosyanduId &&
      r.id !== editId
    );
    if (isDuplicate) {
      alert('Laporan untuk bulan dan tahun ini sudah ada di posyandu terpilih!');
      return;
    }

    const payload = {
      posyanduId: currentPosyanduId,
      tahun: formData.tahun,
      bulan: formData.bulan,
      bayiBaruL: formData.bayiBaruL || 0,
      bayiBaruP: formData.bayiBaruP || 0,
      bayiLamaL: formData.bayiLamaL || 0,
      bayiLamaP: formData.bayiLamaP || 0,
      balitaBaruL: formData.balitaBaruL || 0,
      balitaBaruP: formData.balitaBaruP || 0,
      balitaLamaL: formData.balitaLamaL || 0,
      balitaLamaP: formData.balitaLamaP || 0,
      anakBaruL: formData.anakBaruL || 0,
      anakBaruP: formData.anakBaruP || 0,
      anakLamaL: formData.anakLamaL || 0,
      anakLamaP: formData.anakLamaP || 0,
      prodBaruL: formData.prodBaruL || 0,
      prodBaruP: formData.prodBaruP || 0,
      prodLamaL: formData.prodLamaL || 0,
      prodLamaP: formData.prodLamaP || 0,
      ibuHamil: formData.hamilBaru || 0,
      ibuMenyusui: formData.busuiBaru || 0,
      lansiaBaruL: formData.lansiaL || 0,
      lansiaBaruP: formData.lansiaP || 0,
      pus: formData.wus || 0,
      kaderL: formData.kader || 0,
      plkbL: formData.plkb || 0,
      medisL: formData.medis || 0,
      lahirL: formData.lahirL || 0,
      lahirP: formData.lahirP || 0,
      meninggalL: formData.meninggalL || 0,
      meninggalP: formData.meninggalP || 0,
      keterangan: formData.namaKader || 'Petugas',
    }

    try {
      const res = await fetch('/api/sip6', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        alert('Data SIP 6 berhasil disimpan!')
        await fetchReports(currentPosyanduId)
        setShowForm(false)
        setFormData(initialForm)
        setEditId(null)
      } else {
        const err = await res.json()
        alert('Gagal menyimpan data ke database: ' + (err.error || 'error'))
      }
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat menyimpan data.')
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Data Pengunjung Bulanan Posyandu</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">Sistem Informasi Posyandu (SIP 6)</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={formData.bulan}
            onChange={(e) => handleChange('bulan', parseInt(e.target.value))}
            className="bg-white dark:bg-[#202020] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>Bulan {i + 1}</option>
            ))}
          </select>
          <select
            value={formData.tahun}
            onChange={(e) => handleChange('tahun', parseInt(e.target.value))}
            className="bg-white dark:bg-[#202020] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>


      {showFormSasaran ? (
        <form onSubmit={async (e) => {
          e.preventDefault();
          const activePosyanduId = isPosyandu ? (session?.user as any)?.posyanduId : selectedPosyanduId;
          if (!activePosyanduId) {
            alert('Silakan pilih posyandu terlebih dahulu.');
            return;
          }

          const kategori = activeTab === 'sasaran_bumil' ? 'IBU_HAMIL' :
                           activeTab === 'sasaran_bayi' ? 'BAYI_BALITA' :
                           activeTab === 'sasaran_remaja' ? 'REMAJA' : 'LANSIA';
                           
          const payload = {
            id: editingId || undefined,
            posyanduId: activePosyanduId,
            kategori,
            nama: sasaranForm.nama || sasaranForm.namaIbu || 'Tanpa Nama',
            jenisKelamin: activeTab === 'sasaran_bumil' ? 'P' : sasaranForm.jenisKelamin || 'L',
            tanggalLahir: sasaranForm.tanggalLahir || null,
            namaIbu: sasaranForm.namaIbu || sasaranForm.namaIbuOrtu || null,
            namaAyah: sasaranForm.namaAyah || null,
            namaSuami: sasaranForm.namaSuami || null,
            namaBayi: sasaranForm.namaBayi || null,
            tahun: sasaranForm.tahun || tahunAktif,
          }

          try {
            const res = await fetch('/api/sasaran', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            })
            if (res.ok) {
              await fetchSasaran(activePosyanduId);
              setShowFormSasaran(false);
              setEditingId(null);
              setSasaranForm({ namaIbu: '', namaSuami: '', namaBayi: '', nama: '', jenisKelamin: 'L', tanggalLahir: '', namaIbuOrtu: '', namaAyah: '', tahun: 2026, kunjungan: [] });
            } else {
              const err = await res.json();
              alert('Gagal menyimpan sasaran: ' + (err.error || 'error'));
            }
          } catch (err) {
            console.error(err);
            alert('Terjadi kesalahan saat menyimpan data.');
          }
        }} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-[#202020] p-6 rounded-lg border border-slate-200 dark:border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                {editingId ? 'Edit Sasaran' :
                  activeTab === 'sasaran_bumil' || activeTab === 'sasaran' ? 'Tambah Sasaran Ibu Hamil' :
                    activeTab === 'sasaran_bayi' ? 'Tambah Sasaran Bayi/Balita' :
                      activeTab === 'sasaran_remaja' ? 'Tambah Sasaran Remaja' :
                        activeTab === 'sasaran_lansia' ? 'Tambah Sasaran Lansia' : 'Tambah Sasaran'}
              </h2>
              <button type="button" onClick={() => setShowFormSasaran(false)} className={`text-sm font-medium ${theme.text} hover:${theme.textLight} flex items-center gap-1 transition-colors`}>
                <ArrowLeft className="w-4 h-4" /> Kembali
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTab === 'sasaran_bumil' || activeTab === 'sasaran' ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Nama Ibu</label>
                    <input type="text" value={sasaranForm.namaIbu} onChange={e => setSasaranForm({ ...sasaranForm, namaIbu: e.target.value })} className="block w-full bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Nama Suami</label>
                    <input type="text" value={sasaranForm.namaSuami} onChange={e => setSasaranForm({ ...sasaranForm, namaSuami: e.target.value })} className="block w-full bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400" />
                  </div>
                  {activeTab !== 'sasaran_bumil' && (
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Nama Bayi</label>
                      <input type="text" value={sasaranForm.namaBayi} onChange={e => setSasaranForm({ ...sasaranForm, namaBayi: e.target.value })} className="block w-full bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400" />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Nama</label>
                    <input type="text" value={(sasaranForm as any).nama || ''} onChange={e => setSasaranForm({ ...sasaranForm, nama: e.target.value } as any)} className="block w-full bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Jenis Kelamin</label>
                    <select value={(sasaranForm as any).jenisKelamin || ''} onChange={e => setSasaranForm({ ...sasaranForm, jenisKelamin: e.target.value } as any)} className="block w-full bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400">
                      <option value="">-- Pilih --</option>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Tanggal Lahir</label>
                    <input type="date" value={(sasaranForm as any).tanggalLahir || ''} onChange={e => setSasaranForm({ ...sasaranForm, tanggalLahir: e.target.value } as any)} className="block w-full bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Nama Ibu</label>
                    <input type="text" value={(sasaranForm as any).namaIbuOrtu || ''} onChange={e => setSasaranForm({ ...sasaranForm, namaIbuOrtu: e.target.value } as any)} className="block w-full bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Nama Ayah</label>
                    <input type="text" value={(sasaranForm as any).namaAyah || ''} onChange={e => setSasaranForm({ ...sasaranForm, namaAyah: e.target.value } as any)} className="block w-full bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400" />
                  </div>
                </>
              )}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Tahun</label>
                <input type="number" value={sasaranForm.tahun} onChange={e => setSasaranForm({ ...sasaranForm, tahun: parseInt(e.target.value) })} className="block w-full bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400" required />
              </div>
            </div>

          </motion.div>
          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={() => setShowFormSasaran(false)} className="px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#2f2f2f] rounded-md transition-all">Batal</button>
            <button type="submit" className={`${theme.bgSolid} ${theme.hoverSolid} text-white font-semibold py-3 px-8 rounded-md transition-all ${theme.shadow} flex items-center gap-2`}>
              <Save className="w-5 h-5" /> Simpan Sasaran
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {(isPosyandu || (selectedDesaId && selectedPosyanduId)) ? (
            // Level 3: Detail Posyandu
            <div className="space-y-6">
              {!isPosyandu && (
                <button
                  onClick={() => setSelectedPosyanduId('')}
                  className={`p-2 ${theme.bgLight} ${theme.bgDarkLight} ${theme.text} dark:${theme.textDark} rounded-md ${theme.hoverLight} dark:hover:bg-purple-900/50 transition-colors mb-2`}
                  title="Kembali ke Daftar Posyandu"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              {/* Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                <button
                  onClick={() => setActiveTab('pengunjung')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeTab === 'pengunjung'
                      ? `${theme.bgSolid} text-white ${theme.shadow}`
                      : 'bg-slate-100 dark:bg-[#202020] text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-[#2f2f2f]'
                    }`}
                >
                  Data Pengunjung
                </button>
                <button
                  onClick={() => setActiveTab('sasaran_bumil')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeTab === 'sasaran_bumil' || activeTab === 'sasaran'
                      ? `${theme.bgSolid} text-white ${theme.shadow}`
                      : 'bg-slate-100 dark:bg-[#202020] text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-[#2f2f2f]'
                    }`}
                >
                  Sasaran Bumil
                </button>
                <button
                  onClick={() => setActiveTab('sasaran_bayi')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeTab === 'sasaran_bayi'
                      ? `${theme.bgSolid} text-white ${theme.shadow}`
                      : 'bg-slate-100 dark:bg-[#202020] text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-[#2f2f2f]'
                    }`}
                >
                  Sasaran Bayi/Balita
                </button>
                <button
                  onClick={() => setActiveTab('sasaran_remaja')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeTab === 'sasaran_remaja'
                      ? `${theme.bgSolid} text-white ${theme.shadow}`
                      : 'bg-slate-100 dark:bg-[#202020] text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-[#2f2f2f]'
                    }`}
                >
                  Sasaran Remaja
                </button>
                <button
                  onClick={() => setActiveTab('sasaran_lansia')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeTab === 'sasaran_lansia'
                      ? `${theme.bgSolid} text-white ${theme.shadow}`
                      : 'bg-slate-100 dark:bg-[#202020] text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-[#2f2f2f]'
                    }`}
                >
                  Sasaran Lansia
                </button>
              </div>

              {activeTab === 'pengunjung' ? (
                <div className="bg-white dark:bg-[#202020] p-6 rounded-lg border border-slate-200 dark:border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                        Laporan Pengunjung
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={exportUnifiedExcel} className={`bg-white dark:bg-[#202020] ${theme.text} dark:${theme.textDark} border ${theme.borderLight} dark:border-purple-800 font-semibold py-2.5 px-4 rounded-md ${theme.hoverLight} dark:hover:bg-purple-900/20 transition-all text-sm`}>
                        Ekspor Excel (SIP 6 & 7)
                      </button>
                      {canEdit && (
                        <label className={`cursor-pointer bg-white dark:bg-[#202020] ${theme.text} dark:${theme.textDark} border ${theme.borderLight} dark:border-purple-800 font-semibold py-2.5 px-4 rounded-lg ${theme.hoverLight} dark:hover:bg-purple-900/20 transition-all text-sm flex items-center justify-center`}>
                          <span>Impor CSV</span>
                          <input type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Mobile: card list (mega table is unusable on small screens) */}
                  <div className="md:hidden space-y-3">
                    {reports.map((report) => {
                      const balitaTotal =
                        (report.bayiBaruP || 0) + (report.bayiLamaL || 0) + (report.bayiLamaP || 0) +
                        (report.balitaBaruL || 0) + (report.balitaBaruP || 0) + (report.balitaLamaL || 0) + (report.balitaLamaP || 0) +
                        (report.anakBaruL || 0) + (report.anakBaruP || 0) + (report.anakLamaL || 0) + (report.anakLamaP || 0)
                      const bumilBusui = (report.hamilLama || 0) + (report.busuiBaru || 0) + (report.busuiLama || 0)
                      const lansia = (report.lansiaL || 0) + (report.lansiaP || 0)
                      const petugas = (report.kader || 0) + (report.plkb || 0) + (report.medis || 0)
                      const namaBulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][report.bulan - 1]
                      return (
                        <button
                          key={`m-${report.id}`}
                          onClick={() => { setSelectedReportForDetail(report); setIsDetailModalOpen(true); }}
                          className="w-full text-left bg-white dark:bg-[#252525] border border-slate-200/70 dark:border-white/10 rounded-lg p-4 active:bg-slate-50 dark:active:bg-[#2f2f2f] transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-bold text-slate-800 dark:text-white">{namaBulan} {report.tahun}</p>
                            <span className={`${theme.text} text-[10px] font-semibold ${theme.bgLight} px-2 py-0.5 rounded-full`}>{report.status}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-center">
                            <div>
                              <p className="text-base font-bold text-slate-800 dark:text-white">{balitaTotal}</p>
                              <p className="text-[10px] text-slate-400">Bayi/Balita</p>
                            </div>
                            <div>
                              <p className="text-base font-bold text-slate-800 dark:text-white">{bumilBusui}</p>
                              <p className="text-[10px] text-slate-400">Bumil/Busui</p>
                            </div>
                            <div>
                              <p className="text-base font-bold text-slate-800 dark:text-white">{lansia}</p>
                              <p className="text-[10px] text-slate-400">Lansia</p>
                            </div>
                            <div>
                              <p className="text-base font-bold text-slate-800 dark:text-white">{petugas}</p>
                              <p className="text-[10px] text-slate-400">Petugas</p>
                            </div>
                          </div>
                          <p className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">Ketuk untuk lihat detail lengkap</p>
                        </button>
                      )
                    })}
                    {reports.length === 0 && (
                      <p className="text-center text-sm text-slate-400 py-8">Belum ada laporan untuk tahun ini.</p>
                    )}
                  </div>

                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
                      <thead className="text-[11px] uppercase tracking-wider bg-transparent text-slate-500 dark:text-white/50 border-b border-slate-200/70 dark:border-white/10">
                        <tr>
                          <th className="px-4 py-3 sticky left-0 z-10 bg-white dark:bg-[#202020] w-14 min-w-14">No</th>
                          <th className="px-4 py-3 sticky left-14 z-10 bg-white dark:bg-[#202020]">Bulan</th>
                          <th className="px-4 py-3">Bayi Baru (L)</th>
                          <th className="px-4 py-3">Bayi Baru (P)</th>
                          <th className="px-4 py-3">Bayi Lama (L)</th>
                          <th className="px-4 py-3">Bayi Lama (P)</th>
                          <th className="px-4 py-3">Balita Baru (L)</th>
                          <th className="px-4 py-3">Balita Baru (P)</th>
                          <th className="px-4 py-3">Balita Lama (L)</th>
                          <th className="px-4 py-3">Balita Lama (P)</th>
                          <th className="px-4 py-3">Anak Baru (L)</th>
                          <th className="px-4 py-3">Anak Baru (P)</th>
                          <th className="px-4 py-3">Anak Lama (L)</th>
                          <th className="px-4 py-3">Anak Lama (P)</th>
                          <th className="px-4 py-3">Prod Baru (L)</th>
                          <th className="px-4 py-3">Prod Baru (P)</th>
                          <th className="px-4 py-3">Prod Lama (L)</th>
                          <th className="px-4 py-3">Prod Lama (P)</th>
                          <th className="px-4 py-3">Hamil Baru</th>
                          <th className="px-4 py-3">Hamil Lama</th>
                          <th className="px-4 py-3">Busui Baru</th>
                          <th className="px-4 py-3">Busui Lama</th>
                          <th className="px-4 py-3">Lansia (L)</th>
                          <th className="px-4 py-3">Lansia (P)</th>
                          <th className="px-4 py-3">WUS</th>
                          <th className="px-4 py-3">Ibu</th>
                          <th className="px-4 py-3">Kader</th>
                          <th className="px-4 py-3">PLKB</th>
                          <th className="px-4 py-3">Medis</th>
                          <th className="px-4 py-3">Lahir (L)</th>
                          <th className="px-4 py-3">Lahir (P)</th>
                          <th className="px-4 py-3">Mati (L)</th>
                          <th className="px-4 py-3">Mati (P)</th>
                          <th className="px-4 py-3">Status</th>

                        </tr>
                      </thead>
                      <tbody>
                        {reports.map((report, index) => {
                          const monthStr = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'][report.bulan - 1];
                          const attendees = [
                            ...dummySasaran.filter(s => s.kunjungan.includes(monthStr)).map(s => ({ ...s, isOfficer: false })),
                            { id: 'p1', nama: 'Siti', role: 'Kader', isOfficer: true },
                            { id: 'p2', nama: 'Ani', role: 'Kader', isOfficer: true },
                            { id: 'p3', nama: 'Budi', role: 'PLKB', isOfficer: true },
                          ];

                          return (
                            <Fragment key={report.id}>
                              <tr
                                onClick={() => { setSelectedReportForDetail(report); setIsDetailModalOpen(true); }}
                                className="border-b border-slate-200/70 dark:border-white/10 hover:bg-slate-50/50 dark:hover:bg-[#2f2f2f]/20 transition-colors cursor-pointer"
                              >
                                <td className="px-4 py-3 font-medium text-slate-800 dark:text-white sticky left-0 z-10 bg-white dark:bg-[#202020] w-14 min-w-14">{index + 1}</td>
                                <td className="px-4 py-3 font-medium text-slate-800 dark:text-white sticky left-14 z-10 bg-white dark:bg-[#202020]">{report.bulan}/{report.tahun}</td>

                                <td className="px-4 py-3">{Math.floor(dummySasaran.filter(s => s.kunjungan.includes(['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'][report.bulan - 1])).length / 2)}</td>
                                <td className="px-4 py-3">{report.bayiBaruP || 0}</td>
                                <td className="px-4 py-3">{report.bayiLamaL || 0}</td>
                                <td className="px-4 py-3">{report.bayiLamaP || 0}</td>
                                <td className="px-4 py-3">{report.balitaBaruL || 0}</td>
                                <td className="px-4 py-3">{report.balitaBaruP || 0}</td>
                                <td className="px-4 py-3">{report.balitaLamaL || 0}</td>
                                <td className="px-4 py-3">{report.balitaLamaP || 0}</td>
                                <td className="px-4 py-3">{report.anakBaruL || 0}</td>
                                <td className="px-4 py-3">{report.anakBaruP || 0}</td>
                                <td className="px-4 py-3">{report.anakLamaL || 0}</td>
                                <td className="px-4 py-3">{report.anakLamaP || 0}</td>
                                <td className="px-4 py-3">{report.prodBaruL || 0}</td>
                                <td className="px-4 py-3">{report.prodBaruP || 0}</td>
                                <td className="px-4 py-3">{report.prodLamaL || 0}</td>
                                <td className="px-4 py-3">{report.prodLamaP || 0}</td>
                                <td className="px-4 py-3">{dummySasaran.filter(s => s.kunjungan.includes(['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'][report.bulan - 1])).length}</td>
                                <td className="px-4 py-3">{report.hamilLama || 0}</td>
                                <td className="px-4 py-3">{report.busuiBaru || 0}</td>
                                <td className="px-4 py-3">{report.busuiLama || 0}</td>
                                <td className="px-4 py-3">{report.lansiaL || 0}</td>
                                <td className="px-4 py-3">{report.lansiaP || 0}</td>
                                <td className="px-4 py-3">{report.wus || 0}</td>
                                <td className="px-4 py-3">{report.ibu || 0}</td>
                                <td className="px-4 py-3">{report.kader || 0}</td>
                                <td className="px-4 py-3">{report.plkb || 0}</td>
                                <td className="px-4 py-3">{report.medis || 0}</td>
                                <td className="px-4 py-3">{report.lahirL || 0}</td>
                                <td className="px-4 py-3">{report.lahirP || 0}</td>
                                <td className="px-4 py-3">{report.meninggalL || 0}</td>
                                <td className="px-4 py-3">{report.meninggalP || 0}</td>
                                <td className="px-4 py-3"><span className={`${theme.text} text-xs font-medium ${theme.bgLight} px-2.5 py-1 rounded-full`}>{report.status}</span></td>

                              </tr>
                            </Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Perhitungan Semester & Tahunan */}
                  <div className="mt-8 border-t border-slate-200/70 dark:border-white/10 pt-6">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">Ringkasan Total Pengunjung ({tahunAktif})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Semester 1 */}
                      <div className="p-4 rounded-lg border border-slate-200/70 dark:border-white/10 bg-slate-50/50 dark:bg-[#202020]/50">
                        <h4 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 mb-2">Semester 1 (Jan - Jun)</h4>
                        <div className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-300">
                          <div className="flex justify-between"><span>Bayi & Balita:</span><span className="font-semibold text-slate-800 dark:text-white">{(getTotals([1, 2, 3, 4, 5, 6]).bayi + getTotals([1, 2, 3, 4, 5, 6]).balita).toLocaleString('id-ID')}</span></div>
                          <div className="flex justify-between"><span>Ibu Hamil & Menyusui:</span><span className="font-semibold text-slate-800 dark:text-white">{(getTotals([1, 2, 3, 4, 5, 6]).bumil + getTotals([1, 2, 3, 4, 5, 6]).busui).toLocaleString('id-ID')}</span></div>
                          <div className="flex justify-between"><span>Petugas:</span><span className="font-semibold text-slate-800 dark:text-white">{getTotals([1, 2, 3, 4, 5, 6]).petugas.toLocaleString('id-ID')}</span></div>
                        </div>
                      </div>
                      {/* Semester 2 */}
                      <div className="p-4 rounded-lg border border-slate-200/70 dark:border-white/10 bg-slate-50/50 dark:bg-[#202020]/50">
                        <h4 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 mb-2">Semester 2 (Jul - Des)</h4>
                        <div className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-300">
                          <div className="flex justify-between"><span>Bayi & Balita:</span><span className="font-semibold text-slate-800 dark:text-white">{(getTotals([7, 8, 9, 10, 11, 12]).bayi + getTotals([7, 8, 9, 10, 11, 12]).balita).toLocaleString('id-ID')}</span></div>
                          <div className="flex justify-between"><span>Ibu Hamil & Menyusui:</span><span className="font-semibold text-slate-800 dark:text-white">{(getTotals([7, 8, 9, 10, 11, 12]).bumil + getTotals([7, 8, 9, 10, 11, 12]).busui).toLocaleString('id-ID')}</span></div>
                          <div className="flex justify-between"><span>Petugas:</span><span className="font-semibold text-slate-800 dark:text-white">{getTotals([7, 8, 9, 10, 11, 12]).petugas.toLocaleString('id-ID')}</span></div>
                        </div>
                      </div>
                      {/* Tahunan */}
                      <div className={`p-4 rounded-lg border ${theme.borderLight} bg-purple-50/20 dark:bg-purple-950/10`}>
                        <h4 className={`text-sm font-semibold ${theme.text} dark:${theme.textDark} mb-2`}>Total Tahunan</h4>
                        <div className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-300 font-medium">
                          <div className="flex justify-between"><span>Bayi & Balita:</span><span className="font-bold text-slate-800 dark:text-white">{(getTotals([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).bayi + getTotals([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).balita).toLocaleString('id-ID')}</span></div>
                          <div className="flex justify-between"><span>Ibu Hamil & Menyusui:</span><span className="font-bold text-slate-800 dark:text-white">{(getTotals([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).bumil + getTotals([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).busui).toLocaleString('id-ID')}</span></div>
                          <div className="flex justify-between"><span>Petugas:</span><span className="font-bold text-slate-800 dark:text-white">{getTotals([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).petugas.toLocaleString('id-ID')}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-[#202020] p-6 rounded-lg border border-slate-200 dark:border-white/10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                        {activeTab === 'sasaran_bumil' || activeTab === 'sasaran' ? 'Sasaran Ibu Hamil' :
                          activeTab === 'sasaran_bayi' ? 'Sasaran Bayi/Balita' :
                            activeTab === 'sasaran_remaja' ? 'Sasaran Remaja' :
                              activeTab === 'sasaran_lansia' ? 'Sasaran Lansia' : 'Sasaran'}
                      </h2>
                      <p className="text-sm text-slate-500">Kunjungan Bulanan</p>
                    </div>
                    <button
                      onClick={() => setShowFormSasaran(true)}
                      className={`${theme.bgSolid} ${theme.hoverSolid} text-white font-semibold py-2.5 px-4 rounded-md transition-all ${theme.shadow} flex items-center justify-center gap-2 text-sm w-full md:w-auto`}
                    >
                      <Plus className="w-4 h-4" /> Tambah Sasaran
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full md:w-96 mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="block w-full bg-slate-50 dark:bg-[#2f2f2f]/50 border border-slate-200 dark:border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 transition-all"
                      placeholder="Cari nama sasaran..."
                    />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
                      <thead className="text-[11px] uppercase tracking-wider bg-transparent text-slate-500 dark:text-white/50 border-b border-slate-200/70 dark:border-white/10">
                        <tr>
                          <th className="px-4 py-3">{activeTab === 'sasaran_bumil' || activeTab === 'sasaran' ? 'Nama Ibu' : 'Nama'}</th>
                          {activeTab !== 'sasaran_bumil' && activeTab !== 'sasaran' && (
                            <>
                              <th className="px-4 py-3">JK</th>
                              <th className="px-4 py-3">Tgl Lahir</th>
                            </>
                          )}
                          <th className="px-4 py-3">{activeTab === 'sasaran_bumil' || activeTab === 'sasaran' ? 'Nama Suami' : 'Nama Ibu'}</th>
                          {activeTab === 'sasaran_bumil' || activeTab === 'sasaran' ? (
                            <th className="px-4 py-3">{activeTab === 'sasaran' ? 'Nama Bayi' : 'Nama Ayah'}</th>
                          ) : (
                            <th className="px-4 py-3">Nama Ayah</th>
                          )}
                          {['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'].map(m => (
                            <th key={m} className="px-2 py-3 text-center">{m}</th>
                          ))}
                          <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dummySasaran.filter(s => (s as any).type === activeTab)
                          .filter(s => {
                            const name = activeTab === 'sasaran_bumil' || activeTab === 'sasaran' ? s.namaIbu : ((s as any).nama || s.namaIbu);
                            return name.toLowerCase().includes(search.toLowerCase());
                          })
                          .map(s => (
                            <tr key={s.id} className="border-b border-slate-200/70 dark:border-white/10 hover:bg-slate-50/50 dark:hover:bg-[#2f2f2f]/20 transition-colors">
                              <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">
                                {activeTab === 'sasaran_bumil' || activeTab === 'sasaran' ? s.namaIbu : (s as any).nama || s.namaIbu}
                              </td>
                              {activeTab !== 'sasaran_bumil' && activeTab !== 'sasaran' && (
                                <>
                                  <td className="px-4 py-3">{(s as any).jenisKelamin || '-'}</td>
                                  <td className="px-4 py-3">{(s as any).tanggalLahir || '-'}</td>
                                </>
                              )}
                              <td className="px-4 py-3">{activeTab === 'sasaran_bumil' || activeTab === 'sasaran' ? s.namaSuami : (s as any).namaIbuOrtu || '-'}</td>
                              {activeTab !== 'sasaran_bumil' && (
                                <td className="px-4 py-3">{activeTab === 'sasaran' ? s.namaBayi : (s as any).namaAyah || '-'}</td>
                              )}
                              {['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'].map(m => (
                                <td key={m} className="px-2 py-3 text-center">
                                  <button
                                    onClick={() => handleChecklistClick(s, m)}
                                    className={`w-5 h-5 mx-auto rounded-md flex items-center justify-center transition-colors ${s.kunjungan.includes(m)
                                        ? `${theme.bgSolid} text-white`
                                        : 'bg-slate-100 dark:bg-[#2f2f2f] hover:bg-slate-200 dark:hover:bg-zinc-600 text-transparent'
                                      }`}
                                  >
                                    {s.kunjungan.includes(m) ? '✓' : ''}
                                  </button>
                                </td>
                              ))}
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingId(s.id);
                                      setSasaranForm(s as any);
                                      setShowFormSasaran(true);
                                    }}
                                    className="text-blue-500 hover:text-blue-600 transition-colors"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                                        try {
                                          const res = await fetch(`/api/sasaran?id=${s.id}`, {
                                            method: 'DELETE',
                                          });
                                          if (res.ok) {
                                            const activePosyanduId = isPosyandu ? (session?.user as any)?.posyanduId : selectedPosyanduId;
                                            await fetchSasaran(activePosyanduId);
                                          } else {
                                            alert('Gagal menghapus data.');
                                          }
                                        } catch (err) {
                                          console.error(err);
                                          alert('Terjadi kesalahan saat menghapus data.');
                                        }
                                      }
                                    }}
                                    className="text-rose-500 hover:text-rose-600 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : selectedDesaId ? (
            // Level 3: List Posyandu
            <div className="bg-white dark:bg-[#202020] p-6 rounded-lg border border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  {role !== 'OPERATOR_DESA' && (
                    <button
                      onClick={() => setSelectedDesaId('')}
                      className={`p-2 ${theme.bgLight} ${theme.bgDarkLight} ${theme.text} dark:${theme.textDark} rounded-md ${theme.hoverLight} dark:hover:bg-purple-900/50 transition-colors`}
                      title="Kembali ke Daftar Desa"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white mt-2">
                    Daftar Posyandu di Desa {desas.find(d => d.id === selectedDesaId)?.nama}
                  </h2>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
                  <thead className="text-[11px] uppercase tracking-wider bg-transparent text-slate-500 dark:text-white/50 border-b border-slate-200/70 dark:border-white/10">
                    <tr>
                      <th className="px-6 py-4">Nama Posyandu</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posyandus.map((p) => (
                      <tr key={p.id} className="border-b border-slate-200/70 dark:border-white/10 hover:bg-slate-50/50 dark:hover:bg-[#2f2f2f]/20 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{p.nama}</td>
                        <td className="px-6 py-4"><span className={`${theme.text} text-xs font-medium ${theme.bgLight} px-2.5 py-1 rounded-full`}>Selesai</span></td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => setSelectedPosyanduId(p.id)} className={`${theme.text} hover:${theme.textLight} font-medium text-xs`}>Buka Data</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : selectedKecamatanId ? (
            // Level 2: List Desa
            <div className="bg-white dark:bg-[#202020] p-6 rounded-lg border border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  {role !== 'ADMIN_KECAMATAN' && (
                    <button
                      onClick={() => setSelectedKecamatanId('')}
                      className={`p-2 ${theme.bgLight} ${theme.bgDarkLight} ${theme.text} dark:${theme.textDark} rounded-md ${theme.hoverLight} dark:hover:bg-purple-900/50 transition-colors`}
                      title="Kembali ke Daftar Kecamatan"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white mt-2">Pilih Desa</h2>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">Silakan pilih desa di {kecamatans.find(k => k.id === selectedKecamatanId)?.nama} untuk melihat data SIP 6</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
                  <thead className="text-[11px] uppercase tracking-wider bg-transparent text-slate-500 dark:text-white/50 border-b border-slate-200/70 dark:border-white/10">
                    <tr>
                      <th className="px-6 py-4">Nama Desa</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {desas.map((desa) => (
                      <tr key={desa.id} className="border-b border-slate-200/70 dark:border-white/10 hover:bg-slate-50/50 dark:hover:bg-[#2f2f2f]/20 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{desa.nama}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => setSelectedDesaId(desa.id)} className={`${theme.text} hover:${theme.textLight} font-medium text-xs`}>Detail</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            // Level 1: List Kecamatan
            <div className="bg-white dark:bg-[#202020] p-6 rounded-lg border border-slate-200 dark:border-white/10">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Daftar Kecamatan</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
                  <thead className="text-[11px] uppercase tracking-wider bg-transparent text-slate-500 dark:text-white/50 border-b border-slate-200/70 dark:border-white/10">
                    <tr>
                      <th className="px-6 py-4">Nama Kecamatan</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kecamatans.map((kec) => (
                      <tr key={kec.id} className="border-b border-slate-200/70 dark:border-white/10 hover:bg-slate-50/50 dark:hover:bg-[#2f2f2f]/20 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{kec.nama}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => setSelectedKecamatanId(kec.id)} className={`${theme.text} hover:${theme.textLight} font-medium text-xs`}>Detail</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Detail Pengunjung */}
      <AnimatePresence>
        {isDetailModalOpen && selectedReportForDetail && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
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
              className="relative bg-white dark:bg-[#252525] rounded-t-2xl rounded-b-none sm:rounded-lg shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-slate-200/70 dark:border-white/10"
            >
              <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${theme.bgGradient}`}></div>

              <div className="p-6 border-b border-slate-200/70 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Users className={`w-5 h-5 ${theme.text}`} />
                      Daftar Individu Hadir
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                      Bulan {selectedReportForDetail.bulan} / Tahun {selectedReportForDetail.tahun}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-md bg-slate-50 dark:bg-[#202020] text-slate-400 hover:text-slate-500 dark:hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                {(() => {
                  const monthStr = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'][selectedReportForDetail.bulan - 1];
                  const attendees = [
                    ...dummySasaran.filter(s => s.kunjungan.includes(monthStr)).map(s => ({ ...s, isOfficer: false })),
                    { id: 'p1', nama: 'Siti', role: 'Kader', isOfficer: true },
                    { id: 'p2', nama: 'Ani', role: 'Kader', isOfficer: true },
                    { id: 'p3', nama: 'Budi', role: 'PLKB', isOfficer: true },
                  ];

                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{attendees.length} Orang</span>
                      </div>
                      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-white/10">
                        <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
                          <thead className="text-[11px] uppercase tracking-wider bg-transparent text-slate-500 dark:text-white/50 border-b border-slate-200/70 dark:border-white/10">
                            <tr>
                              <th className="px-4 py-2.5">No</th>
                              <th className="px-4 py-2.5">Nama</th>
                              <th className="px-4 py-2.5">Kategori</th>
                              <th className="px-4 py-2.5">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attendees.map((s, idx) => (
                              <tr key={s.id} className="border-b border-slate-200/70 dark:border-white/10/50 hover:bg-white dark:hover:bg-[#2f2f2f] transition-colors">
                                <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-white">{idx + 1}</td>
                                <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-white">{(s as any).nama || (s as any).namaIbu}</td>
                                <td className="px-4 py-2.5">{(s as any).isOfficer ? (s as any).role : ((s as any).namaSuami ? 'Bumil' : 'Sasaran')}</td>
                                <td className="px-4 py-2.5">
                                  <span className={`${theme.text} dark:${theme.textDark} font-medium`}>Hadir ✓</span>
                                </td>
                              </tr>
                            ))}
                            {attendees.length === 0 && (
                              <tr>
                                <td colSpan={4} className="text-center py-4 text-sm text-slate-500 bg-white dark:bg-[#202020]">
                                  Tidak ada data individu yang hadir di bulan ini.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Attendance Checklist Details Popup Modal */}
      <AnimatePresence>
        {selectedAttendanceForModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAttendanceForModal(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white dark:bg-[#252525] rounded-t-2xl rounded-b-none sm:rounded-lg shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto border border-slate-200/70 dark:border-white/10"
            >
              <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${theme.bgGradient}`}></div>
              
              <div className="p-6 border-b border-slate-200/70 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Pencatatan Kehadiran
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedAttendanceForModal.sasaran.type === 'sasaran_bumil' ? selectedAttendanceForModal.sasaran.namaIbu : selectedAttendanceForModal.sasaran.nama} • Bulan {selectedAttendanceForModal.month}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedAttendanceForModal(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-slate-50 dark:bg-[#202020] text-slate-400 hover:text-slate-500 dark:hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {selectedAttendanceForModal.sasaran.type === 'sasaran_bumil' && (
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2f2f2f]/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={checklistForm.bumilDatang}
                        onChange={(e) => setChecklistForm({ ...checklistForm, bumilDatang: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 dark:border-white/10 text-purple-600 focus:ring-purple-500/25 focus:border-purple-400"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Bumil Datang</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2f2f2f]/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={checklistForm.busuiDatang}
                        onChange={(e) => setChecklistForm({ ...checklistForm, busuiDatang: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 dark:border-white/10 text-purple-600 focus:ring-purple-500/25 focus:border-purple-400"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Busui Datang</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2f2f2f]/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={checklistForm.bbKurang}
                        onChange={(e) => setChecklistForm({ ...checklistForm, bbKurang: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 dark:border-white/10 text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 flex flex-col">
                        <span>BB Kurang</span>
                        <span className="text-xs text-rose-500 font-semibold">(Garis Merah)</span>
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2f2f2f]/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={checklistForm.lilaKek}
                        onChange={(e) => setChecklistForm({ ...checklistForm, lilaKek: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 dark:border-white/10 text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 flex flex-col">
                        <span>LILA KEK</span>
                        <span className="text-xs text-rose-500 font-semibold">(Merah)</span>
                      </span>
                    </label>
                  </div>
                )}

                {selectedAttendanceForModal.sasaran.type === 'sasaran_bayi' && (
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2f2f2f]/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={checklistForm.balitaDatang}
                        onChange={(e) => setChecklistForm({ ...checklistForm, balitaDatang: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 dark:border-white/10 text-purple-600 focus:ring-purple-500/25 focus:border-purple-400"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Balita Datang</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2f2f2f]/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={checklistForm.bbNaik}
                        onChange={(e) => setChecklistForm({ ...checklistForm, bbNaik: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 dark:border-white/10 text-purple-600 focus:ring-purple-500/25 focus:border-purple-400"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">BB Naik</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2f2f2f]/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={checklistForm.asiEksklusif}
                        onChange={(e) => setChecklistForm({ ...checklistForm, asiEksklusif: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 dark:border-white/10 text-purple-600 focus:ring-purple-500/25 focus:border-purple-400"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">ASI Eksklusif</span>
                    </label>
                  </div>
                )}

                {selectedAttendanceForModal.sasaran.type === 'sasaran_remaja' && (
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2f2f2f]/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={checklistForm.remaja614Datang}
                        onChange={(e) => setChecklistForm({ ...checklistForm, remaja614Datang: e.target.checked, remaja1518Datang: e.target.checked ? false : checklistForm.remaja1518Datang })}
                        className="w-5 h-5 rounded border-slate-300 dark:border-white/10 text-purple-600 focus:ring-purple-500/25 focus:border-purple-400"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">6-14 Th Datang</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2f2f2f]/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={checklistForm.remaja1518Datang}
                        onChange={(e) => setChecklistForm({ ...checklistForm, remaja1518Datang: e.target.checked, remaja614Datang: e.target.checked ? false : checklistForm.remaja614Datang })}
                        className="w-5 h-5 rounded border-slate-300 dark:border-white/10 text-purple-600 focus:ring-purple-500/25 focus:border-purple-400"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">15-18 Th Datang</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2f2f2f]/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={checklistForm.imtNormal}
                        onChange={(e) => setChecklistForm({ ...checklistForm, imtNormal: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 dark:border-white/10 text-purple-600 focus:ring-purple-500/25 focus:border-purple-400"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">IMT Normal</span>
                    </label>
                  </div>
                )}

                {selectedAttendanceForModal.sasaran.type === 'sasaran_lansia' && (
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2f2f2f]/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={checklistForm.tensiTinggi}
                        onChange={(e) => setChecklistForm({ ...checklistForm, tensiTinggi: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 dark:border-white/10 text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 flex flex-col">
                        <span>Tensi Tinggi</span>
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2f2f2f]/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={checklistForm.gulaDarahTinggi}
                        onChange={(e) => setChecklistForm({ ...checklistForm, gulaDarahTinggi: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 dark:border-white/10 text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 flex flex-col">
                        <span>Gula Darah Tinggi</span>
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2f2f2f]/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={checklistForm.mandiri}
                        onChange={(e) => setChecklistForm({ ...checklistForm, mandiri: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 dark:border-white/10 text-purple-600 focus:ring-purple-500/25 focus:border-purple-400"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Mandiri</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-200/70 dark:border-white/10 bg-slate-50 dark:bg-[#252525]/30 flex items-center justify-end gap-2.5">
                {selectedAttendanceForModal.sasaran.kunjungan?.includes(selectedAttendanceForModal.month) && (
                  <button
                    type="button"
                    onClick={() => deleteAttendance(selectedAttendanceForModal.sasaran.id, selectedAttendanceForModal.month)}
                    className="mr-auto text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 text-sm font-semibold transition-colors"
                  >
                    Hapus Kehadiran
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedAttendanceForModal(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#2f2f2f] rounded-md transition-all"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => saveAttendanceDetails(selectedAttendanceForModal.sasaran.id, selectedAttendanceForModal.month, checklistForm)}
                  className={`px-5 py-2 text-sm font-semibold text-white rounded-md bg-gradient-to-r ${theme.bgGradient} ${theme.hoverGradient} transition-all ${theme.shadow}`}
                >
                  Simpan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
