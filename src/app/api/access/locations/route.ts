// GET /api/access/locations
// Titik akses teragregasi (berdasarkan kota/koordinat) untuk peta sebaran akses.
// Hanya admin kabupaten & kecamatan. Data 100% asli dari AccessLog.
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const requester = await prisma.user.findUnique({ where: { email: session.user.email }, select: { role: true } })
  if (!requester || !['SUPERADMIN', 'VIEWER', 'ADMIN_KECAMATAN'].includes(requester.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const logs = await prisma.accessLog.findMany({
    where: { lat: { not: null }, lng: { not: null } },
    select: { city: true, region: true, country: true, lat: true, lng: true, ip: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 5000,
  })

  // Agregasi per titik (bulatkan koordinat ~1km agar titik berdekatan menyatu)
  const map = new Map<string, { lat: number; lng: number; city: string; region: string; count: number; ips: Set<string>; last: Date }>()
  for (const l of logs) {
    const lat = Number(l.lat)
    const lng = Number(l.lng)
    const key = `${lat.toFixed(2)},${lng.toFixed(2)}`
    const existing = map.get(key)
    if (existing) {
      existing.count++
      existing.ips.add(l.ip)
      if (l.createdAt > existing.last) existing.last = l.createdAt
    } else {
      map.set(key, {
        lat, lng,
        city: l.city || 'Tidak diketahui',
        region: l.region || l.country || '',
        count: 1,
        ips: new Set([l.ip]),
        last: l.createdAt,
      })
    }
  }

  const points = Array.from(map.values()).map(p => ({
    lat: p.lat, lng: p.lng, city: p.city, region: p.region,
    count: p.count, uniqueIps: p.ips.size, lastAccess: p.last,
  }))

  const [totalAccess, uniqueIpRows] = await Promise.all([
    prisma.accessLog.count(),
    prisma.accessLog.findMany({ distinct: ['ip'], select: { ip: true } }),
  ])

  return NextResponse.json({
    points,
    summary: {
      totalAccess,
      uniqueIps: uniqueIpRows.length,
      locatedPoints: points.length,
      totalLocatedAccess: points.reduce((s, p) => s + p.count, 0),
    },
  })
}
