// Helper otorisasi berjenjang untuk export/import SIP:
// OPERATOR_POSYANDU/OPERATOR_DESA → desa sendiri, ADMIN_KECAMATAN → desa di
// kecamatannya, SUPERADMIN/VIEWER (kabupaten) → semua.
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import type { User } from '@prisma/client'

export async function resolveRequester(): Promise<User | null> {
  const session = await auth()
  if (!session?.user?.email) return null
  return prisma.user.findUnique({ where: { email: session.user.email } })
}

/** Menentukan desaId efektif yang boleh diakses requester. Return null bila ditolak. */
export async function resolveDesaScope(requester: User, requestedDesaId: string | null): Promise<string | null> {
  if (requester.role === 'OPERATOR_POSYANDU') {
    if (!requester.posyanduId) return null
    const pos = await prisma.posyandu.findUnique({ where: { id: requester.posyanduId } })
    return pos?.desaId ?? null
  }
  if (requester.role === 'OPERATOR_DESA') {
    return requester.desaId ?? null
  }
  if (requester.role === 'ADMIN_KECAMATAN') {
    if (!requestedDesaId || !requester.kecamatanId) return null
    const desa = await prisma.desa.findUnique({ where: { id: requestedDesaId } })
    if (!desa || desa.kecamatanId !== requester.kecamatanId) return null
    return desa.id
  }
  // SUPERADMIN / VIEWER — bebas, tapi desaId wajib disebut
  return requestedDesaId
}

/** Kecamatan yang boleh diexport requester (untuk export ZIP per kecamatan). */
export function resolveKecamatanScope(requester: User, requestedKecamatanId: string | null): string | null {
  if (requester.role === 'ADMIN_KECAMATAN') return requester.kecamatanId ?? null
  if (requester.role === 'SUPERADMIN' || requester.role === 'VIEWER') return requestedKecamatanId
  return null
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^\w\s\-().]/g, '').trim().replace(/\s+/g, ' ')
}
