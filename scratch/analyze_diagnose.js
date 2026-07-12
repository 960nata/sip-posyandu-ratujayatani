const fs = require('fs');

const data = JSON.parse(fs.readFileSync('/Users/indragandi/Developer/SIP SISTEM INFORMASI POSYANDU/web/scratch/diagnose_output.json', 'utf8'));

let missingSheets = [];
let fuzzySheets = [];
let missingNumRow = {};
let uniqueColHeaders = {};

for (const [file, details] of Object.entries(data)) {
  if (details.issues && details.issues.length > 0) {
    details.issues.forEach(iss => {
      if (iss.startsWith('Missing sheet:')) {
        missingSheets.push(`${file} -> ${iss}`);
      } else if (iss.startsWith('Fuzzy sheet match:')) {
        fuzzySheets.push(`${file} -> ${iss}`);
      }
    });
  }
  
  if (details.services) {
    for (const [sName, sDetails] of Object.entries(details.services)) {
      if (sDetails.numRowIndex === -1) {
        if (!missingNumRow[sName]) missingNumRow[sName] = [];
        missingNumRow[sName].push(file);
      } else {
        if (!uniqueColHeaders[sName]) uniqueColHeaders[sName] = new Set();
        // convert numRowValues to string for unique checking
        if (sDetails.numRowValues) {
          const headerStr = sDetails.numRowValues.map(v => v === null || v === undefined ? '' : String(v).trim()).join('|');
          uniqueColHeaders[sName].add(headerStr);
        }
      }
    }
  }
}

console.log(`=== DIAGNOSIS SUMMARY ===`);
console.log(`Total files inspected: ${Object.keys(data).length}`);
console.log(`\nFiles with missing sheets: ${missingSheets.length}`);
if (missingSheets.length > 0) {
  console.log(missingSheets.slice(0, 10).join('\n'));
  if (missingSheets.length > 10) console.log('...and ' + (missingSheets.length - 10) + ' more');
}

console.log(`\nFiles with fuzzy sheet matches: ${fuzzySheets.length}`);
if (fuzzySheets.length > 0) {
  console.log(fuzzySheets.slice(0, 10).join('\n'));
}

console.log(`\nMissing numbering row (1, 2, 3...) count:`);
for (const [sName, list] of Object.entries(missingNumRow)) {
  console.log(`  - ${sName}: ${list.length} files`);
  if (list.length > 0) {
    console.log(`    e.g.: ${list.slice(0, 5).join(', ')}`);
  }
}

console.log(`\nUnique column layouts per sheet (where numbering row was found):`);
for (const [sName, headers] of Object.entries(uniqueColHeaders)) {
  console.log(`  - ${sName}: ${headers.size} unique layout(s)`);
  Array.from(headers).forEach((h, idx) => {
    console.log(`    Layout ${idx + 1}: ${h}`);
  });
}
