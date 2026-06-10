const fs = require('fs');
const path = require('path');

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

const excelFiles = scanDir(rekapDesaDir);
console.log('Total Excel files found:', excelFiles.length);

const y2025 = excelFiles.filter(f => f.includes('2025'));
const y2026 = excelFiles.filter(f => !f.includes('2025'));

console.log('2025 files:', y2025.length);
console.log('2026 / main files:', y2026.length);

console.log('\nSome 2025 files:');
y2025.slice(0, 10).forEach(f => console.log(' -', f.replace(rekapDesaDir, '')));

console.log('\nSome 2026 files:');
y2026.slice(0, 10).forEach(f => console.log(' -', f.replace(rekapDesaDir, '')));
