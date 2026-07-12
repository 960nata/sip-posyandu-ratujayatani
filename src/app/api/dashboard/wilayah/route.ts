// GET /api/dashboard/wilayah?tahun=2025
// Statistik aktivitas pelaporan per kecamatan (data asli) untuk dashboard admin.
// Status: Aktif (mayoritas posyandu melapor) / Kurang Aktif / Pasif (belum ada data).
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

type StatusWilayah = 'AKTIF' | 'KURANG_AKTIF' | 'PASIF'

function classify(reportedPosyandu: number, posyanduCount: number): StatusWilayah {
  if (posyanduCount === 0 || reportedPosyandu === 0) return 'PASIF'
  const ratio = reportedPosyandu / posyanduCount
  if (ratio >= 0.6) return 'AKTIF'
  return 'KURANG_AKTIF'
}

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const requester = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!requester) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  const tahun = parseInt(searchParams.get('tahun') || '') || new Date().getFullYear()

  // Scope kecamatan sesuai role
  const kecWhere: Prisma.KecamatanWhereInput = {}
  if (requester.role === 'ADMIN_KECAMATAN' && requester.kecamatanId) {
    kecWhere.id = requester.kecamatanId
  }

  const kecamatans = await prisma.kecamatan.findMany({
    where: kecWhere,
    include: {
      _count: { select: { desas: true } },
      desas: { select: { posyandus: { select: { id: true } } } },
    },
    orderBy: { nama: 'asc' },
  })

  // Peta posyandu -> kecamatan
  const posyanduToKec = new Map<string, string>()
  const kecPosyanduCount = new Map<string, number>()
  for (const kec of kecamatans) {
    let count = 0
    for (const desa of kec.desas) {
      for (const p of desa.posyandus) {
        posyanduToKec.set(p.id, kec.id)
        count++
      }
    }
    kecPosyanduCount.set(kec.id, count)
  }
  const allPosyanduIds = [...posyanduToKec.keys()]

  const yearStart = new Date(Date.UTC(tahun, 0, 1))
  const yearEnd = new Date(Date.UTC(tahun + 1, 0, 1))

  // Posyandu yang punya data (distinct) + jumlah record/laporan per posyandu
  const [sip6Ids, sip7Ids, laporanGroups, prGroups, sip6Counts, sip7Counts] = await Promise.all([
    prisma.sip6Bulanan.findMany({ where: { tahun, posyanduId: { in: allPosyanduIds } }, select: { posyanduId: true }, distinct: ['posyanduId'] }),
    prisma.sip7Bulanan.findMany({ where: { tahun, posyanduId: { in: allPosyanduIds } }, select: { posyanduId: true }, distinct: ['posyanduId'] }),
    prisma.laporanPengaduan.groupBy({ by: ['posyanduId'], where: { tanggal: { gte: yearStart, lt: yearEnd }, posyanduId: { in: allPosyanduIds } }, _count: { _all: true } }),
    prisma.laporanPR.groupBy({ by: ['posyanduId'], where: { tanggal: { gte: yearStart, lt: yearEnd }, posyanduId: { in: allPosyanduIds } }, _count: { _all: true } }),
    prisma.sip6Bulanan.groupBy({ by: ['posyanduId'], where: { tahun, posyanduId: { in: allPosyanduIds } }, _count: { _all: true } }),
    prisma.sip7Bulanan.groupBy({ by: ['posyanduId'], where: { tahun, posyanduId: { in: allPosyanduIds } }, _count: { _all: true } }),
  ])

  // Kumpulan posyandu yang "melapor" (punya minimal 1 data apa pun di tahun itu)
  const reportedPosyandu = new Set<string>()
  sip6Ids.forEach(r => reportedPosyandu.add(r.posyanduId))
  sip7Ids.forEach(r => reportedPosyandu.add(r.posyanduId))
  laporanGroups.forEach(r => reportedPosyandu.add(r.posyanduId))
  prGroups.forEach(r => reportedPosyandu.add(r.posyanduId))

  // Total record per kecamatan (SIP6 bulan + SIP7 bulan + laporan + PR)
  const kecRecords = new Map<string, number>()
  const addRecord = (posyanduId: string, n: number) => {
    const kecId = posyanduToKec.get(posyanduId)
    if (kecId) kecRecords.set(kecId, (kecRecords.get(kecId) || 0) + n)
  }
  sip6Counts.forEach(g => addRecord(g.posyanduId, g._count._all))
  sip7Counts.forEach(g => addRecord(g.posyanduId, g._count._all))
  laporanGroups.forEach(g => addRecord(g.posyanduId, g._count._all))
  prGroups.forEach(g => addRecord(g.posyanduId, g._count._all))

  // Jumlah posyandu yang melapor per kecamatan
  const kecReported = new Map<string, number>()
  for (const pid of reportedPosyandu) {
    const kecId = posyanduToKec.get(pid)
    if (kecId) kecReported.set(kecId, (kecReported.get(kecId) || 0) + 1)
  }

  const rows = kecamatans.map(kec => {
    const posyanduCount = kecPosyanduCount.get(kec.id) || 0
    const reported = kecReported.get(kec.id) || 0
    const totalRecords = kecRecords.get(kec.id) || 0
    return {
      id: kec.id,
      nama: kec.nama,
      kode: kec.kode,
      desaCount: kec._count.desas,
      posyanduCount,
      reportedPosyandu: reported,
      totalRecords,
      status: classify(reported, posyanduCount),
    }
  })

  const summary = {
    tahun,
    kecamatanCount: rows.length,
    desaCount: rows.reduce((s, r) => s + r.desaCount, 0),
    posyanduCount: rows.reduce((s, r) => s + r.posyanduCount, 0),
    reportedPosyandu: rows.reduce((s, r) => s + r.reportedPosyandu, 0),
    totalRecords: rows.reduce((s, r) => s + r.totalRecords, 0),
    aktif: rows.filter(r => r.status === 'AKTIF').length,
    kurangAktif: rows.filter(r => r.status === 'KURANG_AKTIF').length,
    pasif: rows.filter(r => r.status === 'PASIF').length,
  }

  return NextResponse.json({ summary, kecamatans: rows })
}
