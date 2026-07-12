const XLSX = require('xlsx');

const filePath = '/Users/indragandi/Developer/SIP SISTEM INFORMASI POSYANDU/web/EXCEL/REKAP DESA/KEC BANDAR SRIBHAWONO/BANDAR AGUNG.xlsx';

const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets['KESEHATAN SIP 6'];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

console.log('--- BANDAR AGUNG SIP 6 ---');
for (let i = 5; i <= 9; i++) {
  const row = rows[i];
  if (!row) continue;
  console.log(`Row ${i}:`);
  for (let c = 0; c < row.length; c++) {
    if (row[c] !== undefined && row[c] !== null && String(row[c]).trim() !== '') {
      console.log(`  Col ${c}: ${row[c]}`);
    }
  }
}
