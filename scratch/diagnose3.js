/**
 * Cek data SIP6 Tulusrejo vs Excel - deep comparison
 */
const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');

const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

async function main() {
  // === CEK DB ===
  const desaId = 'seedmq6q93zo00m3'; // Tulusrejo
  const sip6InDB = await prisma.sip6Bulanan.findMany({
    where: { 
      posyanduId: { in: [
        'posyandu-18.07.04.11-1',
        'posyandu-18.07.04.11-mq7zejpv-802',
        'posyandu-18.07.04.11-mq7zej86-462',
        'posyandu-18.07.04.11-mq7zel81-587',
        'posyandu-18.07.04.11-mq7zekqn-834',
      ]},
      tahun: 2026 
    },
    orderBy: [{ posyanduId: 'asc' }, { bulan: 'asc' }]
  });

  console.log('=== DATA SIP6 TULUSREJO DI DATABASE (tahun 2026) ===');
  console.log(`Total baris: ${sip6InDB.length}`);
  for (const s of sip6InDB) {
    console.log(`posyanduId=${s.posyanduId} bulan=${s.bulan} bayiBaruL=${s.bayiBaruL} bayiLamaL=${s.bayiLamaL} pus=${s.pus} ibuHamil=${s.ibuHamil}`);
  }

  // === CEK EXCEL ===
  const filePath = '/Users/indragandi/Developer/SIP SISTEM INFORMASI POSYANDU/web/EXCEL/REKAP DESA/KEC PEKALONGAN/TULUS REJO.xlsx';
  const workbook = XLSX.readFile(filePath);
  const sip6 = workbook.Sheets['KESEHATAN SIP 6'];
  const rows = XLSX.utils.sheet_to_json(sip6, { header: 1 });
  
  console.log('\n=== DATA SIP6 DI EXCEL TULUS REJO (semua baris raw) ===');
  for (let i = 5; i <= 22; i++) {
    const row = rows[i];
    if (!row) continue;
    console.log(`Row[${i}]: ${JSON.stringify(row.slice(0, 10))}`);
  }

  // The key question: does the Excel SIP6 have per-posyandu data or aggregated?
  // Check what's in col 0 and col 1
  console.log('\n=== SHEET NAMES DI EXCEL TULUS REJO ===');
  console.log(workbook.SheetNames);

  // Also check DATABASE sheet structure
  const dbSheet = workbook.Sheets['DATABASE'];
  if (dbSheet) {
    const dbRows = XLSX.utils.sheet_to_json(dbSheet, { header: 1 });
    console.log('\n=== DATABASE SHEET (rows 0-10) ===');
    for (let i = 0; i <= 10; i++) {
      if (dbRows[i] && dbRows[i].some(c => c)) {
        console.log(`Row[${i}]: ${JSON.stringify(dbRows[i].slice(0, 10))}`);
      }
    }
    console.log('...');
    // Show first 5 data rows
    for (let i = 5; i <= 12; i++) {
      if (dbRows[i]) {
        console.log(`Row[${i}]: ${JSON.stringify(dbRows[i].slice(0, 12))}`);
      }
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
