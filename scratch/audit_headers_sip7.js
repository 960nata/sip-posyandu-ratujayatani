const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const rekapDesaDir = path.join(__dirname, '../EXCEL/REKAP DESA');
function scanDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      results = results.concat(scanDir(filePath));
    } else if (file.endsWith('.xlsx') && !file.startsWith('~$')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = scanDir(rekapDesaDir);
let varianceSIP7 = new Set();
let sip7Sample = {};

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  try {
    const workbook = XLSX.readFile(file);
    const sip7 = workbook.Sheets['KESEHATAN SIP 7'];
    if (sip7) {
      const rows = XLSX.utils.sheet_to_json(sip7, { header: 1 });
      let pilIndex = -1;
      let ttIndex = -1;
      for(let r=0; r<15; r++) {
        if(!rows[r]) continue;
        for(let c=0; c<rows[r].length; c++) {
          const val = String(rows[r][c]).trim().toUpperCase();
          if (val === 'PIL') pilIndex = c;
          if (val === 'TT') ttIndex = c;
        }
      }
      const sig = `PIL:${pilIndex}_TT:${ttIndex}`;
      varianceSIP7.add(sig);
      if (!sip7Sample[sig]) sip7Sample[sig] = file;
    }
  } catch(e) { }
}

console.log('SIP 7 Variances:', Array.from(varianceSIP7));
console.log('Samples:', sip7Sample);
