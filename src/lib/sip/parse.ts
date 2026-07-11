// Parser workbook resmi REKAP DESA (.xlsx) → struktur siap upsert.
// Toleran terhadap data lapangan: tanggal campur serial Excel & teks Indonesia,
// posisi tabel bergeser (deteksi via judul seksi & baris penomoran), sel kosong.
import * as XLSX from 'xlsx'

export interface ParsedPosyandu {
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
  statusBangunan: 'MILIK_SENDIRI' | 'MENUMPANG'
  danaSehat: boolean
  jumlahKader: number
  strata: 'PRATAMA' | 'MADYA' | 'PURNAMA' | 'MANDIRI'
  kegiatanIntegrasi: string
}

export interface ParsedLaporan {
  tanggal: Date
  posyandu: string
  nik: string
  nama: string
  alamat: string
  hal: string
  tl: string
  btl: string
  noSurat?: string
  lokasi?: string
}

export interface ParsedPr {
  tanggal: Date
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

export interface ParsedSasaran {
  kategori: 'IBU_HAMIL' | 'BAYI_BALITA'
  nama: string
  jenisKelamin: 'L' | 'P' | null
  tanggalLahir: Date | null
  namaIbu: string | null
  namaAyah: string | null
  namaSuami: string | null
  namaBayi: string | null
  months: boolean[] // index 0 = JAN
}

export interface ParsedWorkbook {
  desaNama: string | null
  tahunFile: number | null
  posyandus: ParsedPosyandu[]
  sip6: Record<string, number | string>[] // + bulan
  sip7: Record<string, number>[] // + bulan
  sasaran: ParsedSasaran[]
  pendidikan: ParsedLaporan[]
  pu: ParsedLaporan[]
  pr: ParsedPr[]
  trantib: ParsedLaporan[]
  sosial: ParsedLaporan[]
}

type Row = (string | number | Date | null | undefined)[]

const MONTHS_MAP: Record<string, number> = {
  JANUARI: 1, FEBRUARI: 2, MARET: 3, APRIL: 4, MEI: 5, JUNI: 6,
  JULI: 7, AGUSTUS: 8, SEPTEMBER: 9, OKTOBER: 10, NOVEMBER: 11, DESEMBER: 12
}

const MONTH_TEXT: Record<string, number> = {
  jan: 1, januari: 1, feb: 2, febuari: 2, februari: 2, pebruari: 2, mar: 3, maret: 3,
  apr: 4, april: 4, mei: 5, jun: 6, juni: 6, jul: 7, juli: 7, agu: 8, agustus: 8,
  sep: 9, september: 9, okt: 10, oktober: 10, nov: 11, november: 11, nopember: 11,
  des: 12, desember: 12
}

export function parseIntSafe(val: unknown): number {
  if (val === null || val === undefined || val === '') return 0
  const n = parseFloat(String(val).replace(',', '.'))
  return isNaN(n) ? 0 : Math.round(n)
}

export function parseExcelDate(val: unknown): Date | null {
  if (val === null || val === undefined || val === '') return null
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val
  if (typeof val === 'number' && val > 20000 && val < 60000) {
    // Serial Excel (epoch 1899-12-30)
    return new Date(Math.round((val - 25569) * 86400 * 1000))
  }
  const s = String(val).trim()
  // "9 Febuari 2025" / "20 Juli 2025"
  const m = s.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/)
  if (m) {
    const month = MONTH_TEXT[m[2].toLowerCase()]
    if (month) return new Date(Date.UTC(parseInt(m[3]), month - 1, parseInt(m[1])))
  }
  // dd/mm/yyyy atau dd-mm-yyyy
  const m2 = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
  if (m2) return new Date(Date.UTC(parseInt(m2[3]), parseInt(m2[2]) - 1, parseInt(m2[1])))
  const d = new Date(s)
  return isNaN(d.getTime()) ? null : d
}

function sheetRows(wb: XLSX.WorkBook, name: string): Row[] | null {
  const ws = wb.Sheets[name]
  if (!ws) return null
  return XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' }) as Row[]
}

function findDesaName(rows: Row[] | null): string | null {
  if (!rows) return null
  for (let r = 0; r < Math.min(rows.length, 6); r++) {
    const row = rows[r] || []
    for (let c = 0; c < Math.min(row.length, 6); c++) {
      const val = String(row[c] ?? '').trim()
      if (/^:/.test(val) && val.length > 2) return val.replace(/^:\s*/, '').trim()
      if (/^DESA\b/i.test(val)) {
        const next = String(row[c + 1] ?? '').replace(/^:\s*/, '').trim()
        if (next) return next
      }
    }
  }
  return null
}

/** Baris penomoran (1,2,3,...) dipakai sebagai peta kolom karena posisi bisa bergeser. */
function findNumberingRow(rows: Row[], from: number, to: number): { index: number; colMap: Record<number, number> } | null {
  for (let r = from; r <= Math.min(to, rows.length - 1); r++) {
    const row = rows[r] || []
    const first = parseIntSafe(row[0])
    const second = parseIntSafe(row[1])
    if (first === 1 && second === 2) {
      const colMap: Record<number, number> = {}
      for (let c = 0; c < row.length; c++) {
        const v = parseIntSafe(row[c])
        if (v > 0 && !(v in colMap)) colMap[v] = c
      }
      // Baris data pertama juga bisa berpola 1,2,... — pastikan monoton & padat
      if (Object.keys(colMap).length >= 5) return { index: r, colMap }
    }
  }
  return null
}

// ---------------- DATABASE ----------------
function parseDatabase(rows: Row[] | null): ParsedPosyandu[] {
  if (!rows) return []
  const out: ParsedPosyandu[] = []
  // Cari baris header "NO | NAMA POSYANDU"
  let headerIdx = -1
  for (let r = 0; r < Math.min(rows.length, 10); r++) {
    const a = String(rows[r]?.[0] ?? '').trim().toUpperCase()
    const b = String(rows[r]?.[1] ?? '').trim().toUpperCase()
    if (a === 'NO' && b.includes('POSYANDU')) { headerIdx = r; break }
  }
  if (headerIdx === -1) return []
  for (let r = headerIdx + 2; r < rows.length; r++) {
    const row = rows[r] || []
    const nama = String(row[1] ?? '').trim()
    const noVal = String(row[0] ?? '').trim().toUpperCase()
    if (noVal === 'JUMLAH') break
    if (!nama) continue
    const milik = String(row[11] ?? '').trim()
    const menumpang = String(row[12] ?? '').trim()
    const danaAda = String(row[13] ?? '').trim()
    const strataRaw = String(row[16] ?? '').trim().toUpperCase()
    const strata = (['PRATAMA', 'MADYA', 'PURNAMA', 'MANDIRI'] as const).find(s => strataRaw.startsWith(s)) || 'MADYA'
    out.push({
      nama,
      hariBuka: String(row[2] ?? '').trim(),
      jumlahRumah: parseIntSafe(row[3]),
      jumlahKK: parseIntSafe(row[4]),
      jumlahPenduduk: parseIntSafe(row[5]),
      jumlahAnak05: parseIntSafe(row[6]),
      jumlahRemaja: parseIntSafe(row[7]),
      jumlahProduktif: parseIntSafe(row[8]),
      jumlahLansia: parseIntSafe(row[9]),
      jumlahDisabilitas: parseIntSafe(row[10]),
      statusBangunan: milik && !menumpang ? 'MILIK_SENDIRI' : 'MENUMPANG',
      danaSehat: /ada/i.test(danaAda) && !/tidak/i.test(danaAda),
      jumlahKader: parseIntSafe(row[15]),
      strata,
      kegiatanIntegrasi: String(row[17] ?? '').trim(),
    })
  }
  return out
}

// ---------------- SIP 6 ----------------
const SIP6_COLS: Record<number, string> = {
  3: 'bayiBaruL', 4: 'bayiBaruP', 5: 'bayiLamaL', 6: 'bayiLamaP',
  7: 'balitaBaruL', 8: 'balitaBaruP', 9: 'balitaLamaL', 10: 'balitaLamaP',
  11: 'anakBaruL', 12: 'anakBaruP', 13: 'anakLamaL', 14: 'anakLamaP',
  15: 'prodBaruL', 16: 'prodBaruP', 17: 'prodLamaL', 18: 'prodLamaP',
  19: 'lansiaBaruL', 20: 'lansiaBaruP', 21: 'lansiaLamaL', 22: 'lansiaLamaP',
  23: 'wus', 24: 'pus', 25: 'ibuHamil', 26: 'ibuMenyusui',
  27: 'kaderL', 28: 'kaderP', 29: 'plkbL', 30: 'plkbP', 31: 'medisL', 32: 'medisP',
  33: 'lahirL', 34: 'lahirP', 35: 'meninggalL', 36: 'meninggalP',
}

function parseSip6Monthly(rows: Row[] | null): Record<string, number | string>[] {
  if (!rows) return []
  const numbering = findNumberingRow(rows, 5, 15)
  if (!numbering) return []
  const { index, colMap } = numbering
  const out: Record<string, number | string>[] = []
  for (let r = index + 1; r <= Math.min(index + 14, rows.length - 1); r++) {
    const row = rows[r] || []
    const bulan = MONTHS_MAP[String(row[colMap[2]] ?? '').trim().toUpperCase()]
    if (!bulan) continue
    const rec: Record<string, number | string> = { bulan }
    let total = 0
    for (const [num, field] of Object.entries(SIP6_COLS)) {
      const v = parseIntSafe(row[colMap[parseInt(num)]])
      rec[field] = v
      total += v
    }
    const ket = String(row[colMap[37]] ?? '').trim()
    if (ket) rec.keterangan = ket
    if (total > 0 || ket) out.push(rec)
  }
  return out
}

function parseSip6Tahun(rows: Row[] | null): number | null {
  if (!rows) return null
  for (let r = 20; r < Math.min(rows.length, 32); r++) {
    const a = String(rows[r]?.[0] ?? '').trim().toUpperCase()
    if (a.startsWith('TAHUN')) {
      const v = parseIntSafe(rows[r]?.[1]) || parseIntSafe(a.replace(/[^0-9]/g, ''))
      if (v > 2000 && v < 2100) return v
    }
  }
  return null
}

function parseSasaran(rows: Row[] | null): ParsedSasaran[] {
  if (!rows) return []
  const out: ParsedSasaran[] = []

  const readSection = (titleRe: RegExp, kategori: 'IBU_HAMIL' | 'BAYI_BALITA') => {
    const titleIdx = rows.findIndex(r => titleRe.test(String(r?.[0] ?? '').trim()))
    if (titleIdx === -1) return
    const numbering = findNumberingRow(rows, titleIdx + 1, titleIdx + 6)
    if (!numbering) return
    for (let r = numbering.index + 1; r < rows.length; r++) {
      const row = rows[r] || []
      const nameCell = String(row[1] ?? '').trim()
      // Berhenti saat menyentuh seksi berikutnya atau jeda kosong panjang
      const colA = String(row[0] ?? '').trim().toUpperCase()
      if (colA.startsWith('DATA SASARAN') && r > numbering.index + 1) break
      if (!nameCell) {
        const next1 = String(rows[r + 1]?.[1] ?? '').trim()
        const next2 = String(rows[r + 2]?.[1] ?? '').trim()
        if (!next1 && !next2) break
        continue
      }
      if (kategori === 'IBU_HAMIL') {
        const months = Array.from({ length: 12 }, (_, m) => Boolean(String(row[4 + m] ?? '').trim()))
        out.push({
          kategori, nama: nameCell, jenisKelamin: 'P', tanggalLahir: null,
          namaIbu: nameCell, namaAyah: null,
          namaSuami: String(row[2] ?? '').trim() || null,
          namaBayi: String(row[3] ?? '').trim() || null,
          months,
        })
      } else {
        const jkRaw = String(row[2] ?? '').trim().toUpperCase()
        const months = Array.from({ length: 12 }, (_, m) => Boolean(String(row[6 + m] ?? '').trim()))
        out.push({
          kategori, nama: nameCell,
          jenisKelamin: jkRaw === 'L' || jkRaw === 'P' ? jkRaw : null,
          tanggalLahir: parseExcelDate(row[3]),
          namaIbu: String(row[4] ?? '').trim() || null,
          namaAyah: String(row[5] ?? '').trim() || null,
          namaSuami: null, namaBayi: null,
          months,
        })
      }
    }
  }

  readSection(/^DATA SASARAN IBU HAMIL/i, 'IBU_HAMIL')
  readSection(/^DATA SASARAN BAYI/i, 'BAYI_BALITA')
  return out
}

// ---------------- SIP 7 ----------------
const SIP7_COLS: Record<number, string> = {
  3: 'jmlBumil', 4: 'bumilDiperiksa', 5: 'bumilFeTab', 6: 'jmlBusui',
  7: 'kbKondom', 8: 'kbPil', 9: 'kbImplant', 10: 'kbMOP', 11: 'kbMOW', 12: 'kbIUD', 13: 'kbSuntik', 14: 'kbLainnya',
  15: 'balitaS_L', 16: 'balitaS_P', 17: 'balitaK_L', 18: 'balitaK_P', 19: 'balitaD_L', 20: 'balitaD_P', 21: 'balitaN_L', 22: 'balitaN_P',
  23: 'vitA_L', 24: 'vitA_P', 25: 'pmt_L', 26: 'pmt_P', 27: 'imTT',
  28: 'imBCG_L', 29: 'imBCG_P', 30: 'imDPT1_L', 31: 'imDPT1_P', 32: 'imDPT2_L', 33: 'imDPT2_P', 34: 'imDPT3_L', 35: 'imDPT3_P',
  36: 'imPolio1_L', 37: 'imPolio1_P', 38: 'imPolio2_L', 39: 'imPolio2_P', 40: 'imPolio3_L', 41: 'imPolio3_P', 42: 'imPolio4_L', 43: 'imPolio4_P',
  44: 'imCampak_L', 45: 'imCampak_P', 46: 'imHepB1_L', 47: 'imHepB1_P', 48: 'imHepB2_L', 49: 'imHepB2_P', 50: 'imHepB3_L', 51: 'imHepB3_P',
  52: 'diareJml_L', 53: 'diareJml_P', 54: 'diareOralit_L', 55: 'diareOralit_P',
}

function parseSip7Monthly(rows: Row[] | null): Record<string, number>[] {
  if (!rows) return []
  const numbering = findNumberingRow(rows, 5, 15)
  if (!numbering) return []
  const { index, colMap } = numbering
  const out: Record<string, number>[] = []
  for (let r = index + 1; r <= Math.min(index + 14, rows.length - 1); r++) {
    const row = rows[r] || []
    const bulan = MONTHS_MAP[String(row[colMap[2]] ?? '').trim().toUpperCase()]
    if (!bulan) continue
    const rec: Record<string, number> = { bulan }
    let total = 0
    for (const [num, field] of Object.entries(SIP7_COLS)) {
      const v = parseIntSafe(row[colMap[parseInt(num)]])
      rec[field] = v
      total += v
    }
    if (total > 0) out.push(rec)
  }
  return out
}

// ---------------- Laporan bidang ----------------
function parseLaporanSheet(rows: Row[] | null, layout: 'standard' | 'pu' | 'pr'): (ParsedLaporan | ParsedPr)[] {
  if (!rows) return []
  const numbering = findNumberingRow(rows, 2, 10)
  if (!numbering) return []
  const out: (ParsedLaporan | ParsedPr)[] = []
  for (let r = numbering.index + 1; r < rows.length; r++) {
    const row = rows[r] || []
    const hasContent = row.slice(1, 8).some(v => String(v ?? '').trim())
    if (!hasContent) {
      const nextHas = (rows[r + 1] || []).slice(1, 8).some(v => String(v ?? '').trim())
      if (!nextHas) break
      continue
    }
    const tanggal = parseExcelDate(row[1]) || new Date()
    if (layout === 'standard') {
      const nama = String(row[4] ?? '').trim()
      if (!nama) continue
      out.push({
        tanggal,
        posyandu: String(row[2] ?? '').trim(),
        nik: String(row[3] ?? '').trim(),
        nama,
        alamat: String(row[5] ?? '').trim(),
        hal: String(row[6] ?? '').trim(),
        tl: String(row[7] ?? '').trim(),
        btl: String(row[8] ?? '').trim(),
      })
    } else if (layout === 'pu') {
      const nama = String(row[4] ?? '').trim()
      if (!nama) continue
      out.push({
        tanggal,
        posyandu: String(row[2] ?? '').trim(),
        noSurat: String(row[3] ?? '').trim(),
        nama,
        nik: String(row[5] ?? '').trim(),
        alamat: String(row[6] ?? '').trim(),
        hal: String(row[7] ?? '').trim(),
        lokasi: String(row[8] ?? '').trim(),
        tl: String(row[9] ?? '').trim(),
        btl: String(row[10] ?? '').trim(),
      })
    } else {
      const nama = String(row[3] ?? '').trim()
      if (!nama) continue
      out.push({
        tanggal,
        posyandu: String(row[2] ?? '').trim(),
        nama,
        nik: String(row[4] ?? '').trim(),
        alamat: String(row[5] ?? '').trim(),
        fcKK: Boolean(String(row[6] ?? '').trim()),
        fcKTP: Boolean(String(row[7] ?? '').trim()),
        sp: Boolean(String(row[8] ?? '').trim()),
        suket: Boolean(String(row[9] ?? '').trim()),
        fotoRumah: Boolean(String(row[10] ?? '').trim()),
        tl: String(row[11] ?? '').trim(),
        btl: String(row[12] ?? '').trim(),
      })
    }
  }
  return out
}

// ---------------- Entry point ----------------
export function parseDesaWorkbook(buffer: Buffer): ParsedWorkbook {
  const wb = XLSX.read(buffer, { type: 'buffer', cellDates: false })

  const dbRows = sheetRows(wb, 'DATABASE')
  const sip6Rows = sheetRows(wb, 'KESEHATAN SIP 6')
  const sip7Rows = sheetRows(wb, 'KESEHATAN SIP 7')

  const desaNama =
    findDesaName(dbRows) ||
    findDesaName(sip6Rows) ||
    findDesaName(sheetRows(wb, 'PENDIDIKAN'))

  return {
    desaNama,
    tahunFile: parseSip6Tahun(sip6Rows),
    posyandus: parseDatabase(dbRows),
    sip6: parseSip6Monthly(sip6Rows),
    sip7: parseSip7Monthly(sip7Rows),
    sasaran: parseSasaran(sip6Rows),
    pendidikan: parseLaporanSheet(sheetRows(wb, 'PENDIDIKAN'), 'standard') as ParsedLaporan[],
    pu: parseLaporanSheet(sheetRows(wb, 'PU'), 'pu') as ParsedLaporan[],
    pr: parseLaporanSheet(sheetRows(wb, 'PR'), 'pr') as ParsedPr[],
    trantib: parseLaporanSheet(sheetRows(wb, 'TRANTIB LINMAS'), 'standard') as ParsedLaporan[],
    sosial: parseLaporanSheet(sheetRows(wb, 'SOSIAL'), 'standard') as ParsedLaporan[],
  }
}
