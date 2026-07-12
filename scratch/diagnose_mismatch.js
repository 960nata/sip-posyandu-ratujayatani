/**
 * DIAGNOSTIC: Membandingkan data SIP 6 di database vs data di Excel
 * untuk satu desa sample (TULUS REJO, KEC PEKALONGAN)
 */
const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');

const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

async function main() {
  const filePath = '/Users/indragandi/Developer/SIP SISTEM INFORMASI POSYANDU/web/EXCEL/REKAP DESA/KEC PEKALONGAN/TULUS REJO.xlsx';
  const workbook = XLSX.readFile(filePath);

  console.log('=== DATA DARI EXCEL TULUS REJO (SIP 6) ===');
  const sip6 = workbook.Sheets['KESEHATAN SIP 6'];
  const rows = XLSX.utils.sheet_to_json(sip6, { header: 1 });
  
  // Find number row
  let numRowIndex = -1;
  for (let r = 5; r <= 15; r++) {
    if (rows[r] && String(rows[r][0]).trim() === '1' && String(rows[r][1]).trim() === '2') {
      numRowIndex = r;
      break;
    }
  }

  let colMap = {};
  for (let c = 0; c < rows[numRowIndex].length; c++) {
    const val = parseInt(rows[numRowIndex][c]);
    if (!isNaN(val) && val > 0) colMap[val] = c;
  }

  const monthsMap = {
    'JANUARI': 1, 'FEBRUARI': 2, 'MARET': 3, 'APRIL': 4, 'MEI': 5, 'JUNI': 6,
    'JULI': 7, 'AGUSTUS': 8, 'SEPTEMBER': 9, 'OKTOBER': 10, 'NOVEMBER': 11, 'DESEMBER': 12
  };

  for (let i = numRowIndex + 1; i <= numRowIndex + 12; i++) {
    const row = rows[i];
    if (!row || !row[colMap[2]]) continue;
    const monthName = String(row[colMap[2]]).trim().toUpperCase();
    const bulan = monthsMap[monthName];
    if (!bulan) continue;
    const bayiBaruL = parseInt(row[colMap[3]]) || 0;
    const bayiLamaL = parseInt(row[colMap[5]]) || 0;
    const balitaLamaL = parseInt(row[colMap[9]]) || 0;
    const pus = parseInt(row[colMap[24]]) || 0;
    const ibuHamil = parseInt(row[colMap[25]]) || 0;
    const total = Object.keys(colMap).slice(2).reduce((s, k) => s + (parseInt(row[colMap[k]]) || 0), 0);
    console.log(`Bulan ${bulan}: bayiBaruL=${bayiBaruL}, bayiLamaL=${bayiLamaL}, balitaLamaL=${balitaLamaL}, pus=${pus}, ibuHamil=${ibuHamil}, totalRow=${total}`);
  }

  console.log('\n=== CARI DESA TULUS REJO DI DATABASE ===');
  const desa = await prisma.desa.findFirst({
    where: { nama: { contains: 'TULUS REJO', mode: 'insensitive' } },
    include: { posyandus: true, kecamatan: true }
  });
  
  if (!desa) {
    console.log('Desa TULUS REJO tidak ditemukan di database!');
    return;
  }
  console.log(`Desa: ${desa.nama} (${desa.kecamatan.nama}), ID: ${desa.id}`);
  console.log(`Jumlah posyandu: ${desa.posyandus.length}`);
  for (const p of desa.posyandus) {
    console.log(`  - Posyandu: ${p.nama} (${p.id})`);
  }

  console.log('\n=== DATA SIP 6 DI DATABASE UNTUK POSYANDU-POSYANDU TULUS REJO ===');
  for (const p of desa.posyandus) {
    const sip6Data = await prisma.sip6Bulanan.findMany({
      where: { posyanduId: p.id, tahun: 2026 },
      orderBy: { bulan: 'asc' }
    });
    if (sip6Data.length > 0) {
      console.log(`\nPosyandu: ${p.nama}`);
      for (const s of sip6Data) {
        console.log(`  Bulan ${s.bulan}: bayiBaruL=${s.bayiBaruL}, bayiLamaL=${s.bayiLamaL}, balitaLamaL=${s.balitaLamaL}, pus=${s.pus}, ibuHamil=${s.ibuHamil}`);
      }
    }
  }

  console.log('\n=== CEK DUPLIKAT: Berapa baris total SIP6 di TULUS REJO? ===');
  const ids = desa.posyandus.map(p => p.id);
  const total = await prisma.sip6Bulanan.count({ where: { posyanduId: { in: ids }, tahun: 2026 } });
  console.log(`Total SIP 6 Bulan 2026 di Tulus Rejo: ${total} baris (seharusnya max 12 per posyandu)`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
