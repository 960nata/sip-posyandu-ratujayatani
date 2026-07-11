"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

export type LegalSection = {
  title: string;
  paras: string[];
  bullets?: string[];
};

export default function LegalPage({
  badge,
  title,
  subtitle,
  updated,
  sections,
}: {
  badge: string;
  title: string;
  subtitle: string;
  updated: string;
  sections: LegalSection[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="relative min-h-screen flex flex-col bg-white text-slate-800 font-sans antialiased">
      <Header />

      {/* Hero */}
      <section className="relative pt-36 pb-16 bg-[#25103c] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-32 -left-24 w-[450px] h-[450px] rounded-full bg-purple-600/20 blur-[120px]" />
          <div className="absolute -bottom-40 right-[-120px] w-[500px] h-[500px] rounded-full bg-indigo-500/15 blur-[130px]" />
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-purple-300 mb-4 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            {badge}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-6xl font-extrabold text-white tracking-tight mb-6"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-purple-100/70 text-base md:text-lg font-normal leading-relaxed max-w-4xl mx-auto mb-4"
          >
            {subtitle}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xs text-purple-200/50"
          >
            Terakhir diperbarui: {updated}
          </motion.p>
        </div>
      </section>

      {/* Accordion */}
      <section className="py-16 bg-white flex-1">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {sections.map((section, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
                className={`rounded-[10px] border transition-all duration-300 ${
                  isOpen
                    ? "border-purple-200 bg-purple-50/40 shadow-lg shadow-purple-100/60"
                    : "border-slate-200 bg-white hover:border-purple-200 hover:shadow-md hover:shadow-slate-100"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 text-left cursor-pointer"
                >
                  <span
                    className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-xs font-black shrink-0 transition-colors duration-300 ${
                      isOpen ? "bg-purple-600 text-white" : "bg-purple-50 text-purple-700"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-bold text-sm sm:text-base text-slate-900 leading-snug">
                    {section.title}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`shrink-0 transition-colors duration-300 ${isOpen ? "text-purple-600" : "text-slate-400"}`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-5 sm:pb-6 sm:pl-[76px] space-y-3">
                        {section.paras.map((p, j) => (
                          <p key={j} className="text-sm text-slate-500 leading-relaxed">
                            {p}
                          </p>
                        ))}
                        {section.bullets && (
                          <ul className="space-y-2 pt-1">
                            {section.bullets.map((b, j) => (
                              <li key={j} className="flex items-start gap-2.5 text-sm text-slate-500 leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-[7px] shrink-0" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {/* Contact card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-10 rounded-[10px] bg-gradient-to-br from-purple-600 to-indigo-700 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-purple-200"
          >
            <div>
              <h3 className="font-extrabold text-lg mb-1">Ada pertanyaan?</h3>
              <p className="text-sm text-purple-100/90">
                Hubungi tim SIPANDU jika Anda membutuhkan penjelasan lebih lanjut mengenai halaman ini.
              </p>
            </div>
            <a
              href="mailto:info@sipandu-lamtim.id"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-purple-700 text-sm font-semibold rounded-full hover:bg-purple-50 transition-colors shrink-0"
            >
              <Mail className="w-4 h-4" />
              Hubungi Kami
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
