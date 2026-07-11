import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 mt-auto relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-purple-600/10 blur-[110px]" />
        <div className="absolute -bottom-40 right-[-120px] w-[480px] h-[480px] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-14">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-flex items-center space-x-2 mb-5 group">
              <Image src="/images/logo/logo.png" alt="Logo SIPANDU" width={36} height={36} className="object-contain" />
              <span className="font-bold text-xl text-white group-hover:text-purple-300 transition-colors">
                SIPANDU
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-6">
              Sistem Informasi Posyandu Kabupaten Lampung Timur. Mewujudkan tata kelola data yang baik untuk pelayanan publik yang prima.
            </p>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Sukadana, Kabupaten Lampung Timur, Lampung</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <a href="mailto:info@sipandu-lamtim.id" className="hover:text-purple-400 transition-colors">
                  info@sipandu-lamtim.id
                </a>
              </li>
            </ul>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navigasi</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm hover:text-purple-400 transition-colors">Home</Link></li>
              <li><Link href="/tujuan" className="text-sm hover:text-purple-400 transition-colors">Tujuan</Link></li>
              <li><Link href="/layanan" className="text-sm hover:text-purple-400 transition-colors">Layanan</Link></li>
              <li><Link href="/kelembagaan" className="text-sm hover:text-purple-400 transition-colors">Tentang</Link></li>
              <li><Link href="/panduan" className="text-sm hover:text-purple-400 transition-colors">Panduan</Link></li>
            </ul>
          </div>

          {/* Tautan Terkait */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Tautan Terkait</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm hover:text-purple-400 transition-colors inline-flex items-center gap-1 group">
                  Pemkab Lampung Timur
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-purple-400 transition-colors inline-flex items-center gap-1 group">
                  Dinas Kesehatan
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-purple-400 transition-colors inline-flex items-center gap-1 group">
                  Kominfo Lamtim
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/kebijakan-privasi" className="text-sm hover:text-purple-400 transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/syarat-ketentuan" className="text-sm hover:text-purple-400 transition-colors">Syarat &amp; Ketentuan</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">© 2026 Pemkab Lampung Timur. All rights reserved.</p>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
            <Link href="/kebijakan-privasi" className="text-xs text-slate-600 hover:text-purple-400 transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/syarat-ketentuan" className="text-xs text-slate-600 hover:text-purple-400 transition-colors">
              Syarat &amp; Ketentuan
            </Link>
            <Link href="/credits" className="text-xs text-slate-600 hover:text-purple-400 transition-colors">
              Powered by Hadinata.dev
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
