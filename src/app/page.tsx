"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Activity, Users, ClipboardList,
  ArrowRight, ArrowUpRight, Building, MapPin
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

function StatCard({ target, suffix, label, icon: Icon, visible, delay }: { target: number; suffix: string; label: string; icon: LucideIcon; visible: boolean; delay: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const duration = 1600;
    const startTime = performance.now() + delay;
    let raf: number;
    const tick = (now: number) => {
      const elapsed = Math.max(0, now - startTime);
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(ease * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, target, delay]);

  // Format: 1100 → 1.100, 5500 → 5.500
  const formatted = count.toLocaleString("id-ID");

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-lg p-6 hover:bg-white/[0.08] transition-colors">
      <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center mb-5">
        <Icon className="w-5 h-5 text-emerald-950" />
      </div>
      <p className="text-3xl font-extrabold text-white mb-1 tracking-tight">
        {formatted}{suffix}
      </p>
      <p className="text-sm text-emerald-100/60 font-normal">{label}</p>
    </div>
  );
}

export default function Home() {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "/images/hero/hero1.avif",
    "/images/hero/hero2.avif",
    "/images/hero/hero3.avif",
    "/images/hero/hero4.avif",
    "/images/hero/hero5.avif",
    "/images/hero/hero6.avif"
  ];
  const safeImageIndex = currentImageIndex < images.length ? currentImageIndex : 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 200]); // Parallax effect

  // Intersection Observer for stats count-up
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-white text-slate-800 font-sans antialiased">
      {/* Header/Navbar */}
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[700px] flex items-center pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-slate-50">
        {/* Background Image Carousel */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.div
              key={safeImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="absolute inset-0"
              style={{ y }}
            >
              <Image
                src={images[safeImageIndex]}
                alt="Hero Background"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/10 z-10"></div>
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 text-center">
          {/* Badge */}


          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-6xl font-extrabold tracking-tight mb-6 text-white"
          >
            Modernisasi Data & Pelayanan <br />
            <span className="text-white">Sistem Informasi Posyandu</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-200 mb-8 max-w-4xl mx-auto font-normal leading-relaxed"
          >
            Platform digital terpadu untuk monitoring, pencatatan, dan pelaporan 6 Bidang Standar Pelayanan Minimal (SPM). Mengonsolidasikan data secara real-time dari 1.100+ Posyandu aktif dan 5.500+ kader kesehatan di 264 desa/kelurahan di wilayah Kabupaten Lampung Timur.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/login"
              className="group w-full sm:w-auto px-8 py-3.5 text-base font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-[10px] shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Mulai Sekarang
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

          </motion.div>
        </div>
      </section>

      {/* Section: Mengapa SIP Hadir */}
      <section id="layanan" className="py-24 bg-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              Mengapa Sistem Informasi Posyandu <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">Hadir?</span>
            </h2>
            <p className="inline-flex items-center px-5 py-2 rounded-full bg-slate-50 border border-slate-100 text-sm text-slate-500 font-normal">
              Tata kelola data terintegrasi untuk pengambilan keputusan yang cepat dan tepat.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1200px] mx-auto">
            {[
              {
                img: "/images/tujuan/PHOTO-2026-05-11-21-46-03 2.jpg",
                title: "Integrasi Data",
                desc: "Menghubungkan berbagai sektor krusial dalam satu platform terpadu.",
              },
              {
                img: "/images/tujuan/PHOTO-2026-05-11-21-46-03 3.jpg",
                title: "Efisiensi Pelayanan",
                desc: "Mempercepat proses pencatatan dan pelaporan di setiap posyandu.",
              },
              {
                img: "/images/tujuan/PHOTO-2026-05-11-21-46-03 4.jpg",
                title: "Transparansi",
                desc: "Data yang akurat dan terpercaya, dapat diakses setiap saat.",
              },
            ].map((card, i) => (
              <div
                key={card.title}
                className="relative h-96 rounded-2xl overflow-hidden shadow-xl shadow-emerald-900/5 group"
              >
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
                {/* Number badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold">
                  0{i + 1}
                </div>
                {/* Label */}
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-xl font-bold text-white mb-1.5">{card.title}</h3>
                  <p className="text-sm text-white/75 font-normal leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Section: Cakupan Pelayanan Posyandu */}
      <section id="cakupan" className="py-24 bg-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Cakupan Pelayanan{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">
                Posyandu
              </span>
            </h2>
            <p className="text-slate-500 mt-4 max-w-3xl mx-auto font-normal leading-relaxed text-base">
              Berdasarkan Peraturan Menteri Dalam Negeri Nomor 13 Tahun 2024, Pos Pelayanan Terpadu (Posyandu) kini bertransformasi menjadi lembaga kemasyarakatan desa yang memfasilitasi 6 Bidang Standar Pelayanan Minimal (SPM) untuk peningkatan kesejahteraan masyarakat secara merata.
            </p>
          </div>

          {/* SPM Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">

            {[
              {
                code: "SPM 01",
                title: "Pendidikan",
                desc: "Penyelenggaraan layanan tumbuh kembang anak usia dini (PAUD), pojok baca atau perpustakaan desa, penyediaan alat peraga edukatif, serta peningkatan literasi dasar.",
              },
              {
                code: "SPM 02",
                title: "Kesehatan",
                desc: "Pemeriksaan kesehatan ibu hamil, pemantauan status gizi balita melalui 5 langkah pelayanan Posyandu, imunisasi dasar lengkap, serta posyandu remaja dan lansia terintegrasi.",
              },
              {
                code: "SPM 03",
                title: "Pekerjaan Umum",
                desc: "Pemantauan dan pendataan kualitas air bersih layak konsumsi, fasilitas sanitasi keluarga (jamban sehat), pemeliharaan drainase lingkungan, serta prasarana dasar desa.",
              },
              {
                code: "SPM 04",
                title: "Perumahan Rakyat",
                desc: "Pencatatan kondisi perumahan warga, identifikasi Rumah Tidak Layak Huni (RTLH) untuk program bantuan rehabilitasi sosial, serta edukasi kebersihan lingkungan tempat tinggal.",
              },
              {
                code: "SPM 05",
                title: "Trantibum Linmas",
                desc: "Deteksi dini potensi gangguan ketenteraman, penanganan cepat aduan ketertiban umum di tingkat lingkungan, sosialisasi kesiapsiagaan bencana, serta pembinaan Linmas.",
              },
              {
                code: "SPM 06",
                title: "Sosial",
                desc: "Pendataan penerima bantuan sosial terpadu, pendampingan lansia terlantar dan penyandang disabilitas, promosi inklusi sosial, serta fasilitasi kesetaraan gender.",
              },
            ].map((spm, index) => {
              const isAccent = index % 2 === 1;
              // Checkerboard for the 2-col mobile grid (row parity flips each row)
              const isAccentMobile = (index + Math.floor(index / 2)) % 2 === 1;
              // Corner notch: scoop hugging the button circle, with smooth fillets
              // where it meets the top and right edges (no sharp tips)
              const notchSvg =
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 72 72'%3E%3Cpath d='M0 0 H7.15 A12 12 0 0 1 18.8 14.7 A32 32 0 0 0 57.3 53.2 A12 12 0 0 1 72 64.85 V72 H0 Z'/%3E%3C/svg%3E\")";
              const maskStyle = {
                maskImage: `linear-gradient(#000,#000), linear-gradient(#000,#000), ${notchSvg}`,
                maskSize: "calc(100% - 71px) 100%, 72px calc(100% - 71px), 72px 72px",
                maskPosition: "left top, right bottom, right top",
                maskRepeat: "no-repeat",
                WebkitMaskImage: `linear-gradient(#000,#000), linear-gradient(#000,#000), ${notchSvg}`,
                WebkitMaskSize: "calc(100% - 71px) 100%, 72px calc(100% - 71px), 72px 72px",
                WebkitMaskPosition: "left top, right bottom, right top",
                WebkitMaskRepeat: "no-repeat",
              } as React.CSSProperties;
              return (
                <div
                  key={index}
                  className="group relative transition-all duration-300 ease-out hover:-translate-y-2"
                >
                  {/* Card body with circular corner cutout */}
                  <div
                    className={`relative overflow-hidden rounded-2xl p-4 sm:p-7 min-h-[150px] sm:min-h-[170px] flex flex-col justify-center ${
                      isAccentMobile ? "bg-emerald-400" : "bg-emerald-50/70"
                    } ${isAccent ? "lg:bg-emerald-400" : "lg:bg-emerald-50/70"}`}
                    style={maskStyle}
                  >
                    {/* Expanding blob fill on hover */}
                    <div
                      aria-hidden
                      className={`absolute -bottom-10 -left-10 w-24 h-24 rounded-full scale-0 group-hover:scale-[9] transition-transform duration-500 ease-out ${
                        isAccentMobile ? "bg-emerald-500" : "bg-emerald-200/90"
                      } ${isAccent ? "lg:bg-emerald-500" : "lg:bg-emerald-200/90"}`}
                    />

                    {/* Title */}
                    <p className="relative text-base sm:text-xl font-extrabold text-slate-900 tracking-tight mb-1.5 sm:mb-2.5 pr-10 sm:pr-12 transition-transform duration-300 group-hover:-translate-y-1">
                      {spm.title}
                    </p>

                    {/* Caption */}
                    <p className={`relative text-[11px] sm:text-xs leading-relaxed transition-transform duration-300 delay-75 group-hover:-translate-y-1 ${
                      isAccentMobile ? "text-slate-800/80" : "text-slate-600"
                    } ${isAccent ? "lg:text-slate-800/80" : "lg:text-slate-600"}`}>
                      {spm.desc}
                    </p>
                  </div>

                  {/* Arrow button in the cutout */}
                  <div className="absolute top-0.5 right-0.5 w-[43px] h-[43px] rounded-full border-2 border-slate-300 bg-white flex items-center justify-center transition-all duration-300 group-hover:bg-slate-900 group-hover:border-slate-900 group-hover:scale-110 group-hover:ring-4 group-hover:ring-emerald-200/70">
                    <ArrowUpRight className="w-4 h-4 text-slate-900 transition-transform duration-300 group-hover:rotate-45 group-hover:text-white" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section: Galeri Kegiatan Posyandu */}
      <section className="py-24 bg-slate-50/50 overflow-hidden border-y border-slate-100">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 mb-3 block">
            Dokumentasi Lapangan
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Galeri Kegiatan{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">
              Posyandu
            </span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto font-normal">
            Melihat lebih dekat pelayanan kesehatan, pendidikan, dan pemberdayaan masyarakat yang diselenggarakan oleh kader posyandu di wilayah Lampung Timur.
          </p>
        </div>

        <div className="marquee-container space-y-6 overflow-hidden py-2">
          {/* First Row: Left Scrolling */}
          <div className="flex overflow-hidden">
            <div className="animate-marquee-left flex gap-6">
              {[
                { src: "/images/hero/hero1.avif", alt: "Layanan Balita Terintegrasi" },
                { src: "/images/hero/hero2.avif", alt: "Pemeriksaan Kesehatan Ibu Hamil" },
                { src: "/images/hero/hero3.avif", alt: "Pemberian Imunisasi & Vitamin" },
                { src: "/images/hero/hero4.avif", alt: "Kader Aktif Posyandu" },
                { src: "/images/tujuan/PHOTO-2026-05-11-21-46-03 2.jpg", alt: "Integrasi Pelayanan SPM" },
                { src: "/images/hero/hero1.avif", alt: "Layanan Balita Terintegrasi" },
                { src: "/images/hero/hero2.avif", alt: "Pemeriksaan Kesehatan Ibu Hamil" },
                { src: "/images/hero/hero3.avif", alt: "Pemberian Imunisasi & Vitamin" },
                { src: "/images/hero/hero4.avif", alt: "Kader Aktif Posyandu" },
                { src: "/images/tujuan/PHOTO-2026-05-11-21-46-03 2.jpg", alt: "Integrasi Pelayanan SPM" },
              ].map((item, idx) => (
                <div key={`r1-${idx}`} className="relative w-80 h-52 flex-shrink-0 rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="320px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-semibold text-sm drop-shadow-sm">{item.alt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Second Row: Right Scrolling */}
          <div className="flex overflow-hidden">
            <div className="animate-marquee-right flex gap-6">
              {[
                { src: "/images/hero/hero4.avif", alt: "Penyuluhan Gizi Lansia" },
                { src: "/images/hero/hero5.avif", alt: "Kunjungan Rumah Balita" },
                { src: "/images/hero/hero6.avif", alt: "Kelas Ibu Balita Terpadu" },
                { src: "/images/tujuan/PHOTO-2026-05-11-21-46-03 3.jpg", alt: "Pelayanan Posyandu Prima" },
                { src: "/images/tujuan/PHOTO-2026-05-11-21-46-03 4.jpg", alt: "Pemberdayaan Masyarakat" },
                { src: "/images/hero/hero4.avif", alt: "Penyuluhan Gizi Lansia" },
                { src: "/images/hero/hero5.avif", alt: "Kunjungan Rumah Balita" },
                { src: "/images/hero/hero6.avif", alt: "Kelas Ibu Balita Terpadu" },
                { src: "/images/tujuan/PHOTO-2026-05-11-21-46-03 3.jpg", alt: "Pelayanan Posyandu Prima" },
                { src: "/images/tujuan/PHOTO-2026-05-11-21-46-03 4.jpg", alt: "Pemberdayaan Masyarakat" },
              ].map((item, idx) => (
                <div key={`r2-${idx}`} className="relative w-80 h-52 flex-shrink-0 rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="320px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-semibold text-sm drop-shadow-sm">{item.alt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section: Lampung Timur dalam Angka */}
      <section className="py-20 bg-[#12291b] overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-400 mb-3 block">
              Data Publik
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Kabupaten Lampung Timur dalam Angka
            </h2>
            <p className="text-emerald-100/60 mt-4 max-w-3xl mx-auto font-normal leading-relaxed text-base">
              Visualisasi skala operasional dan sebaran cakupan pelayanan Posyandu di seluruh wilayah Kabupaten Lampung Timur. Seluruh data dikonsolidasikan secara digital melalui pangkalan data terintegrasi Sistem Informasi Posyandu (SIPANDU).
            </p>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { target: 264, suffix: "", label: "Desa & Kelurahan", icon: Building },
              { target: 24, suffix: "", label: "Kecamatan", icon: MapPin },
              { target: 1100, suffix: "+", label: "Posyandu Aktif", icon: Activity },
              { target: 5500, suffix: "+", label: "Kader Terlatih", icon: Users },
              { target: 6, suffix: "", label: "Bidang Layanan SPM", icon: ClipboardList },
            ].map((stat, i) => (
              <StatCard key={i} target={stat.target} suffix={stat.suffix} label={stat.label} icon={stat.icon} visible={statsVisible} delay={i * 120} />
            ))}
          </div>
        </div>
      </section>

      {/* Section: Tata Kelola */}
      <section id="about" className="py-24 bg-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Layout matching the user's reference image style */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-emerald-600 mb-3 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Tata Kelola
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Tata Kelola Kelembagaan yang Kuat & Transparan
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-slate-500 font-normal leading-relaxed text-sm md:text-base">
                SIP bukan sekadar aplikasi, melainkan ekosistem tata kelola data yang mengintegrasikan berbagai tingkatan kelembagaan di Kabupaten Lampung Timur.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                badge: "Kelembagaan",
                title: "Tata Kelola Terstruktur Hingga Tingkat Kader Desa",
                mockup: (
                  <div className="w-full h-full flex items-center justify-between gap-4 p-4">
                    <div className="flex flex-col gap-2 w-2/3">
                      {[
                        { label: "Kabupaten", val: "Aktif", isBadge: true },
                        { label: "Kecamatan", val: "24 Wilayah", isBadge: false },
                        { label: "Posyandu Desa", val: "1.100+ Pos", isBadge: false }
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center gap-2">
                          <span className="text-[10px] opacity-80 font-medium transition-colors duration-500 text-white group-hover:text-emerald-950">
                            {item.label}
                          </span>
                          {item.isBadge ? (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wide transition-all duration-500 bg-emerald-800 text-emerald-300 group-hover:bg-emerald-950/20 group-hover:text-emerald-900">
                              {item.val}
                            </span>
                          ) : (
                            <span className="text-[9px] font-semibold transition-colors duration-500 text-emerald-300 group-hover:text-emerald-900">
                              {item.val}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="w-1/3 h-full flex flex-col justify-end items-end">
                      <svg className="w-full h-12 stroke-current transition-colors duration-500 text-emerald-400 group-hover:text-emerald-900" viewBox="0 0 60 30" fill="none" strokeWidth="2" strokeLinecap="round">
                        <path d="M5 25 Q 15 15, 25 20 T 45 5 T 55 10" />
                        <circle cx="45" cy="5" r="3" className="fill-current" />
                      </svg>
                    </div>
                  </div>
                )
              },
              {
                badge: "Akuntabilitas",
                title: "Transparansi Data Laporan Real-Time & Akuntabel",
                mockup: (
                  <div className="w-full h-full flex items-center justify-between gap-4 p-4">
                    <div className="flex flex-col gap-2 w-1/2">
                      {[
                        "100% Valid",
                        "Akuntabel",
                        "Ditinjau"
                      ].map((txt, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 shrink-0 stroke-current text-emerald-400 group-hover:text-emerald-900" fill="none" viewBox="0 0 24 24" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          <span className="text-[9px] font-semibold transition-colors duration-500 text-white group-hover:text-emerald-950">
                            {txt}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-end justify-around gap-1 h-24 w-1/2 bg-emerald-950/40 rounded-xl p-2 transition-colors duration-500 group-hover:bg-white/50">
                      {[30, 60, 45, 90, 75].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: `${h}%` }}
                          className="w-2 rounded-t-sm transition-colors duration-500 bg-emerald-400 group-hover:bg-emerald-950"
                        ></div>
                      ))}
                    </div>
                  </div>
                )
              },
              {
                badge: "Konektivitas",
                title: "Integrasi Jaringan Layanan Lintas Sektor Desa",
                mockup: (
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <svg className="absolute inset-0 w-full h-full stroke-current transition-colors duration-500 text-emerald-800/80 group-hover:text-emerald-900/40" viewBox="0 0 160 120" fill="none">
                      <line x1="80" y1="60" x2="30" y2="30" strokeWidth="1.5" strokeDasharray="3 3" />
                      <line x1="80" y1="60" x2="130" y2="30" strokeWidth="1.5" strokeDasharray="3 3" />
                      <line x1="80" y1="60" x2="30" y2="90" strokeWidth="1.5" strokeDasharray="3 3" />
                      <line x1="80" y1="60" x2="130" y2="90" strokeWidth="1.5" strokeDasharray="3 3" />
                    </svg>
                    <div className="absolute w-9 h-9 rounded-full flex items-center justify-center text-[9px] font-black transition-all duration-500 bg-emerald-400 text-emerald-950 group-hover:bg-emerald-950 group-hover:text-white shadow-md">
                      SIP
                    </div>
                    <div className="absolute top-4 left-3 px-1.5 py-0.5 rounded text-[8px] font-semibold transition-all duration-500 bg-emerald-800/60 group-hover:bg-emerald-950/20 text-emerald-100 group-hover:text-emerald-900">
                      KIA
                    </div>
                    <div className="absolute top-4 right-3 px-1.5 py-0.5 rounded text-[8px] font-semibold transition-all duration-500 bg-emerald-800/60 group-hover:bg-emerald-950/20 text-emerald-100 group-hover:text-emerald-900">
                      PAUD
                    </div>
                    <div className="absolute bottom-4 left-3 px-1.5 py-0.5 rounded text-[8px] font-semibold transition-all duration-500 bg-emerald-800/60 group-hover:bg-emerald-950/20 text-emerald-100 group-hover:text-emerald-900">
                      Sosial
                    </div>
                    <div className="absolute bottom-4 right-3 px-1.5 py-0.5 rounded text-[8px] font-semibold transition-all duration-500 bg-emerald-800/60 group-hover:bg-emerald-950/20 text-emerald-100 group-hover:text-emerald-900">
                      PU
                    </div>
                  </div>
                )
              },
              {
                badge: "Regulasi",
                title: "Kepatuhan Hukum Sesuai Regulasi Permendagri",
                mockup: (
                  <div className="w-full h-full flex items-center justify-between gap-4 p-4">
                    <div className="flex flex-col gap-2 w-2/3">
                      {[
                        "UU Desa No. 6/2014",
                        "PP No. 43/2014",
                        "Permendagri 13/2024"
                      ].map((txt, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full transition-colors duration-500 bg-emerald-400 group-hover:bg-emerald-950"></div>
                          <span className="text-[9px] font-semibold transition-colors duration-500 text-white group-hover:text-emerald-950">
                            {txt}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="w-1/3 h-full flex items-center justify-center">
                      <svg className="w-12 h-12 fill-none stroke-current transition-colors duration-500 text-emerald-400 group-hover:text-emerald-900" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17M12 5l-8 3h16l-8-3zM4 8l3 8h-6l3-8zM20 8l3 8h-6l3-8zM9 20h6" />
                      </svg>
                    </div>
                  </div>
                )
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative pt-6 px-6 pb-0 bg-slate-50/60 rounded-[32px] transition-all duration-500 hover:bg-emerald-950 flex flex-col justify-between min-h-[320px] cursor-pointer hover:shadow-2xl hover:shadow-emerald-950/20 hover:-translate-y-2 border border-slate-100/50 overflow-hidden"
              >
                <div className="flex flex-col">
                  {/* Badge */}
                  <span className="inline-flex self-start px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 transition-colors duration-500 group-hover:bg-white/20 group-hover:text-white">
                    {feature.badge}
                  </span>

                  {/* Title */}
                  <h4 className="text-lg md:text-xl font-extrabold text-slate-900 mt-4 leading-snug transition-colors duration-500 group-hover:text-white tracking-tight">
                    {feature.title}
                  </h4>
                </div>

                {/* Mockup Image/Graphic */}
                <div className="mt-6 w-full h-40 rounded-t-[20px] rounded-b-none transition-all duration-500 flex flex-col justify-between overflow-hidden bg-[#0c311e] text-white group-hover:bg-[#d9f99d] group-hover:text-emerald-950 shadow-inner">
                  {feature.mockup}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Struktur Kelembagaan */}
      <section className="py-24 bg-slate-50/50 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-emerald-600 mb-3 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Struktur Kelembagaan
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Koordinasi Berjenjang SIPANDU
            </h2>
            <p className="text-slate-500 font-normal max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Alur koordinasi 5 tingkat Tim Pembina Posyandu dari Pusat hingga tingkat Kader di Kabupaten Lampung Timur.
            </p>
          </div>

          {/* Timeline Wrapper (Flex Column matching the mockup layout) */}
          <div className="relative flex flex-col space-y-16 lg:space-y-24 max-w-[1200px] mx-auto mt-12">
            {/* Mobile Vertical Connecting Line */}
            <div className="absolute left-8 top-12 bottom-12 w-0.5 border-l-2 border-dashed border-emerald-300/40 lg:hidden pointer-events-none" />

            {[
              {
                num: "01",
                title: "Pemerintah Pusat",
                subtitle: "Menteri Dalam Negeri",
                desc: "Perumusan kebijakan nasional, regulasi Standar Pelayanan Minimal (SPM), dan fasilitasi Tim Pembina Posyandu Pusat.",
                role: "Mendagri",
                theme: "green",
                icon: (
                  <svg className="w-4 h-4 transition-colors duration-500 text-emerald-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                )
              },
              {
                num: "02",
                title: "Pemerintah Provinsi",
                subtitle: "Gubernur / Dinas PMD",
                desc: "Koordinasi pembinaan, pengawasan pelaksanaan program kerja daerah, serta penetapan Tim Pembina Posyandu Tingkat Provinsi.",
                role: "Gubernur",
                theme: "slate",
                icon: (
                  <svg className="w-4 h-4 transition-colors duration-500 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                )
              },
              {
                num: "03",
                title: "Pemerintah Kabupaten / Kota",
                subtitle: "Bupati / Walikota",
                desc: "Penyusunan kebijakan daerah, penyediaan alokasi anggaran APBD, pembinaan berkala, serta penetapan Tim Pembina Kabupaten.",
                role: "Bupati",
                theme: "green",
                icon: (
                  <svg className="w-4 h-4 transition-colors duration-500 text-emerald-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                )
              },
              {
                num: "04",
                title: "Kecamatan & Puskesmas",
                subtitle: "Camat & Kepala Puskesmas",
                desc: "Pengawasan operasional lapangan, bimbingan teknis berkala kepada kader, serta sinkronisasi data pelayanan kesehatan dasar.",
                role: "Camat",
                theme: "slate",
                icon: (
                  <svg className="w-4 h-4 transition-colors duration-500 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                )
              },
              {
                num: "05",
                title: "Kader Posyandu Desa",
                subtitle: "Pengurus & Kader Desa",
                desc: "Pelaksanaan operasional langsung pelayanan 6 Bidang SPM, pencatatan data secara riil, dan pendekatan pelayanan ke warga desa.",
                role: "Kader Desa",
                theme: "green",
                icon: (
                  <svg className="w-4 h-4 transition-colors duration-500 text-emerald-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11v11a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                )
              }
            ].map((step, idx) => {
              const isGreen = step.theme === "green";
              const isEven = idx % 2 !== 0;
              return (
                <motion.div
                  key={idx}
                  className={`relative z-10 w-full lg:w-[48%] flex items-stretch ${
                    isEven ? "self-end" : "self-start"
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {/* Outer Card with border and shadow */}
                  <div
                    className={`group relative z-10 flex items-stretch w-full p-3 rounded-[32px] border-2 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
                      isGreen
                        ? "bg-[#f4fbe9]/95 border-[#e6f4d3] hover:bg-[#ebf8d9]"
                        : "bg-white border-slate-100 hover:bg-slate-50/50"
                    }`}
                  >
                    {/* Rotated Vertical Pill Badge on Left */}
                    <div
                      className={`flex items-center justify-center py-4 px-2.5 w-10 rounded-2xl transition-all duration-500 shrink-0 select-none ${
                        isGreen
                          ? "bg-[#0a2f1c] text-[#d9f99d]"
                          : "bg-slate-900 text-slate-300"
                      }`}
                    >
                      <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                        {step.role}
                      </span>
                    </div>

                    {/* Content Section on Right */}
                    <div className="flex flex-col justify-between p-4 flex-1">
                      {/* Top Header Row (Icon + Number + Title) */}
                      <div className="flex items-center gap-2.5 mb-2">
                        {/* Icon Container */}
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            isGreen
                              ? "bg-[#d8f3b8] text-[#0a2f1c]"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {step.icon}
                        </div>
                        {/* Step Number & Title (Mockup style) */}
                        <h3 className={`text-lg md:text-xl font-extrabold tracking-tight ${
                          isGreen ? "text-[#0a2f1c]" : "text-slate-900"
                        }`}>
                          {parseInt(step.num)} {step.title}
                        </h3>
                      </div>

                      {/* Subtitle / Department */}
                      <span className={`text-[10px] font-bold uppercase tracking-wider mb-2 block ${
                        isGreen ? "text-emerald-700" : "text-slate-500"
                      }`}>
                        {step.subtitle}
                      </span>

                      {/* Description Paragraph */}
                      <p className={`text-xs md:text-sm font-normal leading-relaxed ${
                        isGreen ? "text-emerald-950/80" : "text-slate-600"
                      }`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* Connecting Line (Only on Desktop) */}
                  {idx < 4 && (
                    isEven ? (
                      /* Connects Even Card (Right Col) down to Odd Card (Left Col) in the next row */
                      <div className="hidden lg:block absolute right-[90%] top-[50%] w-[35%] h-[200px] border-t-2 border-l-2 border-dashed border-slate-300/40 rounded-tl-[32px] pointer-events-none -z-10" />
                    ) : (
                      /* Connects Odd Card (Left Col) down to Even Card (Right Col) in the same row */
                      <div className="hidden lg:block absolute left-[90%] top-[50%] w-[35%] h-[200px] border-t-2 border-r-2 border-dashed border-emerald-300/30 rounded-tr-[32px] pointer-events-none -z-10" />
                    )
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section: Landasan Hukum */}
      <section id="hukum" className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 mb-2 block">
              Landasan Hukum
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Dasar Regulasi Sistem Informasi Posyandu (SIPANDU)</h2>
            <p className="text-slate-500 font-normal max-w-2xl mx-auto">
              Sistem ini dibangun sesuai dengan ketentuan peraturan perundang-undangan yang berlaku.
            </p>
          </div>

          {/* List of Regulations */}
          <div className="space-y-4 max-w-4xl mx-auto">
            {[
              { type: "UU", title: "UU No. 6 Tahun 2014 tentang Desa", detail: "diubah dengan UU No. 3 Tahun 2024. Mengatur kedudukan Posyandu sebagai Lembaga Kemasyarakatan Desa (LKD) dan kewenangannya." },
              { type: "PP", title: "PP No. 43 Tahun 2014", detail: "tentang Pelaksanaan UU Desa, diubah terakhir dengan PP No. 11 Tahun 2019. Pasal 150 menetapkan Posyandu sebagai LKD." },
              { type: "PM", title: "Permendagri No. 13 Tahun 2024 tentang Pos Pelayanan Terpadu", detail: "regulasi utama yang mengatur transformasi Posyandu ke 6 Bidang SPM, ditetapkan 23 Agustus 2024." },
              { type: "KM", title: "Kepmendagri No. 400.5.1-3703 Tahun 2023", detail: "tentang Pembinaan dan Sinergitas Pos Pelayanan Terpadu di seluruh Indonesia." },
            ].map((reg, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-4 p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors">
                {/* Badge */}
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-bold text-lg">
                  {reg.type}
                </div>
                {/* Content */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{reg.title}</h3>
                  <p className="text-sm text-slate-500 font-normal leading-relaxed">{reg.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
