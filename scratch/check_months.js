const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const rekapDesaDir = '/Users/indragandi/Developer/SIP SISTEM INFORMASI POSYANDU/web/EXCEL/REKAP DESA';

function scanDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(scanDir(filePath));
    } else if (file.endsWith('.xlsx') && !file.startsWith('~$')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = scanDir(rekapDesaDir);
const months = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];

const monthColsSip6 = {};
const monthColsSip7 = {};

files.forEach(file => {
  const relPath = path.relative(rekapDesaDir, file);
  try {
    const wb = XLSX.readFile(file);
    
    // Check KESEHATAN SIP 6
    const sheet6 = wb.Sheets['KESEHATAN SIP 6'];
    if (sheet6) {
      const rows = XLSX.utils.sheet_to_json(sheet6, { header: 1 });
      rows.forEach((row, rIdx) => {
        if (row) {
          row.forEach((cell, cIdx) => {
            if (cell && months.includes(String(cell).trim().toUpperCase())) {
              const key = cIdx;
              monthColsSip6[key] = (monthColsSip6[key] || 0) + 1;
            }
          });
        }
      });
    }

    // Check KESEHATAN SIP 7
    const sheet7 = wb.Sheets['KESEHATAN SIP 7'];
    if (sheet7) {
      const rows = XLSX.utils.sheet_to_json(sheet7, { header: 1 });
      rows.forEach((row, rIdx) => {
        if (row) {
          row.forEach((cell, cIdx) => {
            if (cell && months.includes(String(cell).trim().toUpperCase())) {
              const key = cIdx;
              monthColsSip7[key] = (monthColsSip7[key] || 0) + 1;
            }
          });
        }
      });
    }
  } catch (e) {}
});

console.log('SIP 6 month column index counts:', monthColsSip6);
console.log('SIP 7 month column index counts:', monthColsSip7);
