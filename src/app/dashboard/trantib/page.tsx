'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, Plus, Search, Edit2, Trash2, Filter, 
  ChevronDown, X, Check, Clock, AlertTriangle,
  ArrowLeft, Download, FileText, Eye
} from 'lucide-react'
import { useSession } from 'next-auth/react'

const dummyReports = [
  { id: '1', tanggal: '2026-05-01', nik: '3217060105770092', nama: 'Budi Mulyono', alamat: 'RT 03 RW 25', hal: 'Laporan poskamling kurang aktif', status: 'BTL', keterangan: 'Lapor ke Polisi', posyandu: 'Posyandu Mawar 1', image: null, pdf: null },
  { id: '2', tanggal: '2026-05-03', nik: '3217060105770093', nama: 'Siti Aminah', alamat: 'RT 04 RW 25', hal: 'Anak muda nongkrong sampai larut malam', status: 'PROSES', keterangan: 'Linmas Desa', posyandu: 'Posyandu Melati', image: null, pdf: null },
]

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

export default function TrantibPage() {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role
  const userKecamatanNama = (session?.user as any)?.kecamatanNama
  const [selectedKecamatan, setSelectedKecamatan] = useState('')
  
  const currentKecName = role === 'SUPERADMIN' ? selectedKecamatan : (userKecamatanNama || 'Batanghari')
  const myKec = regionData.find(k => k.name === currentKecName)
  const desas = myKec ? myKec.desas : []
  
  const isPosyandu = role === 'OPERATOR_POSYANDU'
  const isKecamatan = role === 'ADMIN_KECAMATAN' || role === 'SUPERADMIN'

  const [selectedDesa, setSelectedDesa] = useState('')
  const [selectedPosyandu, setSelectedPosyandu] = useState('')
  const [posyandus, setPosyandus] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedReportForView, setSelectedReportForView] = useState<any>(null)
  const [reports, setReports] = useState<any[]>(dummyReports)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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
  }, [role, session])
  
  const initialForm = { tanggal: '', nik: '', nama: '', alamat: '', hal: '', keterangan: '', status: 'BTL', posyandu: '' }
  const [formData, setFormData] = useState(initialForm)
  const [editId, setEditId] = useState<string | null>(null)
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

  useEffect(() => setMounted(true), [])

  const handleEdit = (report: any) => {
    setFormData({
      tanggal: report.tanggal,
      nik: report.nik || '',
      nama: report.nama,
      alamat: report.alamat || '',
      hal: report.hal,
      keterangan: report.keterangan || '',
      status: report.status,
      posyandu: report.posyandu || ''
    })
    setEditId(report.id)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if(confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setReports(reports.filter(r => r.id !== id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editId) {
      setReports(reports.map(r => r.id === editId ? ({ ...formData, id: editId, image: imagePreview, pdf: pdfPreview } as any) : r))
    } else {
      setReports([{ ...formData, id: Date.now().toString(), image: imagePreview, pdf: pdfPreview } as any, ...reports])
    }
    setIsModalOpen(false)
    setFormData(initialForm)
    setEditId(null)
    setImagePreview(null)
    setPdfPreview(null)
  }

  const handleAdd = () => {
    setFormData(initialForm)
    setEditId(null)
    setIsModalOpen(true)
  }

  const filteredReports = reports.filter(r => 
    r.nama.toLowerCase().includes(search.toLowerCase()) ||
    r.hal.toLowerCase().includes(search.toLowerCase())
  )

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Data Hasil Kegiatan Trantib & Linmas</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">Sistem Informasi Posyandu (Trantib & Linmas)</p>
        </div>
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
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Laporan Trantib & Linmas</h1>
              <p className="text-slate-500 dark:text-zinc-400 text-sm">
                {isPosyandu ? 'Pengaduan & Aspirasi Bidang Keamanan' : `Pengaduan & Aspirasi Bidang Keamanan - ${selectedPosyandu}`}
              </p>
            </div>
            <div className="flex gap-2">
              {!isPosyandu && (
                <button
                  className="bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold py-2.5 px-4 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Export CSV
                </button>
              )}
              {(isPosyandu || role === 'SUPERADMIN') && (
                <button
                  onClick={handleAdd}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-2.5 px-4 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
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
                placeholder="Cari nama pelapor atau isi laporan..."
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-700/50 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all w-full md:w-auto justify-center">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-700/50 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all w-full md:w-auto justify-center">
                Status
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500 dark:text-zinc-400">
                <thead className="text-xs uppercase bg-slate-50 dark:bg-zinc-700/50 text-slate-700 dark:text-slate-200">
                  <tr>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Posyandu</th>
                    <th className="px-6 py-4">NIK</th>
                    <th className="px-6 py-4">Pelapor</th>
                    <th className="px-6 py-4">Alamat</th>
                    <th className="px-6 py-4">Hal Pengaduan</th>
                    <th className="px-6 py-4">Keterangan</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-700/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{report.tanggal}</td>
                      <td className="px-6 py-4">{report.posyandu || '-'}</td>
                      <td className="px-6 py-4">{report.nik}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {(report as any).image && (
                            <img src={(report as any).image} alt="Foto" className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-zinc-700 flex-shrink-0" />
                          )}
                          {(report as any).pdf && (
                            <div className="w-10 h-10 flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-700 flex-shrink-0">
                              <FileText className="w-5 h-5 text-rose-500" />
                            </div>
                          )}
                          <span>{report.nama}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{report.alamat}</td>
                      <td className="px-6 py-4">{report.hal}</td>
                      <td className="px-6 py-4">{report.keterangan}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.status === 'SUDAH' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          report.status === 'PROSES' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-slate-100 text-slate-800 dark:bg-zinc-700/50 dark:text-zinc-300'
                        }`}>
                          {report.status === 'SUDAH' ? 'Sudah' :
                           report.status === 'PROSES' ? 'Proses' : 'Belum'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => { setSelectedReportForView(report); setIsViewModalOpen(true); }} 
                            className="text-emerald-500 hover:text-emerald-600 transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {(isPosyandu || role === 'SUPERADMIN') && (
                            <>
                              <button onClick={() => handleEdit(report)} className="text-blue-500 hover:text-blue-600 transition-colors" title="Edit">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(report.id)} className="text-rose-500 hover:text-rose-600 transition-colors" title="Hapus">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
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
                  <tr key={kec.name} className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-700/20 transition-colors">
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
                  <th className="px-6 py-4">Status Laporan</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {posyandus.length > 0 ? posyandus.map(p => (
                  <tr key={p.id} className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{p.nama}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setSelectedPosyandu(p.nama)} className="text-emerald-600 hover:text-emerald-700 font-medium text-xs">Buka Laporan</button>
                    </td>
                  </tr>
                )) : (
                  <>
                    <tr className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-700/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">Posyandu Mawar 1</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setSelectedPosyandu('Posyandu Mawar 1')} className="text-emerald-600 hover:text-emerald-700 font-medium text-xs">Buka Laporan</button>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-700/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">Posyandu Melati</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setSelectedPosyandu('Posyandu Melati')} className="text-emerald-600 hover:text-emerald-700 font-medium text-xs">Buka Laporan</button>
                      </td>
                    </tr>
                  </>
                )}
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

      {/* Modal Tambah Laporan */}
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
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {editId ? 'Edit Laporan' : 'Tambah Laporan Baru'}
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
                    className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    required
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Posyandu</label>
                  <input
                    type="text"
                    value={isPosyandu ? "Posyandu Adirejo I" : formData.posyandu}
                    onChange={(e) => setFormData({...formData, posyandu: e.target.value})}
                    disabled={isPosyandu}
                    className={`block w-full ${isPosyandu ? 'bg-slate-100 dark:bg-zinc-800' : 'bg-slate-50 dark:bg-zinc-800'} border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all`}
                    placeholder="Nama Posyandu"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">NIK</label>
                  <input
                    type="text"
                    value={formData.nik}
                    onChange={(e) => setFormData({...formData, nik: e.target.value})}
                    className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    placeholder="NIK"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Pelapor</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({...formData, nama: e.target.value})}
                    className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    placeholder="Nama Pelapor"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Alamat</label>
                  <input
                    type="text"
                    value={formData.alamat}
                    onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                    className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    placeholder="Alamat"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Hal Pengaduan</label>
                  <textarea
                    value={formData.hal}
                    onChange={(e) => setFormData({...formData, hal: e.target.value})}
                    className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    rows={3}
                    placeholder="Isi pengaduan trantib..."
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Keterangan</label>
                  <input
                    type="text"
                    value={formData.keterangan}
                    onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                    className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    placeholder="Keterangan tambahan"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 block mb-1.5">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="block w-full bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  >
                    <option value="BELUM">Belum</option>
                    <option value="PROSES">Proses</option>
                    <option value="SUDAH">Sudah</option>
                  </select>
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

                <div className="md:col-span-2 flex items-center justify-end gap-3 mt-6 border-t border-slate-100 dark:border-zinc-800 pt-5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-2.5 px-6 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    {editId ? 'Simpan Perubahan' : 'Simpan Data'}
                  </button>
                </div>
              </form>
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
                      Detail Laporan Trantib & Linmas
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                      Informasi lengkap pengaduan ketenteraman dan ketertiban
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
                    <p className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-medium">Pelapor</p>
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
                        selectedReportForView.status === 'TL' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        selectedReportForView.status === 'PROSES' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'
                      }`}>
                        {selectedReportForView.status}
                      </span>
                    </div>
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
