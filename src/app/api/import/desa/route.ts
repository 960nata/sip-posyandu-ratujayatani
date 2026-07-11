// POST /api/import/desa — import workbook resmi REKAP DESA (.xlsx).
// FormData: file (wajib), desaId (opsional; auto-deteksi dari header "DESA : X"),
// tahun (opsional; fallback ke sel "TAHUN :" di sheet SIP 6, lalu tahun berjalan).
// Bisa dipakai 3 level: desa (file sendiri), kecamatan & kabupaten (file desa mana pun
// dalam wilayahnya). Data numerik bulanan di-upsert, baris laporan dideduplikasi.
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseDesaWorkbook } from '@/lib/sip/parse'
import { resolveRequester } from '@/lib/sip/access'
import type { User } from '@prisma/client'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

function normalizeName(str: string): string {
  return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

async function resolveTargetDesa(requester: User, desaIdParam: string | null, detectedName: string | null) {
  if (requester.role === 'OPERATOR_DESA' || requester.role === 'OPERATOR_POSYANDU') {
    let desaId = requester.desaId
    if (!desaId && requester.posyanduId) {
      const pos = await prisma.posyandu.findUnique({ where: { id: requester.posyanduId } })
      desaId = pos?.desaId ?? null
    }
    return desaId ? prisma.desa.findUnique({ where: { id: desaId }, include: { posyandus: true } }) : null
  }

  if (desaIdParam) {
    const desa = await prisma.desa.findUnique({ where: { id: desaIdParam }, include: { posyandus: true } })
    if (!desa) return null
    if (requester.role === 'ADMIN_KECAMATAN' && desa.kecamatanId !== requester.kecamatanId) return null
    return desa
  }

  // Auto-deteksi dari header file
  if (!detectedName) return null
  const target = normalizeName(detectedName)
  const candidates = await prisma.desa.findMany({
    where: requester.role === 'ADMIN_KECAMATAN' && requester.kecamatanId
      ? { kecamatanId: requester.kecamatanId }
      : {},
    include: { posyandus: true },
  })
  const matches = candidates.filter(d => normalizeName(d.nama) === target)
  if (matches.length === 1) return matches[0]
  return null
}

export async function POST(request: Request) {
  const requester = await resolveRequester()
  if (!requester) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (requester.role === 'VIEWER') {
    return NextResponse.json({ error: 'Role Anda tidak diizinkan import data' }, { status: 403 })
  }

  try {
    const form = await request.formData()
    const file = form.get('file')
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'File .xlsx wajib diunggah' }, { status: 400 })
    }
    const buffer = Buffer.from(await file.arrayBuffer())
    const parsed = parseDesaWorkbook(buffer)

    const desa = await resolveTargetDesa(requester, (form.get('desaId') as string) || null, parsed.desaNama)
    if (!desa) {
      return NextResponse.json({
        error: parsed.desaNama
          ? `Desa "${parsed.desaNama}" tidak ditemukan/di luar wilayah Anda. Pilih desa secara manual.`
          : 'Nama desa tidak terbaca dari file. Pilih desa secara manual.'
      }, { status: 400 })
    }

    const tahun = parseInt((form.get('tahun') as string) || '') || parsed.tahunFile || new Date().getFullYear()

    // 1) Posyandu (sheet DATABASE): update kalau ada, buat kalau belum
    const existingByName = new Map(desa.posyandus.map(p => [normalizeName(p.nama), p]))
    let posyanduCreated = 0
    let posyanduUpdated = 0
    for (const p of parsed.posyandus) {
      const key = normalizeName(p.nama)
      const data = {
        hariBuka: p.hariBuka || 'Tgl 1',
        jumlahRumah: p.jumlahRumah,
        jumlahKK: p.jumlahKK,
        jumlahPenduduk: p.jumlahPenduduk,
        jumlahAnak05: p.jumlahAnak05,
        jumlahRemaja: p.jumlahRemaja,
        jumlahProduktif: p.jumlahProduktif,
        jumlahLansia: p.jumlahLansia,
        jumlahDisabilitas: p.jumlahDisabilitas,
        statusBangunan: p.statusBangunan,
        danaSehatter: p.danaSehat,
        jumlahKader: p.jumlahKader,
        strata: p.strata,
        kegiatanIntegrasi: p.kegiatanIntegrasi || null,
      }
      const existing = existingByName.get(key)
      if (existing) {
        await prisma.posyandu.update({ where: { id: existing.id }, data })
        posyanduUpdated++
      } else {
        const created = await prisma.posyandu.create({ data: { ...data, nama: p.nama, desaId: desa.id } })
        existingByName.set(key, created)
        posyanduCreated++
      }
    }

    const allPosyandus = await prisma.posyandu.findMany({ where: { desaId: desa.id }, orderBy: { nama: 'asc' } })
    if (allPosyandus.length === 0) {
      return NextResponse.json({ error: 'Desa belum punya posyandu dan sheet DATABASE kosong' }, { status: 400 })
    }
    const posyanduByName = new Map(allPosyandus.map(p => [normalizeName(p.nama), p]))
    // Data level desa (SIP 6/7 & sasaran) ditempatkan di posyandu pertama — konsisten dengan seeder
    const defaultPosyandu = allPosyandus[0]

    // 2) SIP 6 bulanan (upsert per bulan)
    let sip6Count = 0
    for (const rec of parsed.sip6) {
      const { bulan, keterangan, ...fields } = rec as { bulan: number; keterangan?: string } & Record<string, number>
      await prisma.sip6Bulanan.upsert({
        where: { posyanduId_tahun_bulan: { posyanduId: defaultPosyandu.id, tahun, bulan } },
        update: { ...fields, keterangan: keterangan || null },
        create: { posyanduId: defaultPosyandu.id, tahun, bulan, ...fields, keterangan: keterangan || null },
      })
      sip6Count++
    }

    // 3) SIP 7 bulanan
    let sip7Count = 0
    for (const rec of parsed.sip7) {
      const { bulan, ...fields } = rec
      await prisma.sip7Bulanan.upsert({
        where: { posyanduId_tahun_bulan: { posyanduId: defaultPosyandu.id, tahun, bulan } },
        update: fields,
        create: { posyanduId: defaultPosyandu.id, tahun, bulan, ...fields },
      })
      sip7Count++
    }

    // 4) Sasaran individu (update kunjungan bila sudah ada, buat bila belum)
    const existingSasaran = await prisma.sasaranIndividu.findMany({
      where: { posyanduId: defaultPosyandu.id, tahun },
    })
    const sasaranKey = (kategori: string, nama: string) => `${kategori}::${normalizeName(nama)}`
    const sasaranMap = new Map(existingSasaran.map(s => [sasaranKey(s.kategori, s.nama), s]))
    let sasaranCount = 0
    for (const s of parsed.sasaran) {
      const monthData = {
        jan: s.months[0], feb: s.months[1], mar: s.months[2], apr: s.months[3],
        mei: s.months[4], jun: s.months[5], jul: s.months[6], agu: s.months[7],
        sep: s.months[8], okt: s.months[9], nov: s.months[10], des: s.months[11],
      }
      const existing = sasaranMap.get(sasaranKey(s.kategori, s.nama))
      if (existing) {
        await prisma.sasaranIndividu.update({
          where: { id: existing.id },
          data: {
            ...monthData,
            jenisKelamin: s.jenisKelamin ?? existing.jenisKelamin,
            tanggalLahir: s.tanggalLahir ?? existing.tanggalLahir,
            namaIbu: s.namaIbu ?? existing.namaIbu,
            namaAyah: s.namaAyah ?? existing.namaAyah,
            namaSuami: s.namaSuami ?? existing.namaSuami,
            namaBayi: s.namaBayi ?? existing.namaBayi,
          },
        })
      } else {
        await prisma.sasaranIndividu.create({
          data: {
            posyanduId: defaultPosyandu.id,
            kategori: s.kategori,
            nama: s.nama,
            jenisKelamin: s.jenisKelamin,
            tanggalLahir: s.tanggalLahir,
            namaIbu: s.namaIbu,
            namaAyah: s.namaAyah,
            namaSuami: s.namaSuami,
            namaBayi: s.namaBayi,
            tahun,
            ...monthData,
          },
        })
      }
      sasaranCount++
    }

    // 5) Laporan bidang (dedup: posyandu+nama+hal+tanggal)
    const findPosyanduId = (name: string) => posyanduByName.get(normalizeName(name))?.id || defaultPosyandu.id
    const posyanduIds = allPosyandus.map(p => p.id)
    const existingLaporan = await prisma.laporanPengaduan.findMany({ where: { posyanduId: { in: posyanduIds } } })
    const laporanKey = (posyanduId: string, bidang: string, nama: string, hal: string, tanggal: Date) =>
      [posyanduId, bidang, normalizeName(nama), normalizeName(hal), tanggal.toISOString().slice(0, 10)].join('::')
    const laporanSet = new Set(existingLaporan.map(l => laporanKey(l.posyanduId, l.bidang, l.nama, l.halPengaduan, l.tanggal)))

    let laporanCount = 0
    const bidangRows: [string, typeof parsed.pendidikan][] = [
      ['PENDIDIKAN', parsed.pendidikan],
      ['PU', parsed.pu],
      ['TRANTIB', parsed.trantib],
      ['SOSIAL', parsed.sosial],
    ]
    for (const [bidang, rows] of bidangRows) {
      for (const r of rows) {
        const posyanduId = findPosyanduId(r.posyandu)
        const hal = bidang === 'PU' && (r.noSurat || r.lokasi)
          ? `${r.noSurat || ''}|${r.hal}|${r.lokasi || ''}`
          : r.hal
        const key = laporanKey(posyanduId, bidang, r.nama, hal, r.tanggal)
        if (laporanSet.has(key)) continue
        laporanSet.add(key)
        await prisma.laporanPengaduan.create({
          data: {
            posyanduId,
            bidang: bidang as 'PENDIDIKAN' | 'PU' | 'TRANTIB' | 'SOSIAL',
            tanggal: r.tanggal,
            nik: r.nik || null,
            nama: r.nama,
            alamat: r.alamat || null,
            halPengaduan: hal,
            keteranganTL: r.tl || null,
            keteranganBTL: r.btl || null,
            status: r.tl ? 'TL' : 'BTL',
            createdBy: requester.email,
          },
        })
        laporanCount++
      }
    }

    // 6) Laporan PR
    const existingPr = await prisma.laporanPR.findMany({ where: { posyanduId: { in: posyanduIds } } })
    const prKey = (posyanduId: string, nama: string, tanggal: Date) =>
      [posyanduId, normalizeName(nama), tanggal.toISOString().slice(0, 10)].join('::')
    const prSet = new Set(existingPr.map(l => prKey(l.posyanduId, l.nama, l.tanggal)))
    let prCount = 0
    for (const r of parsed.pr) {
      const posyanduId = findPosyanduId(r.posyandu)
      const key = prKey(posyanduId, r.nama, r.tanggal)
      if (prSet.has(key)) continue
      prSet.add(key)
      await prisma.laporanPR.create({
        data: {
          posyanduId,
          tanggal: r.tanggal,
          nama: r.nama,
          nik: r.nik || null,
          alamat: r.alamat || null,
          fcKK: r.fcKK,
          fcKTP: r.fcKTP,
          suratPermohonan: r.sp,
          suketPenghasilan: r.suket,
          fotoKondisiRumah: r.fotoRumah,
          keteranganTL: r.tl || null,
          keteranganBTL: r.btl || null,
          status: r.tl ? 'TL' : 'BTL',
        },
      })
      prCount++
    }

    return NextResponse.json({
      message: `Import ${desa.nama} (${tahun}) berhasil: ${posyanduCreated} posyandu baru, ${posyanduUpdated} diperbarui, ` +
        `${sip6Count} bulan SIP 6, ${sip7Count} bulan SIP 7, ${sasaranCount} sasaran, ${laporanCount} laporan bidang, ${prCount} laporan PR.`,
      desaId: desa.id,
      tahun,
    })
  } catch (error) {
    console.error('Error importing desa workbook:', error)
    return NextResponse.json({ error: 'Gagal memproses file. Pastikan format sesuai template resmi.' }, { status: 500 })
  }
}
