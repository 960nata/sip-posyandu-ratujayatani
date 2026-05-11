"use client";
 
 import Link from "next/link";
 import { motion } from "framer-motion";
 import Footer from "../../components/Footer";
 import { 
   Heart, ArrowLeft, Baby, Syringe, 
   ClipboardList, Activity, Star, ChevronRight
 } from "lucide-react";
 
 export default function LayananPage() {
   const services = [
     {
       icon: Baby,
       title: "Kesehatan Anak & Balita",
       desc: "Pelayanan pemantauan pertumbuhan dan perkembangan anak secara berkala untuk mencegah stunting dan masalah gizi lainnya.",
       details: [
         "Penimbangan berat badan dan pengukuran tinggi badan.",
         "Deteksi dini tumbuh kembang anak.",
         "Pemberian Vitamin A dan obat cacing.",
         "Konseling gizi bagi ibu dan balita."
       ],
       color: "text-rose-500 bg-rose-50",
       borderColor: "border-rose-100"
     },
     {
       icon: Heart,
       title: "Kesehatan Ibu Hamil & Menyusui",
       desc: "Pendampingan dan pemeriksaan kesehatan bagi ibu hamil dan menyusui untuk memastikan kesehatan ibu dan janin.",
       details: [
         "Pemeriksaan kehamilan (ANC) berkala.",
         "Pemberian tablet tambah darah (Fe).",
         "Edukasi IMD (Inisiasi Menyusu Dini) dan ASI Eksklusif.",
         "Perawatan pasca persalinan."
       ],
       color: "text-pink-500 bg-pink-50",
       borderColor: "border-pink-100"
     },
     {
       icon: Syringe,
       title: "Program Imunisasi",
       desc: "Pemberian imunisasi dasar lengkap untuk bayi dan anak balita guna memberikan kekebalan terhadap penyakit berbahaya.",
       details: [
         "Imunisasi BCG, Polio, DPT-HB-Hib.",
         "Imunisasi Campak/MR.",
         "Edukasi KIPI (Kejadian Ikutan Pasca Imunisasi).",
         "Pencatatan buku KIA."
       ],
       color: "text-blue-500 bg-blue-50",
       borderColor: "border-blue-100"
     },
     {
       icon: ClipboardList,
       title: "Keluarga Berencana (KB)",
       desc: "Pelayanan konseling dan penyediaan sarana kontrasepsi untuk mengatur jarak kehamilan dan kesejahteraan keluarga.",
       details: [
         "Konseling metode kontrasepsi.",
         "Pelayanan pil KB dan kondom.",
         "Rujukan untuk metode jangka panjang (IUD/Implan).",
         "Penyuluhan kesehatan reproduksi."
       ],
       color: "text-amber-500 bg-amber-50",
       borderColor: "border-amber-100"
     }
   ];
 
   return (
     <div className="relative min-h-screen bg-white text-slate-800 font-sans antialiased">
       {/* Header */}
       <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-center h-16">
             <Link href="/" className="flex items-center space-x-2 text-slate-600 hover:text-emerald-600 transition-colors">
               <ArrowLeft className="w-5 h-5" />
               <span className="text-sm font-medium">Kembali ke Beranda</span>
             </Link>
             <div className="flex items-center space-x-2">
               <Heart className="w-6 h-6 text-emerald-500 fill-emerald-500/10" />
               <span className="font-bold text-lg text-slate-900">SIP</span>
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
               className="mb-4 inline-flex items-center justify-center space-x-2 bg-emerald-50 px-4 py-1.5 rounded-full"
             >
               <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
               <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Panduan Layanan</span>
             </motion.div>
             <motion.h1
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="text-4xl font-extrabold text-slate-900 mb-4"
             >
               Layanan Komprehensif Posyandu
             </motion.h1>
             <motion.p
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="text-lg text-slate-500 max-w-2xl mx-auto font-light"
             >
               Kami menghadirkan berbagai program kesehatan terpadu untuk mendukung tumbuh kembang anak dan kesehatan keluarga di Lampung Timur.
             </motion.p>
           </div>
 
           {/* Services Grid */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {services.map((service, index) => (
               <motion.div
                 key={index}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 * index }}
                 className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6"
               >
                 <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                   <service.icon className="w-7 h-7" />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                   <p className="text-sm text-slate-500 mb-4 font-light">{service.desc}</p>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                     {service.details.map((detail, idx) => (
                       <div key={idx} className="flex items-start gap-2">
                         <div className="w-5 h-5 mt-0.5 text-emerald-500 flex-shrink-0">
                           <ChevronRight className="w-4 h-4" />
                         </div>
                         <span className="text-xs text-slate-600">{detail}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               </motion.div>
             ))}
           </div>
         </div>
       </main>
 
       <Footer />
     </div>
   );
 }
