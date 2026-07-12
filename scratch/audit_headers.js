const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const rekapDesaDir = path.join(__dirname, '../EXCEL/REKAP DESA');

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
console.log(`Auditing ${files.length} files for structural differences...`);

let varianceSIP6 = new Set();
let varianceSIP7 = new Set();
let variancePU = new Set();

let sampleSIP6Cols = {};

// We will check just a few files to prove the point and find the headers
for (let i = 0; i < Math.min(files.length, 50); i++) {
  const file = files[i];
  try {
    const workbook = XLSX.readFile(file);
    
    // Check SIP 6
    const sip6 = workbook.Sheets['KESEHATAN SIP 6'];
    if (sip6) {
      const rows = XLSX.utils.sheet_to_json(sip6, { header: 1 });
      // Search for row containing "PUS"
      let pusIndex = -1;
      let hamilIndex = -1;
      let headerRow = -1;
      
      for(let r=0; r<15; r++) {
        if(!rows[r]) continue;
        for(let c=0; c<rows[r].length; c++) {
          const val = String(rows[r][c]).trim().toUpperCase();
          if (val === 'PUS') pusIndex = c;
          if (val === 'HAMIL') hamilIndex = c;
        }
        if (pusIndex !== -1) {
          headerRow = r;
          break;
        }
      }
      const signature = `PUS:${pusIndex}_HAMIL:${hamilIndex}`;
      varianceSIP6.add(signature);
      if(!sampleSIP6Cols[signature]) sampleSIP6Cols[signature] = file;
    }
    
    // Check PU
    const pu = workbook.Sheets['PU'];
    if (pu) {
      const rows = XLSX.utils.sheet_to_json(pu, { header: 1 });
      let tlIndex = -1;
      for(let r=0; r<10; r++) {
         if(!rows[r]) continue;
         for(let c=0; c<rows[r].length; c++) {
           const val = String(rows[r][c]).trim().toUpperCase();
           if(val === 'TL') {
             tlIndex = c;
             break;
           }
         }
         if (tlIndex !== -1) break;
      }
      variancePU.add(`TL:${tlIndex}`);
    }
    
  } catch(e) {
    // Ignore read errors for now
  }
}

console.log('SIP 6 Variances (PUS_index, HAMIL_index):', Array.from(varianceSIP6));
console.log('Sample files per variance:');
for (const [sig, file] of Object.entries(sampleSIP6Cols)) {
  console.log(`  ${sig} -> ${path.basename(file)}`);
}

console.log('PU Variances (TL_index):', Array.from(variancePU));
