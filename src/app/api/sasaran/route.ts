import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { KategoriSasaranEnum, JKEnum } from "@prisma/client"

export async function GET(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const posyanduId = searchParams.get("posyanduId")
  const kategori = searchParams.get("kategori")

  const where: any = {}
  if (posyanduId) where.posyanduId = posyanduId
  if (kategori) where.kategori = kategori as KategoriSasaranEnum

  try {
    const sasarans = await prisma.sasaranIndividu.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(sasarans)
  } catch (error) {
    console.error("Error fetching sasarans:", error)
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
    const { 
      id, posyanduId, kategori, nama, jenisKelamin, tanggalLahir, 
      namaIbu, namaAyah, namaSuami, namaBayi, tahun,
      jan, feb, mar, apr, mei, jun, jul, agu, sep, okt, nov, des,
      detailKunjungan
    } = body

    if (!posyanduId) {
      return NextResponse.json({ error: "posyanduId is required" }, { status: 400 })
    }

    const data: any = {
      posyanduId,
      kategori: kategori as KategoriSasaranEnum,
      nama,
      jenisKelamin: jenisKelamin ? (jenisKelamin as JKEnum) : null,
      tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : null,
      namaIbu,
      namaAyah,
      namaSuami,
      namaBayi,
      tahun: parseInt(tahun),
      jan: jan ?? false,
      feb: feb ?? false,
      mar: mar ?? false,
      apr: apr ?? false,
      mei: mei ?? false,
      jun: jun ?? false,
      jul: jul ?? false,
      agu: agu ?? false,
      sep: sep ?? false,
      okt: okt ?? false,
      nov: nov ?? false,
      des: des ?? false,
      detailKunjungan: detailKunjungan ?? {},
    }

    let sasaran
    if (id) {
      sasaran = await prisma.sasaranIndividu.update({
        where: { id },
        data,
      })
    } else {
      sasaran = await prisma.sasaranIndividu.create({
        data,
      })
    }

    return NextResponse.json(sasaran)
  } catch (error) {
    console.error("Error saving sasaran:", error)
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
    await prisma.sasaranIndividu.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting sasaran:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
