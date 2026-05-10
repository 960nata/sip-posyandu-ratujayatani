'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Search, X, ArrowLeft, Download, Trash2, FileText, Eye } from 'lucide-react'
import { useSession } from 'next-auth/react'

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
const POSYANDUS = (desa: string) => [`Posyandu ${desa} I`, `Posyandu ${desa} II`, `Posyandu ${desa} III`]

interface Report {
  id: string
  no: number
  tanggal: string
  posyandu: string
  nik: string
  nama: string
  alamat: string
  hal: string
  keterangan: string
  status: 'BELUM' | 'PROSES' | 'SUDAH'
  desa: string
  feedback?: string
  image?: string
  pdf?: string
}

const SEED: Report[] = [
  { id:'1', no:1, tanggal:'2025-07-20', posyandu:'Posyandu Adirejo I', nik:'3217060812490003', nama:'SAFEI', alamat:'RT 08/25', hal:'PENGAJUAN KIS', keterangan:'Tolong dibantu pendaftarannya', status:'BELUM', desa:'Adirejo' },
]

function exportCSV(data: Report[], desa: string) {
  const header = ['No','Tanggal','Posyandu','NIK','Nama','Alamat','Hal Pengaduan','Keterangan','Status','Tanggapan']
  const rows = data.map(r => [r.no, r.tanggal, r.posyandu, r.nik, r.nama, r.alamat, r.hal, r.keterangan, r.status, r.feedback || ''])
  const csv = [
    'LAPORAN POSYANDU',
    'BIDANG SOSIAL',
    `DESA: ${desa}`,
    '',
    header.join(','),
    ...rows.map(r => r.map(v => `"${v}"`).join(','))
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `Laporan_Sosial_${desa}.csv`; a.click()
  URL.revokeObjectURL(url)
}

export default function SosialPage() {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role
  
  const userKecamatanNama = (session?.user as any)?.kecamatanNama
  const [selectedKecamatan, setSelectedKecamatan] = useState('')
  
  const currentKecName = role === 'SUPERADMIN' ? selectedKecamatan : (userKecamatanNama || 'Batanghari')
  const myKec = regionData.find(k => k.name === currentKecName)
  const desas = myKec ? myKec.desas : []
  
  const isOperator = role === 'OPERATOR_POSYANDU'
  const isKecamatan = role === 'ADMIN_KECAMATAN' || role === 'SUPERADMIN'

  const [selectedDesa, setSelectedDesa] = useState('')
  const [selectedPosyandu, setSelectedPosyandu] = useState('')
  const [reports, setReports] = useState<Report[]>(SEED)
  const [posyandus, setPosyandus] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedReportForView, setSelectedReportForView] = useState<any>(null)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [form, setForm] = useState({ tanggal:'', posyandu:'', nik:'', nama:'', alamat:'', hal:'', keterangan:'', status:'BELUM' as 'BELUM'|'PROSES'|'SUDAH' })
  const [feedbackForm, setFeedbackForm] = useState({ feedback: '', status: 'BELUM' as 'BELUM'|'PROSES'|'SUDAH' })
  const [mounted, setMounted] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [pdfPreview, setPdfPreview] = useState<string | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran foto maksimal 5MB cuy!');
      return;
    }

    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const avifData = canvas.toDataURL('image/avif', 0.8);
          if (avifData.startsWith('data:image/avif')) {
            setImagePreview(avifData);
          } else {
            const webpData = canvas.toDataURL('image/webp', 0.8);
            setImagePreview(webpData);
          }
        }
        setIsCompressing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file PDF maksimal 5MB cuy!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPdfPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    setMounted(true)
    if (isOperator) { setSelectedDesa('Adirejo'); setSelectedPosyandu('Posyandu Adirejo I') }
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
  }, [isOperator, role, session])

  if (!mounted) return null

  const filtered = reports.filter(r => {
    const matchDesa = !selectedDesa || r.desa === selectedDesa
    const matchPosyandu = !selectedPosyandu || r.posyandu.toLowerCase().includes(selectedPosyandu.split(' ')[1]?.toLowerCase() || '')
    const matchSearch = r.nama.toLowerCase().includes(search.toLowerCase()) || r.hal.toLowerCase().includes(search.toLowerCase())
    return matchDesa && matchPosyandu && matchSearch
  })

  const handleSubmit = () => {
    if (!form.tanggal || !form.nama || !form.hal) return
    
    if (selectedReport) {
      setReports(prev => prev.map(r => r.id === selectedReport.id ? { ...r, ...form, image: imagePreview || r.image, pdf: pdfPreview || r.pdf } : r))
    } else {
      const newReport: Report = { ...form, id: Date.now().toString(), no: reports.length + 1, desa: selectedDesa || 'Adirejo', posyandu: form.posyandu || selectedPosyandu, image: imagePreview, pdf: pdfPreview } as any
      setReports(prev => [newReport, ...prev])
    }
    
    setForm({ tanggal:'', posyandu:'', nik:'', nama:'', alamat:'', hal:'', keterangan:'', status:'BELUM' })
    setIsModalOpen(false)
    setSelectedReport(null)
    setImagePreview(null)
    setPdfPreview(null)
  }

  const handleFeedbackSubmit = () => {
    if (!selectedReport) return
    setReports(prev => prev.map(r => r.id === selectedReport.id ? { ...r, status: feedbackForm.status, feedback: feedbackForm.feedback } : r))
    setIsFeedbackModalOpen(false)
    setSelectedReport(null)
  }

  const openFeedback = (r: Report) => {
    setSelectedReport(r)
    setFeedbackForm({ feedback: r.feedback || '', status: r.status })
    setIsFeedbackModalOpen(true)
  }

  const handleDelete = (id: string) => setReports(prev => prev.filter(r => r.id !== id))

  const showTable = isOperator || (isKecamatan && selectedDesa && selectedPosyandu) || (role === 'OPERATOR_DESA' && selectedPosyandu)

  // Level 0: Daftar Kecamatan (Superadmin)
  if (role === 'SUPERADMIN' && !selectedKecamatan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Bidang Sosial</h1>
            <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">Pilih kecamatan untuk melihat data laporan sosial.</p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-600 dark:text-slate-300">
                <tr><th className="px-6 py-4">Nama Kecamatan</th><th className="px-6 py-4 text-right">Aksi</th></tr>
              </thead>
              <tbody>
                {regionData.map(kec => (
                  <tr key={kec.name} className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{kec.name}</td>
                    <td className="px-6 py-4 text-right"><button onClick={() => setSelectedKecamatan(kec.name)} className="text-emerald-600 hover:text-emerald-700 font-medium text-xs">Detail</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // Level 1: Daftar Desa (Kecamatan/Superadmin)
  if ((role === 'ADMIN_KECAMATAN' || (role === 'SUPERADMIN' && selectedKecamatan)) && !selectedDesa) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            {role === 'SUPERADMIN' && (
              <button onClick={() => setSelectedKecamatan('')} className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors mb-2" title="Kembali ke Daftar Kecamatan"><ArrowLeft className="w-5 h-5" /></button>
            )}
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Bidang Sosial - Kec. {currentKecName}</h1>
            <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">Pilih desa untuk melihat data laporan sosial.</p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-600 dark:text-slate-300">
                <tr><th className="px-6 py-4">Nama Desa</th><th className="px-6 py-4">Total Data</th><th className="px-6 py-4 text-right">Aksi</th></tr>
              </thead>
              <tbody>
                {desas.map(desa => (
                  <tr key={desa} className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{desa}</td>
                    <td className="px-6 py-4"><span className="text-xs font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-full">{reports.filter(r=>r.desa===desa).length} data</span></td>
                    <td className="px-6 py-4 text-right"><button onClick={() => setSelectedDesa(desa)} className="text-emerald-600 hover:text-emerald-700 font-medium text-xs">Detail</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // Level 2: Daftar Posyandu di Desa (Kecamatan)
  if ((isKecamatan || role === 'OPERATOR_DESA') && selectedDesa && !selectedPosyandu) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            {role !== 'OPERATOR_DESA' && (
              <button onClick={() => setSelectedDesa('')} className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors" title="Kembali ke Daftar Desa"><ArrowLeft className="w-5 h-5" /></button>
            )}
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mt-2">Daftar Posyandu - Desa {selectedDesa}</h1>
          </div>
          <button onClick={() => exportCSV(reports.filter(r=>r.desa===selectedDesa), selectedDesa)} className="bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold py-2.5 px-4 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Export CSV</button>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-600 dark:text-slate-300">
                <tr><th className="px-6 py-4">Posyandu</th><th className="px-6 py-4">Jumlah Data</th><th className="px-6 py-4 text-right">Aksi</th></tr>
              </thead>
              <tbody>
                {(posyandus.length > 0 ? posyandus.map(p => p.nama) : POSYANDUS(selectedDesa)).map(p => (
                  <tr key={p} className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{p}</td>
                    <td className="px-6 py-4"><span className="text-xs font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-full">{reports.filter(r=>r.desa===selectedDesa).length} data</span></td>
                    <td className="px-6 py-4 text-right"><button onClick={() => setSelectedPosyandu(p)} className="text-emerald-600 hover:text-emerald-700 font-medium text-xs">Detail</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // Level 3 / Operator view: Data list
  const headerTitle = isOperator ? 'Laporan Bidang Sosial' : `Laporan Sosial - ${selectedPosyandu}`
  const headerSub = isOperator ? 'Desa Adirejo • Input dan kelola data laporan sosial.' : `Desa ${selectedDesa}`

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {!isOperator && (
            <button onClick={() => setSelectedPosyandu('')} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 mb-2"><ArrowLeft className="w-4 h-4" /> Kembali</button>
          )}
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Laporan Sosial</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">
            {isOperator ? 'Pengaduan & Aspirasi Bidang Sosial' : `Pengaduan & Aspirasi Bidang Sosial - ${selectedPosyandu}`}
          </p>
        </div>
        <div className="flex gap-2">
          {!isOperator && (
            <button onClick={() => exportCSV(filtered, selectedDesa || 'Adirejo')} className="bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold py-2.5 px-4 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Export CSV</button>
          )}
          {(isOperator || role === 'SUPERADMIN') && (
            <button onClick={() => { setSelectedReport(null); setForm({ tanggal:'', posyandu:'', nik:'', nama:'', alamat:'', hal:'', keterangan:'', status:'BELUM' }); setImagePreview(null); setPdfPreview(null); setIsModalOpen(true); }} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-2.5 px-4 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"><Plus className="w-5 h-5" /> Tambah Data</button>
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
            placeholder="Cari nama pelapor atau isi laporan..."
          />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="px-4 py-4">No</th>
                <th className="px-4 py-4">Tanggal</th>
                <th className="px-4 py-4">Posyandu</th>
                <th className="px-4 py-4">NIK</th>
                <th className="px-4 py-4">Nama</th>
                <th className="px-4 py-4">Alamat</th>
                <th className="px-4 py-4">Hal Pengaduan</th>
                <th className="px-4 py-4">Keterangan</th>
                <th className="px-4 py-4 text-center">Status</th>
                <th className="px-4 py-4">Tanggapan</th>
                <th className="px-4 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={11} className="px-6 py-12 text-center text-slate-400">Belum ada data. Klik "Tambah Data" untuk mulai input.</td></tr>
              ) : filtered.map((r, i) => (
                <tr key={r.id} className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="px-4 py-3 text-slate-500">{i+1}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{r.tanggal}</td>
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-white whitespace-nowrap">{r.posyandu}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-300">{r.nik}</td>
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-white whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {(r as any).image && (
                        <img src={(r as any).image} alt="Foto" className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-zinc-700 flex-shrink-0" />
                      )}
                      {(r as any).pdf && (
                        <div className="w-10 h-10 flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-700 flex-shrink-0">
                          <FileText className="w-5 h-5 text-rose-500" />
                        </div>
                      )}
                      <span>{r.nama}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{r.alamat}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-[200px]">{r.hal}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-[150px]">{r.keterangan}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      r.status === 'SUDAH' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      r.status === 'PROSES' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-slate-100 text-slate-800 dark:bg-zinc-700/50 dark:text-zinc-300'
                    }`}>
                      {r.status === 'SUDAH' ? 'Sudah' :
                       r.status === 'PROSES' ? 'Proses' : 'Belum'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-[150px] truncate" title={r.feedback}>
                    {r.feedback || '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => { setSelectedReportForView(r); setIsViewModalOpen(true); }} 
                        className="text-emerald-500 hover:text-emerald-600 transition-colors bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md flex items-center justify-center"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {(isOperator || role === 'SUPERADMIN') && (
                        <button 
                          onClick={() => { setSelectedReport(r); setForm({ tanggal: r.tanggal, posyandu: r.posyandu, nik: r.nik, nama: r.nama, alamat: r.alamat, hal: r.hal, keterangan: r.keterangan, status: r.status }); setImagePreview(r.image || null); setPdfPreview(r.pdf || null); setIsModalOpen(true); }} 
                          className="text-amber-500 hover:text-amber-600 transition-colors bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-md flex items-center justify-center"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                        </button>
                      )}
                      {isKecamatan && (
                        <button onClick={() => openFeedback(r)} className="text-blue-500 hover:text-blue-600 transition-colors font-medium text-xs bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md">
                          Tanggapi
                        </button>
                      )}
                      {(isOperator || role === 'SUPERADMIN') && (
                        <button onClick={() => handleDelete(r.id)} className="text-rose-400 hover:text-rose-600 transition-colors bg-rose-50 dark:bg-rose-900/30 px-2 py-1 rounded-md">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
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
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              
              <div className="p-6 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedReport ? 'Edit Data Sosial' : 'Tambah Data Sosial'}</h2>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">Lengkapi data laporan di bawah ini</p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 dark:bg-zinc-800 text-slate-400 hover:text-slate-500 dark:hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="p-6 space-y-5 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Tanggal *</label>
                  <input type="date" value={form.tanggal} onChange={e=>setForm(f=>({...f,tanggal:e.target.value}))} className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" required />
                </div>
                
                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Posyandu</label>
                  <input 
                    type="text" 
                    value={isOperator ? selectedPosyandu : form.posyandu} 
                    onChange={e=>setForm(f=>({...f,posyandu:e.target.value}))} 
                    disabled={isOperator}
                    placeholder="Nama Posyandu" 
                    className={`block w-full ${isOperator ? 'bg-slate-100 dark:bg-zinc-800' : 'bg-slate-50 dark:bg-zinc-800'} border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all`} 
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">NIK</label>
                  <input type="text" value={form.nik} onChange={e=>setForm(f=>({...f,nik:e.target.value}))} placeholder="16 digit NIK" className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" />
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Nama *</label>
                  <input type="text" value={form.nama} onChange={e=>setForm(f=>({...f,nama:e.target.value}))} placeholder="Nama Lengkap" className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" required />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Alamat</label>
                  <input type="text" value={form.alamat} onChange={e=>setForm(f=>({...f,alamat:e.target.value}))} placeholder="RT/RW, Lingkungan" className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Hal Pengaduan *</label>
                  <textarea value={form.hal} onChange={e=>setForm(f=>({...f,hal:e.target.value}))} rows={3} placeholder="Isi laporan atau pengaduan..." className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" required />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Keterangan</label>
                  <input type="text" value={form.keterangan} onChange={e=>setForm(f=>({...f,keterangan:e.target.value}))} placeholder="Tindak lanjut / keterangan" className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" />
                </div>
                
                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Upload Foto (Maks 5MB)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  />
                  {isCompressing && (
                    <p className="text-xs text-emerald-600 mt-1">Memproses foto...</p>
                  )}
                  {imagePreview && (
                    <div className="mt-3 relative w-32 h-32">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl border border-slate-200 dark:border-zinc-700" />
                      <button 
                        type="button"
                        onClick={() => setImagePreview(null)} 
                        className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 hover:bg-rose-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Upload Dokumen PDF (Maks 5MB)</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfChange}
                    className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  />
                  {pdfPreview && (
                    <div className="mt-3 relative w-32 h-32">
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700">
                        <FileText className="w-8 h-8 text-rose-500" />
                        <span className="text-xs text-slate-600 dark:text-zinc-400 mt-1">File PDF</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setPdfPreview(null)} 
                        className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 hover:bg-rose-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 md:col-span-2 border-t border-slate-100 dark:border-zinc-800 pt-5">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all">Batal</button>
                  <button type="submit" className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20">Simpan Data</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isFeedbackModalOpen && selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFeedbackModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-zinc-800"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              
              <div className="p-6 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Beri Tanggapan / Solusi</h2>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">Tindak lanjuti laporan ini</p>
                  </div>
                  <button
                    onClick={() => setIsFeedbackModalOpen(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 dark:bg-zinc-800 text-slate-400 hover:text-slate-500 dark:hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="p-4 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-transparent">
                  <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1 uppercase tracking-wider">Isi Pengaduan</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-white">{selectedReport.hal}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Status Laporan</label>
                  <select value={feedbackForm.status} onChange={e=>setFeedbackForm(f=>({...f,status:e.target.value as any}))} className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all">
                    <option value="BELUM">Belum</option>
                    <option value="PROSES">Proses</option>
                    <option value="SUDAH">Sudah</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Feedback / Solusi</label>
                  <textarea value={feedbackForm.feedback} onChange={e=>setFeedbackForm(f=>({...f,feedback:e.target.value}))} rows={4} placeholder="Tuliskan solusi atau informasi tindak lanjut untuk Posyandu..." className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" />
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 border-t border-slate-100 dark:border-zinc-800 pt-5">
                  <button onClick={() => setIsFeedbackModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all">Batal</button>
                  <button onClick={handleFeedbackSubmit} className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20">Kirim Tanggapan</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isViewModalOpen && selectedReportForView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsViewModalOpen(false)}
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
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Detail Laporan Sosial
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                      Informasi lengkap pengaduan sosial
                    </p>
                  </div>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 dark:bg-zinc-800 text-slate-400 hover:text-slate-500 dark:hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-medium">Tanggal</p>
                    <p className="text-sm text-slate-800 dark:text-white font-medium mt-0.5">{selectedReportForView.tanggal}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-medium">Posyandu</p>
                    <p className="text-sm text-slate-800 dark:text-white font-medium mt-0.5">{selectedReportForView.posyandu || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-medium">Pemohon</p>
                    <p className="text-sm text-slate-800 dark:text-white font-medium mt-0.5">{selectedReportForView.nama}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{selectedReportForView.nik}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-medium">Alamat</p>
                    <p className="text-sm text-slate-800 dark:text-white font-medium mt-0.5">{selectedReportForView.alamat}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-medium">Hal Pengaduan</p>
                    <p className="text-sm text-slate-800 dark:text-white mt-0.5 bg-slate-50 dark:bg-zinc-800 p-3 rounded-lg border border-slate-100 dark:border-zinc-700">{selectedReportForView.hal}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-medium">Keterangan</p>
                    <p className="text-sm text-slate-800 dark:text-white mt-0.5 bg-slate-50 dark:bg-zinc-800 p-3 rounded-lg border border-slate-100 dark:border-zinc-700">{selectedReportForView.keterangan || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-medium">Status</p>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-0.5 ${
                        selectedReportForView.status === 'SUDAH' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        selectedReportForView.status === 'PROSES' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-slate-100 text-slate-800 dark:bg-zinc-700/50 dark:text-zinc-300'
                      }`}>
                        {selectedReportForView.status === 'SUDAH' ? 'Sudah' :
                         selectedReportForView.status === 'PROSES' ? 'Proses' : 'Belum'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-medium">Tanggapan</p>
                    <p className="text-sm text-slate-800 dark:text-white mt-0.5 bg-slate-50 dark:bg-zinc-800 p-3 rounded-lg border border-slate-100 dark:border-zinc-700">{selectedReportForView.feedback || '-'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 dark:border-zinc-800 pt-5">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-medium mb-2">Foto Lampiran</p>
                    {selectedReportForView.image ? (
                      <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700">
                        <img src={selectedReportForView.image} alt="Lampiran" className="w-full h-40 object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a href={selectedReportForView.image} target="_blank" rel="noopener noreferrer" className="text-white text-sm font-medium hover:underline">Lihat Penuh</a>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-40 flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-800 rounded-xl border border-dashed border-slate-200 dark:border-zinc-700">
                        <p className="text-sm text-slate-400">Tidak ada foto</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-medium mb-2">Dokumen PDF</p>
                    {selectedReportForView.pdf ? (
                      <div className="w-full h-40 flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 p-4">
                        <FileText className="w-10 h-10 text-rose-500 mb-2" />
                        <p className="text-xs text-slate-600 dark:text-zinc-400 mb-3 truncate max-w-full">Dokumen Lampiran.pdf</p>
                        <div className="flex gap-2 w-full">
                          <a 
                            href={selectedReportForView.pdf} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 text-center bg-white dark:bg-zinc-700 text-slate-700 dark:text-white border border-slate-200 dark:border-zinc-600 rounded-lg py-1.5 text-xs font-medium hover:bg-slate-50 dark:hover:bg-zinc-600 transition-colors"
                          >
                            Buka
                          </a>
                          <a 
                            href={selectedReportForView.pdf} 
                            download
                            className="flex-1 text-center bg-emerald-500 text-white rounded-lg py-1.5 text-xs font-medium hover:bg-emerald-600 transition-colors"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-40 flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-800 rounded-xl border border-dashed border-slate-200 dark:border-zinc-700">
                        <p className="text-sm text-slate-400">Tidak ada PDF</p>
                      </div>
                    )}
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
