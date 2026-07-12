import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const data = await prisma.kecamatan.findMany({
      include: {
        desas: {
          include: {
            posyandus: {
              include: {
                _count: {
                  select: { sip6s: true, sip7s: true }
                }
              }
            }
          }
        }
      }
    })
    console.log(`Found ${data.length} kecamatans`)
  } catch (e) {
    console.error("Prisma error:", e.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
