const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

async function main() {
  // Find the village
  const desas = await prisma.desa.findMany({ 
    where: { nama: { contains: 'tulus', mode: 'insensitive' }}, 
    include: { kecamatan: true, posyandus: { select: { id: true, nama: true } } } 
  });
  console.log('Desas found:', JSON.stringify(desas, null, 2));

  // Also check total SIP6 records and count per posyandu for January 2026
  const totalSip6 = await prisma.sip6Bulanan.count({ where: { tahun: 2026, bulan: 1 } });
  console.log(`\nTotal SIP6 records for bulan=1, tahun=2026: ${totalSip6}`);
  
  // Check how many unique posyanduIds are in sip6 for 2026
  const uniquePosyandus = await prisma.sip6Bulanan.findMany({ 
    where: { tahun: 2026, bulan: 1 },
    select: { posyanduId: true, bayiBaruL: true, bayiLamaL: true, pus: true },
    take: 20
  });
  console.log('\nSample SIP6 Jan 2026 (first 20):', JSON.stringify(uniquePosyandus, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
