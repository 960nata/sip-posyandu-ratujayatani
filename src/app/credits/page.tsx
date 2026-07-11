"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function CreditsPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-white text-slate-800 font-sans antialiased">
      <Header />

      <main className="min-h-[calc(100vh-130px)] flex items-center justify-center pt-28 pb-16 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/hero2.avif"
            alt="Beach Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div> {/* Dark overlay for better contrast */}
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 inline-flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30"
            >
              <Sparkles className="w-4 h-4 text-purple-300 fill-purple-300" />
              <span className="text-xs font-semibold text-white uppercase tracking-wide">
                Powered By
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Tim Pengembang
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/80 font-light text-sm"
            >
              Aplikasi ini dikembangkan dan didukung oleh para profesional hebat.
            </motion.p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            {/* Hadinata.dev */}
            <motion.a
              href="https://hadinata.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg flex flex-col items-center text-center hover:bg-white/20 transition-all hover:border-purple-300/50 max-w-sm w-full group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center overflow-hidden mb-4 border border-white/10">
                <Image
                  src="/images/logo vendor/Logo (1).avif"
                  alt="Hadinata.dev"
                  width={80}
                  height={80}
                  className="object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-1">
                Hadinata.dev
              </h3>
              <p className="text-xs text-purple-300 font-semibold mb-2">Individu / Developer</p>
              <p className="text-sm text-white/70 font-light leading-relaxed">
                Pengembangan sistem inti dan arsitektur aplikasi Sistem Informasi Posyandu.
              </p>
            </motion.a>

            {/* Vortalabs.com */}
            <motion.a
              href="https://vortalabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg flex flex-col items-center text-center hover:bg-white/20 transition-all hover:border-purple-300/50 max-w-sm w-full group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center overflow-hidden mb-4 border border-white/10">
                <Image
                  src="/images/logo vendor/logo-vorta.webp"
                  alt="Vortalabs.com"
                  width={80}
                  height={80}
                  className="object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-1">
                vortalabs.com
              </h3>
              <p className="text-xs text-purple-300 font-semibold mb-2">Agency / Team</p>
              <p className="text-sm text-white/70 font-light leading-relaxed">
                Desain UI/UX dan optimalisasi performa untuk pengalaman pengguna yang premium.
              </p>
            </motion.a>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
