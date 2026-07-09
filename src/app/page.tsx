"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Heart, Activity, Users, ClipboardList,
  ArrowRight, ArrowUpRight, Sparkles, Building, BookOpen,
  Shield, Baby, Syringe,
  Globe, Scale
} from "lucide-react";

function StatCard({ target, suffix, label, visible, delay }: { target: number; suffix: string; label: string; visible: boolean; delay: number }) {
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

  const display = target >= 1000
    ? (count >= 1000 ? (count / 1000).toFixed(1).replace(".", ".") + ".000".slice(0, count >= 1000 ? 0 : 4) : count.toString())
    : count.toString();

  // Format: 1100 → 1.100, 5500 → 5.500
  const formatted = count.toLocaleString("id-ID");

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
      <p className="text-3xl font-extrabold text-emerald-700 mb-1 tracking-tight">
        {formatted}{suffix}
      </p>
      <p className="text-sm text-slate-500 font-light">{label}</p>
    </div>
  );
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "/images/hero/hero1.png",
    "/images/hero/hero2.png",
    "/images/hero/hero3.png",
    "/images/hero/PHOTO-2026-05-11-21-46-02.jpg",
    "/images/hero/PHOTO-2026-05-11-21-46-04 3.jpg",
    "/images/hero/PHOTO-2026-05-11-21-46-04.jpg",
    "/images/hero/PHOTO-2026-05-11-21-46-05 3.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 200]); // Parallax effect

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="absolute inset-0"
              style={{ y }}
            >
              <Image
                src={images[currentImageIndex]}
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

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
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
            className="text-lg text-slate-200 mb-8 max-w-2xl mx-auto font-light"
          >
            Platform digital terintegrasi untuk pengelolaan data lintas sektor mulai dari Kesehatan, Pendidikan, hingga Infrastruktur.
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
              Mengapa Sistem Informasi Posyandu <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">Hadir?</span>
            </h2>
            <p className="inline-flex items-center px-5 py-2 rounded-full bg-slate-50 border border-slate-100 text-sm text-slate-500 font-light">
              Tata kelola data terintegrasi untuk pengambilan keputusan yang cepat dan tepat.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
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
                  <p className="text-sm text-white/75 font-light leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Section: Cakupan Pelayanan Posyandu */}
      <section id="cakupan" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-widest mb-4">
              Permendagri No. 13 Tahun 2024
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Cakupan Pelayanan{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">
                Posyandu
              </span>
            </h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto font-light">
              Sesuai Permendagri No. 13 Tahun 2024, Posyandu melayani 6 Bidang Standar Pelayanan Minimal untuk masyarakat desa.
            </p>
          </div>

          {/* SPM Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {[
              {
                code: "SPM 01",
                title: "Pendidikan",
                desc: "PAUD, literasi digital, perpustakaan desa, alat peraga edukasi",
              },
              {
                code: "SPM 02",
                title: "Kesehatan",
                desc: "Ibu, bayi, balita, remaja, lansia — 5 meja layanan dan kunjungan rumah",
              },
              {
                code: "SPM 03",
                title: "Pekerjaan Umum",
                desc: "Air bersih, sanitasi, embung, jaringan air, jalan desa",
              },
              {
                code: "SPM 04",
                title: "Perumahan Rakyat",
                desc: "Identifikasi & rehabilitasi rumah tidak layak huni",
              },
              {
                code: "SPM 05",
                title: "Trantibum Linmas",
                desc: "Ketertiban umum, pengaduan masyarakat, deteksi dini bencana",
              },
              {
                code: "SPM 06",
                title: "Sosial",
                desc: "Bansos, disabilitas, lansia terlantar, inklusi sosial, kesetaraan gender",
              },
            ].map((spm, index) => {
              const isAccent = index % 2 === 1;
              return (
                <div
                  key={index}
                  className={`relative rounded-2xl p-5 min-h-[150px] transition-all duration-300 hover:-translate-y-1 ${
                    isAccent ? "bg-emerald-400" : "bg-emerald-50/70"
                  }`}
                >
                  {/* Corner notch (cutout) */}
                  <div className="absolute top-0 right-0 w-14 h-14 bg-white rounded-bl-full flex items-start justify-end">
                    {/* Inverted corner: left of notch */}
                    <div className="absolute top-0 -left-4 w-4 h-4 rounded-tr-xl shadow-[4px_-4px_0_0_#fff]" />
                    {/* Inverted corner: below notch */}
                    <div className="absolute right-0 -bottom-4 w-4 h-4 rounded-tr-xl shadow-[4px_-4px_0_0_#fff]" />
                    {/* Arrow button */}
                    <div className="w-10 h-10 mt-1 mr-1 rounded-full border border-slate-300 bg-white flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4 text-slate-900" />
                    </div>
                  </div>

                  {/* Title */}
                  <p className="text-xl font-extrabold text-slate-900 tracking-tight mb-2 pr-14">
                    {spm.title}
                  </p>

                  {/* Caption */}
                  <p className={`text-xs leading-relaxed ${isAccent ? "text-slate-800/80" : "text-slate-500"}`}>
                    {spm.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section: Galeri Kegiatan Posyandu */}
      <section className="py-24 bg-slate-50/50 overflow-hidden border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 mb-3 block">
            Dokumentasi Lapangan
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Galeri Kegiatan{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">
              Posyandu
            </span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto font-light">
            Melihat lebih dekat pelayanan kesehatan, pendidikan, dan pemberdayaan masyarakat yang diselenggarakan oleh kader posyandu di wilayah Lampung Timur.
          </p>
        </div>

        <div className="marquee-container space-y-6 overflow-hidden py-2">
          {/* First Row: Left Scrolling */}
          <div className="flex overflow-hidden">
            <div className="animate-marquee-left flex gap-6">
              {[
                { src: "/images/hero/hero1.png", alt: "Layanan Balita Terintegrasi" },
                { src: "/images/hero/hero2.png", alt: "Pemeriksaan Kesehatan Ibu Hamil" },
                { src: "/images/hero/hero3.png", alt: "Pemberian Imunisasi & Vitamin" },
                { src: "/images/hero/PHOTO-2026-05-11-21-46-02.jpg", alt: "Kader Aktif Posyandu" },
                { src: "/images/tujuan/PHOTO-2026-05-11-21-46-03 2.jpg", alt: "Integrasi Pelayanan SPM" },
                { src: "/images/hero/hero1.png", alt: "Layanan Balita Terintegrasi" },
                { src: "/images/hero/hero2.png", alt: "Pemeriksaan Kesehatan Ibu Hamil" },
                { src: "/images/hero/hero3.png", alt: "Pemberian Imunisasi & Vitamin" },
                { src: "/images/hero/PHOTO-2026-05-11-21-46-02.jpg", alt: "Kader Aktif Posyandu" },
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
                { src: "/images/hero/PHOTO-2026-05-11-21-46-04 3.jpg", alt: "Penyuluhan Gizi Lansia" },
                { src: "/images/hero/PHOTO-2026-05-11-21-46-04.jpg", alt: "Kunjungan Rumah Balita" },
                { src: "/images/hero/PHOTO-2026-05-11-21-46-05 3.jpg", alt: "Kelas Ibu Balita Terpadu" },
                { src: "/images/tujuan/PHOTO-2026-05-11-21-46-03 3.jpg", alt: "Pelayanan Posyandu Prima" },
                { src: "/images/tujuan/PHOTO-2026-05-11-21-46-03 4.jpg", alt: "Pemberdayaan Masyarakat" },
                { src: "/images/hero/PHOTO-2026-05-11-21-46-04 3.jpg", alt: "Penyuluhan Gizi Lansia" },
                { src: "/images/hero/PHOTO-2026-05-11-21-46-04.jpg", alt: "Kunjungan Rumah Balita" },
                { src: "/images/hero/PHOTO-2026-05-11-21-46-05 3.jpg", alt: "Kelas Ibu Balita Terpadu" },
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
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 mb-3 block">
              Data Publik
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Kab. Lampung Timur dalam Angka
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto font-light">
              Gambaran skala pelayanan Posyandu yang dikelola melalui sistem SIPANDU.
            </p>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { target: 264, suffix: "", label: "Desa & Kelurahan" },
              { target: 24, suffix: "", label: "Kecamatan" },
              { target: 1100, suffix: "+", label: "Posyandu Aktif" },
              { target: 5500, suffix: "+", label: "Kader Terlatih" },
              { target: 6, suffix: "", label: "Bidang Layanan SPM" },
            ].map((stat, i) => (
              <StatCard key={i} target={stat.target} suffix={stat.suffix} label={stat.label} visible={statsVisible} delay={i * 120} />
            ))}
          </div>
        </div>
      </section>

      {/* Section: Tata Kelola */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 mb-2 block">
              Tata Kelola
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Kelembagaan yang Kuat & Transparan</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
              SIP bukan sekadar aplikasi, melainkan ekosistem tata kelola data yang melibatkan berbagai tingkatan kelembagaan di Kabupaten Lampung Timur.
            </p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              { icon: Building, title: "Terstruktur", desc: "Pembagian peran yang jelas dari Kabupaten hingga Kader Desa sesuai Permendagri No. 13/2024. Setiap jenjang memiliki tugas dan kewenangan yang ditetapkan." },
              { icon: ClipboardList, title: "Transparan", desc: "Data laporan yang dapat dipertanggungjawabkan dan terpantau. Pelaporan dilakukan secara berjenjang minimal 1 kali per tahun atau sewaktu-waktu jika diperlukan." },
              { icon: Globe, title: "Terintegrasi", desc: "Menghubungkan semua Posyandu dalam satu jaringan digital. Data dari desa mengalir ke kecamatan, kabupaten, provinsi, hingga pusat secara terstruktur." },
              { icon: Scale, title: "Berbasis Hukum", desc: "Seluruh proses mengacu pada UU No. 6/2014 tentang Desa, PP No. 43/2014, dan Permendagri No. 13 Tahun 2024 tentang Pos Pelayanan Terpadu." },
            ].map((feature, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-slate-50/50 rounded-xl hover:bg-emerald-50/50 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-0.5">{feature.title}</h4>
                  <p className="text-sm text-slate-500 font-light leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Struktur Kelembagaan */}
      <section className="py-20 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 mb-2 block">
              Struktur Kelembagaan
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Koordinasi Berjenjang</h2>
            <p className="text-slate-500 font-light">5 tingkat Tim Pembina sesuai regulasi</p>
          </div>

          {/* Timeline / Cards */}
          <div className="relative flex flex-col lg:flex-row justify-between items-start gap-2 lg:gap-6 max-w-6xl mx-auto">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-100 -translate-y-1/2 z-0" />

            {[
              { num: "01", title: "Pemerintah Pusat", subtitle: "Menteri", desc: "Penetapan kebijakan nasional & Tim Pembina Pusat" },
              { num: "02", title: "Pemerintah Provinsi", subtitle: "Gubernur", desc: "Gubernur menetapkan Tim Pembina Provinsi" },
              { num: "03", title: "Pemkab/Kota", subtitle: "Bupati/Wali Kota", desc: "Bupati/Wali Kota — pembina & pengambil kebijakan" },
              { num: "04", title: "Kecamatan & Puskesmas", subtitle: "Camat", desc: "Camat — pengawas dan fasilitator lapangan" },
              { num: "05", title: "Kader Posyandu Desa", subtitle: "Pengurus & Kader", desc: "Pengurus & Kader — pelaksana operasional langsung" },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                className="relative z-10 w-full lg:w-1/5 flex flex-col items-center pt-5 lg:pt-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Number Badge */}
                <div className="absolute top-0 lg:relative lg:top-auto w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-500/20 z-20 mb-0 lg:mb-4">
                  {step.num}
                </div>
                
                {/* Card */}
                <motion.div
                  className="bg-white p-5 pt-8 lg:pt-5 rounded-xl border border-slate-100 shadow-sm transition-all w-full min-h-[140px] lg:min-h-[160px] flex flex-col justify-center lg:justify-between z-10 cursor-pointer"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="text-center">
                    <h3 className="text-sm font-bold text-slate-900 mb-0.5">{step.title}</h3>
                    <p className="text-xs text-emerald-600 font-medium mb-2">{step.subtitle}</p>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>

                {/* Arrow for mobile */}
                {idx < 4 && (
                  <div className="block lg:hidden mt-2 mb-0 text-emerald-500 font-bold text-xl">
                    ↓
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Keunggulan */}
      <section className="py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 mb-2 block">
              Keunggulan
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Manfaat Utama SIP</h2>
            <p className="text-slate-500 font-light max-w-2xl mx-auto">
              Mewujudkan tata kelola yang lebih baik melalui digitalisasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { num: "1", title: "Integrasi Data", desc: "Menghubungkan berbagai sektor" },
              { num: "2", title: "Efisiensi", desc: "Mempercepat proses pelaporan" },
              { num: "3", title: "Transparansi", desc: "Data akurat & terpercaya" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold mb-4">
                  {item.num}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500 font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Landasan Hukum */}
      <section id="hukum" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 mb-2 block">
              Landasan Hukum
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Dasar Regulasi SIPANDU</h2>
            <p className="text-slate-500 font-light max-w-2xl mx-auto">
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
                  <p className="text-sm text-slate-500 font-light leading-relaxed">{reg.detail}</p>
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
