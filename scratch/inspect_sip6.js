const XLSX = require('xlsx');

const filePath = '/Users/indragandi/Developer/SIP SISTEM INFORMASI POSYANDU/web/EXCEL/REKAP DESA/KEC PEKALONGAN/TULUS REJO.xlsx';

try {
  const workbook = XLSX.readFile(filePath);
  
  for (const sheetName of ['KESEHATAN SIP 6', 'KESEHATAN SIP 7']) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    console.log(`\n=== Year markers in ${sheetName} ===`);
    rows.forEach((row, i) => {
      const rowStr = row.join(' | ');
      if (rowStr.includes('TAHUN :') || rowStr.includes('Tahun :') || rowStr.includes('TAHUN  :') || rowStr.includes('Tahun  :')) {
        console.log(`Row ${i + 1}:`, row.slice(0, 5).join(' | '));
      }
    });
  }
} catch (error) {
  console.error(error);
}
