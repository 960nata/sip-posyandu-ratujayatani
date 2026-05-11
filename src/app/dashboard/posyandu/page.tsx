'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, Download, Users, Building, 
  Home, BookOpen, Shield, HeartPulse 
} from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'
import ExcelJS from 'exceljs'
import { useSession } from 'next-auth/react'

// Dummy stats
const stats = [
  { name: 'Pendidikan', total: 120, completed: 95, icon: BookOpen, color: 'text-blue-500' },
  { name: 'Pekerjaan Umum', total: 85, completed: 60, icon: Building, color: 'text-amber-500' },
  { name: 'Perumahan', total: 45, completed: 40, icon: Home, color: 'text-emerald-500' },
  { name: 'Sosial', total: 210, completed: 180, icon: Users, color: 'text-violet-500' },
  { name: 'Trantib', total: 30, completed: 25, icon: Shield, color: 'text-rose-500' },
  { name: 'SIP 6', total: 150, completed: 120, icon: HeartPulse, color: 'text-pink-500' },
  { name: 'SIP 7', total: 200, completed: 180, icon: HeartPulse, color: 'text-rose-500' },
]

const chartData = [
  { name: 'Pendidikan', Total: 120, Selesai: 95 },
  { name: 'Pekerjaan Umum', Total: 85, Selesai: 60 },
  { name: 'Perumahan', Total: 45, Selesai: 40 },
  { name: 'Sosial', Total: 210, Selesai: 180 },
  { name: 'Trantib', Total: 30, Selesai: 25 },
  { name: 'SIP 6', Total: 150, Selesai: 120 },
  { name: 'SIP 7', Total: 200, Selesai: 180 },
]

export default function AnalisaDataPage() {
  const { data: session } = useSession()
  const isPosyandu = (session?.user as any)?.role === 'OPERATOR_POSYANDU'

  const theme = {
    bgGradient: isPosyandu ? 'from-purple-500 to-indigo-600' : 'from-emerald-500 to-teal-600',
    hoverGradient: isPosyandu ? 'hover:from-purple-600 hover:to-indigo-700' : 'hover:from-emerald-600 hover:to-teal-700',
    shadow: isPosyandu ? 'shadow-purple-500/20' : 'shadow-emerald-500/20',
    focusBorder: isPosyandu ? 'focus:border-purple-500' : 'focus:border-emerald-500',
    focusRing: isPosyandu ? 'focus:ring-purple-500/10' : 'focus:ring-emerald-500/10',
    text: isPosyandu ? 'text-purple-600' : 'text-emerald-600',
    bgLight: isPosyandu ? 'bg-purple-50' : 'bg-emerald-50',
    textLight: isPosyandu ? 'text-purple-700' : 'text-emerald-700',
    activeRing: isPosyandu ? 'focus:ring-purple-500' : 'focus:ring-emerald-500',
    bgSolid: isPosyandu ? 'bg-purple-500' : 'bg-emerald-500',
    hoverSolid: isPosyandu ? 'hover:bg-purple-600' : 'hover:bg-emerald-600',
    borderLight: isPosyandu ? 'border-purple-200' : 'border-emerald-200',
    hoverLight: isPosyandu ? 'hover:bg-purple-50' : 'hover:bg-emerald-50',
    shadowSolid: isPosyandu ? 'shadow-purple-500/20' : 'shadow-emerald-500/20',
    textDark: isPosyandu ? 'dark:text-purple-400' : 'dark:text-emerald-400',
    bgDarkLight: isPosyandu ? 'dark:bg-purple-900/30' : 'dark:bg-emerald-900/30',
    focusRingSolid: isPosyandu ? 'focus:ring-purple-500' : 'focus:ring-emerald-500',
    chartColor: isPosyandu ? '#8b5cf6' : '#10b981', // Purple vs Emerald
  }

  const [isExporting, setIsExporting] = useState(false)

  const handleExportExcel = async () => {
    setIsExporting(true)
    
    try {
      const workbook = new ExcelJS.Workbook();
      
      // Helper function to style headers
      const styleHeader = (cell: any, bgColor: string) => {
        cell.font = { bold: true, color: { argb: 'FFFFFF' }, name: 'Calibri', size: 11 };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: bgColor }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFFFFF' } },
          left: { style: 'thin', color: { argb: 'FFFFFF' } },
          bottom: { style: 'thin', color: { argb: 'FFFFFF' } },
          right: { style: 'thin', color: { argb: 'FFFFFF' } }
        };
      };

      const styleDataCell = (cell: any) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'CBD5E1' } },
          left: { style: 'thin', color: { argb: 'CBD5E1' } },
          bottom: { style: 'thin', color: { argb: 'CBD5E1' } },
          right: { style: 'thin', color: { argb: 'CBD5E1' } }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      };

      // 1. Sheet Pendidikan
      const sheetPend = workbook.addWorksheet('Pendidikan');
      sheetPend.addRow(['DATA PENDIDIKAN']).font = { bold: true, size: 14 };
      sheetPend.addRow([]);
      const pendHeaders = ['No', 'Tanggal', 'NIK', 'Nama', 'Alamat', 'Hal', 'Status'];
      sheetPend.addRow(pendHeaders);
      const dataPendidikan = [
        [1, '2025-06-16', '3217064006750012', 'Yanti Nurhayati', 'RT 10/25', 'Pengajuan KIP', 'TL'],
        [2, '2025-06-18', '3217064006750013', 'Budi Santoso', 'RT 11/25', 'Kekurangan buku paket', 'BTL'],
      ];
      dataPendidikan.forEach(r => sheetPend.addRow(r));
      
      // Style Pendidikan
      sheetPend.getRow(3).eachCell(cell => styleHeader(cell, '10B981')); // Emerald
      sheetPend.eachRow((row, rowNumber) => {
        if (rowNumber > 3) row.eachCell(cell => styleDataCell(cell));
      });
      sheetPend.columns.forEach(col => col.width = 15);

      // 2. Sheet Pekerjaan Umum
      const sheetPU = workbook.addWorksheet('Pekerjaan Umum');
      sheetPU.addRow(['DATA PEKERJAAN UMUM']).font = { bold: true, size: 14 };
      sheetPU.addRow([]);
      sheetPU.addRow(['No', 'Tanggal', 'Lokasi', 'Hal', 'Status']);
      const dataPU = [
        [1, '2025-06-17', 'Jl. Merdeka', 'Jalan Berlubang parah', 'BTL'],
        [2, '2025-06-19', 'Jembatan Adirejo', 'Pondasi jembatan retak', 'TL'],
      ];
      dataPU.forEach(r => sheetPU.addRow(r));
      sheetPU.getRow(3).eachCell(cell => styleHeader(cell, 'F59E0B')); // Amber
      sheetPU.eachRow((row, rowNumber) => {
        if (rowNumber > 3) row.eachCell(cell => styleDataCell(cell));
      });
      sheetPU.columns.forEach(col => col.width = 15);

      // 3. Sheet Perumahan
      const sheetPerumahan = workbook.addWorksheet('Perumahan');
      sheetPerumahan.addRow(['DATA PERUMAHAN']).font = { bold: true, size: 14 };
      sheetPerumahan.addRow([]);
      sheetPerumahan.addRow(['No', 'Tanggal', 'Nama', 'Hal', 'Status']);
      const dataPerumahan = [
        [1, '2025-06-20', 'Siti Aminah', 'Atap rumah rubuh karena angin', 'TL'],
      ];
      dataPerumahan.forEach(r => sheetPerumahan.addRow(r));
      sheetPerumahan.getRow(3).eachCell(cell => styleHeader(cell, '06B6D4')); // Cyan
      sheetPerumahan.eachRow((row, rowNumber) => {
        if (rowNumber > 3) row.eachCell(cell => styleDataCell(cell));
      });
      sheetPerumahan.columns.forEach(col => col.width = 15);

      // 4. Sheet Sosial
      const sheetSosial = workbook.addWorksheet('Sosial');
      sheetSosial.addRow(['DATA SOSIAL']).font = { bold: true, size: 14 };
      sheetSosial.addRow([]);
      sheetSosial.addRow(['No', 'Tanggal', 'NIK', 'Nama', 'Hal', 'Tanggapan', 'Status']);
      const dataSosial = [
        [1, '2025-07-20', '3217060812490003', 'SAFEI', 'PENGAJUAN KIS', 'Langsung diproses', 'SELESAI'],
      ];
      dataSosial.forEach(r => sheetSosial.addRow(r));
      sheetSosial.getRow(3).eachCell(cell => styleHeader(cell, '8B5CF6')); // Violet
      sheetSosial.eachRow((row, rowNumber) => {
        if (rowNumber > 3) row.eachCell(cell => styleDataCell(cell));
      });
      sheetSosial.columns.forEach(col => col.width = 15);

      // 5. Sheet Trantib
      const sheetTrantib = workbook.addWorksheet('Trantib');
      sheetTrantib.addRow(['DATA TRANTIB']).font = { bold: true, size: 14 };
      sheetTrantib.addRow([]);
      sheetTrantib.addRow(['No', 'Tanggal', 'Pelapor', 'Hal', 'Status']);
      const dataTrantib = [
        [1, '2025-05-01', 'Budi Mulyono', 'Laporan poskamling kurang aktif', 'BTL'],
      ];
      dataTrantib.forEach(r => sheetTrantib.addRow(r));
      sheetTrantib.getRow(3).eachCell(cell => styleHeader(cell, 'EF4444')); // Red
      sheetTrantib.eachRow((row, rowNumber) => {
        if (rowNumber > 3) row.eachCell(cell => styleDataCell(cell));
      });
      sheetTrantib.columns.forEach(col => col.width = 15);

      // 6. Sheet SIP 6
      const sheetSIP6 = workbook.addWorksheet('SIP 6');
      sheetSIP6.addRow(['DATA PENGUNJUNG (SIP 6)']).font = { bold: true, size: 14 };
      sheetSIP6.addRow([]);
      sheetSIP6.addRow(['DESA : ADIJAYA']).font = { bold: true };
      
      // Headers
      const sip6Headers = [
        ['NO', 'BULAN', 'JUMLAH PENGUNJUNG', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'JUMLAH PETUGAS YG HADIR', '', '', '', '', 'JUMLAH BAYI', '', '', '', 'KET'],
        ['', '', 'B A L I T A', '', '', '', '', '', 'ANAK USIA 6-18 TAHUN', '', '', '', 'USIA PRODUKTIF', '', '', '', 'LANSIA', '', '', '', 'WUS', 'IBU', '', '', '', '', '', 'KADER', 'PLKB', '', 'MEDIS DAN PARA MEDIS', '', 'YANG LAHIR', '', 'MENINGGAL', '', ''],
        ['', '', 'BAYI 0 - 12 BULAN', '', '', '', 'BALITA 1-5 TAHUN', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'PUS', 'HAMIL', 'MENYUSUI', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['', '', 'BARU', '', 'LAMA', '', 'BARU', '', 'LAMA', '', 'BARU', '', 'LAMA', '', 'BARU', '', 'LAMA', '', 'BARU', '', 'LAMA', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['', '', 'L', 'P', 'L', 'P', 'L', 'P', 'L', 'P', 'L', 'P', 'L', 'P', 'L', 'P', 'L', 'P', 'L', 'P', 'L', 'P', '', '', '', '', '', '', '', '', 'L', 'P', 'L', 'P', 'L', 'P', ''],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37]
      ];
      
      sip6Headers.forEach(h => sheetSIP6.addRow(h));
      
      // Data
      const dataSIP6 = [
        [1, 'JANUARI', 0, 1, 22, 25, 0, 1, 63, 62, 0, 0, 1, 0, 0, 0, 85, 87, 2, 1, 125, 121, 172, 170, 15, 79, '', 57, 1, '', 1, 3, 0, 1, 0, 0, ''],
        [2, 'FEBRUARI', 0, 0, 20, 20, 0, 0, 60, 59, 0, 0, 0, 1, 0, 0, 80, 79, 1, 0, 120, 180, 159, 155, 18, 80, '', 57, 1, '', 1, 3, 0, 0, 0, 0, ''],
        [3, 'MARET', 0, 1, 20, 18, 1, 0, 61, 59, 0, 0, 1, 0, 0, 0, 81, 77, 1, 1, 125, 99, 158, 154, 20, 78, '', 57, 1, '', 1, 3, 0, 1, 0, 0, ''],
        [4, 'APRIL', 0, 2, 15, 15, 0, 1, 63, 60, 0, 0, 0, 1, 0, 0, 78, 75, 1, 0, 120, 101, 153, 150, 25, 83, '', 57, 1, '', 1, 3, 1, 2, 0, 0, '']
      ];
      
      dataSIP6.forEach(r => sheetSIP6.addRow(r));
      
      // Merges
      sheetSIP6.mergeCells('A4:A8'); // NO
      sheetSIP6.mergeCells('B4:B8'); // BULAN
      sheetSIP6.mergeCells('C4:AA4'); // JUMLAH PENGUNJUNG
      sheetSIP6.mergeCells('AB4:AF4'); // JUMLAH PETUGAS YG HADIR
      sheetSIP6.mergeCells('AG4:AJ4'); // JUMLAH BAYI
      sheetSIP6.mergeCells('AK4:AK8'); // KET

      // Style SIP 6 Headers
      [4, 5, 6, 7, 8].forEach(r => {
        sheetSIP6.getRow(r).eachCell(cell => styleHeader(cell, 'EC4899')); // Pink
      });
      
      // Style Row 9 (Numbers)
      sheetSIP6.getRow(9).eachCell(cell => {
        styleHeader(cell, 'E2E8F0');
        cell.font = { bold: true, color: { argb: '334155' } };
      });

      // Style Data
      sheetSIP6.eachRow((row, rowNumber) => {
        if (rowNumber > 9) row.eachCell(cell => styleDataCell(cell));
      });

      sheetSIP6.columns.forEach(col => col.width = 6);
      sheetSIP6.getColumn(1).width = 5;
      sheetSIP6.getColumn(2).width = 12;

      // Other Tables in SIP 6
      sheetSIP6.addRow([]);
      sheetSIP6.addRow([]);
      sheetSIP6.addRow(['DATA SASARAN KUNJUNGAN']).font = { bold: true, size: 12 };
      sheetSIP6.addRow(['DESA : ADIJAYA']);
      sheetSIP6.addRow(['TAHUN : 2025']);
      sheetSIP6.addRow([]);

      // Data Sasaran Ibu Hamil
      const startRowIbu = sheetSIP6.rowCount + 1;
      sheetSIP6.addRow(['DATA SASARAN IBU HAMIL/NIFAS/MENYUSUI']).font = { bold: true };
      sheetSIP6.addRow(['NO', 'SASARAN IBU HAMIL/MENYUSUI', '', '', 'JUMLAH KUNJUNGAN DAN JUMLAH SASARAN IBU HAMIL/NIFAS/MENYUSUI']);
      sheetSIP6.addRow(['', 'NAMA IBU', 'NAMA SUAMI', 'NAMA BAYI', 'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES']);
      sheetSIP6.addRow([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
      
      // Dummy data for Ibu Hamil
      for(let i=1; i<=5; i++) {
        sheetSIP6.addRow([i, `Ibu ${i}`, `Suami ${i}`, `Bayi ${i}`, '', '', '', '', '', '', '', '', '', '', '', '']);
      }

      sheetSIP6.mergeCells(`B${startRowIbu+1}:D${startRowIbu+1}`);
      sheetSIP6.mergeCells(`E${startRowIbu+1}:P${startRowIbu+1}`);
      
      // Style Ibu Hamil Headers
      [startRowIbu+1, startRowIbu+2].forEach(r => {
        sheetSIP6.getRow(r).eachCell(cell => styleHeader(cell, 'EC4899'));
      });

      // Data Sasaran Bayi
      sheetSIP6.addRow([]);
      const startRowBayi = sheetSIP6.rowCount + 1;
      sheetSIP6.addRow(['DATA SASARAN BAYI/ BALITA/APRAS']).font = { bold: true };
      sheetSIP6.addRow(['NO', 'NAMA BAYI/BALITA', 'JENIS KELAMIN', 'TANGGAL LAHIR', 'NAMA', '', 'JUMLAH KUNJUNGAN DAN JUMLAH SASARAN BAYI/BALITA/APRAS']);
      sheetSIP6.addRow(['', '', '', '', 'IBU', 'AYAH', 'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES']);
      sheetSIP6.addRow([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
      
      // Dummy data for Bayi
      for(let i=1; i<=5; i++) {
        sheetSIP6.addRow([i, `Bayi ${i}`, i%2===0?'L':'P', '2025-01-01', `Ibu ${i}`, `Ayah ${i}`, '', '', '', '', '', '', '', '', '', '', '', '']);
      }

      sheetSIP6.mergeCells(`E${startRowBayi+1}:F${startRowBayi+1}`);
      sheetSIP6.mergeCells(`G${startRowBayi+1}:R${startRowBayi+1}`);
      
      // Style Bayi Headers
      [startRowBayi+1, startRowBayi+2].forEach(r => {
        sheetSIP6.getRow(r).eachCell(cell => styleHeader(cell, 'EC4899'));
      });

      // 7. Sheet SIP 7 (Complex Headers)
      const sheetSIP7 = workbook.addWorksheet('SIP 7');
      sheetSIP7.addRow(['DATA HASIL KEGIATAN (SIP 7)']).font = { bold: true, size: 14 };
      sheetSIP7.addRow([]);
      sheetSIP7.addRow(['NO', 'BULAN', 'IBU HAMIL', '', '', 'JUMLAH IBU MENYUSUI', 'JUMLAH AKSEPTOR', '', '', '', '', '', '', '', 'PENIMBANGAN BALITA', '', '', '', '', '', '', '', '', '', '', '', 'IMUNISASI TT IBU HAMIL', '', 'JUMLAH BAYI YANG DIIMUNISASI']);
      sheetSIP7.addRow(['', '', 'JUMLAH', 'DIPERIKSA', 'FE TAB', '', 'KONDOM', 'PIL', 'IMPLANT', 'MOP', 'MOW', 'IUD', 'SUNTIK', 'LAIN-LAIN', 'JML BALITA (S)', '', 'JML BALITA YANG MEMILIKI KMS (K)', '', 'JML BALITA YANG DITIMBANG (D)', '', 'JML BALTA YANG NAIK (N)', '', 'JML BALITA YG MENDAPAT VIT. A', '', 'JML BALITA YG MENDAPATKAN PMT', '', 'I', 'II', 'BCG', '', 'DPT', '', '', '', '', '', 'POLIO', '', '', '', '', '', '', '', 'CAMPAK', '', 'HEPATITIS B']);
      sheetSIP7.addRow(['', '', '', '', '', '', '', '', '', '', '', '', '', '', 'L', 'P', 'L', 'P', 'L', 'P', 'L', 'P', 'L', 'P', 'L', 'P', '', '', 'L', 'P', 'I', 'II', 'III', 'I', 'II', 'III', 'I', 'II', 'III', 'IV', 'I', 'II', 'III', 'I', 'II', 'III']);
      sheetSIP7.addRow([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51]);

      const dataSIP7 = [
        [1, 'JANUARI', 15, 15, 15, 89, 5, 40, 30, 0, 1, 2, 98, 0, 108, 108, 108, 108, 80, 92, 76, 60, 0, 0, 108, 108, 1, 1, 0, 2, 2, 3, 3, 1, 2, 1, 0, 2, 2, 3, 3, 1, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0]
      ];
      dataSIP7.forEach(r => sheetSIP7.addRow(r));

      // Merges for SIP 7
      sheetSIP7.mergeCells('C3:E3');
      sheetSIP7.mergeCells('G3:N3');
      sheetSIP7.mergeCells('O3:Z3');
      sheetSIP7.mergeCells('AA3:AB3');
      sheetSIP7.mergeCells('AC3:AY3');

      // Style SIP 7 Headers
      [3, 4, 5].forEach(r => {
        sheetSIP7.getRow(r).eachCell(cell => styleHeader(cell, '10B981')); // Emerald
      });
      
      // Style Row 6 (Numbers)
      sheetSIP7.getRow(6).eachCell(cell => {
        styleHeader(cell, 'E2E8F0');
        cell.font = { bold: true, color: { argb: '334155' } };
      });

      // Style Data
      sheetSIP7.eachRow((row, rowNumber) => {
        if (rowNumber > 6) row.eachCell(cell => styleDataCell(cell));
      });

      sheetSIP7.columns.forEach(col => col.width = 10);
      sheetSIP7.getColumn(1).width = 5;
      sheetSIP7.getColumn(2).width = 15;

      // Save file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'Analisa_Gabungan_Posyandu.xlsx';
      anchor.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export Excel", error)
      alert("Gagal melakukan export file Excel. Silakan coba lagi.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <BarChart3 className={`w-6 h-6 ${theme.text}`} />
            Analisa Data Terpadu
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">
            Ringkasan data laporan dari seluruh bidang dan posyandu.
          </p>
        </div>
        <button 
          onClick={handleExportExcel}
          disabled={isExporting}
          className={`flex items-center gap-2 bg-gradient-to-r ${theme.bgGradient} text-white font-semibold py-2.5 px-5 rounded-xl ${theme.hoverGradient} transition-all shadow-lg ${theme.shadow} disabled:opacity-70 disabled:cursor-not-allowed`}
        >
          <Download className="w-5 h-5" />
          {isExporting ? 'Memproses...' : 'Export Excel (Semua Bidang)'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-zinc-800 p-4 md:p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm flex flex-col items-center justify-center text-center gap-3"
          >
            <div className={`p-3 md:p-4 rounded-xl bg-slate-50 dark:bg-zinc-700/50 ${stat.color}`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">{stat.name}</p>
              <div className="flex items-end justify-center gap-2">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stat.total}</h3>
                <span className={`text-xs font-medium ${theme.text} mb-1`}>
                  {Math.round((stat.completed / stat.total) * 100)}% TL
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Grafik Pelaporan per Bidang</h2>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9', opacity: 0.1 }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Total" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Selesai" fill={theme.chartColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
