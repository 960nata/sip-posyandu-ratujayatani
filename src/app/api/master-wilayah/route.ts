import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const role = (session.user as any).role
  if (role !== "SUPERADMIN" && role !== "VIEWER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const data = await prisma.kecamatan.findMany({
      orderBy: { nama: "asc" },
      include: {
        desas: {
          orderBy: { nama: "asc" },
          include: {
            posyandus: {
              orderBy: { nama: "asc" },
              include: {
                _count: {
                  select: { sip6s: true, sip7s: true }
                }
              }
            }
          }
        }
      }
    })
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const role = (session.user as any).role
  if (role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { id, type, data } = body
    
    if (type === 'posyandu') {
      const updated = await prisma.posyandu.update({
        where: { id },
        data: {
          status: data.status
        }
      })
      return NextResponse.json(updated)
    }
    
    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
