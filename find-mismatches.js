const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

function normalizeName(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

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

// Mappings for normalization
function getNormalizedKec(folderName) {
  let norm = normalizeName(folderName).replace(/^kec/, '').trim();
  if (norm === 'brajaselebah') return 'brajaslebah';
  return norm;
}

function getNormalizedDesa(fileName) {
  let norm = normalizeName(fileName);
  if (norm === 'balekencono') return 'balaikencono';
  if (norm === 'gedungdalam') return 'gedungdalem';
  return norm;
}

async function main() {
  const rekapDesaDir = path.join(__dirname, 'EXCEL/REKAP DESA');
  const excelFiles = scanDir(rekapDesaDir);
  const allDesas = await prisma.desa.findMany({ include: { kecamatan: true } });
  
  const unmatched = [];
  
  for (const file of excelFiles) {
    const fileName = path.basename(file, '.xlsx').trim();
    const parentFolder = path.basename(path.dirname(file));
    
    const normKec = getNormalizedKec(parentFolder);
    const normDesa = getNormalizedDesa(fileName);
    
    const match = allDesas.find(d => {
      return normalizeName(d.nama) === normDesa && normalizeName(d.kecamatan.nama) === normKec;
    });
    
    if (!match) {
      unmatched.push({
        file: file,
        fileName: fileName,
        parentFolder: parentFolder,
        normDesa: normDesa,
        normKec: normKec
      });
    }
  }
  
  console.log(`Total files: ${excelFiles.length}`);
  console.log(`Unmatched files: ${unmatched.length}`);
  if (unmatched.length > 0) {
    console.log("Unmatched details:");
    unmatched.forEach(u => {
      console.log(`- File: "${u.fileName}" in folder "${u.parentFolder}" (normDesa: "${u.normDesa}", normKec: "${u.normKec}")`);
    });
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
