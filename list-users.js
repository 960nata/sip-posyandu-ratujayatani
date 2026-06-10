const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Fetching all users from database...')
  const users = await prisma.user.findMany({
    orderBy: [
      { role: 'asc' },
      { email: 'asc' }
    ],
    include: {
      desa: {
        select: { nama: true }
      },
      posyandu: {
        select: { nama: true }
      }
    }
  })

  console.log('\n=== DAFTAR SEMUA AKUN ===')
  users.forEach((u, i) => {
    const regional = u.desa ? `Desa: ${u.desa.nama}` : u.posyandu ? `Posyandu: ${u.posyandu.nama}` : 'Global'
    console.log(`${i + 1}. Nama: ${u.nama} | Email: ${u.email} | Role: ${u.role} | Wilayah/Kait: ${regional} | Active: ${u.isActive}`)
  })
  console.log('=========================\n')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
