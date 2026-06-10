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
  const tahun = searchParams.get("tahun")

  const where: any = {}
  if (posyanduId) where.posyanduId = posyanduId
  if (tahun) where.tahun = parseInt(tahun)

  try {
    const reports = await prisma.sip7Bulanan.findMany({
      where,
      orderBy: { bulan: "asc" },
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error("Error fetching sip7 reports:", error)
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
    const { posyanduId, tahun, bulan, ...data } = body

    if (!posyanduId || !tahun || !bulan) {
      return NextResponse.json({ error: "posyanduId, tahun, and bulan are required" }, { status: 400 })
    }

    const report = await prisma.sip7Bulanan.upsert({
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
    console.error("Error creating/updating sip7 report:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
