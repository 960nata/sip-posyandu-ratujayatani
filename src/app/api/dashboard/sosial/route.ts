import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const posyanduId = searchParams.get("posyanduId")
  const desaId = searchParams.get("desaId")
  const kecamatanId = searchParams.get("kecamatanId")
  const tahun = searchParams.get("tahun")

  const where: any = { bidang: "SOSIAL" }

  if (posyanduId) {
    where.posyanduId = posyanduId
  } else if (desaId) {
    where.posyandu = { desaId: desaId }
  } else if (kecamatanId) {
    where.posyandu = { desa: { kecamatanId: kecamatanId } }
  }

  if (tahun) {
    const t = parseInt(tahun)
    where.tanggal = {
      gte: new Date(`${t}-01-01T00:00:00.000Z`),
      lte: new Date(`${t}-12-31T23:59:59.999Z`),
    }
  }

  try {
    const reports = await prisma.laporanPengaduan.findMany({
      where,
      include: {
        dataDukungs: true,
      },
      orderBy: { tanggal: "desc" },
    })
    return NextResponse.json(reports)
  } catch (error) {
    console.error("Error fetching sosial reports:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, posyanduId, tanggal, nik, nama, alamat, hal, keteranganTL, keteranganBTL, status, dataDukungIds } = body

    if (!posyanduId || !tanggal || !nama) {
      return NextResponse.json({ error: "posyanduId, tanggal, and nama are required" }, { status: 400 })
    }

    const createdBy = session.user.name || session.user.email || "OPERATOR"

    const data: any = {
      posyanduId,
      bidang: "SOSIAL",
      tanggal: new Date(tanggal),
      nik: nik || null,
      nama,
      alamat: alamat || null,
      halPengaduan: hal || "",
      keteranganTL: keteranganTL || null,
      keteranganBTL: keteranganBTL || null,
      status: status || "BTL",
    }

    if (id) {
      const report = await prisma.laporanPengaduan.update({
        where: { id },
        data: {
          ...data,
          updatedBy: createdBy,
          dataDukungs: Array.isArray(dataDukungIds) ? {
            set: dataDukungIds.map((did: string) => ({ id: did }))
          } : undefined,
        },
        include: {
          dataDukungs: true,
        },
      })
      return NextResponse.json(report)
    } else {
      const report = await prisma.laporanPengaduan.create({
        data: {
          ...data,
          createdBy,
          dataDukungs: Array.isArray(dataDukungIds) && dataDukungIds.length ? {
            connect: dataDukungIds.map((did: string) => ({ id: did }))
          } : undefined,
        },
        include: {
          dataDukungs: true,
        },
      })
      return NextResponse.json(report)
    }
  } catch (error) {
    console.error("Error saving sosial report:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 })
  }

  try {
    await prisma.laporanPengaduan.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting sosial report:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
