const fs = require('fs');

const data = JSON.parse(fs.readFileSync('/Users/indragandi/Developer/SIP SISTEM INFORMASI POSYANDU/web/scratch/diagnose_output.json', 'utf8'));

let filesWithMultipleHealthSheets = [];
let allUniqueSheetNames = new Set();

for (const [file, info] of Object.entries(data)) {
  if (info.sheets) {
    info.sheets.forEach(s => allUniqueSheetNames.add(s));
    const health6 = info.sheets.filter(s => s.toLowerCase().includes('sip 6') || s.toLowerCase().includes('sip6'));
    const health7 = info.sheets.filter(s => s.toLowerCase().includes('sip 7') || s.toLowerCase().includes('sip7'));
    if (health6.length > 1 || health7.length > 1) {
      filesWithMultipleHealthSheets.push({ file, health6, health7 });
    }
  }
}

console.log('Unique sheet names across all files:', Array.from(allUniqueSheetNames));
console.log('\nFiles with multiple health sheets:', filesWithMultipleHealthSheets);
