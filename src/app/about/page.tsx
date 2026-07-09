"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
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
      <Header />

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
                  <p className="text-lg font-semibold text-slate-900">SIPANDU Lampung Timur</p>
                  <p className="text-sm text-slate-500">Membangun Negeri dari Data Desa</p>
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
