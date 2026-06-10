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

  // Check if running on Vercel (Read-Only Filesystem)
  if (process.env.VERCEL) {
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

    // Convert Blob to Buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Get file extension from original name
    const originalName = (file as any).name || 'document.pdf'
    const ext = path.extname(originalName) || '.pdf'

    // Create unique filename
    const filename = `data-dukung-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`
    const publicDir = path.join(process.cwd(), 'public')
    const uploadDir = path.join(publicDir, 'uploads', 'data-dukung')

    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true })

    // Save file
    const filePath = path.join(uploadDir, filename)
    await fs.writeFile(filePath, buffer)

    // DB File Path URL
    const fileUrl = `/uploads/data-dukung/${filename}`
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
