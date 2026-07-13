// GET /api/files/<bucket>/<nama-berkas>
// Proxy tampilan berkas dari Supabase Storage PRIVAT: server mengambil objek
// memakai service key lalu meneruskannya ke browser. Bucket tetap privat —
// hanya pengguna yang login yang bisa melihat. Ini yang membuat foto profil
// dan data dukung tampil tanpa mem-publik-kan bucket.
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

const ALLOWED_BUCKETS = new Set(['GAMBAR', 'FILE'])

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { path: parts } = await params
  if (!parts || parts.length < 2) {
    return NextResponse.json({ error: 'Path tidak valid' }, { status: 400 })
  }
  const [bucket, ...nameParts] = parts
  const objectName = nameParts.join('/')
  if (!ALLOWED_BUCKETS.has(bucket) || objectName.includes('..')) {
    return NextResponse.json({ error: 'Path tidak valid' }, { status: 400 })
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
  if (!supabaseUrl || !key) {
    return NextResponse.json({ error: 'Konfigurasi Supabase belum lengkap' }, { status: 500 })
  }

  try {
    const upstream = await fetch(
      `${supabaseUrl}/storage/v1/object/${bucket}/${encodeURIComponent(objectName)}`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    )
    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ error: 'Berkas tidak ditemukan' }, { status: upstream.status === 404 ? 404 : 502 })
    }
    return new NextResponse(upstream.body, {
      headers: {
        'Content-Type': upstream.headers.get('content-type') || 'application/octet-stream',
        'Content-Length': upstream.headers.get('content-length') || '',
        // Nama berkas unik (timestamp) → aman di-cache lama
        'Cache-Control': 'private, max-age=86400, immutable',
      },
    })
  } catch (err) {
    console.error('File proxy error:', err)
    return NextResponse.json({ error: 'Gagal mengambil berkas' }, { status: 502 })
  }
}
