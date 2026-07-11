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

  const countInclude = {
    users: true,
    _count: { select: { laporanPengaduans: true, laporanPRs: true, sip6s: true, sip7s: true } },
  }

  if (desaId) {
    const posyandus = await prisma.posyandu.findMany({
      where: { desaId: desaId },
      include: countInclude,
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
    include: countInclude,
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

  return NextResponse.json(newPosyandu)
}

export async function PUT(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, nama, hariBuka, strata } = body

    if (!id) {
      return NextResponse.json({ error: "Missing posyandu ID" }, { status: 400 })
    }

    const updated = await prisma.posyandu.update({
      where: { id },
      data: {
        ...(nama && { nama }),
        ...(hariBuka && { hariBuka }),
        ...(strata && { strata }),
      },
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
      return NextResponse.json({ error: "Missing posyandu ID" }, { status: 400 })
    }

    // Cascade delete semua data terkait dalam satu transaksi
    await prisma.$transaction(async (tx) => {
      // 1. Hapus data SIP 6 terkait
      await tx.sip6Bulanan.deleteMany({ where: { posyanduId: id } })

      // 2. Hapus data SIP 7 terkait
      await tx.sip7Bulanan.deleteMany({ where: { posyanduId: id } })

      // 3. Hapus laporan pengaduan terkait
      await tx.laporanPengaduan.deleteMany({ where: { posyanduId: id } })

      // 4. Hapus laporan PR terkait
      await tx.laporanPR.deleteMany({ where: { posyanduId: id } })

      // 5. Hapus data dukung terkait
      await tx.dataDukung.deleteMany({ where: { posyanduId: id } })

      // 6. Hapus SK kepengurusan terkait
      await tx.skKepengurusan.deleteMany({ where: { posyanduId: id } })

      // 7. Lepaskan user dari posyandu (set posyanduId = null)
      await tx.user.updateMany({
        where: { posyanduId: id },
        data: { posyanduId: null },
      })

      // 8. Hapus posyandu
      await tx.posyandu.delete({ where: { id } })
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
