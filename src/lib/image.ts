// Kompresi gambar server-side ke AVIF memakai sharp.
// Dipakai route upload (avatar & data dukung) agar semua foto hemat ukuran.
import sharp from 'sharp'

export interface AvifResult {
  buffer: Buffer
  contentType: 'image/avif'
  ext: '.avif'
}

// Format yang tidak dikonversi: svg (vektor) & gif (bisa animasi)
const SKIP_EXT = ['.svg', '.gif']

export function canConvertToAvif(mime: string, ext: string): boolean {
  const e = ext.toLowerCase()
  if (SKIP_EXT.includes(e)) return false
  if (mime === 'image/svg+xml' || mime === 'image/gif') return false
  return mime.startsWith('image/') || ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.heic', '.bmp'].includes(e)
}

/**
 * Konversi buffer gambar ke AVIF. maxDim membatasi sisi terpanjang
 * (avatar 512px, data dukung 1600px). Return null bila gagal decode —
 * pemanggil lalu memakai berkas asli apa adanya.
 */
export async function compressToAvif(input: Buffer, maxDim: number, quality = 55): Promise<AvifResult | null> {
  try {
    const buffer = await sharp(input, { failOn: 'none' })
      .rotate() // hormati orientasi EXIF
      .resize({ width: maxDim, height: maxDim, fit: 'inside', withoutEnlargement: true })
      .avif({ quality, effort: 4 })
      .toBuffer()
    return { buffer, contentType: 'image/avif', ext: '.avif' }
  } catch (err) {
    console.error('AVIF conversion failed, using original file:', err)
    return null
  }
}
