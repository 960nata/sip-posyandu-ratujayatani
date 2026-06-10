const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Checking DB Kecamatan and Desa names...");
  const kecamatans = await prisma.kecamatan.findMany({
    include: {
      desas: true
    }
  });
  
  for (const k of kecamatans) {
    console.log(`Kec: "${k.nama}" (Normalized: "${k.nama.toLowerCase().replace(/[^a-z0-9]/g, '')}")`);
    for (const d of k.desas) {
      console.log(`  Desa: "${d.nama}" (Normalized: "${d.nama.toLowerCase().replace(/[^a-z0-9]/g, '')}")`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
