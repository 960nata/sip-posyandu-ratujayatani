import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 mt-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-6 h-6 text-emerald-500 fill-emerald-500/10" />
              <span className="font-bold text-lg text-white">SIP</span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm">
              Sistem Informasi Posyandu Kabupaten Lampung Timur. Mewujudkan tata kelola data yang baik untuk pelayanan publik yang prima.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navigasi</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm hover:text-emerald-500 transition-colors">Home</Link></li>
              <li><Link href="/tujuan" className="text-sm hover:text-emerald-500 transition-colors">Tujuan</Link></li>
              <li><Link href="/layanan" className="text-sm hover:text-emerald-500 transition-colors">Layanan</Link></li>
              <li><Link href="/kelembagaan" className="text-sm hover:text-emerald-500 transition-colors">Tentang</Link></li>
              <li><Link href="/panduan" className="text-sm hover:text-emerald-500 transition-colors">Panduan</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Tautan Terkait</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm hover:text-emerald-500 transition-colors">Pemkab Lampung Timur</a></li>
              <li><a href="#" className="text-sm hover:text-emerald-500 transition-colors">Dinas Kesehatan</a></li>
              <li><a href="#" className="text-sm hover:text-emerald-500 transition-colors">Kominfo Lamtim</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-xs text-slate-600">© 2026 Pemkab Lampung Timur. All rights reserved.</p>
           <div className="flex space-x-6 items-center">
              <Link href="/credits" className="text-xs text-slate-600 hover:text-emerald-500 transition-colors">
                Powered by Hadinata.dev
              </Link>
           </div>
        </div>

        </div>
    </footer>
  );
}
