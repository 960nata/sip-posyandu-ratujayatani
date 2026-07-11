// GET /api/export/desa?desaId=...&tahun=2025
// Menghasilkan workbook .xlsx 8 sheet persis format resmi REKAP DESA.
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDesaWorkbookData } from '@/lib/sip/data'
import { buildDesaWorkbookBuffer } from '@/lib/sip/workbook'
import { resolveRequester, resolveDesaScope, sanitizeFilename } from '@/lib/sip/access'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requester = await resolveRequester()
  if (!requester) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const tahun = parseInt(searchParams.get('tahun') || '') || new Date().getFullYear()
  const requestedDesaId = searchParams.get('desaId')

  const desaId = await resolveDesaScope(requester, requestedDesaId)
  if (!desaId) {
    return NextResponse.json({ error: 'Desa tidak ditentukan atau di luar wilayah Anda' }, { status: 403 })
  }

  try {
    const data = await getDesaWorkbookData(desaId, tahun)
    if (!data) {
      return NextResponse.json({ error: 'Desa tidak ditemukan' }, { status: 404 })
    }

    const desa = await prisma.desa.findUnique({ where: { id: desaId }, include: { kecamatan: true } })
    const buffer = await buildDesaWorkbookBuffer(data)
    const filename = sanitizeFilename(`${data.desaNama} SIP ${tahun}.xlsx`)

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Kecamatan': encodeURIComponent(desa?.kecamatan?.nama || ''),
      },
    })
  } catch (error) {
    console.error('Error exporting desa workbook:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
