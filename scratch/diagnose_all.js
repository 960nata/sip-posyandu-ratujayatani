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
console.log(`Found ${files.length} Excel files.`);

const sheetDetails = {};

files.forEach(file => {
  const relPath = path.relative(rekapDesaDir, file);
  try {
    const wb = XLSX.readFile(file);
    const sheets = wb.SheetNames;
    sheetDetails[relPath] = {
      sheets: sheets,
      issues: []
    };
    
    // Check key sheets
    const expectedSheets = ['DATABASE', 'PENDIDIKAN', 'PU', 'PR', 'TRANTIB LINMAS', 'SOSIAL', 'KESEHATAN SIP 6', 'KESEHATAN SIP 7'];
    expectedSheets.forEach(s => {
      if (!sheets.includes(s)) {
        // Look for fuzzy match
        const match = sheets.find(sh => sh.toLowerCase().replace(/[^a-z0-9]/g, '') === s.toLowerCase().replace(/[^a-z0-9]/g, ''));
        if (match) {
          sheetDetails[relPath].issues.push(`Fuzzy sheet match: "${s}" -> "${match}"`);
        } else {
          sheetDetails[relPath].issues.push(`Missing sheet: "${s}"`);
        }
      }
    });

    // Let's inspect the headers/numbering row of PENDIDIKAN, PU, PR, TRANTIB LINMAS, SOSIAL in this file
    const serviceSheets = ['PENDIDIKAN', 'PU', 'PR', 'TRANTIB LINMAS', 'SOSIAL', 'KESEHATAN SIP 6', 'KESEHATAN SIP 7'];
    sheetDetails[relPath].services = {};
    serviceSheets.forEach(sName => {
      const sheet = wb.Sheets[sName] || wb.Sheets[sheets.find(sh => sh.toLowerCase().replace(/[^a-z0-9]/g, '') === sName.toLowerCase().replace(/[^a-z0-9]/g, ''))];
      if (!sheet) return;
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      
      // Find numbering row
      let numRowIndex = -1;
      for (let r = 0; r < Math.min(20, rows.length); r++) {
        const row = rows[r];
        if (row && row.length > 2) {
          // Check if it's numbering row like 1, 2, 3...
          const has1 = row.some(cell => String(cell).trim() === '1');
          const has2 = row.some(cell => String(cell).trim() === '2');
          const has3 = row.some(cell => String(cell).trim() === '3');
          if (has1 && has2 && has3) {
            numRowIndex = r;
            break;
          }
        }
      }
      
      sheetDetails[relPath].services[sName] = {
        rowCount: rows.length,
        numRowIndex: numRowIndex,
        sampleRow: numRowIndex !== -1 && numRowIndex + 1 < rows.length ? rows[numRowIndex + 1] : null,
        numRowValues: numRowIndex !== -1 ? rows[numRowIndex].slice(0, 15) : null
      };
    });

  } catch (err) {
    console.error(`Error reading ${relPath}:`, err.message);
  }
});

// Let's write the output to a json file in scratch
fs.writeFileSync('/Users/indragandi/Developer/SIP SISTEM INFORMASI POSYANDU/web/scratch/diagnose_output.json', JSON.stringify(sheetDetails, null, 2));
console.log('Diagnosis completed. Written to scratch/diagnose_output.json');
