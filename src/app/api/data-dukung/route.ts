import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import * as path from "path"
import { BidangEnum } from "@prisma/client"
import { uploadFile, isAllowedUpload, isImageFile } from "@/lib/storage"
import { compressToAvif, canConvertToAvif } from "@/lib/image"

export async function GET(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const role = (session.user as any).role
  if (role !== 'SUPERADMIN') {
    return NextResponse.json({ error: "Forbidden - Hanya Superadmin yang dapat mengakses galeri media" }, { status: 403 })
  }

  try {
    const dataDukungs = await prisma.dataDukung.findMany({
      orderBy: {
        uploadedAt: 'desc'
      },
      include: {
        posyandu: {
          select: {
            nama: true,
            desa: {
              select: {
                nama: true,
                kecamatan: {
                  select: {
                    nama: true
                  }
                }
              }
            }
          }
        },
        laporan: {
          select: {
            nama: true,
            nik: true,
            halPengaduan: true,
            bidang: true
          }
        },
        laporanPR: {
          select: {
            nama: true,
            nik: true,
            keteranganPermohonan: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, data: dataDukungs })
  } catch (error: any) {
    console.error("Failed to fetch data dukung:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as Blob | null
    const bidangStr = formData.get('bidang') as string | null
    const posyanduId = formData.get('posyanduId') as string | null
    const kategori = (formData.get('kategori') as string | null) || 'Data Dukung'

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 })
    }

    if (!bidangStr) {
      return NextResponse.json({ error: "Bidang harus ditentukan" }, { status: 400 })
    }

    // Validate BidangEnum
    if (!Object.values(BidangEnum).includes(bidangStr as any)) {
      return NextResponse.json({ error: "Bidang tidak valid" }, { status: 400 })
    }

    const bidang = bidangStr as BidangEnum

    // Get file extension from original name
    const originalName = (file as any).name || 'document.pdf'
    const ext = path.extname(originalName) || '.pdf'
    const contentType = file.type || 'application/octet-stream'

    // Terima gambar (JPG/PNG/…) & dokumen (PDF/DOC/XLS/…)
    if (!isAllowedUpload(contentType, ext)) {
      return NextResponse.json({ error: "Jenis berkas tidak didukung. Unggah gambar atau PDF/dokumen." }, { status: 400 })
    }
    // Batas ukuran 15 MB
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran berkas maksimal 15 MB." }, { status: 400 })
    }

    let buffer: Buffer = Buffer.from(await file.arrayBuffer())
    let finalExt = ext
    let finalType = contentType

    // Foto data dukung dikompres ke AVIF (max 1600px); PDF/dokumen tetap asli
    if (isImageFile(contentType, ext) && canConvertToAvif(contentType, ext)) {
      const avif = await compressToAvif(buffer, 1600, 55)
      if (avif) {
        buffer = avif.buffer
        finalExt = avif.ext
        finalType = avif.contentType
      }
    }

    // Create unique filename
    const filename = `data-dukung-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${finalExt}`

    const result = await uploadFile({ buffer, filename, contentType: finalType, ext: finalExt, localDir: 'data-dukung' })
    if (result.error || !result.url) {
      return NextResponse.json({ error: result.error || 'Gagal mengunggah berkas' }, { status: result.status || 500 })
    }
    const fileUrl = result.url

    const uploadedBy = session.user.name || session.user.email || "OPERATOR"

    // Create DataDukung record
    const dataDukung = await prisma.dataDukung.create({
      data: {
        bidang,
        kategori,
        fileName: originalName,
        filePath: fileUrl,
        fileSize: buffer.length,
        mimeType: finalType,
        posyanduId: posyanduId || null,
        uploadedBy,
      }
    })

    return NextResponse.json({ success: true, dataDukung })
  } catch (error: any) {
    console.error("Failed to upload data dukung:", error)
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const role = (session.user as any).role
  if (role !== 'SUPERADMIN') {
    return NextResponse.json({ error: "Forbidden - Hanya Superadmin yang dapat menghapus data" }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: "ID tidak disertakan" }, { status: 400 })
    }

    // Find the file to get the path
    const file = await prisma.dataDukung.findUnique({
      where: { id }
    })

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 404 })
    }

    // Hapus objek: berbasis URL berkas (Supabase bila http, lokal bila /uploads).
    if (file.filePath.startsWith('http')) {
      const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (supabaseUrl && supabaseKey) {
        try {
          const urlObj = new URL(file.filePath)
          const pathParts = urlObj.pathname.split('/')
          const bucketName = pathParts[5]
          const fileName = pathParts.slice(6).join('/')
          await fetch(`${supabaseUrl}/storage/v1/object/${bucketName}/${fileName}`, {
            method: 'DELETE',
            headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
          })
        } catch (err) {
          console.error("Failed to delete object from Supabase Storage:", err)
        }
      }
    } else if (!process.env.VERCEL) {
      try {
        const fs = await import('fs/promises')
        await fs.unlink(path.join(process.cwd(), 'public', file.filePath))
      } catch (err) {
        console.error("Failed to delete local file:", err)
      }
    }

    // Delete database record
    await prisma.dataDukung.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Failed to delete data dukung:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
