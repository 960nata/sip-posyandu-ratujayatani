"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Heart, ArrowRight, Shield, Activity, Users } from "lucide-react";

export default function TujuanPage() {
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
        className={`fixed top-0 left-0 w-screen z-50 transition-all duration-500 flex justify-center ${
          isScrolled ? "pt-2" : "pt-4"
        }`}
      >
        <div className={`w-[calc(100vw-2rem)] max-w-7xl flex items-center justify-between transition-all duration-500 rounded-full border box-border ${
          isScrolled 
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
            className={`inline-flex items-center justify-center px-5 py-2 rounded-full text-[12px] font-bold tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 gap-2 ${
              isScrolled 
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
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-slate-900 opacity-90 z-0"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6"
          >
            Tujuan Sistem SIP
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-slate-300 max-w-2xl mx-auto font-light"
          >
            Mewujudkan tata kelola data yang terintegrasi untuk mendukung pengambilan keputusan yang cepat dan tepat di Kabupaten Lampung Timur.
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                icon: Users, 
                title: "Integrasi Data", 
                desc: "Menghubungkan data dari berbagai sektor seperti Kesehatan, Pendidikan, dan Infrastruktur untuk memberikan visualisasi yang menyeluruh bagi pemerintah daerah.",
                color: "text-emerald-500 bg-emerald-50"
              },
              { 
                icon: Activity, 
                title: "Efisiensi Pelayanan", 
                desc: "Mempercepat proses pelaporan dari tingkat desa ke kabupaten, memungkinkan tindak lanjut yang lebih cepat terhadap masalah di lapangan.",
                color: "text-blue-500 bg-blue-50"
              },
              { 
                icon: Shield, 
                title: "Transparansi", 
                desc: "Menyediakan data yang akurat, valid, dan dapat dipertanggungjawabkan untuk memastikan bantuan dan program tepat sasaran.",
                color: "text-amber-500 bg-amber-50"
              },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 bg-emerald-50 p-8 rounded-2xl border border-emerald-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Visi & Misi Data</h2>
            <p className="text-slate-700 mb-4">
              SIP dibangun dengan visi untuk menjadikan Lampung Timur sebagai kabupaten yang berbasis data (*data-driven*) dalam setiap kebijakan publik.
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li>Meningkatkan akurasi data kemiskinan dan kesehatan.</li>
              <li>Memudahkan monitoring program pembangunan fisik dan non-fisik.</li>
              <li>Mendorong partisipasi aktif kader desa dalam pelaporan data.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
