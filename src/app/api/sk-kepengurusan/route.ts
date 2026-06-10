import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = session.user as any
  const role = user.role

  // SUPERADMIN: fetch all SK
  if (role === "SUPERADMIN") {
    const skList = await prisma.skKepengurusan.findMany({
      include: {
        anggota: { orderBy: { createdAt: "asc" } },
        posyandu: { select: { nama: true, id: true } }
      },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(skList)
  }

  // ADMIN_KECAMATAN: fetch all SK from posyandus in their kecamatan
  if (role === "ADMIN_KECAMATAN") {
    const kecamatanId = user.kecamatanId
    if (!kecamatanId) {
      return NextResponse.json({ error: "Kecamatan not found for this user" }, { status: 404 })
    }

    const skList = await prisma.skKepengurusan.findMany({
      where: {
        posyandu: {
          desa: { kecamatanId }
        }
      },
      include: {
        anggota: { orderBy: { createdAt: "asc" } },
        posyandu: { select: { nama: true, id: true } }
      },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(skList)
  }

  // OPERATOR_DESA: fetch all SK from all posyandus in their desa
  if (role === "OPERATOR_DESA") {
    const desaId = user.desaId
    if (!desaId) {
      return NextResponse.json({ error: "Desa not found for this user" }, { status: 404 })
    }

    const skList = await prisma.skKepengurusan.findMany({
      where: {
        posyandu: { desaId }
      },
      include: {
        anggota: { orderBy: { createdAt: "asc" } },
        posyandu: { select: { nama: true, id: true } }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(skList)
  }

  // OPERATOR_POSYANDU: fetch only their posyandu's SK
  const posyanduId = user.posyanduId
  if (!posyanduId) {
    return NextResponse.json({ error: "Posyandu not found for this user" }, { status: 404 })
  }

  const skList = await prisma.skKepengurusan.findMany({
    where: { posyanduId },
    include: {
      anggota: { orderBy: { createdAt: "asc" } },
      posyandu: { select: { nama: true, id: true } }
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
  const role = user.role

  try {
    const body = await request.json()
    const {
      nomorSK,
      tanggalPenetapan,
      pejabatPenetap,
      periodeAwal,
      periodeAkhir,
      keterangan,
      anggota,
      posyanduId
    } = body

    if (!nomorSK || !tanggalPenetapan || !pejabatPenetap || !periodeAwal || !periodeAkhir) {
      return NextResponse.json({ error: "Data SK tidak lengkap" }, { status: 400 })
    }

    if (!anggota || !Array.isArray(anggota) || anggota.length === 0) {
      return NextResponse.json({ error: "Minimal harus ada 1 anggota pengurus" }, { status: 400 })
    }

    let targetPosyanduId = ""
    let targetTipe = "SK_PENGELOLA"

    if (role === "SUPERADMIN") {
      if (!posyanduId) {
        return NextResponse.json({ error: "Posyandu harus dipilih" }, { status: 400 })
      }
      targetPosyanduId = posyanduId
      targetTipe = "SK_DESA"
    } else if (role === "OPERATOR_DESA") {
      if (!posyanduId) {
        return NextResponse.json({ error: "Posyandu harus dipilih" }, { status: 400 })
      }
      const posyanduObj = await prisma.posyandu.findUnique({
        where: { id: posyanduId },
        select: { desaId: true }
      })
      if (!posyanduObj || posyanduObj.desaId !== user.desaId) {
        return NextResponse.json({ error: "Posyandu tidak valid atau berada di luar wilayah desa Anda" }, { status: 403 })
      }
      targetPosyanduId = posyanduId
      targetTipe = "SK_DESA"
    } else if (role === "OPERATOR_POSYANDU") {
      if (!user.posyanduId) {
        return NextResponse.json({ error: "Posyandu tidak ditemukan untuk user ini" }, { status: 404 })
      }
      targetPosyanduId = user.posyanduId
      targetTipe = "SK_PENGELOLA"
    } else {
      return NextResponse.json({ error: "Role Anda tidak diizinkan untuk membuat SK" }, { status: 403 })
    }

    const newSK = await prisma.skKepengurusan.create({
      data: {
        posyanduId: targetPosyanduId,
        nomorSK,
        tanggalPenetapan: new Date(tanggalPenetapan),
        pejabatPenetap,
        periodeAwal: new Date(periodeAwal),
        periodeAkhir: new Date(periodeAkhir),
        keterangan: keterangan || null,
        tipe: targetTipe,
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

