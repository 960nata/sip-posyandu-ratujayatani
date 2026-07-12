// GET /api/dashboard/monitor?tahun=2026[&kecamatanId=..][&desaId=..]
// Pemantauan hierarkis drill-down (100% data asli):
//   tanpa parent  → level default sesuai role (superadmin: kecamatan, kec: desa, desa: posyandu)
//   ?kecamatanId  → daftar DESA di kecamatan itu
//   ?desaId       → daftar POSYANDU di desa itu
// Tiap child berisi jumlah data per bidang + status keaktifan. Otorisasi per wilayah.
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

type Level = 'kecamatan' | 'desa' | 'posyandu'

interface ChildAgg {
  id: string
  nama: string
  pendidikan: number
  pekerjaanUmum: number
  perumahan: number
  trantib: number
  sosial: number
  sip6: number
  sip7: number
  total: number
  // Unit pelapor: 'Desa' untuk level kecamatan/desa, 'Posyandu' untuk level posyandu
  unitCount: number
  reportedUnit: number
  status: 'AKTIF' | 'KURANG_AKTIF' | 'PASIF'
  _units: Set<string>
  _reported: Set<string>
}

function classify(reported: number, total: number): ChildAgg['status'] {
  if (total === 0 || reported === 0) return 'PASIF'
  return reported / total >= 0.6 ? 'AKTIF' : 'KURANG_AKTIF'
}

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const requester = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!requester) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { searchParams } = new URL(request.url)
  const tahun = parseInt(searchParams.get('tahun') || '') || new Date().getFullYear()
  const kecamatanId = searchParams.get('kecamatanId')
  const desaId = searchParams.get('desaId')
  const role = requester.role

  // Tentukan level anak + scope posyandu + validasi otorisasi
  let level: Level
  const posyanduWhere: Prisma.PosyanduWhereInput = {}
  let scopeNama = ''

  const forbidden = () => NextResponse.json({ error: 'Forbidden: di luar wilayah Anda' }, { status: 403 })

  if (desaId) {
    const desa = await prisma.desa.findUnique({ where: { id: desaId }, include: { kecamatan: true } })
    if (!desa) return NextResponse.json({ error: 'Desa tidak ditemukan' }, { status: 404 })
    if (role === 'ADMIN_KECAMATAN' && desa.kecamatanId !== requester.kecamatanId) return forbidden()
    if (role === 'OPERATOR_DESA' && desa.id !== requester.desaId) return forbidden()
    if (role === 'OPERATOR_POSYANDU') return forbidden()
    level = 'posyandu'
    posyanduWhere.desaId = desaId
    scopeNama = desa.nama
  } else if (kecamatanId) {
    const kec = await prisma.kecamatan.findUnique({ where: { id: kecamatanId } })
    if (!kec) return NextResponse.json({ error: 'Kecamatan tidak ditemukan' }, { status: 404 })
    if (role === 'ADMIN_KECAMATAN' && kec.id !== requester.kecamatanId) return forbidden()
    if (role === 'OPERATOR_DESA' || role === 'OPERATOR_POSYANDU') return forbidden()
    level = 'desa'
    posyanduWhere.desa = { kecamatanId }
    scopeNama = kec.nama
  } else {
    if (role === 'SUPERADMIN' || role === 'VIEWER') {
      level = 'kecamatan'
    } else if (role === 'ADMIN_KECAMATAN') {
      level = 'desa'
      posyanduWhere.desa = { kecamatanId: requester.kecamatanId ?? '' }
    } else if (role === 'OPERATOR_DESA') {
      level = 'posyandu'
      posyanduWhere.desaId = requester.desaId ?? ''
    } else {
      level = 'posyandu'
      posyanduWhere.id = requester.posyanduId ?? ''
    }
  }

  const posyandus = await prisma.posyandu.findMany({
    where: posyanduWhere,
    select: {
      id: true, nama: true, desaId: true,
      desa: { select: { id: true, nama: true, kecamatanId: true, kecamatan: { select: { id: true, nama: true } } } },
    },
    orderBy: { nama: 'asc' },
  })

  const posyanduIds = posyandus.map(p => p.id)
  const childOf = new Map<string, { id: string; nama: string }>()
  // Unit pelapor tiap posyandu: desa (level kec/desa) atau posyandu sendiri (level posyandu)
  const unitOf = new Map<string, string>()
  for (const p of posyandus) {
    if (level === 'kecamatan') childOf.set(p.id, { id: p.desa.kecamatan.id, nama: p.desa.kecamatan.nama })
    else if (level === 'desa') childOf.set(p.id, { id: p.desa.id, nama: p.desa.nama })
    else childOf.set(p.id, { id: p.id, nama: p.nama })
    unitOf.set(p.id, level === 'posyandu' ? p.id : p.desaId)
  }

  const yearStart = new Date(Date.UTC(tahun, 0, 1))
  const yearEnd = new Date(Date.UTC(tahun + 1, 0, 1))
  const inScope = { posyanduId: { in: posyanduIds } }

  const [lapByBidang, prGroups, sip6Groups, sip7Groups] = await Promise.all([
    posyanduIds.length ? prisma.laporanPengaduan.groupBy({ by: ['posyanduId', 'bidang'], where: { ...inScope, tanggal: { gte: yearStart, lt: yearEnd } }, _count: { _all: true } }) : [],
    posyanduIds.length ? prisma.laporanPR.groupBy({ by: ['posyanduId'], where: { ...inScope, tanggal: { gte: yearStart, lt: yearEnd } }, _count: { _all: true } }) : [],
    posyanduIds.length ? prisma.sip6Bulanan.groupBy({ by: ['posyanduId'], where: { ...inScope, tahun }, _count: { _all: true } }) : [],
    posyanduIds.length ? prisma.sip7Bulanan.groupBy({ by: ['posyanduId'], where: { ...inScope, tahun }, _count: { _all: true } }) : [],
  ])

  const children = new Map<string, ChildAgg>()
  const ensure = (posyanduId: string): ChildAgg => {
    const c = childOf.get(posyanduId)!
    let agg = children.get(c.id)
    if (!agg) {
      agg = { id: c.id, nama: c.nama, pendidikan: 0, pekerjaanUmum: 0, perumahan: 0, trantib: 0, sosial: 0, sip6: 0, sip7: 0, total: 0, unitCount: 0, reportedUnit: 0, status: 'PASIF', _units: new Set(), _reported: new Set() }
      children.set(c.id, agg)
    }
    return agg
  }
  // Daftarkan unit pelapor (desa/posyandu) tiap child
  for (const p of posyandus) ensure(p.id)._units.add(unitOf.get(p.id)!)

  const bump = (posyanduId: string, field: keyof ChildAgg, n: number) => {
    const agg = ensure(posyanduId)
    ;(agg[field] as number) += n
    agg.total += n
    if (n > 0) agg._reported.add(unitOf.get(posyanduId)!)
  }

  for (const g of lapByBidang) {
    const n = g._count._all
    if (g.bidang === 'PENDIDIKAN') bump(g.posyanduId, 'pendidikan', n)
    else if (g.bidang === 'PU') bump(g.posyanduId, 'pekerjaanUmum', n)
    else if (g.bidang === 'TRANTIB') bump(g.posyanduId, 'trantib', n)
    else if (g.bidang === 'SOSIAL') bump(g.posyanduId, 'sosial', n)
  }
  for (const g of prGroups) bump(g.posyanduId, 'perumahan', g._count._all)
  for (const g of sip6Groups) bump(g.posyanduId, 'sip6', g._count._all)
  for (const g of sip7Groups) bump(g.posyanduId, 'sip7', g._count._all)

  for (const agg of children.values()) {
    agg.unitCount = agg._units.size
    agg.reportedUnit = agg._reported.size
    agg.status = classify(agg.reportedUnit, agg.unitCount)
  }

  const rows = Array.from(children.values())
    .map(({ _units, _reported, ...r }) => r)
    .sort((a, b) => a.nama.localeCompare(b.nama))

  // Agregat total: unit pelapor unik lintas child
  const allUnits = new Set<string>()
  const allReported = new Set<string>()
  for (const agg of children.values()) {
    agg._units.forEach(u => allUnits.add(u))
    agg._reported.forEach(u => allReported.add(u))
  }
  const totalAgg = rows.reduce((acc, r) => {
    acc.pendidikan += r.pendidikan; acc.pekerjaanUmum += r.pekerjaanUmum; acc.perumahan += r.perumahan
    acc.trantib += r.trantib; acc.sosial += r.sosial; acc.sip6 += r.sip6; acc.sip7 += r.sip7
    acc.total += r.total
    return acc
  }, { pendidikan: 0, pekerjaanUmum: 0, perumahan: 0, trantib: 0, sosial: 0, sip6: 0, sip7: 0, total: 0, unitCount: allUnits.size, reportedUnit: allReported.size })

  const levelLabel = level === 'kecamatan' ? 'Kecamatan' : level === 'desa' ? 'Desa' : 'Posyandu'
  const unitLabel = level === 'posyandu' ? 'Posyandu' : 'Desa'
  const drillable = level !== 'posyandu'

  return NextResponse.json({ tahun, level, levelLabel, unitLabel, drillable, scopeNama, total: totalAgg, children: rows })
}
