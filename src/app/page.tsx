"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Heart, Activity, Users, ClipboardList,
  ArrowRight, Sparkles, Building, BookOpen,
  Shield, ChevronRight, Baby, Syringe
} from "lucide-react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "/images/hero/hero1.png",
    "/images/hero/hero2.png",
    "/images/hero/hero3.png"
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

  return (
    <div className="relative min-h-screen flex flex-col bg-white text-slate-800 font-sans antialiased">
      {/* Header/Navbar */}
      <header
        className={`fixed top-0 left-0 w-screen z-50 transition-all duration-500 flex justify-center ${isScrolled ? "pt-2" : "pt-4"
          }`}
      >
        <div className={`w-[calc(100vw-2rem)] max-w-7xl flex items-center justify-between transition-all duration-500 rounded-full border box-border ${isScrolled
            ? "bg-white/90 backdrop-blur-2xl border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] h-14 px-4 lg:px-6"
            : "bg-black/20 backdrop-blur-2xl border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.2)] h-16 px-4 lg:px-8"
          }`}>
          <div className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-emerald-500 fill-emerald-500/10" />
            <span className={`font-bold text-xl transition-colors ${isScrolled ? "text-slate-900" : "text-white"}`}>SIP</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#" className={`text-sm font-medium transition-colors ${isScrolled ? "text-slate-600 hover:text-emerald-500" : "text-white/80 hover:text-white"}`}>Beranda</Link>
            <Link href="/tujuan" className={`text-sm font-medium transition-colors ${isScrolled ? "text-slate-600 hover:text-emerald-500" : "text-white/80 hover:text-white"}`}>Tujuan</Link>
            <Link href="/#data" className={`text-sm font-medium transition-colors ${isScrolled ? "text-slate-600 hover:text-emerald-500" : "text-white/80 hover:text-white"}`}>Data</Link>
            <Link href="/about" className={`text-sm font-medium transition-colors ${isScrolled ? "text-slate-600 hover:text-emerald-500" : "text-white/80 hover:text-white"}`}>Tentang</Link>
          </nav>

          <Link
            href={session ? "/dashboard" : "/login"}
            className={`inline-flex items-center justify-center px-5 py-2 rounded-full text-[12px] font-bold tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 gap-2 ${isScrolled
                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-900/10"
                : "bg-emerald-600 text-white hover:bg-white hover:text-emerald-600 shadow-lg shadow-black/20"
              }`}
          >
            {session ? "Masuk Dashboard" : "Masuk"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[700px] flex items-center pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-slate-50">
        {/* Background Image Carousel */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
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
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">Sistem Informasi Posyandu</span>
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
              className="group w-full sm:w-auto px-8 py-3.5 text-base font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-full shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Mulai Sekarang
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

          </motion.div>
        </div>
      </section>

      {/* Section: Layanan (Panduan Pengelolaan) */}
      <section id="layanan" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content (Title + Mobile Cards + Text) */}
            <div className="col-span-1 lg:col-span-5 space-y-6">
              
              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                Mengapa Sistem Informasi Posyandu <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">Hadir?</span>
              </h2>

              {/* Cards - Only visible on Mobile */}
              <div className="grid grid-cols-2 gap-4 lg:hidden">
                {/* Card 1: Integrasi Data (Full Size) */}
                <div className="col-span-2 w-full h-48 relative rounded-3xl overflow-hidden shadow-xl shadow-emerald-900/5 group">
                  <Image
                    src="/images/tujuan/integrasi.avif"
                    alt="Integrasi Data"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-lg font-bold text-white mb-1">Integrasi Data</h3>
                    <p className="text-xs text-white/80 font-light">Menghubungkan berbagai sektor</p>
                  </div>
                </div>

                {/* Card 2: Efisiensi Pelayanan (70% Size) */}
                <div className="col-span-1 w-full h-40 relative rounded-2xl overflow-hidden shadow-xl shadow-emerald-900/5 group">
                  <Image
                    src="/images/tujuan/efisiensi.avif"
                    alt="Efisiensi Pelayanan"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute top-3 left-3 w-6 h-6 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white font-bold text-xs">2</div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-base font-bold text-white mb-0.5">Efisiensi</h3>
                    <p className="text-[10px] text-white/80 font-light">Mempercepat proses pelaporan</p>
                  </div>
                </div>

                {/* Card 3: Transparansi (60% Size) */}
                <div className="col-span-1 w-full h-40 relative rounded-2xl overflow-hidden shadow-xl shadow-emerald-900/5 group">
                  <Image
                    src="/images/tujuan/transparansi.avif"
                    alt="Transparansi"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute top-3 left-3 w-6 h-6 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white font-bold text-xs">3</div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-sm font-bold text-white mb-0.5">Transparansi</h3>
                    <p className="text-[10px] text-white/80 font-light">Data akurat & terpercaya</p>
                  </div>
                </div>
              </div>

              {/* Text */}
              <p className="text-base text-slate-500 font-light leading-relaxed">
                Mewujudkan tata kelola data yang terintegrasi untuk mendukung pengambilan keputusan yang cepat dan tepat. Kami menghubungkan sektor krusial untuk masa depan yang lebih baik.
              </p>
            </div>

            {/* Right Content - Cards - Only visible on Desktop */}
            <div className="hidden lg:col-span-7 lg:flex lg:flex-row lg:gap-6 lg:items-start lg:overflow-visible pb-6 lg:pb-0">
              
              {/* Card 1: Integrasi Data (Full Size) */}
              <div className="flex-shrink-0 w-64 h-80 relative rounded-3xl overflow-hidden shadow-xl shadow-emerald-900/5 group">
                <Image
                  src="/images/tujuan/integrasi.avif"
                  alt="Integrasi Data"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-lg font-bold text-white mb-1">Integrasi Data</h3>
                  <p className="text-xs text-white/80 font-light">Menghubungkan berbagai sektor</p>
                </div>
              </div>

              {/* Card 2: Efisiensi Pelayanan (70% Size) */}
              <div className="flex-shrink-0 w-44 h-56 relative rounded-2xl overflow-hidden shadow-xl shadow-emerald-900/5 mt-16 group">
                <Image
                  src="/images/tujuan/efisiensi.avif"
                  alt="Efisiensi Pelayanan"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-3 left-3 w-6 h-6 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white font-bold text-xs">2</div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-base font-bold text-white mb-0.5">Efisiensi</h3>
                  <p className="text-[10px] text-white/80 font-light">Mempercepat proses pelaporan</p>
                </div>
              </div>

              {/* Card 3: Transparansi (60% Size) */}
              <div className="flex-shrink-0 w-40 h-48 relative rounded-2xl overflow-hidden shadow-xl shadow-emerald-900/5 group">
                <Image
                  src="/images/tujuan/transparansi.avif"
                  alt="Transparansi"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-3 left-3 w-6 h-6 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white font-bold text-xs">3</div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-sm font-bold text-white mb-0.5">Transparansi</h3>
                  <p className="text-[10px] text-white/80 font-light">Data akurat & terpercaya</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Section: Data Terkumpul */}
      <section id="data" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">

            <p className="text-3xl font-bold text-slate-900 mt-2">Data Yang Dikumpulkan</p>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Sistem Informasi Posyandu mengumpulkan data dari berbagai sektor krusial di tingkat desa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: "Kesehatan", desc: "Data Posyandu, SIP 6, dan SIP 7 untuk pemantauan kesehatan warga.", color: "text-rose-500 bg-rose-50" },
              { icon: BookOpen, title: "Pendidikan", desc: "Pendataan fasilitas pendidikan dan anak usia sekolah.", color: "text-blue-500 bg-blue-50" },
              { icon: Building, title: "Infrastruktur", desc: "Data pekerjaan umum dan kondisi perumahan layak huni.", color: "text-amber-500 bg-amber-50" },
              { icon: Shield, title: "Ketertiban & Sosial", desc: "Data trantibum dan penerima bantuan sosial.", color: "text-emerald-500 bg-emerald-50" },
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Tentang (Tata Kelola) */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>

              <p className="text-3xl font-bold text-slate-900 mt-2">Kelembagaan yang Kuat & Transparan</p>
              <p className="text-slate-500 mt-4 mb-6">
                Sistem ini didukung oleh tata kelola kelembagaan yang solid di tingkat Kabupaten Lampung Timur, memastikan setiap data tervalidasi dan pelayanan berjalan efisien.
              </p>

              <div className="space-y-4">
                {[
                  { title: "Terstruktur", desc: "Pembagian peran yang jelas dari Kabupaten hingga Kader Desa." },
                  { title: "Transparan", desc: "Data laporan yang dapat dipertanggungjawabkan dan terpantau." },
                  { title: "Terintegrasi", desc: "Menghubungkan semua Posyandu dalam satu jaringan digital." },
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{feature.title}</h4>
                      <p className="text-sm text-slate-500">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Struktur Kelembagaan</h3>
                  <p className="text-sm text-slate-500">Koordinasi Berjenjang</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-emerald-600 font-semibold uppercase">Tingkat 01</p>
                  <p className="font-bold text-slate-800">Pemerintah Kabupaten</p>
                  <p className="text-sm text-slate-500">Pembina dan Pengambil Kebijakan</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 ml-4">
                  <p className="text-xs text-teal-600 font-semibold uppercase">Tingkat 02</p>
                  <p className="font-bold text-slate-800">Kecamatan & Puskesmas</p>
                  <p className="text-sm text-slate-500">Pengawas dan Fasilitator</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 ml-8">
                  <p className="text-xs text-blue-600 font-semibold uppercase">Tingkat 03</p>
                  <p className="font-bold text-slate-800">Kader Posyandu Desa</p>
                  <p className="text-sm text-slate-500">Pelaksana Operasional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
