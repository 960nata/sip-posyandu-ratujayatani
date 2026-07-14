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

  const where: any = {}

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
    const reports = await prisma.laporanPR.findMany({
      where,
      include: {
        dataDukungs: true,
      },
      orderBy: { tanggal: "desc" },
    })
    return NextResponse.json(reports)
  } catch (error) {
    console.error("Error fetching perumahan reports:", error)
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
    const { id, posyanduId, tanggal, nama, nik, alamat, fcKK, fcKTP, sp, suketPenghasilan, fotoRumah, status, keteranganTL, keteranganBTL, dataDukungIds } = body

    if (!posyanduId || !tanggal || !nama) {
      return NextResponse.json({ error: "posyanduId, tanggal, and nama are required" }, { status: 400 })
    }

    const data: any = {
      posyanduId,
      tanggal: new Date(tanggal),
      nama,
      nik: nik || null,
      alamat: alamat || null,
      fcKK: !!fcKK,
      fcKTP: !!fcKTP,
      suratPermohonan: !!sp,
      suketPenghasilan: !!suketPenghasilan,
      fotoKondisiRumah: !!fotoRumah,
      keteranganTL: keteranganTL || null,
      keteranganBTL: keteranganBTL || null,
      status: status || "BTL",
      keteranganPermohonan: "USER"
    }

    if (id) {
      const report = await prisma.laporanPR.update({
        where: { id },
        data: {
          ...data,
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
      const report = await prisma.laporanPR.create({
        data: {
          ...data,
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
    console.error("Error saving perumahan report:", error)
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
    await prisma.laporanPR.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting perumahan report:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
