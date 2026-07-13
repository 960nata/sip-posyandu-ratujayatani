'use client'

import { useEffect, useState } from 'react'
import { PlayCircle, Loader2, BookOpen } from 'lucide-react'
import { getYoutubeEmbedUrl } from '@/lib/youtube'

interface Tutorial {
  id: string
  judul: string
  deskripsi: string | null
  youtubeUrl: string
  target: string
}

export default function PanduanPage() {
  const [items, setItems] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/tutorial')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setItems(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--dash-text)] flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-purple-600" />
          Panduan Pengguna
        </h1>
        <p className="text-[var(--dash-text-soft)] text-sm mt-1">
          Video tutorial penggunaan aplikasi SIPANDU sesuai peran Anda.
        </p>
      </div>

      {loading ? (
        <div className="p-16 flex justify-center text-[var(--dash-text-muted)]">
          <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
        </div>
      ) : items.length === 0 ? (
        <div className="dash-card text-center py-16">
          <PlayCircle className="w-10 h-10 mx-auto text-slate-300 dark:text-zinc-600" />
          <p className="mt-3 text-sm text-[var(--dash-text-muted)]">Belum ada panduan video untuk peran Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map(t => {
            const embed = getYoutubeEmbedUrl(t.youtubeUrl)
            return (
              <div key={t.id} className="dash-card p-0 overflow-hidden flex flex-col">
                <div className="relative w-full aspect-video bg-slate-100 dark:bg-black/40">
                  {embed ? (
                    <iframe
                      src={embed}
                      title={t.judul}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-[var(--dash-text-muted)]">
                      URL video tidak valid
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[var(--dash-text)] leading-snug">{t.judul}</h3>
                  {t.deskripsi && (
                    <p className="text-sm text-[var(--dash-text-soft)] mt-1 whitespace-pre-line">{t.deskripsi}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
