import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import * as bcrypt from "bcrypt"

export async function GET() {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const email = session.user.email
  const user = await prisma.user.findUnique({
    where: { email: email as string }
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  let whereClause = {}
  
  if (user.role === 'ADMIN_KECAMATAN') {
    whereClause = { kecamatanId: user.kecamatanId }
  } else if (user.role === 'OPERATOR_DESA') {
    whereClause = { desaId: user.desaId }
  }

  const users = await prisma.user.findMany({
    where: whereClause,
    orderBy: {
      nama: 'asc'
    }
  })

  // Fetch all reference data to map names manually (safe against schema missing relations)
  const kecamatans = await prisma.kecamatan.findMany()
  const desas = await prisma.desa.findMany()
  const posyandus = await prisma.posyandu.findMany()

  const formattedUsers = users.map(u => ({
    id: u.id,
    name: u.nama,
    email: u.email,
    role: u.role,
    kecamatan: kecamatans.find(k => k.id === u.kecamatanId)?.nama || '-',
    desa: desas.find(d => d.id === u.desaId)?.nama || '-',
    posyandu: posyandus.find(p => p.id === u.posyanduId)?.nama || '-',
    kecamatanId: u.kecamatanId,
    desaId: u.desaId,
    posyanduId: u.posyanduId
  }))

  return NextResponse.json(formattedUsers)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { name, email, password, role, kecamatan, desa, posyandu } = body

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Find IDs by name
  let targetKecamatanId = undefined
  let targetDesaId = undefined
  let targetPosyanduId = undefined

  if (kecamatan && kecamatan !== '-') {
    const kec = await prisma.kecamatan.findFirst({ where: { nama: kecamatan } })
    targetKecamatanId = kec?.id
  }

  if (desa && desa !== '-') {
    const d = await prisma.desa.findFirst({ where: { nama: desa } })
    targetDesaId = d?.id
  }

  if (posyandu && posyandu !== '-') {
    const p = await prisma.posyandu.findFirst({ where: { nama: posyandu } })
    targetPosyanduId = p?.id
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        nama: name,
        email: email,
        password: hashedPassword,
        role: role,
        kecamatanId: targetKecamatanId,
        desaId: targetDesaId,
        posyanduId: targetPosyanduId
      }
    })

    return NextResponse.json(newUser)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, name, email, role, password, posyanduId, desaId, kecamatanId } = body

    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 })
    }

    // Build update data dinamis
    const updateData: any = {}
    if (name) updateData.nama = name
    if (email) updateData.email = email
    if (role) updateData.role = role
    if (posyanduId !== undefined) updateData.posyanduId = posyanduId || null
    if (desaId !== undefined) updateData.desaId = desaId || null
    if (kecamatanId !== undefined) updateData.kecamatanId = kecamatanId || null
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 })
    }

    // Cegah menghapus akun sendiri
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    })
    if (currentUser?.id === id) {
      return NextResponse.json({ error: "Tidak dapat menghapus akun sendiri" }, { status: 403 })
    }

    await prisma.user.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
