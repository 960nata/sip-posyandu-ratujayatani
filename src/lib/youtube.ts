// Utilitas URL YouTube: ambil ID video dari berbagai format URL,
// lalu bentuk URL embed & thumbnail.
export function getYoutubeId(url: string | null | undefined): string | null {
  if (!url) return null
  const str = String(url).trim()
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([\w-]{11})/,
    /[?&]v=([\w-]{11})/,
    /^([\w-]{11})$/,
  ]
  for (const p of patterns) {
    const m = str.match(p)
    if (m) return m[1]
  }
  return null
}

export function getYoutubeEmbedUrl(url: string | null | undefined): string | null {
  const id = getYoutubeId(url)
  return id ? `https://www.youtube.com/embed/${id}` : null
}

export function getYoutubeThumb(url: string | null | undefined): string | null {
  const id = getYoutubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}
