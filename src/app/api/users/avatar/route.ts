import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import * as path from "path"
import { uploadFile, isImageFile } from "@/lib/storage"

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const email = session.user.email
  if (!email) {
    return NextResponse.json({ error: "Email not found in session" }, { status: 400 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as Blob | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const originalName = (file as any).name || 'avatar.png'
    const ext = path.extname(originalName) || '.png'
    const contentType = file.type || 'image/png'

    if (!isImageFile(contentType, ext)) {
      return NextResponse.json({ error: "Foto profil harus berupa gambar (JPG/PNG/WEBP)." }, { status: 400 })
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran gambar maksimal 10 MB." }, { status: 400 })
    }

    const filename = `avatar-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const result = await uploadFile({ buffer, filename, contentType, ext, localDir: 'avatars' })
    if (result.error || !result.url) {
      return NextResponse.json({ error: result.error || 'Gagal mengunggah avatar' }, { status: result.status || 500 })
    }

    await prisma.user.update({
      where: { email: email },
      data: { image: result.url }
    })

    return NextResponse.json({ success: true, avatarUrl: result.url })
  } catch (error: any) {
    console.error("Failed to upload avatar:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
