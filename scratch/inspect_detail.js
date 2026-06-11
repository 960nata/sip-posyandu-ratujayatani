const XLSX = require('xlsx');

const filePath = process.argv[2] || '/Users/indragandi/Developer/SIP SISTEM INFORMASI POSYANDU/web/EXCEL/REKAP DESA/KEC PEKALONGAN/TULUS REJO.xlsx';

console.log('Inspecting:', filePath);
const workbook = XLSX.readFile(filePath);

function inspectSheet(sheetName, startRow, endRow) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    console.log(`Sheet ${sheetName} not found.`);
    return;
  }
  
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  console.log(`\n--- ${sheetName} ---`);
  
  for (let i = startRow; i <= endRow; i++) {
    const row = rows[i];
    if (!row) continue;
    console.log(`Row ${i}:`);
    for (let c = 0; c < row.length; c++) {
      if (row[c] !== undefined && row[c] !== null && String(row[c]).trim() !== '') {
        console.log(`  Col ${c}: ${row[c]}`);
      }
    }
  }
}

inspectSheet('KESEHATAN SIP 6', 5, 12);
inspectSheet('KESEHATAN SIP 7', 5, 12);
inspectSheet('PENDIDIKAN', 4, 12);
inspectSheet('PU', 4, 12);
inspectSheet('PR', 4, 12);
inspectSheet('TRANTIB LINMAS', 4, 12);
inspectSheet('SOSIAL', 4, 12);
