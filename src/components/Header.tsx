"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Heart, ArrowRight } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      className={`fixed top-0 left-0 w-screen z-50 transition-all duration-500 flex justify-center ${
        isScrolled ? "pt-2" : "pt-4"
      }`}
    >
      <div
        className={`w-[calc(100vw-2rem)] max-w-7xl flex items-center justify-between transition-all duration-500 rounded-full border box-border ${
          isScrolled
            ? "bg-white/90 backdrop-blur-2xl border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] h-14 px-4 lg:px-6"
            : "bg-black/20 backdrop-blur-2xl border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.2)] h-16 px-4 lg:px-8"
        }`}
      >
        <div className="flex items-center space-x-2">
          <Heart className="w-8 h-8 text-emerald-500 fill-emerald-500/10" />
          <span className={`font-bold text-xl transition-colors ${isScrolled ? "text-slate-900" : "text-white"}`}>
            SIP
          </span>
        </div>

        {/* Navigation Links */}
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
  );
}
