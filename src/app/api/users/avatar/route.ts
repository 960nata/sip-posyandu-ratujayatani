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

  // Check if running on Vercel (Read-Only Filesystem)
  if (process.env.VERCEL) {
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

    // Convert Blob to Buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Create a unique filename
    const filename = `avatar-${Date.now()}.avif`
    const publicDir = path.join(process.cwd(), 'public')
    const uploadDir = path.join(publicDir, 'uploads', 'avatars')

    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true })

    // Save file
    const filePath = path.join(uploadDir, filename)
    await fs.writeFile(filePath, buffer)

    // Update user in database
    const avatarUrl = `/uploads/avatars/${filename}`
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
