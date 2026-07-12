// Helper penyimpanan berkas lintas-lingkungan.
// Prioritas: Supabase Storage (jalan di Vercel) bila kredensial ada — memakai
// SERVICE_ROLE key bila tersedia (tembus RLS), jika tidak pakai ANON key.
// Fallback ke filesystem lokal hanya di luar Vercel (dev).
import * as fs from 'fs/promises'
import * as path from 'path'

const IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.heic', '.bmp', '.svg']
const IMAGE_MIME = ['image/']
const DOC_EXT = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv']

export function isImageFile(mime: string, ext: string): boolean {
  const e = ext.toLowerCase()
  return IMAGE_MIME.some(m => mime.startsWith(m)) || IMAGE_EXT.includes(e)
}

export function isAllowedUpload(mime: string, ext: string): boolean {
  const e = ext.toLowerCase()
  return isImageFile(mime, ext) || DOC_EXT.includes(e) || mime === 'application/pdf'
}

export interface UploadResult {
  url?: string
  error?: string
  status?: number
}

interface UploadOpts {
  buffer: Buffer
  filename: string
  contentType: string
  ext: string
  // Subfolder untuk penyimpanan lokal (dev), mis. 'data-dukung' | 'avatars'
  localDir: string
}

function supabaseKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

function getSupabaseUrl(): string | undefined {
  return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
}

/** Apakah kita harus memakai Supabase (bukan filesystem lokal)? */
export function useSupabaseStorage(): boolean {
  if (process.env.STORAGE_TYPE?.toLowerCase() === 'supabase') return true
  // Di Vercel filesystem read-only → wajib Supabase bila kreds tersedia
  if (process.env.VERCEL && getSupabaseUrl() && supabaseKey()) return true
  return false
}

export async function uploadFile(opts: UploadOpts): Promise<UploadResult> {
  const { buffer, filename, contentType, ext, localDir } = opts

  if (useSupabaseStorage()) {
    const supabaseUrl = getSupabaseUrl()
    const key = supabaseKey()
    if (!supabaseUrl || !key) {
      return { error: 'Konfigurasi Supabase (SUPABASE_URL / KEY) belum lengkap di environment.', status: 500 }
    }
    // Gambar → bucket GAMBAR, dokumen → bucket FILE
    const bucket = isImageFile(contentType, ext) ? 'GAMBAR' : 'FILE'
    const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${filename}`
    try {
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': contentType || 'application/octet-stream',
          'x-upsert': 'true',
        },
        body: new Uint8Array(buffer),
      })
      if (!res.ok) {
        const detail = await res.text().catch(() => '')
        // Pesan ramah untuk kasus RLS (perlu service key / policy)
        if (res.status === 400 && detail.includes('row-level security')) {
          return {
            error: 'Upload ditolak kebijakan keamanan Supabase Storage. Set SUPABASE_SERVICE_ROLE_KEY di environment, atau buat RLS policy untuk bucket GAMBAR/FILE.',
            status: 403,
          }
        }
        if (detail.includes('Bucket not found')) {
          return { error: `Bucket "${bucket}" belum ada di Supabase Storage. Buat bucket bernama GAMBAR dan FILE.`, status: 400 }
        }
        return { error: `Gagal upload ke Supabase (${bucket}): ${detail}`, status: res.status }
      }
      return { url: `${supabaseUrl}/storage/v1/object/public/${bucket}/${filename}` }
    } catch (e) {
      return { error: `Gagal menghubungi Supabase Storage: ${(e as Error).message}`, status: 502 }
    }
  }

  // Fallback lokal (dev). Di Vercel ini tidak akan tereksekusi karena useSupabaseStorage()=true.
  if (process.env.VERCEL) {
    return {
      error: 'Upload di server ini butuh Supabase Storage. Set STORAGE_TYPE=supabase beserta SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY (atau ANON_KEY) di environment Vercel.',
      status: 500,
    }
  }
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', localDir)
    await fs.mkdir(uploadDir, { recursive: true })
    await fs.writeFile(path.join(uploadDir, filename), buffer)
    return { url: `/uploads/${localDir}/${filename}` }
  } catch (e) {
    return { error: `Gagal menyimpan berkas lokal: ${(e as Error).message}`, status: 500 }
  }
}
