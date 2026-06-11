"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Heart, ArrowRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setIsMenuOpen(false); // Close menu on scroll
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/tujuan", label: "Tujuan" },
    { href: "/layanan", label: "Layanan" },
    { href: "/kelembagaan", label: "Tentang" },
    { href: "/panduan", label: "Panduan" },
  ];

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 flex justify-center ${
        isScrolled ? "pt-2" : "pt-4"
      }`}
    >
      <div
        className={`w-[calc(100%-2rem)] max-w-7xl flex items-center justify-between transition-all duration-500 rounded-full border box-border relative ${
          isScrolled
            ? "bg-white/90 backdrop-blur-2xl border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] h-14 px-4 lg:px-6"
            : "bg-black/20 backdrop-blur-2xl border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.2)] h-16 px-4 lg:px-8"
        }`}
      >
        <div className="flex items-center space-x-2">
          <Image src="/images/logo/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
          <span className={`font-bold text-xl transition-colors ${isScrolled ? "text-slate-900" : "text-white"}`}>
            SIP
          </span>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-6">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all ${
                  isActive
                    ? isScrolled
                      ? "text-emerald-700 drop-shadow-[0_0_5px_rgba(5,150,105,0.5)] font-bold"
                      : "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] font-bold"
                    : isScrolled
                    ? "text-slate-600 hover:text-emerald-700 hover:drop-shadow-[0_0_5px_rgba(5,150,105,0.5)]"
                    : "text-white/80 hover:text-white hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Button */}
        <div className="hidden md:block">
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

        {/* Burger Button (Mobile) */}
        <button
          className={`md:hidden p-2 rounded-full focus:outline-none transition-colors ${
            isScrolled ? "text-slate-900" : "text-white"
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu (Apple Card Style) - Moved outside inner div */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`absolute ${isScrolled ? "top-[64px]" : "top-[80px]"} left-4 right-4 bg-white/80 rounded-3xl border border-white/50 shadow-[0_15px_35px_rgba(0,0,0,0.1)] p-6 z-50 md:hidden flex flex-col space-y-4`}
            style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
          >
            <nav className="flex flex-col space-y-2">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-sm font-medium p-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-white/20 pt-4">
              <Link
                href={session ? "/dashboard" : "/login"}
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex items-center justify-center w-full px-5 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-900/10 gap-2"
              >
                {session ? "Masuk Dashboard" : "Masuk"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
