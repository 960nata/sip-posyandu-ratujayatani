"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Heart, Activity, Users, ClipboardList,
  ArrowRight, Sparkles, Building, BookOpen,
  Shield, ChevronRight, Baby, Syringe,
  Globe, Scale, Target, CheckCircle, Calendar,
  BarChart2, Zap, ShieldCheck, DollarSign
} from "lucide-react";

export default function TujuanPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-white text-slate-800 font-sans antialiased">
      {/* Header/Navbar */}
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="absolute inset-0 bg-black/10 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-widest mb-4">
              Mengapa SIP Dibangun
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Tujuan Sistem Informasi Posyandu</h1>
            <p className="text-base md:text-lg text-emerald-50 font-light max-w-3xl leading-relaxed">
              Mewujudkan tata kelola data yang terintegrasi untuk mendukung pengambilan keputusan yang cepat dan tepat di Kabupaten Lampung Timur.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section: Latar Belakang */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 mb-2 block">
              Latar Belakang
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Urgensi Posyandu bagi Indonesia</h2>
            <p className="text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
              Posyandu hadir sebagai agen masyarakat dalam mendukung peningkatan Indeks Pembangunan Manusia (IPM) Indonesia.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left: IPM Card (Large, Premium) */}
            <motion.div
              className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-8 rounded-2xl flex flex-col justify-between shadow-lg shadow-emerald-900/10"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-emerald-100 mb-2 block">
                  Indeks Pembangunan Manusia
                </span>
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="text-5xl font-bold">0,705</h3>
                  <span className="text-emerald-200 text-sm">IPM Indonesia</span>
                </div>
                <p className="text-emerald-50 text-sm font-light mb-6">Peringkat 114 dari 199 Negara</p>
                
                <p className="text-sm text-emerald-50 font-light leading-relaxed mb-6">
                  Indonesia masih tertinggal dibandingkan Singapura (0,939) dan Jepang (0,925). Nilai IPM dipengaruhi tiga faktor: kesehatan, pendidikan, dan ekonomi. Peningkatan IPM krusial untuk mendukung bonus demografi menuju Indonesia Emas 2045.
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                <div>
                  <p className="text-xs text-emerald-200 mb-1">Indonesia</p>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full" style={{ width: "70.5%" }}></div>
                  </div>
                  <p className="text-sm font-bold mt-1">0.705</p>
                </div>
                <div>
                  <p className="text-xs text-emerald-200 mb-1">Singapura</p>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-white h-full" style={{ width: "93.9%" }}></div>
                  </div>
                  <p className="text-sm font-bold mt-1">0.939</p>
                </div>
                <div>
                  <p className="text-xs text-emerald-200 mb-1">Jepang</p>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-white h-full" style={{ width: "92.5%" }}></div>
                  </div>
                  <p className="text-sm font-bold mt-1">0.925</p>
                </div>
              </div>
            </motion.div>

            {/* Right: 3 Dimensions Cards stacked */}
            <div className="space-y-6 flex flex-col justify-between">
              {[
                { icon: Heart, color: "text-rose-500 bg-rose-50", title: "Dimensi Kesehatan", desc: "Angka harapan hidup masyarakat Indonesia perlu ditingkatkan melalui pelayanan kesehatan preventif dan promotif di tingkat desa." },
                { icon: BookOpen, color: "text-blue-500 bg-blue-50", title: "Dimensi Pendidikan", desc: "Angka partisipasi sekolah dan literasi perlu didorong melalui PAUD, perpustakaan desa, dan literasi digital." },
                { icon: BarChart2, color: "text-amber-500 bg-amber-50", title: "Dimensi Ekonomi", desc: "Pendapatan per kapita masyarakat desa perlu dinaikkan melalui bantuan sosial tepat sasaran dan pemberdayaan ekonomi." },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex gap-6 items-center"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
                >
                  <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-500 font-light leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section: Tujuan Sistem */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 mb-2 block">
              Tujuan Sistem
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Tiga Tujuan Utama SIP</h2>
            <p className="text-slate-500 font-light max-w-2xl mx-auto">
              SIP dirancang untuk menyelesaikan masalah fragmentasi data dan lambatnya respon pelayanan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Globe, title: "1. Integrasi Data", desc: "Menghubungkan data dari berbagai sektor — Kesehatan, Pendidikan, dan Infrastruktur — untuk memberikan visualisasi yang menyeluruh bagi pemerintah daerah. Tidak ada lagi fragmentasi data antar dinas.", tags: ["Data dari 264 desa terhubung", "Laporan real-time ke kabupaten", "Dashboard terpadu lintas sektor"], image: "/images/tujuan/PHOTO-2026-05-11-21-46-03 2.jpg" },
              { icon: Zap, title: "2. Efisiensi Pelayanan", desc: "Mempercepat proses pelaporan dari tingkat desa ke kabupaten, memungkinkan tindak lanjut yang lebih cepat terhadap masalah di lapangan dengan batas waktu pelayanan 5 hari kerja.", tags: ["Batas 5 hari kerja per SOP", "Alur permohonan digital", "Notifikasi otomatis ke OPD"], image: "/images/tujuan/PHOTO-2026-05-11-21-46-03 3.jpg" },
              { icon: ShieldCheck, title: "3. Transparansi", desc: "Menyediakan data yang akurat, valid, dan dapat dipertanggungjawabkan untuk memastikan bantuan dan program tepat sasaran kepada masyarakat yang membutuhkan.", tags: ["Audit trail setiap data", "Validasi berjenjang", "Laporan publik tahunan"], image: "/images/tujuan/PHOTO-2026-05-11-21-46-03 4.jpg" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
              >
                <div className="relative w-full h-48 bg-slate-100">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4 text-xl">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-500 font-light leading-relaxed mb-4">{item.desc}</p>
                  </div>
                  <div className="space-y-2">
                    {item.tags.map((tag, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Visi & Misi */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 mb-2 block">
                Visi & Misi
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">SIP: Lampung Timur Berbasis Data</h2>
              <p className="text-slate-500 font-light leading-relaxed mb-6">
                SIP dibangun dengan visi menjadikan Lampung Timur sebagai kabupaten yang data-driven dalam setiap kebijakan publik.
              </p>
              
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <p className="text-slate-700 font-medium leading-relaxed">
                  "Terwujudnya Kabupaten Lampung Timur yang maju dan sejahtera melalui pengelolaan data Posyandu yang terintegrasi, akurat, dan transparan sebagai dasar pengambilan kebijakan publik."
                </p>
              </div>
            </motion.div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Misi Kami</h3>
              {[
                "Meningkatkan akurasi data kemiskinan dan kesehatan melalui pendataan berbasis kader yang terlatih dan terstandar",
                "Memudahkan monitoring program pembangunan fisik dan non-fisik di seluruh 264 desa Kabupaten Lampung Timur",
                "Mendorong partisipasi aktif kader desa dalam pelaporan data secara digital dan berkelanjutan",
                "Memperkuat koordinasi lintas sektor antara Dinas Kesehatan, Dinas Pendidikan, Dinas PU, dan dinas terkait lainnya",
                "Memastikan distribusi bantuan sosial dan program pemerintah tepat sasaran berdasarkan data yang valid"
              ].map((misi, idx) => (
                <motion.div
                  key={idx}
                  className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg hover:bg-emerald-50/50 transition-colors"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex-shrink-0 w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-sm text-slate-600 font-light">{misi}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section: Rencana Strategis */}
      <section className="py-20 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 mb-2 block">
              Rencana Strategis 2024–2029
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Roadmap Jangka Menengah</h2>
            <p className="text-slate-500 font-light max-w-2xl mx-auto">
              Ditetapkan dalam Rakornas Posyandu 2024, Rencana Strategis menjadi panduan 5 tahun ke depan.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative max-w-4xl mx-auto">
            {[
              { year: "2024", title: "Fondasi Digital", desc: "Launching SIP, onboarding kader, dan sosialisasi 6 Bidang SPM di seluruh desa" },
              { year: "2025", title: "Penguatan Kapasitas", desc: "Pelatihan masif kader, pemutakhiran data, and integrasi dengan sistem dinas terkait" },
              { year: "2026", title: "Optimasi Sistem", desc: "Evaluasi SOP, perbaikan alur laporan, penambahan fitur analitik dan visualisasi data" },
              { year: "2027–28", title: "Perluasan Layanan", desc: "Integrasi layanan digital untuk masyarakat, mobile app kader, dan open data publik" },
              { year: "2029", title: "Lampung Timur Data-Driven", desc: "100% desa terdaftar, semua keputusan kebijakan berbasis data posyandu yang valid" },
            ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className={`relative flex flex-col md:flex-row items-center mb-12 last:mb-0 ${idx % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Line Segment */}
                  {idx < 4 && (
                    <div className="absolute left-1/2 top-1/2 w-0.5 bg-emerald-100 -translate-x-1/2 hidden md:block z-0" style={{ height: "calc(100% + 3rem)" }} />
                  )}

                  {/* Dot */}
                  <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-emerald-500 rounded-full -translate-x-1/2 -translate-y-1/2 hidden md:block border-4 border-white shadow-sm z-10" />
                  
                  {/* Year Label */}
                  <div className={`w-full md:w-1/2 text-center ${idx % 2 === 0 ? "md:text-left md:pl-12" : "md:text-right md:pr-12"} mb-2 md:mb-0`}>
                    <span className="text-xl font-bold text-emerald-600">{item.year}</span>
                  </div>
                  
                  {/* Card */}
                  <div className={`w-full md:w-1/2 ${idx % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
                      <p className="text-xs text-slate-500 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Pasal 4 Permendagri */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 mb-2 block">
              Pasal 4 Permendagri 13/2024
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">6 Fungsi Posyandu</h2>
            <p className="text-slate-500 font-light max-w-2xl mx-auto">
              Dalam melaksanakan tugas 6 Bidang SPM, Posyandu berfungsi untuk mendukung hal-hal berikut.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Penyampaian dan penyaluran aspirasi masyarakat kepada pemerintah desa dan jenjang di atasnya secara terstruktur",
              "Peningkatan kualitas dan percepatan pelayanan Pemerintah Desa/Kelurahan kepada masyarakat",
              "Penyusunan rencana, pelaksanaan, pengendalian dan pengembangan hasil pembangunan secara partisipatif",
              "Menumbuhkan, mengembangkan, dan menggerakkan prakarsa, partisipasi, swadaya, serta gotong royong masyarakat",
              "Peningkatan kesejahteraan keluarga melalui program-program pemberdayaan dan pemenuhan standar layanan minimal",
              "Peningkatan kualitas sumber daya manusia desa sebagai investasi jangka panjang menuju Indonesia Emas 2045"
            ].map((text, idx) => (
                <motion.div
                  key={idx}
                  className="p-5 bg-slate-50 rounded-xl border border-slate-100 flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, borderColor: "rgba(16, 185, 129, 0.2)" }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-slate-600 font-light leading-relaxed">{text}</p>
                </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
