// GET /api/export/kabupaten?tahun=2025
// ZIP seluruh kabupaten: folder per kecamatan, satu workbook resmi per desa.
// Hanya SUPERADMIN / VIEWER (level kabupaten).
import { NextResponse } from 'next/server'
import JSZip from 'jszip'
import { prisma } from '@/lib/prisma'
import { getDesaWorkbookData } from '@/lib/sip/data'
import { buildDesaWorkbookBuffer } from '@/lib/sip/workbook'
import { resolveRequester, sanitizeFilename } from '@/lib/sip/access'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(request: Request) {
  const requester = await resolveRequester()
  if (!requester) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (requester.role !== 'SUPERADMIN' && requester.role !== 'VIEWER') {
    return NextResponse.json({ error: 'Hanya level kabupaten yang dapat export seluruh wilayah' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const tahun = parseInt(searchParams.get('tahun') || '') || new Date().getFullYear()

  try {
    const kecamatans = await prisma.kecamatan.findMany({
      include: { desas: { orderBy: { nama: 'asc' } } },
      orderBy: { nama: 'asc' },
    })

    const zip = new JSZip()
    for (const kec of kecamatans) {
      const folder = zip.folder(sanitizeFilename(`KEC ${kec.nama.toUpperCase()}`))!
      for (const desa of kec.desas) {
        const data = await getDesaWorkbookData(desa.id, tahun)
        if (!data) continue
        const buffer = await buildDesaWorkbookBuffer(data)
        folder.file(sanitizeFilename(`${desa.nama.toUpperCase()}.xlsx`), buffer)
      }
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
    const filename = sanitizeFilename(`REKAP DESA LAMPUNG TIMUR SIP ${tahun}.zip`)

    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error exporting kabupaten zip:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
