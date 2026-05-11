import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET all notifications (for the current user based on role/location)
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

  try {
    let whereClause = {}

    // Filter based on role
    if (user.role === 'OPERATOR_POSYANDU') {
      whereClause = {
        OR: [
          { target: 'SEMUA' },
          { target: 'POSYANDU', targetId: user.posyanduId },
          { target: 'DESA', targetId: user.desaId },
          { target: 'KECAMATAN', targetId: user.kecamatanId }
        ]
      }
    } else if (user.role === 'OPERATOR_DESA') {
      whereClause = {
        OR: [
          { target: 'SEMUA' },
          { target: 'DESA', targetId: user.desaId },
          { target: 'KECAMATAN', targetId: user.kecamatanId }
        ]
      }
    } else if (user.role === 'ADMIN_KECAMATAN') {
      whereClause = {
        OR: [
          { target: 'SEMUA' },
          { target: 'KECAMATAN', targetId: user.kecamatanId }
        ]
      }
    }

    const notifications = await (prisma as any).notification.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      take: 5 // Only get the latest 5 for the dropdown
    })

    return NextResponse.json(notifications)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST a new notification (Admin only)
export async function POST(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { title, message, target, targetId } = body

  if (!title || !message || !target) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    let finalTargetId = targetId

    // Look up ID if target is name
    if (target === 'KECAMATAN' && targetId) {
      const kec = await prisma.kecamatan.findFirst({ where: { nama: targetId } })
      finalTargetId = kec?.id || null
    } else if (target === 'DESA' && targetId) {
      const d = await prisma.desa.findFirst({ where: { nama: targetId } })
      finalTargetId = d?.id || null
    } else if (target === 'POSYANDU' && targetId) {
      const p = await prisma.posyandu.findFirst({ where: { nama: targetId } })
      finalTargetId = p?.id || null
    }

    const notification = await (prisma as any).notification.create({
      data: {
        title,
        message,
        target,
        targetId: finalTargetId
      }
    })

    return NextResponse.json(notification)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
