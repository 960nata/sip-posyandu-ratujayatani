import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const tahunParam = searchParams.get("tahun")
  const tahun = tahunParam ? parseInt(tahunParam) : 2026

  const user = session.user as any
  const role = user.role

  const scope6: any = { tahun }
  const scope7: any = { tahun }

  if (role === "OPERATOR_POSYANDU") {
    scope6.posyanduId = user.posyanduId
    scope7.posyanduId = user.posyanduId
  } else if (role === "OPERATOR_DESA") {
    scope6.posyandu = { desaId: user.desaId }
    scope7.posyandu = { desaId: user.desaId }
  } else if (role === "ADMIN_KECAMATAN") {
    scope6.posyandu = { desa: { kecamatanId: user.kecamatanId } }
    scope7.posyandu = { desa: { kecamatanId: user.kecamatanId } }
  }

  try {
    // Aggregations for SIP 6
    const sip6Agg = await prisma.sip6Bulanan.aggregate({
      where: scope6,
      _sum: {
        bayiBaruL: true,
        bayiBaruP: true,
        bayiLamaL: true,
        bayiLamaP: true,
        balitaBaruL: true,
        balitaBaruP: true,
        balitaLamaL: true,
        balitaLamaP: true,
        lansiaBaruL: true,
        lansiaBaruP: true,
        lansiaLamaL: true,
        lansiaLamaP: true,
        ibuHamil: true,
      }
    })

    // Aggregations for SIP 7
    const sip7Agg = await prisma.sip7Bulanan.aggregate({
      where: scope7,
      _sum: {
        jmlBumil: true,
        balitaS_L: true,
        balitaS_P: true,
      }
    })

    const totalBalitaSIP6 = (sip6Agg._sum.bayiBaruL || 0) + (sip6Agg._sum.bayiBaruP || 0) +
                            (sip6Agg._sum.bayiLamaL || 0) + (sip6Agg._sum.bayiLamaP || 0) +
                            (sip6Agg._sum.balitaBaruL || 0) + (sip6Agg._sum.balitaBaruP || 0) +
                            (sip6Agg._sum.balitaLamaL || 0) + (sip6Agg._sum.balitaLamaP || 0)

    const totalLansiaSIP6 = (sip6Agg._sum.lansiaBaruL || 0) + (sip6Agg._sum.lansiaBaruP || 0) +
                            (sip6Agg._sum.lansiaLamaL || 0) + (sip6Agg._sum.lansiaLamaP || 0)

    const totalBumilSIP6 = sip6Agg._sum.ibuHamil || 0

    const totalBalitaSIP7 = (sip7Agg._sum.balitaS_L || 0) + (sip7Agg._sum.balitaS_P || 0)
    const totalBumilSIP7 = sip7Agg._sum.jmlBumil || 0

    // Fetch monthly stats for charts (trend)
    const monthlySip6 = await prisma.sip6Bulanan.findMany({
      where: scope6,
      select: {
        bulan: true,
        bayiBaruL: true, bayiBaruP: true, bayiLamaL: true, bayiLamaP: true,
        balitaBaruL: true, balitaBaruP: true, balitaLamaL: true, balitaLamaP: true,
        lansiaBaruL: true, lansiaBaruP: true, lansiaLamaL: true, lansiaLamaP: true,
        ibuHamil: true
      }
    })

    const monthlyStats = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1
      const records = monthlySip6.filter(r => r.bulan === month)
      
      let balita = 0
      let lansia = 0
      let bumil = 0
      
      records.forEach(r => {
        balita += r.bayiBaruL + r.bayiBaruP + r.bayiLamaL + r.bayiLamaP + r.balitaBaruL + r.balitaBaruP + r.balitaLamaL + r.balitaLamaP
        lansia += r.lansiaBaruL + r.lansiaBaruP + r.lansiaLamaL + r.lansiaLamaP
        bumil += r.ibuHamil
      })
      
      return {
        month,
        balita,
        lansia,
        bumil
      }
    })

    // Compute active posyandu count in scope
    const activePosyandus = await prisma.posyandu.count({
      where: role === "OPERATOR_DESA" ? { desaId: user.desaId } : role === "ADMIN_KECAMATAN" ? { desa: { kecamatanId: user.kecamatanId } } : {}
    })

    return NextResponse.json({
      sip6: {
        totalBalita: Math.round(totalBalitaSIP6 / 12) || 0,
        totalLansia: Math.round(totalLansiaSIP6 / 12) || 0,
        totalIbuHamil: Math.round(totalBumilSIP6 / 12) || 0,
      },
      sip7: {
        totalBalita: Math.round(totalBalitaSIP7 / 12) || 0,
        totalIbuHamil: Math.round(totalBumilSIP7 / 12) || 0,
      },
      activePosyanduCount: activePosyandus,
      monthlyTrend: monthlyStats
    })
  } catch (error) {
    console.error("Error fetching health stats:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
