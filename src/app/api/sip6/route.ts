import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const requester = await prisma.user.findUnique({
    where: { email: session.user.email as string }
  })
  if (!requester) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  const posyanduId = searchParams.get("posyanduId")
  const desaId = searchParams.get("desaId")
  const kecamatanId = searchParams.get("kecamatanId")
  const tahun = searchParams.get("tahun")

  const where: any = {}

  if (requester.role === 'OPERATOR_POSYANDU') {
    if (!requester.posyanduId) {
      return NextResponse.json({ error: "Forbidden: Posyandu ID tidak diatur" }, { status: 403 })
    }
    where.posyanduId = requester.posyanduId
  } else if (requester.role === 'OPERATOR_DESA') {
    if (!requester.desaId) {
      return NextResponse.json({ error: "Forbidden: Desa ID tidak diatur" }, { status: 403 })
    }
    if (posyanduId) {
      const pos = await prisma.posyandu.findUnique({ where: { id: posyanduId } })
      if (!pos || pos.desaId !== requester.desaId) {
        return NextResponse.json({ error: "Forbidden: Posyandu tidak dalam wilayah desa Anda" }, { status: 403 })
      }
      where.posyanduId = posyanduId
    } else {
      where.posyandu = { desaId: requester.desaId }
    }
  } else if (requester.role === 'ADMIN_KECAMATAN') {
    if (!requester.kecamatanId) {
      return NextResponse.json({ error: "Forbidden: Kecamatan ID tidak diatur" }, { status: 403 })
    }
    if (posyanduId) {
      const pos = await prisma.posyandu.findUnique({
        where: { id: posyanduId },
        include: { desa: true }
      })
      if (!pos || pos.desa.kecamatanId !== requester.kecamatanId) {
        return NextResponse.json({ error: "Forbidden: Posyandu tidak dalam wilayah kecamatan Anda" }, { status: 403 })
      }
      where.posyanduId = posyanduId
    } else if (desaId) {
      const d = await prisma.desa.findUnique({ where: { id: desaId } })
      if (!d || d.kecamatanId !== requester.kecamatanId) {
        return NextResponse.json({ error: "Forbidden: Desa tidak dalam wilayah kecamatan Anda" }, { status: 403 })
      }
      where.posyandu = { desaId: desaId }
    } else {
      where.posyandu = { desa: { kecamatanId: requester.kecamatanId } }
    }
  } else {
    // SUPERADMIN / viewer / etc.
    if (posyanduId) {
      where.posyanduId = posyanduId
    } else if (desaId) {
      where.posyandu = { desaId: desaId }
    } else if (kecamatanId) {
      where.posyandu = { desa: { kecamatanId: kecamatanId } }
    }
  }

  if (tahun) {
    where.tahun = parseInt(tahun)
  }

  try {
    const reports = await prisma.sip6Bulanan.findMany({
      where,
      orderBy: { bulan: "asc" },
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error("Error fetching sip6 reports:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const requester = await prisma.user.findUnique({
    where: { email: session.user.email as string }
  })
  if (!requester) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  try {
    const body = await request.json()
    const { posyanduId, tahun, bulan, ...data } = body

    if (!posyanduId || !tahun || !bulan) {
      return NextResponse.json({ error: "posyanduId, tahun, and bulan are required" }, { status: 400 })
    }

    // Role-based authorization for target posyandu
    if (requester.role === 'OPERATOR_POSYANDU') {
      if (posyanduId !== requester.posyanduId) {
        return NextResponse.json({ error: "Forbidden: Hanya dapat mengubah data Posyandu Anda sendiri" }, { status: 403 })
      }
    } else if (requester.role === 'OPERATOR_DESA') {
      const pos = await prisma.posyandu.findUnique({ where: { id: posyanduId } })
      if (!pos || pos.desaId !== requester.desaId) {
        return NextResponse.json({ error: "Forbidden: Posyandu tidak dalam wilayah desa Anda" }, { status: 403 })
      }
    } else if (requester.role === 'ADMIN_KECAMATAN') {
      const pos = await prisma.posyandu.findUnique({
        where: { id: posyanduId },
        include: { desa: true }
      })
      if (!pos || pos.desa.kecamatanId !== requester.kecamatanId) {
        return NextResponse.json({ error: "Forbidden: Posyandu tidak dalam wilayah kecamatan Anda" }, { status: 403 })
      }
    } else if (requester.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: "Forbidden: Role tidak diizinkan membuat data" }, { status: 403 })
    }

    const report = await prisma.sip6Bulanan.upsert({
      where: {
        posyanduId_tahun_bulan: {
          posyanduId,
          tahun: parseInt(tahun),
          bulan: parseInt(bulan),
        },
      },
      update: data,
      create: {
        posyanduId,
        tahun: parseInt(tahun),
        bulan: parseInt(bulan),
        ...data,
      },
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error creating/updating sip6 report:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const requester = await prisma.user.findUnique({
    where: { email: session.user.email as string }
  })
  if (!requester) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 })
  }

  try {
    const existing = await prisma.sip6Bulanan.findUnique({
      where: { id },
      include: { posyandu: { include: { desa: true } } }
    })
    if (!existing) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }

    // Role-based authorization for deletion
    if (requester.role === 'OPERATOR_POSYANDU') {
      if (existing.posyanduId !== requester.posyanduId) {
        return NextResponse.json({ error: "Forbidden: Hanya dapat menghapus data Posyandu Anda sendiri" }, { status: 403 })
      }
    } else if (requester.role === 'OPERATOR_DESA') {
      if (existing.posyandu.desaId !== requester.desaId) {
        return NextResponse.json({ error: "Forbidden: Posyandu tidak dalam wilayah desa Anda" }, { status: 403 })
      }
    } else if (requester.role === 'ADMIN_KECAMATAN') {
      if (existing.posyandu.desa.kecamatanId !== requester.kecamatanId) {
        return NextResponse.json({ error: "Forbidden: Posyandu tidak dalam wilayah kecamatan Anda" }, { status: 403 })
      }
    } else if (requester.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: "Forbidden: Role tidak diizinkan menghapus data" }, { status: 403 })
    }

    await prisma.sip6Bulanan.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting sip6 report:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
