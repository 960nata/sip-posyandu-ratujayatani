'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, Download, Users, Building, 
  Home, BookOpen, Shield, HeartPulse 
} from 'lucide-react'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })
import ExcelJS from 'exceljs'
import { useSession } from 'next-auth/react'

// Dummy stats
const stats = [
  { name: 'Pendidikan', total: 120, completed: 95, icon: BookOpen, color: 'text-blue-500' },
  { name: 'Pekerjaan Umum', total: 85, completed: 60, icon: Building, color: 'text-amber-500' },
  { name: 'Perumahan', total: 45, completed: 40, icon: Home, color: 'text-purple-500' },
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
    bgGradient: isPosyandu ? 'from-purple-500 to-indigo-600' : 'from-purple-500 to-indigo-600',
    hoverGradient: isPosyandu ? 'hover:from-purple-600 hover:to-indigo-700' : 'hover:from-purple-600 hover:to-indigo-700',
    shadow: isPosyandu ? 'shadow-purple-500/20' : 'shadow-purple-500/20',
    focusBorder: isPosyandu ? 'focus:border-purple-500' : 'focus:border-purple-500',
    focusRing: isPosyandu ? 'focus:ring-purple-500/10' : 'focus:ring-purple-500/10',
    text: isPosyandu ? 'text-purple-600' : 'text-purple-600',
    bgLight: isPosyandu ? 'bg-purple-50' : 'bg-purple-50',
    textLight: isPosyandu ? 'text-purple-700' : 'text-purple-700',
    activeRing: isPosyandu ? 'focus:ring-purple-500' : 'focus:ring-purple-500',
    bgSolid: isPosyandu ? 'bg-purple-500' : 'bg-purple-500',
    hoverSolid: isPosyandu ? 'hover:bg-purple-600' : 'hover:bg-purple-600',
    borderLight: isPosyandu ? 'border-purple-200' : 'border-purple-200',
    hoverLight: isPosyandu ? 'hover:bg-purple-50' : 'hover:bg-purple-50',
    shadowSolid: isPosyandu ? 'shadow-purple-500/20' : 'shadow-purple-500/20',
    textDark: isPosyandu ? 'dark:text-purple-400' : 'dark:text-purple-400',
    bgDarkLight: isPosyandu ? 'dark:bg-purple-900/30' : 'dark:bg-purple-900/30',
    focusRingSolid: isPosyandu ? 'focus:ring-purple-500' : 'focus:ring-purple-500',
    chartColor: isPosyandu ? '#8b5cf6' : '#10b981', // Purple vs Emerald
  }

  const chartSeries = [
    {
      name: 'Total',
      data: chartData.map(d => d.Total)
    },
    {
      name: 'Selesai',
      data: chartData.map(d => d.Selesai)
    }
  ]

  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      },
      fontFamily: 'Inter, sans-serif',
      foreColor: '#94a3b8'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: chartData.map(d => d.name),
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#94a3b8'
        }
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: function (val: number) {
          return val + " Laporan"
        }
      }
    },
    colors: ['#94a3b8', theme.chartColor],
    grid: {
      borderColor: '#e2e8f0',
      opacity: 0.1,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '14px',
      labels: {
        colors: '#64748b'
      },
      markers: {
        radius: 12
      }
    }
  }

  const [isExporting, setIsExporting] = useState(false)

  const handleExportExcel = async () => {
    setIsExporting(true)
    
    try {
      const workbook = new ExcelJS.Workbook();
      
      // Helper function to format premium sheets
      const formatPremiumSheet = (sheet: any, headerBgColor: string, zebraBgColor: string, headerRowIndex: number = 3) => {
        sheet.views = [{ showGridLines: true }];

        // Style Title Row
        const titleRow = sheet.getRow(1);
        titleRow.height = 32;
        const titleCell = titleRow.getCell(1);
        titleCell.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: '1E293B' } };
        titleCell.alignment = { vertical: 'middle', horizontal: 'left' };

        // Style Header Row
        const headerRow = sheet.getRow(headerRowIndex);
        headerRow.height = 26;
        headerRow.eachCell((cell: any) => {
          cell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFF' } };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: headerBgColor }
          };
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          cell.border = {
            top: { style: 'thin', color: { argb: headerBgColor } },
            left: { style: 'thin', color: { argb: 'FFFFFF' } },
            bottom: { style: 'thin', color: { argb: headerBgColor } },
            right: { style: 'thin', color: { argb: 'FFFFFF' } }
          };
        });

        // Style Data Rows
        sheet.eachRow((row: any, rowNumber: number) => {
          if (rowNumber > headerRowIndex) {
            row.height = 22;
            const isEven = (rowNumber - headerRowIndex) % 2 === 0;

            row.eachCell((cell: any) => {
              cell.font = { name: 'Segoe UI', size: 10, color: { argb: '334155' } };
              cell.border = {
                top: { style: 'thin', color: { argb: 'E2E8F0' } },
                left: { style: 'thin', color: { argb: 'E2E8F0' } },
                bottom: { style: 'thin', color: { argb: 'E2E8F0' } },
                right: { style: 'thin', color: { argb: 'E2E8F0' } }
              };
              
              // Smart alignment based on content length
              const valStr = cell.value ? String(cell.value) : '';
              if (valStr.length > 20) {
                cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
              } else {
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
              }

              if (isEven) {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: zebraBgColor }
                };
              } else {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFFFFF' }
                };
              }
            });
          }
        });

        // Auto-fit Columns
        sheet.columns.forEach((column: any) => {
          let maxLen = 0;
          column.eachCell({ includeEmpty: true }, (cell: any, rowNumber: number) => {
            if (rowNumber >= headerRowIndex) {
              const val = cell.value ? String(cell.value) : '';
              if (val.length > maxLen) maxLen = val.length;
            }
          });
          column.width = Math.max(12, maxLen + 4);
        });
      };

      // 1. Sheet Pendidikan
      const sheetPend = workbook.addWorksheet('Pendidikan');
      sheetPend.addRow(['DATA PENDIDIKAN (SPM)']).font = { bold: true, size: 14 };
      sheetPend.addRow([]);
      const pendHeaders = ['No', 'Tanggal', 'NIK', 'Nama Lengkap', 'Alamat', 'Hal Laporan', 'Status'];
      sheetPend.addRow(pendHeaders);
      const dataPendidikan = [
        [1, '2025-06-16', '3217064006750012', 'Yanti Nurhayati', 'RT 10/25, Adijaya', 'Pengajuan KIP (Kartu Indonesia Pintar)', 'SELESAI'],
        [2, '2025-06-18', '3217064006750013', 'Budi Santoso', 'RT 11/25, Adijaya', 'Kekurangan buku paket di sekolah dasar', 'PROSES'],
      ];
      dataPendidikan.forEach(r => sheetPend.addRow(r));
      formatPremiumSheet(sheetPend, '10B981', 'F0FDF4', 3); // Emerald

      // 2. Sheet Pekerjaan Umum
      const sheetPU = workbook.addWorksheet('Pekerjaan Umum');
      sheetPU.addRow(['DATA PEKERJAAN UMUM (SPM)']).font = { bold: true, size: 14 };
      sheetPU.addRow([]);
      sheetPU.addRow(['No', 'Tanggal', 'Lokasi Kejadian', 'Hal Laporan', 'Status']);
      const dataPU = [
        [1, '2025-06-17', 'Jl. Merdeka RT 04', 'Jalan desa berlubang parah', 'PROSES'],
        [2, '2025-06-19', 'Jembatan Adirejo', 'Pondasi jembatan retak tergerus air', 'SELESAI'],
      ];
      dataPU.forEach(r => sheetPU.addRow(r));
      formatPremiumSheet(sheetPU, 'F59E0B', 'FEF3C7', 3); // Amber

      // 3. Sheet Perumahan
      const sheetPerumahan = workbook.addWorksheet('Perumahan');
      sheetPerumahan.addRow(['DATA PERUMAHAN RAKYAT (SPM)']).font = { bold: true, size: 14 };
      sheetPerumahan.addRow([]);
      sheetPerumahan.addRow(['No', 'Tanggal', 'Nama Pemilik', 'Hal Laporan', 'Status']);
      const dataPerumahan = [
        [1, '2025-06-20', 'Siti Aminah', 'Atap rumah roboh terkena angin kencang', 'SELESAI'],
      ];
      dataPerumahan.forEach(r => sheetPerumahan.addRow(r));
      formatPremiumSheet(sheetPerumahan, '06B6D4', 'ECFEFF', 3); // Cyan

      // 4. Sheet Sosial
      const sheetSosial = workbook.addWorksheet('Sosial');
      sheetSosial.addRow(['DATA SOSIAL KELUARGA (SPM)']).font = { bold: true, size: 14 };
      sheetSosial.addRow([]);
      sheetSosial.addRow(['No', 'Tanggal', 'NIK', 'Nama Lengkap', 'Hal Laporan', 'Tanggapan Petugas', 'Status']);
      const dataSosial = [
        [1, '2025-07-20', '3217060812490003', 'SAFEI', 'PENGAJUAN KARTU KIS', 'Diproses ke Dinas Sosial setempat', 'SELESAI'],
      ];
      dataSosial.forEach(r => sheetSosial.addRow(r));
      formatPremiumSheet(sheetSosial, '8B5CF6', 'F5F3FF', 3); // Violet

      // 5. Sheet Trantib
      const sheetTrantib = workbook.addWorksheet('Trantib');
      sheetTrantib.addRow(['DATA KETRAMPILAN & TERTIB SOSIAL (SPM)']).font = { bold: true, size: 14 };
      sheetTrantib.addRow([]);
      sheetTrantib.addRow(['No', 'Tanggal', 'Nama Pelapor', 'Hal Laporan', 'Status']);
      const dataTrantib = [
        [1, '2025-05-01', 'Budi Mulyono', 'Laporan poskamling kurang aktif ronda malam', 'PROSES'],
      ];
      dataTrantib.forEach(r => sheetTrantib.addRow(r));
      formatPremiumSheet(sheetTrantib, 'EF4444', 'FEF2F2', 3); // Red

      // 6. Sheet SIP 6
      const sheetSIP6 = workbook.addWorksheet('SIP 6');
      sheetSIP6.views = [{ showGridLines: true }];
      sheetSIP6.addRow(['DATA PENGUNJUNG (SIP 6)']).font = { name: 'Segoe UI', bold: true, size: 14, color: { argb: '1E293B' } };
      sheetSIP6.addRow([]);
      sheetSIP6.addRow(['DESA : ADIJAYA']).font = { name: 'Segoe UI', bold: true, size: 11 };
      
      const sip6Headers = [
        ['NO', 'BULAN', 'JUMLAH PENGUNJUNG', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'JUMLAH PETUGAS YG HADIR', '', '', '', '', 'JUMLAH BAYI', '', '', '', 'KET'],
        ['', '', 'B A L I T A', '', '', '', '', '', 'ANAK USIA 6-18 TAHUN', '', '', '', 'USIA PRODUKTIF', '', '', '', 'LANSIA', '', '', '', 'WUS', 'IBU', '', '', '', '', '', 'KADER', 'PLKB', '', 'MEDIS DAN PARA MEDIS', '', 'YANG LAHIR', '', 'MENINGGAL', '', ''],
        ['', '', 'BAYI 0 - 12 BULAN', '', '', '', 'BALITA 1-5 TAHUN', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'PUS', 'HAMIL', 'MENYUSUI', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['', '', 'BARU', '', 'LAMA', '', 'BARU', '', 'LAMA', '', 'BARU', '', 'LAMA', '', 'BARU', '', 'LAMA', '', 'BARU', '', 'LAMA', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['', '', 'L', 'P', 'L', 'P', 'L', 'P', 'L', 'P', 'L', 'P', 'L', 'P', 'L', 'P', 'L', 'P', 'L', 'P', 'L', 'P', '', '', '', '', '', '', '', '', 'L', 'P', 'L', 'P', 'L', 'P', ''],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37]
      ];
      sip6Headers.forEach(h => sheetSIP6.addRow(h));
      
      const dataSIP6 = [
        [1, 'JANUARI', 0, 1, 22, 25, 0, 1, 63, 62, 0, 0, 1, 0, 0, 0, 85, 87, 2, 1, 125, 121, 172, 170, 15, 79, '', 57, 1, '', 1, 3, 0, 1, 0, 0, ''],
        [2, 'FEBRUARI', 0, 0, 20, 20, 0, 0, 60, 59, 0, 0, 0, 1, 0, 0, 80, 79, 1, 0, 120, 180, 159, 155, 18, 80, '', 57, 1, '', 1, 3, 0, 0, 0, 0, ''],
        [3, 'MARET', 0, 1, 20, 18, 1, 0, 61, 59, 0, 0, 1, 0, 0, 0, 81, 77, 1, 1, 125, 99, 158, 154, 20, 78, '', 57, 1, '', 1, 3, 0, 1, 0, 0, ''],
        [4, 'APRIL', 0, 2, 15, 15, 0, 1, 63, 60, 0, 0, 0, 1, 0, 0, 78, 75, 1, 0, 120, 101, 153, 150, 25, 83, '', 57, 1, '', 1, 3, 1, 2, 0, 0, '']
      ];
      dataSIP6.forEach(r => sheetSIP6.addRow(r));
      
      sheetSIP6.mergeCells('A4:A8');
      sheetSIP6.mergeCells('B4:B8');
      sheetSIP6.mergeCells('C4:AA4');
      sheetSIP6.mergeCells('AB4:AF4');
      sheetSIP6.mergeCells('AG4:AJ4');
      sheetSIP6.mergeCells('AK4:AK8');

      // Style SIP 6 Headers
      [4, 5, 6, 7, 8].forEach(r => {
        sheetSIP6.getRow(r).eachCell(cell => {
          cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FFFFFF' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'EC4899' } };
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          cell.border = {
            top: { style: 'thin', color: { argb: 'EC4899' } },
            left: { style: 'thin', color: { argb: 'FFFFFF' } },
            bottom: { style: 'thin', color: { argb: 'EC4899' } },
            right: { style: 'thin', color: { argb: 'FFFFFF' } }
          };
        });
      });
      
      sheetSIP6.getRow(9).eachCell(cell => {
        cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: '334155' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E2E8F0' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin', color: { argb: 'CBD5E1' } },
          left: { style: 'thin', color: { argb: 'CBD5E1' } },
          bottom: { style: 'thin', color: { argb: 'CBD5E1' } },
          right: { style: 'thin', color: { argb: 'CBD5E1' } }
        };
      });

      sheetSIP6.eachRow((row, rowNumber) => {
        if (rowNumber > 9 && rowNumber <= 13) {
          row.height = 20;
          const isEven = rowNumber % 2 === 0;
          row.eachCell(cell => {
            cell.font = { name: 'Segoe UI', size: 9, color: { argb: '334155' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
              top: { style: 'thin', color: { argb: 'E2E8F0' } },
              left: { style: 'thin', color: { argb: 'E2E8F0' } },
              bottom: { style: 'thin', color: { argb: 'E2E8F0' } },
              right: { style: 'thin', color: { argb: 'E2E8F0' } }
            };
            if (isEven) {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FDF2F8' } };
            }
          });
        }
      });

      // Other Tables in SIP 6
      sheetSIP6.addRow([]);
      sheetSIP6.addRow([]);
      sheetSIP6.addRow(['DATA SASARAN KUNJUNGAN']).font = { name: 'Segoe UI', bold: true, size: 12 };
      sheetSIP6.addRow(['DESA : ADIJAYA']).font = { name: 'Segoe UI', size: 10 };
      sheetSIP6.addRow(['TAHUN : 2025']).font = { name: 'Segoe UI', size: 10 };
      sheetSIP6.addRow([]);

      const startRowIbu = sheetSIP6.rowCount + 1;
      sheetSIP6.addRow(['DATA SASARAN IBU HAMIL/NIFAS/MENYUSUI']).font = { name: 'Segoe UI', bold: true, size: 11 };
      sheetSIP6.addRow(['NO', 'SASARAN IBU HAMIL/MENYUSUI', '', '', 'JUMLAH KUNJUNGAN DAN JUMLAH SASARAN IBU HAMIL/NIFAS/MENYUSUI']);
      sheetSIP6.addRow(['', 'NAMA IBU', 'NAMA SUAMI', 'NAMA BAYI', 'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES']);
      sheetSIP6.addRow([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
      
      for(let i=1; i<=5; i++) {
        sheetSIP6.addRow([i, `Ibu ${i}`, `Suami ${i}`, `Bayi ${i}`, '', '', '', '', '', '', '', '', '', '', '', '']);
      }
      sheetSIP6.mergeCells(`B${startRowIbu+1}:D${startRowIbu+1}`);
      sheetSIP6.mergeCells(`E${startRowIbu+1}:P${startRowIbu+1}`);
      
      [startRowIbu+1, startRowIbu+2].forEach(r => {
        sheetSIP6.getRow(r).eachCell(cell => {
          cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FFFFFF' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'EC4899' } };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = {
            top: { style: 'thin', color: { argb: 'EC4899' } },
            left: { style: 'thin', color: { argb: 'FFFFFF' } },
            bottom: { style: 'thin', color: { argb: 'EC4899' } },
            right: { style: 'thin', color: { argb: 'FFFFFF' } }
          };
        });
      });

      for(let r = startRowIbu+4; r < startRowIbu+4+5; r++) {
        sheetSIP6.getRow(r).height = 20;
        const isEven = r % 2 === 0;
        sheetSIP6.getRow(r).eachCell(cell => {
          cell.font = { name: 'Segoe UI', size: 9, color: { argb: '334155' } };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = {
            top: { style: 'thin', color: { argb: 'E2E8F0' } },
            left: { style: 'thin', color: { argb: 'E2E8F0' } },
            bottom: { style: 'thin', color: { argb: 'E2E8F0' } },
            right: { style: 'thin', color: { argb: 'E2E8F0' } }
          };
          if (isEven) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FDF2F8' } };
        });
      }

      sheetSIP6.addRow([]);
      const startRowBayi = sheetSIP6.rowCount + 1;
      sheetSIP6.addRow(['DATA SASARAN BAYI/ BALITA/APRAS']).font = { name: 'Segoe UI', bold: true, size: 11 };
      sheetSIP6.addRow(['NO', 'NAMA BAYI/BALITA', 'JENIS KELAMIN', 'TANGGAL LAHIR', 'NAMA', '', 'JUMLAH KUNJUNGAN DAN JUMLAH SASARAN BAYI/BALITA/APRAS']);
      sheetSIP6.addRow(['', '', '', '', 'IBU', 'AYAH', 'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES']);
      sheetSIP6.addRow([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
      
      for(let i=1; i<=5; i++) {
        sheetSIP6.addRow([i, `Bayi ${i}`, i%2===0?'L':'P', '2025-01-01', `Ibu ${i}`, `Ayah ${i}`, '', '', '', '', '', '', '', '', '', '', '', '']);
      }
      sheetSIP6.mergeCells(`E${startRowBayi+1}:F${startRowBayi+1}`);
      sheetSIP6.mergeCells(`G${startRowBayi+1}:R${startRowBayi+1}`);
      
      [startRowBayi+1, startRowBayi+2].forEach(r => {
        sheetSIP6.getRow(r).eachCell(cell => {
          cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FFFFFF' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'EC4899' } };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = {
            top: { style: 'thin', color: { argb: 'EC4899' } },
            left: { style: 'thin', color: { argb: 'FFFFFF' } },
            bottom: { style: 'thin', color: { argb: 'EC4899' } },
            right: { style: 'thin', color: { argb: 'FFFFFF' } }
          };
        });
      });

      for(let r = startRowBayi+4; r < startRowBayi+4+5; r++) {
        sheetSIP6.getRow(r).height = 20;
        const isEven = r % 2 === 0;
        sheetSIP6.getRow(r).eachCell(cell => {
          cell.font = { name: 'Segoe UI', size: 9, color: { argb: '334155' } };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = {
            top: { style: 'thin', color: { argb: 'E2E8F0' } },
            left: { style: 'thin', color: { argb: 'E2E8F0' } },
            bottom: { style: 'thin', color: { argb: 'E2E8F0' } },
            right: { style: 'thin', color: { argb: 'E2E8F0' } }
          };
          if (isEven) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FDF2F8' } };
        });
      }

      sheetSIP6.columns.forEach(col => col.width = 10);
      sheetSIP6.getColumn(1).width = 5;
      sheetSIP6.getColumn(2).width = 15;

      // 7. Sheet SIP 7
      const sheetSIP7 = workbook.addWorksheet('SIP 7');
      sheetSIP7.views = [{ showGridLines: true }];
      sheetSIP7.addRow(['DATA HASIL KEGIATAN (SIP 7)']).font = { name: 'Segoe UI', bold: true, size: 14, color: { argb: '1E293B' } };
      sheetSIP7.addRow([]);
      sheetSIP7.addRow(['NO', 'BULAN', 'IBU HAMIL', '', '', 'JUMLAH IBU MENYUSUI', 'JUMLAH AKSEPTOR', '', '', '', '', '', '', '', 'PENIMBANGAN BALITA', '', '', '', '', '', '', '', '', '', '', '', 'IMUNISASI TT IBU HAMIL', '', 'JUMLAH BAYI YANG DIIMUNISASI']);
      sheetSIP7.addRow(['', '', 'JUMLAH', 'DIPERIKSA', 'FE TAB', '', 'KONDOM', 'PIL', 'IMPLANT', 'MOP', 'MOW', 'IUD', 'SUNTIK', 'LAIN-LAIN', 'JML BALITA (S)', '', 'JML BALITA YANG MEMILIKI KMS (K)', '', 'JML BALITA YANG DITIMBANG (D)', '', 'JML BALTA YANG NAIK (N)', '', 'JML BALITA YG MENDAPAT VIT. A', '', 'JML BALITA YG MENDAPATKAN PMT', '', 'I', 'II', 'BCG', '', 'DPT', '', '', '', '', '', 'POLIO', '', '', '', '', '', '', '', 'CAMPAK', '', 'HEPATITIS B']);
      sheetSIP7.addRow(['', '', '', '', '', '', '', '', '', '', '', '', '', '', 'L', 'P', 'L', 'P', 'L', 'P', 'L', 'P', 'L', 'P', 'L', 'P', '', '', 'L', 'P', 'I', 'II', 'III', 'I', 'II', 'III', 'I', 'II', 'III', 'IV', 'I', 'II', 'III', 'I', 'II', 'III']);
      sheetSIP7.addRow([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51]);

      const dataSIP7 = [
        [1, 'JANUARI', 15, 15, 15, 89, 5, 40, 30, 0, 1, 2, 98, 0, 108, 108, 108, 108, 80, 92, 76, 60, 0, 0, 108, 108, 1, 1, 0, 2, 2, 3, 3, 1, 2, 1, 0, 2, 2, 3, 3, 1, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0]
      ];
      dataSIP7.forEach(r => sheetSIP7.addRow(r));

      sheetSIP7.mergeCells('C3:E3');
      sheetSIP7.mergeCells('G3:N3');
      sheetSIP7.mergeCells('O3:Z3');
      sheetSIP7.mergeCells('AA3:AB3');
      sheetSIP7.mergeCells('AC3:AY3');

      // Style SIP 7 Headers
      [3, 4, 5].forEach(r => {
        sheetSIP7.getRow(r).eachCell(cell => {
          cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FFFFFF' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '10B981' } }; // Emerald
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          cell.border = {
            top: { style: 'thin', color: { argb: '10B981' } },
            left: { style: 'thin', color: { argb: 'FFFFFF' } },
            bottom: { style: 'thin', color: { argb: '10B981' } },
            right: { style: 'thin', color: { argb: 'FFFFFF' } }
          };
        });
      });
      
      sheetSIP7.getRow(6).eachCell(cell => {
        cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: '334155' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E2E8F0' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin', color: { argb: 'CBD5E1' } },
          left: { style: 'thin', color: { argb: 'CBD5E1' } },
          bottom: { style: 'thin', color: { argb: 'CBD5E1' } },
          right: { style: 'thin', color: { argb: 'CBD5E1' } }
        };
      });

      sheetSIP7.eachRow((row, rowNumber) => {
        if (rowNumber > 6) {
          row.height = 20;
          const isEven = rowNumber % 2 === 0;
          row.eachCell(cell => {
            cell.font = { name: 'Segoe UI', size: 9, color: { argb: '334155' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
              top: { style: 'thin', color: { argb: 'E2E8F0' } },
              left: { style: 'thin', color: { argb: 'E2E8F0' } },
              bottom: { style: 'thin', color: { argb: 'E2E8F0' } },
              right: { style: 'thin', color: { argb: 'E2E8F0' } }
            };
            if (isEven) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F0FDF4' } };
          });
        }
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
          className={`flex items-center gap-2 bg-gradient-to-r ${theme.bgGradient} text-white font-semibold py-2.5 px-5 rounded-[10px] ${theme.hoverGradient} transition-all shadow-lg ${theme.shadow} disabled:opacity-70 disabled:cursor-not-allowed`}
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
          <Chart options={chartOptions as any} series={chartSeries} type="bar" height="100%" />
        </div>
      </div>
    </div>
  )
}
