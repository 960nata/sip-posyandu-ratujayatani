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

  const sk = await prisma.skKepengurusan.findUnique({
    where: { id },
    include: {
      anggota: { orderBy: { createdAt: "asc" } },
      posyandu: { select: { nama: true } }
    }
  })

  if (!sk) {
    return NextResponse.json({ error: "SK tidak ditemukan" }, { status: 404 })
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
      anggota
    } = body

    // Delete existing anggota and re-create
    await prisma.anggotaSK.deleteMany({ where: { skId: id } })

    const updatedSK = await prisma.skKepengurusan.update({
      where: { id },
      data: {
        nomorSK,
        tanggalPenetapan: new Date(tanggalPenetapan),
        pejabatPenetap,
        periodeAwal: new Date(periodeAwal),
        periodeAkhir: new Date(periodeAkhir),
        keterangan: keterangan || null,
        isActive: isActive ?? true,
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

  try {
    await prisma.skKepengurusan.delete({ where: { id } })
    return NextResponse.json({ message: "SK berhasil dihapus" })
  } catch (error: any) {
    console.error("Error deleting SK:", error)
    return NextResponse.json({ error: "Gagal menghapus SK" }, { status: 500 })
  }
}
