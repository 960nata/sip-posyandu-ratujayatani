// Generator workbook SIP per desa — meniru persis layout file resmi
// EXCEL/REKAP DESA/<KECAMATAN>/<DESA>.xlsx (8 sheet, header bertingkat + merge).
// Dipakai oleh /api/export/desa, /api/export/kecamatan, /api/export/kabupaten.
import ExcelJS from 'exceljs'

export interface LaporanRow {
  tanggal: Date | null
  posyandu: string
  nik: string
  nama: string
  alamat: string
  hal: string
  tl: string
  btl: string
}

export interface PuRow extends LaporanRow {
  noSurat: string
  lokasi: string
}

export interface PrRow {
  tanggal: Date | null
  posyandu: string
  nama: string
  nik: string
  alamat: string
  fcKK: boolean
  fcKTP: boolean
  sp: boolean
  suket: boolean
  fotoRumah: boolean
  tl: string
  btl: string
}

export interface PosyanduDbRow {
  nama: string
  hariBuka: string
  jumlahRumah: number
  jumlahKK: number
  jumlahPenduduk: number
  jumlahAnak05: number
  jumlahRemaja: number
  jumlahProduktif: number
  jumlahLansia: number
  jumlahDisabilitas: number
  statusBangunan: string // MILIK_SENDIRI | MENUMPANG
  danaSehat: boolean
  jumlahKader: number
  strata: string
  kegiatanIntegrasi: string
}

// Nilai agregat per bulan (dijumlah dari seluruh posyandu di desa)
export type Sip6Agg = Record<string, number> & { bulan: number }
export type Sip7Agg = Record<string, number> & { bulan: number }

export interface SasaranBumilRow {
  namaIbu: string
  namaSuami: string
  namaBayi: string
  months: boolean[] // index 0 = JAN
}

export interface SasaranBalitaRow {
  nama: string
  jenisKelamin: string
  tanggalLahir: Date | null
  namaIbu: string
  namaAyah: string
  months: boolean[]
}

export interface DesaWorkbookData {
  desaNama: string
  tahun: number
  posyandus: PosyanduDbRow[]
  sip6: Sip6Agg[]
  sip7: Sip7Agg[]
  rekapBumil: Record<number, Record<string, number>>
  rekapBalita: Record<number, Record<string, number>>
  rekapRemaja: Record<number, Record<string, number>>
  rekapLansia: Record<number, Record<string, number>>
  sasaranBumil: SasaranBumilRow[]
  sasaranBalita: SasaranBalitaRow[]
  pendidikan: LaporanRow[]
  pu: PuRow[]
  pr: PrRow[]
  trantib: LaporanRow[]
  sosial: LaporanRow[]
}

export const BULAN_NAMES = [
  'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
  'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
]

const thin: Partial<ExcelJS.Border> = { style: 'thin', color: { argb: 'FF000000' } }
const borderAll: Partial<ExcelJS.Borders> = { top: thin, left: thin, bottom: thin, right: thin }
const headerFill: ExcelJS.FillPattern = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDEBF7' } }
const titleFont: Partial<ExcelJS.Font> = { name: 'Arial', size: 14, bold: true }
const headFont: Partial<ExcelJS.Font> = { name: 'Arial', size: 10, bold: true }
const dataFont: Partial<ExcelJS.Font> = { name: 'Arial', size: 10 }

function styleHeaderRange(ws: ExcelJS.Worksheet, fromRow: number, toRow: number, fromCol: number, toCol: number, fill = true) {
  for (let r = fromRow; r <= toRow; r++) {
    for (let c = fromCol; c <= toCol; c++) {
      const cell = ws.getCell(r, c)
      cell.font = headFont
      cell.border = borderAll
      if (fill) cell.fill = headerFill
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    }
  }
}

function styleDataRange(ws: ExcelJS.Worksheet, fromRow: number, toRow: number, fromCol: number, toCol: number) {
  for (let r = fromRow; r <= toRow; r++) {
    for (let c = fromCol; c <= toCol; c++) {
      const cell = ws.getCell(r, c)
      cell.font = dataFont
      cell.border = borderAll
      cell.alignment = { vertical: 'middle', horizontal: c <= 2 ? 'center' : (typeof cell.value === 'number' ? 'center' : 'left'), wrapText: true }
    }
  }
}

function setRowValues(ws: ExcelJS.Worksheet, rowNum: number, values: (string | number | Date | null)[], startCol = 1) {
  values.forEach((v, i) => {
    if (v !== null && v !== undefined && v !== '') ws.getCell(rowNum, startCol + i).value = v
  })
}

function mergeAll(ws: ExcelJS.Worksheet, ranges: string[]) {
  for (const r of ranges) {
    try { ws.mergeCells(r) } catch { /* merge tumpang tindih diabaikan */ }
  }
}

function tanggalCell(ws: ExcelJS.Worksheet, row: number, col: number, d: Date | null) {
  if (!d) return
  const cell = ws.getCell(row, col)
  cell.value = d
  cell.numFmt = 'dd/mm/yyyy'
}

// ---------------------------------------------------------------
// Sheet laporan bidang (PENDIDIKAN / TRANTIB LINMAS / SOSIAL) — 9 kolom
// ---------------------------------------------------------------
function addLaporanSheet(wb: ExcelJS.Workbook, sheetName: string, bidangTitle: string, desa: string, rows: LaporanRow[]) {
  const ws = wb.addWorksheet(sheetName)
  ws.getCell('A1').value = 'LAPORAN POSYANDU'
  ws.getCell('A2').value = bidangTitle
  ws.getCell('B3').value = 'DESA'
  ws.getCell('C3').value = `: ${desa}`
  ws.getCell('A1').font = titleFont
  ws.getCell('A2').font = titleFont
  ws.getCell('B3').font = headFont
  ws.getCell('C3').font = headFont
  mergeAll(ws, ['A1:I1', 'A2:I2'])
  ws.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' }
  ws.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' }

  setRowValues(ws, 5, ['No', 'tanggal', 'Posyandu', 'NIK', 'Nama', 'Alamat', 'Hal pengaduan', 'Keterangan'])
  setRowValues(ws, 6, ['', '', '', '', '', '', '', 'TL', 'BTL'])
  mergeAll(ws, ['A5:A6', 'B5:B6', 'C5:C6', 'D5:D6', 'E5:E6', 'F5:F6', 'G5:G6', 'H5:I5'])
  styleHeaderRange(ws, 5, 6, 1, 9)
  setRowValues(ws, 7, [1, 2, 3, 4, 5, 6, 7, 8, 9])
  styleHeaderRange(ws, 7, 7, 1, 9, false)

  rows.forEach((r, i) => {
    const rowNum = 8 + i
    setRowValues(ws, rowNum, [i + 1, null, r.posyandu, r.nik, r.nama, r.alamat, r.hal, r.tl, r.btl])
    tanggalCell(ws, rowNum, 2, r.tanggal)
  })
  if (rows.length > 0) styleDataRange(ws, 8, 7 + rows.length, 1, 9)

  ws.columns.forEach((c, i) => { c.width = [6, 13, 15, 20, 22, 22, 40, 16, 16][i] || 12 })
  return ws
}

// ---------------------------------------------------------------
// Sheet PU — 11 kolom
// ---------------------------------------------------------------
function addPuSheet(wb: ExcelJS.Workbook, desa: string, rows: PuRow[]) {
  const ws = wb.addWorksheet('PU')
  ws.getCell('A1').value = 'LAPORAN POSYANDU'
  ws.getCell('A2').value = 'BIDANG PEKERJAAN UMUM'
  ws.getCell('B3').value = 'DESA'
  ws.getCell('C3').value = `: ${desa}`
  ws.getCell('A1').font = titleFont
  ws.getCell('A2').font = titleFont
  ws.getCell('B3').font = headFont
  ws.getCell('C3').font = headFont
  mergeAll(ws, ['A1:K1', 'A2:K2'])
  ws.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' }
  ws.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' }

  setRowValues(ws, 5, ['No', 'tanggal', 'Nama Posyandu', 'No Surat Permohonan RT', 'Nama', 'NIK', 'Alamat', 'Keluhan', 'Lokasi Pembangunan Sarana', 'Tindaklanjut'])
  setRowValues(ws, 6, ['', '', '', '', '', '', '', '', '', 'TL', 'BTL'])
  mergeAll(ws, ['A5:A6', 'B5:B6', 'C5:C6', 'D5:D6', 'E5:E6', 'F5:F6', 'G5:G6', 'H5:H6', 'I5:I6', 'J5:K5'])
  styleHeaderRange(ws, 5, 6, 1, 11)
  setRowValues(ws, 7, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  styleHeaderRange(ws, 7, 7, 1, 11, false)

  rows.forEach((r, i) => {
    const rowNum = 8 + i
    setRowValues(ws, rowNum, [i + 1, null, r.posyandu, r.noSurat, r.nama, r.nik, r.alamat, r.hal, r.lokasi, r.tl, r.btl])
    tanggalCell(ws, rowNum, 2, r.tanggal)
  })
  if (rows.length > 0) styleDataRange(ws, 8, 7 + rows.length, 1, 11)

  ws.columns.forEach((c, i) => { c.width = [6, 13, 16, 20, 22, 20, 22, 40, 28, 14, 14][i] || 12 })
  return ws
}

// ---------------------------------------------------------------
// Sheet PR — 13 kolom
// ---------------------------------------------------------------
function addPrSheet(wb: ExcelJS.Workbook, desa: string, rows: PrRow[]) {
  const ws = wb.addWorksheet('PR')
  ws.getCell('A1').value = 'LAPORAN POSYANDU'
  ws.getCell('A2').value = 'BIDANG PERUMAHAN RAKYAT'
  ws.getCell('B3').value = 'DESA'
  ws.getCell('C3').value = `: ${desa}`
  ws.getCell('A1').font = titleFont
  ws.getCell('A2').font = titleFont
  ws.getCell('B3').font = headFont
  ws.getCell('C3').font = headFont
  mergeAll(ws, ['A1:M1', 'A2:M2'])
  ws.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' }
  ws.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' }

  setRowValues(ws, 4, ['No', 'tanggal', 'Posyandu', 'Nama', 'NIK', 'Alamat', 'Persyaratan', '', '', '', '', 'Tindaklanjut'])
  setRowValues(ws, 5, ['', '', '', '', '', '', 'FC KK', 'FC KTP', 'SP*', 'Suket Penghasilan', 'Foto Kondisi Rumah', 'TL', 'BTL'])
  mergeAll(ws, ['A4:A5', 'B4:B5', 'C4:C5', 'D4:D5', 'E4:E5', 'F4:F5', 'G4:K4', 'L4:M4'])
  styleHeaderRange(ws, 4, 5, 1, 13)
  setRowValues(ws, 6, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
  styleHeaderRange(ws, 6, 6, 1, 13, false)

  rows.forEach((r, i) => {
    const rowNum = 7 + i
    setRowValues(ws, rowNum, [
      i + 1, null, r.posyandu, r.nama, r.nik, r.alamat,
      r.fcKK ? 'ADA' : '', r.fcKTP ? 'ADA' : '', r.sp ? 'ADA' : '',
      r.suket ? 'ADA' : '', r.fotoRumah ? 'ADA' : '', r.tl, r.btl
    ])
    tanggalCell(ws, rowNum, 2, r.tanggal)
  })
  if (rows.length > 0) styleDataRange(ws, 7, 6 + rows.length, 1, 13)

  ws.columns.forEach((c, i) => { c.width = [6, 13, 15, 22, 20, 22, 10, 10, 10, 16, 18, 12, 12][i] || 12 })
  return ws
}

// ---------------------------------------------------------------
// Sheet DATABASE — profil posyandu, 18 kolom
// ---------------------------------------------------------------
function addDatabaseSheet(wb: ExcelJS.Workbook, desa: string, rows: PosyanduDbRow[]) {
  const ws = wb.addWorksheet('DATABASE')
  ws.getCell('A1').value = 'DATABASE POSYANDU'
  ws.getCell('A1').font = titleFont
  ws.getCell('B2').value = 'DESA'
  ws.getCell('C2').value = `: ${desa}`
  ws.getCell('B2').font = headFont
  ws.getCell('C2').font = headFont
  mergeAll(ws, ['A1:R1'])
  ws.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' }

  setRowValues(ws, 4, [
    'NO', 'NAMA POSYANDU', 'HARI BUKA', 'JUMLAH RUMAH', 'JUMLAH KK', 'JUMLAH PENDUDUK',
    'JUMLAH ANAK USIA 0-5 THN', 'JUMLAH USIA REMAJA 6-18', 'JUMLAH USIA PRODUKTIF',
    'JUMLAH LANSIA', 'JUMLAH DISABILITAS', 'STATUS BANGUNAN POSYANDU', '',
    'DANA SEHAT', '', 'JUMLAH KADER', 'STRATA POSYANDU', 'KEGIATAN INTEGRASI'
  ])
  setRowValues(ws, 5, ['', '', '', '', '', '', '', '', '', '', '', 'MILIK SENDIRI', 'MENUMPANG', 'ADA', 'TIDAK ADA'])
  mergeAll(ws, [
    'A4:A5', 'B4:B5', 'C4:C5', 'D4:D5', 'E4:E5', 'F4:F5', 'G4:G5', 'H4:H5', 'I4:I5',
    'J4:J5', 'K4:K5', 'L4:M4', 'N4:O4', 'P4:P5', 'Q4:Q5', 'R4:R5'
  ])
  styleHeaderRange(ws, 4, 5, 1, 18)

  rows.forEach((p, i) => {
    const rowNum = 6 + i
    setRowValues(ws, rowNum, [
      i + 1, p.nama, p.hariBuka, p.jumlahRumah, p.jumlahKK, p.jumlahPenduduk,
      p.jumlahAnak05, p.jumlahRemaja, p.jumlahProduktif, p.jumlahLansia, p.jumlahDisabilitas,
      p.statusBangunan === 'MILIK_SENDIRI' ? 'Milik Sendiri' : '',
      p.statusBangunan === 'MENUMPANG' ? 'MENUMPANG' : '',
      p.danaSehat ? 'Ada' : '', !p.danaSehat ? 'Tidak Ada' : '',
      p.jumlahKader,
      p.strata ? p.strata.charAt(0) + p.strata.slice(1).toLowerCase() : '',
      p.kegiatanIntegrasi || ''
    ])
  })
  const lastData = 5 + rows.length
  if (rows.length > 0) styleDataRange(ws, 6, lastData, 1, 18)

  // Baris JUMLAH
  const totalRow = lastData + 1
  ws.getCell(totalRow, 1).value = 'JUMLAH'
  mergeAll(ws, [`A${totalRow}:C${totalRow}`])
  const sumCols = [4, 5, 6, 7, 8, 9, 10, 11, 16]
  for (const c of sumCols) {
    const colLetter = ws.getColumn(c).letter
    ws.getCell(totalRow, c).value = { formula: `SUM(${colLetter}6:${colLetter}${lastData})` } as ExcelJS.CellValue
  }
  styleHeaderRange(ws, totalRow, totalRow, 1, 18, false)

  ws.columns.forEach((c, i) => { c.width = [5, 20, 12, 12, 10, 14, 12, 12, 12, 12, 13, 13, 13, 10, 11, 12, 14, 18][i] || 12 })
  return ws
}

// ---------------------------------------------------------------
// Sheet KESEHATAN SIP 6 — Data Pengunjung + 2 daftar sasaran
// ---------------------------------------------------------------
const SIP6_FIELDS = [
  'bayiBaruL', 'bayiBaruP', 'bayiLamaL', 'bayiLamaP',
  'balitaBaruL', 'balitaBaruP', 'balitaLamaL', 'balitaLamaP',
  'anakBaruL', 'anakBaruP', 'anakLamaL', 'anakLamaP',
  'prodBaruL', 'prodBaruP', 'prodLamaL', 'prodLamaP',
  'lansiaBaruL', 'lansiaBaruP', 'lansiaLamaL', 'lansiaLamaP',
  'wus', 'pus', 'ibuHamil', 'ibuMenyusui',
  'kaderL', 'kaderP', 'plkbL', 'plkbP', 'medisL', 'medisP',
  'lahirL', 'lahirP', 'meninggalL', 'meninggalP'
] as const

function addSip6Sheet(wb: ExcelJS.Workbook, data: DesaWorkbookData) {
  const ws = wb.addWorksheet('KESEHATAN SIP 6')
  ws.getCell('A1').value = 'DATA PENGUNJUNG'
  ws.getCell('A1').font = titleFont
  mergeAll(ws, ['A1:AK1'])
  ws.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' }
  ws.getCell('B3').value = 'DESA'
  ws.getCell('C3').value = `: ${data.desaNama}`
  ws.getCell('B3').font = headFont
  ws.getCell('C3').font = headFont

  // Header bertingkat baris 4-8 (persis file resmi)
  setRowValues(ws, 4, ['NO', 'BULAN', 'JUMLAH PENGUNJUNG '])
  ws.getCell(4, 27).value = 'JUMLAH PETUGAS YG HADIR'
  ws.getCell(4, 33).value = 'JUMLAH BAYI'
  ws.getCell(4, 37).value = 'KET'
  ws.getCell(5, 3).value = 'B A L I T A'
  ws.getCell(5, 11).value = 'ANAK USIA 6-18 TAHUN'
  ws.getCell(5, 15).value = 'USIA PRODUKTIF'
  ws.getCell(5, 19).value = 'LANSIA'
  ws.getCell(5, 23).value = 'WUS'
  ws.getCell(5, 24).value = 'IBU'
  ws.getCell(5, 27).value = 'KADER'
  ws.getCell(5, 29).value = 'PLKB'
  ws.getCell(5, 31).value = 'MEDIS DAN PARA MEDIS'
  ws.getCell(5, 33).value = 'YANG LAHIR'
  ws.getCell(5, 35).value = 'MENINGGAL'
  ws.getCell(6, 3).value = 'BAYI 0 - 12 BULAN'
  ws.getCell(6, 7).value = 'BALITA 1-5 TAHUN'
  ws.getCell(6, 24).value = 'PUS'
  ws.getCell(6, 25).value = 'HAMIL'
  ws.getCell(6, 26).value = 'MENYUSUI'
  const baruLamaCols = [3, 5, 7, 9, 11, 13, 15, 17, 19, 21]
  baruLamaCols.forEach((c, i) => { ws.getCell(7, c).value = i % 2 === 0 ? 'BARU' : 'LAMA' })
  for (let c = 3; c <= 22; c++) ws.getCell(8, c).value = c % 2 === 1 ? 'L' : 'P'
  for (let c = 27; c <= 36; c++) ws.getCell(8, c).value = c % 2 === 1 ? 'L' : 'P'
  mergeAll(ws, [
    'A4:A8', 'B4:B8', 'C4:Z4', 'AA4:AF4', 'AG4:AJ4', 'AK4:AK8',
    'C5:J5', 'K5:N6', 'O5:R6', 'S5:V6', 'W5:W8', 'X5:Z5',
    'AA5:AB7', 'AC5:AD7', 'AE5:AF7', 'AG5:AH7', 'AI5:AJ7',
    'C6:F6', 'G6:J6', 'X6:X8', 'Y6:Y8', 'Z6:Z8',
    'C7:D7', 'E7:F7', 'G7:H7', 'I7:J7', 'K7:L7', 'M7:N7', 'O7:P7', 'Q7:R7', 'S7:T7', 'U7:V7'
  ])
  styleHeaderRange(ws, 4, 8, 1, 37)
  setRowValues(ws, 9, Array.from({ length: 37 }, (_, i) => i + 1))
  styleHeaderRange(ws, 9, 9, 1, 37, false)

  // Data 12 bulan (baris 10-21)
  const byBulan = new Map(data.sip6.map(r => [r.bulan, r]))
  for (let b = 1; b <= 12; b++) {
    const rowNum = 9 + b
    const r = byBulan.get(b)
    ws.getCell(rowNum, 1).value = b
    ws.getCell(rowNum, 2).value = BULAN_NAMES[b - 1]
    if (r) {
      SIP6_FIELDS.forEach((f, i) => {
        const v = r[f] || 0
        if (v) ws.getCell(rowNum, 3 + i).value = v
      })
      const ket = (r as unknown as Record<string, unknown>).keterangan
      if (ket) ws.getCell(rowNum, 37).value = String(ket)
    }
  }
  styleDataRange(ws, 10, 21, 1, 37)

  // ---- DATA SASARAN KUNJUNGAN ----
  ws.getCell('A24').value = 'DATA SASARAN KUNJUNGAN'
  ws.getCell('A24').font = headFont
  mergeAll(ws, ['A24:C24'])
  ws.getCell('A25').value = 'DESA :'
  ws.getCell('B25').value = data.desaNama
  ws.getCell('A26').value = 'TAHUN :'
  ws.getCell('B26').value = data.tahun
  ws.getCell('A25').font = headFont
  ws.getCell('A26').font = headFont

  // Tabel sasaran ibu hamil/nifas/menyusui (mulai baris 28)
  ws.getCell('A28').value = 'DATA SASARAN IBU HAMIL/NIFAS/MENYUSUI'
  ws.getCell('A28').font = headFont
  mergeAll(ws, ['A28:D28'])
  ws.getCell('A29').value = 'NO'
  ws.getCell('B29').value = 'SASARAN IBU HAMIL/MENYUSUI'
  ws.getCell('E29').value = 'JUMLAH KUNJUNGAN DAN JUMLAH SASARAN IBU HAMIL/NIFAS/MENYUSUI'
  setRowValues(ws, 30, ['', 'NAMA IBU', 'NAMA SUAMI', 'NAMA BAYI', 'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'])
  mergeAll(ws, ['A29:A30', 'B29:D29', 'E29:P29'])
  styleHeaderRange(ws, 29, 30, 1, 16)
  setRowValues(ws, 31, Array.from({ length: 16 }, (_, i) => i + 1))
  styleHeaderRange(ws, 31, 31, 1, 16, false)

  data.sasaranBumil.forEach((s, i) => {
    const rowNum = 32 + i
    setRowValues(ws, rowNum, [i + 1, s.namaIbu, s.namaSuami, s.namaBayi])
    s.months.forEach((hadir, m) => { if (hadir) ws.getCell(rowNum, 5 + m).value = '√' })
  })
  const bumilEnd = 31 + Math.max(data.sasaranBumil.length, 1)
  if (data.sasaranBumil.length > 0) styleDataRange(ws, 32, bumilEnd, 1, 16)

  // Tabel sasaran bayi/balita/apras (posisi dinamis)
  const balitaTitle = bumilEnd + 3
  ws.getCell(balitaTitle, 1).value = 'DATA SASARAN BAYI/ BALITA/APRAS'
  ws.getCell(balitaTitle, 1).font = headFont
  mergeAll(ws, [`A${balitaTitle}:C${balitaTitle}`])
  const h1 = balitaTitle + 1
  const h2 = h1 + 1
  setRowValues(ws, h1, ['NO', 'NAMA BAYI/BALITA', 'JENIS KELAMIN', 'TANGGAL LAHIR', 'NAMA'])
  ws.getCell(h1, 7).value = 'JUMLAH KUNJUNGAN DAN JUMLAH SASARAN BAYI/BALITA/APRAS'
  setRowValues(ws, h2, ['', '', '', '', 'IBU', 'AYAH', 'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'])
  mergeAll(ws, [`A${h1}:A${h2}`, `B${h1}:B${h2}`, `C${h1}:C${h2}`, `D${h1}:D${h2}`, `E${h1}:F${h1}`, `G${h1}:R${h1}`])
  styleHeaderRange(ws, h1, h2, 1, 18)
  const numRow = h2 + 1
  setRowValues(ws, numRow, Array.from({ length: 18 }, (_, i) => i + 1))
  styleHeaderRange(ws, numRow, numRow, 1, 18, false)

  data.sasaranBalita.forEach((s, i) => {
    const rowNum = numRow + 1 + i
    setRowValues(ws, rowNum, [i + 1, s.nama, s.jenisKelamin, null, s.namaIbu, s.namaAyah])
    tanggalCell(ws, rowNum, 4, s.tanggalLahir)
    s.months.forEach((hadir, m) => { if (hadir) ws.getCell(rowNum, 7 + m).value = '√' })
  })
  if (data.sasaranBalita.length > 0) styleDataRange(ws, numRow + 1, numRow + data.sasaranBalita.length, 1, 18)

  ws.columns.forEach((c, i) => {
    if (i === 0) c.width = 5
    else if (i === 1) c.width = 22
    else if (i === 36) c.width = 16
    else c.width = 7
  })
  return ws
}

// ---------------------------------------------------------------
// Sheet KESEHATAN SIP 7 — Data Hasil Kegiatan + 4 rekapitulasi
// ---------------------------------------------------------------
const SIP7_FIELDS = [
  'jmlBumil', 'bumilDiperiksa', 'bumilFeTab', 'jmlBusui',
  'kbKondom', 'kbPil', 'kbImplant', 'kbMOP', 'kbMOW', 'kbIUD', 'kbSuntik', 'kbLainnya',
  'balitaS_L', 'balitaS_P', 'balitaK_L', 'balitaK_P', 'balitaD_L', 'balitaD_P', 'balitaN_L', 'balitaN_P',
  'vitA_L', 'vitA_P', 'pmt_L', 'pmt_P', 'imTT',
  'imBCG_L', 'imBCG_P', 'imDPT1_L', 'imDPT1_P', 'imDPT2_L', 'imDPT2_P', 'imDPT3_L', 'imDPT3_P',
  'imPolio1_L', 'imPolio1_P', 'imPolio2_L', 'imPolio2_P', 'imPolio3_L', 'imPolio3_P', 'imPolio4_L', 'imPolio4_P',
  'imCampak_L', 'imCampak_P', 'imHepB1_L', 'imHepB1_P', 'imHepB2_L', 'imHepB2_P', 'imHepB3_L', 'imHepB3_P',
  'diareJml_L', 'diareJml_P', 'diareOralit_L', 'diareOralit_P'
] as const

function bulanTahunCell(ws: ExcelJS.Worksheet, row: number, tahun: number, bulan: number) {
  const cell = ws.getCell(row, 1)
  cell.value = new Date(Date.UTC(tahun, bulan - 1, 1))
  cell.numFmt = 'mmmm yyyy'
}

function addSip7Sheet(wb: ExcelJS.Workbook, data: DesaWorkbookData) {
  const ws = wb.addWorksheet('KESEHATAN SIP 7')
  ws.getCell('A1').value = 'DATA HASIL KEGIATAN'
  ws.getCell('A1').font = titleFont
  mergeAll(ws, ['A1:BD1'])
  ws.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' }
  ws.getCell('B3').value = 'DESA'
  ws.getCell('C3').value = `: ${data.desaNama}`
  ws.getCell('B3').font = headFont
  ws.getCell('C3').font = headFont

  // Header bertingkat baris 4-9
  setRowValues(ws, 4, ['NO', 'BULAN', 'IBU HAMIL'])
  ws.getCell(4, 6).value = 'JUMLAH IBU MENYUSUI'
  ws.getCell(4, 7).value = 'JUMLAH AKSEPTOR'
  ws.getCell(4, 15).value = 'PENIMBANGAN BALITA'
  ws.getCell(4, 27).value = 'IMUNISASI TT IBU HAMIL'
  ws.getCell(4, 28).value = 'JUMLAH BAYI YANG DIIMUNISASI'
  ws.getCell(4, 52).value = 'BLITA YANG MENDERITA DIARE'
  ws.getCell(4, 56).value = 'KETERANGAN'
  ws.getCell(5, 3).value = 'JUMLAH'
  ws.getCell(5, 4).value = 'DIPERIKSA'
  ws.getCell(5, 5).value = 'FE TAB (Tablet Besi)'
  const kbLabels = ['KONDOM', 'PIL', 'IMPLANT', 'MOP', 'MOW', 'IUD', 'SUNTIK', 'LAIN-LAIN']
  kbLabels.forEach((l, i) => { ws.getCell(5, 7 + i).value = l })
  ws.getCell(5, 15).value = 'JML BALITA (S)'
  ws.getCell(5, 17).value = 'JML BALITA YANG MEMILIKI KMS (K)'
  ws.getCell(5, 19).value = 'JML BALITA YANG DITIMBANG (D)'
  ws.getCell(5, 21).value = 'JML BALTA YANG NAIK (N)'
  ws.getCell(5, 23).value = 'JML BALITA YG MENDAPAT VIT. A'
  ws.getCell(5, 25).value = 'JML BALITA YG MENDAPATKAN PMT'
  ws.getCell(5, 28).value = 'BCG'
  ws.getCell(5, 30).value = 'DPT'
  ws.getCell(5, 36).value = 'POLIO'
  ws.getCell(5, 44).value = 'CAMPAK'
  ws.getCell(5, 46).value = 'HEPATITIS B'
  ws.getCell(5, 52).value = 'JUMLAH'
  ws.getCell(5, 54).value = 'YANG MENDAPATKAN ORALIT'
  ws.getCell(7, 30).value = 'I'
  ws.getCell(7, 32).value = 'II'
  ws.getCell(7, 34).value = 'III'
  ws.getCell(7, 36).value = 'I'
  ws.getCell(7, 38).value = 'II'
  ws.getCell(7, 40).value = 'III'
  ws.getCell(7, 42).value = 'IV'
  ws.getCell(7, 46).value = 'I'
  ws.getCell(7, 48).value = 'II'
  ws.getCell(7, 50).value = 'III'
  for (let c = 15; c <= 26; c++) ws.getCell(9, c).value = c % 2 === 1 ? 'L' : 'P'
  for (let c = 28; c <= 55; c++) ws.getCell(9, c).value = c % 2 === 0 ? 'L' : 'P'
  mergeAll(ws, [
    'A4:A9', 'B4:B9', 'C4:E4', 'F4:F9', 'G4:N4', 'O4:Z4', 'AA4:AA8', 'AB4:AY4', 'AZ4:BC4', 'BD4:BD8',
    'C5:C9', 'D5:D9', 'E5:E9', 'G5:G9', 'H5:H9', 'I5:I9', 'J5:J9', 'K5:K9', 'L5:L9', 'M5:M9', 'N5:N9',
    'O5:P8', 'Q5:R8', 'S5:T8', 'U5:V8', 'W5:X8', 'Y5:Z8',
    'AB5:AC8', 'AD5:AI6', 'AJ5:AQ6', 'AR5:AS8', 'AT5:AY6', 'AZ5:BA8', 'BB5:BC8',
    'AD7:AE8', 'AF7:AG8', 'AH7:AI8', 'AJ7:AK8', 'AL7:AM8', 'AN7:AO8', 'AP7:AQ8', 'AT7:AU8', 'AV7:AW8', 'AX7:AY8'
  ])
  styleHeaderRange(ws, 4, 9, 1, 56)
  setRowValues(ws, 10, Array.from({ length: 56 }, (_, i) => i + 1))
  styleHeaderRange(ws, 10, 10, 1, 56, false)

  // Data 12 bulan (baris 11-22) + baris JUMLAH (24)
  const byBulan = new Map(data.sip7.map(r => [r.bulan, r]))
  for (let b = 1; b <= 12; b++) {
    const rowNum = 10 + b
    const r = byBulan.get(b)
    ws.getCell(rowNum, 1).value = b
    ws.getCell(rowNum, 2).value = BULAN_NAMES[b - 1]
    if (r) {
      SIP7_FIELDS.forEach((f, i) => {
        const v = r[f] || 0
        if (v) ws.getCell(rowNum, 3 + i).value = v
      })
    }
  }
  styleDataRange(ws, 11, 22, 1, 56)
  ws.getCell(24, 1).value = 'JUMLAH'
  mergeAll(ws, ['A24:B24'])
  for (let c = 3; c <= 55; c++) {
    const colLetter = ws.getColumn(c).letter
    ws.getCell(24, c).value = { formula: `SUM(${colLetter}11:${colLetter}22)` } as ExcelJS.CellValue
  }
  styleHeaderRange(ws, 24, 24, 1, 56, false)

  // ---- HASIL PEMERIKSAAN SASARAN ----
  ws.getCell('A27').value = 'HASIL PEMERIKSAAN SASARAN'
  ws.getCell('A27').font = titleFont

  // Rekap 1: Ibu hamil/nifas/menyusui (baris 30-46, 29 kolom)
  ws.getCell('A30').value = 'REKAPITULASI IBU HAMIL/NIFAS/MENYUSUI'
  ws.getCell('A30').font = headFont
  setRowValues(ws, 31, ['Bulan/Tahun', 'Ibu Hamil', 'Ibu Menyusui', 'Jumlah Sasaran', '', '', '', 'Jumlah Ibu Hamil/Nifas/Menyusui dengan Hasil Penimbangan/Pengukuran/Pemeriksaan', '', '', '', '', '', '', 'TTD', '', '', 'PMT BUMIL KEK', '', '', 'Jumlah Ibu Hamil Mengikuti Kelas', '', 'Jumlah Ibu Nifas Mendapatkan Vit.A', '', 'Jumlah Ibu Nifas/Menyusui ', '', 'Jumlah Ibu Hamil/Nifas/Menyusui', 'Jumlah Sasaran yang Dirujuk'])
  setRowValues(ws, 32, ['', '', '', 'Datang', '', 'Tidak Datang', '', 'Berat Badan', '', 'Lingkar Lengan Atas', '', 'Tekanan Darah', '', 'Gejala TBC', 'Jumlah Ibu Hamil', 'Ibu Hamil Konsumsi TTD', '', 'Jumlah Ibu Hamil', 'Ibu Hamil Konsumsi PMT', '', '', '', '', '', 'Mengikuti KB Pasca Persalinan', '', 'Mendapatkan Edukasi'])
  setRowValues(ws, 33, ['', '', '', 'Ibu Hamil', 'Ibu Menyusui', 'Ibu Hamil', 'Ibu Menyusui', 'Hijau', 'Merah', 'Hijau', 'Merah/KEK', 'Hijau', 'Merah', '', 'Mendapatkan TTD', 'Tiap Hari', 'Tidak', 'Mendapatkan PMT', 'Tiap Hari', 'Tidak', 'Ya', 'Tidak', 'Ya', 'Tidak', 'Ya', 'Tidak', '', 'Ibu Hamil', 'Ibu Nifas/menyusui'])
  mergeAll(ws, [
    'A31:A33', 'B31:B33', 'C31:C33', 'D31:G31', 'H31:N31', 'O31:Q31', 'R31:T31', 'U31:V32', 'W31:X32', 'Y31:Z31', 'AB31:AC32',
    'D32:E32', 'F32:G32', 'H32:I32', 'J32:K32', 'L32:M32', 'N32:N33', 'P32:Q32', 'S32:T32'
  ])
  styleHeaderRange(ws, 31, 33, 1, 29)
  setRowValues(ws, 34, Array.from({ length: 29 }, (_, i) => i + 1))
  styleHeaderRange(ws, 34, 34, 1, 29, false)
  for (let b = 1; b <= 12; b++) {
    const rowNum = 34 + b
    bulanTahunCell(ws, rowNum, data.tahun, b)
    const sip = byBulan.get(b)
    const rk = data.rekapBumil[b] || {}
    const vals: (number | undefined)[] = [
      sip?.jmlBumil, sip?.jmlBusui,
      rk.bumilDatang, rk.busuiDatang, rk.tidakDatangBumil, rk.tidakDatangBusui,
      rk.bbNormal, rk.bbKurang, rk.lilaNormal, rk.lilaKek
    ]
    vals.forEach((v, i) => { if (v) ws.getCell(rowNum, 2 + i).value = v })
  }
  styleDataRange(ws, 35, 46, 1, 29)

  // Rekap 2: Bayi, balita dan apras (baris 50-66, 32 kolom)
  ws.getCell('A50').value = 'REKAPITULASI BAYI, BALITA DAN APRAS'
  ws.getCell('A50').font = headFont
  setRowValues(ws, 51, ['Bulan/Tahun', 'Bayi', 'Balita & Apras', 'Jumlah Sasaran', '', '', '', 'Jumlah Bayi/Balita/Apras dengan Hasil Penimbangan dan Pengukuran/Pemantauan/Pemeriksaan ', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'Jumlah Bayi dan Balita', '', '', '', '', '', '', 'Jumlah Balita Sakit', 'Jumlah Sasaran Dirujuk'])
  setRowValues(ws, 52, ['', '(0-6 bulan)', '(26 bulan -', 'Datang', '', 'Tidak Datang', '', 'Balita dg Ceklis Perkembangan', '', 'BB U(0-5 th)', '', '', '', 'Hasil Pengukuran PB/TB/Umur 0-5 th', '', 'Hasil Pengukuran BB/TP atau BB/TB', '', 'Hasil Pengukuran Lingkar Kepala', '', 'Lingkar Lengan Atas', '', 'Gejala TBC', '', '', '', '', '', '', '', '', 'Bayi', 'Balita/Apras'])
  setRowValues(ws, 53, ['', '', '6 Tahun)', 'Bayi', 'Balita', 'Bayi', 'Balita', 'Lengkap', 'Tidak Lengkap', 'Naik', 'Tidak Naik', 'Gizi Baik', 'Gizi Buruk', 'Normal', 'Tidak Normal', 'Gizi Baik', 'Gizi Buruk', 'Normal', 'Tidak Normal', 'Normal', 'Tidak Normal', '2 Gejala', 'Asi Exclusive', 'MP Asi', 'Imunisasi Bayi/Balita', 'Vit. A', 'Obat Cacing', 'MT Pangan Lokal', 'Edukasi', '', '(0-6 bln)', '(>=6 bln - 6 th)'])
  mergeAll(ws, [
    'A51:A53', 'D51:G51', 'H51:V51', 'W51:AC52', 'AD51:AD53', 'AE51:AF51',
    'D52:E52', 'F52:G52', 'H52:I52', 'J52:M52', 'N52:O52', 'P52:Q52', 'R52:S52', 'T52:U52'
  ])
  styleHeaderRange(ws, 51, 53, 1, 32)
  setRowValues(ws, 54, Array.from({ length: 32 }, (_, i) => i + 1))
  styleHeaderRange(ws, 54, 54, 1, 32, false)
  for (let b = 1; b <= 12; b++) {
    const rowNum = 54 + b
    bulanTahunCell(ws, rowNum, data.tahun, b)
    const rk = data.rekapBalita[b] || {}
    const vals: (number | undefined)[] = [
      rk.totalBayi, rk.totalBalita,
      rk.bayiDatang, rk.balitaDatang, rk.tidakDatangBayi, rk.tidakDatangBalita,
      rk.checklistLengkap, rk.checklistTidakLengkap, rk.bbNaik, rk.bbTidakNaik,
      undefined, undefined, // BB/U gizi baik/buruk
      rk.tbNormal, rk.tbTidakNormal,
      undefined, undefined, // BB/TB gizi baik/buruk
      undefined, undefined, // lingkar kepala normal/tidak
      rk.lilaNormal, rk.lilaTidakNormal, rk.tbc,
      rk.asiEksklusif, rk.mpasi, rk.imunisasi, rk.vitA, rk.cacing, rk.pmt, rk.edukasi,
      undefined, rk.rujukBayi, rk.rujukBalita
    ]
    vals.forEach((v, i) => { if (v) ws.getCell(rowNum, 2 + i).value = v })
  }
  styleDataRange(ws, 55, 66, 1, 32)

  // Rekap 3: Usia sekolah dan remaja (baris 70-87, 25 kolom)
  ws.getCell('A70').value = 'REKAPITULASI USIA SEKOLAH DAN REMAJA'
  ws.getCell('A70').font = headFont
  setRowValues(ws, 71, ['Bulan/Tahun', 'Jumlah Sasaran', '', '', '', '', '', 'Jumlah Usia Sekolah/Remaja dengan Hasil Penimbangan/ Pengukuran/Pemeriksaan', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'Jumlah Usia', 'Jumlah Usia'])
  setRowValues(ws, 72, ['', '6-14', '15-18', 'Datang', '', 'Tidak Datang', '', 'IMT', '', '', '', '', 'Remaja berusia ≥ 15 tahun', '', '', '', '', '', '', '', '', 'Gejala TBC', 'Skirining masalah', 'Sekolah/ Remaja', 'Sekolah/'])
  setRowValues(ws, 73, ['', 'Tahun', 'Tahun', '6-14 th', '15-18 th', '6-14 th', '15-18 th', 'Sangat Kurus', 'Kurus', 'Normal', 'Gemuk', 'Obesitas', 'Lingkar Perut (cm)', 'Tekanan Darah', '', '', 'Gula Darah', '', '', 'Remaja Putri', '', 'Memenuhi 2 -', 'Kesehatan ', 'Mendapatkan', 'Remaja'])
  setRowValues(ws, 74, ['', '', '', '', '', '', '', '', '', '', '', '', '', 'Rendah', 'Normal', 'Tinggi', 'Rendah', 'Normal', 'Tinggi', 'Anemia', 'Tidak Anemia', 'Gejala TBC', 'HEEADSSS', 'Edukasi', 'dirujuk'])
  mergeAll(ws, [
    'A71:A74', 'B71:G71', 'H71:W71', 'AD71:AD73',
    'D72:E72', 'F72:G72', 'H72:L72', 'M72:U72',
    'B73:B74', 'C73:C74', 'D73:D74', 'E73:E74', 'F73:F74', 'G73:G74', 'H73:H74', 'I73:I74', 'J73:J74', 'K73:K74', 'L73:L74', 'M73:M74',
    'N73:P73', 'Q73:S73', 'T73:U73'
  ])
  styleHeaderRange(ws, 71, 74, 1, 25)
  setRowValues(ws, 75, Array.from({ length: 25 }, (_, i) => i + 1))
  styleHeaderRange(ws, 75, 75, 1, 25, false)
  for (let b = 1; b <= 12; b++) {
    const rowNum = 75 + b
    bulanTahunCell(ws, rowNum, data.tahun, b)
    const rk = data.rekapRemaja[b] || {}
    if (rk.remaja) ws.getCell(rowNum, 2).value = rk.remaja
    if (rk.imtNormal) ws.getCell(rowNum, 10).value = rk.imtNormal
  }
  styleDataRange(ws, 76, 87, 1, 25)

  // Rekap 4: Dewasa dan lansia (baris 91-109, 38 kolom)
  ws.getCell('A91').value = 'REKAPITULASI DEWASA DAN LANSIA'
  ws.getCell('A91').font = headFont
  ws.getCell('A92').value = 'Bulan/Tahun'
  ws.getCell('B92').value = 'Hasil Penimbangan / Pengukuran / Pemeriksaan '
  ws.getCell(92, 37).value = 'Jumlah usia'
  ws.getCell(92, 38).value = 'Jumlah Usia'
  setRowValues(ws, 93, ['', 'IMT', '', '', '', '', 'Usia Dewasa dan Lansia', '', '', '', '', '', '', '', '', '', '', 'Skrining PUMA/PPOK Dewasa >= 40 th', '', 'Lansia'])
  ws.getCell(93, 37).value = 'Dewasa dan'
  ws.getCell(93, 38).value = 'Dewasa dan'
  setRowValues(ws, 94, ['', 'Sangat Kurus', 'Kurus', 'Normal', 'Gemuk', 'Obesitas', 'Lingkar Perut (cm)', '', 'Tekanan Darah', '', '', 'Gula Darah', '', '', 'Skrining Kesehatan Jiwa >=18 th', '', '', 'Tinggi', 'Normal', 'Tingkat Ketergantungan (AKS)', '', '', '', '', 'Skrining Lansia Sederhana (SKILAS)', '', '', '', 'Skrining Lansia Sederhana (SKILAS)', '', '', '', 'Skrining Lansia Sederhana (SKILAS)', '', '', ''])
  ws.getCell(94, 37).value = 'Lansia'
  ws.getCell(94, 38).value = 'Lansia'
  setRowValues(ws, 95, ['', '', '', '', '', '', 'Laki-laki >90cm', 'Perempuan >80cm', 'Rendah', 'Normal', 'Tinggi', 'Rendah', 'Normal', 'Tinggi', 'Kesehatan Jiwa', '', '', '', '', 'Kategori A', 'Kategori B', '', 'Kategori C', '', 'Kognitif', '', 'Gerak', '', 'Malnutrisi', '', 'Pendengaran', '', 'Penglihatan', '', 'Depresi', ''])
  ws.getCell(95, 37).value = 'mendapatkan'
  ws.getCell(95, 38).value = 'dirujuk'
  setRowValues(ws, 96, ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '<6', '>=6', 'Jika Pertayaan 17=ya', '<6', '>6', 'M', 'R', 'S', 'B', 'T', 'Ya', 'Tidak', 'Ya', 'Tidak', 'Ya', 'Tidak', 'Ya', 'Tidak', 'Ya', 'Tidak', 'Ya', 'Tidak'])
  ws.getCell(96, 37).value = 'Edukasi'
  mergeAll(ws, [
    'A92:A96', 'B92:AJ92',
    'B93:F93', 'G93:Q93', 'R93:S93', 'T93:AJ93',
    'B94:B96', 'C94:C96', 'D94:D96', 'E94:E96', 'F94:F96', 'G94:H94', 'I94:K94', 'L94:N94', 'O94:Q94', 'R94:R95', 'S94:S95',
    'T94:X94', 'Y94:AB94', 'AC94:AF94', 'AG94:AJ94',
    'G95:G96', 'H95:H96', 'I95:I96', 'J95:J96', 'K95:K96', 'L95:L96', 'M95:M96', 'N95:N96', 'O95:Q95',
    'U95:V95', 'W95:X95', 'Y95:Z95', 'AA95:AB95', 'AC95:AD95', 'AE95:AF95', 'AG95:AH95', 'AI95:AJ95'
  ])
  styleHeaderRange(ws, 92, 96, 1, 38)
  setRowValues(ws, 97, Array.from({ length: 38 }, (_, i) => i + 1))
  styleHeaderRange(ws, 97, 97, 1, 38, false)
  for (let b = 1; b <= 12; b++) {
    const rowNum = 97 + b
    bulanTahunCell(ws, rowNum, data.tahun, b)
    const rk = data.rekapLansia[b] || {}
    if (rk.tensiTinggi) ws.getCell(rowNum, 11).value = rk.tensiTinggi
    if (rk.gulaDarahTinggi) ws.getCell(rowNum, 14).value = rk.gulaDarahTinggi
    if (rk.mandiri) ws.getCell(rowNum, 20).value = rk.mandiri
    if (rk.tidakMandiri) ws.getCell(rowNum, 23).value = rk.tidakMandiri
  }
  styleDataRange(ws, 98, 109, 1, 38)

  ws.columns.forEach((c, i) => {
    if (i === 0) c.width = 12
    else if (i === 1) c.width = 14
    else c.width = 7
  })
  return ws
}

// ---------------------------------------------------------------
// Perakit workbook lengkap (urutan sheet sama dengan file resmi)
// ---------------------------------------------------------------
export async function buildDesaWorkbook(data: DesaWorkbookData): Promise<ExcelJS.Workbook> {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'SIP Lampung Timur'
  wb.created = new Date()

  addLaporanSheet(wb, 'PENDIDIKAN', 'BIDANG PENDIDIKAN', data.desaNama, data.pendidikan)
  addDatabaseSheet(wb, data.desaNama, data.posyandus)
  addSip6Sheet(wb, data)
  addSip7Sheet(wb, data)
  addPuSheet(wb, data.desaNama, data.pu)
  addPrSheet(wb, data.desaNama, data.pr)
  addLaporanSheet(wb, 'TRANTIB LINMAS', 'BIDANG TRANTIBUM LINMAS', data.desaNama, data.trantib)
  addLaporanSheet(wb, 'SOSIAL', 'BIDANG SOSIAL', data.desaNama, data.sosial)

  return wb
}

export async function buildDesaWorkbookBuffer(data: DesaWorkbookData): Promise<Buffer> {
  const wb = await buildDesaWorkbook(data)
  const buf = await wb.xlsx.writeBuffer()
  return Buffer.from(buf as ArrayBuffer)
}
