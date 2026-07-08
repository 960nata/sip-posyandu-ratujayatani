import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const user = session.user as any
  const role = user.role

  const sk = await prisma.skKepengurusan.findUnique({
    where: { id },
    include: {
      anggota: { orderBy: { createdAt: "asc" } },
      posyandu: { select: { nama: true, desaId: true, id: true } }
    }
  })

  if (!sk) {
    return NextResponse.json({ error: "SK tidak ditemukan" }, { status: 404 })
  }

  // Check read permission
  if (role === "SUPERADMIN" || role === "ADMIN_KECAMATAN") {
    // Allowed
  } else if (role === "OPERATOR_DESA") {
    if (sk.posyandu.desaId !== user.desaId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }
  } else if (role === "OPERATOR_POSYANDU") {
    if (sk.posyanduId !== user.posyanduId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }
  } else {
    return NextResponse.json({ error: "Access denied" }, { status: 403 })
  }

  return NextResponse.json(sk)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const user = session.user as any
  const role = user.role

  const sk = await prisma.skKepengurusan.findUnique({
    where: { id },
    include: {
      posyandu: { select: { desaId: true, id: true } }
    }
  })

  if (!sk) {
    return NextResponse.json({ error: "SK tidak ditemukan" }, { status: 404 })
  }

  // Validate write permission:
  if (role === "SUPERADMIN") {
    // Allowed
  } else if (role === "OPERATOR_DESA") {
    if (sk.posyandu.desaId !== user.desaId) {
      return NextResponse.json({ error: "Anda hanya diperbolehkan mengedit SK di wilayah Anda" }, { status: 403 })
    }
  } else if (role === "OPERATOR_POSYANDU") {
    if (sk.posyanduId !== user.posyanduId) {
      return NextResponse.json({ error: "Anda hanya diperbolehkan mengedit SK untuk posyandu Anda" }, { status: 403 })
    }
  } else {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const {
      nomorSK,
      tanggalPenetapan,
      pejabatPenetap,
      periodeAwal,
      periodeAkhir,
      keterangan,
      isActive,
      anggota,
      posyanduId
    } = body

    const updateData: any = {
      nomorSK,
      tanggalPenetapan: new Date(tanggalPenetapan),
      pejabatPenetap,
      periodeAwal: new Date(periodeAwal),
      periodeAkhir: new Date(periodeAkhir),
      keterangan: keterangan || null,
      isActive: isActive ?? true,
    }

    if (role === "OPERATOR_DESA") {
      if (posyanduId) {
        const posyanduObj = await prisma.posyandu.findUnique({
          where: { id: posyanduId },
          select: { desaId: true }
        })
        if (!posyanduObj || posyanduObj.desaId !== user.desaId) {
          return NextResponse.json({ error: "Posyandu tidak valid atau berada di luar wilayah desa Anda" }, { status: 403 })
        }
        updateData.posyanduId = posyanduId
      }
    }

    // Delete existing anggota and re-create
    await prisma.anggotaSK.deleteMany({ where: { skId: id } })

    const updatedSK = await prisma.skKepengurusan.update({
      where: { id },
      data: {
        ...updateData,
        anggota: {
          create: anggota.map((a: any) => ({
            nama: a.nama,
            jabatan: a.jabatan,
            bidang: a.bidang || null,
            nikNip: a.nikNip || null,
            alamat: a.alamat || null,
            noHP: a.noHP || null,
          }))
        }
      },
      include: {
        anggota: { orderBy: { createdAt: "asc" } },
        posyandu: { select: { nama: true } }
      }
    })

    return NextResponse.json(updatedSK)
  } catch (error: any) {
    console.error("Error updating SK:", error)
    return NextResponse.json({ error: "Gagal mengupdate SK" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const user = session.user as any
  const role = user.role

  const sk = await prisma.skKepengurusan.findUnique({
    where: { id },
    include: {
      posyandu: { select: { desaId: true, id: true } }
    }
  })

  if (!sk) {
    return NextResponse.json({ error: "SK tidak ditemukan" }, { status: 404 })
  }

  // Validate write permission:
  if (role === "SUPERADMIN") {
    // Allowed
  } else if (role === "OPERATOR_DESA") {
    if (sk.posyandu.desaId !== user.desaId) {
      return NextResponse.json({ error: "Anda hanya diperbolehkan menghapus SK di wilayah Anda" }, { status: 403 })
    }
  } else if (role === "OPERATOR_POSYANDU") {
    if (sk.posyanduId !== user.posyanduId) {
      return NextResponse.json({ error: "Anda hanya diperbolehkan menghapus SK untuk posyandu Anda" }, { status: 403 })
    }
  } else {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 })
  }

  try {
    await prisma.skKepengurusan.delete({ where: { id } })
    return NextResponse.json({ message: "SK berhasil dihapus" })
  } catch (error: any) {
    console.error("Error deleting SK:", error)
    return NextResponse.json({ error: "Gagal menghapus SK" }, { status: 500 })
  }
}

