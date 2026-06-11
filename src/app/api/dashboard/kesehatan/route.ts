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
  
  const bulanParam = searchParams.get("bulan")
  const bulan = bulanParam ? parseInt(bulanParam) : null

  const qKecamatan = searchParams.get("kecamatan")
  const qDesa = searchParams.get("desa")
  const qPosyandu = searchParams.get("posyandu")

  const user = session.user as any
  const role = user.role

  const scope6: any = { tahun }
  const scope7: any = { tahun }

  if (bulan) {
    scope6.bulan = bulan
    scope7.bulan = bulan
  }

  // Filter based on user role and query parameters
  if (role === "OPERATOR_POSYANDU") {
    scope6.posyanduId = user.posyanduId
    scope7.posyanduId = user.posyanduId
  } else if (role === "OPERATOR_DESA") {
    scope6.posyandu = { desaId: user.desaId }
    scope7.posyandu = { desaId: user.desaId }

    if (qPosyandu) {
      scope6.posyandu = { nama: qPosyandu, desaId: user.desaId }
      scope7.posyandu = { nama: qPosyandu, desaId: user.desaId }
    }
  } else if (role === "ADMIN_KECAMATAN") {
    scope6.posyandu = { desa: { kecamatanId: user.kecamatanId } }
    scope7.posyandu = { desa: { kecamatanId: user.kecamatanId } }

    if (qPosyandu) {
      scope6.posyandu = { nama: qPosyandu, desa: { kecamatanId: user.kecamatanId } }
      scope7.posyandu = { nama: qPosyandu, desa: { kecamatanId: user.kecamatanId } }
    } else if (qDesa) {
      scope6.posyandu = { desa: { nama: qDesa, kecamatanId: user.kecamatanId } }
      scope7.posyandu = { desa: { nama: qDesa, kecamatanId: user.kecamatanId } }
    }
  } else {
    // SUPERADMIN / ADMIN_KABUPATEN / VIEWER
    if (qPosyandu) {
      scope6.posyandu = { nama: qPosyandu }
      scope7.posyandu = { nama: qPosyandu }
    } else if (qDesa) {
      scope6.posyandu = { desa: { nama: qDesa } }
      scope7.posyandu = { desa: { nama: qDesa } }
    } else if (qKecamatan) {
      scope6.posyandu = { desa: { kecamatan: { nama: qKecamatan } } }
      scope7.posyandu = { desa: { kecamatan: { nama: qKecamatan } } }
    }
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
        bumilDiperiksa: true,
        bumilFeTab: true,
        jmlBusui: true,
        balitaS_L: true,
        balitaS_P: true,
        balitaD_L: true,
        balitaD_P: true,
        balitaN_L: true,
        balitaN_P: true,
        vitA_L: true,
        vitA_P: true,
        pmt_L: true,
        pmt_P: true,
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
    const trendScope6 = { ...scope6 }
    delete trendScope6.bulan
    const trendScope7 = { ...scope7 }
    delete trendScope7.bulan

    const monthlySip6 = await prisma.sip6Bulanan.findMany({
      where: trendScope6,
      select: {
        bulan: true,
        bayiBaruL: true, bayiBaruP: true, bayiLamaL: true, bayiLamaP: true,
        balitaBaruL: true, balitaBaruP: true, balitaLamaL: true, balitaLamaP: true,
        lansiaBaruL: true, lansiaBaruP: true, lansiaLamaL: true, lansiaLamaP: true,
        ibuHamil: true
      }
    })

    const monthlySip7 = await prisma.sip7Bulanan.findMany({
      where: trendScope7,
      select: {
        bulan: true,
        balitaS_L: true, balitaS_P: true,
        balitaD_L: true, balitaD_P: true,
        jmlBumil: true,
        bumilDiperiksa: true,
      }
    })

    const monthlyStats = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1
      const records6 = monthlySip6.filter(r => r.bulan === month)
      const records7 = monthlySip7.filter(r => r.bulan === month)
      
      let balita6 = 0
      let lansia6 = 0
      let bumil6 = 0
      
      let balita7S = 0
      let balita7D = 0
      let bumil7Jml = 0
      let bumil7Diperiksa = 0
      
      records6.forEach(r => {
        balita6 += r.bayiBaruL + r.bayiBaruP + r.bayiLamaL + r.bayiLamaP + r.balitaBaruL + r.balitaBaruP + r.balitaLamaL + r.balitaLamaP
        lansia6 += r.lansiaBaruL + r.lansiaBaruP + r.lansiaLamaL + r.lansiaLamaP
        bumil6 += r.ibuHamil
      })

      records7.forEach(r => {
        balita7S += r.balitaS_L + r.balitaS_P
        balita7D += r.balitaD_L + r.balitaD_P
        bumil7Jml += r.jmlBumil
        bumil7Diperiksa += r.bumilDiperiksa
      })
      
      return {
        month,
        balita: balita6,
        lansia: lansia6,
        bumil: bumil6,
        balitaS: balita7S,
        balitaD: balita7D,
        bumilJml: bumil7Jml,
        bumilDiperiksa: bumil7Diperiksa,
      }
    })

    // Compute active posyandu count in scope
    const activePosyandus = await prisma.posyandu.count({
      where: role === "OPERATOR_DESA" ? { desaId: user.desaId } : role === "ADMIN_KECAMATAN" ? { desa: { kecamatanId: user.kecamatanId } } : {}
    })

    const divider = bulan ? 1 : 12

    return NextResponse.json({
      sip6: {
        totalBalita: Math.round(totalBalitaSIP6 / divider) || 0,
        totalLansia: Math.round(totalLansiaSIP6 / divider) || 0,
        totalIbuHamil: Math.round(totalBumilSIP6 / divider) || 0,
      },
      sip7: {
        totalBalita: Math.round(totalBalitaSIP7 / divider) || 0,
        totalIbuHamil: Math.round(totalBumilSIP7 / divider) || 0,
        bumilDiperiksa: Math.round((sip7Agg._sum.bumilDiperiksa || 0) / divider) || 0,
        bumilFeTab: Math.round((sip7Agg._sum.bumilFeTab || 0) / divider) || 0,
        jmlBusui: Math.round((sip7Agg._sum.jmlBusui || 0) / divider) || 0,
        balitaS: Math.round(totalBalitaSIP7 / divider) || 0,
        balitaD: Math.round(((sip7Agg._sum.balitaD_L || 0) + (sip7Agg._sum.balitaD_P || 0)) / divider) || 0,
        balitaN: Math.round(((sip7Agg._sum.balitaN_L || 0) + (sip7Agg._sum.balitaN_P || 0)) / divider) || 0,
      },
      activePosyanduCount: activePosyandus,
      monthlyTrend: monthlyStats
    })
  } catch (error) {
    console.error("Error fetching health stats:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
