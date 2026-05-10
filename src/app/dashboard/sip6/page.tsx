'use client'

import { useState, useEffect, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Save, ArrowLeft, Heart, 
  Baby, UserCircle, UserPlus, Shield, Activity, Edit2, Trash2, Plus, HardHat, X, Search
} from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function Sip6Page() {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role
  const isPosyandu = role === 'OPERATOR_POSYANDU'
  const [showForm, setShowForm] = useState(false)
  const [showFormSasaran, setShowFormSasaran] = useState(false)
  const [activeTab, setActiveTab] = useState('pengunjung')
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')

  const [selectedKecamatanId, setSelectedKecamatanId] = useState('')
  const [selectedDesaId, setSelectedDesaId] = useState('')
  const [selectedPosyanduId, setSelectedPosyanduId] = useState('')
  
  const [kecamatans, setKecamatans] = useState<any[]>([])
  const [desas, setDesas] = useState<any[]>([])
  const [posyandus, setPosyandus] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
    fetchKecamatans()
  }, [])

  const fetchKecamatans = async () => {
    const res = await fetch('/api/kecamatan')
    const data = await res.json()
    setKecamatans(data)
  }

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

  const [dummySasaran, setDummySasaran] = useState([
    { id: '1', type: 'sasaran_bumil', namaIbu: 'Siti Aminah', namaSuami: 'Budi', namaBayi: 'Rizki', tahun: 2026, kunjungan: ['JAN', 'FEB', 'MAR', 'MEI'] },
    { id: '2', type: 'sasaran_bumil', namaIbu: 'Sri Wahyuni', namaSuami: 'Agus', namaBayi: 'Ahmad', tahun: 2026, kunjungan: ['JAN', 'APR', 'MEI'] },
    { id: '3', type: 'sasaran_bayi', nama: 'Budi Kecil', jenisKelamin: 'L', tanggalLahir: '2025-01-15', namaIbuOrtu: 'Siti', namaAyah: 'Budi', tahun: 2026, kunjungan: ['JAN', 'FEB'] },
    { id: '4', type: 'sasaran_remaja', nama: 'Ani', jenisKelamin: 'P', tanggalLahir: '2010-05-20', namaIbuOrtu: 'Siti', namaAyah: 'Budi', tahun: 2026, kunjungan: ['JAN'] },
    { id: '5', type: 'sasaran_lansia', nama: 'Mbah Jo', jenisKelamin: 'L', tanggalLahir: '1950-08-10', namaIbuOrtu: '-', namaAyah: '-', tahun: 2026, kunjungan: ['JAN', 'FEB', 'MAR'] },
  ])

  const [editingId, setEditingId] = useState<string | null>(null)

  const [sasaranForm, setSasaranForm] = useState({
    namaIbu: '', namaSuami: '', namaBayi: '', tahun: 2026, kunjungan: [] as string[]
  })

  const toggleAttendance = (id: string, month: string) => {
    setDummySasaran(dummySasaran.map(s => {
      if (s.id === id) {
        const hasVisited = s.kunjungan.includes(month)
        return {
          ...s,
          kunjungan: hasVisited 
            ? s.kunjungan.filter(m => m !== month)
            : [...s.kunjungan, month]
        }
      }
      return s
    }))
  }

  const exportToCSV = () => {
    const headers = ["No", "Bulan", "Tanggal Input", "Bayi Baru (L)", "Bayi Baru (P)", "Hamil Baru", "Kader", "PLKB", "Medis", "Status"];
    const rows = reports.map((r, index) => [
      index + 1,
      `${r.bulan}/${r.tahun}`,
      (r as any).tanggalInput || '10/05/2026',
      Math.floor(dummySasaran.filter(s => s.kunjungan.includes(['JAN','FEB','MAR','APR','MEI','JUN','JUL','AGU','SEP','OKT','NOV','DES'][r.bulan - 1])).length / 2),
      r.bayiBaruP || 0,
      dummySasaran.filter(s => s.kunjungan.includes(['JAN','FEB','MAR','APR','MEI','JUN','JUL','AGU','SEP','OKT','NOV','DES'][r.bulan - 1])).length,
      r.kader || 0,
      r.plkb || 0,
      r.medis || 0,
      r.status
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data_bulanan_sip6.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const handleDelete = (id: string) => {
    if(confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setReports(reports.filter(r => r.id !== id))
    }
  }

  const handleAdd = () => {
    setFormData(initialForm)
    setEditId(null)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const oldReport = reports.find(r => r.id === editId)
    const newReport = {
      ...formData,
      id: editId || Date.now().toString(),
      status: 'Tersimpan',
      tanggalInput: (oldReport as any)?.tanggalInput || new Date().toLocaleDateString('id-ID')
    }

    if (editId) {
      setReports(reports.map(r => r.id === editId ? newReport : r))
    } else {
      setReports([newReport, ...reports])
    }

    alert('Data SIP 6 berhasil disimpan!')
    setShowForm(false)
    setFormData(initialForm)
    setEditId(null)
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
            className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>Bulan {i + 1}</option>
            ))}
          </select>
          <select 
            value={formData.tahun}
            onChange={(e) => handleChange('tahun', parseInt(e.target.value))}
            className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>


      {showFormSasaran ? (
        <form onSubmit={(e) => { 
          e.preventDefault(); 
          if (editingId) {
            setDummySasaran(dummySasaran.map(item => item.id === editingId ? ({ ...item, ...sasaranForm } as any) : item));
            setEditingId(null);
          } else {
            setDummySasaran([...dummySasaran, { id: Date.now().toString(), type: activeTab, ...sasaranForm } as any]);
          }
          setShowFormSasaran(false); 
          setSasaranForm({ namaIbu: '', namaSuami: '', namaBayi: '', tahun: 2026, kunjungan: [] });
        }} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                {editingId ? 'Edit Sasaran' : 
                 activeTab === 'sasaran_bumil' || activeTab === 'sasaran' ? 'Tambah Sasaran Ibu Hamil' :
                 activeTab === 'sasaran_bayi' ? 'Tambah Sasaran Bayi/Balita' :
                 activeTab === 'sasaran_remaja' ? 'Tambah Sasaran Remaja' :
                 activeTab === 'sasaran_lansia' ? 'Tambah Sasaran Lansia' : 'Tambah Sasaran'}
              </h2>
              <button type="button" onClick={() => setShowFormSasaran(false)} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Kembali
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTab === 'sasaran_bumil' || activeTab === 'sasaran' ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Nama Ibu</label>
                    <input type="text" value={sasaranForm.namaIbu} onChange={e => setSasaranForm({...sasaranForm, namaIbu: e.target.value})} className="block w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Nama Suami</label>
                    <input type="text" value={sasaranForm.namaSuami} onChange={e => setSasaranForm({...sasaranForm, namaSuami: e.target.value})} className="block w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  {activeTab !== 'sasaran_bumil' && (
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Nama Bayi</label>
                      <input type="text" value={sasaranForm.namaBayi} onChange={e => setSasaranForm({...sasaranForm, namaBayi: e.target.value})} className="block w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Nama</label>
                    <input type="text" value={(sasaranForm as any).nama || ''} onChange={e => setSasaranForm({...sasaranForm, nama: e.target.value} as any)} className="block w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Jenis Kelamin</label>
                    <select value={(sasaranForm as any).jenisKelamin || ''} onChange={e => setSasaranForm({...sasaranForm, jenisKelamin: e.target.value} as any)} className="block w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value="">-- Pilih --</option>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Tanggal Lahir</label>
                    <input type="date" value={(sasaranForm as any).tanggalLahir || ''} onChange={e => setSasaranForm({...sasaranForm, tanggalLahir: e.target.value} as any)} className="block w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Nama Ibu</label>
                    <input type="text" value={(sasaranForm as any).namaIbuOrtu || ''} onChange={e => setSasaranForm({...sasaranForm, namaIbuOrtu: e.target.value} as any)} className="block w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Nama Ayah</label>
                    <input type="text" value={(sasaranForm as any).namaAyah || ''} onChange={e => setSasaranForm({...sasaranForm, namaAyah: e.target.value} as any)} className="block w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </>
              )}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Tahun</label>
                <input type="number" value={sasaranForm.tahun} onChange={e => setSasaranForm({...sasaranForm, tahun: parseInt(e.target.value)})} className="block w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
              </div>
            </div>

          </motion.div>
          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={() => setShowFormSasaran(false)} className="px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-xl transition-all">Batal</button>
            <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2">
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
                      className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors mb-2"
                      title="Kembali ke Daftar Posyandu"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
              {/* Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                <button 
                  onClick={() => setActiveTab('pengunjung')}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                    activeTab === 'pengunjung' 
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20' 
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  Data Pengunjung
                </button>
                <button 
                  onClick={() => setActiveTab('sasaran_bumil')}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                    activeTab === 'sasaran_bumil' || activeTab === 'sasaran'
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20' 
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  Sasaran Bumil
                </button>
                <button 
                  onClick={() => setActiveTab('sasaran_bayi')}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                    activeTab === 'sasaran_bayi' 
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20' 
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  Sasaran Bayi/Balita
                </button>
                <button 
                  onClick={() => setActiveTab('sasaran_remaja')}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                    activeTab === 'sasaran_remaja' 
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20' 
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  Sasaran Remaja
                </button>
                <button 
                  onClick={() => setActiveTab('sasaran_lansia')}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                    activeTab === 'sasaran_lansia' 
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20' 
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  Sasaran Lansia
                </button>
              </div>

              {activeTab === 'pengunjung' ? (
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                        Laporan Pengunjung
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={exportToCSV} className="bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold py-2.5 px-4 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all text-sm">
                        Export CSV
                      </button>

                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
                      <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-700 dark:text-slate-200">
                        <tr>
                          <th className="px-4 py-3">No</th>
                          <th className="px-4 py-3">Bulan</th>
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
                          const monthStr = ['JAN','FEB','MAR','APR','MEI','JUN','JUL','AGU','SEP','OKT','NOV','DES'][report.bulan - 1];
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
                                className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-700/20 transition-colors cursor-pointer"
                              >
                            <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{index + 1}</td>
                            <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{report.bulan}/{report.tahun}</td>

                            <td className="px-4 py-3">{Math.floor(dummySasaran.filter(s => s.kunjungan.includes(['JAN','FEB','MAR','APR','MEI','JUN','JUL','AGU','SEP','OKT','NOV','DES'][report.bulan - 1])).length / 2)}</td>
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
                            <td className="px-4 py-3">{dummySasaran.filter(s => s.kunjungan.includes(['JAN','FEB','MAR','APR','MEI','JUN','JUL','AGU','SEP','OKT','NOV','DES'][report.bulan - 1])).length}</td>
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
                            <td className="px-4 py-3"><span className="text-emerald-600 text-xs font-medium bg-emerald-50 px-2.5 py-1 rounded-full">{report.status}</span></td>

                          </tr>
                        </Fragment>
                      );
                    })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
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
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm w-full md:w-auto"
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
                      className="block w-full bg-slate-50 dark:bg-zinc-700/50 border border-slate-200 dark:border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Cari nama sasaran..."
                    />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
                      <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-700 dark:text-slate-200">
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
                          <tr key={s.id} className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-700/20 transition-colors">
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
                                  onClick={() => toggleAttendance(s.id, m)}
                                  className={`w-5 h-5 mx-auto rounded-md flex items-center justify-center transition-colors ${
                                    s.kunjungan.includes(m) 
                                      ? 'bg-emerald-500 text-white' 
                                      : 'bg-slate-100 dark:bg-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-600 text-transparent'
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
                                  onClick={() => {
                                    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                                      setDummySasaran(dummySasaran.filter(item => item.id !== s.id));
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
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  {role !== 'OPERATOR_DESA' && (
                    <button 
                      onClick={() => setSelectedDesaId('')}
                      className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
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
                  <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-700 dark:text-slate-200">
                    <tr>
                      <th className="px-6 py-4">Nama Posyandu</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posyandus.map((p) => (
                      <tr key={p.id} className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-700/20 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{p.nama}</td>
                        <td className="px-6 py-4"><span className="text-emerald-600 text-xs font-medium bg-emerald-50 px-2.5 py-1 rounded-full">Selesai</span></td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => setSelectedPosyanduId(p.id)} className="text-emerald-600 hover:text-emerald-700 font-medium text-xs">Buka Data</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : selectedKecamatanId ? (
            // Level 2: List Desa
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  {role !== 'ADMIN_KECAMATAN' && (
                    <button 
                      onClick={() => setSelectedKecamatanId('')}
                      className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
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
                  <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-700 dark:text-slate-200">
                    <tr>
                      <th className="px-6 py-4">Nama Desa</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {desas.map((desa) => (
                      <tr key={desa.id} className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-700/20 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{desa.nama}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => setSelectedDesaId(desa.id)} className="text-emerald-600 hover:text-emerald-700 font-medium text-xs">Detail</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            // Level 1: List Kecamatan
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Daftar Kecamatan</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
                  <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-700 dark:text-slate-200">
                    <tr>
                      <th className="px-6 py-4">Nama Kecamatan</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kecamatans.map((kec) => (
                      <tr key={kec.id} className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-700/20 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{kec.nama}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => setSelectedKecamatanId(kec.id)} className="text-emerald-600 hover:text-emerald-700 font-medium text-xs">Detail</button>
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
              className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 dark:border-zinc-800"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              
              <div className="p-6 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-500" />
                      Daftar Individu Hadir
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
                {(() => {
                  const monthStr = ['JAN','FEB','MAR','APR','MEI','JUN','JUL','AGU','SEP','OKT','NOV','DES'][selectedReportForDetail.bulan - 1];
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
                      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-700">
                        <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
                          <thead className="text-xs uppercase bg-slate-100 dark:bg-zinc-700/70 text-slate-700 dark:text-slate-200">
                            <tr>
                              <th className="px-4 py-2.5">No</th>
                              <th className="px-4 py-2.5">Nama</th>
                              <th className="px-4 py-2.5">Kategori</th>
                              <th className="px-4 py-2.5">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attendees.map((s, idx) => (
                              <tr key={s.id} className="border-b border-slate-100 dark:border-zinc-700/50 hover:bg-white dark:hover:bg-zinc-800 transition-colors">
                                <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-white">{idx + 1}</td>
                                <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-white">{(s as any).nama || (s as any).namaIbu}</td>
                                <td className="px-4 py-2.5">{(s as any).isOfficer ? (s as any).role : ((s as any).namaSuami ? 'Bumil' : 'Sasaran')}</td>
                                <td className="px-4 py-2.5">
                                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Hadir ✓</span>
                                </td>
                              </tr>
                            ))}
                            {attendees.length === 0 && (
                              <tr>
                                <td colSpan={4} className="text-center py-4 text-sm text-slate-500 bg-white dark:bg-zinc-800">
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
    </div>
  )
}
