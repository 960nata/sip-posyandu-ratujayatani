const XLSX = require('xlsx');
const filePath = '/Users/indragandi/Developer/SIP SISTEM INFORMASI POSYANDU/web/EXCEL/REKAP DESA/KEC METRO KIBANG/SUMBER AGUNG.xlsx';

const wb = XLSX.readFile(filePath);
const sheet = wb.Sheets['KESEHATAN SIP 6'];
if (sheet) {
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  console.log('=== KEC METRO KIBANG/SUMBER AGUNG.xlsx - KESEHATAN SIP 6 ===');
  for (let r = 0; r < Math.min(20, rows.length); r++) {
    console.log(`Row ${r}:`, rows[r] ? rows[r].slice(0, 15) : null);
  }
} else {
  console.log('Sheet KESEHATAN SIP 6 not found.');
}
