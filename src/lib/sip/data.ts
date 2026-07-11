// Mengambil & merakit data satu desa menjadi DesaWorkbookData.
// Data bulanan SIP 6/7 diagregasi (dijumlah) dari seluruh posyandu di desa,
// mengikuti format file resmi yang berlevel desa.
import { prisma } from '@/lib/prisma'
import type {
  DesaWorkbookData, LaporanRow, PuRow, PrRow, Sip6Agg, Sip7Agg,
  SasaranBumilRow, SasaranBalitaRow
} from './workbook'

const SIP6_NUM_FIELDS = [
  'bayiBaruL', 'bayiBaruP', 'bayiLamaL', 'bayiLamaP',
  'balitaBaruL', 'balitaBaruP', 'balitaLamaL', 'balitaLamaP',
  'anakBaruL', 'anakBaruP', 'anakLamaL', 'anakLamaP',
  'prodBaruL', 'prodBaruP', 'prodLamaL', 'prodLamaP',
  'lansiaBaruL', 'lansiaBaruP', 'lansiaLamaL', 'lansiaLamaP',
  'wus', 'pus', 'ibuHamil', 'ibuMenyusui',
  'kaderL', 'kaderP', 'plkbL', 'plkbP', 'medisL', 'medisP',
  'lahirL', 'lahirP', 'meninggalL', 'meninggalP'
]

const SIP7_NUM_FIELDS = [
  'jmlBumil', 'bumilDiperiksa', 'bumilFeTab', 'jmlBusui',
  'kbKondom', 'kbPil', 'kbImplant', 'kbMOP', 'kbMOW', 'kbIUD', 'kbSuntik', 'kbLainnya',
  'balitaS_L', 'balitaS_P', 'balitaK_L', 'balitaK_P', 'balitaD_L', 'balitaD_P', 'balitaN_L', 'balitaN_P',
  'vitA_L', 'vitA_P', 'pmt_L', 'pmt_P', 'imTT',
  'imBCG_L', 'imBCG_P', 'imDPT1_L', 'imDPT1_P', 'imDPT2_L', 'imDPT2_P', 'imDPT3_L', 'imDPT3_P',
  'imPolio1_L', 'imPolio1_P', 'imPolio2_L', 'imPolio2_P', 'imPolio3_L', 'imPolio3_P', 'imPolio4_L', 'imPolio4_P',
  'imCampak_L', 'imCampak_P', 'imHepB1_L', 'imHepB1_P', 'imHepB2_L', 'imHepB2_P', 'imHepB3_L', 'imHepB3_P',
  'diareJml_L', 'diareJml_P', 'diareOralit_L', 'diareOralit_P'
]

function aggregateByBulan<T extends { bulan: number }>(rows: Record<string, unknown>[], fields: string[]): T[] {
  const map = new Map<number, Record<string, number> & { bulan: number }>()
  for (const r of rows) {
    const bulan = r.bulan as number
    let agg = map.get(bulan)
    if (!agg) {
      agg = { bulan }
      map.set(bulan, agg)
    }
    for (const f of fields) {
      agg[f] = (agg[f] || 0) + ((r[f] as number) || 0)
    }
    // Keterangan: gabungkan teks unik antar posyandu
    if (typeof r.keterangan === 'string' && r.keterangan.trim()) {
      const existing = (agg as Record<string, unknown>).keterangan as string | undefined
      if (!existing) (agg as Record<string, unknown>).keterangan = r.keterangan.trim()
      else if (!existing.includes(r.keterangan.trim())) (agg as Record<string, unknown>).keterangan = `${existing}; ${r.keterangan.trim()}`
    }
  }
  return Array.from(map.values()).sort((a, b) => a.bulan - b.bulan) as T[]
}

function aggregateRekap(rows: { bulan: number; rekap: unknown }[]): Record<number, Record<string, number>> {
  const out: Record<number, Record<string, number>> = {}
  for (const r of rows) {
    if (!r.rekap || typeof r.rekap !== 'object') continue
    const agg = (out[r.bulan] ||= {})
    for (const [k, v] of Object.entries(r.rekap as Record<string, unknown>)) {
      if (typeof v === 'number') agg[k] = (agg[k] || 0) + v
    }
  }
  return out
}

const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agu', 'sep', 'okt', 'nov', 'des'] as const

export async function getDesaWorkbookData(desaId: string, tahun: number): Promise<DesaWorkbookData | null> {
  const desa = await prisma.desa.findUnique({
    where: { id: desaId },
    include: { kecamatan: true, posyandus: { orderBy: { nama: 'asc' } } }
  })
  if (!desa) return null

  const posyanduIds = desa.posyandus.map(p => p.id)
  const wherePosyandu = { posyanduId: { in: posyanduIds } }

  const [sip6Rows, sip7Rows, sasaranRows, laporanRows, prRows] = await Promise.all([
    prisma.sip6Bulanan.findMany({ where: { ...wherePosyandu, tahun } }),
    prisma.sip7Bulanan.findMany({ where: { ...wherePosyandu, tahun } }),
    prisma.sasaranIndividu.findMany({ where: { ...wherePosyandu, tahun }, orderBy: { nama: 'asc' } }),
    prisma.laporanPengaduan.findMany({ where: wherePosyandu, include: { posyandu: true }, orderBy: { tanggal: 'asc' } }),
    prisma.laporanPR.findMany({ where: wherePosyandu, include: { posyandu: true }, orderBy: { tanggal: 'asc' } }),
  ])

  const mapLaporan = (bidang: string): LaporanRow[] =>
    laporanRows.filter(l => l.bidang === bidang && new Date(l.tanggal).getFullYear() === tahun).map(l => ({
      tanggal: l.tanggal,
      posyandu: l.posyandu.nama,
      nik: l.nik || '',
      nama: l.nama,
      alamat: l.alamat || '',
      hal: l.halPengaduan,
      tl: l.status === 'TL' ? (l.keteranganTL || 'TL') : (l.keteranganTL || ''),
      btl: l.status === 'BTL' ? (l.keteranganBTL || '-') : (l.keteranganBTL || ''),
    }))

  const mapPu = (): PuRow[] =>
    laporanRows.filter(l => l.bidang === 'PU' && new Date(l.tanggal).getFullYear() === tahun).map(l => {
      // halPengaduan bidang PU disimpan "noSurat|keluhan|lokasi" bila lengkap; fallback teks polos
      const parts = l.halPengaduan.split('|')
      return {
        tanggal: l.tanggal,
        posyandu: l.posyandu.nama,
        noSurat: parts.length >= 3 ? parts[0] : '',
        nama: l.nama,
        nik: l.nik || '',
        alamat: l.alamat || '',
        hal: parts.length >= 3 ? parts[1] : l.halPengaduan,
        lokasi: parts.length >= 3 ? parts[2] : '',
        tl: l.status === 'TL' ? (l.keteranganTL || 'TL') : (l.keteranganTL || ''),
        btl: l.status === 'BTL' ? (l.keteranganBTL || '') : (l.keteranganBTL || ''),
      }
    })

  const sasaranBumil: SasaranBumilRow[] = sasaranRows
    .filter(s => s.kategori === 'IBU_HAMIL')
    .map(s => ({
      namaIbu: s.namaIbu || s.nama,
      namaSuami: s.namaSuami || '',
      namaBayi: s.namaBayi || '',
      months: MONTH_KEYS.map(k => Boolean((s as unknown as Record<string, unknown>)[k])),
    }))

  const sasaranBalita: SasaranBalitaRow[] = sasaranRows
    .filter(s => s.kategori === 'BAYI_BALITA')
    .map(s => ({
      nama: s.nama,
      jenisKelamin: s.jenisKelamin || '',
      tanggalLahir: s.tanggalLahir,
      namaIbu: s.namaIbu || '',
      namaAyah: s.namaAyah || '',
      months: MONTH_KEYS.map(k => Boolean((s as unknown as Record<string, unknown>)[k])),
    }))

  return {
    desaNama: desa.nama.toUpperCase(),
    tahun,
    posyandus: desa.posyandus.map(p => ({
      nama: p.nama,
      hariBuka: p.hariBuka,
      jumlahRumah: p.jumlahRumah,
      jumlahKK: p.jumlahKK,
      jumlahPenduduk: p.jumlahPenduduk,
      jumlahAnak05: p.jumlahAnak05,
      jumlahRemaja: p.jumlahRemaja,
      jumlahProduktif: p.jumlahProduktif,
      jumlahLansia: p.jumlahLansia,
      jumlahDisabilitas: p.jumlahDisabilitas,
      statusBangunan: p.statusBangunan,
      danaSehat: p.danaSehatter,
      jumlahKader: p.jumlahKader,
      strata: p.strata,
      kegiatanIntegrasi: p.kegiatanIntegrasi || '',
    })),
    sip6: aggregateByBulan<Sip6Agg>(sip6Rows as unknown as Record<string, unknown>[], SIP6_NUM_FIELDS),
    sip7: aggregateByBulan<Sip7Agg>(sip7Rows as unknown as Record<string, unknown>[], SIP7_NUM_FIELDS),
    rekapBumil: aggregateRekap(sip7Rows.map(r => ({ bulan: r.bulan, rekap: r.rekapBumil }))),
    rekapBalita: aggregateRekap(sip7Rows.map(r => ({ bulan: r.bulan, rekap: r.rekapBalita }))),
    rekapRemaja: aggregateRekap(sip7Rows.map(r => ({ bulan: r.bulan, rekap: r.rekapRemaja }))),
    rekapLansia: aggregateRekap(sip7Rows.map(r => ({ bulan: r.bulan, rekap: r.rekapLansia }))),
    sasaranBumil,
    sasaranBalita,
    pendidikan: mapLaporan('PENDIDIKAN'),
    pu: mapPu(),
    pr: prRows.filter(l => new Date(l.tanggal).getFullYear() === tahun).map(l => ({
      tanggal: l.tanggal,
      posyandu: l.posyandu.nama,
      nama: l.nama,
      nik: l.nik || '',
      alamat: l.alamat || '',
      fcKK: l.fcKK,
      fcKTP: l.fcKTP,
      sp: l.suratPermohonan,
      suket: l.suketPenghasilan,
      fotoRumah: l.fotoKondisiRumah,
      tl: l.status === 'TL' ? (l.keteranganTL || 'SUDAH') : (l.keteranganTL || ''),
      btl: l.status === 'BTL' ? (l.keteranganBTL || '') : (l.keteranganBTL || ''),
    })),
    trantib: mapLaporan('TRANTIB'),
    sosial: mapLaporan('SOSIAL'),
  }
}
