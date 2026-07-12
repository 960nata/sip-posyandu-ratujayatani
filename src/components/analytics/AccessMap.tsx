'use client'

// Peta sebaran akses aplikasi berbasis IP asli pengunjung (Leaflet + OpenStreetMap).
// Titik dari /api/access/locations; ukuran lingkaran ∝ jumlah akses. Tanpa data dummy.
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { MapPin, Loader2 } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

interface AccessPoint {
  lat: number
  lng: number
  city: string
  region: string
  count: number
  uniqueIps: number
  lastAccess: string
}

interface Summary {
  totalAccess: number
  uniqueIps: number
  locatedPoints: number
  totalLocatedAccess: number
}

// Pusat peta: Kabupaten Lampung Timur
const CENTER: [number, number] = [-5.11, 105.68]

export default function AccessMap() {
  const [points, setPoints] = useState<AccessPoint[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/access/locations')
      .then(r => r.json())
      .then(d => {
        if (d && !d.error) {
          setPoints(d.points || [])
          setSummary(d.summary || null)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const maxCount = points.reduce((m, p) => Math.max(m, p.count), 1)
  const radius = (count: number) => 8 + Math.round((count / maxCount) * 22)

  return (
    <div className="dash-card">
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <MapPin className="w-5 h-5 text-purple-500" />
        <h2 className="text-base font-bold text-[var(--dash-text)]">Peta Sebaran Akses</h2>
        {summary && (
          <span className="ml-auto text-xs text-[var(--dash-text-muted)]">
            {summary.totalAccess.toLocaleString('id-ID')} akses · {summary.uniqueIps.toLocaleString('id-ID')} IP unik
          </span>
        )}
      </div>
      <p className="text-xs text-[var(--dash-text-muted)] mb-4">Lokasi pengguna dideteksi otomatis dari alamat IP saat mengakses aplikasi.</p>

      <div className="relative rounded-xl overflow-hidden border border-[var(--dash-border)]" style={{ height: 400 }}>
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--dash-text-muted)] gap-2 z-[500] bg-[var(--dash-surface)]">
            <Loader2 className="w-5 h-5 animate-spin" /> Memuat peta…
          </div>
        ) : points.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-[500] bg-[var(--dash-surface)]">
            <MapPin className="w-8 h-8 text-[var(--dash-text-muted)] mb-2" />
            <p className="text-sm font-medium text-[var(--dash-text)]">Belum ada titik akses berlokasi</p>
            <p className="text-xs text-[var(--dash-text-muted)] mt-1 max-w-sm">
              Titik akan muncul otomatis ketika pengguna membuka aplikasi dari jaringan publik. Akses dari jaringan lokal tidak memiliki koordinat.
            </p>
          </div>
        ) : null}

        <MapContainer center={CENTER} zoom={8} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {points.map((p, i) => (
            <CircleMarker
              key={i}
              center={[p.lat, p.lng]}
              radius={radius(p.count)}
              pathOptions={{ color: '#8b5cf6', fillColor: '#a855f7', fillOpacity: 0.45, weight: 1.5 }}
            >
              <Popup>
                <div className="text-xs">
                  <p className="font-bold text-slate-800">{p.city}{p.region ? `, ${p.region}` : ''}</p>
                  <p className="text-slate-600 mt-0.5">{p.count} akses · {p.uniqueIps} IP unik</p>
                  <p className="text-slate-400 mt-0.5">Terakhir: {new Date(p.lastAccess).toLocaleString('id-ID')}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
