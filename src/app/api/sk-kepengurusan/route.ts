import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = session.user as any
  const posyanduId = user.posyanduId

  if (!posyanduId) {
    return NextResponse.json({ error: "Posyandu not found for this user" }, { status: 404 })
  }

  const skList = await prisma.skKepengurusan.findMany({
    where: { posyanduId },
    include: {
      anggota: {
        orderBy: { createdAt: "asc" }
      },
      posyandu: {
        select: { nama: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return NextResponse.json(skList)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = session.user as any
  const posyanduId = user.posyanduId

  if (!posyanduId) {
    return NextResponse.json({ error: "Posyandu not found for this user" }, { status: 404 })
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
      anggota
    } = body

    if (!nomorSK || !tanggalPenetapan || !pejabatPenetap || !periodeAwal || !periodeAkhir) {
      return NextResponse.json({ error: "Data SK tidak lengkap" }, { status: 400 })
    }

    if (!anggota || !Array.isArray(anggota) || anggota.length === 0) {
      return NextResponse.json({ error: "Minimal harus ada 1 anggota pengurus" }, { status: 400 })
    }

    const newSK = await prisma.skKepengurusan.create({
      data: {
        posyanduId,
        nomorSK,
        tanggalPenetapan: new Date(tanggalPenetapan),
        pejabatPenetap,
        periodeAwal: new Date(periodeAwal),
        periodeAkhir: new Date(periodeAkhir),
        keterangan: keterangan || null,
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
        anggota: true,
        posyandu: { select: { nama: true } }
      }
    })

    return NextResponse.json(newSK)
  } catch (error: any) {
    console.error("Error creating SK:", error)
    return NextResponse.json({ error: "Gagal membuat SK" }, { status: 500 })
  }
}
