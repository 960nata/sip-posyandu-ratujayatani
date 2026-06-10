const XLSX = require('xlsx');
const path = require('path');

const filePath = '/Users/indragandi/Developer/SIP SISTEM INFORMASI POSYANDU/web/EXCEL/REKAP DESA/KEC PEKALONGAN/TULUS REJO.xlsx';

try {
  const workbook = XLSX.readFile(filePath);
  console.log('Sheets in workbook:', workbook.SheetNames);
  
  // Let's print the first few rows of each sheet to understand what is in there
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:C10');
    console.log(`\nSheet: "${sheetName}", Range: ${sheet['!ref']}`);
    
    // Print first 50 rows for KESEHATAN SIP 6
    if (sheetName.startsWith('KESEHATAN')) {
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, range: { s: { c: 0, r: 0 }, e: { c: 35, r: 50 } } });
      console.log('Sample rows (first 50):');
      rows.forEach((row, i) => {
        // Only print if there is some content in the row
        if (row.some(v => v !== null && v !== '')) {
          console.log(`Row ${i + 1}:`, row.map(v => v !== undefined && v !== null ? String(v).substring(0, 20) : '').slice(0, 10).join(' | '));
        }
      });
    }
  }
} catch (error) {
  console.error('Error reading Excel:', error);
}
