"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, ArrowRight, Building, Home, Briefcase, Lightbulb, Calendar, Image, Flag, Medal, Pin, FileText, Circle, Shirt, Folder, Lock, Trash, Landmark, Clipboard } from "lucide-react";

export default function PanduanPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-slate-800 font-sans antialiased">
      {/* Header (Same as Home/Tujuan) */}
      <Header />

      {/* Hero Section (Styled like Tujuan Page) */}
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
              Bab VII & VIII Juknis
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Panduan Administrasi & Pelaporan</h1>
            <p className="text-base md:text-lg text-emerald-50 font-light max-w-3xl leading-relaxed">
              Panduan lengkap tata administrasi, pengelolaan keuangan, pengarsipan, dan alur pelaporan berjenjang Posyandu.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <main className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section: Administrasi Umum */}
          <section className="mb-20">
            <div className="text-left mb-8">
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 mb-2 block">
                Administrasi Umum
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Jenis-Jenis Surat Posyandu</h2>
              <p className="text-slate-500 font-light max-w-3xl leading-relaxed">
                Setiap surat Posyandu memiliki fungsi dan ketentuan tersendiri. Kop surat menggunakan logo resmi Posyandu yang telah ditetapkan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { type: "KEPUTUSAN", title: "Surat Keputusan", desc: "Untuk mengangkat/memberhentikan pengurus, membentuk kepanitiaan, menetapkan pemenang lomba, dan memberikan penghargaan kader. Wajib ada dasar dan landasan hukum." },
                { type: "SURAT BIASA", title: "Surat Biasa", desc: "Untuk pemberitahuan, permintaan, sanggahan, pernyataan, undangan, keterangan, dan tanggapan kepada pihak lain." },
                { type: "PENGANTAR", title: "Surat Pengantar", desc: "Digunakan sebagai pengantar untuk pengiriman dokumen, barang, atau surat tertentu kepada Posyandu atau pihak lain." },
                { type: "EDARAN", title: "Surat Edaran", desc: "Ditujukan kepada beberapa orang sebagai petunjuk atau penjelasan dari suatu Surat Keputusan yang perlu disebarluaskan." },
                { type: "KUASA", title: "Surat Kuasa", desc: "Berisi pemberian kuasa dengan batasan kewenangan yang jelas dan batas waktu berlaku yang ditetapkan secara eksplisit." },
                { type: "TUGAS", title: "Surat Tugas", desc: "Pemberian tugas kepada satu atau lebih personil Posyandu untuk melaksanakan tugas-tugas tertentu dalam jangka waktu yang ditetapkan." }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
                >
                  <div>
                    <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded mb-3">
                      {item.type}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-500 font-light leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Section: Sumber Pendanaan */}
          <section className="mb-20 bg-slate-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-7xl mx-auto">
              <div className="text-left mb-8">
                <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 mb-2 block">
                  Pasal 26–27 Permendagri 13/2024
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Sumber Pendanaan Posyandu</h2>
                <p className="text-slate-500 font-light max-w-3xl leading-relaxed">
                  Pemerintah daerah dan Pemerintah Desa wajib menganggarkan dana untuk mendukung penyelenggaraan Posyandu.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[
                  { icon: Landmark, title: "APBN", desc: "Anggaran Pendapatan Belanja Negara — tingkat pusat" },
                  { icon: Building, title: "APBD Provinsi", desc: "Anggaran Provinsi untuk fasilitasi kebijakan" },
                  { icon: Building, title: "APBD Kab/Kota", desc: "Wajib dianggarkan oleh Bupati/Wali Kota" },
                  { icon: Home, title: "APBDesa", desc: "Wajib dianggarkan Pemerintah Desa untuk insentif kader" },
                  { icon: Briefcase, title: "Sumber Lain Sah", desc: "Sumber yang sah sesuai peraturan perundang-undangan" }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-0.5">{item.title}</h3>
                      <p className="text-xs text-slate-500 font-light">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-3 items-start">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <p className="text-sm text-emerald-700 font-light leading-relaxed">
                  Penganggaran dimaksudkan untuk mendanai program/kegiatan/subkegiatan Posyandu dan insentif kader. Pengurus dan Kader berhak atas insentif sesuai ketentuan perundang-undangan.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Pelaporan */}
          <section className="mb-20">
            <div className="text-left mb-8">
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 mb-2 block">
                Bab VIII Pelaporan
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Alur Pelaporan Berjenjang</h2>
              <p className="text-slate-500 font-light max-w-3xl leading-relaxed">
                Pelaporan dilakukan minimal 1 kali dalam 1 tahun atau sewaktu-waktu jika diperlukan.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto mb-8">
              {[
                { role: "Kepala Desa/Lurah", desc: "Laporan hasil pelayanan" },
                { role: "Camat", desc: "Kecamatan" },
                { role: "Bupati/Wali Kota", desc: "Kab/Kota" },
                { role: "Gubernur", desc: "Provinsi" },
                { role: "Menteri Dalam Negeri", desc: "Melalui Ditjen Bina Pemdes" }
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col md:flex-row items-center gap-4 w-full">
                  <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm w-full text-center">
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{step.role}</h3>
                    <p className="text-xs text-slate-500 font-light">{step.desc}</p>
                  </div>
                  {idx < 4 && (
                    <div className="text-emerald-500 font-bold rotate-90 md:rotate-0">→</div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3 items-start max-w-4xl mx-auto">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <p className="text-sm text-slate-600 font-light leading-relaxed">
                Laporan disampaikan paling sedikit 1 kali dalam 1 tahun atau sewaktu-waktu jika diperlukan. Hasil pemantauan dan evaluasi digunakan sebagai bahan masukan kebijakan Posyandu.
              </p>
            </div>
          </section>

          {/* Section: Atribut Kelembagaan */}
          <section className="mb-20 bg-slate-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-7xl mx-auto">
              <div className="text-left mb-8">
                <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 mb-2 block">
                  Bab IV Juknis & Pasal 9 Permendagri 13/2024
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Atribut Kelembagaan Posyandu</h2>
                <p className="text-slate-500 font-light max-w-3xl leading-relaxed">
                  Posyandu memiliki identitas dan legalitas kelembagaan yang ditetapkan oleh Keputusan Ketua Umum Pembina Posyandu.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { icon: Image, title: "Logo / Lambang", desc: "Identitas visual utama" },
                  { icon: Flag, title: "Duaja", desc: "Bendera kelembagaan" },
                  { icon: Medal, title: "Vandel", desc: "Cenderamata resmi" },
                  { icon: Pin, title: "Lencana", desc: "Pin identitas kader" },
                  { icon: FileText, title: "Kop Surat", desc: "Logo di tengah/kiri" },
                  { icon: Circle, title: "Stempel", desc: "Bulat, ukuran bertingkat" },
                  { icon: Clipboard, title: "Papan Nama", desc: "Putih-hitam, ukuran standar" },
                  { icon: Shirt, title: "Seragam", desc: "Dapat pakai seragam PKK" },
                  { icon: Medal, title: "Plakat", desc: "Kenang-kenangan resmi" }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 font-light">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Section: Tata Cara Pengarsipan */}
          <section>
            <div className="text-left mb-8">
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 mb-2 block">
                Bab VII C Juknis
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Tata Cara Pengarsipan</h2>
              <p className="text-slate-500 font-light max-w-3xl leading-relaxed">
                Arsip adalah bukti kegiatan yang dapat mempermudah apabila yang berkepentingan setiap saat memerlukan catatan.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: 3 Cards */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: Folder, title: "Penyimpanan Arsip", desc: "Surat/naskah khusus (Keputusan, Surat Tugas, Laporan, Hasil Rapat) disimpan berdasarkan masalah, penomoran, dan tahun. Dapat dilakukan secara elektronik/digital." },
                  { icon: Lock, title: "Jenis Arsip", desc: "Arsip Biasa: surat atau naskah yang digolongkan biasa. Arsip Rahasia: surat atau naskah yang digolongkan rahasia — tidak boleh dibawa pulang." },
                  { icon: Trash, title: "Pemusnahan Arsip", desc: "Dilakukan minimal setiap 5 tahun oleh Tim yang dibentuk Ketua Umum. Setiap pemusnahan wajib dibuatkan Berita Acara resmi." }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-500 font-light leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Right: 6 Steps Process */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Proses Pengarsipan (6 Tahap)</h3>
                <div className="space-y-3">
                  {[
                    "1. Pencatatan",
                    "2. Penyimpanan",
                    "3. Pemeliharaan",
                    "4. Penyajian Kembali",
                    "5. Penilaian",
                    "6. Pemusnahan"
                  ].map((step, idx) => (
                    <motion.div
                      key={idx}
                      className="p-3 bg-white rounded-lg border border-slate-100 text-sm text-slate-700 font-medium"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      viewport={{ once: true }}
                    >
                      {step}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
