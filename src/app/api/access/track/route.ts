// POST /api/access/track
// Mencatat akses aplikasi berdasarkan IP asli pengunjung, lalu geolokasi via ip-api.com.
// Dipanggil dari dashboard saat dimuat. Dedup: satu catatan per IP+user tiap 30 menit.
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function getClientIp(request: Request): string | null {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return request.headers.get('x-real-ip') || request.headers.get('cf-connecting-ip') || null
}

function isPrivateIp(ip: string): boolean {
  if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('::ffff:127.')) return true
  if (/^10\./.test(ip) || /^192\.168\./.test(ip) || /^169\.254\./.test(ip)) return true
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return true
  if (/^(fc|fd)/i.test(ip) || ip.startsWith('fe80')) return true
  return false
}

// Validasi bentuk IPv4/IPv6 sederhana (untuk IP publik kiriman browser)
function isValidIp(ip: string): boolean {
  const v4 = /^(\d{1,3}\.){3}\d{1,3}$/
  const v6 = /^[0-9a-fA-F:]+$/
  return v4.test(ip) || (ip.includes(':') && v6.test(ip))
}

interface GeoResult {
  city?: string | null
  region?: string | null
  country?: string | null
  lat?: number | null
  lng?: number | null
}

async function geolocate(ip: string): Promise<GeoResult> {
  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,regionName,city,lat,lon`,
      { signal: AbortSignal.timeout(4000) }
    )
    if (!res.ok) return {}
    const data = await res.json()
    if (data?.status !== 'success') return {}
    return { city: data.city ?? null, region: data.regionName ?? null, country: data.country ?? null, lat: data.lat ?? null, lng: data.lon ?? null }
  } catch {
    return {}
  }
}

export async function POST(request: Request) {
  try {
    // Baca body DULU (sebelum auth) — request.json() hanya bisa sekali dibaca.
    let bodyIp: string | null = null
    try {
      const body = await request.json()
      if (body?.publicIp && typeof body.publicIp === 'string') bodyIp = body.publicIp.trim()
    } catch { /* tanpa body */ }

    const session = await auth()
    const email = session?.user?.email
    let user: { id: string; nama: string | null; role: string } | null = null
    if (email) {
      user = await prisma.user.findUnique({ where: { email }, select: { id: true, nama: true, role: true } })
    }

    // IP dari header proxy; bila privat/lokal, pakai IP publik yang dideteksi browser.
    let ip = getClientIp(request)
    if ((!ip || isPrivateIp(ip)) && bodyIp && isValidIp(bodyIp) && !isPrivateIp(bodyIp)) {
      ip = bodyIp
    }
    if (!ip) return NextResponse.json({ ok: false, reason: 'no-ip' })

    // Dedup: lewati bila IP+user sudah tercatat dalam 30 menit terakhir
    const since = new Date(Date.now() - 30 * 60 * 1000)
    const recent = await prisma.accessLog.findFirst({
      where: { ip, userId: user?.id ?? null, createdAt: { gte: since } },
      select: { id: true },
    })
    if (recent) return NextResponse.json({ ok: true, deduped: true })

    const geo = isPrivateIp(ip) ? {} : await geolocate(ip)

    await prisma.accessLog.create({
      data: {
        ip,
        city: geo.city ?? null,
        region: geo.region ?? null,
        country: geo.country ?? null,
        lat: geo.lat ?? null,
        lng: geo.lng ?? null,
        userId: user?.id ?? null,
        userName: user?.nama ?? null,
        role: user?.role ?? null,
        userAgent: request.headers.get('user-agent')?.slice(0, 255) ?? null,
      },
    })

    return NextResponse.json({ ok: true, located: geo.lat != null })
  } catch (error) {
    console.error('access/track error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
