import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import * as bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) return null

        let kecamatanNama = null
        if (user.kecamatanId) {
          const kec = await prisma.kecamatan.findUnique({
            where: { id: user.kecamatanId }
          })
          kecamatanNama = kec?.nama
        } else if (user.posyanduId) {
          const posyandu = await prisma.posyandu.findUnique({
            where: { id: user.posyanduId },
            include: {
              desa: {
                include: {
                  kecamatan: true
                }
              }
            }
          })
          kecamatanNama = posyandu?.desa?.kecamatan?.nama
        }

        return {
          id: user.id,
          name: user.nama,
          email: user.email,
          image: user.image,
          role: user.role,
          kecamatanId: user.kecamatanId,
          kecamatanNama: kecamatanNama,
          desaId: user.desaId,
          posyanduId: user.posyanduId,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
        token.role = (user as any).role
        token.picture = (user as any).image
        token.kecamatanId = (user as any).kecamatanId
        token.kecamatanNama = (user as any).kecamatanNama
        token.desaId = (user as any).desaId
        token.posyanduId = (user as any).posyanduId
      }
      // Selalu ambil foto terbaru dari database agar update avatar langsung terlihat
      if (token.email) {
        try {
          const freshUser = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: { image: true }
          })
          if (freshUser) {
            token.picture = freshUser.image
          }
        } catch (_) {
          // Jangan crash kalau DB error, pakai data lama
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          image: (token as any).picture,
          role: (token as any).role,
          kecamatanId: (token as any).kecamatanId,
          kecamatanNama: (token as any).kecamatanNama,
          desaId: (token as any).desaId,
          posyanduId: (token as any).posyanduId,
        }
      }
    }
  },
  pages: {
    signIn: "/login",
  }
})
