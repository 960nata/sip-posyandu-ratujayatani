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
  Heart, Users, ClipboardList, ArrowRight, 
  Building, BookOpen, Shield, ChevronRight, 
  CheckCircle, Zap, ShieldCheck, Medal, 
  Trophy, Lightbulb, FileText, Crown, 
  Briefcase, UserCheck, Star, Scale,
  Home, Landmark, MapPin
} from "lucide-react";

export default function KelembagaanPage() {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-white text-slate-800 antialiased">
      {/* Header/Navbar */}
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[400px] flex items-center pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-slate-900 text-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/hero/hero5.avif"
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
              Kelembagaan SIPANDU
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 text-white leading-tight">
              Tentang Sistem Informasi Posyandu
            </h1>
            <p className="text-base md:text-lg text-slate-200 max-w-3xl mx-auto font-normal leading-relaxed">
              Ekosistem tata kelola data yang melibatkan berbagai tingkatan kelembagaan — dari pimpinan daerah hingga kader di tingkat desa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section: Struktur Kelembagaan */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-bold tracking-widest uppercase text-purple-600 mb-2 block">
              Struktur Kelembagaan
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Tata Kelola Posyandu</h2>
            <p className="text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
              Posyandu terdiri dari 3 komponen utama yang bekerja dalam satu rantai data yang valid dan terstruktur.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Tim Pembina */}
            <motion.div
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                <Crown className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Tim Pembina</h3>
              <p className="text-sm text-slate-500 font-light leading-relaxed">
                Mitra kerja pemerintah yang berfungsi sebagai fasilitator, perencana, dan pembina di masing-masing jenjang. Ada 5 tingkatan dari Pusat hingga Desa/Kelurahan.
              </p>
            </motion.div>

            {/* Pengurus Posyandu */}
            <motion.div
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Pengurus Posyandu</h3>
              <p className="text-sm text-slate-500 font-light leading-relaxed">
                Seseorang yang memiliki kemampuan, pengetahuan, dan inovasi dalam pembangunan desa. Ditetapkan oleh Keputusan Kepala Desa/Lurah.
              </p>
            </motion.div>

            {/* Kader Posyandu */}
            <motion.div
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                <UserCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Kader Posyandu</h3>
              <p className="text-sm text-slate-500 font-light leading-relaxed">
                Anggota masyarakat yang bersedia, mampu, dan memiliki waktu untuk membantu pemberdayaan masyarakat. Ujung tombak pengumpulan data langsung dari lapangan.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section: Susunan Kepengurusan */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-bold tracking-widest uppercase text-purple-600 mb-2 block">
              Bab III Juknis Posyandu
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Susunan Kepengurusan Posyandu</h2>
            <p className="text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
              Kepengurusan ditetapkan dengan Keputusan Kepala Desa (untuk yang berkedudukan di Desa) atau Keputusan Lurah (untuk Kelurahan).
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-purple-600 text-white">
                    <th className="py-4 px-6 text-sm font-semibold">Jabatan</th>
                    <th className="py-4 px-6 text-sm font-semibold">Kedudukan</th>
                    <th className="py-4 px-6 text-sm font-semibold">Tugas Utama</th>
                    <th className="py-4 px-6 text-sm font-semibold">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { jabatan: "Ketua", kedudukan: "Desa/Kelurahan", tugas: "Menyusun perencanaan program, memimpin koordinasi, menyiapkan laporan ke Kepala Desa", catatan: "Dipilih dari masyarakat" },
                    { jabatan: "Sekretaris", kedudukan: "Desa/Kelurahan", tugas: "Mengelola administrasi surat-menyurat, pengarsipan, dan dokumentasi kegiatan", catatan: "Bisa membaca & menulis Latin" },
                    { jabatan: "Bendahara", kedudukan: "Desa/Kelurahan", tugas: "Mengelola keuangan Posyandu secara transparan dan akuntabel sesuai APBDesa", catatan: "Laporan keuangan berkala" },
                    { jabatan: "Ketua Bidang", kedudukan: "Desa/Kelurahan", tugas: "Mengkoordinir kader sesuai 6 bidang SPM: Pendidikan, Kesehatan, PU, Perumahan, Trantibum, Sosial", catatan: "Sesuai kebutuhan" },
                    { jabatan: "Kader", kedudukan: "Desa/Kelurahan", tugas: "Melaksanakan pelayanan langsung, pendataan, dan pelaporan ke pengurus", catatan: "Hanya 1 bidang layanan" }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-purple-50/50 transition-colors">
                      <td className="py-4 px-6 text-sm font-medium text-slate-900">{row.jabatan}</td>
                      <td className="py-4 px-6 text-sm text-slate-600">{row.kedudukan}</td>
                      <td className="py-4 px-6 text-sm text-slate-600 leading-relaxed">{row.tugas}</td>
                      <td className="py-4 px-6 text-sm text-slate-500 font-light">{row.catatan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Kriteria & Tugas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-bold tracking-widest uppercase text-purple-600 mb-2 block">
              Bab III & Pasal 10-11 Permendagri 13/2024
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Kriteria & Tugas Pengurus dan Kader</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Kriteria Pengurus */}
            <motion.div
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">📋 Kriteria Pengurus Posyandu</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Memiliki pengetahuan pembangunan dan pemberdayaan masyarakat Desa/Kelurahan",
                  "Dipilih dari dan oleh masyarakat, diketahui Tim Pembina Posyandu",
                  "BersBersedia dan mampu bekerja bersama masyarakat",
                  "Bisa membaca dan menulis huruf Latin",
                  "Berdomisili di Desa/Kelurahan setempat",
                  "Sehat jasmani dan rohani"
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 items-start text-sm text-slate-600 font-light">
                    <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Tugas Pengurus */}
            <motion.div
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">✅ Tugas Pengurus Posyandu</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Menyusun perencanaan dan pengusulan program/kegiatan kepada Pemerintah Desa",
                  "Melaksanakan program/kegiatan/subkegiatan Posyandu",
                  "Melakukan koordinasi dengan Tim Pembina Posyandu tingkat Desa",
                  "Menyiapkan bahan penyusunan laporan pelayanan kepada Kepala Desa"
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 items-start text-sm text-slate-600 font-light">
                    <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Tugas Kader */}
            <motion.div
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">🦸 Tugas Kader Posyandu</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Melaksanakan pelayanan sesuai bidang layanannya (hanya 1 bidang)",
                  "Mempersiapkan tempat pelaksanaan Posyandu",
                  "Melakukan pendataan dan identifikasi pelayanan sesuai SPM",
                  "Melakukan komunikasi, informasi, dan edukasi sesuai SPM",
                  "Mengompilasi kegiatan sebagai bahan laporan kepada pengurus"
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 items-start text-sm text-slate-600 font-light">
                    <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Alasan Pemberhentian */}
            <motion.div
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">🚫 Alasan Pemberhentian Pengurus</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Meninggal dunia, mengundurkan diri, atau diberhentikan",
                  "Berakhir masa jabatan atau pindah tempat tinggal",
                  "Tidak memenuhi syarat kesehatan jasmani dan rohani",
                  "Melakukan perbuatan tercela atau tindak pidana inkracht",
                  "Tidak melaksanakan tupoksi 3 bulan tanpa keterangan",
                  "Menjadi pengurus partai politik"
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 items-start text-sm text-slate-600 font-light">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section: Apresiasi Kader */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-bold tracking-widest uppercase text-purple-600 mb-2 block">
              Apresiasi Kader
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Sistem Penghargaan Kader Posyandu</h2>
            <p className="text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
              Penghargaan diberikan sebagai bentuk pengakuan formal atas pengabdian dan kontribusi kader di lapangan.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
            {[
              { icon: Medal, title: "Pengabdian 10 Tahun", desc: "Sertifikat, piala, atau medali dari pembina tingkat kecamatan" },
              { icon: Medal, title: "Pengabdian 20 Tahun", desc: "Penghargaan dari pembina tingkat kabupaten/kota" },
              { icon: Trophy, title: "Pengabdian 30 Tahun+", desc: "Penghargaan dari pembina tingkat provinsi" },
              { icon: Lightbulb, title: "Kader Inovatif", desc: "Inovasi layanan Posyandu sesuai 6 Bidang SPM" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="max-w-4xl mx-auto bg-purple-50 border border-purple-100 p-6 rounded-2xl flex gap-4 items-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-sm text-purple-800 font-light leading-relaxed">
              Pemberian penghargaan diatur dengan peraturan perundang-undangan yang ditetapkan Pemerintah Daerah bersama Tim Pembina Posyandu, difasilitasi oleh Direktorat Jenderal Bina Pemerintah Desa Kemendagri.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section: Tim Pembina */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-bold tracking-widest uppercase text-purple-600 mb-2 block">
              Bab V Juknis Tata Kelola
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Tim Pembina Posyandu</h2>
            <p className="text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
              Tim Pembina ada di 5 jenjang pemerintahan. Masa bakti mengikuti masa jabatan pada masing-masing tingkat jabatan.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {[
              { icon: Landmark, title: "TP Posyandu Pusat", desc: "Dibentuk oleh Mendagri. Ketua Umum dijabat istri/suami Mendagri. Merumuskan arah kebijakan nasional." },
              { icon: Building, title: "TP Posyandu Provinsi", desc: "Dibentuk oleh Gubernur. Ketua dijabat istri/suami Gubernur. Terdiri dari Ketua, Sekr, Bend, Kabid, Anggota." },
              { icon: Building, title: "TP Posyandu Kab/Kota", desc: "Dibentuk oleh Bupati/Wali Kota. Ketua dijabat istri/suami Bupati/Wali Kota. Bertanggung jawab di tingkat kab/kota." },
              { icon: MapPin, title: "TP Posyandu Kecamatan", desc: "Dibentuk dan ditetapkan oleh Camat. Ditetapkan secara berjenjang sesuai kewenangan." },
              { icon: Home, title: "TP Posyandu Desa/Kel.", desc: "Dibentuk oleh Kades/Lurah. Ketua dijabat istri Kades/Lurah. Paling dekat dengan masyarakat." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Regulasi */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-bold tracking-widest uppercase text-purple-600 mb-2 block">
              Regulasi
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Landasan Hukum Kelembagaan</h2>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {[
              { num: "1", text: "UU No. 6 Tahun 2014 tentang Desa, diubah UU No. 3/2024 — Pasal 94 mengatur LKD, Pasal 19 huruf b menyebut Posyandu sebagai kewenangan lokal berskala desa" },
              { num: "2", text: "PP No. 43 Tahun 2014, terakhir diubah PP No. 11/2019 — Pasal 150 ayat (1) menyatakan Posyandu sebagai Lembaga Kemasyarakatan Desa (LKD)" },
              { num: "3", text: "PP No. 2 Tahun 2018 tentang Standar Pelayanan Minimal — dasar penetapan 6 Bidang SPM yang wajib dilayani Posyandu" },
              { num: "4", text: "Permendagri No. 13 Tahun 2024 tentang Pos Pelayanan Terpadu — regulasi utama, ditetapkan 23 Agustus 2024, diundangkan 17 September 2024" },
              { num: "5", text: "Kepmendagri No. 400.5.-622 Tahun 2024 tentang Tim Pembina Pos Pelayanan Terpadu — menetapkan susunan Tim Pembina Pusat" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-5 rounded-xl border border-slate-100 flex gap-4 items-start hover:shadow-sm transition-shadow"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">
                  {item.num}
                </div>
                <p className="text-sm text-slate-600 font-light leading-relaxed">{item.text}</p>
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
