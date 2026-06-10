const XLSX = require('xlsx');
console.time('read');
const wb = XLSX.readFile('/Users/indragandi/Developer/SIP SISTEM INFORMASI POSYANDU/web/EXCEL/REKAP DESA/KEC BANDAR SRIBHAWONO/ SRIBHAWONO.xlsx');
console.timeEnd('read');
console.log('Sheet names:', wb.SheetNames);
