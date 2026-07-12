/**
 * CLEAN: Hapus semua SIP6, SIP7, Laporan yang di-seed sebelumnya
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

async function main() {
  console.log('Menghapus semua data SIP6 (2025 & 2026)...');
  const d6 = await prisma.sip6Bulanan.deleteMany({ where: { tahun: { in: [2025, 2026] } } });
  console.log(`  Deleted SIP6: ${d6.count} records`);

  console.log('Menghapus semua data SIP7 (2025 & 2026)...');
  const d7 = await prisma.sip7Bulanan.deleteMany({ where: { tahun: { in: [2025, 2026] } } });
  console.log(`  Deleted SIP7: ${d7.count} records`);

  console.log('Menghapus Laporan Pengaduan yang di-seed...');
  const dlp = await prisma.laporanPengaduan.deleteMany({ where: { createdBy: 'SEEDER' } });
  console.log(`  Deleted LaporanPengaduan: ${dlp.count} records`);

  console.log('Menghapus Laporan PR yang di-seed...');
  const dlpr = await prisma.laporanPR.deleteMany({ where: { keteranganPermohonan: { contains: 'SEEDER' } } });
  console.log(`  Deleted LaporanPR: ${dlpr.count} records`);

  // Final count
  const remSip6 = await prisma.sip6Bulanan.count();
  const remSip7 = await prisma.sip7Bulanan.count();
  const remLP = await prisma.laporanPengaduan.count();
  console.log(`\nSisa di DB: SIP6=${remSip6}, SIP7=${remSip7}, Laporan=${remLP}`);
  console.log('CLEAN DONE!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
