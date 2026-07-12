const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Mulai menghapus semua akun pengguna dengan role OPERATOR_POSYANDU...");
  const deleteResult = await prisma.user.deleteMany({
    where: {
      role: 'OPERATOR_POSYANDU'
    }
  });
  console.log(`Berhasil menghapus ${deleteResult.count} akun OPERATOR_POSYANDU.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
