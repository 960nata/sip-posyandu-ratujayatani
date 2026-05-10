"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Heart, ArrowRight, Building, Users, Shield } from "lucide-react";

export default function AboutPage() {
  const [isScrolled, setIsScrolled] = useState(false);
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
            <Link href="/" className={`text-sm font-medium transition-colors ${isScrolled ? "text-slate-600 hover:text-emerald-500" : "text-white/80 hover:text-white"}`}>Beranda</Link>
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
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900 to-slate-900 opacity-90 z-0"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6"
          >
            Tentang SIP
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-slate-300 max-w-2xl mx-auto font-light"
          >
            Sistem Informasi Posyandu Kabupaten Lampung Timur.
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Tata Kelola</h2>
              <p className="text-3xl font-bold text-slate-900 mt-2 mb-6">Kelembagaan yang Kuat & Transparan</p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                SIP bukan sekadar aplikasi, melainkan sebuah ekosistem tata kelola data yang melibatkan berbagai tingkatan kelembagaan di Kabupaten Lampung Timur. Mulai dari pimpinan daerah hingga kader di tingkat desa, semua terhubung dalam satu rantai data yang valid.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Building, title: "Tingkat Kabupaten", desc: "Sebagai pusat kendali dan pengambil kebijakan berdasarkan data yang masuk." },
                  { icon: Users, title: "Tingkat Kecamatan & Desa", desc: "Berperan dalam verifikasi dan validasi data riil di lapangan." },
                  { icon: Shield, title: "Kader Lapangan", desc: "Ujung tombak pengumpulan data langsung dari masyarakat." },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{item.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-emerald-100 to-teal-50 rounded-3xl overflow-hidden flex items-center justify-center p-8">
                <div className="text-center">
                  <Heart className="w-24 h-24 text-emerald-500 fill-emerald-500/10 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-slate-900">SIP Lampung Timur</p>
                  <p className="text-sm text-slate-500">Membangun Negeri dari Data Desa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-slate-900 text-white text-center text-sm">
        <p>&copy; 2026 SIP Lampung Timur. All rights reserved.</p>
      </footer>
    </div>
  );
}
