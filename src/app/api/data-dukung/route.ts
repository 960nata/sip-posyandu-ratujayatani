import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import * as fs from "fs/promises"
import * as path from "path"
import { BidangEnum } from "@prisma/client"

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

      if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ 
          error: "Supabase URL dan Anon Key harus dikonfigurasi di .env untuk menggunakan penyimpanan Supabase" 
        }, { status: 500 })
      }

      // Determine bucket based on file type
      const isImage = file.type.startsWith("image/") || [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"].includes(ext.toLowerCase())
      const bucketName = isImage ? "GAMBAR" : "FILE"

      // Convert Blob to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()

      // Upload to Supabase Storage via REST API
      const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucketName}/${filename}`
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
        return NextResponse.json({ error: `Gagal upload ke Supabase (${bucketName}): ${errorText}` }, { status: response.status })
      }

      fileUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filename}`
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
