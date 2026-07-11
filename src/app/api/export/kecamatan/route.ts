// GET /api/export/kecamatan?kecamatanId=...&tahun=2025
// ZIP berisi satu workbook resmi per desa dalam kecamatan tersebut.
import { NextResponse } from 'next/server'
import JSZip from 'jszip'
import { prisma } from '@/lib/prisma'
import { getDesaWorkbookData } from '@/lib/sip/data'
import { buildDesaWorkbookBuffer } from '@/lib/sip/workbook'
import { resolveRequester, resolveKecamatanScope, sanitizeFilename } from '@/lib/sip/access'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(request: Request) {
  const requester = await resolveRequester()
  if (!requester) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const tahun = parseInt(searchParams.get('tahun') || '') || new Date().getFullYear()
  const kecamatanId = resolveKecamatanScope(requester, searchParams.get('kecamatanId'))
  if (!kecamatanId) {
    return NextResponse.json({ error: 'Kecamatan tidak ditentukan atau di luar wilayah Anda' }, { status: 403 })
  }

  try {
    const kecamatan = await prisma.kecamatan.findUnique({
      where: { id: kecamatanId },
      include: { desas: { orderBy: { nama: 'asc' } } },
    })
    if (!kecamatan) {
      return NextResponse.json({ error: 'Kecamatan tidak ditemukan' }, { status: 404 })
    }

    const zip = new JSZip()
    for (const desa of kecamatan.desas) {
      const data = await getDesaWorkbookData(desa.id, tahun)
      if (!data) continue
      const buffer = await buildDesaWorkbookBuffer(data)
      zip.file(sanitizeFilename(`${desa.nama.toUpperCase()}.xlsx`), buffer)
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
    const filename = sanitizeFilename(`KEC ${kecamatan.nama.toUpperCase()} SIP ${tahun}.zip`)

    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error exporting kecamatan zip:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
