import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import * as bcrypt from "bcrypt"

export async function GET(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const desaId = searchParams.get("desaId")

  if (desaId) {
    const posyandus = await prisma.posyandu.findMany({
      where: { desaId: desaId },
      include: { users: true }
    })
    return NextResponse.json(posyandus)
  }

  const email = session.user.email

  // Find user to get desaId
  const user = await prisma.user.findUnique({
    where: { email: email as string }
  })

  if (!user || !user.desaId) {
    return NextResponse.json({ error: "User or Desa not found" }, { status: 404 })
  }

  const posyandus = await prisma.posyandu.findMany({
    where: { desaId: user.desaId },
    include: { users: true }
  })

  return NextResponse.json(posyandus)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const email = session.user.email
  const user = await prisma.user.findUnique({
    where: { email: email as string }
  })

  if (!user || !user.desaId) {
    return NextResponse.json({ error: "User or Desa not found" }, { status: 404 })
  }

  const body = await request.json()
  const { nama, hariBuka, strata } = body

  const newPosyandu = await prisma.posyandu.create({
    data: {
      nama,
      hariBuka,
      strata,
      desaId: user.desaId,
      statusBangunan: "MILIK_SENDIRI" // Default value
    }
  })

  // Auto create user for this Posyandu
  const posyanduEmail = `posyandu.${nama.toLowerCase().replace(/\s+/g, '')}@siplamtim.id`
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  await prisma.user.create({
    data: {
      nama: `Operator ${nama}`,
      email: posyanduEmail,
      password: hashedPassword,
      role: 'OPERATOR_POSYANDU',
      desaId: user.desaId,
      posyanduId: newPosyandu.id
    } as any
  })

  return NextResponse.json(newPosyandu)
}
