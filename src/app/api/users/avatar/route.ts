import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import * as fs from "fs/promises"
import * as path from "path"

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const email = session.user.email
  if (!email) {
    return NextResponse.json({ error: "Email not found in session" }, { status: 400 })
  }

  // Check if running on Vercel and storage is local (Read-Only Filesystem)
  const storageType = process.env.STORAGE_TYPE || 'local'
  if (process.env.VERCEL && storageType === 'local') {
    return NextResponse.json({ 
      error: "Upload foto profil belum didukung di Vercel karena sistem file bersifat Read-Only. Silakan gunakan lingkungan lokal (localhost) untuk mengetes fitur ini!" 
    }, { status: 500 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as Blob | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Create a unique filename
    const filename = `avatar-${Date.now()}.avif`
    
    let avatarUrl = ''

    if (storageType === 'supabase') {
      const supabaseUrl = process.env.SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_ANON_KEY
      const bucketName = 'GAMBAR'

      if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ 
          error: "Supabase URL dan Anon Key harus dikonfigurasi di .env untuk menggunakan penyimpanan Supabase" 
        }, { status: 500 })
      }

      // Convert Blob to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()

      // Upload to Supabase Storage via REST API
      const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucketName}/${filename}`
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': file.type || 'image/avif'
        },
        body: arrayBuffer
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Supabase Storage avatar upload error details:", errorText)
        return NextResponse.json({ error: `Gagal upload avatar ke Supabase: ${errorText}` }, { status: response.status })
      }

      avatarUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filename}`
    } else {
      // Convert Blob to Buffer
      const buffer = Buffer.from(await file.arrayBuffer())

      const publicDir = path.join(process.cwd(), 'public')
      const uploadDir = path.join(publicDir, 'uploads', 'avatars')

      // Ensure directory exists
      await fs.mkdir(uploadDir, { recursive: true })

      // Save file
      const filePath = path.join(uploadDir, filename)
      await fs.writeFile(filePath, buffer)

      avatarUrl = `/uploads/avatars/${filename}`
    }

    // Update user in database
    await prisma.user.update({
      where: { email: email },
      data: { image: avatarUrl }
    })

    return NextResponse.json({ success: true, avatarUrl })
  } catch (error: any) {
    console.error("Failed to upload avatar:", error)
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 })
  }
}
