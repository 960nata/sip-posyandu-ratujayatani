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

  const { searchParams } = new URL(request.url)
  const tahun = parseInt(searchParams.get("tahun") || "") || new Date().getFullYear()

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
                sip6s: {
                  where: { tahun },
                  select: { id: true }
                },
                sip7s: {
                  where: { tahun },
                  select: { id: true }
                }
              }
            }
          }
        }
      }
    })

    const formatted = data.map(kec => ({
      ...kec,
      desas: kec.desas.map(desa => ({
        ...desa,
        posyandus: desa.posyandus.map(pos => ({
          id: pos.id,
          nama: pos.nama,
          hariBuka: pos.hariBuka,
          strata: pos.strata,
          status: pos.status,
          desaId: pos.desaId,
          _count: {
            sip6s: pos.sip6s.length,
            sip7s: pos.sip7s.length
          }
        }))
      }))
    }))

    return NextResponse.json(formatted)
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
