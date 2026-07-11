"use client";
 
 import Link from "next/link";
 import { motion } from "framer-motion";
 import { 
   Heart, ArrowLeft, Building, Users, 
   Shield, Award, ChevronRight, BarChart
 } from "lucide-react";
 
 export default function ProfilPage() {
   return (
     <div className="relative min-h-screen bg-white text-slate-800 font-sans antialiased">
       {/* Header */}
       <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-center h-16">
             <Link href="/" className="flex items-center space-x-2 text-slate-600 hover:text-purple-600 transition-colors">
               <ArrowLeft className="w-5 h-5" />
               <span className="text-sm font-medium">Kembali ke Beranda</span>
             </Link>
             <div className="flex items-center space-x-2">
               <Heart className="w-6 h-6 text-purple-500 fill-purple-500/10" />
               <span className="font-bold text-lg text-slate-900">SIPANDU</span>
             </div>
           </div>
         </div>
       </header>
 
       <main className="pt-28 pb-20">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           {/* Hero Section */}
           <div className="text-center mb-16">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="mb-4 inline-flex items-center justify-center space-x-2 bg-purple-50 px-4 py-1.5 rounded-full"
             >
               <Building className="w-4 h-4 text-purple-500" />
               <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Profil & Kelembagaan</span>
             </motion.div>
             <motion.h1
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="text-4xl font-extrabold text-slate-900 mb-4"
             >
               Tata Kelola Kelembagaan
             </motion.h1>
             <motion.p
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="text-lg text-slate-500 max-w-2xl mx-auto font-light"
             >
               Struktur organisasi dan komitmen kami dalam mengelola sistem informasi Posyandu secara profesional dan akuntabel.
             </motion.p>
           </div>
 
           {/* Content Grid */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Left Column: Visi Misi */}
             <div className="lg:col-span-1 space-y-6">
               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                 <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                   <Award className="w-5 h-5" />
                 </div>
                 <h2 className="text-lg font-bold text-slate-900 mb-2">Visi Kami</h2>
                 <p className="text-sm text-slate-600 font-light">
                   Menjadi pusat rujukan data kesehatan keluarga yang andal, cepat, and akurat di tingkat kabupaten.
                 </p>
               </div>
               
               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                 <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                   <Shield className="w-5 h-5" />
                 </div>
                 <h2 className="text-lg font-bold text-slate-900 mb-2">Misi Kami</h2>
                 <ul className="text-sm text-slate-600 font-light space-y-2">
                   <li className="flex items-start gap-2">
                     <ChevronRight className="w-4 h-4 mt-0.5 text-purple-500" />
                     <span>Digitalisasi pencatatan data Posyandu.</span>
                   </li>
                   <li className="flex items-start gap-2">
                     <ChevronRight className="w-4 h-4 mt-0.5 text-purple-500" />
                     <span>Meningkatkan kapasitas kader melalui teknologi.</span>
                   </li>
                   <li className="flex items-start gap-2">
                     <ChevronRight className="w-4 h-4 mt-0.5 text-purple-500" />
                     <span>Menyediakan data real-time untuk pengambil kebijakan.</span>
                   </li>
                 </ul>
               </div>
             </div>
 
             {/* Right Column: Structure (Large) */}
             <div className="lg:col-span-2">
               <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                 <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-purple-500 text-white rounded-xl flex items-center justify-center">
                     <Users className="w-6 h-6" />
                   </div>
                   <div>
                     <h2 className="text-xl font-bold text-slate-900">Struktur Organisasi</h2>
                     <p className="text-sm text-slate-500">Koordinasi Berjenjang Sistem</p>
                   </div>
                 </div>
 
                 <div className="space-y-6 relative">
                   {/* Vertical Line */}
                   <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-100"></div>
 
                   {[
                     {
                       level: "Tingkat 01",
                       role: "Pembina Sistem (Dinas Kesehatan Kabupaten)",
                       desc: "Bertanggung jawab atas regulasi, penyediaan anggaran, dan pengawasan tingkat tinggi sistem.",
                       color: "bg-purple-500"
                     },
                     {
                       level: "Tingkat 02",
                       role: "Koordinator Wilayah (Kecamatan & Puskesmas)",
                       desc: "Memfasilitasi pelatihan kader, verifikasi data desa, dan penyuluhan tingkat lanjut.",
                       color: "bg-indigo-500"
                     },
                     {
                       level: "Tingkat 03",
                       role: "Pelaksana Lapangan (Kader Posyandu Desa)",
                       desc: "Mengumpulkan data real-time dari masyarakat, menginput ke sistem, dan melayani warga langsung.",
                       color: "bg-violet-500"
                     }
                   ].map((item, idx) => (
                     <div key={idx} className="relative flex gap-6 items-start">
                       <div className={`w-12 h-12 rounded-full ${item.color} text-white flex items-center justify-center font-bold text-xs flex-shrink-0 z-10`}>
                         {idx + 1}
                       </div>
                       <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex-grow">
                         <p className="text-xs text-purple-600 font-semibold uppercase">{item.level}</p>
                         <h3 className="font-bold text-slate-900 mt-0.5">{item.role}</h3>
                         <p className="text-sm text-slate-500 mt-1 font-light">{item.desc}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
           </div>
         </div>
       </main>
 
       {/* Footer */}
       <footer className="bg-slate-50 text-slate-500 py-8 border-t border-slate-100 mt-auto">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
           <p>© 2026 Pemkab Lampung Timur. Semua hak cipta dilindungi.</p>
         </div>
       </footer>
     </div>
   );
 }
