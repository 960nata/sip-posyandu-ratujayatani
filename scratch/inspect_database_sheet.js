const XLSX = require('xlsx');
const filePath = '/Users/indragandi/Developer/SIP SISTEM INFORMASI POSYANDU/web/EXCEL/REKAP DESA/KEC PEKALONGAN/TULUS REJO.xlsx';

const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets['DATABASE'];
if (!sheet) {
  console.log('DATABASE sheet not found.');
  process.exit(0);
}

const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
rows.forEach((row, i) => {
  if (row.length > 0) {
    console.log(`Row ${i}:`, JSON.stringify(row));
  }
});
