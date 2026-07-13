"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Heart, ArrowLeft, ArrowRight, Baby, Syringe,
  ClipboardList, Activity, Star, ChevronRight,
  BookOpen, Building, Home, Shield, Users,
  Clock, FileText, Target, Globe, Zap, ShieldCheck
} from "lucide-react";

export default function LayananPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const pathname = usePathname();
  const { data: session } = useSession();

  const services = [
    {
      icon: Baby,
      title: "Kesehatan Anak & Balita",
      desc: "Pelayanan pemantauan pertumbuhan dan perkembangan anak secara berkala untuk mencegah stunting dan masalah gizi lainnya.",
      details: [
        "Penimbangan berat badan dan pengukuran tinggi badan.",
        "Deteksi dini tumbuh kembang anak.",
        "Pemberian Vitamin A dan obat cacing.",
        "Konseling gizi bagi ibu dan balita."
      ],
      color: "text-rose-500 bg-rose-50",
      borderColor: "border-rose-100"
    },
    {
      icon: Heart,
      title: "Kesehatan Ibu Hamil & Menyusui",
      desc: "Pendampingan dan pemeriksaan kesehatan bagi ibu hamil dan menyusui untuk memastikan kesehatan ibu dan janin.",
      details: [
        "Pemeriksaan kehamilan (ANC) berkala.",
        "Pemeriksaan kesehatan umum.",
        "Konseling gizi dan kesehatan.",
        "Pemberian tablet tambah darah."
      ],
      color: "text-pink-500 bg-pink-50",
      borderColor: "border-pink-100"
    },
    {
      icon: Syringe,
      title: "Program Imunisasi",
      desc: "Pemberian imunisasi dasar lengkap untuk bayi dan anak balita guna memberikan kekebalan terhadap penyakit berbahaya.",
      details: [
        "Imunisasi BCG, Polio, DPT-HB-Hib.",
        "Imunisasi Campak/MR.",
        "Edukasi KIPI.",
        "Pencatatan buku KIA."
      ],
      color: "text-blue-500 bg-blue-50",
      borderColor: "border-blue-100"
    },
    {
      icon: ClipboardList,
      title: "Keluarga Berencana (KB)",
      desc: "Pelayanan konseling dan penyediaan sarana kontrasepsi untuk mengatur jarak kehamilan dan kesejahteraan keluarga.",
      details: [
        "Konseling metode kontrasepsi.",
        "Pelayanan pil KB dan kondom.",
        "Rujukan untuk metode jangka panjang.",
        "Penyuluhan kesehatan reproduksi."
      ],
      color: "text-amber-500 bg-amber-50",
      borderColor: "border-amber-100"
    }
  ];

  const sops = [
    {
      title: "Pendidikan",
      icon: BookOpen,
      color: "text-blue-600 bg-blue-50",
      steps: [
        "Warga datang ke Posyandu menuju meja Pelayanan SPM Pendidikan dan menyampaikan kebutuhan (PAUD, pendidikan dasar, penyetaraan, dll)",
        "Kader Posyandu mendata pemohon terkait keluhan, memeriksa kelengkapan dokumen: KTP, Kartu Keluarga (KK), dan Surat Pernyataan tidak mampu dari RT setempat",
        "Kader menyampaikan data pemohon dan bersama Pemerintah Desa melakukan verifikasi data dan kunjungan rumah",
        "Jika hasil verifikasi memenuhi syarat, Kader mengajukan data permohonan kepada Pemerintah Desa",
        "Pemerintah Desa menindaklanjuti permohonan yang memenuhi syarat — pembiayaan PAUD, Pendidikan Dasar, atau Penyetaraan — kepada OPD terkait",
        "OPD menindaklanjuti permohonan dari Pemerintah Desa"
      ],
      time: "5 hari kerja",
      docs: [
        "Foto copy Kartu Tanda Penduduk (KTP)",
        "Foto copy Kartu Keluarga (KK)",
        "Surat Pernyataan tidak mampu dari RT setempat"
      ],
      coverage: [
        "Pendidikan anak usia dini (PAUD)",
        "Identifikasi perpustakaan desa",
        "Penguatan literasi digital",
        "Identifikasi alat peraga edukasi"
      ]
    },
    {
      title: "Kesehatan",
      icon: Heart,
      color: "text-rose-600 bg-rose-50",
      steps: [
        "Layanan kesehatan dilakukan kepada seluruh sasaran: ibu hamil, melahirkan, ibu menyusui, bayi baru lahir, balita, anak usia pra sekolah, remaja, dewasa, dan lansia",
        "Layanan melalui 5 meja/langkah: Meja 1 Pendaftaran → Meja 2 Penimbangan/Pengukuran → Meja 3 Pencatatan → Meja 4 Pelayanan Kesehatan → Meja 5 Penyuluhan",
        "Kader merekap pendataan layanan dari warga dan menyusun rencana tindak lanjut",
        "Kader melakukan kunjungan rumah untuk memantau kondisi kesehatan sasaran yang tidak hadir",
        "Kader merekapitulasi hasil pemantauan dan menyampaikan kepada Pemerintah Desa dan Puskesmas Pembantu",
        "Pustu dan Pemerintah Desa melakukan koordinasi terkait hasil laporan untuk ditindaklanjuti"
      ],
      time: "5 hari kerja",
      docs: [
        "Buku KIA / KMS",
        "KTP / KK (untuk pendaftaran baru)"
      ],
      coverage: [
        "Layanan 5 Meja Posyandu",
        "Imunisasi dasar lengkap",
        "Pemberian Vitamin A & Tablet Fe",
        "Kunjungan rumah terstruktur"
      ]
    },
    {
      title: "Pekerjaan Umum",
      icon: Building,
      color: "text-amber-600 bg-amber-50",
      steps: [
        "Warga datang ke Posyandu menuju meja Pelayanan SPM Pekerjaan Umum untuk menyampaikan keluhan tentang sanitasi, MCK, dan sarana air bersih",
        "Kader mendata pemohon — dokumen: Surat permohonan kepala dusun/RT dan lokasi titik pembangunan sarana dan prasarana",
        "Kader menyampaikan data dan bersama Pemerintah Desa melakukan verifikasi data dan kunjungan lapangan",
        "Jika memenuhi persyaratan untuk renovasi/perbaikan, Kader mengajukan data permohonan kepada Pemerintah Desa",
        "Pemerintah Desa menindaklanjuti permohonan yang memenuhi syarat ke OPD terkait",
        "OPD menindaklanjuti permohonan dari Pemerintah Desa"
      ],
      time: "5 hari kerja",
      docs: [
        "Surat permohonan kepala dusun/RT",
        "Lokasi titik pembangunan"
      ],
      coverage: [
        "Air bersih & pengelolaan limbah",
        "Identifikasi embung air baku",
        "Pemeliharaan jaringan air desa",
        "Rehabilitasi sumur air tanah",
        "Kebutuhan pembangunan jalan desa"
      ]
    },
    {
      title: "Perumahan Rakyat",
      icon: Home,
      color: "text-purple-600 bg-purple-50",
      steps: [
        "Warga datang ke Posyandu menuju meja Pelayanan SPM Perumahan Rakyat untuk mengajukan identifikasi atau rehabilitasi rumah",
        "Kader mendata pemohon — dokumen: KTP, KK, Surat Pernyataan belum pernah menerima Bantuan, Surat keterangan penghasilan, Foto copy surat tanah, Foto kondisi rumah (3 sisi)",
        "Kader dan Pemerintah Desa melakukan verifikasi data dan kunjungan lapangan",
        "Jika memenuhi persyaratan, Kader mengajukan data permohonan renovasi/perbaikan kepada Pemerintah Desa",
        "Pemerintah Desa menindaklanjuti permohonan ke OPD terkait"
      ],
      time: "5 hari kerja",
      docs: [
        "Foto copy KTP & KK",
        "Surat Pernyataan belum dapat bantuan",
        "Surat keterangan penghasilan",
        "Foto copy surat tanah",
        "Foto kondisi rumah (3 sisi)"
      ],
      coverage: [
        "Identifikasi rumah tidak layak huni",
        "Rehabilitasi rumah layak huni",
        "Edukasi lingkungan bersih & sehat",
        "Budidaya tanaman pangan lokal"
      ]
    },
    {
      title: "Trantibum Linmas",
      icon: Shield,
      color: "text-slate-600 bg-slate-50",
      steps: [
        "Masyarakat dapat melakukan pengaduan langsung ke Pos Pelayanan Terpadu di Kantor Desa",
        "Informasi pengaduan dicatat: Nama, Alamat, Nomor Kontak, Data Identitas (KTP). Kerahasiaan dijamin",
        "Pengaduan diidentifikasi dan dikaji oleh Bidang TrantibumLinmas, kemudian ditindaklanjuti oleh Kepala Desa",
        "Laporan pemeriksaan disampaikan kepada Kepala Desa — jika dapat diselesaikan di lingkup desa, urusan selesai",
        "Jika perlu penanganan khusus, diteruskan ke OPD terkait atau Kepolisian untuk ditindaklanjuti"
      ],
      time: "5 hari kerja",
      docs: [
        "Identitas diri (KTP)",
        "Kontak yang dapat dihubungi"
      ],
      coverage: [
        "Penyuluhan pascabencana & trauma",
        "Edukasi kesiapsiagaan bencana",
        "Deteksi dini gangguan trantibum",
        "Pembinaan patroli pengamanan",
        "Pemberdayaan Linmas"
      ]
    },
    {
      title: "Sosial",
      icon: Users,
      color: "text-purple-600 bg-purple-50",
      steps: [
        "Warga datang ke Posyandu dan menyampaikan keluhan layanan sosial: disabilitas, anak terlantar, lanjut usia, tuna sosial, dll",
        "Kader mendata pemohon: Foto copy identitas, Penjelasan keluhan, Surat pernyataan dari Pemerintah Desa",
        "Kader merekap pendataan layanan dan menyusun rencana tindak lanjut",
        "Kunjungan rumah oleh kader didampingi Pemerintah Desa dan petugas terkait",
        "Pemerintah Desa menindaklanjuti permohonan kepada Kecamatan untuk ditindaklanjuti kepada OPD Sosial terkait"
      ],
      time: "5 hari kerja",
      docs: [
        "Foto copy identitas diri sasaran",
        "Penjelasan gambaran keluhan",
        "Surat pernyataan dari Pemdes"
      ],
      coverage: [
        "Disabilitas & inklusi sosial",
      "Lansia terlantar",
        "Tuna sosial & gelandangan",
        "Bantuan sosial fakir miskin",
        "Kesetaraan gender & edukasi"
      ]
    }
  ];

  return (
    <div className="relative min-h-screen bg-white text-slate-800 antialiased">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[400px] flex items-center pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-slate-900 text-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/hero/hero3.avif"
            alt="Hero Background"
            fill
            className="object-cover opacity-40 scale-105"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-950/80 via-indigo-950/70 to-slate-950 z-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-widest mb-6">
              Panduan Layanan
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 text-white leading-tight">
              Layanan Komprehensif Posyandu
            </h1>
            <p className="text-base md:text-lg text-slate-200 max-w-3xl mx-auto font-normal leading-relaxed">
              Kami menghadirkan berbagai program kesehatan terpadu untuk mendukung tumbuh kembang anak dan kesehatan keluarga di Lampung Timur.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6"
              >
                <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <service.icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-slate-500 mb-4 font-light">{service.desc}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {service.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-5 h-5 mt-0.5 text-purple-500 flex-shrink-0">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                        <span className="text-xs text-slate-600">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* SOP Section with Tabs */}
          <div className="mt-24">
            <div className="text-center mb-12">
              <span className="text-xs font-bold tracking-widest uppercase text-purple-600 mb-2 block">
                Permendagri 13/2024
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">SOP 6 Bidang Pelayanan Posyandu</h2>
              <p className="text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
                Standar Operasional Prosedur untuk setiap bidang layanan. Semua pengaduan dan permohonan diproses maksimal 5 hari kerja.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {sops.map((sop, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-sm font-medium transition-all ${
                    activeTab === idx
                      ? "bg-purple-600 text-white shadow-md shadow-purple-900/10"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <sop.icon className="w-4 h-4" />
                  {sop.title}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Steps */}
                <div className="lg:col-span-7">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-purple-500" />
                    Langkah-langkah Prosedur
                  </h3>
                  <div className="space-y-4">
                    {sops[activeTab].steps.map((step, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-slate-600 font-light leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Info, Docs, Coverage */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Time limit */}
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-xs text-purple-600 font-bold uppercase">Batas Waktu</p>
                      <p className="text-sm text-purple-700 font-medium">{sops[activeTab].time}</p>
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-500" />
                      Dokumen yang Diperlukan
                    </h3>
                    <ul className="space-y-2">
                      {sops[activeTab].docs.map((doc, idx) => (
                        <li key={idx} className="text-xs text-slate-500 font-light flex items-center gap-2">
                          <div className="w-1 h-1 bg-purple-500 rounded-full flex-shrink-0"></div>
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Coverage */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-500" />
                      Cakupan Layanan
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {sops[activeTab].coverage.map((item, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-md text-xs font-light">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
