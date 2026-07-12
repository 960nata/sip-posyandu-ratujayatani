// ============================================================
// SEED: Posyandu "REKAP DESA <NAMA>" per desa (tahun 2025)
// ------------------------------------------------------------
// Membuat 1 posyandu khusus bernama "REKAP DESA <NAMA DESA>" untuk
// setiap file Excel di EXCEL/REKAP DESA, lalu meng-import SELURUH isi
// file (SIP 6, SIP 7, PENDIDIKAN, PU, PR, TRANTIB, SOSIAL) ke posyandu
// tersebut sebagai data TAHUN 2025.
//
// Idempotent: setiap kali dijalankan, semua posyandu "REKAP DESA ..."
// beserta anak datanya dihapus dulu, jadi tidak pernah dobel. Script
// ini TIDAK menyentuh posyandu asli maupun data tahun lain.
// ============================================================
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

const YEAR = 2025;
const REKAP_PREFIX = 'REKAP DESA';
const DRY_RUN = process.env.DRY_RUN === '1';

const createId = (() => {
  let counter = 0;
  return () => {
    counter++;
    const rand = Math.floor(Math.random() * 10000).toString(36).padStart(3, '0');
    return 'rkp' + Date.now().toString(36) + counter.toString(36).padStart(4, '0') + rand;
  };
})();

function normalizeName(str) {
  if (!str) return '';
  return String(str).toLowerCase().replace(/[^a-z0-9]/g, '');
}

function getNormalizedKec(folderName) {
  let norm = normalizeName(folderName).replace(/^kec/, '').trim();
  if (norm === 'brajaselebah') return 'brajaslebah';
  return norm;
}

function getNormalizedDesa(fileName) {
  let norm = normalizeName(fileName);
  if (norm.startsWith('salinandari')) norm = norm.replace('salinandari', '');
  const corrections = {
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
  return corrections[norm] || norm;
}

function parseExcelDate(val) {
  if (val === undefined || val === null || val === '') return new Date(YEAR, 0, 1);
  if (typeof val === 'number') return new Date((val - 25569) * 86400 * 1000);
  const str = String(val).trim();
  if (!str) return new Date(YEAR, 0, 1);
  const parts = str.split(/[\/\-\s]+/);
  if (parts.length === 3) {
    let day = parseInt(parts[0]);
    let month = parts[1];
    let year = parseInt(parts[2]);
    const monthsIndo = {
      januari: 0, jan: 0, februari: 1, febuari: 1, feb: 1, maret: 2, mar: 2,
      april: 3, apr: 3, mei: 4, juni: 5, jun: 5, juli: 6, jul: 6,
      agustus: 7, agt: 7, agu: 7, september: 8, sep: 8, oktober: 9, okt: 9,
      november: 10, nov: 10, desember: 11, des: 11,
    };
    if (isNaN(month)) {
      const nm = month.toLowerCase();
      month = monthsIndo[nm] !== undefined ? monthsIndo[nm] : 0;
    } else {
      month = parseInt(month) - 1;
    }
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      if (year < 100) year += 2000;
      if (year > 2100) year = YEAR;
      if (day > 31) day = 1;
      return new Date(year, month, day);
    }
  }
  const parsed = Date.parse(str);
  return isNaN(parsed) ? new Date(YEAR, 0, 1) : new Date(parsed);
}

function parseIntSafe(val) {
  if (val === undefined || val === null || val === '') return 0;
  const num = parseInt(val);
  return isNaN(num) ? 0 : num;
}

function scanDir(dir) {
  let results = [];
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) results = results.concat(scanDir(filePath));
    else if (file.endsWith('.xlsx') && !file.startsWith('~$')) results.push(filePath);
  }
  return results;
}

async function runInBatches(items, batchSize, fn) {
  for (let i = 0; i < items.length; i += batchSize) {
    await Promise.all(items.slice(i, i + batchSize).map(fn));
  }
}

// Bangun peta kolom SIP6/SIP7 dari baris nomor (1,2,3,...) di header.
function buildColMap(rows, maxCol) {
  let numRowIndex = -1;
  for (let r = 5; r <= 15; r++) {
    if (rows[r] && String(rows[r][0]).trim() === '1' && String(rows[r][1]).trim() === '2' && String(rows[r][2]).trim() === '3') {
      numRowIndex = r;
      break;
    }
  }
  const colMap = {};
  if (numRowIndex !== -1) {
    for (let c = 0; c < rows[numRowIndex].length; c++) {
      const val = parseIntSafe(rows[numRowIndex][c]);
      if (val > 0) colMap[val] = c;
    }
  } else {
    for (let i = 0; i <= maxCol; i++) colMap[i] = i - 1;
  }
  return { colMap, numRowIndex };
}

const MONTHS_MAP = {
  JANUARI: 1, FEBRUARI: 2, MARET: 3, APRIL: 4, MEI: 5, JUNI: 6,
  JULI: 7, AGUSTUS: 8, SEPTEMBER: 9, OKTOBER: 10, NOVEMBER: 11, DESEMBER: 12,
};

async function main() {
  console.log('--- SEED REKAP DESA POSYANDU (tahun ' + YEAR + ') ---');

  const rekapDesaDir = path.join(__dirname, '../EXCEL/REKAP DESA');
  if (!fs.existsSync(rekapDesaDir)) {
    console.error('Directory not found: ' + rekapDesaDir);
    process.exit(1);
  }

  // 1. CLEANUP idempotent — hanya menyentuh posyandu "REKAP DESA ..."
  console.log('Membersihkan posyandu REKAP DESA lama (jika ada)...');
  const oldRekap = await prisma.posyandu.findMany({
    where: { nama: { startsWith: REKAP_PREFIX } },
    select: { id: true },
  });
  const oldIds = oldRekap.map((p) => p.id);
  if (DRY_RUN) {
    console.log('  [DRY RUN] Akan menghapus ' + oldIds.length + ' posyandu REKAP DESA lama (dilewati).');
  } else if (oldIds.length > 0) {
    await prisma.sip6Bulanan.deleteMany({ where: { posyanduId: { in: oldIds } } });
    await prisma.sip7Bulanan.deleteMany({ where: { posyanduId: { in: oldIds } } });
    await prisma.laporanPengaduan.deleteMany({ where: { posyanduId: { in: oldIds } } });
    await prisma.laporanPR.deleteMany({ where: { posyanduId: { in: oldIds } } });
    await prisma.posyandu.deleteMany({ where: { id: { in: oldIds } } });
    console.log('  Dihapus ' + oldIds.length + ' posyandu REKAP DESA lama + anak datanya.');
  }

  const excelFiles = scanDir(rekapDesaDir);
  console.log('Menemukan ' + excelFiles.length + ' file Excel.');

  const allKecamatans = await prisma.kecamatan.findMany();
  const allDesas = await prisma.desa.findMany({ include: { kecamatan: true } });
  console.log('Loaded ' + allDesas.length + ' desa dari DB.');

  const posyanduCreates = [];
  const sip6ToCreate = [];
  const sip7ToCreate = [];
  const reportsToCreate = [];
  const prToCreate = [];

  let matched = 0;
  let unmatched = 0;
  const unmatchedFiles = [];
  const seenDesaIds = new Set(); // dedupe: 1 posyandu REKAP per desa
  const duplicateFiles = [];

  for (const file of excelFiles) {
    const fileName = path.basename(file, '.xlsx').trim();
    const parentFolder = path.basename(path.dirname(file));
    const normDesa = getNormalizedDesa(fileName);
    const normKec = getNormalizedKec(parentFolder);

    const desa = allDesas.find(
      (d) => normalizeName(d.nama) === normDesa && getNormalizedKec(d.kecamatan.nama) === normKec
    );
    if (!desa) {
      unmatched++;
      unmatchedFiles.push(parentFolder + '/' + fileName);
      continue;
    }
    if (seenDesaIds.has(desa.id)) {
      duplicateFiles.push(parentFolder + '/' + fileName + ' -> ' + desa.nama);
      continue;
    }
    seenDesaIds.add(desa.id);

    let workbook;
    try {
      workbook = XLSX.readFile(file);
    } catch (err) {
      console.error('ERROR baca file ' + file + ': ' + err.message);
      unmatched++;
      unmatchedFiles.push(parentFolder + '/' + fileName + ' (read error)');
      continue;
    }

    // Profil posyandu REKAP DESA = penjumlahan seluruh baris DATABASE
    const profile = {
      jumlahRumah: 0, jumlahKK: 0, jumlahPenduduk: 0, jumlahAnak05: 0,
      jumlahRemaja: 0, jumlahProduktif: 0, jumlahLansia: 0, jumlahDisabilitas: 0,
      jumlahKader: 0, danaSehatter: false,
    };
    const dbSheet = workbook.Sheets['DATABASE'];
    if (dbSheet) {
      const rows = XLSX.utils.sheet_to_json(dbSheet, { header: 1 });
      for (let i = 5; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[1] || String(row[1]).trim() === '') continue;
        profile.jumlahRumah += parseIntSafe(row[3]);
        profile.jumlahKK += parseIntSafe(row[4]);
        profile.jumlahPenduduk += parseIntSafe(row[5]);
        profile.jumlahAnak05 += parseIntSafe(row[6]);
        profile.jumlahRemaja += parseIntSafe(row[7]);
        profile.jumlahProduktif += parseIntSafe(row[8]);
        profile.jumlahLansia += parseIntSafe(row[9]);
        profile.jumlahDisabilitas += parseIntSafe(row[10]);
        profile.jumlahKader += parseIntSafe(row[15]);
        if (row[13] && String(row[13]).trim() !== '') profile.danaSehatter = true;
      }
    }

    const posyanduId = createId();
    posyanduCreates.push({
      id: posyanduId,
      desaId: desa.id,
      nama: REKAP_PREFIX + ' ' + desa.nama.toUpperCase() + ' ' + YEAR,
      hariBuka: '-',
      strata: 'MANDIRI',
      statusBangunan: 'MILIK_SENDIRI',
      kegiatanIntegrasi: 'Rekap gabungan seluruh posyandu desa (tahun ' + YEAR + ')',
      ...profile,
    });

    // ---- PENDIDIKAN ----
    const eduSheet = workbook.Sheets['PENDIDIKAN'];
    if (eduSheet) {
      const rows = XLSX.utils.sheet_to_json(eduSheet, { header: 1 });
      for (let i = 7; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[1] || String(row[1]).trim() === '') continue;
        const keteranganTL = row[7] ? String(row[7]).trim() : '';
        reportsToCreate.push({
          id: createId(), posyanduId, bidang: 'PENDIDIKAN',
          tanggal: parseExcelDate(row[1]),
          nik: row[3] ? String(row[3]).trim() : '',
          nama: row[4] ? String(row[4]).trim() : 'Tanpa Nama',
          alamat: row[5] ? String(row[5]).trim() : '',
          halPengaduan: row[6] ? String(row[6]).trim() : '',
          keteranganTL,
          keteranganBTL: row[8] ? String(row[8]).trim() : '',
          status: keteranganTL && keteranganTL !== '-' ? 'TL' : 'BTL',
          createdBy: 'SEEDER_REKAP',
        });
      }
    }

    // ---- PU ----
    const puSheet = workbook.Sheets['PU'];
    if (puSheet) {
      const rows = XLSX.utils.sheet_to_json(puSheet, { header: 1 });
      for (let i = 7; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[1] || String(row[1]).trim() === '') continue;
        const noSuratRT = row[3] ? String(row[3]).trim() : '';
        const keluhan = row[7] ? String(row[7]).trim() : '';
        const lokasi = row[8] ? String(row[8]).trim() : '';
        const keteranganTL = row[9] ? String(row[9]).trim() : '';
        reportsToCreate.push({
          id: createId(), posyanduId, bidang: 'PU',
          tanggal: parseExcelDate(row[1]),
          nik: row[5] ? String(row[5]).trim() : '',
          nama: row[4] ? String(row[4]).trim() : 'Tanpa Nama',
          alamat: row[6] ? String(row[6]).trim() : '',
          halPengaduan: noSuratRT + '|' + keluhan + '|' + lokasi,
          keteranganTL,
          keteranganBTL: row[10] ? String(row[10]).trim() : '',
          status: keteranganTL && keteranganTL !== '-' ? 'TL' : 'BTL',
          createdBy: 'SEEDER_REKAP',
        });
      }
    }

    // ---- PR ----
    const prSheet = workbook.Sheets['PR'];
    if (prSheet) {
      const rows = XLSX.utils.sheet_to_json(prSheet, { header: 1 });
      for (let i = 6; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[1] || String(row[1]).trim() === '') continue;
        const keteranganTL = row[11] ? String(row[11]).trim() : '';
        prToCreate.push({
          id: createId(), posyanduId,
          tanggal: parseExcelDate(row[1]),
          nama: row[3] ? String(row[3]).trim() : 'Tanpa Nama',
          nik: row[4] ? String(row[4]).trim() : '',
          alamat: row[5] ? String(row[5]).trim() : '',
          fcKK: !!(row[6] && String(row[6]).toLowerCase().includes('v')),
          fcKTP: !!(row[7] && String(row[7]).toLowerCase().includes('v')),
          suratPermohonan: !!(row[8] && String(row[8]).toLowerCase().includes('v')),
          suketPenghasilan: !!(row[9] && String(row[9]).toLowerCase().includes('v')),
          fotoKondisiRumah: !!(row[10] && String(row[10]).trim() !== ''),
          keteranganPermohonan: row[10] ? String(row[10]).trim() : 'Perumahan Rakyat',
          keteranganTL,
          keteranganBTL: row[12] ? String(row[12]).trim() : '',
          status: keteranganTL && keteranganTL !== '-' ? 'TL' : 'BTL',
        });
      }
    }

    // ---- TRANTIB LINMAS ----
    const trantibSheet = workbook.Sheets['TRANTIB LINMAS'];
    if (trantibSheet) {
      const rows = XLSX.utils.sheet_to_json(trantibSheet, { header: 1 });
      for (let i = 6; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[1] || String(row[1]).trim() === '') continue;
        const keteranganTL = row[7] ? String(row[7]).trim() : '';
        reportsToCreate.push({
          id: createId(), posyanduId, bidang: 'TRANTIB',
          tanggal: parseExcelDate(row[1]),
          nik: row[3] ? String(row[3]).trim() : '',
          nama: row[4] ? String(row[4]).trim() : 'Tanpa Nama',
          alamat: row[5] ? String(row[5]).trim() : '',
          halPengaduan: row[6] ? String(row[6]).trim() : '',
          keteranganTL,
          keteranganBTL: row[8] ? String(row[8]).trim() : '',
          status: keteranganTL && keteranganTL !== '-' ? 'TL' : 'BTL',
          createdBy: 'SEEDER_REKAP',
        });
      }
    }

    // ---- SOSIAL ----
    const sosSheet = workbook.Sheets['SOSIAL'];
    if (sosSheet) {
      const rows = XLSX.utils.sheet_to_json(sosSheet, { header: 1 });
      for (let i = 7; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[1] || String(row[1]).trim() === '') continue;
        const keteranganTL = row[7] ? String(row[7]).trim() : '';
        reportsToCreate.push({
          id: createId(), posyanduId, bidang: 'SOSIAL',
          tanggal: parseExcelDate(row[1]),
          nik: row[3] ? String(row[3]).trim() : '',
          nama: row[4] ? String(row[4]).trim() : 'Tanpa Nama',
          alamat: row[5] ? String(row[5]).trim() : '',
          halPengaduan: row[6] ? String(row[6]).trim() : '',
          keteranganTL,
          keteranganBTL: row[8] ? String(row[8]).trim() : '',
          status: keteranganTL && keteranganTL !== '-' ? 'TL' : 'BTL',
          createdBy: 'SEEDER_REKAP',
        });
      }
    }

    // ---- KESEHATAN SIP 6 (per bulan, level desa) ----
    const sip6Sheet = workbook.Sheets['KESEHATAN SIP 6'];
    if (sip6Sheet) {
      const rows = XLSX.utils.sheet_to_json(sip6Sheet, { header: 1 });
      const { colMap, numRowIndex } = buildColMap(rows, 37);
      const start = numRowIndex !== -1 ? numRowIndex + 1 : 9;
      const end = Math.min(numRowIndex !== -1 ? numRowIndex + 15 : 20, rows.length - 1);
      const seenBulan6 = new Set(); // ambil kemunculan pertama (tabel tahun utama)
      for (let i = start; i <= end; i++) {
        const row = rows[i];
        if (!row || !row[colMap[2]]) continue;
        const bulan = MONTHS_MAP[String(row[colMap[2]]).trim().toUpperCase()];
        if (!bulan || seenBulan6.has(bulan)) continue;
        seenBulan6.add(bulan);
        const rec = {
          bayiBaruL: parseIntSafe(row[colMap[3]]), bayiBaruP: parseIntSafe(row[colMap[4]]),
          bayiLamaL: parseIntSafe(row[colMap[5]]), bayiLamaP: parseIntSafe(row[colMap[6]]),
          balitaBaruL: parseIntSafe(row[colMap[7]]), balitaBaruP: parseIntSafe(row[colMap[8]]),
          balitaLamaL: parseIntSafe(row[colMap[9]]), balitaLamaP: parseIntSafe(row[colMap[10]]),
          anakBaruL: parseIntSafe(row[colMap[11]]), anakBaruP: parseIntSafe(row[colMap[12]]),
          anakLamaL: parseIntSafe(row[colMap[13]]), anakLamaP: parseIntSafe(row[colMap[14]]),
          prodBaruL: parseIntSafe(row[colMap[15]]), prodBaruP: parseIntSafe(row[colMap[16]]),
          prodLamaL: parseIntSafe(row[colMap[17]]), prodLamaP: parseIntSafe(row[colMap[18]]),
          lansiaBaruL: parseIntSafe(row[colMap[19]]), lansiaBaruP: parseIntSafe(row[colMap[20]]),
          lansiaLamaL: parseIntSafe(row[colMap[21]]), lansiaLamaP: parseIntSafe(row[colMap[22]]),
          wus: parseIntSafe(row[colMap[23]]), pus: parseIntSafe(row[colMap[24]]),
          ibuHamil: parseIntSafe(row[colMap[25]]), ibuMenyusui: parseIntSafe(row[colMap[26]]),
          kaderL: parseIntSafe(row[colMap[27]]), kaderP: parseIntSafe(row[colMap[28]]),
          plkbL: parseIntSafe(row[colMap[29]]), plkbP: parseIntSafe(row[colMap[30]]),
          medisL: parseIntSafe(row[colMap[31]]), medisP: parseIntSafe(row[colMap[32]]),
          lahirL: parseIntSafe(row[colMap[33]]), lahirP: parseIntSafe(row[colMap[34]]),
          meninggalL: parseIntSafe(row[colMap[35]]), meninggalP: parseIntSafe(row[colMap[36]]),
          keterangan: row[colMap[37]] ? String(row[colMap[37]]).trim() : '',
        };
        const total = Object.entries(rec).reduce((s, [k, v]) => s + (typeof v === 'number' ? v : 0), 0);
        if (total === 0) continue;
        sip6ToCreate.push({ id: createId(), posyanduId, tahun: YEAR, bulan, ...rec });
      }
    }

    // ---- KESEHATAN SIP 7 (per bulan, level desa) ----
    const sip7Sheet = workbook.Sheets['KESEHATAN SIP 7'];
    if (sip7Sheet) {
      const rows = XLSX.utils.sheet_to_json(sip7Sheet, { header: 1 });
      const { colMap, numRowIndex } = buildColMap(rows, 56);
      const start = numRowIndex !== -1 ? numRowIndex + 1 : 10;
      const end = Math.min(numRowIndex !== -1 ? numRowIndex + 15 : 21, rows.length - 1);
      const seenBulan7 = new Set(); // ambil kemunculan pertama (tabel tahun utama)
      for (let i = start; i <= end; i++) {
        const row = rows[i];
        if (!row || !row[colMap[2]]) continue;
        const bulan = MONTHS_MAP[String(row[colMap[2]]).trim().toUpperCase()];
        if (!bulan || seenBulan7.has(bulan)) continue;
        seenBulan7.add(bulan);
        const rec = {
          jmlBumil: parseIntSafe(row[colMap[3]]), bumilDiperiksa: parseIntSafe(row[colMap[4]]),
          bumilFeTab: parseIntSafe(row[colMap[5]]), jmlBusui: parseIntSafe(row[colMap[6]]),
          kbKondom: parseIntSafe(row[colMap[7]]), kbPil: parseIntSafe(row[colMap[8]]),
          kbImplant: parseIntSafe(row[colMap[9]]), kbMOP: parseIntSafe(row[colMap[10]]),
          kbMOW: parseIntSafe(row[colMap[11]]), kbIUD: parseIntSafe(row[colMap[12]]),
          kbSuntik: parseIntSafe(row[colMap[13]]), kbLainnya: parseIntSafe(row[colMap[14]]),
          balitaS_L: parseIntSafe(row[colMap[15]]), balitaS_P: parseIntSafe(row[colMap[16]]),
          balitaK_L: parseIntSafe(row[colMap[17]]), balitaK_P: parseIntSafe(row[colMap[18]]),
          balitaD_L: parseIntSafe(row[colMap[19]]), balitaD_P: parseIntSafe(row[colMap[20]]),
          balitaN_L: parseIntSafe(row[colMap[21]]), balitaN_P: parseIntSafe(row[colMap[22]]),
          vitA_L: parseIntSafe(row[colMap[23]]), vitA_P: parseIntSafe(row[colMap[24]]),
          pmt_L: parseIntSafe(row[colMap[25]]), pmt_P: parseIntSafe(row[colMap[26]]),
          imTT: parseIntSafe(row[colMap[27]]),
          imBCG_L: parseIntSafe(row[colMap[28]]), imBCG_P: parseIntSafe(row[colMap[29]]),
          imDPT1_L: parseIntSafe(row[colMap[30]]), imDPT1_P: parseIntSafe(row[colMap[31]]),
          imDPT2_L: parseIntSafe(row[colMap[32]]), imDPT2_P: parseIntSafe(row[colMap[33]]),
          imDPT3_L: parseIntSafe(row[colMap[34]]), imDPT3_P: parseIntSafe(row[colMap[35]]),
          imPolio1_L: parseIntSafe(row[colMap[36]]), imPolio1_P: parseIntSafe(row[colMap[37]]),
          imPolio2_L: parseIntSafe(row[colMap[38]]), imPolio2_P: parseIntSafe(row[colMap[39]]),
          imPolio3_L: parseIntSafe(row[colMap[40]]), imPolio3_P: parseIntSafe(row[colMap[41]]),
          imPolio4_L: parseIntSafe(row[colMap[42]]), imPolio4_P: parseIntSafe(row[colMap[43]]),
          imCampak_L: parseIntSafe(row[colMap[44]]), imCampak_P: parseIntSafe(row[colMap[45]]),
          imHepB1_L: parseIntSafe(row[colMap[46]]), imHepB1_P: parseIntSafe(row[colMap[47]]),
          imHepB2_L: parseIntSafe(row[colMap[48]]), imHepB2_P: parseIntSafe(row[colMap[49]]),
          imHepB3_L: parseIntSafe(row[colMap[50]]), imHepB3_P: parseIntSafe(row[colMap[51]]),
          diareJml_L: parseIntSafe(row[colMap[52]]), diareJml_P: parseIntSafe(row[colMap[53]]),
          diareOralit_L: parseIntSafe(row[colMap[54]]), diareOralit_P: parseIntSafe(row[colMap[55]]),
        };
        const total = Object.values(rec).reduce((s, v) => s + v, 0);
        if (total === 0) continue;
        sip7ToCreate.push({ id: createId(), posyanduId, tahun: YEAR, bulan, ...rec });
      }
    }

    matched++;
    if (matched % 30 === 0) console.log('  ...diproses ' + matched + ' desa');
  }

  console.log('\nDesa cocok: ' + matched + ' | Tidak cocok: ' + unmatched + ' | Duplikat (di-skip): ' + duplicateFiles.length);
  if (unmatchedFiles.length) {
    console.log('File tidak cocok (biasanya duplikat di subfolder SIP 2025):');
    unmatchedFiles.forEach((f) => console.log('  - ' + f));
  }
  if (duplicateFiles.length) {
    console.log('File duplikat desa (di-skip, sudah dibuatkan REKAP dari file lain):');
    duplicateFiles.forEach((f) => console.log('  - ' + f));
  }

  if (DRY_RUN) {
    console.log('\n[DRY RUN] Tidak menulis ke DB. Ringkasan yang AKAN dibuat:');
    console.log('  Posyandu REKAP DESA : ' + posyanduCreates.length);
    console.log('  SIP6 / SIP7 rows    : ' + sip6ToCreate.length + ' / ' + sip7ToCreate.length);
    console.log('  Pengaduan / PR rows : ' + reportsToCreate.length + ' / ' + prToCreate.length);
    const s = posyanduCreates[0];
    if (s) {
      console.log('\n  Contoh posyandu: "' + s.nama + '" | rumah=' + s.jumlahRumah + ' KK=' + s.jumlahKK + ' pdd=' + s.jumlahPenduduk + ' kader=' + s.jumlahKader);
      const s6 = sip6ToCreate.filter((r) => r.posyanduId === s.id);
      console.log('  SIP6 bulan utk contoh ini: ' + s6.map((r) => r.bulan).join(','));
      const s7 = sip7ToCreate.filter((r) => r.posyanduId === s.id);
      console.log('  SIP7 bulan utk contoh ini: ' + s7.map((r) => r.bulan).join(','));
    }
    return;
  }

  // INSERT
  console.log('\nInsert ' + posyanduCreates.length + ' posyandu REKAP DESA...');
  for (let i = 0; i < posyanduCreates.length; i += 100)
    await prisma.posyandu.createMany({ data: posyanduCreates.slice(i, i + 100) });

  console.log('Insert ' + sip6ToCreate.length + ' SIP6 + ' + sip7ToCreate.length + ' SIP7 ...');
  for (let i = 0; i < sip6ToCreate.length; i += 200)
    await prisma.sip6Bulanan.createMany({ data: sip6ToCreate.slice(i, i + 200), skipDuplicates: true });
  for (let i = 0; i < sip7ToCreate.length; i += 200)
    await prisma.sip7Bulanan.createMany({ data: sip7ToCreate.slice(i, i + 200), skipDuplicates: true });

  console.log('Insert ' + reportsToCreate.length + ' laporan pengaduan + ' + prToCreate.length + ' PR ...');
  for (let i = 0; i < reportsToCreate.length; i += 200)
    await prisma.laporanPengaduan.createMany({ data: reportsToCreate.slice(i, i + 200) });
  for (let i = 0; i < prToCreate.length; i += 200)
    await prisma.laporanPR.createMany({ data: prToCreate.slice(i, i + 200) });

  console.log('\n--- SELESAI ---');
  console.log('Posyandu REKAP DESA : ' + posyanduCreates.length);
  console.log('SIP6 / SIP7 rows    : ' + sip6ToCreate.length + ' / ' + sip7ToCreate.length);
  console.log('Pengaduan / PR rows : ' + reportsToCreate.length + ' / ' + prToCreate.length);
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
