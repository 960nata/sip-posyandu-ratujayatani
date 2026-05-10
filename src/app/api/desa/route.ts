import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const kecamatanId = searchParams.get("kecamatanId")

  if (kecamatanId) {
    const desas = await prisma.desa.findMany({
      where: { kecamatanId: kecamatanId }
    })
    return NextResponse.json(desas)
  }

  const desas = await prisma.desa.findMany()
  return NextResponse.json(desas)
}
