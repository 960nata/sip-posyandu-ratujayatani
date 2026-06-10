const XLSX = require('xlsx');
const path = require('path');

const file = path.join(__dirname, 'EXCEL/REKAP DESA/KEC METRO KIBANG/SUMBER AGUNG.xlsx');
const workbook = XLSX.readFile(file);
const sheetName = 'KESEHATAN SIP 6';
const sheet = workbook.Sheets[sheetName];

if (!sheet) {
  console.log(`Sheet ${sheetName} not found!`);
  process.exit(1);
}

const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
console.log("Printing sheet rows:");
for (let i = 0; i < Math.min(rows.length, 40); i++) {
  console.log(`Row ${i}:`, rows[i] ? rows[i].slice(0, 15) : null);
}
