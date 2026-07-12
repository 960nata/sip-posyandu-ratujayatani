import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const users = await prisma.user.findMany({ where: { role: 'SUPERADMIN' } })
  console.log("Superadmins:", users.map(u => u.email))
}
main()
