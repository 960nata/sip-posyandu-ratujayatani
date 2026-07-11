import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import * as fs from "fs/promises"
import * as path from "path"
import { BidangEnum } from "@prisma/client"

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

  // Check if running on Vercel and storage is local (Read-Only Filesystem)
  const storageType = process.env.STORAGE_TYPE || 'local'
  if (process.env.VERCEL && storageType === 'local') {
    return NextResponse.json({ 
      error: "Upload berkas belum didukung di Vercel karena sistem file bersifat Read-Only. Silakan gunakan lingkungan lokal (localhost) untuk mengetes fitur ini!" 
    }, { status: 500 })
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

    // Create unique filename
    const filename = `data-dukung-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`
    
    let fileUrl = ''

    if (storageType === 'supabase') {
      const supabaseUrl = process.env.SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_ANON_KEY
      const bucketName = process.env.SUPABASE_BUCKET || 'sip-posyandu'

      if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ 
          error: "Supabase URL dan Anon Key harus dikonfigurasi di .env untuk menggunakan penyimpanan Supabase" 
        }, { status: 500 })
      }

      // Determine bucket based on file type
      const fileType = file.type || ''
      const isImage = fileType.startsWith("image/") || [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".heic"].includes(ext.toLowerCase())
      const finalBucket = isImage ? "GAMBAR" : "FILE"

      // Convert Blob to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()

      // Upload to Supabase Storage via REST API
      const uploadUrl = `${supabaseUrl}/storage/v1/object/${finalBucket}/${filename}`
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': file.type || 'application/octet-stream'
        },
        body: arrayBuffer
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Supabase Storage upload error details:", errorText)
        return NextResponse.json({ error: `Gagal upload ke Supabase (${finalBucket}): ${errorText}` }, { status: response.status })
      }

      fileUrl = `${supabaseUrl}/storage/v1/object/public/${finalBucket}/${filename}`
    } else {
      // Convert Blob to Buffer
      const buffer = Buffer.from(await file.arrayBuffer())

      const publicDir = path.join(process.cwd(), 'public')
      const uploadDir = path.join(publicDir, 'uploads', 'data-dukung')

      // Ensure directory exists
      await fs.mkdir(uploadDir, { recursive: true })

      // Save file
      const filePath = path.join(uploadDir, filename)
      await fs.writeFile(filePath, buffer)

      fileUrl = `/uploads/data-dukung/${filename}`
    }

    const uploadedBy = session.user.name || session.user.email || "OPERATOR"

    // Create DataDukung record
    const dataDukung = await prisma.dataDukung.create({
      data: {
        bidang,
        kategori,
        fileName: originalName,
        filePath: fileUrl,
        fileSize: file.size,
        mimeType: file.type || 'application/pdf',
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

    const storageType = process.env.STORAGE_TYPE || 'local'

    if (storageType === 'supabase' && file.filePath.startsWith('http')) {
      const supabaseUrl = process.env.SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_ANON_KEY

      if (supabaseUrl && supabaseKey) {
        try {
          const urlObj = new URL(file.filePath)
          const pathParts = urlObj.pathname.split('/')
          const bucketName = pathParts[5]
          const fileName = pathParts.slice(6).join('/')

          const deleteUrl = `${supabaseUrl}/storage/v1/object/${bucketName}/${fileName}`
          
          await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`
            }
          })
        } catch (err) {
          console.error("Failed to delete object from Supabase Storage:", err)
        }
      }
    } else {
      try {
        const absolutePath = path.join(process.cwd(), 'public', file.filePath)
        await fs.unlink(absolutePath)
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
