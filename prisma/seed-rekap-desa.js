const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Initialize Prisma Client using DIRECT_URL or DATABASE_URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

const { createId } = (() => {
  let counter = 0;
  return {
    createId: () => {
      counter++;
      const rand = Math.floor(Math.random() * 10000).toString(36).padStart(3, '0');
      return 'seed' + Date.now().toString(36) + counter.toString(36).padStart(4, '0') + rand;
    }
  };
})();

function normalizeName(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Custom spelling corrections & mappings
function getNormalizedKec(folderName) {
  let norm = normalizeName(folderName).replace(/^kec/, '').trim();
  if (norm === 'brajaselebah') return 'brajaslebah';
  return norm;
}

function getNormalizedDesa(fileName) {
  let norm = normalizeName(fileName);
  if (norm.startsWith('salinandari')) {
    norm = norm.replace('salinandari', '');
  }
  
  const corrections = {
    'balekencono': 'balaikencono',
    'balekencono': 'balaikencono',
    'gedungdalam': 'gedungdalem',
    'belilmbingsari': 'belimbingsari',
    'betengsari': 'bentengsari',
    'gunungdugihkecil': 'gunungsugihkecil',
    'sukarahayu': 'sukorahayu',
    'kebundamar': 'kebondamar',
    'margosari': 'margasari',
    'itikrendai': 'itikrenday',
    'tebing1': 'tebing',
    'tambahdadi': 'tamandadi',
    'tanjungintan': 'tanjunginten',
    'ruktisetdyo': 'ruktisedyo',
    'mekarmulya': 'mekarmulyo',
    'pugungrahardjo': 'pugungraharjo',
    'sumberjo': 'sumberejo',
    'terbanggimarga': 'terbangimarga',
    'totomulyo2026': 'totomulyo',
    'labuhanratu1': 'labuhanratui',
    
    // Roman numerals conversion
    'labuhanratu3': 'labuhanratuiii',
    'labuhanratu4': 'labuhanratuiv',
    'labuhanratu5': 'labuhanratuv',
    'labuhanratu6': 'labuhanratuvi',
    'labuhanratu7': 'labuhanratuvii',
    'labuhanratu8': 'labuhanratuviii',
    'labuhanratu9': 'labuhanratuix',
    'rajabasalama1': 'rajabasalamai',
    'rajabasalama2': 'rajabasalamaii',
    'putraaji1': 'putraajii',
    'putraaji2': 'putraajiii',
  };
  
  if (corrections[norm]) {
    return corrections[norm];
  }
  return norm;
}

function parseExcelDate(val) {
  if (val === undefined || val === null || val === '') return new Date();
  if (typeof val === 'number') {
    const date = new Date((val - 25569) * 86400 * 1000);
    return date;
  }
  const str = String(val).trim();
  if (!str) return new Date();
  
  const parts = str.split(/[\/\-\s]+/);
  if (parts.length === 3) {
    let day = parseInt(parts[0]);
    let month = parts[1];
    let year = parseInt(parts[2]);
    
    const monthsIndo = {
      'januari': 0, 'jan': 0,
      'februari': 1, 'febuari': 1, 'feb': 1,
      'maret': 2, 'mar': 2,
      'april': 3, 'apr': 3,
      'mei': 4,
      'juni': 5, 'jun': 5,
      'juli': 6, 'jul': 6,
      'agustus': 7, 'agt': 7, 'agu': 7,
      'september': 8, 'sep': 8,
      'oktober': 9, 'okt': 9,
      'november': 10, 'nov': 10,
      'desember': 11, 'des': 11
    };
    if (isNaN(month)) {
      const normMonth = month.toLowerCase();
      if (monthsIndo[normMonth] !== undefined) {
        month = monthsIndo[normMonth];
      } else {
        month = 0;
      }
    } else {
      month = parseInt(month) - 1;
    }
    
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      if (year < 100) year += 2000;
      if (year > 2100) year = 2026;
      if (day > 31) day = 1;
      return new Date(year, month, day);
    }
  }
  
  const parsed = Date.parse(str);
  if (!isNaN(parsed)) return new Date(parsed);
  return new Date();
}

function parseIntSafe(val) {
  if (val === undefined || val === null || val === '') return 0;
  const num = parseInt(val);
  return isNaN(num) ? 0 : num;
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

async function runInBatches(items, batchSize, fn) {
  for (let i = 0; i < items.length; i += batchSize) {
    const chunk = items.slice(i, i + batchSize);
    await Promise.all(chunk.map(item => fn(item)));
  }
}

async function main() {
  console.log('--- START OPTIMIZED SEEDING FROM REKAP DESA EXCEL FILES ---');
  
  const rekapDesaDir = path.join(__dirname, '../EXCEL/REKAP DESA');
  if (!fs.existsSync(rekapDesaDir)) {
    console.error(`Directory not found: ${rekapDesaDir}`);
    process.exit(1);
  }
  
  console.log('Cleaning existing seeded reports...');
  await prisma.laporanPengaduan.deleteMany({ where: { createdBy: 'SEEDER' } });
  await prisma.laporanPR.deleteMany({ where: { keteranganPermohonan: 'SEEDER' } });
  
  console.log('Cleaning existing health data (SIP 6 & 7) for years 2025 and 2026...');
  await prisma.sip6Bulanan.deleteMany({ where: { tahun: { in: [2025, 2026] } } });
  await prisma.sip7Bulanan.deleteMany({ where: { tahun: { in: [2025, 2026] } } });
  
  const excelFiles = scanDir(rekapDesaDir);
  console.log(`Found ${excelFiles.length} excel files to process.`);
  
  const allKecamatans = await prisma.kecamatan.findMany();
  const allDesas = await prisma.desa.findMany({ include: { kecamatan: true } });
  console.log(`Loaded ${allDesas.length} villages from DB.`);
  
  // Preload all Posyandus to optimize performance
  const allPosyandus = await prisma.posyandu.findMany();
  const posyandusByDesaId = {};
  for (const p of allPosyandus) {
    if (!posyandusByDesaId[p.desaId]) {
      posyandusByDesaId[p.desaId] = [];
    }
    posyandusByDesaId[p.desaId].push(p);
  }
  console.log(`Loaded ${allPosyandus.length} posyandus from DB.`);
  
  let successCount = 0;
  let failCount = 0;
  
  const sip6Map = new Map();
  const sip7Map = new Map();
  
  const posyanduUpdates = [];
  const posyanduCreates = [];
  
  const reportsToCreate = [];
  const prToCreate = [];
  
  for (const file of excelFiles) {
    const fileName = path.basename(file, '.xlsx').trim();
    const parentFolder = path.basename(path.dirname(file));
    
    // Determine year
    let year = 2026;
    if (file.includes('2025') || parentFolder.includes('2025')) {
      year = 2025;
    }
    
    const normDesa = getNormalizedDesa(fileName);
    let normKec = getNormalizedKec(parentFolder);
    if (file.includes('SIP 2025')) {
      const grandParent = path.basename(path.dirname(path.dirname(file)));
      normKec = getNormalizedKec(grandParent);
    }
    
    // Find matching Desa in DB
    let desa = allDesas.find(d => {
      return normalizeName(d.nama) === normDesa && getNormalizedKec(d.kecamatan.nama) === normKec;
    });
    
    // Auto-create missing Desa
    if (!desa) {
      const kecamatan = allKecamatans.find(k => getNormalizedKec(k.nama) === normKec);
      if (!kecamatan) {
        console.warn(`WARNING: Kecamatan not found in DB for folder: "${parentFolder}". Skipping file: "${fileName}"`);
        failCount++;
        continue;
      }
      
      const desasInKec = allDesas.filter(d => d.kecamatanId === kecamatan.id);
      const newDesaKode = `${kecamatan.kode}.${String(desasInKec.length + 1).padStart(2, '0')}`;
      
      console.log(`[AUTO-CREATE DESA] Creating missing Desa: "${fileName}" in Kecamatan: "${kecamatan.nama}" (Kode: ${newDesaKode})`);
      
      desa = await prisma.desa.create({
        data: {
          nama: fileName.replace(/_/g, '').trim(),
          kode: newDesaKode,
          kecamatanId: kecamatan.id
        },
        include: { kecamatan: true }
      });
      
      allDesas.push(desa);
      posyandusByDesaId[desa.id] = [];
    }
    
    let workbook;
    try {
      workbook = XLSX.readFile(file);
    } catch (err) {
      console.error(`ERROR: Failed to read file ${file}:`, err.message);
      failCount++;
      continue;
    }
    
    // Get existing posyandus for this Desa from memory
    let dbPosyandus = posyandusByDesaId[desa.id] || [];
    
    // 1. Process DATABASE Sheet (to get real Posyandu names and stats)
    const dbSheet = workbook.Sheets['DATABASE'];
    if (dbSheet) {
      const rows = XLSX.utils.sheet_to_json(dbSheet, { header: 1 });
      for (let i = 5; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[1] || String(row[1]).trim() === '') continue;
        
        const posyanduName = String(row[1]).trim();
        const normalizedPName = normalizeName(posyanduName);
        
        const hariBuka = row[2] ? String(row[2]).trim() : 'Tgl 10';
        const jumlahRumah = parseIntSafe(row[3]);
        const jumlahKK = parseIntSafe(row[4]);
        const jumlahPenduduk = parseIntSafe(row[5]);
        const jumlahAnak05 = parseIntSafe(row[6]);
        const jumlahRemaja = parseIntSafe(row[7]);
        const jumlahProduktif = parseIntSafe(row[8]);
        const jumlahLansia = parseIntSafe(row[9]);
        const jumlahDisabilitas = parseIntSafe(row[10]);
        
        let statusBangunan = 'MILIK_SENDIRI';
        if (row[12] && String(row[12]).trim() !== '') {
          statusBangunan = 'MENUMPANG';
        }
        
        let danaSehatter = false;
        if (row[13] && String(row[13]).trim() !== '') {
          danaSehatter = true;
        }
        
        const jumlahKader = parseIntSafe(row[15]);
        
        let existing = dbPosyandus.find(p => normalizeName(p.nama) === normalizedPName || p.nama.includes(posyanduName));
        if (existing) {
          posyanduUpdates.push({
            id: existing.id,
            data: {
              nama: posyanduName,
              hariBuka,
              jumlahRumah,
              jumlahKK,
              jumlahPenduduk,
              jumlahAnak05,
              jumlahRemaja,
              jumlahProduktif,
              jumlahLansia,
              jumlahDisabilitas,
              statusBangunan,
              danaSehatter,
              jumlahKader
            }
          });
          // Update in-memory copy
          Object.assign(existing, {
            nama: posyanduName,
            hariBuka,
            jumlahRumah,
            jumlahKK,
            jumlahPenduduk,
            jumlahAnak05,
            jumlahRemaja,
            jumlahProduktif,
            jumlahLansia,
            jumlahDisabilitas,
            statusBangunan,
            danaSehatter,
            jumlahKader
          });
        } else {
          const posyanduId = `posyandu-${desa.kode}-${Date.now().toString(36)}-${Math.floor(Math.random()*1000)}`;
          const newPosyandu = {
            id: posyanduId,
            desaId: desa.id,
            nama: posyanduName,
            hariBuka,
            strata: 'MANDIRI',
            jumlahRumah,
            jumlahKK,
            jumlahPenduduk,
            jumlahAnak05,
            jumlahRemaja,
            jumlahProduktif,
            jumlahLansia,
            jumlahDisabilitas,
            statusBangunan,
            danaSehatter,
            jumlahKader
          };
          posyanduCreates.push(newPosyandu);
          dbPosyandus.push(newPosyandu);
        }
      }
    }
    
    // If no posyandus found, auto-create a default one
    if (dbPosyandus.length === 0) {
      const posyanduId = `posyandu-${desa.kode}-${Date.now().toString(36)}-default`;
      const defaultPosyanduObj = {
        id: posyanduId,
        desaId: desa.id,
        nama: `Posyandu ${desa.nama} 1`,
        hariBuka: 'Tgl 10',
        strata: 'MANDIRI',
        statusBangunan: 'MILIK_SENDIRI',
        danaSehatter: false,
        jumlahKader: 5
      };
      posyanduCreates.push(defaultPosyanduObj);
      dbPosyandus.push(defaultPosyanduObj);
    }
    
    const defaultPosyandu = dbPosyandus[0];
    
    function findPosyanduId(name) {
      if (!name) return defaultPosyandu.id;
      const normalized = normalizeName(String(name));
      const found = dbPosyandus.find(p => normalizeName(p.nama) === normalized || normalizeName(p.nama).includes(normalized) || normalized.includes(normalizeName(p.nama)));
      return found ? found.id : defaultPosyandu.id;
    }
    
    // 2. Process PENDIDIKAN
    const eduSheet = workbook.Sheets['PENDIDIKAN'];
    if (eduSheet) {
      const rows = XLSX.utils.sheet_to_json(eduSheet, { header: 1 });
      for (let i = 7; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[1] || String(row[1]).trim() === '') continue;
        
        const tanggal = parseExcelDate(row[1]);
        const posyanduId = findPosyanduId(row[2]);
        const nik = row[3] ? String(row[3]).trim() : '';
        const nama = row[4] ? String(row[4]).trim() : 'Tanpa Nama';
        const alamat = row[5] ? String(row[5]).trim() : '';
        const halPengaduan = row[6] ? String(row[6]).trim() : '';
        const keteranganTL = row[7] ? String(row[7]).trim() : '';
        const keteranganBTL = row[8] ? String(row[8]).trim() : '';
        
        let status = 'BTL';
        if (keteranganTL && keteranganTL !== '-' && keteranganTL !== '') {
          status = 'TL';
        }
        
        reportsToCreate.push({
          id: createId(),
          posyanduId,
          bidang: 'PENDIDIKAN',
          tanggal,
          nik,
          nama,
          alamat,
          halPengaduan,
          keteranganTL,
          keteranganBTL,
          status,
          createdBy: 'SEEDER'
        });
      }
    }
    
    // 3. Process PU
    const puSheet = workbook.Sheets['PU'];
    if (puSheet) {
      const rows = XLSX.utils.sheet_to_json(puSheet, { header: 1 });
      for (let i = 7; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[1] || String(row[1]).trim() === '') continue;
        
        const tanggal = parseExcelDate(row[1]);
        const posyanduId = findPosyanduId(row[2]);
        const noSuratRT = row[3] ? String(row[3]).trim() : '';
        const nama = row[4] ? String(row[4]).trim() : 'Tanpa Nama';
        const nik = row[5] ? String(row[5]).trim() : '';
        const alamat = row[6] ? String(row[6]).trim() : '';
        const keluhan = row[7] ? String(row[7]).trim() : '';
        const lokasi = row[8] ? String(row[8]).trim() : '';
        const keteranganTL = row[9] ? String(row[9]).trim() : '';
        const keteranganBTL = row[10] ? String(row[10]).trim() : '';
        
        let status = 'BTL';
        if (keteranganTL && keteranganTL !== '-' && keteranganTL !== '') {
          status = 'TL';
        }
        
        reportsToCreate.push({
          id: createId(),
          posyanduId,
          bidang: 'PU',
          tanggal,
          nik,
          nama,
          alamat,
          halPengaduan: `Keluhan: ${keluhan} | Lokasi: ${lokasi} | No Surat RT: ${noSuratRT}`,
          keteranganTL,
          keteranganBTL,
          status,
          createdBy: 'SEEDER'
        });
      }
    }
    
    // 4. Process PR
    const prSheet = workbook.Sheets['PR'];
    if (prSheet) {
      const rows = XLSX.utils.sheet_to_json(prSheet, { header: 1 });
      for (let i = 6; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[1] || String(row[1]).trim() === '') continue;
        
        const tanggal = parseExcelDate(row[1]);
        const posyanduId = findPosyanduId(row[2]);
        const nama = row[3] ? String(row[3]).trim() : 'Tanpa Nama';
        const nik = row[4] ? String(row[4]).trim() : '';
        const alamat = row[5] ? String(row[5]).trim() : '';
        
        const fcKK = (row[6] && String(row[6]).toLowerCase().includes('v')) ? true : false;
        const fcKTP = (row[7] && String(row[7]).toLowerCase().includes('v')) ? true : false;
        const suratPermohonan = (row[8] && String(row[8]).toLowerCase().includes('v')) ? true : false;
        const suketPenghasilan = (row[9] && String(row[9]).toLowerCase().includes('v')) ? true : false;
        const fotoKondisiRumah = (row[10] && String(row[10]).toLowerCase().includes('v')) ? true : false;
        
        const keteranganTL = row[11] ? String(row[11]).trim() : '';
        const keteranganBTL = row[12] ? String(row[12]).trim() : '';
        
        let status = 'BTL';
        if (keteranganTL && keteranganTL !== '-' && keteranganTL !== '') {
          status = 'TL';
        }
        
        prToCreate.push({
          id: createId(),
          posyanduId,
          tanggal,
          nama,
          nik,
          alamat,
          fcKK,
          fcKTP,
          suratPermohonan,
          suketPenghasilan,
          fotoKondisiRumah,
          keteranganTL,
          keteranganBTL,
          status,
          keteranganPermohonan: 'SEEDER'
        });
      }
    }
    
    // 5. Process TRANTIB LINMAS
    const trantibSheet = workbook.Sheets['TRANTIB LINMAS'];
    if (trantibSheet) {
      const rows = XLSX.utils.sheet_to_json(trantibSheet, { header: 1 });
      for (let i = 6; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[1] || String(row[1]).trim() === '') continue;
        
        const tanggal = parseExcelDate(row[1]);
        const posyanduId = findPosyanduId(row[2]);
        const nik = row[3] ? String(row[3]).trim() : '';
        const nama = row[4] ? String(row[4]).trim() : 'Tanpa Nama';
        const alamat = row[5] ? String(row[5]).trim() : '';
        const halPengaduan = row[6] ? String(row[6]).trim() : '';
        const keteranganTL = row[7] ? String(row[7]).trim() : '';
        const keteranganBTL = row[8] ? String(row[8]).trim() : '';
        
        let status = 'BTL';
        if (keteranganTL && keteranganTL !== '-' && keteranganTL !== '') {
          status = 'TL';
        }
        
        reportsToCreate.push({
          id: createId(),
          posyanduId,
          bidang: 'TRANTIB',
          tanggal,
          nik,
          nama,
          alamat,
          halPengaduan,
          keteranganTL,
          keteranganBTL,
          status,
          createdBy: 'SEEDER'
        });
      }
    }
    
    // 6. Process SOSIAL
    const sosSheet = workbook.Sheets['SOSIAL'];
    if (sosSheet) {
      const rows = XLSX.utils.sheet_to_json(sosSheet, { header: 1 });
      for (let i = 7; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[1] || String(row[1]).trim() === '') continue;
        
        const tanggal = parseExcelDate(row[1]);
        const posyanduId = findPosyanduId(row[2]);
        const nik = row[3] ? String(row[3]).trim() : '';
        const nama = row[4] ? String(row[4]).trim() : 'Tanpa Nama';
        const alamat = row[5] ? String(row[5]).trim() : '';
        const halPengaduan = row[6] ? String(row[6]).trim() : '';
        const keteranganTL = row[7] ? String(row[7]).trim() : '';
        const keteranganBTL = row[8] ? String(row[8]).trim() : '';
        
        let status = 'BTL';
        if (keteranganTL && keteranganTL !== '-' && keteranganTL !== '') {
          status = 'TL';
        }
        
        reportsToCreate.push({
          id: createId(),
          posyanduId,
          bidang: 'SOSIAL',
          tanggal,
          nik,
          nama,
          alamat,
          halPengaduan,
          keteranganTL,
          keteranganBTL,
          status,
          createdBy: 'SEEDER'
        });
      }
    }
    
    // 7. Process KESEHATAN SIP 6 (visitor recap)
    const sip6Sheet = workbook.Sheets['KESEHATAN SIP 6'];
    if (sip6Sheet) {
      const rows = XLSX.utils.sheet_to_json(sip6Sheet, { header: 1 });
      const monthsMap = {
        'JANUARI': 1, 'FEBRUARI': 2, 'MARET': 3, 'APRIL': 4, 'MEI': 5, 'JUNI': 6,
        'JULI': 7, 'AGUSTUS': 8, 'SEPTEMBER': 9, 'OKTOBER': 10, 'NOVEMBER': 11, 'DESEMBER': 12
      };
      
      for (let i = 9; i <= 20; i++) {
        const row = rows[i];
        if (!row || !row[1]) continue;
        
        const monthName = String(row[1]).trim().toUpperCase();
        const bulan = monthsMap[monthName];
        if (!bulan) continue;
        
        const bayiBaruL = parseIntSafe(row[2]);
        const bayiBaruP = parseIntSafe(row[3]);
        const bayiLamaL = parseIntSafe(row[4]);
        const bayiLamaP = parseIntSafe(row[5]);
        const balitaBaruL = parseIntSafe(row[6]);
        const balitaBaruP = parseIntSafe(row[7]);
        const balitaLamaL = parseIntSafe(row[8]);
        const balitaLamaP = parseIntSafe(row[9]);
        const anakBaruL = parseIntSafe(row[10]);
        const anakBaruP = parseIntSafe(row[11]);
        const anakLamaL = parseIntSafe(row[12]);
        const anakLamaP = parseIntSafe(row[13]);
        const prodBaruL = parseIntSafe(row[14]);
        const prodBaruP = parseIntSafe(row[15]);
        const prodLamaL = parseIntSafe(row[16]);
        const prodLamaP = parseIntSafe(row[17]);
        const lansiaBaruL = parseIntSafe(row[18]);
        const lansiaBaruP = parseIntSafe(row[19]);
        const lansiaLamaL = parseIntSafe(row[20]);
        const lansiaLamaP = parseIntSafe(row[21]);
        
        const pus = parseIntSafe(row[22]);
        const ibuHamil = parseIntSafe(row[23]);
        const ibuMenyusui = parseIntSafe(row[24]);
        
        const kaderL = parseIntSafe(row[25]);
        const kaderP = parseIntSafe(row[26]);
        const plkbL = parseIntSafe(row[27]);
        const plkbP = parseIntSafe(row[28]);
        const medisL = parseIntSafe(row[29]);
        const medisP = parseIntSafe(row[30]);
        
        const lahirL = parseIntSafe(row[31]);
        const lahirP = parseIntSafe(row[32]);
        const meninggalL = parseIntSafe(row[33]);
        const meninggalP = parseIntSafe(row[34]);
        const keterangan = row[35] ? String(row[35]).trim() : '';
        
        const key = `${defaultPosyandu.id}_${year}_${bulan}`;
        sip6Map.set(key, {
          id: createId(),
          posyanduId: defaultPosyandu.id,
          tahun: year,
          bulan,
          bayiBaruL, bayiBaruP, bayiLamaL, bayiLamaP,
          balitaBaruL, balitaBaruP, balitaLamaL, balitaLamaP,
          anakBaruL, anakBaruP, anakLamaL, anakLamaP,
          prodBaruL, prodBaruP, prodLamaL, prodLamaP,
          lansiaBaruL, lansiaBaruP, lansiaLamaL, lansiaLamaP,
          pus, ibuHamil, ibuMenyusui,
          kaderL, kaderP, plkbL, plkbP, medisL, medisP,
          lahirL, lahirP, meninggalL, meninggalP, keterangan
        });
      }
    }
    
    // 8. Process KESEHATAN SIP 7 (activity recap)
    const sip7Sheet = workbook.Sheets['KESEHATAN SIP 7'];
    if (sip7Sheet) {
      const rows = XLSX.utils.sheet_to_json(sip7Sheet, { header: 1 });
      const monthsMap = {
        'JANUARI': 1, 'FEBRUARI': 2, 'MARET': 3, 'APRIL': 4, 'MEI': 5, 'JUNI': 6,
        'JULI': 7, 'AGUSTUS': 8, 'SEPTEMBER': 9, 'OKTOBER': 10, 'NOVEMBER': 11, 'DESEMBER': 12
      };
      
      for (let i = 10; i <= 21; i++) {
        const row = rows[i];
        if (!row || !row[1]) continue;
        
        const monthName = String(row[1]).trim().toUpperCase();
        const bulan = monthsMap[monthName];
        if (!bulan) continue;
        
        const jmlBumil = parseIntSafe(row[2]);
        const bumilDiperiksa = parseIntSafe(row[3]);
        const bumilFeTab = parseIntSafe(row[4]);
        const jmlBusui = parseIntSafe(row[5]);
        
        const kbKondom = parseIntSafe(row[6]);
        const kbPil = parseIntSafe(row[7]);
        const kbImplant = parseIntSafe(row[8]);
        const kbMOP = parseIntSafe(row[9]);
        const kbMOW = parseIntSafe(row[10]);
        const kbIUD = parseIntSafe(row[11]);
        const kbSuntik = parseIntSafe(row[12]);
        const kbLainnya = parseIntSafe(row[13]);
        
        const balitaS_L = parseIntSafe(row[14]);
        const balitaS_P = parseIntSafe(row[15]);
        const balitaK_L = parseIntSafe(row[16]);
        const balitaK_P = parseIntSafe(row[17]);
        const balitaD_L = parseIntSafe(row[18]);
        const balitaD_P = parseIntSafe(row[19]);
        const balitaN_L = parseIntSafe(row[20]);
        const balitaN_P = parseIntSafe(row[21]);
        const vitA_L = parseIntSafe(row[22]);
        const vitA_P = parseIntSafe(row[23]);
        const pmt_L = parseIntSafe(row[24]);
        const pmt_P = parseIntSafe(row[25]);
        
        const imTT = parseIntSafe(row[26]);
        
        const imBCG_L = parseIntSafe(row[27]);
        const imBCG_P = parseIntSafe(row[28]);
        const imDPT1_L = parseIntSafe(row[29]);
        const imDPT1_P = parseIntSafe(row[30]);
        const imDPT2_L = parseIntSafe(row[31]);
        const imDPT2_P = parseIntSafe(row[32]);
        const imDPT3_L = parseIntSafe(row[33]);
        const imDPT3_P = parseIntSafe(row[34]);
        const imPolio1_L = parseIntSafe(row[35]);
        const imPolio1_P = parseIntSafe(row[36]);
        const imPolio2_L = parseIntSafe(row[37]);
        const imPolio2_P = parseIntSafe(row[38]);
        const imPolio3_L = parseIntSafe(row[39]);
        const imPolio3_P = parseIntSafe(row[40]);
        const imPolio4_L = parseIntSafe(row[41]);
        const imPolio4_P = parseIntSafe(row[42]);
        const imCampak_L = parseIntSafe(row[43]);
        const imCampak_P = parseIntSafe(row[44]);
        const imHepB1_L = parseIntSafe(row[45]);
        const imHepB1_P = parseIntSafe(row[46]);
        const imHepB2_L = parseIntSafe(row[47]);
        const imHepB2_P = parseIntSafe(row[48]);
        const imHepB3_L = parseIntSafe(row[49]);
        const imHepB3_P = parseIntSafe(row[50]);
        
        const diareJml_L = parseIntSafe(row[51]);
        const diareJml_P = parseIntSafe(row[52]);
        const diareOralit_L = parseIntSafe(row[53]);
        const diareOralit_P = parseIntSafe(row[54]);
        
        const key = `${defaultPosyandu.id}_${year}_${bulan}`;
        sip7Map.set(key, {
          id: createId(),
          posyanduId: defaultPosyandu.id,
          tahun: year,
          bulan,
          jmlBumil, bumilDiperiksa, bumilFeTab, jmlBusui,
          kbKondom, kbPil, kbImplant, kbMOP, kbMOW, kbIUD, kbSuntik, kbLainnya,
          balitaS_L, balitaS_P, balitaK_L, balitaK_P, balitaD_L, balitaD_P, balitaN_L, balitaN_P,
          vitA_L, vitA_P, pmt_L, pmt_P, imTT,
          imBCG_L, imBCG_P, imDPT1_L, imDPT1_P, imDPT2_L, imDPT2_P, imDPT3_L, imDPT3_P,
          imPolio1_L, imPolio1_P, imPolio2_L, imPolio2_P, imPolio3_L, imPolio3_P, imPolio4_L, imPolio4_P,
          imCampak_L, imCampak_P, imHepB1_L, imHepB1_P, imHepB2_L, imHepB2_P, imHepB3_L, imHepB3_P,
          diareJml_L, diareJml_P, diareOralit_L, diareOralit_P
        });
      }
    }
    
    successCount++;
    if (successCount % 20 === 0 || successCount === excelFiles.length) {
      console.log(`Processed ${successCount}/${excelFiles.length} villages...`);
    }
  }
  
  // De-duplicate posyanduCreates by ID
  const uniqueCreatesMap = new Map();
  for (const p of posyanduCreates) {
    uniqueCreatesMap.set(p.id, p);
  }
  const uniqueCreates = Array.from(uniqueCreatesMap.values());

  // Filter out any Posyandu that already exists in DB
  const finalCreates = [];
  const dbPosyanduIds = new Set(allPosyandus.map(p => p.id));
  
  for (const p of uniqueCreates) {
    if (dbPosyanduIds.has(p.id)) {
      posyanduUpdates.push({
        id: p.id,
        data: {
          nama: p.nama,
          hariBuka: p.hariBuka,
          strata: p.strata,
          jumlahRumah: p.jumlahRumah,
          jumlahKK: p.jumlahKK,
          jumlahPenduduk: p.jumlahPenduduk,
          jumlahAnak05: p.jumlahAnak05,
          jumlahRemaja: p.jumlahRemaja,
          jumlahProduktif: p.jumlahProduktif,
          jumlahLansia: p.jumlahLansia,
          statusBangunan: p.statusBangunan,
          danaSehatter: p.danaSehatter,
          jumlahKader: p.jumlahKader
        }
      });
    } else {
      finalCreates.push(p);
      dbPosyanduIds.add(p.id);
    }
  }

  // 1. Bulk create new Posyandus
  if (finalCreates.length > 0) {
    console.log(`Creating ${finalCreates.length} new Posyandus...`);
    for (let i = 0; i < finalCreates.length; i += 100) {
      await prisma.posyandu.createMany({ data: finalCreates.slice(i, i + 100) });
    }
  }
  
  // 2. Bulk update existing Posyandus in batches
  if (posyanduUpdates.length > 0) {
    console.log(`Updating ${posyanduUpdates.length} existing Posyandus...`);
    await runInBatches(posyanduUpdates, 50, async (update) => {
      await prisma.posyandu.update({
        where: { id: update.id },
        data: update.data
      });
    });
  }
  
  // 3. Bulk insert LaporanPengaduan
  if (reportsToCreate.length > 0) {
    console.log(`Inserting ${reportsToCreate.length} Laporan Pengaduan records...`);
    for (let i = 0; i < reportsToCreate.length; i += 200) {
      await prisma.laporanPengaduan.createMany({ data: reportsToCreate.slice(i, i + 200) });
    }
  }
  
  // 4. Bulk insert LaporanPR
  if (prToCreate.length > 0) {
    console.log(`Inserting ${prToCreate.length} Laporan Perumahan Rakyat records...`);
    for (let i = 0; i < prToCreate.length; i += 200) {
      await prisma.laporanPR.createMany({ data: prToCreate.slice(i, i + 200) });
    }
  }
  
  // 5. Bulk insert SIP 6
  if (sip6Map.size > 0) {
    console.log(`Inserting ${sip6Map.size} SIP 6 bulanan records...`);
    const sip6Array = Array.from(sip6Map.values());
    for (let i = 0; i < sip6Array.length; i += 200) {
      await prisma.sip6Bulanan.createMany({ data: sip6Array.slice(i, i + 200) });
    }
  }
  
  // 6. Bulk insert SIP 7
  if (sip7Map.size > 0) {
    console.log(`Inserting ${sip7Map.size} SIP 7 bulanan records...`);
    const sip7Array = Array.from(sip7Map.values());
    for (let i = 0; i < sip7Array.length; i += 200) {
      await prisma.sip7Bulanan.createMany({ data: sip7Array.slice(i, i + 200) });
    }
  }
  
  console.log('--- SEEDING COMPLETED ---');
  console.log(`Success: ${successCount} villages`);
  console.log(`Failed/Skipped: ${failCount} files`);
}

main()
  .catch(e => {
    console.error('Fatal error during seed execution:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
