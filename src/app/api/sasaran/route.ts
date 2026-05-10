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
      posyanduId, kategori, nama, jenisKelamin, tanggalLahir, 
      namaIbu, namaAyah, namaSuami, namaBayi, tahun 
    } = body

    if (!posyanduId) {
      return NextResponse.json({ error: "posyanduId is required" }, { status: 400 })
    }

    const sasaran = await prisma.sasaranIndividu.create({
      data: {
        posyanduId,
        kategori: kategori as KategoriSasaranEnum,
        nama,
        jenisKelamin: jenisKelamin as JKEnum,
        tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : null,
        namaIbu,
        namaAyah,
        namaSuami,
        namaBayi,
        tahun: parseInt(tahun),
      },
    })

    return NextResponse.json(sasaran)
  } catch (error) {
    console.error("Error creating sasaran:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
