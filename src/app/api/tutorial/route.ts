// API Panduan/Tutorial (video YouTube).
//   GET            → daftar tutorial untuk role pemohon (target = role ATAU SEMUA)
//   GET ?manage=1  → seluruh tutorial (khusus SUPERADMIN, untuk halaman kelola)
//   POST/PUT/DELETE → khusus SUPERADMIN
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getYoutubeId } from "@/lib/youtube"

export const dynamic = "force-dynamic"

const TARGETS = ["SEMUA", "SUPERADMIN", "ADMIN_KECAMATAN", "OPERATOR_DESA", "OPERATOR_POSYANDU"] as const
type Target = (typeof TARGETS)[number]

async function requireUser() {
  const session = await auth()
  if (!session?.user?.email) return null
  return prisma.user.findUnique({ where: { email: session.user.email as string } })
}

export async function GET(request: Request) {
  const user = await requireUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const manage = searchParams.get("manage") === "1"

  if (manage) {
    if (user.role !== "SUPERADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    const rows = await prisma.tutorial.findMany({ orderBy: [{ urutan: "asc" }, { createdAt: "desc" }] })
    return NextResponse.json(rows)
  }

  // Tampilan pengguna: yang ber-target SEMUA atau sesuai role-nya
  const rows = await prisma.tutorial.findMany({
    where: { target: { in: ["SEMUA", user.role] as Target[] } },
    orderBy: [{ urutan: "asc" }, { createdAt: "desc" }],
  })
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const user = await requireUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (user.role !== "SUPERADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const body = await request.json().catch(() => ({}))
  const judul = String(body.judul || "").trim()
  const youtubeUrl = String(body.youtubeUrl || "").trim()
  const target: Target = TARGETS.includes(body.target) ? body.target : "SEMUA"
  const deskripsi = body.deskripsi ? String(body.deskripsi).trim() : null
  const urutan = Number.isFinite(body.urutan) ? parseInt(body.urutan) : 0

  if (!judul) return NextResponse.json({ error: "Judul wajib diisi" }, { status: 400 })
  if (!getYoutubeId(youtubeUrl)) return NextResponse.json({ error: "URL YouTube tidak valid" }, { status: 400 })

  const row = await prisma.tutorial.create({
    data: { judul, deskripsi, youtubeUrl, target, urutan, createdBy: user.email },
  })
  return NextResponse.json(row, { status: 201 })
}

export async function PUT(request: Request) {
  const user = await requireUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (user.role !== "SUPERADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const body = await request.json().catch(() => ({}))
  const id = String(body.id || "")
  if (!id) return NextResponse.json({ error: "ID wajib" }, { status: 400 })
  if (body.youtubeUrl !== undefined && !getYoutubeId(String(body.youtubeUrl))) {
    return NextResponse.json({ error: "URL YouTube tidak valid" }, { status: 400 })
  }

  const data: Record<string, unknown> = {}
  if (body.judul !== undefined) data.judul = String(body.judul).trim()
  if (body.deskripsi !== undefined) data.deskripsi = body.deskripsi ? String(body.deskripsi).trim() : null
  if (body.youtubeUrl !== undefined) data.youtubeUrl = String(body.youtubeUrl).trim()
  if (body.target !== undefined && TARGETS.includes(body.target)) data.target = body.target
  if (body.urutan !== undefined) data.urutan = parseInt(body.urutan) || 0

  const row = await prisma.tutorial.update({ where: { id }, data })
  return NextResponse.json(row)
}

export async function DELETE(request: Request) {
  const user = await requireUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (user.role !== "SUPERADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "ID wajib" }, { status: 400 })

  await prisma.tutorial.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
