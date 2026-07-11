// GET /api/dashboard/summary?tahun=2026
// Rekap jumlah laporan & data per bidang (total + selesai), scoped per role.
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

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

  // Filter posyandu sesuai wilayah requester
  const posyanduWhere: Prisma.PosyanduWhereInput = {}
  if (requester.role === 'OPERATOR_POSYANDU' && requester.posyanduId) {
    posyanduWhere.id = requester.posyanduId
  } else if (requester.role === 'OPERATOR_DESA' && requester.desaId) {
    posyanduWhere.desaId = requester.desaId
  } else if (requester.role === 'ADMIN_KECAMATAN' && requester.kecamatanId) {
    posyanduWhere.desa = { kecamatanId: requester.kecamatanId }
  }

  const posyandus = await prisma.posyandu.findMany({ where: posyanduWhere, select: { id: true } })
  const posyanduIds = posyandus.map(p => p.id)
  if (posyanduIds.length === 0) {
    return NextResponse.json({ tahun, bidang: {} })
  }

  const yearStart = new Date(Date.UTC(tahun, 0, 1))
  const yearEnd = new Date(Date.UTC(tahun + 1, 0, 1))
  const inPosyandu = { posyanduId: { in: posyanduIds } }
  const inYear = { tanggal: { gte: yearStart, lt: yearEnd } }

  const countBidang = async (bidang: 'PENDIDIKAN' | 'PU' | 'TRANTIB' | 'SOSIAL') => {
    const [total, selesai] = await Promise.all([
      prisma.laporanPengaduan.count({ where: { ...inPosyandu, ...inYear, bidang } }),
      prisma.laporanPengaduan.count({ where: { ...inPosyandu, ...inYear, bidang, status: 'TL' } }),
    ])
    return { total, selesai }
  }

  const [pendidikan, pu, trantib, sosial, prTotal, prSelesai, sip6, sip7] = await Promise.all([
    countBidang('PENDIDIKAN'),
    countBidang('PU'),
    countBidang('TRANTIB'),
    countBidang('SOSIAL'),
    prisma.laporanPR.count({ where: { ...inPosyandu, ...inYear } }),
    prisma.laporanPR.count({ where: { ...inPosyandu, ...inYear, status: 'TL' } }),
    prisma.sip6Bulanan.count({ where: { ...inPosyandu, tahun } }),
    prisma.sip7Bulanan.count({ where: { ...inPosyandu, tahun } }),
  ])

  return NextResponse.json({
    tahun,
    bidang: {
      pendidikan,
      pekerjaanUmum: pu,
      perumahan: { total: prTotal, selesai: prSelesai },
      trantib,
      sosial,
      // Data bulanan dianggap "selesai" bila tercatat (0–12 per posyandu)
      sip6: { total: sip6, selesai: sip6 },
      sip7: { total: sip7, selesai: sip7 },
    },
  })
}
