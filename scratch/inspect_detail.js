const XLSX = require('xlsx');

const filePath = '/Users/indragandi/Developer/SIP SISTEM INFORMASI POSYANDU/web/EXCEL/REKAP DESA/KEC PEKALONGAN/TULUS REJO.xlsx';

try {
  const workbook = XLSX.readFile(filePath);
  
  for (const name of ['KESEHATAN SIP 6', 'KESEHATAN SIP 7']) {
    const sheet = workbook.Sheets[name];
    console.log(`\n=== Inspeksi Sheet ${name} ===`);
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    // Find rows containing "TAHUN" or numbers like 2025 or 2026
    rows.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell && (String(cell).includes('TAHUN') || String(cell) === '2025' || String(cell) === '2026')) {
          console.log(`Row ${i + 1}, Col ${j + 1}: "${cell}" | Konteks:`, row.slice(0, 5).join(' | '));
        }
      });
    });
  }
} catch (error) {
  console.error(error);
}
